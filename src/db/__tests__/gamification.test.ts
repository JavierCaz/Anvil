import type { SQLiteDatabase } from 'expo-sqlite';
import {
  computeCardioPRs,
  detectAndRecordPRs,
  epley1RM,
  type CardioSetRow,
  getWorkoutRecap,
} from '@/db/gamification';
import { getWeeklyConsistency } from '@/db/stats';

describe('epley1RM', () => {
  it('estimates 1RM with the Epley formula', () => {
    expect(epley1RM(100, 10)).toBeCloseTo(133.33, 1);
    expect(epley1RM(80, 5)).toBeCloseTo(93.33, 1);
  });

  it('ignores sets with too many reps (not a strength signal)', () => {
    expect(epley1RM(100, 20)).toBeNull();
    expect(epley1RM(100, 13)).toBeNull();
  });

  it('ignores non-positive weight or reps', () => {
    expect(epley1RM(0, 10)).toBeNull();
    expect(epley1RM(100, 0)).toBeNull();
  });
});

describe('getWeeklyConsistency', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-30T10:00:00')); // Sunday → current week Mon 24 – Sun 30
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  function mockDb(days: string[]) {
    return {
      getAllAsync: jest.fn(async () => days.map((day) => ({ day }))),
    } as unknown as SQLiteDatabase;
  }

  it('counts distinct completed days this week', async () => {
    const consistency = await getWeeklyConsistency(
      mockDb(['2026-08-24', '2026-08-26', '2026-08-30']),
      3
    );
    expect(consistency.weeklyDays).toBe(3);
    expect(consistency.hitThisWeek).toBe(true);
    expect(consistency.weeklyGoal).toBe(3);
  });

  it('does not break the streak while the current week is still in progress', async () => {
    // Last week (Aug 17–23) fully hit, current week only 1 day so far.
    const consistency = await getWeeklyConsistency(
      mockDb(['2026-08-17', '2026-08-19', '2026-08-21', '2026-08-24']),
      3
    );
    expect(consistency.weeklyDays).toBe(1);
    expect(consistency.hitThisWeek).toBe(false);
    expect(consistency.consistencyStreakWeeks).toBe(1);
  });

  it('counts consecutive completed hit weeks', async () => {
    // Three fully-hit weeks before the current (in-progress, hit) week.
    const days = [
      '2026-08-03', '2026-08-05', '2026-08-07', // week 1
      '2026-08-10', '2026-08-12', '2026-08-14', // week 2
      '2026-08-17', '2026-08-19', '2026-08-21', // week 3
      '2026-08-24', '2026-08-26', '2026-08-30', // current week
    ];
    const consistency = await getWeeklyConsistency(mockDb(days), 3);
    expect(consistency.hitThisWeek).toBe(true);
    expect(consistency.consistencyStreakWeeks).toBe(4);
  });

  it('breaks the streak on a missed week', async () => {
    // Week 1 hit, week 2 empty, current week hit.
    const days = [
      '2026-08-03', '2026-08-05', '2026-08-07', // week 1
      '2026-08-24', '2026-08-26', '2026-08-30', // current week
    ];
    const consistency = await getWeeklyConsistency(mockDb(days), 3);
    expect(consistency.consistencyStreakWeeks).toBe(1);
  });

  it('disables the feature entirely when the goal is 0', async () => {
    const consistency = await getWeeklyConsistency(
      mockDb(['2026-08-24', '2026-08-26']),
      0
    );
    expect(consistency.hitThisWeek).toBe(false);
    expect(consistency.consistencyStreakWeeks).toBe(0);
  });
});

