import type { SQLiteDatabase } from 'expo-sqlite';
import dayjs from 'dayjs';
import { getRoutineExerciseSets, saveRoutineExerciseSets, type SetTargetInput } from './routines';
import { getWeeklyConsistency } from './stats';
import type {
  ActiveWorkoutExercise,
  RoutineExerciseSet,
  WorkoutLog,
  WorkoutSet,
  WorkoutSummary,
} from './types';

/** Matches `useWeeklyGoalStore`'s default when no goal is supplied. */
const DEFAULT_WEEKLY_GOAL = 3;

export interface WorkoutStats {
  /** Total completed workout sessions. */
  totalWorkouts: number;
  /** Sum of weight × reps across completed sets (kg). */
  totalVolumeKg: number;
  /** Consecutive days with at least one workout, ending today (or yesterday if none today). */
  currentStreak: number;
  /** Personal records set in the current calendar month. */
  prsThisMonth: number;
  /** Heaviest single set ever completed (kg). Drives weight milestones. */
  maxWeightKg: number;
  /** Consecutive weeks meeting the weekly training goal (0 when goal is disabled). */
  consistencyStreakWeeks: number;
}

export interface GetWorkoutStatsOptions {
  /** The user's weekly training goal (days per week). Defaults to 3 (store default). */
  weeklyGoal?: number;
}

/**
 * Workout-related stats used by achievements and the home screen.
 */
export async function getWorkoutStats(
  db: SQLiteDatabase,
  options?: GetWorkoutStatsOptions
): Promise<WorkoutStats> {
  const totalWorkouts =
    (await db.getFirstAsync<{ c: number }>(
      'SELECT COUNT(*) AS c FROM workout_logs WHERE completed_at IS NOT NULL'
    ))?.c ?? 0;

  const totalVolumeKg =
    (await db.getFirstAsync<{ v: number }>(`
      SELECT COALESCE(SUM(s.weight * s.reps), 0) AS v
      FROM sets s
      JOIN workout_logs wl ON s.workout_log_id = wl.id
      WHERE s.completed = 1 AND wl.completed_at IS NOT NULL
    `))?.v ?? 0;

  const maxWeightKg =
    (await db.getFirstAsync<{ m: number }>(`
      SELECT COALESCE(MAX(s.weight), 0) AS m
      FROM sets s
      JOIN workout_logs wl ON s.workout_log_id = wl.id
      WHERE s.completed = 1 AND wl.completed_at IS NOT NULL AND s.weight > 0
    `))?.m ?? 0;

  const now = dayjs();
  const monthStart = now.startOf('month');
  const monthEnd = now.endOf('month');
  const prsThisMonth =
    (await db.getFirstAsync<{ c: number }>(
      'SELECT COUNT(*) AS c FROM personal_records WHERE achieved_at >= ? AND achieved_at < ?',
      monthStart.toISOString(),
      monthEnd.toISOString()
    ))?.c ?? 0;

  const { consistencyStreakWeeks } = await getWeeklyConsistency(
    db,
    options?.weeklyGoal ?? DEFAULT_WEEKLY_GOAL
  );

  return {
    totalWorkouts,
    totalVolumeKg,
    currentStreak: await getCurrentStreak(db),
    prsThisMonth,
    maxWeightKg,
    consistencyStreakWeeks,
  };
}

/**
 * Per-exercise metrics used by exercise-scoped achievements. Mirrors the
 * metric fields in `WorkoutStats` but scoped to a single exercise.
 */
export interface ExerciseStats {
  /** Cumulative weight × reps on this exercise across completed sessions (kg). */
  totalVolumeKg: number;
  /** Heaviest completed set on this exercise (kg). */
  maxWeightKg: number;
  /** Personal records set on this exercise in the current calendar month. */
  prsThisMonth: number;
}

/**
 * Per-exercise stats for a single exercise.
 */
