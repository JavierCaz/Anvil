import type { WorkoutStats } from '@/db/workouts';
import {
  DISTANCE_ACHIEVEMENTS,
  getDistanceAchievementByKey,
  type DistanceAchievementDefinition,
} from './distance-achievements';
import {
  BODY_COMPARATIVES,
  getBodyComparativeByKey,
  type BodyComparativeDefinition,
} from './body-comparatives';
import { getWeightComparativeByKey } from './weight-comparatives';

/**
 * Static catalog of achievements.
 *
 * The rows live in the `achievements` table (seeded via `ACHIEVEMENT_SEED` in
 * src/db/achievements.ts); `key` links a row to its definition here.
 *
 * Achievements are grouped into categories (strength / volume / endurance /
 * consistency / experience / body / special) and optionally tiered (bronze / silver / gold /
 * diamond). Progress is computed data-driven: each definition carries a
 * `metric` (read from `WorkoutStats` via `METRIC_READERS`) and a `target`.
 * Event-based "special" achievements have no `metric`/`target` — they are
 * binary and unlocked at workout completion, not from aggregate stats.
 */
export type AchievementCategory =
  | 'strength'
  | 'volume'
  | 'endurance'
  | 'consistency'
  | 'experience'
  | 'body'
  | 'special';
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond';
export type AchievementMetric =
  | 'totalWorkouts'
  | 'totalVolume'
  | 'maxWeight'
  | 'consistencyStreak'
  | 'prsThisMonth'
  /** Longest single set, in meters (distance milestones — exercise-scoped). */
  | 'maxDistance'
  /** Cumulative distance, in meters (distance landmarks — exercise-scoped). */
  | 'totalDistance'
  /** Bodyweight weigh-ins logged. */
  | 'weighInCount'
  /** Longest consecutive-day weigh-in streak. */
  | 'weighInStreak'
  /** Absolute bodyweight change since the first weigh-in, in kg. */
  | 'bodyChange'
  /** Whole-percent progress toward the bodyweight goal. */
  | 'bodyGoalPercent';
/**
 * Whether the achievement is earned globally (any exercise counts toward a
 * single unlock) or per-exercise (each exercise tracks its own unlock).
 */
export type AchievementScope = 'global' | 'exercise';

export interface AchievementDefinition {
  key: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  category: AchievementCategory;
  tier?: AchievementTier;
  /** Whether the achievement is global or scoped to each exercise. Defaults to 'global'. */
  scope?: AchievementScope;
  /** Aggregate metric driving progress. Absent on event-based achievements. */
  metric?: AchievementMetric;
  /** Progress target for the metric. */
  target?: number;
}

