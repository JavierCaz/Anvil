import type { SQLiteDatabase } from 'expo-sqlite';
import type {
  Routine,
  RoutineExerciseSet,
  RoutineExerciseWithExercise,
  RoutineWithCount,
} from './types';

/** Default target volume when an exercise is added to a routine. */
export const DEFAULT_TARGET_SETS = 3;
export const DEFAULT_TARGET_REPS = 10;
export const DEFAULT_REST_SECONDS = 90;

export interface RoutineInput {
  name: string;
  description?: string | null;
}

/** All routines ordered newest-first, with their exercise count. */
export async function getRoutines(db: SQLiteDatabase): Promise<RoutineWithCount[]> {
  return db.getAllAsync<RoutineWithCount>(
    `SELECT r.*, COUNT(re.id) AS exercise_count
     FROM routines r
     LEFT JOIN routine_exercises re ON re.routine_id = r.id
     GROUP BY r.id
     ORDER BY r.created_at DESC, r.id DESC`
  );
}

export async function getRoutine(db: SQLiteDatabase, id: number): Promise<Routine | null> {
  return (await db.getFirstAsync<Routine>('SELECT * FROM routines WHERE id = ?', id)) ?? null;
}

/**
 * A routine's exercises, in their configured order, joined with exercise data
 * and the first planned set's reps/rest for the row summary.
 */
export async function getRoutineExercises(
  db: SQLiteDatabase,
  routineId: number
): Promise<RoutineExerciseWithExercise[]> {
  return db.getAllAsync<RoutineExerciseWithExercise>(
    `SELECT re.*,
            e.name AS exercise_name,
            e.slug AS exercise_slug,
            e.source AS exercise_source,
            e.muscle_group AS exercise_muscle_group,
            e.primary_muscle AS exercise_primary_muscle,
            e.equipment AS exercise_equipment,
            e.icon AS exercise_icon,
            e.is_stretch AS exercise_is_stretch,
            (SELECT res.reps FROM routine_exercise_sets res
              WHERE res.routine_exercise_id = re.id
              ORDER BY res.set_number ASC LIMIT 1) AS first_set_reps,
            (SELECT res.rest_seconds FROM routine_exercise_sets res
              WHERE res.routine_exercise_id = re.id
              ORDER BY res.set_number ASC LIMIT 1) AS first_set_rest
     FROM routine_exercises re
     JOIN exercises e ON e.id = re.exercise_id
     WHERE re.routine_id = ?
     ORDER BY re.order_index ASC, re.id ASC`,
    routineId
  );
}

/** One routine exercise joined with its exercise. */
export async function getRoutineExercise(
  db: SQLiteDatabase,
  routineExerciseId: number
): Promise<RoutineExerciseWithExercise | null> {
  return (
    (await db.getFirstAsync<RoutineExerciseWithExercise>(
      `SELECT re.*,
              e.name AS exercise_name,
              e.slug AS exercise_slug,
              e.source AS exercise_source,
              e.muscle_group AS exercise_muscle_group,
              e.primary_muscle AS exercise_primary_muscle,
              e.equipment AS exercise_equipment,
              e.icon AS exercise_icon,
              e.is_stretch AS exercise_is_stretch,
              (SELECT res.reps FROM routine_exercise_sets res
                WHERE res.routine_exercise_id = re.id
                ORDER BY res.set_number ASC LIMIT 1) AS first_set_reps,
              (SELECT res.rest_seconds FROM routine_exercise_sets res
                WHERE res.routine_exercise_id = re.id
                ORDER BY res.set_number ASC LIMIT 1) AS first_set_rest
       FROM routine_exercises re
       JOIN exercises e ON e.id = re.exercise_id
       WHERE re.id = ?`,
      routineExerciseId
    )) ?? null
  );
}

/** Per-set targets for a routine exercise, in ascending set order. */
export async function getRoutineExerciseSets(
  db: SQLiteDatabase,
  routineExerciseId: number
): Promise<RoutineExerciseSet[]> {
  return db.getAllAsync<RoutineExerciseSet>(
    `SELECT * FROM routine_exercise_sets
     WHERE routine_exercise_id = ?
     ORDER BY set_number ASC`,
    routineExerciseId
  );
}

/** Create a routine. Returns its id. */
export async function createRoutine(db: SQLiteDatabase, input: RoutineInput): Promise<number> {
  const name = input.name.trim();
  if (!name) {
    throw new Error('Routine name is required');
  }
  const result = await db.runAsync(
    'INSERT INTO routines (name, description) VALUES (?, ?)',
    name,
    input.description?.trim() || null
  );
  return result.lastInsertRowId;
}

/** Update a routine's name/description. Returns false when the row is missing. */
export async function updateRoutine(
  db: SQLiteDatabase,
  id: number,
  input: RoutineInput
): Promise<boolean> {
  const name = input.name.trim();
  if (!name) {
    throw new Error('Routine name is required');
  }
  const result = await db.runAsync(
    'UPDATE routines SET name = ?, description = ? WHERE id = ?',
    name,
    input.description?.trim() || null,
    id
  );
  return result.changes > 0;
}

/**
 * Delete a routine and its `routine_exercises` rows (FK ON DELETE CASCADE),
 * which cascade to `routine_exercise_sets`. Existing workout history keeps
 * the routine reference as NULL (ON DELETE SET NULL).
 */
