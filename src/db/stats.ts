import type { SQLiteDatabase } from 'expo-sqlite';
import dayjs from 'dayjs';

/**
 * Statistics aggregations for the Statistics screen.
 *
 * All functions take the `db` as the first argument and accept an optional
 * `[fromISO, toISO)` UTC range (exclusive end). Pass `null`/`undefined` for
 * either bound to leave it unbounded ("all time"). Only completed sessions
 * (`completed_at IS NOT NULL`) and completed sets (`completed = 1`) count.
 */

export interface SessionStats {
  /** Completed workout sessions in range. */
  sessions: number;
  /** Sum of session durations, in seconds. */
  totalSeconds: number;
  /** Mean session duration, in seconds (0 when there are no sessions). */
  avgSeconds: number;
  /** Completed sets in range. */
  setsCompleted: number;
}

export interface MuscleSlice {
  /** Muscle group (from `exercises.primary_muscle` or legacy `muscle_group`). Null = unspecified. */
  muscle: string | null;
  /** Completed sets performed for that muscle. */
  sets: number;
}

export interface DayCount {
  /** Local-time day, `YYYY-MM-DD`. */
  day: string;
  /** Completed sessions that day. */
  count: number;
}

export interface WeeklyConsistency {
  /** Distinct local days this ISO week (Monday start) with a completed workout. */
  weeklyDays: number;
  /** The user's intended weekly training frequency. */
  weeklyGoal: number;
  /** `weeklyDays >= weeklyGoal` (always false when `weeklyGoal` is 0). */
  hitThisWeek: boolean;
  /** Consecutive weeks meeting the goal, ending at the current week (if hit) or the last completed week. An in-progress week never breaks it. */
  consistencyStreakWeeks: number;
}

/** Helper: appends an optional `started_at >= ? AND started_at < ?` clause. */
function rangeParams(fromISO: string | null | undefined, toISO: string | null | undefined) {
  const where: string[] = [];
  const params: string[] = [];
  if (fromISO) {
    where.push('started_at >= ?');
    params.push(fromISO);
  }
  if (toISO) {
    where.push('started_at < ?');
    params.push(toISO);
  }
  return { clause: where.length ? `AND ${where.join(' AND ')}` : '', params };
}

/** Session count + total/avg duration for the given range. */
export async function getSessionStats(
  db: SQLiteDatabase,
  fromISO?: string | null,
  toISO?: string | null
): Promise<SessionStats> {
  const { clause, params } = rangeParams(fromISO, toISO);

  const row = await db.getFirstAsync<{ sessions: number; total_seconds: number }>(
    `SELECT COUNT(*) AS sessions,
            COALESCE(SUM((strftime('%s', completed_at) - strftime('%s', started_at))), 0) AS total_seconds
     FROM workout_logs
     WHERE completed_at IS NOT NULL ${clause}`,
    ...params
  );

  const setsRow = await db.getFirstAsync<{ c: number }>(
    `SELECT COUNT(*) AS c
     FROM sets s
     JOIN workout_logs wl ON wl.id = s.workout_log_id
     WHERE s.completed = 1 AND wl.completed_at IS NOT NULL ${clause}`,
    ...params
  );

  const sessions = row?.sessions ?? 0;
  const totalSeconds = row?.total_seconds ?? 0;

  return {
    sessions,
    totalSeconds,
    avgSeconds: sessions > 0 ? Math.round(totalSeconds / sessions) : 0,
    setsCompleted: setsRow?.c ?? 0,
  };
}

/** Completed sets per muscle group (primary muscle, falling back to legacy muscle_group). */
export async function getMuscleDistribution(
  db: SQLiteDatabase,
  fromISO?: string | null,
  toISO?: string | null
): Promise<MuscleSlice[]> {
  const { clause, params } = rangeParams(fromISO, toISO);

  const rows = await db.getAllAsync<{ muscle: string | null; sets: number }>(
    `SELECT COALESCE(e.primary_muscle, e.muscle_group) AS muscle, COUNT(*) AS sets
     FROM sets s
     JOIN workout_logs wl ON wl.id = s.workout_log_id
     JOIN exercises e ON e.id = s.exercise_id
     WHERE s.completed = 1 AND wl.completed_at IS NOT NULL ${clause}
     GROUP BY COALESCE(e.primary_muscle, e.muscle_group)
     ORDER BY sets DESC`,
    ...params
  );

  return rows;
}

/** Completed sessions per local-time day, ascending. */
export async function getWorkoutDayCounts(
  db: SQLiteDatabase,
  fromISO?: string | null,
  toISO?: string | null
): Promise<DayCount[]> {
  const { clause, params } = rangeParams(fromISO, toISO);

  return db.getAllAsync<DayCount>(
    `SELECT date(datetime(started_at, 'localtime')) AS day, COUNT(*) AS count
     FROM workout_logs
     WHERE completed_at IS NOT NULL ${clause}
     GROUP BY date(datetime(started_at, 'localtime'))
     ORDER BY day ASC`,
    ...params
  );
}

// ---------------------------------------------------------------------------
// Weekly consistency (sustainable training: weeks, not daily streaks)
// ---------------------------------------------------------------------------

/**
 * Consecutive weeks meeting the user's weekly training goal, derived from
 * completed workouts (`completed_at`). Rest days are fine — only a full week
 * below the goal breaks the streak. The current in-progress week contributes
 * to `weeklyDays`/`hitThisWeek` but never breaks the streak. When `weeklyGoal`
 * is 0 the feature is disabled entirely.
 */
