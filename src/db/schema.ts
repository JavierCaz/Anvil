/**
 * Anvil database schema.
 *
 * Versioned via SQLite's `PRAGMA user_version`. Never edit an already-applied
 * migration — append a new migration constant and bump `DATABASE_VERSION`.
 */

/** Current schema version. Bump when adding a new migration. */
export const DATABASE_VERSION = 2;

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

/** Ordered list of migrations, index = version they upgrade the DB to. */
export const MIGRATIONS: readonly string[] = [SCHEMA_V1, SCHEMA_V2];
