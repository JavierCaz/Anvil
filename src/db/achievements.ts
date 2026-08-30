import type { SQLiteDatabase } from 'expo-sqlite';
import {
  computeAchievementProgress,
  getAchievementByKey,
  type AchievementCategory,
} from '@/constants/achievements';
import type { WorkoutStats } from './workouts';
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

/** One achievement with its computed progress, ready for display. */
export interface AchievementProgressItem {
  definitionKey: string;
  category: AchievementCategory | null;
  progress: number;
  unlocked: boolean;
  /** ISO timestamp when unlocked, or null while locked (used to sort recent unlocks). */
  unlockedAt: string | null;
}

/**
 * Map `achievements` rows + workout stats to display items. Shared by the
 * home summary and the full achievements screen so both stay in sync.
 */
export function buildAchievementItems(
  rows: AchievementRow[],
  stats: WorkoutStats
): AchievementProgressItem[] {
  return rows.map((row) => {
    const definition = getAchievementByKey(row.key);
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

/** Unlocks an achievement by key (idempotent). */
export async function unlockAchievement(
  db: SQLiteDatabase,
  key: string,
  unlockedAt = new Date().toISOString()
): Promise<void> {
  await db.runAsync(
    `UPDATE achievements SET unlocked_at = ? WHERE key = ? AND unlocked_at IS NULL`,
    unlockedAt,
    key
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
 * Unlock every weight comparative whose threshold is at or below `weightKg`
 * (idempotent). Returns the definitions that were newly unlocked, in ascending
 * threshold order — the caller can toast the highest (last) one.
 */
export async function unlockWeightComparatives(
  db: SQLiteDatabase,
  weightKg: number
): Promise<WeightComparativeDefinition[]> {
  const eligible = getWeightComparativesAtOrBelow(weightKg);
  if (eligible.length === 0) {
    return [];
  }

  const placeholders = eligible.map(() => '?').join(', ');
  const locked = await db.getAllAsync<{ key: string }>(
    `SELECT key FROM achievements WHERE key IN (${placeholders}) AND unlocked_at IS NULL`,
    ...eligible.map((comparative) => comparative.key)
  );
  if (locked.length === 0) {
    return [];
  }

  const lockedKeys = new Set(locked.map((row) => row.key));
  const unlockedAt = new Date().toISOString();
  for (const comparative of eligible) {
    if (lockedKeys.has(comparative.key)) {
      await unlockAchievement(db, comparative.key, unlockedAt);
    }
  }
  return eligible.filter((comparative) => lockedKeys.has(comparative.key));
}
