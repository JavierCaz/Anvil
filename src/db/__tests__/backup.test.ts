import {
  BACKUP_VERSION,
  BackupError,
  parseBackupFile,
  type BackupErrorCode,
  type BackupTableName,
} from '@/db/backup';
import { DATABASE_VERSION } from '@/db/schema';

type TableFixtures = Partial<Record<BackupTableName, unknown[]>>;

function data(overrides: TableFixtures = {}): Record<string, unknown[]> {
  return {
    routines: [],
    exercises: [],
    routine_exercises: [],
    routine_exercise_sets: [],
    workout_logs: [],
    sets: [],
    personal_records: [],
    achievements: [],
    ...overrides,
  };
}

function validBackup(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    app: 'anvil',
    type: 'anvil-backup',
    version: BACKUP_VERSION,
    exportedAt: '2026-08-30T00:00:00.000Z',
    databaseVersion: DATABASE_VERSION,
    data: data(),
    preferences: { theme: '{"state":{"preference":"dark"},"version":0}' },
    ...overrides,
  };
}

function expectBackupError(raw: string, code: BackupErrorCode): void {
  let error: unknown;
  try {
    parseBackupFile(raw);
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(BackupError);
  if (error instanceof BackupError) {
    expect(error.code).toBe(code);
  }
}

describe('parseBackupFile', () => {
  it('parses an empty valid backup', () => {
    const parsed = parseBackupFile(JSON.stringify(validBackup()));
    expect(parsed.app).toBe('anvil');
    expect(parsed.type).toBe('anvil-backup');
    expect(parsed.version).toBe(BACKUP_VERSION);
    expect(parsed.databaseVersion).toBe(DATABASE_VERSION);
    expect(Object.keys(parsed.data)).toHaveLength(8);
  });

  it('preserves rows and preferences', () => {
    const backup = validBackup({
      data: data({
        routines: [{ id: 1, name: 'Push Day', description: null, created_at: '2026-08-01' }],
        sets: [
          {
            id: 5,
            workout_log_id: 2,
            exercise_id: 3,
            set_number: 1,
            weight: 80,
            reps: 10,
            rest_seconds: 90,
            completed: 1,
          },
        ],
      }),
      preferences: {
        theme: '{"state":{"preference":"dark"},"version":0}',
        language: 'es',
        weeklyWorkouts: '{"state":{"weeklyWorkouts":4},"version":0}',
      },
    });
    const parsed = parseBackupFile(JSON.stringify(backup));
    expect(parsed.data.routines).toEqual([
      { id: 1, name: 'Push Day', description: null, created_at: '2026-08-01' },
    ]);
    expect(parsed.data.sets[0]?.weight).toBe(80);
    expect(parsed.preferences.language).toBe('es');
    expect(parsed.preferences.weeklyWorkouts).toBe('{"state":{"weeklyWorkouts":4},"version":0}');
  });

  it('drops unknown columns from rows', () => {
    const backup = validBackup({
      data: data({
        routines: [
          { id: 1, name: 'Push Day', description: null, created_at: '2026-08-01', injected: 'x' },
        ],
      }),
    });
    const parsed = parseBackupFile(JSON.stringify(backup));
    expect(parsed.data.routines[0]).not.toHaveProperty('injected');
  });

  it('accepts null values in nullable columns', () => {
    const backup = validBackup({
      data: data({
        exercises: [
          {
            id: 1,
            name: 'Bench Press',
            muscle_group: null,
            icon: null,
            slug: null,
            source: 'custom',
            exercise_type: null,
            equipment: null,
            primary_muscle: null,
            secondary_muscles: null,
            is_stretch: 0,
            created_at: '2026-08-01',
          },
        ],
      }),
    });
    const parsed = parseBackupFile(JSON.stringify(backup));
    expect(parsed.data.exercises[0]?.muscle_group).toBeNull();
  });

  it('rejects invalid JSON', () => {
    expectBackupError('{ definitely not json', 'invalidJson');
  });

  it('rejects non-object payloads', () => {
    expectBackupError('[1, 2, 3]', 'invalidStructure');
    expectBackupError('"hello"', 'invalidStructure');
  });

  it('rejects backups from another app', () => {
    expectBackupError(JSON.stringify(validBackup({ app: 'other-app' })), 'invalidApp');
  });

  it('rejects wrong backup types', () => {
    expectBackupError(JSON.stringify(validBackup({ type: 'csv' })), 'invalidType');
  });

  it('rejects unsupported backup versions', () => {
    expectBackupError(JSON.stringify(validBackup({ version: BACKUP_VERSION + 1 })), 'unsupportedVersion');
  });

  it('rejects backups from a newer database schema', () => {
    expectBackupError(
      JSON.stringify(validBackup({ databaseVersion: DATABASE_VERSION + 1 })),
      'newerDatabase'
    );
  });

  it('rejects missing tables', () => {
    const { data: tableData, ...rest } = validBackup();
    void tableData;
    expectBackupError(JSON.stringify(rest), 'missingTable');
  });

  it('rejects tables that are not arrays', () => {
    expectBackupError(
      JSON.stringify(validBackup({ data: { ...data(), routines: 'nope' } })),
      'missingTable'
    );
  });

  it('rejects rows that are not objects', () => {
    expectBackupError(
      JSON.stringify(validBackup({ data: data({ routines: [42] }) })),
      'invalidRow'
    );
  });

  it('rejects rows with wrongly-typed columns', () => {
    expectBackupError(
      JSON.stringify(
        validBackup({
          data: data({ routines: [{ id: 1, name: 42, description: null, created_at: 'x' }] }),
        })
      ),
      'invalidColumn'
    );
  });

  it('rejects boolean columns outside 0/1', () => {
    expectBackupError(
      JSON.stringify(
        validBackup({
          data: data({
            exercises: [
              {
                id: 1,
                name: 'Bench Press',
                muscle_group: null,
                icon: null,
                slug: null,
                source: 'custom',
                exercise_type: null,
                equipment: null,
                primary_muscle: null,
                secondary_muscles: null,
                is_stretch: 2,
                created_at: '2026-08-01',
              },
            ],
          }),
        })
      ),
      'invalidColumn'
    );
  });

  it('rejects rows without an integer id', () => {
    expectBackupError(
      JSON.stringify(
        validBackup({ data: data({ routines: [{ name: 'No id', description: null, created_at: 'x' }] }) })
      ),
      'invalidRowId'
    );
    // A non-numeric id fails the integer column check first.
    expectBackupError(
      JSON.stringify(
        validBackup({ data: data({ routines: [{ id: '1', name: 'x', description: null, created_at: 'x' }] }) })
      ),
      'invalidColumn'
    );
  });

  it('filters non-string preference values', () => {
    const backup = validBackup({
      preferences: { theme: 123, language: 'es', weeklyWorkouts: null, unknown: 'keep? no' },
    });
    const parsed = parseBackupFile(JSON.stringify(backup));
    expect(parsed.preferences).toEqual({ language: 'es' });
  });
});