describe('detectAndRecordPRs', () => {
  function makeDb() {
    const runAsync = jest.fn(async () => ({ changes: 1 }));
    const db = {
      getAllAsync: jest.fn(async () => []),
      getFirstAsync: jest.fn(async () => null),
      runAsync,
    } as unknown as SQLiteDatabase;
    return { db, runAsync };
  }

  it('records a weight PR and a 1RM PR vs prior history, skipping the first session', async () => {
    const { db, runAsync } = makeDb();

    (db.getFirstAsync as jest.Mock).mockResolvedValueOnce({ id: 1, started_at: '2026-08-01T10:00:00Z', completed_at: '2026-08-01T10:30:00Z' });

    (db.getAllAsync as jest.Mock)
      .mockResolvedValueOnce([
        // session sets: Bench 100×5 (new weight + 1RM) and OHP 40×10
        { exercise_id: 1, exercise_name: 'Bench Press', weight: 100, reps: 5 },
        { exercise_id: 2, exercise_name: 'Overhead Press', weight: 40, reps: 10 },
      ])
      .mockResolvedValueOnce([
        // prior history: Bench best 90×5 (1RM 105), OHP best 50×3 (1RM 55)
        { exercise_id: 1, exercise_name: 'Bench Press', weight: 90, reps: 5 },
        { exercise_id: 2, exercise_name: 'Overhead Press', weight: 50, reps: 3 },
      ]);

    const prs = await detectAndRecordPRs(db, 1);

    // Bench 100×5 beats weight (90) and 1RM (116.67 vs 105) → 2 PRs.
    expect(prs).toHaveLength(2);
    expect(prs.map((p) => p.type).sort()).toEqual(['oneRM', 'weight']);
    expect(prs.every((p) => p.exerciseId === 1)).toBe(true);
    // Two inserts into personal_records.
    expect(runAsync).toHaveBeenCalledTimes(2);
  });

  it('skips exercises with no prior history (first-ever session is not a PR)', async () => {
    const { db } = makeDb();
    (db.getFirstAsync as jest.Mock).mockResolvedValueOnce({ id: 1, started_at: '2026-08-01T10:00:00Z', completed_at: '2026-08-01T10:30:00Z' });
    (db.getAllAsync as jest.Mock)
      .mockResolvedValueOnce([
        { exercise_id: 1, exercise_name: 'Bench Press', weight: 100, reps: 5 },
      ])
      .mockResolvedValueOnce([]); // no history

    const prs = await detectAndRecordPRs(db, 1);
    expect(prs).toEqual([]);
  });

  it('returns nothing for an unfinished workout', async () => {
    const { db } = makeDb();
    (db.getFirstAsync as jest.Mock).mockResolvedValueOnce({ id: 1, started_at: '2026-08-01T10:00:00Z', completed_at: null });
    const prs = await detectAndRecordPRs(db, 1);
    expect(prs).toEqual([]);
    expect(db.getAllAsync).not.toHaveBeenCalled();
  });
});

describe('getWorkoutRecap', () => {
  it('assembles a recap from the existing tables', async () => {
    const runAsync = jest.fn(async () => ({ changes: 1 }));
    const db = {
      getAllAsync: jest.fn(async () => []),
      getFirstAsync: jest.fn(async () => null),
      runAsync,
    } as unknown as SQLiteDatabase;

    // getWorkoutLog
    (db.getFirstAsync as jest.Mock).mockResolvedValueOnce({
      id: 7,
      routine_id: 3,
      started_at: '2026-08-01T10:00:00.000Z',
      completed_at: '2026-08-01T10:40:00.000Z',
    });

    const recap = await getWorkoutRecap(db, 7, 3);

    expect(recap.summary).toEqual({
      durationSeconds: 0,
      totalVolumeKg: 0,
      setsCompleted: 0,
      totalDistanceM: 0,
      timedSeconds: 0,
    });
    expect(recap.volumeDeltaPct).toBeNull();
    expect(recap.prs).toEqual([]);
    expect(recap.milestonesUnlocked).toEqual([]);
    expect(recap.consistency.weeklyGoal).toBe(3);
    expect(recap.achievementsUnlocked).toEqual([]);
    expect(recap.nextMilestone?.key).toBe('comparative_watermelon');
  });
});

