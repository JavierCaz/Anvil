import type { SQLiteDatabase } from 'expo-sqlite';
import {
  computeAchievementProgress,
  computeExerciseAchievementProgress,
  EXERCISE_STAT_ACHIEVEMENTS,
  getAchievementByKey,
} from '@/constants/achievements';
import { getEarnedDistanceAchievements } from '@/constants/distance-achievements';
import {
  getWeightComparativeByKey,
  getWeightComparativesAtOrBelow,
} from '@/constants/weight-comparatives';
import {
  ACHIEVEMENT_SEED,
  reconcileExerciseAchievements,
  unlockDistanceAchievements,
  unlockWeightComparatives,
} from '@/db/achievements';
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
function createMockDb(alreadyUnlocked: { key: string }[]) {
  return {
    getAllAsync: jest.fn(async () => alreadyUnlocked),
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
      scope: 'exercise',
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
  it('unlocks every locked milestone at or below the weight for the exercise and returns them', async () => {
    const db = createMockDb([]);

    const unlocked = await unlockWeightComparatives(db, 7, 80);

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
    const unlocked = await unlockWeightComparatives(db, 7, 20);

    expect(unlocked).toEqual([]);
    expect(db.runAsync).not.toHaveBeenCalled();
  });

  it('does nothing below the smallest threshold', async () => {
    const db = createMockDb([]);
    const unlocked = await unlockWeightComparatives(db, 7, 0);
    expect(unlocked).toEqual([]);
    expect(db.getAllAsync).not.toHaveBeenCalled();
  });
});

describe('reconcileExerciseAchievements', () => {
  /** First query: max weight; second: live distance (best set + total, meters). */
  function mockDb(maxWeight: number, distance = { m: 0, t: 0 }) {
    return {
      getFirstAsync: jest
        .fn()
        .mockResolvedValueOnce({ m: maxWeight })
        .mockResolvedValueOnce(distance),
      runAsync: jest.fn(async () => ({ changes: 1 })),
    } as unknown as SQLiteDatabase;
  }

  it('revokes comparatives no longer backed by a completed set', async () => {
    const db = mockDb(50);
    await reconcileExerciseAchievements(db, 7);

    // supported = watermelon (5), bicycle (20); adult (70) is NOT reached at 50.
    const deleteCall = (db.runAsync as jest.Mock).mock.calls[0];
    const sql = deleteCall[0] as string;
    expect(sql).toContain('key LIKE ?');
    expect(sql).toContain('NOT IN');
    const params = deleteCall.slice(1);
    expect(params[0]).toBe(7);
    expect(params[1]).toBe('comparative_%');
    expect(params).toContain('comparative_watermelon');
    expect(params).toContain('comparative_bicycle');
    expect(params).not.toContain('comparative_adult');
  });

  it('revokes every comparative when no set qualifies', async () => {
    const db = mockDb(0);
    await reconcileExerciseAchievements(db, 7);

    const deleteCall = (db.runAsync as jest.Mock).mock.calls[0];
    const sql = deleteCall[0] as string;
    expect(sql).toContain('key LIKE ?');
    expect(sql).not.toContain('NOT IN');
    expect(deleteCall[1]).toBe(7);
    expect(deleteCall[2]).toBe('comparative_%');
  });

  it('computes max weight from completed sets of any workout (incl. in-progress)', async () => {
    const db = mockDb(100);
    await reconcileExerciseAchievements(db, 7);

    const query = (db.getFirstAsync as jest.Mock).mock.calls[0][0] as string;
    expect(query).toContain('MAX(s.weight)');
    expect(query).toContain('s.completed = 1');
    // Must not restrict to finished workouts: an active session's done sets count.
    expect(query).not.toContain('completed_at IS NOT NULL');
  });

  it('revokes distance milestones and landmarks no longer backed by completed sets', async () => {
    // Best set 6 km (5K only), 12 km cumulative (track → Central Park loop).
    const db = mockDb(0, { m: 6000, t: 12000 });
    await reconcileExerciseAchievements(db, 7);

    const calls = (db.runAsync as jest.Mock).mock.calls as unknown[][];
    const efforts = calls.find((call) => call[2] === 'distance_%');
    const landmarks = calls.find((call) => call[2] === 'landmark_%');
    expect(efforts?.slice(3)).toEqual(['distance_5k']);
    expect(landmarks?.slice(3)).toEqual([
      'landmark_track',
      'landmark_golden_gate',
      'landmark_central_park',
    ]);
  });

  it('revokes every distance unlock once no distance set remains', async () => {
    const db = mockDb(0);
    await reconcileExerciseAchievements(db, 7);

    const calls = (db.runAsync as jest.Mock).mock.calls as unknown[][];
    const prefixes = calls.map((call) => call[2]);
    expect(prefixes).toEqual(['comparative_%', 'distance_%', 'landmark_%']);
    expect(calls.every((call) => !String(call[0]).includes('NOT IN'))).toBe(true);
  });
});

