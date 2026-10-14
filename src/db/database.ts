import * as SQLite from 'expo-sqlite';
import {
  backfillPerExerciseAchievements,
  reconcileExerciseAchievements,
  seedAchievements,
} from './achievements';
import { seedExerciseCatalog } from './exercises';
import { DATABASE_VERSION, MIGRATIONS } from './schema';
import { deleteOrphanedSets } from './workouts';

export const DATABASE_NAME = 'anvil.db';

/**
 * Migration runner. Reads `PRAGMA user_version` and applies each pending
 * migration in order, bumping the version after each.
 *
 * Pass as `onInit` to `SQLiteProvider`:
 *   <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
 */
export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentVersion = row?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  // Apply migrations for each version the DB is behind.
  for (let version = currentVersion; version < MIGRATIONS.length; version++) {
    await db.execAsync(MIGRATIONS[version]);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

/**
 * Full app-database bootstrap: apply pending migrations, then make sure the
 * exercise catalog from @bryllim/workout-guide is seeded (idempotent).
 *
 * Pass as `onInit` to `SQLiteProvider`.
 */
export async function initializeDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  await migrateDbIfNeeded(db);
  await seedExerciseCatalog(db);
  await seedAchievements(db);
  await backfillPerExerciseAchievements(db);
  // Revoke unlocks earned only by sets of previously discarded workouts.
  for (const exerciseId of await deleteOrphanedSets(db)) {
    await reconcileExerciseAchievements(db, exerciseId);
  }
}
