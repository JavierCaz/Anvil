import dayjs from 'dayjs';
import type { SQLiteDatabase } from 'expo-sqlite';
import { BODY_ACHIEVEMENTS, type AchievementMetric } from '@/constants/achievements';
import type { BodyWeightGoal } from '@/store/body-weight-goal';
import {
  computeBodyWeightStats,
  type BodyWeightEntry,
  type BodyWeightStats,
} from '@/utils/body-weight';
import { unlockAchievementIfNew } from './achievements';

/**
 * Bodyweight tracker persistence (`body_weights`, SCHEMA_V15). One row per
 * local day; weights are stored in kg.
 */

/** Every weigh-in, oldest first. One per day, so the table stays small. */
export async function getBodyWeights(db: SQLiteDatabase): Promise<BodyWeightEntry[]> {
  return db.getAllAsync<BodyWeightEntry>(
    'SELECT measured_on AS day, weight_kg AS weightKg FROM body_weights ORDER BY measured_on'
  );
}

/** Log a weigh-in for `day`, replacing that day's value if one exists. */
export async function upsertBodyWeight(
  db: SQLiteDatabase,
  day: string,
  weightKg: number
): Promise<void> {
  await db.runAsync(
    `INSERT INTO body_weights (measured_on, weight_kg) VALUES (?, ?)
     ON CONFLICT(measured_on) DO UPDATE SET weight_kg = excluded.weight_kg`,
    day,
    weightKg
  );
}

const BODY_METRIC_READERS: Partial<Record<AchievementMetric, (stats: BodyWeightStats) => number>> = {
  weighInCount: (stats) => stats.weighInCount,
  weighInStreak: (stats) => stats.weighInStreakDays,
  bodyChange: (stats) => stats.bodyChangeKg,
  bodyGoalPercent: (stats) => stats.bodyGoalPercent,
};

/** Whether a `body` achievement's condition currently holds. */
export function isBodyAchievementEarned(
  key: string,
  stats: BodyWeightStats,
  goal: BodyWeightGoal | null
): boolean {
  const definition = BODY_ACHIEVEMENTS.find((entry) => entry.key === key);
  if (!definition) return false;
  if (definition.metric === undefined || definition.target === undefined) {
    return key === 'goal_set' && goal !== null;
  }
  const reader = BODY_METRIC_READERS[definition.metric];
  return reader !== undefined && reader(stats) >= definition.target;
}

/**
 * Bring the `body` achievements in line with the current weigh-ins and goal.
 * Call after every weigh-in and goal change. Newly earned ones are unlocked
 * (their keys are returned for the toast).
 *
 * With `revokeUnlockedOn` (a local day key), achievements unlocked on that
 * day that no longer hold are locked again — used when today's weigh-in is
 * overwritten, so a typo can't leave a badge behind. Achievements earned on
 * earlier days are kept even if the data has since moved, and `goal_set` is
 * never revoked (it doesn't depend on the weight).
 */
export async function syncBodyWeightAchievements(
  db: SQLiteDatabase,
  goal: BodyWeightGoal | null,
  revokeUnlockedOn?: string
): Promise<string[]> {
  const stats = computeBodyWeightStats(await getBodyWeights(db), goal);
  const rows = await db.getAllAsync<{ key: string; unlocked_at: string | null }>(
    'SELECT key, unlocked_at FROM achievements'
  );
  const unlockedAtByKey = new Map(rows.map((row) => [row.key, row.unlocked_at]));

  const newlyUnlocked: string[] = [];
  for (const definition of BODY_ACHIEVEMENTS) {
    if (!unlockedAtByKey.has(definition.key)) continue; // not seeded
    const unlockedAt = unlockedAtByKey.get(definition.key) ?? null;
    const earned = isBodyAchievementEarned(definition.key, stats, goal);
    if (earned && unlockedAt === null) {
      if (await unlockAchievementIfNew(db, definition.key)) {
        newlyUnlocked.push(definition.key);
      }
    } else if (
      !earned &&
      unlockedAt !== null &&
      revokeUnlockedOn !== undefined &&
      definition.key !== 'goal_set' &&
      dayjs(unlockedAt).format('YYYY-MM-DD') === revokeUnlockedOn
    ) {
      await db.runAsync('UPDATE achievements SET unlocked_at = NULL WHERE key = ?', definition.key);
    }
  }
  return newlyUnlocked;
}
