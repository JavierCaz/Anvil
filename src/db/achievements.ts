import type { SQLiteDatabase } from 'expo-sqlite';
import {
  computeAchievementProgress,
  computeExerciseAchievementProgress,
  EXERCISE_STAT_ACHIEVEMENTS,
  getAchievementByKey,
  type AchievementCategory,
  type AchievementDefinition,
  type ExerciseAchievementStats,
} from '@/constants/achievements';
import type { WorkoutStats } from './workouts';
import { getAllExerciseStats } from './workouts';
import {
  DISTANCE_EFFORT_KEY_PREFIX,
  DISTANCE_EFFORTS,
  DISTANCE_LANDMARK_KEY_PREFIX,
  DISTANCE_LANDMARKS,
  getEarnedDistanceAchievements,
  type DistanceAchievementDefinition,
} from '@/constants/distance-achievements';
import {
  getWeightComparativesAtOrBelow,
  type WeightComparativeDefinition,
} from '@/constants/weight-comparatives';
export interface AchievementRow {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  key: string;
  unlocked_at: string | null;
}

/** A row from the `exercise_achievements` junction table. */
export interface ExerciseAchievementRow {
  id: number;
  exercise_id: number;
  key: string;
  unlocked_at: string;
}

/** One achievement with its computed progress, ready for display. */
export interface AchievementProgressItem {
  definitionKey: string;
  category: AchievementCategory | null;
  progress: number;
  unlocked: boolean;
  /** ISO timestamp when unlocked, or null while locked (used to sort recent unlocks). */
  unlockedAt: string | null;
  /** Exercises that earned this achievement (exercise-scoped achievements only). */
  exercises?: {
    id: number;
    name: string;
    slug: string | null;
    unlockedAt: string | null;
  }[];
}

/**
 * Map `achievements` rows + workout stats to display items. Shared by the
 * home summary and the full achievements screen so both stay in sync.
 */
export interface ExerciseAchievementOptions {
  /** Per-exercise stats for every exercise (drives exercise-scoped progress). */
  exerciseStats?: Map<number, ExerciseAchievementStats>;
  /** key → all unlocks across exercises (exercise-scoped), ordered by time. */
  unlockedExerciseKeys?: Map<string, ExerciseUnlockInfo[]>;
  /** exercise id → display metadata (name/slug) for the exercise icon. */
  exerciseMeta?: Map<number, { name: string; slug: string | null }>;
}

/** An unlock of an exercise-scoped achievement on one exercise. */
export interface ExerciseUnlockInfo {
  unlockedAt: string;
  exerciseId: number;
}


/**
 * Map `achievements` rows + workout stats to display items. Shared by the
 * home summary and the full achievements screen so both stay in sync.
 * Exercise-scoped achievements are reported unlocked when any exercise has
 * earned them, with progress from the best-performing exercise.
 */
export function buildAchievementItems(
  rows: AchievementRow[],
  stats: WorkoutStats,
  options?: ExerciseAchievementOptions
): AchievementProgressItem[] {
  return rows.map((row) => {
    const definition = getAchievementByKey(row.key);
    if (definition?.scope === 'exercise') {
      const unlocks = options?.unlockedExerciseKeys?.get(row.key) ?? [];
      const unlockedAt = unlocks[0]?.unlockedAt ?? null;
      // Best progress across exercises, tracking which exercise drives it.
      let bestProgress = 0;
      let bestExerciseId: number | null = null;
      for (const [exerciseId, exerciseStats] of options?.exerciseStats ?? []) {
        const { progress } = computeExerciseAchievementProgress(row.key, exerciseStats);
        if (progress > bestProgress) {
          bestProgress = progress;
          bestExerciseId = exerciseId;
        }
      }
      // Every exercise that earned this achievement (unlocked) or the closest
      // one (in progress) — used to render the earning exercises in the card.
      const sourceIds = unlockedAt !== null
        ? unlocks.map((unlock) => unlock.exerciseId)
        : (bestExerciseId != null ? [bestExerciseId] : []);
      const unlockedAtByExercise = new Map(
        unlocks.map((unlock) => [unlock.exerciseId, unlock.unlockedAt])
      );
      const exercises = sourceIds
        .map((exerciseId) => {
          const meta = options?.exerciseMeta?.get(exerciseId);
          return meta
            ? {
                id: exerciseId,
                name: meta.name,
                slug: meta.slug,
                unlockedAt: unlockedAtByExercise.get(exerciseId) ?? null,
              }
            : null;
        })
        .filter(
          (entry): entry is { id: number; name: string; slug: string | null; unlockedAt: string | null } =>
            entry !== null
        );
      return {
        definitionKey: row.key,
        category: definition.category,
        progress: bestProgress,
        unlocked: unlockedAt !== null,
        unlockedAt,
        exercises: exercises.length > 0 ? exercises : undefined,
      };
    }
    const { progress } = computeAchievementProgress(row.key, stats);
    return {
      definitionKey: row.key,
      category: definition?.category ?? null,
      progress,
      unlocked: row.unlocked_at !== null,
      unlockedAt: row.unlocked_at,
    };
  });
}

