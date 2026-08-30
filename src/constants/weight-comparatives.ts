/**
 * "What am I lifting?" — weight milestones.
 *
 * Each entry maps a lifted set weight (kg) to a familiar real-world object.
 * Completing a set at or above `thresholdKg` unlocks the milestone and
 * triggers a floating notification. Rows are seeded into the `achievements`
 * table via `ACHIEVEMENT_SEED` (src/db/achievements.ts); `key` links a row to
 * its definition here and its translations in `achievements.comparatives.*`.
 *
 * The catalog is data-driven: add a new entry here (+ seed + i18n) to extend
 * the ladder. Thresholds are approximate comparisons, never exact weights.
 */
export interface WeightComparativeDefinition {
  key: string;
  /** Minimum set weight (kg) that unlocks this milestone. */
  thresholdKg: number;
  icon: string;
  nameKey: string;
  descriptionKey: string;
}

export const WEIGHT_COMPARATIVES: readonly WeightComparativeDefinition[] = [
  {
    key: 'comparative_watermelon',
    thresholdKg: 5,
    icon: '🍉',
    nameKey: 'achievements.comparatives.watermelon.name',
    descriptionKey: 'achievements.comparatives.watermelon.description',
  },
  {
    key: 'comparative_bicycle',
    thresholdKg: 20,
    icon: '🚲',
    nameKey: 'achievements.comparatives.bicycle.name',
    descriptionKey: 'achievements.comparatives.bicycle.description',
  },
  {
    key: 'comparative_adult',
    thresholdKg: 70,
    icon: '🧍',
    nameKey: 'achievements.comparatives.adult.name',
    descriptionKey: 'achievements.comparatives.adult.description',
  },
  {
    key: 'comparative_panda',
    thresholdKg: 100,
    icon: '🐼',
    nameKey: 'achievements.comparatives.panda.name',
    descriptionKey: 'achievements.comparatives.panda.description',
  },
  {
    key: 'comparative_motorcycle',
    thresholdKg: 200,
    icon: '🏍️',
    nameKey: 'achievements.comparatives.motorcycle.name',
    descriptionKey: 'achievements.comparatives.motorcycle.description',
  },
  {
    key: 'comparative_piano',
    thresholdKg: 300,
    icon: '🎹',
    nameKey: 'achievements.comparatives.piano.name',
    descriptionKey: 'achievements.comparatives.piano.description',
  },
  {
    key: 'comparative_polar_bear',
    thresholdKg: 500,
    icon: '🐻‍❄️',
    nameKey: 'achievements.comparatives.polarBear.name',
    descriptionKey: 'achievements.comparatives.polarBear.description',
  },
  {
    key: 'comparative_car',
    thresholdKg: 1000,
    icon: '🚗',
    nameKey: 'achievements.comparatives.car.name',
    descriptionKey: 'achievements.comparatives.car.description',
  },
] as const;

export function getWeightComparativeByKey(
  key: string
): WeightComparativeDefinition | undefined {
  return WEIGHT_COMPARATIVES.find((comparative) => comparative.key === key);
}

/**
 * Milestones whose threshold is at or below `weightKg`, in ascending order.
 * The last element is the highest-threshold milestone reached by the weight.
 */
export function getWeightComparativesAtOrBelow(
  weightKg: number
): WeightComparativeDefinition[] {
  return WEIGHT_COMPARATIVES.filter((comparative) => comparative.thresholdKg <= weightKg);
}

/**
 * The first milestone above `weightKg`, or null when every milestone has been
 * reached. Used to show "next milestone" progress toward the next target.
 */
export function getNextWeightComparative(
  weightKg: number
): WeightComparativeDefinition | null {
  return WEIGHT_COMPARATIVES.find((comparative) => comparative.thresholdKg > weightKg) ?? null;
}
