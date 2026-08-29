import { exercises as catalogExercises } from '@bryllim/workout-guide';
import type { SQLiteDatabase } from 'expo-sqlite';
import type { Exercise } from './types';

/**
 * Exercises data access.
 *
 * The `exercises` table hosts two kinds of rows:
 * - `source = 'catalog'` — the 302-exercise catalog from @bryllim/workout-guide,
 *   seeded idempotently by `seedExerciseCatalog()`. Read-only: the user can
 *   never create/update/delete these.
 * - `source = 'custom'` — exercises the user created themselves. Full CRUD.
 */

export interface ExerciseFilters {
  /** Case-insensitive substring match on the exercise name. */
  search?: string;
  /** Filter by exact primary muscle (English name from the catalog). */
  muscle?: string | null;
}

/** Seed catalog rows that aren't present yet (keyed by unique slug). Idempotent. */
export async function seedExerciseCatalog(db: SQLiteDatabase): Promise<void> {
  const rows = await db.getAllAsync<{ slug: string }>(
    'SELECT slug FROM exercises WHERE slug IS NOT NULL'
  );
  const existing = new Set(rows.map((row) => row.slug));
  const missing = catalogExercises.filter((exercise) => !existing.has(exercise.slug));

  if (missing.length === 0) {
    return;
  }

  await db.withTransactionAsync(async () => {
    for (const exercise of missing) {
      await db.runAsync(
        `INSERT INTO exercises
           (name, slug, source, exercise_type, equipment, primary_muscle,
            muscle_group, secondary_muscles, is_stretch)
         VALUES (?, ?, 'catalog', ?, ?, ?, ?, ?, ?)`,
        exercise.name,
        exercise.slug,
        exercise.exerciseType,
        exercise.equipment,
        exercise.primaryMuscle,
        exercise.primaryMuscle,
        JSON.stringify(exercise.secondaryMuscles),
        exercise.isStretch ? 1 : 0
      );
    }
  });
}

/**
 * All exercises (catalog + custom) for the add-to-routine picker.
 * Custom exercises sort first; matches are ordered alphabetically.
 */
export async function getExercises(
  db: SQLiteDatabase,
  filters: ExerciseFilters = {}
): Promise<Exercise[]> {
  const search = filters.search?.trim() ?? '';
  const muscle = filters.muscle?.trim() || null;

  return db.getAllAsync<Exercise>(
    `SELECT * FROM exercises
     WHERE (? = '' OR name LIKE '%' || ? || '%')
       AND (? IS NULL OR primary_muscle = ?)
     ORDER BY CASE WHEN source = 'custom' THEN 0 ELSE 1 END, name COLLATE NOCASE ASC`,
    search,
    search,
    muscle,
    muscle
  );
}

/** Distinct primary muscles present in the exercise table (for filter chips). */
export async function getExerciseMuscles(db: SQLiteDatabase): Promise<string[]> {
  const rows = await db.getAllAsync<{ m: string }>(
    'SELECT DISTINCT primary_muscle AS m FROM exercises WHERE primary_muscle IS NOT NULL ORDER BY m'
  );
  return rows.map((row) => row.m);
}

export async function getExerciseById(db: SQLiteDatabase, id: number): Promise<Exercise | null> {
  return (await db.getFirstAsync<Exercise>('SELECT * FROM exercises WHERE id = ?', id)) ?? null;
}

export interface NewExerciseInput {
  name: string;
  muscleGroup?: string | null;
  equipment?: string | null;
  exerciseType?: string | null;
}

export type UpdateExerciseInput = NewExerciseInput;

/** Create a user-defined exercise (`source = 'custom'`). Returns its id. */
export async function createExercise(
  db: SQLiteDatabase,
  input: NewExerciseInput
): Promise<number> {
  const name = input.name.trim();
  if (!name) {
    throw new Error('Exercise name is required');
  }
  const result = await db.runAsync(
    `INSERT INTO exercises
       (name, source, exercise_type, equipment, primary_muscle, muscle_group)
     VALUES (?, 'custom', ?, ?, ?, ?)`,
    name,
    input.exerciseType?.trim() || null,
    input.equipment?.trim() || null,
    input.muscleGroup?.trim() || null,
    input.muscleGroup?.trim() || null
  );
  return result.lastInsertRowId;
}

/** Update a user-defined exercise. Returns false when the row is not custom / missing. */
export async function updateExercise(
  db: SQLiteDatabase,
  id: number,
  input: UpdateExerciseInput
): Promise<boolean> {
  const name = input.name.trim();
  if (!name) {
    throw new Error('Exercise name is required');
  }
  const result = await db.runAsync(
    `UPDATE exercises SET
       name = ?, exercise_type = ?, equipment = ?, primary_muscle = ?, muscle_group = ?
     WHERE id = ? AND source = 'custom'`,
    name,
    input.exerciseType?.trim() || null,
    input.equipment?.trim() || null,
    input.muscleGroup?.trim() || null,
    input.muscleGroup?.trim() || null,
    id
  );
  return result.changes > 0;
}

/**
 * Delete a user-defined exercise. Catalog rows are protected.
 * `routine_exercises` rows referencing it cascade (FK ON DELETE CASCADE).
 * Returns false when the row is not custom / missing.
 */
export async function deleteExercise(db: SQLiteDatabase, id: number): Promise<boolean> {
  const result = await db.runAsync(
    "DELETE FROM exercises WHERE id = ? AND source = 'custom'",
    id
  );
  return result.changes > 0;
}