describe('distance achievements', () => {
  it('earns efforts from the best single set and landmarks from the total', () => {
    const keys = getEarnedDistanceAchievements(10000, 40000).map((entry) => entry.key);
    expect(keys).toEqual([
      'distance_5k',
      'distance_10k',
      'landmark_track',
      'landmark_golden_gate',
      'landmark_central_park',
      'landmark_english_channel',
    ]);
    // Lots of short sets add up to landmarks, but never to a single-set effort.
    expect(
      getEarnedDistanceAchievements(4000, 50000).some((entry) => entry.kind === 'effort')
    ).toBe(false);
  });

  it('normalizes into exercise-scoped endurance definitions', () => {
    expect(getAchievementByKey('distance_marathon')).toMatchObject({
      category: 'endurance',
      scope: 'exercise',
      tier: 'diamond',
      metric: 'maxDistance',
      target: 42195,
    });
    expect(getAchievementByKey('landmark_golden_gate')).toMatchObject({
      category: 'endurance',
      scope: 'exercise',
      metric: 'totalDistance',
      target: 2737,
    });
  });

  it('computes per-exercise progress from distance stats', () => {
    const stats = {
      totalVolumeKg: 0,
      maxWeightKg: 0,
      prsThisMonth: 0,
      maxDistanceM: 21097.5,
      totalDistanceM: 1368.5,
    };
    expect(computeExerciseAchievementProgress('distance_half_marathon', stats).progress).toBe(1);
    expect(computeExerciseAchievementProgress('distance_marathon', stats).progress).toBeCloseTo(0.5);
    expect(computeExerciseAchievementProgress('landmark_golden_gate', stats).progress).toBeCloseTo(0.5);
  });

  it('is unlocked from per-exercise stats and seeded into the catalog', () => {
    const statKeys = EXERCISE_STAT_ACHIEVEMENTS.map((entry) => entry.key);
    const seedKeys = ACHIEVEMENT_SEED.map((entry) => entry.key as string);
    for (const key of ['distance_5k', 'distance_marathon', 'landmark_track', 'landmark_great_wall']) {
      expect(statKeys).toContain(key);
      expect(seedKeys).toContain(key);
    }
    // Weight comparatives stay on their own per-set path.
    expect(statKeys.some((key) => key.startsWith('comparative_'))).toBe(false);
  });
});

describe('unlockDistanceAchievements', () => {
  it('unlocks newly reached milestones/landmarks, skipping ones already earned', async () => {
    const db = {
      // Live distance: best set 10.5 km, 10.5 km total.
      getFirstAsync: jest.fn(async () => ({ m: 10500, t: 10500 })),
      getAllAsync: jest.fn(async () => [{ key: 'distance_5k' }, { key: 'landmark_track' }]),
      runAsync: jest.fn(async () => ({ changes: 1 })),
    } as unknown as SQLiteDatabase;

    const unlocked = await unlockDistanceAchievements(db, 3);

    expect(unlocked.map((entry) => entry.definition.key)).toEqual([
      'distance_10k',
      'landmark_golden_gate',
      'landmark_central_park',
    ]);
    expect(unlocked[0].distanceM).toBe(10500);
    expect(db.runAsync).toHaveBeenCalledTimes(3);
  });

  it('does nothing without any distance logged', async () => {
    const db = {
      getFirstAsync: jest.fn(async () => ({ m: 0, t: 0 })),
      getAllAsync: jest.fn(async () => []),
      runAsync: jest.fn(async () => ({ changes: 1 })),
    } as unknown as SQLiteDatabase;

    await expect(unlockDistanceAchievements(db, 3)).resolves.toEqual([]);
    expect(db.getAllAsync).not.toHaveBeenCalled();
  });
});