export async function getExerciseStats(
  db: SQLiteDatabase,
  exerciseId: number
): Promise<ExerciseStats> {
  const volume = (await db.getFirstAsync<{ v: number }>(`
    SELECT COALESCE(SUM(s.weight * s.reps), 0) AS v
    FROM sets s
    JOIN workout_logs wl ON s.workout_log_id = wl.id
    WHERE s.exercise_id = ? AND s.completed = 1 AND wl.completed_at IS NOT NULL
  `
  , exerciseId))?.v ?? 0;

  const maxWeight = (await db.getFirstAsync<{ m: number }>(`
    SELECT COALESCE(MAX(s.weight), 0) AS m
    FROM sets s
    JOIN workout_logs wl ON s.workout_log_id = wl.id
    WHERE s.exercise_id = ? AND s.completed = 1 AND wl.completed_at IS NOT NULL AND s.weight > 0
  `
  , exerciseId))?.m ?? 0;

  const now = dayjs();
  const prsThisMonth = (await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) AS c FROM personal_records WHERE exercise_id = ? AND achieved_at >= ? AND achieved_at < ?',
    exerciseId,
    now.startOf('month').toISOString(),
    now.endOf('month').toISOString()
  ))?.c ?? 0;

  return { totalVolumeKg: volume, maxWeightKg: maxWeight, prsThisMonth };
}

/**
 * Per-exercise stats for every exercise, keyed by exercise id. Used to
 * compute exercise-scoped achievement progress for the catalog screens.
 */
export async function getAllExerciseStats(
  db: SQLiteDatabase
): Promise<Map<number, ExerciseStats>> {
  const rows = await db.getAllAsync<{ exercise_id: number; v: number }>(`
    SELECT s.exercise_id, COALESCE(SUM(s.weight * s.reps), 0) AS v
    FROM sets s
    JOIN workout_logs wl ON s.workout_log_id = wl.id
    WHERE s.completed = 1 AND wl.completed_at IS NOT NULL
    GROUP BY s.exercise_id
  `);
  const byExercise = new Map<number, ExerciseStats>();
  for (const row of rows) {
    byExercise.set(row.exercise_id, { totalVolumeKg: row.v, maxWeightKg: 0, prsThisMonth: 0 });
  }

  const maxRows = await db.getAllAsync<{ exercise_id: number; m: number }>(`
    SELECT s.exercise_id, COALESCE(MAX(s.weight), 0) AS m
    FROM sets s
    JOIN workout_logs wl ON s.workout_log_id = wl.id
    WHERE s.completed = 1 AND wl.completed_at IS NOT NULL AND s.weight > 0
    GROUP BY s.exercise_id
  `);
  for (const row of maxRows) {
    const entry = byExercise.get(row.exercise_id) ?? { totalVolumeKg: 0, maxWeightKg: 0, prsThisMonth: 0 };
    entry.maxWeightKg = row.m;
    byExercise.set(row.exercise_id, entry);
  }

  const now = dayjs();
  const prsRows = await db.getAllAsync<{ exercise_id: number; c: number }>(
    'SELECT exercise_id, COUNT(*) AS c FROM personal_records WHERE achieved_at >= ? AND achieved_at < ? GROUP BY exercise_id',
    now.startOf('month').toISOString(),
    now.endOf('month').toISOString()
  );
  for (const row of prsRows) {
    const entry = byExercise.get(row.exercise_id) ?? { totalVolumeKg: 0, maxWeightKg: 0, prsThisMonth: 0 };
    entry.prsThisMonth = row.c;
    byExercise.set(row.exercise_id, entry);
  }

  return byExercise;
}

/**
 * Consecutive days (ending today, or yesterday when today has none) that have
 * at least one workout log. Uses local time so streaks match the user's day.
 */
async function getCurrentStreak(db: SQLiteDatabase): Promise<number> {
  const rows = await db.getAllAsync<{ d: string }>(
    `SELECT DISTINCT date(datetime(started_at, 'localtime')) AS d
     FROM workout_logs
     WHERE completed_at IS NOT NULL
     ORDER BY d DESC`
  );
  const workoutDays = new Set(rows.map((row) => row.d));

  // If the user hasn't trained today, the streak is still alive through yesterday.
  let cursor = workoutDays.has(dayjs().format('YYYY-MM-DD'))
    ? dayjs()
    : dayjs().subtract(1, 'day');

  let streak = 0;
  while (workoutDays.has(cursor.format('YYYY-MM-DD'))) {
    streak += 1;
    cursor = cursor.subtract(1, 'day');
  }
  return streak;
}

/**
 * ISO dates (`YYYY-MM-DD`, local time) that have at least one workout log
 * within the inclusive `[fromISO, toISO]` range.
 */
