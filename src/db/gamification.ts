import type { SQLiteDatabase } from 'expo-sqlite';
import dayjs from 'dayjs';
import {
  getNextWeightComparative,
  getWeightComparativeByKey,
  type WeightComparativeDefinition,
} from '@/constants/weight-comparatives';
import { getAchievements, unlockAchievementIfNew } from './achievements';
import { getWeeklyConsistency, type WeeklyConsistency } from './stats';
import {
  getActiveWorkoutExercises,
  getWorkoutLog,
  getWorkoutRoutineName,
  getWorkoutSets,
  getWorkoutSummary,
  getWorkoutStats,
} from './workouts';
import type { WorkoutSummary } from './types';
import { getAchievementByKey, METRIC_READERS } from '@/constants/achievements';

/**
 * Gamification derivations: PR detection, weekly consistency, and the
 * post-workout recap. Everything is computed from existing workout data —
 * no new tables or columns. All queries filter completed sessions/sets so a
 * discarded or in-progress workout never counts.
 */

export type PRType = 'weight' | 'oneRM';

export interface DetectedPR {
  exerciseId: number;
  exerciseName: string;
  type: PRType;
  /** The record-setting set's weight. */
  weight: number;
  /** The record-setting set's reps. */
  reps: number;
  /** Epley estimate for a 1RM PR (null for weight PRs). */
  oneRM: number | null;
}

export interface WorkoutRecap {
  routineName: string | null;
  summary: WorkoutSummary;
  /** % volume change vs the previous completed workout of the same routine. Null when not comparable. */
  volumeDeltaPct: number | null;
  /** Personal records set during this session (also written to `personal_records`). */
  prs: DetectedPR[];
  /** Weight milestones unlocked during this session, ascending by threshold. */
  milestonesUnlocked: WeightComparativeDefinition[];
  /** The next milestone above the heaviest set ever lifted, or null when all are reached. */
  nextMilestone: WeightComparativeDefinition | null;
  /** Heaviest single completed set (kg) — drives the distance to the next milestone. */
  maxWeightKg: number;
  consistency: WeeklyConsistency;
  /** Keys of achievements newly unlocked by this session (aggregate-earned and event-based). */
  achievementsUnlocked: string[];
}

interface SetRow {
  exercise_id: number;
  exercise_name: string;
  weight: number;
  reps: number;
}

/**
 * Epley 1RM estimate: `weight × (1 + reps / 30)`.
 * Only meaningful for moderate rep counts — higher-rep sets are ignored for
 * the 1RM metric (pure heaviness is covered by the weight PR).
 */
export function epley1RM(weight: number, reps: number): number | null {
  if (weight <= 0 || reps < 1 || reps > 12) {
    return null;
  }
  return weight * (1 + reps / 30);
}

interface ExerciseAggregate {
  name: string;
  bestWeight: number;
  weightSet: SetRow | null;
  bestOneRM: number;
  oneRMSet: SetRow | null;
}

function buildSessionAggregates(rows: SetRow[]): Map<number, ExerciseAggregate> {
  const byExercise = new Map<number, ExerciseAggregate>();
  for (const row of rows) {
    const agg = byExercise.get(row.exercise_id) ?? {
      name: row.exercise_name,
      bestWeight: 0,
      weightSet: null,
      bestOneRM: 0,
      oneRMSet: null,
    };
    agg.name = row.exercise_name;
    if (row.weight > agg.bestWeight) {
      agg.bestWeight = row.weight;
      agg.weightSet = row;
    }
    const est = epley1RM(row.weight, row.reps);
    if (est !== null && est > agg.bestOneRM) {
      agg.bestOneRM = est;
      agg.oneRMSet = row;
    }
    byExercise.set(row.exercise_id, agg);
  }
  return byExercise;
}

function buildHistoryBests(rows: SetRow[]): Map<number, { bestWeight: number; bestOneRM: number }> {
  const byExercise = new Map<number, { bestWeight: number; bestOneRM: number }>();
  for (const row of rows) {
    const agg = byExercise.get(row.exercise_id) ?? { bestWeight: 0, bestOneRM: 0 };
    agg.bestWeight = Math.max(agg.bestWeight, row.weight);
    const est = epley1RM(row.weight, row.reps);
    if (est !== null) {
      agg.bestOneRM = Math.max(agg.bestOneRM, est);
    }
    byExercise.set(row.exercise_id, agg);
  }
  return byExercise;
}

