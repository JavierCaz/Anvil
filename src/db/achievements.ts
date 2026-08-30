import type { SQLiteDatabase } from 'expo-sqlite';

export interface AchievementRow {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  key: string;
  unlocked_at: string | null;
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
 * Built-in achievement catalog, mirroring the SCHEMA_V2 seed rows. Kept as a
 * reusable seed so "erase all data" can restore the achievement definitions
 * (which are app-provided content, not user data).
 */
export const ACHIEVEMENT_SEED = [
  { key: 'first_workout', name: 'First Workout', description: 'Complete your first workout session', icon: '🏋️' },
  { key: 'thousand_kg_club', name: '1000kg Club', description: 'Reach 1000 kg of total lifting volume', icon: '💪' },
  { key: 'consistency_king', name: 'Consistency King', description: 'Work out 30 days in a row', icon: '👑' },
  { key: 'progressive_overload', name: 'Progressive Overload', description: 'Set 5 personal records in a month', icon: '📈' },
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
