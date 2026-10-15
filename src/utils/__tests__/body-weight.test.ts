import type { BodyWeightGoal } from '@/store/body-weight-goal';
import {
  changeSinceFirstKg,
  computeBodyWeightStats,
  entriesInRange,
  formatBodyWeight,
  goalDirection,
  goalProgress,
  isGoalReached,
  isTowardGoal,
  isValidBodyWeightKg,
  longestDayStreak,
  movingAverage,
  parseWeightInput,
  recentChange,
  remainingToGoalKg,
  trendDirection,
  type BodyWeightEntry,
} from '@/utils/body-weight';
import { displayToKg } from '@/utils/weight';

const ENTRIES: BodyWeightEntry[] = [
  { day: '2026-10-01', weightKg: 82 },
  { day: '2026-10-02', weightKg: 81.6 },
  { day: '2026-10-03', weightKg: 81.8 },
  // gap: Oct 4–7
  { day: '2026-10-08', weightKg: 81 },
  { day: '2026-10-09', weightKg: 80.6 },
  { day: '2026-10-15', weightKg: 80 },
];

const LOSE: BodyWeightGoal = { targetKg: 75, startKg: 80, startDay: '2026-10-01' };
const GAIN: BodyWeightGoal = { targetKg: 85, startKg: 80, startDay: '2026-10-01' };

describe('parseWeightInput', () => {
  it('parses dot and comma decimals', () => {
    expect(parseWeightInput('80.5')).toBe(80.5);
    expect(parseWeightInput(' 80,5 ')).toBe(80.5);
  });

  it('rejects empty and non-numeric input', () => {
    expect(parseWeightInput('')).toBeNull();
    expect(parseWeightInput('abc')).toBeNull();
    expect(parseWeightInput('8o')).toBeNull();
  });
});

describe('units', () => {
  it('round-trips a value typed in lb exactly', () => {
    const kg = displayToKg(180, 'imperial');
    expect(formatBodyWeight(kg, 'imperial')).toBe('180.0');
  });

  it('always shows one decimal', () => {
    expect(formatBodyWeight(80, 'metric')).toBe('80.0');
    expect(formatBodyWeight(80, 'imperial')).toBe('176.4');
  });

  it('validates the input range in kg', () => {
    expect(isValidBodyWeightKg(80)).toBe(true);
    expect(isValidBodyWeightKg(7.8)).toBe(false);
    expect(isValidBodyWeightKg(780)).toBe(false);
    expect(isValidBodyWeightKg(NaN)).toBe(false);
  });
});

describe('movingAverage', () => {
  it('averages a trailing time window and skips gaps', () => {
    const averages = movingAverage(ENTRIES, 7);
    expect(averages[0]).toBe(82);
    expect(averages[1]).toBeCloseTo((82 + 81.6) / 2);
    // Oct 8 window = Oct 2..8 → excludes Oct 1.
    expect(averages[3]).toBeCloseTo((81.6 + 81.8 + 81) / 3);
    // Oct 15 window = Oct 9..15.
    expect(averages[5]).toBeCloseTo((80.6 + 80) / 2);
  });
});

describe('trendDirection', () => {
  it('treats small changes as stable', () => {
    expect(trendDirection(0.1)).toBe('stable');
    expect(trendDirection(-0.2)).toBe('stable');
    expect(trendDirection(0.3)).toBe('up');
    expect(trendDirection(-0.3)).toBe('down');
  });
});

describe('recentChange', () => {
  it('compares against the latest entry on or before the target day', () => {
    // Latest Oct 15; 7 days earlier = Oct 8.
    expect(recentChange(ENTRIES, 7)).toEqual({ deltaKg: -1, sinceDay: '2026-10-08' });
  });

  it('falls back to the first entry when history is shorter', () => {
    const recent = recentChange(ENTRIES.slice(0, 3), 7);
    expect(recent?.sinceDay).toBe('2026-10-01');
    expect(recent?.deltaKg).toBeCloseTo(-0.2);
  });

  it('needs at least two entries', () => {
    expect(recentChange(ENTRIES.slice(0, 1), 7)).toBeNull();
  });
});

describe('entriesInRange', () => {
  it('uses a half-open range', () => {
    expect(entriesInRange(ENTRIES, '2026-10-08', '2026-10-15').map((e) => e.day)).toEqual([
      '2026-10-08',
      '2026-10-09',
    ]);
    expect(entriesInRange(ENTRIES, null, null)).toHaveLength(ENTRIES.length);
  });
});

describe('goal', () => {
  it('infers the direction from the numbers', () => {
    expect(goalDirection(LOSE)).toBe('lose');
    expect(goalDirection(GAIN)).toBe('gain');
  });

  it('computes progress for losing and gaining, clamped', () => {
    expect(goalProgress(LOSE, 77.5)).toBeCloseTo(0.5);
    expect(goalProgress(GAIN, 82.5)).toBeCloseTo(0.5);
    expect(goalProgress(LOSE, 82)).toBe(0);
    expect(goalProgress(LOSE, 70)).toBe(1);
  });

  it('detects reaching the goal and what is left', () => {
    expect(isGoalReached(LOSE, 75)).toBe(true);
    expect(isGoalReached(LOSE, 75.1)).toBe(false);
    expect(isGoalReached(GAIN, 86)).toBe(true);
    expect(remainingToGoalKg(LOSE, 77)).toBeCloseTo(2);
    expect(remainingToGoalKg(LOSE, 74)).toBe(0);
  });

  it('colors changes only when they move toward the goal', () => {
    expect(isTowardGoal(-1, LOSE)).toBe(true);
    expect(isTowardGoal(1, LOSE)).toBe(false);
    expect(isTowardGoal(1, GAIN)).toBe(true);
    expect(isTowardGoal(-1, null)).toBe(false);
    expect(isTowardGoal(-0.1, LOSE)).toBe(false);
  });
});

describe('stats', () => {
  it('finds the longest consecutive-day streak', () => {
    expect(longestDayStreak(ENTRIES)).toBe(3);
    expect(longestDayStreak([])).toBe(0);
  });

  it('measures change since the first weigh-in', () => {
    expect(changeSinceFirstKg(ENTRIES)).toBeCloseTo(-2);
    expect(changeSinceFirstKg(ENTRIES.slice(0, 1))).toBe(0);
  });

  it('builds the achievement metrics', () => {
    expect(computeBodyWeightStats(ENTRIES, LOSE)).toEqual({
      weighInCount: 6,
      weighInStreakDays: 3,
      bodyChangeKg: expect.closeTo(2),
      bodyGoalPercent: 0,
    });
    expect(
      computeBodyWeightStats([...ENTRIES, { day: '2026-10-16', weightKg: 75 }], LOSE)
        .bodyGoalPercent
    ).toBe(100);
    expect(computeBodyWeightStats([], null).bodyGoalPercent).toBe(0);
  });
});