/**
 * Detect per-exercise PRs for a completed session (heaviest weight and best
 * Epley 1RM vs all prior completed sessions), record them in the existing
 * `personal_records` table, and return them for display. The first-ever
 * session for an exercise never counts as a PR.
 */
export async function detectAndRecordPRs(
  db: SQLiteDatabase,
  logId: number
): Promise<DetectedPR[]> {
  const log = await getWorkoutLog(db, logId);
  if (!log?.completed_at) {
    return [];
  }

  const sessionRows = await db.getAllAsync<SetRow>(
    `SELECT s.exercise_id, e.name AS exercise_name, s.weight, s.reps
     FROM sets s
     JOIN exercises e ON e.id = s.exercise_id
     WHERE s.workout_log_id = ? AND s.completed = 1 AND s.weight > 0
     ORDER BY s.exercise_id, s.set_number`,
    logId
  );
  if (sessionRows.length === 0) {
    return [];
  }

  const historyRows = await db.getAllAsync<SetRow>(
    `SELECT s.exercise_id, e.name AS exercise_name, s.weight, s.reps
     FROM sets s
     JOIN exercises e ON e.id = s.exercise_id
     JOIN workout_logs wl ON wl.id = s.workout_log_id
     WHERE s.completed = 1 AND wl.completed_at IS NOT NULL
       AND s.workout_log_id != ? AND s.weight > 0`,
    logId
  );

  const session = buildSessionAggregates(sessionRows);
  const history = buildHistoryBests(historyRows);

  const detected: DetectedPR[] = [];
  for (const [exerciseId, agg] of session) {
    const prior = history.get(exerciseId);
    // No prior history for this exercise → first time, not a PR.
    if (!prior) {
      continue;
    }

    if (agg.bestWeight > prior.bestWeight && agg.weightSet) {
      const set = agg.weightSet;
      detected.push({
        exerciseId,
        exerciseName: agg.name,
        type: 'weight',
        weight: set.weight,
        reps: set.reps,
        oneRM: null,
      });
      await insertPersonalRecord(db, exerciseId, set.weight, set.reps, log.completed_at);
    }

    if (agg.bestOneRM > prior.bestOneRM && agg.oneRMSet) {
      const set = agg.oneRMSet;
      detected.push({
        exerciseId,
        exerciseName: agg.name,
        type: 'oneRM',
        weight: set.weight,
        reps: set.reps,
        oneRM: agg.bestOneRM,
      });
      await insertPersonalRecord(db, exerciseId, set.weight, set.reps, log.completed_at);
    }
  }

  return detected;
}

async function insertPersonalRecord(
  db: SQLiteDatabase,
  exerciseId: number,
  weight: number,
  reps: number,
  achievedAt: string
): Promise<void> {
  await db.runAsync(
    'INSERT INTO personal_records (exercise_id, weight, reps, achieved_at) VALUES (?, ?, ?, ?)',
    exerciseId,
    weight,
    reps,
    achievedAt
  );
}

/**
 * Unlock event-based "special" achievements for a completed session. Returns
 * the keys that were newly unlocked. Hour ranges: night_shift = 00:00–03:59,
 * early_bird = 04:00–05:59 (so they never double-fire).
 */
export async function detectAndUnlockSpecials(
  db: SQLiteDatabase,
  logId: number,
  weeklyGoal: number
): Promise<string[]> {
  const log = await getWorkoutLog(db, logId);
  if (!log?.completed_at) {
    return [];
  }
  const unlocked: string[] = [];

  const startHour = dayjs(log.started_at).hour();
  if (startHour >= 0 && startHour < 4) {
    if (await unlockAchievementIfNew(db, 'night_shift')) {
      unlocked.push('night_shift');
    }
  } else if (startHour >= 4 && startHour < 6) {
    if (await unlockAchievementIfNew(db, 'early_bird')) {
      unlocked.push('early_bird');
    }
  }

  // One More Rep: any completed set above its planned reps (per-set target, falling back to the exercise's target reps).
  const exercises = await getActiveWorkoutExercises(db, logId);
  outer: for (const exercise of exercises) {
    const sets = await getWorkoutSets(db, logId, exercise.exercise_id);
    for (const set of sets) {
      if (set.completed !== 1 || set.reps <= 0) {
        continue;
      }
      const planned =
        exercise.set_targets.find((target) => target.set_number === set.set_number)?.reps ??
        exercise.target_reps;
      if (planned > 0 && set.reps > planned) {
        if (await unlockAchievementIfNew(db, 'one_more_rep')) {
          unlocked.push('one_more_rep');
        }
        break outer;
      }
    }
  }

  const consistency = await getWeeklyConsistency(db, weeklyGoal);
  if (consistency.hitThisWeek) {
    if (await unlockAchievementIfNew(db, 'perfect_week')) {
      unlocked.push('perfect_week');
    }
  }

  return unlocked;
}

