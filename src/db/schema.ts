/**
 * Anvil database schema.
 *
 * Versioned via SQLite's `PRAGMA user_version`. Never edit an already-applied
 * migration — append a new migration constant and bump `DATABASE_VERSION`.
 */

/** Current schema version. Bump when adding a new migration. */
export const DATABASE_VERSION = 7;

/**
 * Migration 1 — initial tables.
 *
 * Based on the reference schema:
 *   routines, exercises, routine_exercises, workout_logs,
 *   sets, personal_records, achievements
 */
export const SCHEMA_V1 = `
PRAGMA journal_mode = 'wal';
PRAGMA foreign_keys = 'on';

-- Workout routines (e.g., "Push Day", "Pull Day")
CREATE TABLE IF NOT EXISTS routines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Exercises (e.g., "Barbell Squat")
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  muscle_group TEXT, -- "Legs", "Chest", etc.
  icon TEXT, -- emoji or icon name
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Junction table: routine -> exercises (with order)
CREATE TABLE IF NOT EXISTS routine_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,
  order_index INTEGER DEFAULT 0,
  sets INTEGER DEFAULT 3,
  reps INTEGER DEFAULT 10,
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- Workout logs (each workout session)
CREATE TABLE IF NOT EXISTS workout_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  notes TEXT,
  -- SET NULL (not CASCADE): deleting a routine keeps workout history
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE SET NULL
);

-- Individual sets performed in a workout
CREATE TABLE IF NOT EXISTS sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_log_id INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,
  set_number INTEGER NOT NULL,
  weight REAL NOT NULL,
  reps INTEGER NOT NULL,
  completed BOOLEAN DEFAULT 1,
  FOREIGN KEY (workout_log_id) REFERENCES workout_logs(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Personal records (for gamification)
CREATE TABLE IF NOT EXISTS personal_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL,
  weight REAL NOT NULL,
  reps INTEGER NOT NULL,
  achieved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Badges/achievements (gamification)
CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  unlocked_at DATETIME
);

-- Lookup indexes for foreign-key joins
CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine_id ON routine_exercises(routine_id);
CREATE INDEX IF NOT EXISTS idx_routine_exercises_exercise_id ON routine_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_routine_id ON workout_logs(routine_id);
CREATE INDEX IF NOT EXISTS idx_sets_workout_log_id ON sets(workout_log_id);
CREATE INDEX IF NOT EXISTS idx_sets_exercise_id ON sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_exercise_id ON personal_records(exercise_id);
`;

/**
 * Migration 2 — achievement identity + seed catalog.
 *
 * Adds a stable programmatic `key` to `achievements` (needed to compute
 * progress and translate names) and seeds the initial achievement set
 * locked (`unlocked_at = NULL`) until earned.
 */
export const SCHEMA_V2 = `
ALTER TABLE achievements ADD COLUMN key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_achievements_key ON achievements(key);

INSERT INTO achievements (name, description, icon, key, unlocked_at) VALUES
  ('First Workout', 'Complete your first workout session', '🏋️', 'first_workout', NULL),
  ('1000kg Club', 'Reach 1000 kg of total lifting volume', '💪', 'thousand_kg_club', NULL),
  ('Consistency King', 'Work out 30 days in a row', '👑', 'consistency_king', NULL),
  ('Progressive Overload', 'Set 5 personal records in a month', '📈', 'progressive_overload', NULL);
`;

/**
 * Migration 3 — exercise catalog + custom exercises.
 *
 * Extends `exercises` so it can host the 302-exercise catalog from
 * `@bryllim/workout-guide` (`source = 'catalog'`, identified by `slug`)
 * alongside user-created exercises (`source = 'custom'`). Custom rows
 * are the only ones the user can create/update/delete.
 */
export const SCHEMA_V3 = `
ALTER TABLE exercises ADD COLUMN slug TEXT;
ALTER TABLE exercises ADD COLUMN source TEXT NOT NULL DEFAULT 'custom';
ALTER TABLE exercises ADD COLUMN exercise_type TEXT;
ALTER TABLE exercises ADD COLUMN equipment TEXT;
ALTER TABLE exercises ADD COLUMN primary_muscle TEXT;
ALTER TABLE exercises ADD COLUMN secondary_muscles TEXT; -- JSON array (catalog exercises)
ALTER TABLE exercises ADD COLUMN is_stretch INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_exercises_slug ON exercises(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_exercises_source ON exercises(source);
`;


/**
 * Migration 4 — workout session set logging.
 *
 * Adds per-set rest tracking and a natural key on `sets` so a set row can
 * be upserted (logged weight/reps/completed/rest) by
 * `(workout_log_id, exercise_id, set_number)`.
 */
export const SCHEMA_V4 = `
ALTER TABLE sets ADD COLUMN rest_seconds INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sets_workout_exercise_set
  ON sets(workout_log_id, exercise_id, set_number);
`;

/**
 * Migration 5 — planned rest time per routine exercise.
 *
 * Stores the default rest between sets (in seconds) on `routine_exercises`
 * so it can be configured while editing the routine and used as the default
 * when a workout session is started.
 */
export const SCHEMA_V5 = `
ALTER TABLE routine_exercises ADD COLUMN rest_seconds INTEGER NOT NULL DEFAULT 90;
`;

/**
 * Migration 6 — per-set targets for routine exercises.
 *
 * Each set in a routine now carries its own reps, rest and optional planned
 * weight (``routine_exercise_sets``). Existing aggregate data is backfilled
 * one row per set from ``routine_exercises.sets/reps/rest_seconds``.
 */
export const SCHEMA_V6 = `
CREATE TABLE IF NOT EXISTS routine_exercise_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_exercise_id INTEGER NOT NULL,
  set_number INTEGER NOT NULL,
  reps INTEGER NOT NULL DEFAULT 10,
  rest_seconds INTEGER NOT NULL DEFAULT 90,
  weight REAL,
  UNIQUE (routine_exercise_id, set_number),
  FOREIGN KEY (routine_exercise_id) REFERENCES routine_exercises(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_routine_exercise_sets_re
  ON routine_exercise_sets(routine_exercise_id);

WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x + 1 FROM cnt WHERE x < 99)
INSERT INTO routine_exercise_sets (routine_exercise_id, set_number, reps, rest_seconds, weight)
SELECT re.id, cnt.x, re.reps, re.rest_seconds, NULL
FROM routine_exercises re
JOIN cnt ON cnt.x <= re.sets
WHERE NOT EXISTS (SELECT 1 FROM routine_exercise_sets s WHERE s.routine_exercise_id = re.id);
`;

/**
 * Migration 7 — workout set-structure edit flag.
 *
 * Tracks whether the user added or removed sets during a session, so the
 * finish flow can offer to sync the new set count back to the routine.
 */
export const SCHEMA_V7 = `
ALTER TABLE workout_logs ADD COLUMN sets_edited INTEGER NOT NULL DEFAULT 0;
`;

export const MIGRATIONS: readonly string[] = [
  SCHEMA_V1,
  SCHEMA_V2,
  SCHEMA_V3,
  SCHEMA_V4,
  SCHEMA_V5,
  SCHEMA_V6,
  SCHEMA_V7,
];