export async function getWeeklyConsistency(
  db: SQLiteDatabase,
  weeklyGoal: number
): Promise<WeeklyConsistency> {
  const goal = Math.max(0, Math.round(weeklyGoal));

  const rows = await db.getAllAsync<{ day: string }>(
    `SELECT DISTINCT date(datetime(completed_at, 'localtime')) AS day
     FROM workout_logs
     WHERE completed_at IS NOT NULL
     ORDER BY day ASC`
  );
  const workoutDays = new Set(rows.map((row) => row.day));

  const countDaysInRange = (from: dayjs.Dayjs, to: dayjs.Dayjs): number => {
    let count = 0;
    let cursor = from;
    while (!cursor.isAfter(to, 'day')) {
      if (workoutDays.has(cursor.format('YYYY-MM-DD'))) {
        count += 1;
      }
      cursor = cursor.add(1, 'day');
    }
    return count;
  };

  const now = dayjs();
  const currentMonday = mondayOf(now);
  const weeklyDays = countDaysInRange(currentMonday, now);
  const hitThisWeek = goal > 0 && weeklyDays >= goal;

  // Streak counts hit weeks ending at the current week (if already hit) or the
  // last fully-completed week, walking backward until a week misses the goal.
  let consistencyStreakWeeks = hitThisWeek ? 1 : 0;
  let cursor = currentMonday.subtract(7, 'day');
  while (goal > 0) {
    const weekDays = countDaysInRange(cursor, cursor.add(6, 'day'));
    if (weekDays < goal) {
      break;
    }
    consistencyStreakWeeks += 1;
    cursor = cursor.subtract(7, 'day');
  }

  return { weeklyDays, weeklyGoal: goal, hitThisWeek, consistencyStreakWeeks };
}
// ---------------------------------------------------------------------------
// Pure bucketing helpers (unit-testable, no DB access)
// ---------------------------------------------------------------------------

export type BucketGranularity = 'day' | 'week' | 'month';

export interface TimeSeriesPoint {
  /** Start of the bucket as a local-time day, `YYYY-MM-DD`. */
  start: string;
  /** Sessions in the bucket (zero-filled). */
  count: number;
}

/** Monday of the week containing `day` (dayjs), independent of locale week start. */
function mondayOf(day: dayjs.Dayjs): dayjs.Dayjs {
  const weekday = day.day(); // 0 = Sunday … 6 = Saturday
  return (weekday === 0 ? day.subtract(6, 'day') : day.subtract(weekday - 1, 'day')).startOf('day');
}

/** Bucket start for a day under the given granularity. */
function bucketStart(day: string, granularity: BucketGranularity): string {
  const d = dayjs(day);
  if (granularity === 'week') {
    return mondayOf(d).format('YYYY-MM-DD');
  }
  if (granularity === 'month') {
    return d.startOf('month').format('YYYY-MM-DD');
  }
  return d.format('YYYY-MM-DD');
}

function addBucket(start: string, granularity: BucketGranularity): string {
  const d = dayjs(start);
  if (granularity === 'week') {
    return d.add(7, 'day').format('YYYY-MM-DD');
  }
  if (granularity === 'month') {
    return d.add(1, 'month').format('YYYY-MM-DD');
  }
  return d.add(1, 'day').format('YYYY-MM-DD');
}

/**
 * Aggregates per-day session counts into a continuous, zero-filled time series.
 *
 * With a `[fromISO, toISO)` range the series spans `[from, to)` — bucket starts
 * are generated while they are `< to` — so a week filter yields exactly 7 daily
 * buckets and a month filter the month's 4-5 week buckets. Without a range it
 * spans the first through last workout day buckets (inclusive).
 */
export function buildTimeSeries(
  days: DayCount[],
  granularity: BucketGranularity,
  fromISO?: string | null,
  toISO?: string | null
): TimeSeriesPoint[] {
  const counts = new Map<string, number>();
  for (const { day, count } of days) {
    const key = bucketStart(day, granularity);
    counts.set(key, (counts.get(key) ?? 0) + count);
  }


  // Convert an ISO instant to its local-time day (round-trips the screen's
  // local-midnight `.toISOString()` bounds).
  const toLocalDay = (iso: string) => dayjs(iso).format('YYYY-MM-DD');

  const firstWorkout = days.length > 0 ? days[0].day : null;
  const lastWorkout = days.length > 0 ? days[days.length - 1].day : null;

  // A missing bound falls back to the data extent (or the other bound).
  const fromDay = fromISO ? toLocalDay(fromISO) : firstWorkout;
  const toDay = toISO ? toLocalDay(toISO) : lastWorkout;

  if (!fromDay || !toDay) {
    return [];
  }

  const first = bucketStart(fromDay, granularity);
  // Exclusive end: the raw range day (unbucketed) so a week filter shows
  // Mon..Sun and a month filter never leaks into the next month. Without a
  // `toISO` bound, end on the last workout's bucket (inclusive).
  const end = toISO ? toDay : bucketStart(toDay, granularity);

  const points: TimeSeriesPoint[] = [];
  let cursor = first;
  while (toISO ? cursor < end : cursor <= end) {
    points.push({ start: cursor, count: counts.get(cursor) ?? 0 });
    cursor = addBucket(cursor, granularity);
  }
  return points;
}
