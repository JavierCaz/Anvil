import type { WorkoutStats } from '@/db/workouts';

/**
 * Static catalog of achievements.
 *
 * The rows live in the `achievements` table (seeded by `SCHEMA_V2`); `key`
 * links a row to its definition here. Progress is computed from `WorkoutStats`.
 * Names/descriptions are rendered through i18n (`nameKey` / `descriptionKey`).
 */
export interface AchievementDefinition {
  key: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  target: number;
}

export const ACHIEVEMENTS: readonly AchievementDefinition[] = [
  {
    key: 'first_workout',
    nameKey: 'achievements.firstWorkout.name',
    descriptionKey: 'achievements.firstWorkout.description',
    icon: '🏋️',
    target: 1,
  },
  {
    key: 'thousand_kg_club',
    nameKey: 'achievements.thousandKgClub.name',
    descriptionKey: 'achievements.thousandKgClub.description',
    icon: '💪',
    target: 1000,
  },
  {
    key: 'consistency_king',
    nameKey: 'achievements.consistencyKing.name',
    descriptionKey: 'achievements.consistencyKing.description',
    icon: '👑',
    target: 30,
  },
  {
    key: 'progressive_overload',
    nameKey: 'achievements.progressiveOverload.name',
    descriptionKey: 'achievements.progressiveOverload.description',
    icon: '📈',
    target: 5,
  },
];

export function getAchievementByKey(key: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((achievement) => achievement.key === key);
}

export interface AchievementProgress {
  /** Raw progress toward the target. */
  current: number;
  target: number;
  /** 0..1 — capped at 1. */
  progress: number;
}

export function computeAchievementProgress(
  key: string,
  stats: WorkoutStats
): AchievementProgress {
  const definition = getAchievementByKey(key);
  if (!definition) {
    return { current: 0, target: 0, progress: 0 };
  }

  let current = 0;
  switch (key) {
    case 'first_workout':
      current = stats.totalWorkouts;
      break;
    case 'thousand_kg_club':
      current = stats.totalVolumeKg;
      break;
    case 'consistency_king':
      current = stats.currentStreak;
      break;
    case 'progressive_overload':
      current = stats.prsThisMonth;
      break;
  }

  const progress = definition.target > 0 ? Math.min(1, current / definition.target) : 0;
  return { current, target: definition.target, progress };
}
