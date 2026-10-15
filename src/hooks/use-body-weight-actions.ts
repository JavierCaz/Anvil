import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ToastProvider';
import { getAchievementByKey } from '@/constants/achievements';
import { syncBodyWeightAchievements, upsertBodyWeight } from '@/db/body-weight';
import { useBodyWeightGoalStore } from '@/store/body-weight-goal';
import { todayKey } from '@/utils/body-weight';

/**
 * Bodyweight writes shared by the Home card, the Statistics card and
 * Settings: each write re-syncs the `body` achievements and announces new
 * unlocks with the floating toast.
 */
export function useBodyWeightActions() {
  const db = useSQLiteContext();
  const toast = useToast();
  const { t } = useTranslation();

  const announce = useCallback(
    (keys: string[]) => {
      for (const key of keys) {
        const definition = getAchievementByKey(key);
        if (!definition) continue;
        toast.show({
          achievementKey: key,
          title: t('bodyWeight.achievementUnlocked', { name: t(definition.nameKey) }),
          description: t(definition.descriptionKey),
        });
      }
    },
    [t, toast]
  );

  /** Log today's weigh-in (kg), replacing today's value if one exists. */
  const logToday = useCallback(
    async (weightKg: number) => {
      await upsertBodyWeight(db, todayKey(), weightKg);
      announce(await syncBodyWeightAchievements(db, useBodyWeightGoalStore.getState().goal));
    },
    [announce, db]
  );

  /** Set or adjust the goal target (kg). A new goal starts from `current`. */
  const setGoalTarget = useCallback(
    async (targetKg: number, current: { weightKg: number; day: string }) => {
      useBodyWeightGoalStore.getState().setTarget(targetKg, current);
      announce(await syncBodyWeightAchievements(db, useBodyWeightGoalStore.getState().goal));
    },
    [announce, db]
  );

  const clearGoal = useCallback(async () => {
    useBodyWeightGoalStore.getState().clearGoal();
    await syncBodyWeightAchievements(db, null);
  }, [db]);

  return { logToday, setGoalTarget, clearGoal };
}
