/**
 * Which values a set records, derived from the exercise type
 * (`exercises.exercise_type`, @bryllim/workout-guide vocabulary).
 *
 * - Rep-based types (`weight_reps`, `bodyweight_reps`, `assisted_bodyweight`)
 *   log weight × reps.
 * - `duration` (plank, wall sit, jump rope…) logs time only.
 * - `distance_duration` (running, cycling, rowing…) logs distance + time.
 *
 * Unknown / null types fall back to weight × reps so legacy custom exercises
 * keep working unchanged.
 */

export type SetMetric = 'weight' | 'reps' | 'duration' | 'distance';

export interface ExerciseMetrics {
  weight: boolean;
  reps: boolean;
  duration: boolean;
  distance: boolean;
  /**
   * Timed exercises accept an optional load (weight) — a farmer carry, a
   * weighted plank, a weighted-vest run. Rep-based types use `weight` instead.
   */
  load: boolean;
}

const WEIGHT_REPS: ExerciseMetrics = {
  weight: true,
  reps: true,
  duration: false,
  distance: false,
  load: false,
};
const DURATION: ExerciseMetrics = {
  weight: false,
  reps: false,
  duration: true,
  distance: false,
  load: true,
};
const DISTANCE_DURATION: ExerciseMetrics = {
  weight: false,
  reps: false,
  duration: true,
  distance: true,
  load: true,
};

/** Active set fields for an exercise type. */
export function getExerciseMetrics(type: string | null | undefined): ExerciseMetrics {
  if (type === 'duration') {
    return DURATION;
  }
  if (type === 'distance_duration') {
    return DISTANCE_DURATION;
  }
  return WEIGHT_REPS;
}

/** True for types that log a duration instead of reps. */
export function isTimedType(type: string | null | undefined): boolean {
  return getExerciseMetrics(type).duration;
}

/** True for types that log a distance. */
export function isDistanceType(type: string | null | undefined): boolean {
  return getExerciseMetrics(type).distance;
}

export interface DefaultSetTarget {
  sets: number;
  reps: number;
  restSeconds: number;
  durationSeconds: number | null;
  distanceM: number | null;
}

/** Planned defaults when an exercise of this type is added to a routine. */
export function getDefaultSetTarget(type: string | null | undefined): DefaultSetTarget {
  if (type === 'distance_duration') {
    return { sets: 1, reps: 0, restSeconds: 0, durationSeconds: 30 * 60, distanceM: null };
  }
  if (type === 'duration') {
    return { sets: 3, reps: 0, restSeconds: 60, durationSeconds: 30, distanceM: null };
  }
  return { sets: 3, reps: 10, restSeconds: 90, durationSeconds: null, distanceM: null };
}

/** Duration stepper increment: 1 min for distance cardio, 15 s for holds. */
export function durationStepSeconds(type: string | null | undefined): number {
  return isDistanceType(type) ? 60 : 15;
}

/** Equipment that implies an external load (matched case-insensitively). */
const FREE_WEIGHT_EQUIPMENT = new Set(['barbell', 'dumbbell', 'kettlebell', 'plate', 'cable', 'machine']);

/**
 * True when the equipment implies an external load — timed exercises using
 * it show the load field by default. Works for custom free-text equipment.
 */
export function isFreeWeightEquipment(equipment: string | null | undefined): boolean {
  return equipment ? FREE_WEIGHT_EQUIPMENT.has(equipment.trim().toLowerCase()) : false;
}

/**
 * `long` = km / mi (runs, rides), `short` = m / yd (carries, swimming).
 * Distance is always stored in meters; the scale only affects display/input.
 */
export type DistanceScale = 'long' | 'short';

/** Exercises measured in meters even without a load. */
const SHORT_DISTANCE_SLUGS = new Set(['swimming']);

