/**
 * Row types for the Anvil database.
 *
 * Column names map 1:1 to the SQLite schema in `src/db/schema.ts`.
 * SQLite stores BOOLEAN as INTEGER (0/1) and DATETIME as TEXT.
 */

export interface Routine {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

/** A routine plus the number of exercises it contains. */
export interface RoutineWithCount extends Routine {
  exercise_count: number;
}

export interface Exercise {
  id: number;
  name: string;
  muscle_group: string | null;
  icon: string | null;
  /**
   * Catalog exercises (`source = 'catalog'`) are keyed by this slug from
   * @bryllim/workout-guide. Custom exercises leave it null.
   */
  slug: string | null;
  /** `catalog` = from @bryllim/workout-guide (read-only); `custom` = user-created (CRUD). */
  source: 'catalog' | 'custom';
  /** @bryllim/workout-guide exercise type: weight_reps, bodyweight_reps, duration, distance_duration, assisted_bodyweight. */
  exercise_type: string | null;
  equipment: string | null;
  primary_muscle: string | null;
  /** JSON-encoded string array of secondary muscles (catalog exercises). */
  secondary_muscles: string | null;
  is_stretch: 0 | 1;
  created_at: string;
}

export interface RoutineExercise {
  id: number;
  routine_id: number;
  exercise_id: number;
  order_index: number;
  sets: number;
  reps: number;
  /** Planned rest between sets, in seconds (default 90). */
  rest_seconds: number;
}

/**
 * `routine_exercises` row joined with its exercise (denormalized columns
 * prefixed with `exercise_`), as returned by routine detail queries.
 */
export interface RoutineExerciseWithExercise extends RoutineExercise {
  exercise_name: string;
  exercise_slug: string | null;
  exercise_source: 'catalog' | 'custom';
  exercise_muscle_group: string | null;
  exercise_primary_muscle: string | null;
  exercise_equipment: string | null;
  exercise_icon: string | null;
  exercise_is_stretch: 0 | 1;
  /** Reps of the first planned set (for the routine row summary). */
  first_set_reps: number | null;
  /** Rest of the first planned set, in seconds (for the routine row summary). */
  first_set_rest: number | null;
}

/**
 * Per-set target for a routine exercise (set 1..N). The number of rows
 * matches `routine_exercises.sets`; each row carries its own reps, rest
 * and optional planned weight (kg).
 */
export interface RoutineExerciseSet {
  id: number;
  routine_exercise_id: number;
  set_number: number;
  reps: number;
  rest_seconds: number;
  weight: number | null;
}

export interface WorkoutLog {
  id: number;
  routine_id: number | null;
  started_at: string;
  completed_at: string | null;
  notes: string | null;
  /** 1 when the user added/removed sets during the session. */
  sets_edited: 0 | 1;
}

export interface WorkoutSet {
  id: number;
  workout_log_id: number;
  exercise_id: number;
  set_number: number;
  weight: number;
  reps: number;
  /** Rest taken after this set, in seconds. */
  rest_seconds: number;
  completed: 0 | 1;
}

/**
 * One exercise inside an active workout session: the routine's target
 * volume plus how many of those sets have already been logged.
 */
export interface ActiveWorkoutExercise {
  routine_exercise_id: number;
  exercise_id: number;
  exercise_name: string;
  exercise_slug: string | null;
  exercise_source: 'catalog' | 'custom';
  exercise_primary_muscle: string | null;
  exercise_equipment: string | null;
  target_sets: number;
  target_reps: number;
  /** Planned rest between sets from the routine (seconds). */
  target_rest_seconds: number;
  /** Per-set targets (reps/rest/planned weight) from the routine. */
  set_targets: RoutineExerciseSet[];
  order_index: number;
  completed_sets: number;
}

export interface WorkoutSummary {
  /** Session duration in seconds. */
  durationSeconds: number;
  /** Sum of weight × reps across completed sets (kg). */
  totalVolumeKg: number;
  /** Completed set count. */
  setsCompleted: number;
}

export interface PersonalRecord {
  id: number;
  exercise_id: number;
  weight: number;
  reps: number;
  achieved_at: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  key: string;
  unlocked_at: string | null;
}