export async function getWorkoutDaysInRange(
  db: SQLiteDatabase,
  fromISO: string,
  toISO: string
): Promise<Set<string>> {
  const rows = await db.getAllAsync<{ d: string }>(
    `SELECT DISTINCT date(datetime(started_at, 'localtime')) AS d
     FROM workout_logs
     WHERE completed_at IS NOT NULL
       AND date(datetime(started_at, 'localtime')) BETWEEN ? AND ?
     ORDER BY d`,
    fromISO,
    toISO
  );
  return new Set(rows.map((row) => row.d));
}

// ---------------------------------------------------------------------------
// Active workout session
// ---------------------------------------------------------------------------

/** Create a workout log for a routine. Returns the new log id. */
export async function startWorkout(db: SQLiteDatabase, routineId: number): Promise<number> {
  const result = await db.runAsync(
    'INSERT INTO workout_logs (routine_id, started_at) VALUES (?, ?)',
    routineId,
    new Date().toISOString()
  );
  return result.lastInsertRowId;
}

export async function getWorkoutLog(
  db: SQLiteDatabase,
  logId: number
): Promise<WorkoutLog | null> {
  return (await db.getFirstAsync<WorkoutLog>('SELECT * FROM workout_logs WHERE id = ?', logId)) ?? null;
}

export async function getWorkoutRoutineName(
  db: SQLiteDatabase,
  logId: number
): Promise<string | null> {
  const row = await db.getFirstAsync<{ name: string | null }>(
    `SELECT r.name AS name
     FROM workout_logs wl
     LEFT JOIN routines r ON r.id = wl.routine_id
     WHERE wl.id = ?`,
    logId
  );
  return row?.name ?? null;
}

/**
 * The routine's exercises for an active session, each with its target volume,
 * its routine's per-set targets, and the number of sets already completed.
 */
export async function getActiveWorkoutExercises(
  db: SQLiteDatabase,
  logId: number
): Promise<ActiveWorkoutExercise[]> {
  const rows = await db.getAllAsync<ActiveWorkoutExercise>(
    `SELECT re.id AS routine_exercise_id,
            e.id AS exercise_id,
            e.name AS exercise_name,
            e.slug AS exercise_slug,
            e.source AS exercise_source,
            e.primary_muscle AS exercise_primary_muscle,
            e.equipment AS exercise_equipment,
            MAX(re.sets, (SELECT COALESCE(MAX(s.set_number), 0) FROM sets s
              WHERE s.workout_log_id = wl.id AND s.exercise_id = e.id)) AS target_sets,
            re.reps AS target_reps,
            re.rest_seconds AS target_rest_seconds,
            re.order_index AS order_index,
            (SELECT COUNT(*) FROM sets s
              WHERE s.workout_log_id = ? AND s.exercise_id = e.id AND s.completed = 1)
              AS completed_sets
     FROM routine_exercises re
     JOIN exercises e ON e.id = re.exercise_id
     JOIN workout_logs wl ON wl.routine_id = re.routine_id
     WHERE wl.id = ?
     ORDER BY re.order_index ASC, re.id ASC`,
    logId,
    logId
  );

  if (rows.length === 0) {
    return [];
  }

  // Attach the routine's per-set targets in one batch query.
  const placeholders = rows.map(() => '?').join(', ');
  const setTargets = await db.getAllAsync<RoutineExerciseSet>(
    `SELECT * FROM routine_exercise_sets
     WHERE routine_exercise_id IN (${placeholders})
     ORDER BY routine_exercise_id ASC, set_number ASC`,
    ...rows.map((row) => row.routine_exercise_id)
  );

  const byRoutineExercise = new Map<number, RoutineExerciseSet[]>();
  for (const target of setTargets) {
    const list = byRoutineExercise.get(target.routine_exercise_id) ?? [];
    list.push(target);
    byRoutineExercise.set(target.routine_exercise_id, list);
  }

  return rows.map((row) => ({
    ...row,
    set_targets: byRoutineExercise.get(row.routine_exercise_id) ?? [],
  }));
}

/** One exercise (with target volume and per-set targets) inside an active session. */
export async function getActiveWorkoutExercise(
  db: SQLiteDatabase,
  logId: number,
  exerciseId: number
): Promise<ActiveWorkoutExercise | null> {
  const rows = await getActiveWorkoutExercises(db, logId);
  return rows.find((row) => row.exercise_id === exerciseId) ?? null;
}

/** Logged sets for one exercise in a session, in ascending set order. */
export async function getWorkoutSets(
  db: SQLiteDatabase,
  logId: number,
  exerciseId: number
): Promise<WorkoutSet[]> {
  return db.getAllAsync<WorkoutSet>(
    `SELECT * FROM sets
     WHERE workout_log_id = ? AND exercise_id = ?
     ORDER BY set_number ASC`,
    logId,
    exerciseId
  );
}