export async function deleteRoutine(db: SQLiteDatabase, id: number): Promise<boolean> {
  const result = await db.runAsync('DELETE FROM routines WHERE id = ?', id);
  return result.changes > 0;
}

export interface TargetVolume {
  sets: number;
  reps: number;
  /** Planned rest between sets, in seconds. */
  restSeconds?: number;
  /** Optional planned weight (kg) applied to every set. */
  weight?: number | null;
}

/**
 * Append an exercise to a routine, creating one per-set target row per set.
 * Returns the new `routine_exercises` id.
 */
export async function addExerciseToRoutine(
  db: SQLiteDatabase,
  routineId: number,
  exerciseId: number,
  target: TargetVolume = {
    sets: DEFAULT_TARGET_SETS,
    reps: DEFAULT_TARGET_REPS,
    restSeconds: DEFAULT_REST_SECONDS,
  }
): Promise<number> {
  const setsCount = clampInt(target.sets, 1, 99);
  const reps = clampInt(target.reps, 1, 999);
  const restSeconds = clampInt(target.restSeconds ?? DEFAULT_REST_SECONDS, 0, 600);

  let routineExerciseId = 0;
  await db.withTransactionAsync(async () => {
    const row = await db.getFirstAsync<{ m: number | null }>(
      'SELECT MAX(order_index) AS m FROM routine_exercises WHERE routine_id = ?',
      routineId
    );
    const nextOrder = (row?.m ?? -1) + 1;
    const result = await db.runAsync(
      `INSERT INTO routine_exercises
         (routine_id, exercise_id, order_index, sets, reps, rest_seconds)
       VALUES (?, ?, ?, ?, ?, ?)`,
      routineId,
      exerciseId,
      nextOrder,
      setsCount,
      reps,
      restSeconds
    );
    routineExerciseId = result.lastInsertRowId;

    for (let setNumber = 1; setNumber <= setsCount; setNumber++) {
      await db.runAsync(
        `INSERT INTO routine_exercise_sets
           (routine_exercise_id, set_number, reps, rest_seconds, weight)
         VALUES (?, ?, ?, ?, ?)`,
        routineExerciseId,
        setNumber,
        reps,
        restSeconds,
        target.weight ?? null
      );
    }
  });
  return routineExerciseId;
}

export interface SetTargetInput {
  setNumber: number;
  reps: number;
  restSeconds: number;
  weight: number | null;
}

/**
 * Replace a routine exercise's per-set targets (transactional) and keep the
 * aggregate `sets` count + legacy reps/rest columns in sync.
 */
export async function saveRoutineExerciseSets(
  db: SQLiteDatabase,
  routineExerciseId: number,
  targets: SetTargetInput[]
): Promise<void> {
  if (targets.length === 0) {
    throw new Error('A routine exercise needs at least one set');
  }
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'DELETE FROM routine_exercise_sets WHERE routine_exercise_id = ?',
      routineExerciseId
    );
    for (const target of targets) {
      await db.runAsync(
        `INSERT INTO routine_exercise_sets
           (routine_exercise_id, set_number, reps, rest_seconds, weight)
         VALUES (?, ?, ?, ?, ?)`,
        routineExerciseId,
        target.setNumber,
        clampInt(target.reps, 1, 999),
        clampInt(target.restSeconds, 0, 600),
        target.weight && target.weight > 0 ? target.weight : null
      );
    }
    const first = targets[0];
    await db.runAsync(
      `UPDATE routine_exercises
       SET sets = ?, reps = ?, rest_seconds = ?
       WHERE id = ?`,
      targets.length,
      clampInt(first.reps, 1, 999),
      clampInt(first.restSeconds, 0, 600),
      routineExerciseId
    );
  });
}

/** Remove an exercise from a routine. Returns false when the row is missing. */
export async function removeExerciseFromRoutine(
  db: SQLiteDatabase,
  routineExerciseId: number
): Promise<boolean> {
  const result = await db.runAsync(
    'DELETE FROM routine_exercises WHERE id = ?',
    routineExerciseId
  );
  return result.changes > 0;
}

/**
 * Move a routine exercise one position up or down within its routine.
 * Returns false when the exercise isn't in the routine or already at an edge.
 */
export async function moveRoutineExercise(
  db: SQLiteDatabase,
  routineId: number,
  routineExerciseId: number,
  direction: 'up' | 'down'
): Promise<boolean> {
  const rows = await db.getAllAsync<{ id: number; order_index: number }>(
    `SELECT id, order_index FROM routine_exercises
     WHERE routine_id = ?
     ORDER BY order_index ASC, id ASC`,
    routineId
  );

  const index = rows.findIndex((row) => row.id === routineExerciseId);
  if (index === -1) {
    return false;
  }
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= rows.length) {
    return false;
  }

  const current = rows[index];
  const neighbor = rows[swapIndex];
  await db.withTransactionAsync(async () => {
    // Steer clear of transient duplicate order_index values.
    await db.runAsync('UPDATE routine_exercises SET order_index = -1 WHERE id = ?', current.id);
    await db.runAsync(
      'UPDATE routine_exercises SET order_index = ? WHERE id = ?',
      current.order_index,
      neighbor.id
    );
    await db.runAsync(
      'UPDATE routine_exercises SET order_index = ? WHERE id = ?',
      neighbor.order_index,
      current.id
    );
  });
  return true;
}

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}
