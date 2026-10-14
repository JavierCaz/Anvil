import type { AchievementTier } from './achievements';

/**
 * Distance achievements for `distance_duration` exercises (running, cycling,
 * rowing, carries…). Both families are **per exercise** — a 42 km ride is not
 * a marathon run — and unlock as soon as a qualifying set is completed, like
 * the weight comparatives:
 *
 * - `effort`: single-set distance milestones (5K → Marathon), tiered.
 * - `landmark`: "How far have I gone?" — cumulative distance on the exercise
 *   mapped to a real-world landmark. Lengths are approximate comparisons.
 *
 * Distances are in meters (the storage unit). Rows are seeded into the
 * `achievements` table via `ACHIEVEMENT_SEED` (src/db/achievements.ts); `key`
 * links a row to its definition here and its translations under
 * `achievements.distance.*`.
 */
export type DistanceAchievementKind = 'effort' | 'landmark';

export interface DistanceAchievementDefinition {
  key: string;
  kind: DistanceAchievementKind;
  /** Distance (meters) that unlocks it: single set (`effort`) or cumulative (`landmark`). */
  thresholdM: number;
  icon: string;
  nameKey: string;
  descriptionKey: string;
  tier?: AchievementTier;
}

export const DISTANCE_EFFORTS: readonly DistanceAchievementDefinition[] = [
  {
    key: 'distance_5k',
    kind: 'effort',
    thresholdM: 5000,
    icon: '👟',
    nameKey: 'achievements.distance.fiveK.name',
    descriptionKey: 'achievements.distance.fiveK.description',
    tier: 'bronze',
  },
  {
    key: 'distance_10k',
    kind: 'effort',
    thresholdM: 10000,
    icon: '🏃',
    nameKey: 'achievements.distance.tenK.name',
    descriptionKey: 'achievements.distance.tenK.description',
    tier: 'silver',
  },
  {
    key: 'distance_half_marathon',
    kind: 'effort',
    thresholdM: 21097.5,
    icon: '🎽',
    nameKey: 'achievements.distance.halfMarathon.name',
    descriptionKey: 'achievements.distance.halfMarathon.description',
    tier: 'gold',
  },
  {
    key: 'distance_marathon',
    kind: 'effort',
    thresholdM: 42195,
    icon: '🏆',
    nameKey: 'achievements.distance.marathon.name',
    descriptionKey: 'achievements.distance.marathon.description',
    tier: 'diamond',
  },
];

export const DISTANCE_LANDMARKS: readonly DistanceAchievementDefinition[] = [
  {
    key: 'landmark_track',
    kind: 'landmark',
    thresholdM: 400,
    icon: '🏟️',
    nameKey: 'achievements.distance.track.name',
    descriptionKey: 'achievements.distance.track.description',
  },
  {
    key: 'landmark_golden_gate',
    kind: 'landmark',
    thresholdM: 2737,
    icon: '🌉',
    nameKey: 'achievements.distance.goldenGate.name',
    descriptionKey: 'achievements.distance.goldenGate.description',
  },
  {
    key: 'landmark_central_park',
    kind: 'landmark',
    thresholdM: 9700,
    icon: '🌳',
    nameKey: 'achievements.distance.centralPark.name',
    descriptionKey: 'achievements.distance.centralPark.description',
  },
  {
    key: 'landmark_english_channel',
    kind: 'landmark',
    thresholdM: 33300,
    icon: '🌊',
    nameKey: 'achievements.distance.englishChannel.name',
    descriptionKey: 'achievements.distance.englishChannel.description',
  },
  {
    key: 'landmark_panama_canal',
    kind: 'landmark',
    thresholdM: 82000,
    icon: '🚢',
    nameKey: 'achievements.distance.panamaCanal.name',
    descriptionKey: 'achievements.distance.panamaCanal.description',
  },
  {
    key: 'landmark_grand_canyon',
    kind: 'landmark',
    thresholdM: 446000,
    icon: '🏜️',
    nameKey: 'achievements.distance.grandCanyon.name',
    descriptionKey: 'achievements.distance.grandCanyon.description',
  },
  {
    key: 'landmark_route_66',
    kind: 'landmark',
    thresholdM: 3940000,
    icon: '🛣️',
    nameKey: 'achievements.distance.route66.name',
    descriptionKey: 'achievements.distance.route66.description',
  },
  {
    key: 'landmark_great_wall',
    kind: 'landmark',
    thresholdM: 21196000,
    icon: '🧱',
    nameKey: 'achievements.distance.greatWall.name',
    descriptionKey: 'achievements.distance.greatWall.description',
  },
];

/** Both families, efforts first, each ascending by threshold. */
export const DISTANCE_ACHIEVEMENTS: readonly DistanceAchievementDefinition[] = [
  ...DISTANCE_EFFORTS,
  ...DISTANCE_LANDMARKS,
];

/** Key prefixes of the two families (used to reconcile unlocks in SQL). */
export const DISTANCE_EFFORT_KEY_PREFIX = 'distance_';
export const DISTANCE_LANDMARK_KEY_PREFIX = 'landmark_';

export function getDistanceAchievementByKey(
  key: string
): DistanceAchievementDefinition | undefined {
  return DISTANCE_ACHIEVEMENTS.find((entry) => entry.key === key);
}

/**
 * Distance achievements earned by an exercise's best single set
 * (`maxDistanceM`) and cumulative distance (`totalDistanceM`), in
 * `DISTANCE_ACHIEVEMENTS` order.
 */
export function getEarnedDistanceAchievements(
  maxDistanceM: number,
  totalDistanceM: number
): DistanceAchievementDefinition[] {
  return DISTANCE_ACHIEVEMENTS.filter((entry) =>
    entry.kind === 'effort' ? maxDistanceM >= entry.thresholdM : totalDistanceM >= entry.thresholdM
  );
}