/** All achievements from the catalog, in definition order. */
export async function getAchievements(db: SQLiteDatabase): Promise<AchievementRow[]> {
  return db.getAllAsync<AchievementRow>(
    'SELECT id, name, description, icon, key, unlocked_at FROM achievements ORDER BY id'
  );
}

/**
 * Unlocks an achievement by key and reports whether it was newly unlocked.
 * Used by event-based special achievements (returns false when already earned).
 */
export async function unlockAchievementIfNew(
  db: SQLiteDatabase,
  key: string,
  unlockedAt = new Date().toISOString()
): Promise<boolean> {
  const result = await db.runAsync(
    `UPDATE achievements SET unlocked_at = ? WHERE key = ? AND unlocked_at IS NULL`,
    unlockedAt,
    key
  );
  return result.changes > 0;
}

/**
 * Built-in achievement catalog, mirroring the SCHEMA_V2 seed rows. Kept as a
 * reusable seed so "erase all data" can restore the achievement definitions
 * (which are app-provided content, not user data).
 */
export const ACHIEVEMENT_SEED = [
  // Experience
  { key: 'first_workout', name: 'First Workout', description: 'Complete your first workout session', icon: '🏋️' },
  { key: 'experience_10', name: 'Ten Sessions', description: 'Complete 10 workouts', icon: '🔟' },
  { key: 'experience_50', name: 'Fifty Sessions', description: 'Complete 50 workouts', icon: '💯' },
  { key: 'experience_100', name: 'Century', description: 'Complete 100 workouts', icon: '🎖️' },
  { key: 'experience_250', name: 'Iron Veteran', description: 'Complete 250 workouts', icon: '🏅' },
  // Volume
  { key: 'thousand_kg_club', name: 'Ton Club', description: 'Reach a metric ton of total lifting volume', icon: '💪' },
  { key: 'volume_10k', name: '10K Forged', description: 'Reach 10,000 of total lifting volume', icon: '🏋️' },
  { key: 'volume_100k', name: '100K Forged', description: 'Reach 100,000 of total lifting volume', icon: '⚙️' },
  { key: 'volume_1m', name: 'Million Anvil', description: 'Reach 1,000,000 of total lifting volume', icon: '🪨' },
  // Consistency
  { key: 'consistency_4w', name: '4-Week Consistency', description: 'Meet your weekly goal 4 weeks in a row', icon: '🗓️' },
  { key: 'consistency_8w', name: '8-Week Consistency', description: 'Meet your weekly goal 8 weeks in a row', icon: '📅' },
  { key: 'consistency_12w', name: '12-Week Consistency', description: 'Meet your weekly goal 12 weeks in a row', icon: '🔥' },
  // Strength
  { key: 'progressive_overload', name: 'Progressive Overload', description: 'Set 5 personal records in a month', icon: '📈' },
  // Special (event-based)
  { key: 'early_bird', name: 'Early Bird', description: 'Work out before 6 AM', icon: '🌅' },
  { key: 'night_shift', name: 'Night Shift', description: 'Work out after midnight', icon: '🌙' },
  { key: 'one_more_rep', name: 'One More Rep', description: 'Exceed the planned reps for a set', icon: '➕' },
  { key: 'perfect_week', name: 'Perfect Week', description: 'Meet your weekly workout goal', icon: '⭐' },
  // Weight milestones — "What am I lifting?" fun achievements. The `name`/
  // `description` here are fallbacks; the UI renders via i18n keys.
  { key: 'comparative_watermelon', name: 'Watermelon', description: 'Lift the weight of a watermelon in a single set', icon: '🍉' },
  { key: 'comparative_bicycle', name: 'Bicycle', description: 'Lift the weight of a bicycle in a single set', icon: '🚲' },
  { key: 'comparative_adult', name: 'Adult Person', description: 'Lift the weight of an adult person in a single set', icon: '🧍' },
  { key: 'comparative_panda', name: 'Panda', description: 'Lift the weight of a panda in a single set', icon: '🐼' },
  { key: 'comparative_motorcycle', name: 'Motorcycle', description: 'Lift the weight of a motorcycle in a single set', icon: '🏍️' },
  { key: 'comparative_piano', name: 'Grand Piano', description: 'Lift the weight of a grand piano in a single set', icon: '🎹' },
  { key: 'comparative_polar_bear', name: 'Polar Bear', description: 'Lift the weight of a polar bear in a single set', icon: '🐻❄️' },
  { key: 'comparative_car', name: 'Compact Car', description: 'Lift the weight of a compact car in a single set', icon: '🚗' },
  // Distance milestones (single set) and landmarks (cumulative), per
  // exercise. `name`/`description` are fallbacks; the UI renders via i18n.
  { key: 'distance_5k', name: '5K', description: 'Cover 5 km in a single set', icon: '👟' },
  { key: 'distance_10k', name: '10K', description: 'Cover 10 km in a single set', icon: '🏃' },
  { key: 'distance_half_marathon', name: 'Half Marathon', description: 'Cover 21.1 km in a single set', icon: '🎽' },
  { key: 'distance_marathon', name: 'Marathon', description: 'Cover 42.2 km in a single set', icon: '🏆' },
  { key: 'landmark_track', name: 'Running Track', description: 'Cover a running-track lap on one exercise', icon: '🏟️' },
  { key: 'landmark_golden_gate', name: 'Golden Gate Bridge', description: 'Cover the length of the Golden Gate Bridge on one exercise', icon: '🌉' },
  { key: 'landmark_central_park', name: 'Central Park Loop', description: 'Cover the Central Park loop on one exercise', icon: '🌳' },
  { key: 'landmark_english_channel', name: 'English Channel', description: 'Cover the width of the English Channel on one exercise', icon: '🌊' },
  { key: 'landmark_panama_canal', name: 'Panama Canal', description: 'Cover the length of the Panama Canal on one exercise', icon: '🚢' },
  { key: 'landmark_grand_canyon', name: 'Grand Canyon', description: 'Cover the length of the Grand Canyon on one exercise', icon: '🏜️' },
  { key: 'landmark_route_66', name: 'Route 66', description: 'Cover the length of Route 66 on one exercise', icon: '🛣️' },
  { key: 'landmark_great_wall', name: 'Great Wall of China', description: 'Cover the length of the Great Wall on one exercise', icon: '🧱' },
] as const;

