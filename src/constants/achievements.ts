import type { WorkoutStats } from '@/db/workouts';
import { getWeightComparativeByKey } from './weight-comparatives';

/**
 * Static catalog of achievements.
 *
 * The rows live in the `achievements` table (seeded via `ACHIEVEMENT_SEED` in
 * src/db/achievements.ts); `key` links a row to its definition here.
 *
 * Achievements are grouped into categories (strength / volume / consistency /
 * experience / special) and optionally tiered (bronze / silver / gold /
 * diamond). Progress is computed data-driven: each definition carries a
 * `metric` (read from `WorkoutStats` via `METRIC_READERS`) and a `target`.
 * Event-based "special" achievements have no `metric`/`target` — they are
 * binary and unlocked at workout completion, not from aggregate stats.
 */

export type AchievementCategory = 'strength' | 'volume' | 'consistency' | 'experience' | 'special';
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond';
export type AchievementMetric = 'totalWorkouts' | 'totalVolume' | 'maxWeight' | 'consistencyStreak' | 'prsThisMonth';

export interface AchievementDefinition {
  key: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  category: AchievementCategory;
  tier?: AchievementTier;
  /** Aggregate metric driving progress. Absent on event-based achievements. */
  metric?: AchievementMetric;
  /** Progress target for the metric. */
  target?: number;
}

/** Display order of categories on the achievements list. */
export const ACHIEVEMENT_CATEGORY_ORDER: readonly AchievementCategory[] = [
  'strength',
  'volume',
  'consistency',
  'experience',
  'special',
];

/** Tier badge colors (works on both light and dark surfaces). */
export const ACHIEVEMENT_TIER_COLORS: Record<AchievementTier, string> = {
  bronze: '#CD7F32',
  silver: '#A9AEB5',
  gold: '#F0B429',
  diamond: '#5BC8E8',
};

export const ACHIEVEMENTS: readonly AchievementDefinition[] = [
  // --- Strength: weight milestones are the ladder; records are forged. ---
  {
    key: 'progressive_overload',
    nameKey: 'achievements.progressiveOverload.name',
    descriptionKey: 'achievements.progressiveOverload.description',
    icon: '📈',
    category: 'strength',
    metric: 'prsThisMonth',
    target: 5,
  },
  // --- Volume: cumulative weight × reps. ---
  {
    key: 'thousand_kg_club',
    nameKey: 'achievements.thousandKgClub.name',
    descriptionKey: 'achievements.thousandKgClub.description',
    icon: '💪',
    category: 'volume',
    tier: 'bronze',
    metric: 'totalVolume',
    target: 1000,
  },
  {
    key: 'volume_10k',
    nameKey: 'achievements.volume10k.name',
    descriptionKey: 'achievements.volume10k.description',
    icon: '🏋️',
    category: 'volume',
    tier: 'silver',
    metric: 'totalVolume',
    target: 10000,
  },
  {
    key: 'volume_100k',
    nameKey: 'achievements.volume100k.name',
    descriptionKey: 'achievements.volume100k.description',
    icon: '⚙️',
    category: 'volume',
    tier: 'gold',
    metric: 'totalVolume',
    target: 100000,
  },
  {
    key: 'volume_1m',
    nameKey: 'achievements.volume1m.name',
    descriptionKey: 'achievements.volume1m.description',
    icon: '🪨',
    category: 'volume',
    tier: 'diamond',
    metric: 'totalVolume',
    target: 1000000,
  },
  // --- Consistency: consecutive weeks meeting the weekly training goal. ---
  {
    key: 'consistency_4w',
    nameKey: 'achievements.consistency4w.name',
    descriptionKey: 'achievements.consistency4w.description',
    icon: '🗓️',
    category: 'consistency',
    tier: 'bronze',
    metric: 'consistencyStreak',
    target: 4,
  },
  {
    key: 'consistency_8w',
    nameKey: 'achievements.consistency8w.name',
    descriptionKey: 'achievements.consistency8w.description',
    icon: '📅',
    category: 'consistency',
    tier: 'silver',
    metric: 'consistencyStreak',
    target: 8,
  },
  {
    key: 'consistency_12w',
    nameKey: 'achievements.consistency12w.name',
    descriptionKey: 'achievements.consistency12w.description',
    icon: '🔥',
    category: 'consistency',
    tier: 'gold',
    metric: 'consistencyStreak',
    target: 12,
  },
  // --- Experience: completed workouts. ---
  {
    key: 'first_workout',
    nameKey: 'achievements.firstWorkout.name',
    descriptionKey: 'achievements.firstWorkout.description',
    icon: '🏋️',
    category: 'experience',
    metric: 'totalWorkouts',
    target: 1,
  },
  {
    key: 'experience_10',
    nameKey: 'achievements.experience10.name',
    descriptionKey: 'achievements.experience10.description',
    icon: '🔟',
    category: 'experience',
    tier: 'bronze',
    metric: 'totalWorkouts',
    target: 10,
  },
  {
    key: 'experience_50',
    nameKey: 'achievements.experience50.name',
    descriptionKey: 'achievements.experience50.description',
    icon: '💯',
    category: 'experience',
    tier: 'silver',
    metric: 'totalWorkouts',
    target: 50,
  },
  {
    key: 'experience_100',
    nameKey: 'achievements.experience100.name',
    descriptionKey: 'achievements.experience100.description',
    icon: '🎖️',
    category: 'experience',
    tier: 'gold',
    metric: 'totalWorkouts',
    target: 100,
  },
  {
    key: 'experience_250',
    nameKey: 'achievements.experience250.name',
    descriptionKey: 'achievements.experience250.description',
    icon: '🏅',
    category: 'experience',
    tier: 'diamond',
    metric: 'totalWorkouts',
    target: 250,
  },
  // --- Special: event-based, unlocked at workout completion. ---
  {
    key: 'early_bird',
    nameKey: 'achievements.earlyBird.name',
    descriptionKey: 'achievements.earlyBird.description',
    icon: '🌅',
    category: 'special',
  },
  {
    key: 'night_shift',
    nameKey: 'achievements.nightShift.name',
    descriptionKey: 'achievements.nightShift.description',
    icon: '🌙',
    category: 'special',
  },
  {
    key: 'one_more_rep',
    nameKey: 'achievements.oneMoreRep.name',
    descriptionKey: 'achievements.oneMoreRep.description',
    icon: '➕',
    category: 'special',
  },
  {
    key: 'perfect_week',
    nameKey: 'achievements.perfectWeek.name',
    descriptionKey: 'achievements.perfectWeek.description',
    icon: '⭐',
    category: 'special',
  },
];

