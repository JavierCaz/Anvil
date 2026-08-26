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

export interface Exercise {
  id: number;
  name: string;
  muscle_group: string | null;
  icon: string | null;
  created_at: string;
}

export interface RoutineExercise {
  id: number;
  routine_id: number;
  exercise_id: number;
  order_index: number;
  sets: number;
  reps: number;
}

export interface WorkoutLog {
  id: number;
  routine_id: number | null;
  started_at: string;
  completed_at: string | null;
  notes: string | null;
}

export interface WorkoutSet {
  id: number;
  workout_log_id: number;
  exercise_id: number;
  set_number: number;
  weight: number;
  reps: number;
  completed: 0 | 1;
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
