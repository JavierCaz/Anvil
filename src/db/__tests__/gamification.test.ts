import type { SQLiteDatabase } from 'expo-sqlite';
import {
  detectAndRecordPRs,
  epley1RM,
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

    expect(recap.summary).toEqual({ durationSeconds: 0, totalVolumeKg: 0, setsCompleted: 0 });
    expect(recap.volumeDeltaPct).toBeNull();
    expect(recap.prs).toEqual([]);
    expect(recap.milestonesUnlocked).toEqual([]);
    expect(recap.consistency.weeklyGoal).toBe(3);
    expect(recap.achievementsUnlocked).toEqual([]);
    expect(recap.nextMilestone?.key).toBe('comparative_watermelon');
  });
});
