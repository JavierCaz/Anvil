/**
 * Backup file orchestration: turn the SQLite data into a shareable JSON file
 * and back. Uses the SDK 57 `expo-file-system` API (`File`/`Paths`) with
 * `expo-sharing` (export) and `expo-document-picker` (import).
 *
 * Not available on web (expo-file-system's new API is native-only) — calls
 * throw `BackupError('webUnsupported')` there; the settings screen surfaces it.
 */
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Storage from 'expo-sqlite/kv-store';
import dayjs from 'dayjs';
import { Platform } from 'react-native';
import type { SQLiteDatabase } from 'expo-sqlite';
import {
  BACKUP_APP,
  BACKUP_TYPE,
  BACKUP_VERSION,
  BackupError,
  buildBackupData,
  parseBackupFile,
  restoreBackupData,
  wipeDatabaseData,
  type BackupFile,
  type BackupPreferences,
} from './backup';
import { DATABASE_VERSION } from './schema';
import { initializeDatabase } from './database';

const PREFERENCE_KEYS = {
  theme: 'anvil.theme',
  language: 'anvil.language',
  weeklyWorkouts: 'anvil.goals.weeklyWorkouts',
} as const;

async function readPreferences(): Promise<BackupPreferences> {
  const [theme, language, weeklyWorkouts] = await Promise.all([
    Storage.getItem(PREFERENCE_KEYS.theme),
    Storage.getItem(PREFERENCE_KEYS.language),
    Storage.getItem(PREFERENCE_KEYS.weeklyWorkouts),
  ]);
  return {
    theme: theme ?? undefined,
    language: language ?? undefined,
    weeklyWorkouts: weeklyWorkouts ?? undefined,
  };
}

async function writePreferences(preferences: BackupPreferences): Promise<void> {
  await Promise.all([
    preferences.theme ? Storage.setItem(PREFERENCE_KEYS.theme, preferences.theme) : Promise.resolve(),
    preferences.language
      ? Storage.setItem(PREFERENCE_KEYS.language, preferences.language)
      : Promise.resolve(),
    preferences.weeklyWorkouts
      ? Storage.setItem(PREFERENCE_KEYS.weeklyWorkouts, preferences.weeklyWorkouts)
      : Promise.resolve(),
  ]);
}

async function clearPreferences(): Promise<void> {
  await Promise.all(Object.values(PREFERENCE_KEYS).map((key) => Storage.removeItem(key)));
}

function assertNotWeb(): void {
  if (Platform.OS === 'web') {
    throw new BackupError('webUnsupported');
  }
}

/**
 * Build the current app data into a backup envelope and share it as a JSON
 * file through the system share sheet. Resolves when the share completes.
 */
export async function exportBackupFile(db: SQLiteDatabase): Promise<void> {
  assertNotWeb();

  const data = await buildBackupData(db);
  const preferences = await readPreferences();
  const backup: BackupFile = {
    app: BACKUP_APP,
    type: BACKUP_TYPE,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    databaseVersion: DATABASE_VERSION,
    data,
    preferences,
  };

  const filename = `anvil-backup-${dayjs().format('YYYYMMDD-HHmmss')}.json`;
  const out = new File(Paths.cache, filename);
  if (out.exists) out.delete();
  out.create();
  out.write(JSON.stringify(backup, null, 2));

  const available = await Sharing.isAvailableAsync();
  if (!available) {
    throw new BackupError('webUnsupported');
  }
  await Sharing.shareAsync(out.uri, {
    mimeType: 'application/json',
    dialogTitle: 'Anvil backup',
  });
}

/**
 * Let the user pick a backup file, validate it, and replace the database
 * contents with it. Returns the parsed backup (so the caller can sync
 * in-memory preferences), or `null` if the picker was cancelled.
 */
export async function importBackupFile(db: SQLiteDatabase): Promise<BackupFile | null> {
  assertNotWeb();

  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: true,
  });
  if (result.canceled || !result.assets?.length) {
    return null;
  }

  const asset = result.assets[0];
  const raw = await new File(asset.uri).text();
  const backup = parseBackupFile(raw);

  await restoreBackupData(db, backup.data);
  await writePreferences(backup.preferences);
  return backup;
}

/**
 * Delete all user data (SQLite tables + persisted preferences), then re-run
 * the app bootstrap so built-in content (exercise catalog + achievement
 * definitions) is seeded again — leaving the app in a fresh-install state.
 */
export async function eraseAllData(db: SQLiteDatabase): Promise<void> {
  assertNotWeb();
  await wipeDatabaseData(db);
  await clearPreferences();
  await initializeDatabase(db);
}