describe('computeCardioPRs', () => {
  const run = (overrides: Partial<CardioSetRow>): CardioSetRow => ({
    exercise_id: 9,
    exercise_name: 'Running',
    exercise_type: 'distance_duration',
    duration_seconds: 1800,
    distance_m: 5000,
    ...overrides,
  });
  const plank = (seconds: number): CardioSetRow => ({
    exercise_id: 4,
    exercise_name: 'Plank',
    exercise_type: 'duration',
    duration_seconds: seconds,
    distance_m: null,
  });

  it('detects a longest-distance and a best-pace PR for cardio', () => {
    const prs = computeCardioPRs(
      [run({ distance_m: 6000, duration_seconds: 1800 })], // 5:00 /km
      [run({ distance_m: 5000, duration_seconds: 1800 })] // 6:00 /km
    );
    expect(prs.map((pr) => pr.type).sort()).toEqual(['distance', 'pace']);
    const distancePR = prs.find((pr) => pr.type === 'distance');
    expect(distancePR).toMatchObject({
      exerciseId: 9,
      weight: 0,
      reps: 0,
      distanceM: 6000,
      durationSeconds: 1800,
    });
  });

  it('detects a pace PR without a distance PR', () => {
    const prs = computeCardioPRs(
      [run({ distance_m: 5000, duration_seconds: 1500 })],
      [run({ distance_m: 10000, duration_seconds: 3600 })]
    );
    expect(prs.map((pr) => pr.type)).toEqual(['pace']);
  });

  it('ignores pace for sets under 1 km', () => {
    const prs = computeCardioPRs(
      [run({ distance_m: 400, duration_seconds: 60 })], // blazing 2:30 /km sprint
      [run({ distance_m: 5000, duration_seconds: 1800 })]
    );
    expect(prs).toEqual([]);
  });

  it('detects a longest-duration PR for holds', () => {
    const prs = computeCardioPRs([plank(30), plank(75)], [plank(60)]);
    expect(prs).toHaveLength(1);
    expect(prs[0]).toMatchObject({ type: 'duration', exerciseName: 'Plank', durationSeconds: 75 });
  });

  it('never counts the first session for an exercise as a PR', () => {
    expect(computeCardioPRs([run({}), plank(90)], [])).toEqual([]);
  });
});

describe('detectAndRecordPRs (cardio)', () => {
  it('records cardio PRs with their type, duration and distance', async () => {
    const runAsync = jest.fn(async () => ({ changes: 1 }));
    const db = {
      getAllAsync: jest.fn(async () => []),
      getFirstAsync: jest.fn(async () => null),
      runAsync,
    } as unknown as SQLiteDatabase;
    (db.getFirstAsync as jest.Mock).mockResolvedValueOnce({
      id: 1,
      started_at: '2026-08-01T10:00:00Z',
      completed_at: '2026-08-01T10:40:00Z',
    });
    (db.getAllAsync as jest.Mock)
      .mockResolvedValueOnce([]) // weight session sets — none
      .mockResolvedValueOnce([
        { exercise_id: 9, exercise_name: 'Running', exercise_type: 'distance_duration', duration_seconds: 2400, distance_m: 8000 },
      ])
      .mockResolvedValueOnce([
        { exercise_id: 9, exercise_name: 'Running', exercise_type: 'distance_duration', duration_seconds: 1800, distance_m: 5000 },
      ]);

    const prs = await detectAndRecordPRs(db, 1);

    // 8 km beats 5 km; 5:00 /km beats 6:00 /km.
    expect(prs.map((pr) => pr.type).sort()).toEqual(['distance', 'pace']);
    expect(runAsync).toHaveBeenCalledTimes(2);
    expect(runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO personal_records'),
      9,
      0,
      0,
      '2026-08-01T10:40:00Z',
      'distance',
      2400,
      8000
    );
  });
});

describe('detectAndRecordPRs (loaded carry)', () => {
  it('counts a heavier carry as a weight PR without a 1RM PR', async () => {
    const runAsync = jest.fn(async () => ({ changes: 1 }));
    const db = {
      getAllAsync: jest.fn(async () => []),
      getFirstAsync: jest.fn(async () => null),
      runAsync,
    } as unknown as SQLiteDatabase;
    (db.getFirstAsync as jest.Mock).mockResolvedValueOnce({
      id: 1,
      started_at: '2026-08-01T10:00:00Z',
      completed_at: '2026-08-01T10:40:00Z',
    });
    (db.getAllAsync as jest.Mock)
      // weight session sets: Farmer Carry 40 kg, 0 reps
      .mockResolvedValueOnce([{ exercise_id: 5, exercise_name: 'Farmer Carry', weight: 40, reps: 0 }])
      // weight history: 32 kg
      .mockResolvedValueOnce([{ exercise_id: 5, exercise_name: 'Farmer Carry', weight: 32, reps: 0 }]);
    // Cardio queries fall through to [] (no cardio PRs).

    const prs = await detectAndRecordPRs(db, 1);

    expect(prs).toHaveLength(1);
    expect(prs[0]).toMatchObject({ type: 'weight', weight: 40, reps: 0, oneRM: null });
  });
});
