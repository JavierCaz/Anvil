import type { SQLiteDatabase } from 'expo-sqlite';
import dayjs from 'dayjs';

export interface WorkoutStats {
  /** Total completed workout sessions. */
  totalWorkouts: number;
  /** Sum of weight × reps across completed sets (kg). */
  totalVolumeKg: number;
  /** Consecutive days with at least one workout, ending today (or yesterday if none today). */
  currentStreak: number;
  /** Personal records set in the current calendar month. */
  prsThisMonth: number;
}

/**
 * Workout-related stats used by achievements and the home screen.
 */
export async function getWorkoutStats(db: SQLiteDatabase): Promise<WorkoutStats> {
  const totalWorkouts =
    (await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) AS c FROM workout_logs'))?.c ?? 0;

  const totalVolumeKg =
    (await db.getFirstAsync<{ v: number }>(`
      SELECT COALESCE(SUM(s.weight * s.reps), 0) AS v
      FROM sets s
      JOIN workout_logs wl ON s.workout_log_id = wl.id
      WHERE s.completed = 1
    `))?.v ?? 0;

  const now = dayjs();
  const monthStart = now.startOf('month');
  const monthEnd = now.endOf('month');
  const prsThisMonth =
    (await db.getFirstAsync<{ c: number }>(
      'SELECT COUNT(*) AS c FROM personal_records WHERE achieved_at >= ? AND achieved_at < ?',
      monthStart.toISOString(),
      monthEnd.toISOString()
    ))?.c ?? 0;

  return {
    totalWorkouts,
    totalVolumeKg,
    currentStreak: await getCurrentStreak(db),
    prsThisMonth,
  };
}

/**
 * Consecutive days (ending today, or yesterday when today has none) that have
 * at least one workout log. Uses local time so streaks match the user's day.
 */
async function getCurrentStreak(db: SQLiteDatabase): Promise<number> {
  const rows = await db.getAllAsync<{ d: string }>(
    `SELECT DISTINCT date(datetime(started_at, 'localtime')) AS d
     FROM workout_logs
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
     WHERE date(datetime(started_at, 'localtime')) BETWEEN ? AND ?
     ORDER BY d`,
    fromISO,
    toISO
  );
  return new Set(rows.map((row) => row.d));
}
