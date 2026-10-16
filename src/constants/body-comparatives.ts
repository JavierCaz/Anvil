import type { AchievementTier } from './achievements';

/**
 * "What have I lost / gained?" — bodyweight change milestones.
 *
 * Maps the change since the first weigh-in to a familiar object. The same
 * ladder drives the comparison line on the Home / Statistics cards and the
 * `body` achievements (seeded via `ACHIEVEMENT_SEED` in src/db/achievements.ts;
 * translations live in `achievements.body.comparatives.*`).
 *
 * The scale is much smaller than the lifting ladder in `weight-comparatives.ts`
 * — thresholds are approximate comparisons, never exact weights.
 */
export interface BodyComparativeDefinition {
  key: string;
  /** Change (kg, either direction) that reaches this milestone. */
  thresholdKg: number;
  icon: string;
  tier: AchievementTier;
  nameKey: string;
  descriptionKey: string;
  /** The object with its article, for sentences ("a bowling ball"). */
  objectKey: string;
}

export const BODY_COMPARATIVE_KEY_PREFIX = 'body_comparative_';

function comparative(
  id: string,
  thresholdKg: number,
  icon: string,
  tier: AchievementTier
): BodyComparativeDefinition {
  const snake = id.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  return {
    key: `${BODY_COMPARATIVE_KEY_PREFIX}${snake}`,
    thresholdKg,
    icon,
    tier,
    nameKey: `achievements.body.comparatives.${id}.name`,
    descriptionKey: `achievements.body.comparatives.${id}.description`,
    objectKey: `achievements.body.comparatives.${id}.object`,
  };
}

export const BODY_COMPARATIVES: readonly BodyComparativeDefinition[] = [
  comparative('pineapple', 1, '🍍', 'bronze'),
  comparative('cat', 4.5, '🐈', 'bronze'),
  comparative('bowlingBall', 7, '🎳', 'silver'),
  comparative('turkey', 10, '🦃', 'silver'),
  comparative('suitcase', 20, '🧳', 'gold'),
  comparative('labrador', 30, '🐕', 'diamond'),
];

export function getBodyComparativeByKey(key: string): BodyComparativeDefinition | undefined {
  return BODY_COMPARATIVES.find((entry) => entry.key === key);
}
