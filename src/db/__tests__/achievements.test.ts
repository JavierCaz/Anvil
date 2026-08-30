import type { SQLiteDatabase } from 'expo-sqlite';
import { computeAchievementProgress, getAchievementByKey } from '@/constants/achievements';
import {
  getWeightComparativeByKey,
  getWeightComparativesAtOrBelow,
} from '@/constants/weight-comparatives';
import { unlockWeightComparatives } from '@/db/achievements';
import type { WorkoutStats } from '@/db/workouts';

const STATS: WorkoutStats = {
  totalWorkouts: 5,
  totalVolumeKg: 2400,
  currentStreak: 3,
  prsThisMonth: 2,
  maxWeightKg: 90,
  consistencyStreakWeeks: 3,
};

/** Minimal fake SQLiteDatabase exposing the queries `unlockWeightComparatives` uses. */
function createMockDb(allRows: { key: string }[]) {
  return {
    getAllAsync: jest.fn(async () => allRows),
    runAsync: jest.fn(async () => ({ changes: 1 })),
  } as unknown as SQLiteDatabase;
}

describe('getWeightComparativesAtOrBelow', () => {
  it('returns every milestone at or below the weight, in ascending threshold order', () => {
    const reached = getWeightComparativesAtOrBelow(80).map((c) => c.key);
    expect(reached).toEqual(['comparative_watermelon', 'comparative_bicycle', 'comparative_adult']);
  });

  it('returns an empty list below the smallest threshold', () => {
    expect(getWeightComparativesAtOrBelow(4)).toEqual([]);
  });

  it('includes the threshold boundary itself', () => {
    const reached = getWeightComparativesAtOrBelow(100).map((c) => c.key);
    expect(reached).toContain('comparative_panda');
    expect(reached).not.toContain('comparative_motorcycle');
  });
});

describe('getWeightComparativeByKey', () => {
  it('looks up a milestone by key', () => {
    expect(getWeightComparativeByKey('comparative_watermelon')?.thresholdKg).toBe(5);
    expect(getWeightComparativeByKey('unknown_key')).toBeUndefined();
  });
});

describe('getAchievementByKey (milestones)', () => {
  it('normalizes a milestone into an AchievementDefinition with target = thresholdKg', () => {
    const definition = getAchievementByKey('comparative_panda');
    expect(definition).toEqual({
      key: 'comparative_panda',
      nameKey: 'achievements.comparatives.panda.name',
      descriptionKey: 'achievements.comparatives.panda.description',
      icon: '🐼',
      category: 'strength',
      metric: 'maxWeight',
      target: 100,
    });
  });
});

describe('computeAchievementProgress', () => {
  it('shows milestone progress as maxWeightKg over the threshold', () => {
    const progress = computeAchievementProgress('comparative_panda', STATS);
    expect(progress).toEqual({ current: 90, target: 100, progress: 0.9 });
  });

  it('caps progress at 1 once the threshold is reached', () => {
    const progress = computeAchievementProgress(
      'comparative_adult',
      { ...STATS, maxWeightKg: 150 }
    );
    expect(progress.progress).toBe(1);
  });

  it('computes tiered volume progress from totalVolumeKg', () => {
    expect(computeAchievementProgress('volume_10k', { ...STATS, totalVolumeKg: 5000 })).toEqual({
      current: 5000,
      target: 10000,
      progress: 0.5,
    });
  });

  it('computes experience progress from totalWorkouts', () => {
    expect(computeAchievementProgress('experience_50', STATS)).toEqual({
      current: 5,
      target: 50,
      progress: 0.1,
    });
  });

  it('computes consistency progress from consistencyStreakWeeks', () => {
    expect(computeAchievementProgress('consistency_4w', { ...STATS, consistencyStreakWeeks: 4 })).toEqual({
      current: 4,
      target: 4,
      progress: 1,
    });
  });

  it('reports zero for event-based special achievements', () => {
    expect(computeAchievementProgress('early_bird', STATS)).toEqual({
      current: 0,
      target: 0,
      progress: 0,
    });
  });
});

describe('unlockWeightComparatives', () => {
  it('unlocks every locked milestone at or below the weight and returns them', async () => {
    const db = createMockDb(
      getWeightComparativesAtOrBelow(80).map((c) => ({ key: c.key }))
    );

    const unlocked = await unlockWeightComparatives(db, 80);

    expect(unlocked.map((c) => c.key)).toEqual([
      'comparative_watermelon',
      'comparative_bicycle',
      'comparative_adult',
    ]);
    expect(db.runAsync).toHaveBeenCalledTimes(3);
  });

  it('is idempotent — already-unlocked milestones are not returned again', async () => {
    const db = createMockDb(
      getWeightComparativesAtOrBelow(20).map((c) => ({ key: c.key }))
    );
    await unlockWeightComparatives(db, 20);

    (db.getAllAsync as jest.Mock).mockResolvedValueOnce([]);
    const second = await unlockWeightComparatives(db, 20);

    expect(second).toEqual([]);
  });

  it('does nothing below the smallest threshold', async () => {
    const db = createMockDb([]);
    const unlocked = await unlockWeightComparatives(db, 0);
    expect(unlocked).toEqual([]);
    expect(db.getAllAsync).not.toHaveBeenCalled();
  });
});
