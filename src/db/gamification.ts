import type { SQLiteDatabase } from 'expo-sqlite';
import dayjs from 'dayjs';
import { getExerciseMetrics } from '@/constants/exercise-metrics';
import {
  getNextWeightComparative,
  getWeightComparativeByKey,
  type WeightComparativeDefinition,
} from '@/constants/weight-comparatives';
import {
  getAchievementByKey,
  METRIC_READERS,
  computeExerciseAchievementProgress,
  EXERCISE_STAT_ACHIEVEMENTS,
} from '@/constants/achievements';
import { getDistanceAchievementByKey } from '@/constants/distance-achievements';
import { getAchievements, unlockAchievementIfNew, unlockExerciseAchievement } from './achievements';
import { getWeeklyConsistency, type WeeklyConsistency } from './stats';
import {
  getActiveWorkoutExercises,
  getExerciseStats,
  getWorkoutLog,
  getWorkoutRoutineName,
  getWorkoutSets,
  getWorkoutSummary,
  getWorkoutStats,
} from './workouts';
import type { WorkoutSummary } from './types';

/**
 * Gamification derivations: PR detection, weekly consistency, and the
 * post-workout recap. Everything is computed from existing workout data —
 * no new tables or columns. All queries filter completed sessions/sets so a
 * discarded or in-progress workout never counts.
 */

export type PRType = 'weight' | 'oneRM' | 'distance' | 'duration' | 'pace';

export interface DetectedPR {
  exerciseId: number;
  exerciseName: string;
  type: PRType;
  /** The record-setting set's weight (0 for cardio/timed PRs). */
  weight: number;
  /** The record-setting set's reps (0 for cardio/timed PRs). */
  reps: number;
  /** Epley estimate for a 1RM PR (null otherwise). */
  oneRM: number | null;
  /** The record-setting set's duration in seconds (cardio/timed PRs). */
  durationSeconds: number | null;
  /** The record-setting set's distance in meters (distance PRs + pace). */
  distanceM: number | null;
}

/** Pace PRs only consider sets of at least this distance (meters). */
export const PACE_PR_MIN_DISTANCE_M = 1000;

export interface WorkoutRecap {
  routineName: string | null;
  summary: WorkoutSummary;
  /** % volume change vs the previous completed workout of the same routine. Null when not comparable. */
  volumeDeltaPct: number | null;
  /** Personal records set during this session (also written to `personal_records`). */
  prs: DetectedPR[];
  /** Weight milestones unlocked during this session, ascending by threshold. */
  milestonesUnlocked: (WeightComparativeDefinition & { exerciseName: string })[];
  /** The next milestone above the heaviest set ever lifted, or null when all are reached. */
  nextMilestone: WeightComparativeDefinition | null;
  /** Heaviest single completed set (kg) — drives the distance to the next milestone. */
  maxWeightKg: number;
  consistency: WeeklyConsistency;
  /** Keys of achievements newly unlocked by this session (global + per-exercise). */
  achievementsUnlocked: UnlockedAchievement[];
}

/** An achievement unlocked by a finished session. Exercise-scoped ones carry the exercise. */
export interface UnlockedAchievement {
  key: string;
  /** Exercise that earned this achievement (per-exercise achievements only). */
  exerciseId?: number;
  exerciseName?: string;
}

/** Per-exercise achievement unlock result, grouped by the earning exercise. */
export interface ExerciseAchievementUnlock {
  key: string;
  exerciseId: number;
  exerciseName: string;
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
 * Detect per-exercise PRs for a completed session, record them in
 * `personal_records`, and return them for display:
 * - weight-based exercises: heaviest weight and best Epley 1RM;
 * - distance cardio: longest distance and best pace (≥ 1 km sets);
 * - timed holds: longest duration.
 * Each is compared against all prior completed sessions. The first-ever
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
  const weightPRs = await detectWeightPRs(db, logId, log.completed_at);
  const cardioPRs = await detectCardioPRs(db, logId, log.completed_at);
  return [...weightPRs, ...cardioPRs];
}

async function detectWeightPRs(
  db: SQLiteDatabase,
  logId: number,
  completedAt: string
): Promise<DetectedPR[]> {
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
        durationSeconds: null,
        distanceM: null,
      });
      await insertPersonalRecord(db, exerciseId, 'weight', set, completedAt);
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
        durationSeconds: null,
        distanceM: null,
      });
      await insertPersonalRecord(db, exerciseId, 'oneRM', set, completedAt);
    }
  }

  return detected;
}

export interface CardioSetRow {
  exercise_id: number;
  exercise_name: string;
  exercise_type: string | null;
  duration_seconds: number | null;
  distance_m: number | null;
}

interface CardioBests {
  name: string;
  type: string | null;
  distance: CardioSetRow | null;
  duration: CardioSetRow | null;
  pace: CardioSetRow | null;
}

