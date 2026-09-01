/**
 * Anvil backup: full data export/import/wipe for SQLite tables.
 *
 * This module is deliberately free of native (expo-file-system / sharing /
 * document-picker) concerns so the validation logic stays unit-testable.
 * The file-level orchestration lives in `./backup-file.ts`.
 */
import type { SQLiteDatabase } from 'expo-sqlite';
import { DATABASE_VERSION } from './schema';

/** Current backup envelope format. Bump on breaking format changes. */
export const BACKUP_VERSION = 1;
export const BACKUP_APP = 'anvil';
export const BACKUP_TYPE = 'anvil-backup';

/** SQLite value types that can appear in a backup row. */
type BackupRowValue = string | number | null;
export type BackupRow = Record<string, BackupRowValue>;

export type BackupTableName =
  | 'routines'
  | 'exercises'
  | 'routine_exercises'
  | 'routine_exercise_sets'
  | 'workout_logs'
  | 'sets'
  | 'personal_records'
  | 'achievements';

/** All tables included in a backup (in FK-safe order for deletion). */
export const BACKUP_TABLES: readonly BackupTableName[] = [
  'routines',
  'exercises',
  'routine_exercises',
  'routine_exercise_sets',
  'workout_logs',
  'sets',
  'personal_records',
  'achievements',
];

/** Insert order respects foreign keys (parents before children). */
const BACKUP_INSERT_ORDER: readonly BackupTableName[] = [
  'exercises',
  'routines',
  'routine_exercises',
  'routine_exercise_sets',
  'workout_logs',
  'sets',
  'personal_records',
  'achievements',
];

type ColumnType = 'integer' | 'real' | 'text' | 'boolean';

/**
 * Allowed columns per table and their expected value types, mirrored from
 * `src/db/schema.ts`. Used to validate/sanitize imported rows.
 */
const TABLE_COLUMNS: Record<BackupTableName, Record<string, ColumnType>> = {
  routines: {
    id: 'integer',
    name: 'text',
    description: 'text',
    created_at: 'text',
  },
  exercises: {
    id: 'integer',
    name: 'text',
    muscle_group: 'text',
    icon: 'text',
    slug: 'text',
    source: 'text',
    exercise_type: 'text',
    equipment: 'text',
    primary_muscle: 'text',
    secondary_muscles: 'text',
    is_stretch: 'boolean',
    created_at: 'text',
  },
  routine_exercises: {
    id: 'integer',
    routine_id: 'integer',
    exercise_id: 'integer',
    order_index: 'integer',
    sets: 'integer',
    reps: 'integer',
    rest_seconds: 'integer',
  },
  routine_exercise_sets: {
    id: 'integer',
    routine_exercise_id: 'integer',
    set_number: 'integer',
    reps: 'integer',
    rest_seconds: 'integer',
    weight: 'real',
  },
  workout_logs: {
    id: 'integer',
    routine_id: 'integer',
    started_at: 'text',
    completed_at: 'text',
    notes: 'text',
    sets_edited: 'boolean',
  },
  sets: {
    id: 'integer',
    workout_log_id: 'integer',
    exercise_id: 'integer',
    set_number: 'integer',
    weight: 'real',
    reps: 'integer',
    rest_seconds: 'integer',
    completed: 'boolean',
  },
  personal_records: {
    id: 'integer',
    exercise_id: 'integer',
    weight: 'real',
    reps: 'integer',
    achieved_at: 'text',
  },
  achievements: {
    id: 'integer',
    name: 'text',
    description: 'text',
    icon: 'text',
    key: 'text',
    unlocked_at: 'text',
  },
};

export type BackupTableData = Record<BackupTableName, BackupRow[]>;

/** KV-store preferences captured with the backup (opaque raw strings). */
export interface BackupPreferences {
  theme?: string;
  language?: string;
  weeklyWorkouts?: string;
  units?: string;
  weightStep?: string;
}

export interface BackupFile {
  app: typeof BACKUP_APP;
  type: typeof BACKUP_TYPE;
  version: number;
  exportedAt: string;
  databaseVersion: number;
  data: BackupTableData;
  preferences: BackupPreferences;
}

export type BackupErrorCode =
  | 'invalidJson'
  | 'invalidStructure'
  | 'invalidApp'
  | 'invalidType'
  | 'unsupportedVersion'
  | 'newerDatabase'
  | 'missingTable'
  | 'invalidRow'
  | 'invalidColumn'
  | 'invalidRowId'
  | 'webUnsupported';

/** Thrown for malformed/incompatible backup files. `code` maps to a UI message. */
export class BackupError extends Error {
  constructor(public readonly code: BackupErrorCode) {
    super(code);
    this.name = 'BackupError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidType(value: unknown, type: ColumnType): boolean {
  switch (type) {
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value);
    case 'real':
      return typeof value === 'number';
    case 'text':
      return typeof value === 'string';
    case 'boolean':
      return typeof value === 'number' && (value === 0 || value === 1);
  }
}