/** Display scale for an exercise's distance. */
export function distanceScale(
  type: string | null | undefined,
  slug: string | null | undefined,
  equipment: string | null | undefined
): DistanceScale {
  if (!isDistanceType(type)) {
    return 'long';
  }
  if (isFreeWeightEquipment(equipment) || (slug != null && SHORT_DISTANCE_SLUGS.has(slug))) {
    return 'short';
  }
  return 'long';
}

/** Distance stepper increment in the display unit (km / mi, or m / yd on the short scale). */
export function distanceStep(unit: 'metric' | 'imperial', scale: DistanceScale = 'long'): number {
  if (scale === 'short') {
    return 10;
  }
  return unit === 'imperial' ? 0.25 : 0.5;
}

/** Catalog exercises commonly done on a treadmill / elliptical with an incline setting. */
const INCLINE_SLUGS = new Set([
  'running',
  'walking',
  'hiking',
  'treadmill-incline-walk',
  'elliptical',
]);

/** Catalog exercises where incline is the point — the field shows by default. */
const INCLINE_DEFAULT_SLUGS = new Set(['treadmill-incline-walk']);

/**
 * Whether sets of this exercise can record a treadmill incline (%). Catalog
 * exercises opt in by slug; custom distance exercises always can (e.g. a
 * user-created "Treadmill Run").
 */
export function supportsIncline(
  type: string | null | undefined,
  slug: string | null | undefined
): boolean {
  if (!isTimedType(type)) {
    return false;
  }
  return slug ? INCLINE_SLUGS.has(slug) : isDistanceType(type);
}

/** True when the incline field should show without the user asking for it. */
export function inclineByDefault(slug: string | null | undefined): boolean {
  return slug != null && INCLINE_DEFAULT_SLUGS.has(slug);
}

/** Incline stepper increment (percentage points) and accepted range. */
export const INCLINE_STEP = 0.5;
export const INCLINE_MAX_PERCENT = 40;

/** Clamp an incline to `[0, INCLINE_MAX_PERCENT]`, rounded to 0.1 %. */
export function clampIncline(percent: number): number {
  if (!Number.isFinite(percent)) {
    return 0;
  }
  return Math.round(Math.min(INCLINE_MAX_PERCENT, Math.max(0, percent)) * 10) / 10;
}

/** Catalog cardio machines with numbered resistance / speed / damper levels. */
const LEVEL_SLUGS = new Set(['stair-climber', 'elliptical', 'cycling', 'rowing', 'skierg']);

/** Catalog machines driven by their level — the field shows by default. */
const LEVEL_DEFAULT_SLUGS = new Set(['stair-climber', 'elliptical']);

/** Equipment of custom exercises that may record a machine level. */
const LEVEL_EQUIPMENT = new Set(['cardio', 'machine']);

/**
 * Whether sets of this exercise can record a machine level (1, 2, 3…).
 * Catalog exercises opt in by slug; custom timed exercises can when their
 * equipment is a cardio machine (e.g. a user-created "StairMaster").
 */
export function supportsLevel(
  type: string | null | undefined,
  slug: string | null | undefined,
  equipment: string | null | undefined
): boolean {
  if (!isTimedType(type)) {
    return false;
  }
  if (slug) {
    return LEVEL_SLUGS.has(slug);
  }
  return equipment ? LEVEL_EQUIPMENT.has(equipment.trim().toLowerCase()) : false;
}

/** True when the level field should show without the user asking for it. */
export function levelByDefault(slug: string | null | undefined): boolean {
  return slug != null && LEVEL_DEFAULT_SLUGS.has(slug);
}

/** Level stepper increment and accepted range (some bikes go 0–100). */
export const LEVEL_STEP = 1;
export const LEVEL_MAX = 100;

/** Clamp a level to whole numbers in `[0, LEVEL_MAX]` (0 = not set). */
export function clampLevel(level: number): number {
  if (!Number.isFinite(level)) {
    return 0;
  }
  return Math.round(Math.min(LEVEL_MAX, Math.max(0, level)));
}