/** Seconds per meter for a pace-eligible set, else null (lower is faster). */
function paceOf(row: CardioSetRow): number | null {
  const distance = row.distance_m ?? 0;
  const duration = row.duration_seconds ?? 0;
  if (distance < PACE_PR_MIN_DISTANCE_M || duration <= 0) {
    return null;
  }
  return duration / distance;
}

function buildCardioBests(rows: CardioSetRow[]): Map<number, CardioBests> {
  const byExercise = new Map<number, CardioBests>();
  for (const row of rows) {
    const bests = byExercise.get(row.exercise_id) ?? {
      name: row.exercise_name,
      type: row.exercise_type,
      distance: null,
      duration: null,
      pace: null,
    };
    if ((row.distance_m ?? 0) > (bests.distance?.distance_m ?? 0)) {
      bests.distance = row;
    }
    if ((row.duration_seconds ?? 0) > (bests.duration?.duration_seconds ?? 0)) {
      bests.duration = row;
    }
    const pace = paceOf(row);
    const bestPace = bests.pace ? paceOf(bests.pace) : null;
    if (pace !== null && (bestPace === null || pace < bestPace)) {
      bests.pace = row;
    }
    byExercise.set(row.exercise_id, bests);
  }
  return byExercise;
}

/**
 * Pure cardio PR comparison (unit-testable). Distance exercises compete on
 * longest distance and best pace; timed holds on longest duration. A metric
 * only counts as a PR when prior history has a value for that same metric.
 */
export function computeCardioPRs(
  sessionRows: CardioSetRow[],
  historyRows: CardioSetRow[]
): DetectedPR[] {
  const session = buildCardioBests(sessionRows);
  const history = buildCardioBests(historyRows);
  const detected: DetectedPR[] = [];

  const toPR = (exerciseId: number, name: string, type: PRType, row: CardioSetRow): DetectedPR => ({
    exerciseId,
    exerciseName: name,
    type,
    weight: 0,
    reps: 0,
    oneRM: null,
    durationSeconds: row.duration_seconds,
    distanceM: row.distance_m,
  });

  for (const [exerciseId, bests] of session) {
    const prior = history.get(exerciseId);
    if (!prior) {
      continue;
    }
    if (bests.type === 'distance_duration') {
      if (
        bests.distance &&
        prior.distance &&
        (bests.distance.distance_m ?? 0) > (prior.distance.distance_m ?? 0)
      ) {
        detected.push(toPR(exerciseId, bests.name, 'distance', bests.distance));
      }
      const pace = bests.pace ? paceOf(bests.pace) : null;
      const priorPace = prior.pace ? paceOf(prior.pace) : null;
      if (bests.pace && pace !== null && priorPace !== null && pace < priorPace) {
        detected.push(toPR(exerciseId, bests.name, 'pace', bests.pace));
      }
    } else if (bests.type === 'duration') {
      if (
        bests.duration &&
        prior.duration &&
        (bests.duration.duration_seconds ?? 0) > (prior.duration.duration_seconds ?? 0)
      ) {
        detected.push(toPR(exerciseId, bests.name, 'duration', bests.duration));
      }
    }
  }
  return detected;
}

async function detectCardioPRs(
  db: SQLiteDatabase,
  logId: number,
  completedAt: string
): Promise<DetectedPR[]> {
  const sessionRows = await db.getAllAsync<CardioSetRow>(
    `SELECT s.exercise_id, e.name AS exercise_name, e.exercise_type,
            s.duration_seconds, s.distance_m
     FROM sets s
     JOIN exercises e ON e.id = s.exercise_id
     WHERE s.workout_log_id = ? AND s.completed = 1
       AND e.exercise_type IN ('duration', 'distance_duration')
       AND (s.duration_seconds > 0 OR s.distance_m > 0)
     ORDER BY s.exercise_id, s.set_number`,
    logId
  );
  if (sessionRows.length === 0) {
    return [];
  }

  const exerciseIds = [...new Set(sessionRows.map((row) => row.exercise_id))];
  const placeholders = exerciseIds.map(() => '?').join(', ');
  const historyRows = await db.getAllAsync<CardioSetRow>(
    `SELECT s.exercise_id, e.name AS exercise_name, e.exercise_type,
            s.duration_seconds, s.distance_m
     FROM sets s
     JOIN exercises e ON e.id = s.exercise_id
     JOIN workout_logs wl ON wl.id = s.workout_log_id
     WHERE s.completed = 1 AND wl.completed_at IS NOT NULL
       AND s.workout_log_id != ?
       AND s.exercise_id IN (${placeholders})
       AND (s.duration_seconds > 0 OR s.distance_m > 0)`,
    logId,
    ...exerciseIds
  );

  const detected = computeCardioPRs(sessionRows, historyRows);
  for (const pr of detected) {
    await insertPersonalRecord(
      db,
      pr.exerciseId,
      pr.type,
      { weight: 0, reps: 0, duration_seconds: pr.durationSeconds, distance_m: pr.distanceM },
      completedAt
    );
  }
  return detected;
}

