import * as SQLite from 'expo-sqlite';
import { DATABASE_VERSION, MIGRATIONS } from './schema';

export const DATABASE_NAME = 'anvil.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Opens (and lazily migrates) the app database.
 *
 * Returns a shared singleton so all callers use the same connection.
 * Safe to call multiple times.
 */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openAndMigrate();
  }
  return dbPromise;
}

async function openAndMigrate(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await migrateDbIfNeeded(db);
  return db;
}

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