/** Keep only known columns with valid types; requires a numeric `id`. */
function sanitizeRow(table: BackupTableName, row: unknown): BackupRow {
  if (!isRecord(row)) {
    throw new BackupError('invalidRow');
  }
  const spec = TABLE_COLUMNS[table];
  const clean: BackupRow = {};
  for (const [key, expected] of Object.entries(spec)) {
    const value = row[key];
    if (value === undefined) continue;
    if (value !== null && !isValidType(value, expected)) {
      throw new BackupError('invalidColumn');
    }
    clean[key] = value as BackupRowValue;
  }
  if (typeof clean.id !== 'number' || !Number.isInteger(clean.id)) {
    throw new BackupError('invalidRowId');
  }
  return clean;
}

function sanitizePreferences(value: unknown): BackupPreferences {
  if (!isRecord(value)) return {};
  const preferences: BackupPreferences = {};
  if (typeof value.theme === 'string') preferences.theme = value.theme;
  if (typeof value.language === 'string') preferences.language = value.language;
  if (typeof value.weeklyWorkouts === 'string') preferences.weeklyWorkouts = value.weeklyWorkouts;
  if (typeof value.units === 'string') preferences.units = value.units;
  if (typeof value.weightStep === 'string') preferences.weightStep = value.weightStep;
  return preferences;
}

/**
 * Parse + validate a backup file. Throws `BackupError` on any structural or
 * type mismatch. Unknown row columns are dropped; preferences are filtered to
 * known string keys.
 */
export function parseBackupFile(raw: string): BackupFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new BackupError('invalidJson');
  }
  if (!isRecord(parsed)) {
    throw new BackupError('invalidStructure');
  }
  if (parsed.app !== BACKUP_APP) throw new BackupError('invalidApp');
  if (parsed.type !== BACKUP_TYPE) throw new BackupError('invalidType');
  if (parsed.version !== BACKUP_VERSION) throw new BackupError('unsupportedVersion');
  if (
    typeof parsed.databaseVersion !== 'number' ||
    !Number.isInteger(parsed.databaseVersion) ||
    parsed.databaseVersion > DATABASE_VERSION
  ) {
    throw new BackupError('newerDatabase');
  }
  if (!isRecord(parsed.data)) throw new BackupError('missingTable');

  const data = {} as BackupTableData;
  for (const table of BACKUP_TABLES) {
    const rows = parsed.data[table];
    if (!Array.isArray(rows)) throw new BackupError('missingTable');
    data[table] = rows.map((row) => sanitizeRow(table, row));
  }

  return {
    app: BACKUP_APP,
    type: BACKUP_TYPE,
    version: BACKUP_VERSION,
    exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : '',
    databaseVersion: parsed.databaseVersion,
    data,
    preferences: sanitizePreferences(parsed.preferences),
  };
}

/** Read every backup table from the live database. */
export async function buildBackupData(db: SQLiteDatabase): Promise<BackupTableData> {
  const data = {} as BackupTableData;
  for (const table of BACKUP_TABLES) {
    data[table] = await db.getAllAsync<BackupRow>(`SELECT * FROM ${table}`);
  }
  return data;
}

/** Delete all rows from every backup table and reset AUTOINCREMENT counters. */
export async function wipeDatabaseData(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = OFF');
  try {
    await db.withTransactionAsync(async () => {
      for (const table of BACKUP_TABLES) {
        await db.runAsync(`DELETE FROM ${table}`);
      }
      await db.runAsync(
        `DELETE FROM sqlite_sequence WHERE name IN (${BACKUP_TABLES.map((t) => `'${t}'`).join(', ')})`
      );
    });
  } finally {
    await db.execAsync('PRAGMA foreign_keys = ON');
  }
}

/**
 * Replace the database contents with the backup's tables. Runs in a single
 * transaction with foreign keys disabled: any constraint violation rolls the
 * whole restore back, leaving the database untouched.
 */
export async function restoreBackupData(
  db: SQLiteDatabase,
  data: BackupTableData
): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = OFF');
  try {
    await db.withTransactionAsync(async () => {
      for (const table of BACKUP_TABLES) {
        await db.runAsync(`DELETE FROM ${table}`);
      }
      await db.runAsync(
        `DELETE FROM sqlite_sequence WHERE name IN (${BACKUP_TABLES.map((t) => `'${t}'`).join(', ')})`
      );

      for (const table of BACKUP_INSERT_ORDER) {
        const rows = data[table];
        if (rows.length === 0) continue;
        const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
        const columnList = columns.join(', ');
        const placeholders = columns.map(() => '?').join(', ');
        const sql = `INSERT INTO ${table} (${columnList}) VALUES (${placeholders})`;
        for (const row of rows) {
          await db.runAsync(sql, ...columns.map((column) => row[column] ?? null));
        }
      }
    });
  } finally {
    await db.execAsync('PRAGMA foreign_keys = ON');
  }
}