/** Display order of categories on the achievements list. */
export const ACHIEVEMENT_CATEGORY_ORDER: readonly AchievementCategory[] = [
  'strength',
  'volume',
  'endurance',
  'consistency',
  'experience',
  'body',
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
    scope: 'exercise',
    metric: 'prsThisMonth',
    target: 5,
  },
  // --- Volume: cumulative weight × reps, per exercise. ---
  {
    key: 'thousand_kg_club',
    nameKey: 'achievements.thousandKgClub.name',
    descriptionKey: 'achievements.thousandKgClub.description',
    icon: '💪',
    category: 'volume',
    tier: 'bronze',
    scope: 'exercise',
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
    scope: 'exercise',
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
    scope: 'exercise',
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
    scope: 'exercise',
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
  // --- Body: bodyweight tracking, evaluated on weigh-in / goal changes. ---
  {
    key: 'first_weigh_in',
    nameKey: 'achievements.body.firstWeighIn.name',
    descriptionKey: 'achievements.body.firstWeighIn.description',
    icon: '⚖️',
    category: 'body',
    metric: 'weighInCount',
    target: 1,
  },
  {
    key: 'weigh_in_streak_7',
    nameKey: 'achievements.body.weighInStreak7.name',
    descriptionKey: 'achievements.body.weighInStreak7.description',
    icon: '📆',
    category: 'body',
    tier: 'silver',
    metric: 'weighInStreak',
    target: 7,
  },
  {
    key: 'weigh_in_30',
    nameKey: 'achievements.body.weighIn30.name',
    descriptionKey: 'achievements.body.weighIn30.description',
    icon: '📊',
    category: 'body',
    tier: 'silver',
    metric: 'weighInCount',
    target: 30,
  },
  {
    key: 'weigh_in_100',
    nameKey: 'achievements.body.weighIn100.name',
    descriptionKey: 'achievements.body.weighIn100.description',
    icon: '🗂️',
    category: 'body',
    tier: 'gold',
    metric: 'weighInCount',
    target: 100,
  },
  // Goal achievements are never revoked: changing or clearing the goal later
  // must not take back a target that was really set / reached.
  {
    key: 'goal_set',
    nameKey: 'achievements.body.goalSet.name',
    descriptionKey: 'achievements.body.goalSet.description',
    icon: '🎯',
    category: 'body',
  },
  {
    key: 'goal_halfway',
    nameKey: 'achievements.body.goalHalfway.name',
    descriptionKey: 'achievements.body.goalHalfway.description',
    icon: '⛳',
    category: 'body',
    tier: 'silver',
    metric: 'bodyGoalPercent',
    target: 50,
  },
  {
    key: 'goal_reached',
    nameKey: 'achievements.body.goalReached.name',
    descriptionKey: 'achievements.body.goalReached.description',
    icon: '🏆',
    category: 'body',
    tier: 'gold',
    metric: 'bodyGoalPercent',
    target: 100,
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
  // Distance achievements are exercise-scoped only — never read globally.
  maxDistance: () => 0,
  totalDistance: () => 0,
  weighInCount: (stats) => stats.weighInCount,
  weighInStreak: (stats) => stats.weighInStreakDays,
  bodyChange: (stats) => stats.bodyChangeKg,
  bodyGoalPercent: (stats) => stats.bodyGoalPercent,
};

/**
 * Per-exercise stats feeding exercise-scoped achievement progress.
 */
export interface ExerciseAchievementStats {
  /** Cumulative weight × reps on this exercise (kg). */
  totalVolumeKg: number;
  /** Heaviest completed set on this exercise (kg). */
  maxWeightKg: number;
  /** Personal records set on this exercise in the current month. */
  prsThisMonth: number;
  /** Longest completed single set on this exercise (meters). */
  maxDistanceM: number;
  /** Cumulative completed distance on this exercise (meters). */
  totalDistanceM: number;
}

/**
 * Per-exercise metric readers (only the metrics exercise-scoped achievements use).
 */
export const EXERCISE_METRIC_READERS: Partial<
  Record<AchievementMetric, (stats: ExerciseAchievementStats) => number>
> = {
  totalVolume: (stats) => stats.totalVolumeKg,
  maxWeight: (stats) => stats.maxWeightKg,
  prsThisMonth: (stats) => stats.prsThisMonth,
  maxDistance: (stats) => stats.maxDistanceM,
  totalDistance: (stats) => stats.totalDistanceM,
};

/** A distance achievement in the shared `AchievementDefinition` shape. */
function normalizeDistanceAchievement(entry: DistanceAchievementDefinition): AchievementDefinition {
  return {
    key: entry.key,
    nameKey: entry.nameKey,
    descriptionKey: entry.descriptionKey,
    icon: entry.icon,
    category: 'endurance',
    tier: entry.tier,
    scope: 'exercise',
    metric: entry.kind === 'effort' ? 'maxDistance' : 'totalDistance',
    target: entry.thresholdM,
  };
}

/** A bodyweight milestone in the shared `AchievementDefinition` shape. */
function normalizeBodyComparative(entry: BodyComparativeDefinition): AchievementDefinition {
  return {
    key: entry.key,
    nameKey: entry.nameKey,
    descriptionKey: entry.descriptionKey,
    icon: entry.icon,
    category: 'body',
    tier: entry.tier,
    metric: 'bodyChange',
    target: entry.thresholdKg,
  };
}

/**
 * Every `body` achievement, evaluated from bodyweight data by
 * `syncBodyWeightAchievements` (src/db/body-weight.ts) rather than at workout
 * completion.
 */
export const BODY_ACHIEVEMENTS: readonly AchievementDefinition[] = [
  ...ACHIEVEMENTS.filter((entry) => entry.category === 'body'),
  ...BODY_COMPARATIVES.map(normalizeBodyComparative),
];

/** Body achievements tied to the goal — granted once, never revoked. */
export const BODY_GOAL_ACHIEVEMENT_KEYS: ReadonlySet<string> = new Set([
  'goal_set',
  'goal_halfway',
  'goal_reached',
]);

/**
 * Every exercise-scoped achievement unlocked from per-exercise stats: the
 * catalog's exercise-scoped entries plus the distance achievements. Weight
 * comparatives are excluded — they unlock per set via `unlockWeightComparatives`.
 */
export const EXERCISE_STAT_ACHIEVEMENTS: readonly AchievementDefinition[] = [
  ...ACHIEVEMENTS.filter((entry) => entry.scope === 'exercise'),
  ...DISTANCE_ACHIEVEMENTS.map(normalizeDistanceAchievement),
];

/**
 * Progress of an exercise-scoped achievement against one exercise's stats.
 */
export function computeExerciseAchievementProgress(
  key: string,
  stats: ExerciseAchievementStats
): AchievementProgress {
  const definition = getAchievementByKey(key);
  if (!definition || definition.metric === undefined || definition.target === undefined) {
    return { current: 0, target: 0, progress: 0 };
  }
  const reader = EXERCISE_METRIC_READERS[definition.metric];
  if (!reader) {
    return { current: 0, target: 0, progress: 0 };
  }
  const current = reader(stats);
  const target = definition.target;
  const progress = target > 0 ? Math.min(1, current / target) : 0;
  return { current, target, progress };
}

export function getAchievementByKey(key: string): AchievementDefinition | undefined {
  const achievement = ACHIEVEMENTS.find((entry) => entry.key === key);
  if (achievement) {
    return achievement;
  }
  // Distance milestones/landmarks: target = the meter threshold.
  const distance = getDistanceAchievementByKey(key);
  if (distance) {
    return normalizeDistanceAchievement(distance);
  }
  const body = getBodyComparativeByKey(key);
  if (body) {
    return normalizeBodyComparative(body);
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
        scope: 'exercise',
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