export interface SetLogInput {
  weight: number;
  reps: number;
  restSeconds: number;
  completed: 0 | 1;
}

/**
 * Insert or update the set row for (session, exercise, set number).
 * Rest is recorded after the set completes.
 */
export async function upsertSet(
  db: SQLiteDatabase,
  logId: number,
  exerciseId: number,
  setNumber: number,
  input: SetLogInput
): Promise<void> {
  await db.runAsync(
    `INSERT INTO sets (workout_log_id, exercise_id, set_number, weight, reps, rest_seconds, completed)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(workout_log_id, exercise_id, set_number)
     DO UPDATE SET weight = excluded.weight, reps = excluded.reps,
                   rest_seconds = excluded.rest_seconds, completed = excluded.completed`,
    logId,
    exerciseId,
    setNumber,
    input.weight,
    input.reps,
    input.restSeconds,
    input.completed
  );
}

/** Mark the session as finished (`completed_at` = now). */
export async function completeWorkout(db: SQLiteDatabase, logId: number): Promise<boolean> {
  const result = await db.runAsync(
    'UPDATE workout_logs SET completed_at = ? WHERE id = ? AND completed_at IS NULL',
    new Date().toISOString(),
    logId
  );
  return result.changes > 0;
}

/** Discard an unfinished session and its sets (FK CASCADE). */
export async function cancelWorkout(db: SQLiteDatabase, logId: number): Promise<boolean> {
  const result = await db.runAsync(
    'DELETE FROM workout_logs WHERE id = ? AND completed_at IS NULL',
    logId
  );
  return result.changes > 0;
}

export async function getWorkoutSummary(
  db: SQLiteDatabase,
  logId: number
): Promise<WorkoutSummary> {
  const log = await getWorkoutLog(db, logId);
  const started = log ? dayjs(log.started_at) : dayjs();
  const finished = log?.completed_at ? dayjs(log.completed_at) : dayjs();

  const row = await db.getFirstAsync<{ volume: number; sets: number }>(
    `SELECT COALESCE(SUM(weight * reps), 0) AS volume, COUNT(*) AS sets
     FROM sets WHERE workout_log_id = ? AND completed = 1`,
    logId
  );
  return {
    durationSeconds: Math.max(0, finished.diff(started, 'second')),
    totalVolumeKg: row?.volume ?? 0,
    setsCompleted: row?.sets ?? 0,
  };
}

/**
 * Mark that the user added or removed sets during the session (used by the
 * finish flow to offer syncing the new set count back to the routine).
 */
export async function markWorkoutSetsEdited(db: SQLiteDatabase, logId: number): Promise<void> {
  await db.runAsync('UPDATE workout_logs SET sets_edited = 1 WHERE id = ?', logId);
}

export async function wasWorkoutSetsEdited(db: SQLiteDatabase, logId: number): Promise<boolean> {
  const row = await db.getFirstAsync<{ sets_edited: number }>(
    'SELECT sets_edited FROM workout_logs WHERE id = ?',
    logId
  );
  return row?.sets_edited === 1;
}

/**
 * Delete a set row and renumber the ones after it (transactional), keeping
 * `set_number` contiguous after a mid-exercise removal.
 */
export async function deleteSetAndShift(
  db: SQLiteDatabase,
  logId: number,
  exerciseId: number,
  setNumber: number
): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'DELETE FROM sets WHERE workout_log_id = ? AND exercise_id = ? AND set_number = ?',
      logId,
      exerciseId,
      setNumber
    );
    await db.runAsync(
      `UPDATE sets SET set_number = set_number - 1
       WHERE workout_log_id = ? AND exercise_id = ? AND set_number > ?`
      , logId, exerciseId, setNumber
    );
  });
}

/**
 * Update each routine exercise's planned set count to match the finished
 * session (added/removed sets). Retained sets keep their routine values;
 * brand-new sets copy the first planned set's reps/rest/weight.
 */
