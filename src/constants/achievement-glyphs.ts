import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { AchievementCategory } from './achievements';

export type BadgeGlyphName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/**
 * What an achievement badge shows at its centre: a vector glyph, or a short
 * numeral (workout-count milestones read better as the number itself).
 */
export type BadgeGlyph = { icon: BadgeGlyphName } | { numeral: string };

/** Per-achievement glyphs, keyed by achievement `key`. */
const GLYPHS: Record<string, BadgeGlyph> = {
  // Strength
  progressive_overload: { icon: 'trending-up' },
  // Volume
  thousand_kg_club: { icon: 'weight-kilogram' },
  volume_10k: { icon: 'dumbbell' },
  volume_100k: { icon: 'anvil' },
  volume_1m: { icon: 'diamond-stone' },
  // Consistency
  consistency_4w: { icon: 'calendar-check' },
  consistency_8w: { icon: 'calendar-range' },
  consistency_12w: { icon: 'fire' },
  // Experience
  first_workout: { icon: 'weight-lifter' },
  experience_10: { numeral: '10' },
  experience_50: { numeral: '50' },
  experience_100: { numeral: '100' },
  experience_250: { numeral: '250' },
  // Special
  early_bird: { icon: 'weather-sunset-up' },
  night_shift: { icon: 'weather-night' },
  one_more_rep: { icon: 'plus-thick' },
  perfect_week: { icon: 'star-four-points' },
  // Weight comparatives ("What am I lifting?")
  comparative_watermelon: { icon: 'fruit-watermelon' },
  comparative_bicycle: { icon: 'bicycle' },
  comparative_adult: { icon: 'human-male' },
  comparative_panda: { icon: 'panda' },
  comparative_motorcycle: { icon: 'motorbike' },
  comparative_piano: { icon: 'piano' },
  comparative_polar_bear: { icon: 'paw' },
  comparative_car: { icon: 'car-side' },
  // Body
  first_weigh_in: { icon: 'scale-bathroom' },
  weigh_in_streak_7: { icon: 'calendar-week' },
  weigh_in_30: { numeral: '30' },
  weigh_in_100: { numeral: '100' },
  goal_set: { icon: 'target' },
  goal_halfway: { icon: 'map-marker-path' },
  goal_reached: { icon: 'flag-checkered' },
  body_comparative_pineapple: { icon: 'fruit-pineapple' },
  body_comparative_cat: { icon: 'cat' },
  body_comparative_bowling_ball: { icon: 'bowling' },
  body_comparative_turkey: { icon: 'food-turkey' },
  body_comparative_suitcase: { icon: 'bag-suitcase' },
  body_comparative_labrador: { icon: 'dog' },
  // Distance efforts
  distance_5k: { icon: 'shoe-sneaker' },
  distance_10k: { icon: 'run' },
  distance_half_marathon: { icon: 'run-fast' },
  distance_marathon: { icon: 'trophy' },
  // Distance landmarks
  landmark_track: { icon: 'stadium' },
  landmark_golden_gate: { icon: 'bridge' },
  landmark_central_park: { icon: 'tree' },
  landmark_english_channel: { icon: 'waves' },
  landmark_panama_canal: { icon: 'ferry' },
  landmark_grand_canyon: { icon: 'image-filter-hdr' },
  landmark_route_66: { icon: 'highway' },
  landmark_great_wall: { icon: 'wall' },
};

/** Fallback glyph per category, for achievements without a dedicated one. */
const CATEGORY_GLYPHS: Record<AchievementCategory, BadgeGlyph> = {
  strength: { icon: 'arm-flex' },
  volume: { icon: 'dumbbell' },
  endurance: { icon: 'run' },
  consistency: { icon: 'calendar-check' },
  experience: { icon: 'medal' },
  body: { icon: 'scale-bathroom' },
  special: { icon: 'star' },
};

export function getBadgeGlyph(key: string, category?: AchievementCategory): BadgeGlyph {
  return GLYPHS[key] ?? (category ? CATEGORY_GLYPHS[category] : { icon: 'medal' });
}