/** Seed achievement definitions that aren't present yet (keyed by `key`). Idempotent. */
export async function seedAchievements(db: SQLiteDatabase): Promise<void> {
  const rows = await db.getAllAsync<{ key: string }>('SELECT key FROM achievements');
  const existing = new Set(rows.map((row) => row.key));
  const missing = ACHIEVEMENT_SEED.filter((achievement) => !existing.has(achievement.key));

  if (missing.length === 0) {
    return;
  }

  await db.withTransactionAsync(async () => {
    for (const achievement of missing) {
      await db.runAsync(
        'INSERT INTO achievements (name, description, icon, key, unlocked_at) VALUES (?, ?, ?, ?, NULL)',
        achievement.name,
        achievement.description,
        achievement.icon,
        achievement.key
      );
    }
  });
}

/**
 * Unlock an exercise-scoped achievement for one exercise (idempotent).
 * Returns whether it was newly unlocked.
 */
export async function unlockExerciseAchievement(
  db: SQLiteDatabase,
  exerciseId: number,
  key: string,
  unlockedAt = new Date().toISOString()
): Promise<boolean> {
  const result = await db.runAsync(
    `INSERT OR IGNORE INTO exercise_achievements (exercise_id, key, unlocked_at)
     VALUES (?, ?, ?)`,
    exerciseId,
    key,
    unlockedAt
  );
  return result.changes > 0;
}