export async function syncRoutineSetCountFromWorkout(
  db: SQLiteDatabase,
  logId: number
): Promise<void> {
  const exercises = await getActiveWorkoutExercises(db, logId);
  for (const exercise of exercises) {
    const row = await db.getFirstAsync<{ m: number | null }>(
      `SELECT MAX(set_number) AS m FROM sets
       WHERE workout_log_id = ? AND exercise_id = ?`,
      logId,
      exercise.exercise_id
    );
    const sessionSets = row?.m ?? 0;
    if (sessionSets === exercise.target_sets || sessionSets === 0) {
      continue;
    }

    const current = await getRoutineExerciseSets(db, exercise.routine_exercise_id);
    const template = current[0] ?? { reps: 10, rest_seconds: 90, weight: null };
    await saveRoutineExerciseSets(
      db,
      exercise.routine_exercise_id,
      Array.from({ length: sessionSets }, (_, i) => {
        const setNumber = i + 1;
        const existing = current.find((set) => set.set_number === setNumber);
        return {
          setNumber,
          reps: existing?.reps ?? template.reps ?? 10,
          restSeconds: existing?.rest_seconds ?? template.rest_seconds ?? 90,
          weight: existing?.weight ?? template.weight ?? null,
        };
      })
    );
  }
}

/**
 * An exercise whose logged set values differ from the routine's planned
 * per-set defaults (weight / reps / rest).
 */
export interface RoutineSetValueChange {
  routine_exercise_id: number;
  exercise_id: number;
  exercise_name: string;
}

/**
 * Comparison tolerance for weights in kg. Absorbs float noise from
 * display-unit round-trips (kg → lb → kg) so untouched prefilled values
 * don't count as changes.
 */
const WEIGHT_EPSILON_KG = 0.01;

/**
 * Exercises in an active session whose logged (completed) set values differ
 * from the routine's per-set defaults. Added/removed sets (count changes)
 * are not flagged here — those are handled by `wasWorkoutSetsEdited`.
 */
export async function getRoutineSetValueChanges(
  db: SQLiteDatabase,
  logId: number
): Promise<RoutineSetValueChange[]> {
  const log = await getWorkoutLog(db, logId);
  if (!log?.routine_id) {
    return [];
  }
  const exercises = await getActiveWorkoutExercises(db, logId);
  const changes: RoutineSetValueChange[] = [];

  for (const exercise of exercises) {
    const planned = new Map(exercise.set_targets.map((set) => [set.set_number, set]));
    if (planned.size === 0) {
      continue;
    }
    const logged = (await getWorkoutSets(db, logId, exercise.exercise_id)).filter(
      (set) => set.completed === 1
    );

    let changed = false;
    for (const set of logged) {
      const target = planned.get(set.set_number);
      if (!target) {
        continue; // added set — a count change, handled elsewhere
      }
      const weightDiff = Math.abs(set.weight - (target.weight ?? 0)) > WEIGHT_EPSILON_KG;
      if (weightDiff || set.reps !== target.reps || set.rest_seconds !== target.rest_seconds) {
        changed = true;
        break;
      }
    }
    if (changed) {
      changes.push({
        routine_exercise_id: exercise.routine_exercise_id,
        exercise_id: exercise.exercise_id,
        exercise_name: exercise.exercise_name,
      });
    }
  }
  return changes;
}

/**
 * Overlay the logged set values back onto a routine exercise's per-set
 * defaults (weight / reps / rest). The planned set count is preserved —
 * only sets the user actually completed get their values updated. Count
 * changes stay the responsibility of `syncRoutineSetCountFromWorkout`.
 */
export async function syncRoutineSetValuesFromWorkout(
  db: SQLiteDatabase,
  logId: number
): Promise<void> {
  const changes = await getRoutineSetValueChanges(db, logId);
  for (const change of changes) {
    const planned = await getRoutineExerciseSets(db, change.routine_exercise_id);
    const logged = new Map(
      (await getWorkoutSets(db, logId, change.exercise_id))
        .filter((set) => set.completed === 1)
        .map((set) => [set.set_number, set])
    );
    const targets: SetTargetInput[] = planned.map((target) => {
      const loggedSet = logged.get(target.set_number);
      if (!loggedSet) {
        return {
          setNumber: target.set_number,
          reps: target.reps,
          restSeconds: target.rest_seconds,
          weight: target.weight,
        };
      }
      return {
        setNumber: target.set_number,
        reps: loggedSet.reps,
        restSeconds: loggedSet.rest_seconds,
        weight: loggedSet.weight > 0 ? loggedSet.weight : null,
      };
    });
    if (targets.length > 0) {
      await saveRoutineExerciseSets(db, change.routine_exercise_id, targets);
    }
  }
}
