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