/** Readers mapping a definition's `metric` to a value in `WorkoutStats`. */
export const METRIC_READERS: Record<AchievementMetric, (stats: WorkoutStats) => number> = {
  totalWorkouts: (stats) => stats.totalWorkouts,
  totalVolume: (stats) => stats.totalVolumeKg,
  maxWeight: (stats) => stats.maxWeightKg,
  consistencyStreak: (stats) => stats.consistencyStreakWeeks,
  prsThisMonth: (stats) => stats.prsThisMonth,
};

export function getAchievementByKey(key: string): AchievementDefinition | undefined {
  const achievement = ACHIEVEMENTS.find((entry) => entry.key === key);
  if (achievement) {
    return achievement;
  }
  // Weight milestones live in their own catalog; normalize them into the shared
  // `AchievementDefinition` shape (target = the milestone's kg threshold).
  const comparative = getWeightComparativeByKey(key);
  return comparative
    ? {
        key: comparative.key,
        nameKey: comparative.nameKey,
        descriptionKey: comparative.descriptionKey,
        icon: comparative.icon,
        category: 'strength',
        metric: 'maxWeight',
        target: comparative.thresholdKg,
      }
    : undefined;
}

export interface AchievementProgress {
  /** Raw progress toward the target. */
  current: number;
  target: number;
  /** 0..1 — capped at 1. Binary achievements report 0. */
  progress: number;
}

export function computeAchievementProgress(
  key: string,
  stats: WorkoutStats
): AchievementProgress {
  const definition = getAchievementByKey(key);
  if (!definition || definition.metric === undefined || definition.target === undefined) {
    // Unknown or event-based (binary) achievement — no aggregate progress.
    return { current: 0, target: 0, progress: 0 };
  }

  const current = METRIC_READERS[definition.metric](stats);
  const target = definition.target;
  const progress = target > 0 ? Math.min(1, current / target) : 0;
  return { current, target, progress };
}