/**
 * Unlock aggregate achievements whose target has been reached (volume tiers,
 * experience tiers, consistency streaks, monthly PR count). Call after the
 * workout is completed and PRs are recorded so monthly counts are current.
 * Returns the newly unlocked keys.
 */
export async function unlockEarnedAchievements(
  db: SQLiteDatabase,
  weeklyGoal: number
): Promise<string[]> {
  const stats = await getWorkoutStats(db, { weeklyGoal });
  const rows = await getAchievements(db);
  const unlocked: string[] = [];

  for (const row of rows) {
    if (row.unlocked_at !== null) {
      continue;
    }
    const definition = getAchievementByKey(row.key);
    if (!definition || definition.metric === undefined || definition.target === undefined) {
      continue;
    }
    if (METRIC_READERS[definition.metric](stats) >= definition.target) {
      if (await unlockAchievementIfNew(db, row.key)) {
        unlocked.push(row.key);
      }
    }
  }

  return unlocked;
}
/**
 * Assemble everything the post-workout recap needs. Call AFTER
 * `completeWorkout` resolves so `completed_at` is set and the session counts.
 */
export async function getWorkoutRecap(
  db: SQLiteDatabase,
  logId: number,
  weeklyGoal: number
): Promise<WorkoutRecap> {
  const log = await getWorkoutLog(db, logId);
  const summary = await getWorkoutSummary(db, logId);
  const routineName = await getWorkoutRoutineName(db, logId);
  const prs = await detectAndRecordPRs(db, logId);
  const specialsUnlocked = await detectAndUnlockSpecials(db, logId, weeklyGoal);
  const earned = await unlockEarnedAchievements(db, weeklyGoal);
  const achievementsUnlocked = [...new Set([...specialsUnlocked, ...earned])];

  // Volume delta vs the previous completed workout of the same routine.
  let volumeDeltaPct: number | null = null;
  if (log?.routine_id != null && log?.completed_at != null) {
    const previous = await db.getFirstAsync<{ volume: number }>(
      `SELECT COALESCE(SUM(s.weight * s.reps), 0) AS volume
       FROM sets s
       JOIN workout_logs wl ON wl.id = s.workout_log_id
       WHERE wl.routine_id = ? AND wl.completed_at IS NOT NULL
         AND wl.completed_at < ? AND s.completed = 1
       GROUP BY wl.id
       ORDER BY wl.completed_at DESC
       LIMIT 1`,
      log.routine_id,
      log.completed_at
    );
    if (previous && previous.volume > 0 && summary.totalVolumeKg > 0) {
      volumeDeltaPct = Math.round(((summary.totalVolumeKg - previous.volume) / previous.volume) * 100);
    }
  }

  // Weight milestones unlocked during this session (the set-level toast unlocks them).
  const milestoneRows =
    log?.started_at && log?.completed_at
      ? await db.getAllAsync<{ key: string }>(
          `SELECT key FROM achievements
           WHERE unlocked_at IS NOT NULL AND unlocked_at >= ? AND unlocked_at <= ?`,
          log.started_at,
          log.completed_at
        )
      : [];
  const milestonesUnlocked = milestoneRows
    .map((row) => getWeightComparativeByKey(row.key))
    .filter((milestone): milestone is WeightComparativeDefinition => milestone !== undefined)
    .sort((a, b) => a.thresholdKg - b.thresholdKg);

  // Next milestone beyond the heaviest completed set.
  const maxWeightRow = await db.getFirstAsync<{ m: number }>(
    `SELECT COALESCE(MAX(s.weight), 0) AS m
     FROM sets s
     JOIN workout_logs wl ON wl.id = s.workout_log_id
     WHERE s.completed = 1 AND wl.completed_at IS NOT NULL AND s.weight > 0`
  );
  const nextMilestone = getNextWeightComparative(maxWeightRow?.m ?? 0);
  const maxWeightKg = maxWeightRow?.m ?? 0;

  const consistency = await getWeeklyConsistency(db, weeklyGoal);

  return {
    routineName,
    summary,
    volumeDeltaPct,
    prs,
    milestonesUnlocked,
    nextMilestone,
    maxWeightKg,
    consistency,
    achievementsUnlocked,
  };
}
