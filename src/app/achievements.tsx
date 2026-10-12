import { Stack } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AchievementCard } from '@/components/AchievementCard';
import { AchievementDetailModal } from '@/components/AchievementDetailModal';
import { Screen } from '@/components/Screen';
import {
  ACHIEVEMENT_CATEGORY_ORDER,
  getAchievementByKey,
} from '@/constants/achievements';
import {
  buildAchievementItems,
  getAllExerciseUnlocks,
  getAchievementExerciseMeta,
  getAchievements,
  type AchievementProgressItem,
} from '@/db/achievements';
import { getAllExerciseStats, getWorkoutStats } from '@/db/workouts';
import { useFocusQuery } from '@/hooks/use-focus-query';
import { useWeeklyGoalStore } from '@/store/workout-goals';
import { useAppTheme } from '@/theme/app-theme-provider';

/** Full achievements catalog, grouped by category. */
export default function AchievementsScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const weeklyGoal = useWeeklyGoalStore((state) => state.weeklyWorkouts);

  const [selectedAchievement, setSelectedAchievement] = useState<AchievementProgressItem | null>(null);

  const { data, loaded } = useFocusQuery(
    async (db) => {
      const [stats, rows, exerciseStats, exerciseUnlocks, exerciseMeta] = await Promise.all([
        getWorkoutStats(db, { weeklyGoal }),
        getAchievements(db),
        getAllExerciseStats(db),
        getAllExerciseUnlocks(db),
        getAchievementExerciseMeta(db),
      ]);
      return buildAchievementItems(rows, stats, {
        exerciseStats,
        unlockedExerciseKeys: exerciseUnlocks,
        exerciseMeta,
      });
    },
    [weeklyGoal],
    { refetchOnFocus: true }
  );
  const items = data ?? [];

  const unlockedCount = items?.filter((item) => item.unlocked).length ?? 0;

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: true, title: t('achievements.title') }} />

      {!loaded ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            {t('achievements.unlockedCount', { unlocked: unlockedCount, total: items.length })}
          </Text>

          {ACHIEVEMENT_CATEGORY_ORDER.map((category) => {
            const categoryItems = items.filter((item) => item.category === category);
            if (categoryItems.length === 0) {
              return null;
            }
            return (
              <View key={category} style={styles.categoryGroup}>
                <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>
                  {t(`achievements.categories.${category}`)}
                </Text>
                {categoryItems.map((item) => {
                  const definition = getAchievementByKey(item.definitionKey);
                  if (!definition) {
                    return null;
                  }
                  return (
                    <AchievementCard
                      key={definition.key}
                      definition={definition}
                      progress={item.progress}
                      unlocked={item.unlocked}
                      onPress={() => setSelectedAchievement(item)}
                    />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      )}

      {selectedAchievement && (() => {
        const definition = getAchievementByKey(selectedAchievement.definitionKey);
        return definition ? (
          <AchievementDetailModal
            definition={definition}
            progress={selectedAchievement.progress}
            unlocked={selectedAchievement.unlocked}
            unlockedAt={selectedAchievement.unlockedAt}
            exercises={selectedAchievement.exercises}
            onClose={() => setSelectedAchievement(null)}
          />
        ) : null;
      })()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  summaryText: {
    fontSize: 13,
    marginTop: 4,
  },
  categoryGroup: {
    gap: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 2,
  },
});
