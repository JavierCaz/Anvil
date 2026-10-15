import { Stack } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AchievementCard } from '@/components/AchievementCard';
import { AchievementDetailModal } from '@/components/AchievementDetailModal';
import { HeroGlow } from '@/components/HeroGlow';
import { ProgressRing } from '@/components/ProgressRing';
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
import { useBodyWeightGoalStore } from '@/store/body-weight-goal';
import { useWeeklyGoalStore } from '@/store/workout-goals';
import { useAppTheme } from '@/theme/app-theme-provider';
import { radius, shape, typography } from '@/theme/tokens';

/** Full achievements catalog, grouped by category. */
export default function AchievementsScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const weeklyGoal = useWeeklyGoalStore((state) => state.weeklyWorkouts);
  const bodyWeightGoal = useBodyWeightGoalStore((state) => state.goal);

  const [selectedAchievement, setSelectedAchievement] = useState<AchievementProgressItem | null>(null);

  const { data, loaded } = useFocusQuery(
    async (db) => {
      const [stats, rows, exerciseStats, exerciseUnlocks, exerciseMeta] = await Promise.all([
        getWorkoutStats(db, { weeklyGoal, bodyWeightGoal }),
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
    [weeklyGoal, bodyWeightGoal],
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
          <View style={[shape.card, styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <HeroGlow color={colors.primary} />
            <View style={styles.summaryCopy}>
              <Text style={[typography.overline, { color: colors.primary }]}>
                {t('achievements.title')}
              </Text>
              <Text style={[styles.summaryFigure, { color: colors.text }]}>
                {unlockedCount}
                <Text style={[styles.summaryTotal, { color: colors.textSecondary }]}>/{items.length}</Text>
              </Text>
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                {t('achievements.unlockedCount', { unlocked: unlockedCount, total: items.length })}
              </Text>
            </View>
            <ProgressRing progress={items.length > 0 ? unlockedCount / items.length : 0} size={84} strokeWidth={8}>
              <Text style={[styles.ringPercent, { color: colors.text }]}>
                {items.length > 0 ? Math.round((unlockedCount / items.length) * 100) : 0}%
              </Text>
            </ProgressRing>
          </View>

          {ACHIEVEMENT_CATEGORY_ORDER.map((category) => {
            const categoryItems = items.filter((item) => item.category === category);
            if (categoryItems.length === 0) {
              return null;
            }
            return (
              <View key={category} style={styles.categoryGroup}>
                <View style={styles.categoryHeader}>
                  <Text style={[typography.overline, { color: colors.textSecondary }]}>
                    {t(`achievements.categories.${category}`)}
                  </Text>
                  <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                    {categoryItems.filter((item) => item.unlocked).length}/{categoryItems.length}
                  </Text>
                </View>
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
    paddingTop: 8,
    paddingBottom: 32,
    gap: 12,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  summaryCopy: {
    flex: 1,
    gap: 2,
  },
  summaryFigure: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1.2,
    fontVariant: ['tabular-nums'],
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryText: {
    ...typography.caption,
  },
  ringPercent: {
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  categoryGroup: {
    gap: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