async function insertPersonalRecord(
  db: SQLiteDatabase,
  exerciseId: number,
  type: PRType,
  set: {
    weight: number;
    reps: number;
    duration_seconds?: number | null;
    distance_m?: number | null;
  },
  achievedAt: string
): Promise<void> {
  await db.runAsync(
    `INSERT INTO personal_records
       (exercise_id, weight, reps, achieved_at, type, duration_seconds, distance_m)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    exerciseId,
    set.weight,
    set.reps,
    achievedAt,
    type,
    set.duration_seconds ?? null,
    set.distance_m ?? null
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
  // Only rep-based exercises count — cardio/timed sets don't track reps.
  const exercises = await getActiveWorkoutExercises(db, logId);
  outer: for (const exercise of exercises) {
    if (!getExerciseMetrics(exercise.exercise_type).reps) {
      continue;
    }
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
 * Unlock aggregate achievements whose target has been reached. Only
 * GLOBAL-scoped achievements (experience, consistency) are evaluated here —
 * exercise-scoped ones (volume tiers, progressive overload, weight
 * milestones) are unlocked per exercise in
 * `unlockEarnedExerciseAchievements`. Call after the workout is completed
 * and PRs are recorded so monthly counts are current. Returns the newly
 * unlocked keys.
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
    if (definition.scope === 'exercise') {
      continue; // earned per-exercise, not from global stats
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
 * Unlock exercise-scoped achievements (volume tiers + progressive overload)
 * for the exercises in a completed session, from each exercise's own stats.
 * Returns the newly unlocked achievements with their earning exercise.
 */
export async function unlockEarnedExerciseAchievements(
  db: SQLiteDatabase,
  exerciseIds: number[]
): Promise<ExerciseAchievementUnlock[]> {
  const unlocked: ExerciseAchievementUnlock[] = [];
  for (const exerciseId of exerciseIds) {
    const stats = await getExerciseStats(db, exerciseId);
    const nameRow = await db.getFirstAsync<{ name: string }>(
      'SELECT name FROM exercises WHERE id = ?',
      exerciseId
    );
    const exerciseName = nameRow?.name ?? '';

    for (const definition of EXERCISE_STAT_ACHIEVEMENTS) {
      if (definition.metric === undefined || definition.target === undefined) {
        continue;
      }
      const { progress } = computeExerciseAchievementProgress(definition.key, stats);
      if (progress >= 1) {
        if (await unlockExerciseAchievement(db, exerciseId, definition.key)) {
          unlocked.push({ key: definition.key, exerciseId, exerciseName });
        }
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

  // Per-exercise unlocks for the exercises in this session.
  const sessionExercises = await getActiveWorkoutExercises(db, logId);
  const exerciseEarned = await unlockEarnedExerciseAchievements(
    db,
    sessionExercises.map((exercise) => exercise.exercise_id)
  );

  const achievementsUnlocked: UnlockedAchievement[] = [
    ...specialsUnlocked.map((key) => ({ key })),
    ...earned.map((key) => ({ key })),
    ...exerciseEarned.map(({ key, exerciseId, exerciseName }) => ({ key, exerciseId, exerciseName })),
  ];

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
  const sessionExerciseIds = sessionExercises.map((exercise) => exercise.exercise_id);
  const sessionPlaceholders = sessionExerciseIds.map(() => '?').join(', ');
  const milestoneRows =
    log?.started_at && log?.completed_at && sessionExerciseIds.length > 0
      ? await db.getAllAsync<{ key: string; exercise_id: number; exercise_name: string | null }>(
          `SELECT ea.key, ea.exercise_id, e.name AS exercise_name
           FROM exercise_achievements ea
           JOIN exercises e ON e.id = ea.exercise_id
           WHERE ea.unlocked_at >= ? AND ea.unlocked_at <= ?
             AND ea.exercise_id IN (${sessionPlaceholders})
           ORDER BY ea.unlocked_at ASC`
          ,
          log.started_at,
          log.completed_at,
          ...sessionExerciseIds,
        )
      : [];
  // Distance milestones/landmarks unlock per set during the session (so the
  // finish-time pass above sees them as already earned) — surface them with
  // the other per-exercise unlocks.
  for (const row of milestoneRows) {
    if (!getDistanceAchievementByKey(row.key)) {
      continue;
    }
    const duplicate = achievementsUnlocked.some(
      (entry) => entry.key === row.key && entry.exerciseId === row.exercise_id
    );
    if (!duplicate) {
      achievementsUnlocked.push({
        key: row.key,
        exerciseId: row.exercise_id,
        exerciseName: row.exercise_name ?? '',
      });
    }
  }

  const milestonesUnlocked = milestoneRows
    .map((row) => {
      const milestone = getWeightComparativeByKey(row.key);
      return milestone ? { ...milestone, exerciseName: row.exercise_name ?? '' } : null;
    })
    .filter(
      (milestone): milestone is WeightComparativeDefinition & { exerciseName: string } => milestone !== null
    )
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