/**
 * Exercise-scoped achievements unlocked for one exercise.
 */
export async function getExerciseAchievements(
  db: SQLiteDatabase,
  exerciseId: number
): Promise<AchievementDefinition[]> {
  const map = await getExercisesAchievements(db, [exerciseId]);
  return map.get(exerciseId) ?? [];
}

/**
 * Exercise-scoped achievements unlocked for a set of exercises, keyed by
 * exercise id (batch — used by the workout session screen).
 */
export async function getExercisesAchievements(
  db: SQLiteDatabase,
  exerciseIds: number[]
): Promise<Map<number, AchievementDefinition[]>> {
  const result = new Map<number, AchievementDefinition[]>();
  if (exerciseIds.length === 0) {
    return result;
  }

  const placeholders = exerciseIds.map(() => '?').join(', ');
  const rows = await db.getAllAsync<{ exercise_id: number; key: string }>(
    `SELECT exercise_id, key FROM exercise_achievements
     WHERE exercise_id IN (${placeholders})`,
    ...exerciseIds
  );
  for (const row of rows) {
    const definition = getAchievementByKey(row.key);
    if (!definition) {
      continue;
    }
    const list = result.get(row.exercise_id) ?? [];
    list.push(definition);
    result.set(row.exercise_id, list);
  }
  return result;
}

/**
 * key → all unlocks across all exercises (exercise-scoped), ordered by time.
 * The first entry is the earliest unlock for a given achievement.
 */
export async function getAllExerciseUnlocks(
  db: SQLiteDatabase
): Promise<Map<string, ExerciseUnlockInfo[]>> {
  const rows = await db.getAllAsync<{ key: string; unlocked_at: string; exercise_id: number }>(
    `SELECT key, unlocked_at, exercise_id
     FROM exercise_achievements
     ORDER BY unlocked_at ASC, id ASC`
  );
  const byKey = new Map<string, ExerciseUnlockInfo[]>();
  for (const row of rows) {
    const list = byKey.get(row.key) ?? [];
    list.push({ unlockedAt: row.unlocked_at, exerciseId: row.exercise_id });
    byKey.set(row.key, list);
  }
  return byKey;
}

/**
 * Display metadata (name/slug) for every exercise — used to render the
 * earning exercise's icon on achievement items.
 */
export async function getAchievementExerciseMeta(
  db: SQLiteDatabase
): Promise<Map<number, { name: string; slug: string | null }>> {
  const rows = await db.getAllAsync<{ id: number; name: string; slug: string | null }>(
    'SELECT id, name, slug FROM exercises'
  );
  return new Map(rows.map((row) => [row.id, { name: row.name, slug: row.slug }]));
}
/**
 * Unlock every weight comparative whose threshold is at or below `weightKg`
 * for a specific exercise (idempotent). Returns the definitions that were
 * newly unlocked for this exercise, in ascending threshold order — the
 * caller can toast the highest (last) one.
 */
