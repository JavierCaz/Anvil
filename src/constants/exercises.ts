import { EXERCISE_FRAMES } from './exercise-frames';

/**
 * Static exercise metadata helpers.
 *
 * Catalog exercises are keyed by their @bryllim/workout-guide slug; their
 * names stay in English (catalog data), while muscle groups and exercise
 * types are rendered through i18n keys below.
 */

/** Primary muscle (English catalog value) → i18n key. */
export const MUSCLE_I18N_KEYS: Record<string, string> = {
  Adductors: 'exercises.muscles.adductors',
  Back: 'exercises.muscles.back',
  Biceps: 'exercises.muscles.biceps',
  Calves: 'exercises.muscles.calves',
  Chest: 'exercises.muscles.chest',
  Core: 'exercises.muscles.core',
  Forearms: 'exercises.muscles.forearms',
  Glutes: 'exercises.muscles.glutes',
  Hamstrings: 'exercises.muscles.hamstrings',
  Hips: 'exercises.muscles.hips',
  Lats: 'exercises.muscles.lats',
  'Lower Back': 'exercises.muscles.lowerBack',
  Legs: 'exercises.muscles.legs',
  Mobility: 'exercises.muscles.mobility',
  'Posterior Chain': 'exercises.muscles.posteriorChain',
  Quads: 'exercises.muscles.quads',
  'Rear Delts': 'exercises.muscles.rearDelts',
  Shoulders: 'exercises.muscles.shoulders',
  Triceps: 'exercises.muscles.triceps',
  'Upper Back': 'exercises.muscles.upperBack',
};

/** Equipment (English catalog value, lower-cased) → i18n key. */
export const EQUIPMENT_I18N_KEYS: Record<string, string> = {
  barbell: 'exercises.equipment.barbell',
  bench: 'exercises.equipment.bench',
  bodyweight: 'exercises.equipment.bodyweight',
  box: 'exercises.equipment.box',
  cable: 'exercises.equipment.cable',
  cardio: 'exercises.equipment.cardio',
  chair: 'exercises.equipment.chair',
  doorway: 'exercises.equipment.doorway',
  dumbbell: 'exercises.equipment.dumbbell',
  kettlebell: 'exercises.equipment.kettlebell',
  machine: 'exercises.equipment.machine',
  plate: 'exercises.equipment.plate',
  'pull-up bar': 'exercises.equipment.pullUpBar',
  'resistance band': 'exercises.equipment.resistanceBand',
  'stability ball': 'exercises.equipment.stabilityBall',
  towel: 'exercises.equipment.towel',
  wall: 'exercises.equipment.wall',
};

/** @bryllim/workout-guide exercise type → i18n key. */
export const EXERCISE_TYPE_I18N_KEYS: Record<string, string> = {
  weight_reps: 'exercises.types.weightReps',
  bodyweight_reps: 'exercises.types.bodyweightReps',
  duration: 'exercises.types.duration',
  distance_duration: 'exercises.types.distanceDuration',
  assisted_bodyweight: 'exercises.types.assistedBodyweight',
};

/** i18n key for a muscle value, falling back to the raw value when unknown. */
export function muscleI18nKey(muscle: string | null): string | null {
  return muscle ? (MUSCLE_I18N_KEYS[muscle] ?? null) : null;
}

/** i18n key for an equipment value (case-insensitive), or null when unknown. */
export function equipmentI18nKey(equipment: string | null): string | null {
  return equipment ? (EQUIPMENT_I18N_KEYS[equipment.trim().toLowerCase()] ?? null) : null;
}

/** i18n key for an exercise type, falling back to the raw value when unknown. */
export function exerciseTypeI18nKey(type: string | null): string | null {
  return type ? (EXERCISE_TYPE_I18N_KEYS[type] ?? null) : null;
}

/** Frame-1 thumbnail source for a catalog slug (undefined when not found). */
export function exerciseFrameSource(slug: string | null | undefined) {
  return slug ? EXERCISE_FRAMES[slug] : undefined;
}