export async function unlockWeightComparatives(
  db: SQLiteDatabase,
  exerciseId: number,
  weightKg: number
): Promise<WeightComparativeDefinition[]> {
  const eligible = getWeightComparativesAtOrBelow(weightKg);
  if (eligible.length === 0) {
    return [];
  }

  const placeholders = eligible.map(() => '?').join(', ');
  const already = await db.getAllAsync<{ key: string }>(
    `SELECT key FROM exercise_achievements WHERE exercise_id = ? AND key IN (${placeholders})`,
    exerciseId,
    ...eligible.map((comparative) => comparative.key)
  );
  const alreadyKeys = new Set(already.map((row) => row.key));

  const newly = eligible.filter((comparative) => !alreadyKeys.has(comparative.key));
  if (newly.length === 0) {
    return [];
  }

  const unlockedAt = new Date().toISOString();
  for (const comparative of newly) {
    await unlockExerciseAchievement(db, exerciseId, comparative.key, unlockedAt);
  }
  return newly;
}

/** Best single set + cumulative distance on an exercise (meters). */
interface ExerciseDistance {
  maxDistanceM: number;
  totalDistanceM: number;
}

/**
 * Distance from an exercise's completed sets in any workout — including the
 * active session, so a set unlocks immediately (like weight comparatives).
 */
async function getLiveExerciseDistance(
  db: SQLiteDatabase,
  exerciseId: number
): Promise<ExerciseDistance> {
  const row = await db.getFirstAsync<{ m: number; t: number }>(
    `SELECT COALESCE(MAX(distance_m), 0) AS m, COALESCE(SUM(distance_m), 0) AS t
     FROM sets
     WHERE exercise_id = ? AND completed = 1 AND distance_m > 0`,
    exerciseId
  );
  return { maxDistanceM: row?.m ?? 0, totalDistanceM: row?.t ?? 0 };
}

/** A distance achievement newly unlocked by a set, with the distance that earned it. */
export interface DistanceUnlock {
  definition: DistanceAchievementDefinition;
  /** Best single set (efforts) or cumulative distance (landmarks), in meters. */
  distanceM: number;
}

/**
 * Unlock the distance milestones (best single set) and landmarks (cumulative
 * distance) an exercise has reached (idempotent). Returns the newly unlocked
 * ones in catalog order — efforts first, then landmarks, each ascending — so
 * the caller can toast the most notable.
 */
export async function unlockDistanceAchievements(
  db: SQLiteDatabase,
  exerciseId: number
): Promise<DistanceUnlock[]> {
  const distance = await getLiveExerciseDistance(db, exerciseId);
  const eligible = getEarnedDistanceAchievements(distance.maxDistanceM, distance.totalDistanceM);
  if (eligible.length === 0) {
    return [];
  }

  const placeholders = eligible.map(() => '?').join(', ');
  const already = await db.getAllAsync<{ key: string }>(
    `SELECT key FROM exercise_achievements WHERE exercise_id = ? AND key IN (${placeholders})`,
    exerciseId,
    ...eligible.map((entry) => entry.key)
  );
  const alreadyKeys = new Set(already.map((row) => row.key));
  const newly = eligible.filter((entry) => !alreadyKeys.has(entry.key));

  const unlockedAt = new Date().toISOString();
  for (const definition of newly) {
    await unlockExerciseAchievement(db, exerciseId, definition.key, unlockedAt);
  }
  return newly.map((definition) => ({
    definition,
    distanceM: definition.kind === 'effort' ? distance.maxDistanceM : distance.totalDistanceM,
  }));
}

/**
 * Backfill exercise-scoped achievement unlocks from historical workout data.
 *
 * After the migration to per-exercise achievements clears the legacy global
 * unlock flags, existing users would lose comparatives/volume tiers they had
 * already earned. This re-derives them from completed sets / PR history: for
 * every exercise with data it unlocks the weight comparatives at or below its
 * best weight, the volume tiers at or below its cumulative volume, the
 * distance milestones/landmarks reached by its best set / total distance, and
 * progressive overload when the exercise set 5+ PRs this month. Idempotent —
 * safe to run on every launch.
 */
export async function backfillPerExerciseAchievements(
  db: SQLiteDatabase
): Promise<void> {
  const unlockedAt = new Date().toISOString();

  // Weight comparatives + volume tiers are cumulative (all-time per-exercise
  // stats), so re-derive them directly from history.
  const byExercise = await getAllExerciseStats(db);
  for (const [exerciseId, stats] of byExercise) {
    if (stats.maxWeightKg > 0) {
      for (const comparative of getWeightComparativesAtOrBelow(stats.maxWeightKg)) {
        await unlockExerciseAchievement(db, exerciseId, comparative.key, unlockedAt);
      }
    }

    for (const definition of EXERCISE_STAT_ACHIEVEMENTS) {
      if (definition.metric === undefined || definition.target === undefined) {
        continue;
      }
      const { progress } = computeExerciseAchievementProgress(definition.key, stats);
      if (progress >= 1) {
        await unlockExerciseAchievement(db, exerciseId, definition.key, unlockedAt);
      }
    }
  }

  // `progressive_overload` (5 PRs in a month) is time-windowed: `getAllExerciseStats`
  // only counts the current month, so re-derive it from ANY calendar month with
  // 5+ PRs on the same exercise (historical earned badge).
  const poRows = await db.getAllAsync<{ exercise_id: number }>(`
    SELECT exercise_id
    FROM personal_records
    GROUP BY exercise_id, strftime('%Y-%m', achieved_at)
    HAVING COUNT(*) >= 5
  `);
  for (const row of poRows) {
    await unlockExerciseAchievement(db, row.exercise_id, 'progressive_overload', unlockedAt);
  }
}

/**
 * Re-derive an exercise's set-driven unlocks (weight comparatives, distance
 * milestones and landmarks) from its current completed sets, revoking any
 * that no longer have qualifying data. Called after undoing a set or
 * discarding a workout so orphaned unlocks don't persist. Counts completed
 * sets from any workout (including the active session) — a live unlock stays
 * only while a completed set justifies it.
 */
export async function reconcileExerciseAchievements(
  db: SQLiteDatabase,
  exerciseId: number
): Promise<void> {
  const maxWeight =
    (await db.getFirstAsync<{ m: number }>(`
      SELECT COALESCE(MAX(s.weight), 0) AS m
      FROM sets s
      WHERE s.exercise_id = ? AND s.completed = 1
    `
    , exerciseId))?.m ?? 0;
  const distance = await getLiveExerciseDistance(db, exerciseId);

  await revokeUnsupported(
    db,
    exerciseId,
    'comparative_',
    getWeightComparativesAtOrBelow(maxWeight).map((comparative) => comparative.key)
  );
  const earnedDistance = getEarnedDistanceAchievements(
    distance.maxDistanceM,
    distance.totalDistanceM
  );
  await revokeUnsupported(
    db,
    exerciseId,
    DISTANCE_EFFORT_KEY_PREFIX,
    earnedDistance.filter((entry) => DISTANCE_EFFORTS.includes(entry)).map((entry) => entry.key)
  );
  await revokeUnsupported(
    db,
    exerciseId,
    DISTANCE_LANDMARK_KEY_PREFIX,
    earnedDistance.filter((entry) => DISTANCE_LANDMARKS.includes(entry)).map((entry) => entry.key)
  );
}

/** Delete an exercise's unlocks with `prefix` whose key isn't in `supportedKeys`. */
async function revokeUnsupported(
  db: SQLiteDatabase,
  exerciseId: number,
  prefix: string,
  supportedKeys: string[]
): Promise<void> {
  if (supportedKeys.length === 0) {
    await db.runAsync(
      `DELETE FROM exercise_achievements WHERE exercise_id = ? AND key LIKE ?`,
      exerciseId,
      `${prefix}%`
    );
    return;
  }
  const placeholders = supportedKeys.map(() => '?').join(', ');
  await db.runAsync(
    `DELETE FROM exercise_achievements
     WHERE exercise_id = ? AND key LIKE ? AND key NOT IN (${placeholders})`,
    exerciseId,
    `${prefix}%`,
    ...supportedKeys
  );
}
