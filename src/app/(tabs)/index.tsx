import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AchievementBadge } from '@/components/AchievementBadge';
import { AchievementDetailModal } from '@/components/AchievementDetailModal';
import { ExerciseDetailModal } from '@/components/ExerciseDetailModal';
import { AnvilLogo } from '@/components/AnvilLogo';
import { BodyWeightHomeCard } from '@/components/BodyWeightHomeCard';
import { GoalToggleButton } from '@/components/GoalToggleButton';
import { HeroGlow } from '@/components/HeroGlow';
import { ProgressBar } from '@/components/ProgressBar';
import { ProgressRing } from '@/components/ProgressRing';
import { Screen } from '@/components/Screen';
import { WeekStrip, type WeekDayItem } from '@/components/WeekStrip';
import { WeeklyGoalEditor } from '@/components/WeeklyGoalEditor';
import { getAchievementByKey } from '@/constants/achievements';
import {
  buildAchievementItems,
  getAllExerciseUnlocks,
  getAchievementExerciseMeta,
  getAchievements,
  type AchievementProgressItem,
} from '@/db/achievements';
import { getBodyWeights } from '@/db/body-weight';
import { getAllExerciseStats, getWorkoutDaysInRange, getWorkoutStats } from '@/db/workouts';
import { useExerciseInfo } from '@/hooks/use-exercise-info';
import { useFocusQuery } from '@/hooks/use-focus-query';
import { useBodyWeightGoalStore } from '@/store/body-weight-goal';
import { useWeeklyGoalStore } from '@/store/workout-goals';
import { useAppTheme } from '@/theme/app-theme-provider';
import type { BodyWeightEntry } from '@/utils/body-weight';

interface HomeData {
  weekDays: WeekDayItem[];
  workoutCountThisWeek: number;
  achievements: AchievementProgressItem[];
  bodyWeights: BodyWeightEntry[];
}

/** Monday of the current week, independent of the dayjs locale week start. */
function getMonday(locale: string): dayjs.Dayjs {
  const today = dayjs().locale(locale);
  const day = today.day(); // 0 = Sunday … 6 = Saturday
  return (day === 0 ? today.subtract(6, 'day') : today.subtract(day - 1, 'day')).startOf('day');
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const weeklyGoal = useWeeklyGoalStore((state) => state.weeklyWorkouts);
  const bodyWeightGoal = useBodyWeightGoalStore((state) => state.goal);

  const [selectedAchievement, setSelectedAchievement] = useState<AchievementProgressItem | null>(null);
  const exerciseInfo = useExerciseInfo();
  const [editingWeeklyGoal, setEditingWeeklyGoal] = useState(false);

  const monday = useMemo(() => getMonday(i18n.language), [i18n.language]);
  const weekDays = useMemo<WeekDayItem[]>(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const day = monday.add(index, 'day');
        return {
          iso: day.format('YYYY-MM-DD'),
          label: day.format('ddd'),
          dayOfMonth: Number(day.format('D')),
          isToday: day.isSame(dayjs(), 'day'),
          workedOut: false,
        };
      }),
    [monday]
  );

  const { data, reload } = useFocusQuery<HomeData>(
    async (db) => {
      const [stats, rows, exerciseStats, exerciseUnlocks, exerciseMeta, bodyWeights] =
        await Promise.all([
          getWorkoutStats(db, { weeklyGoal, bodyWeightGoal }),
          getAchievements(db),
          getAllExerciseStats(db),
          getAllExerciseUnlocks(db),
          getAchievementExerciseMeta(db),
          getBodyWeights(db),
        ]);
      const workedOut = await getWorkoutDaysInRange(db, weekDays[0].iso, weekDays[6].iso);

      const achievements = buildAchievementItems(rows, stats, {
        exerciseStats,
        unlockedExerciseKeys: exerciseUnlocks,
        exerciseMeta,
      });

      return {
        weekDays: weekDays.map((day) => ({ ...day, workedOut: workedOut.has(day.iso) })),
        workoutCountThisWeek: [...workedOut].filter((iso) => weekDays.some((day) => day.iso === iso))
          .length,
        achievements,
        bodyWeights,
      };
    },
    [weekDays, weeklyGoal, bodyWeightGoal],
    { refetchOnFocus: true }
  );

  // Summary: the 3 most recently unlocked, plus the 3 closest to unlocking to keep the user motivated.
  const summaryGroups = useMemo(() => {
    const items = data?.achievements ?? [];
    const unlocked = items
      .filter((item) => item.unlocked)
      .sort((a, b) => (b.unlockedAt ?? '').localeCompare(a.unlockedAt ?? ''))
      .slice(0, 3);
    const inProgress = items
      .filter((item) => !item.unlocked)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);
    return [
      { key: 'closest', labelKey: 'home.closestToUnlock', items: inProgress },
      { key: 'recent', labelKey: 'home.recentlyUnlocked', items: unlocked },
    ].filter((group) => group.items.length > 0);
  }, [data]);

  const done = Math.min(data?.workoutCountThisWeek ?? 0, weeklyGoal);
  const remaining = Math.max(0, weeklyGoal - done);
  const goalProgress = weeklyGoal > 0 ? done / weeklyGoal : 0;
  const unlockedTotal = data?.achievements.filter((item) => item.unlocked).length ?? 0;

  return (
    <Screen>
      <View style={styles.header}>
        <AnvilLogo markWidth={52} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('settings.title')}
          hitSlop={8}
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="settings-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>{t('home.tagline')}</Text>

        {/* Weekly hero */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <HeroGlow color={colors.primary} />
          <View style={styles.heroTop}>
            <View style={styles.heroCopy}>
              <View style={styles.overlineRow}>
                <Text style={[styles.overline, { color: colors.primary }]}>{t('home.thisWeek')}</Text>
                <GoalToggleButton
                  editing={editingWeeklyGoal}
                  hasGoal
                  onPress={() => setEditingWeeklyGoal((editing) => !editing)}
                />
              </View>
              <View style={styles.heroFigureRow}>
                <Text style={[styles.heroFigure, { color: colors.text }]}>{done}</Text>
                <Text style={[styles.heroFigureGoal, { color: colors.textSecondary }]}>
                  /{weeklyGoal}
                </Text>
              </View>
              <Text style={[styles.heroCaption, { color: colors.textSecondary }]}>
                {remaining === 0
                  ? t('home.goalReached')
                  : t('home.goalRemaining', { count: remaining })}
              </Text>
            </View>
            <ProgressRing progress={goalProgress} size={84} strokeWidth={8}>
              <Ionicons
                name={remaining === 0 ? 'flame' : 'barbell'}
                size={26}
                color={remaining === 0 ? colors.primary : colors.textSecondary}
              />
            </ProgressRing>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {data && <WeekStrip days={data.weekDays} />}
          {editingWeeklyGoal && <WeeklyGoalEditor />}
        </View>

        {/* Bodyweight quick action */}
        {data && <BodyWeightHomeCard entries={data.bodyWeights} onSaved={reload} />}

        {/* Achievements */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleBlock}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('home.achievements')}
            </Text>
            <Text style={[styles.sectionMeta, { color: colors.textSecondary }]}>
              {data
                ? t('home.unlockedOf', { unlocked: unlockedTotal, total: data.achievements.length })
                : t('home.achievementsHint')}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('home.seeAll')}
            hitSlop={8}
            onPress={() => router.push('/achievements')}
            style={({ pressed }) => [
              styles.seeAllButton,
              { backgroundColor: colors.primarySoft, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={[styles.seeAllLabel, { color: colors.primary }]}>{t('home.seeAll')}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </Pressable>
        </View>

        {summaryGroups.map((group) => (
          <View key={group.key} style={styles.summaryGroup}>
            <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>{t(group.labelKey)}</Text>
            <View style={[styles.listCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {group.items.map((item, index) => {
                const definition = getAchievementByKey(item.definitionKey);
                if (!definition) {
                  return null;
                }
                const percent = Math.round(item.progress * 100);
                return (
                  <Pressable
                    key={definition.key}
                    accessibilityRole="button"
                    onPress={() => setSelectedAchievement(item)}
                    style={({ pressed }) => [
                      styles.summaryRow,
                      index > 0 && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth },
                      { opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <AchievementBadge achievementKey={definition.key} size={44} locked={!item.unlocked} />
                    <View style={styles.summaryBody}>
                      <Text style={[styles.summaryName, { color: colors.text }]} numberOfLines={1}>
                        {t(definition.nameKey)}
                      </Text>
                      {item.unlocked ? (
                        <Text style={[styles.summaryStatus, { color: colors.primary }]}>
                          {t('achievements.unlocked')}
                        </Text>
                      ) : (
                        <View style={styles.summaryProgressRow}>
                          <ProgressBar progress={item.progress} height={4} />
                          <Text style={[styles.summaryPercent, { color: colors.textSecondary }]}>
                            {percent}%
                          </Text>
                        </View>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {selectedAchievement && (() => {
        const definition = getAchievementByKey(selectedAchievement.definitionKey);
        return definition ? (
          <AchievementDetailModal
            definition={definition}
            progress={selectedAchievement.progress}
            unlocked={selectedAchievement.unlocked}
            unlockedAt={selectedAchievement.unlockedAt}
            exercises={selectedAchievement.exercises}
            onExercisePress={(exerciseId) =>
              exerciseInfo.open(exerciseId, () => setSelectedAchievement(null))
            }
            onClose={() => setSelectedAchievement(null)}
          />
        ) : null;
      })()}
      {exerciseInfo.info && (
        <ExerciseDetailModal
          exercise={exerciseInfo.info.exercise}
          achievementKeys={exerciseInfo.info.achievementKeys}
          onAchievementPress={(key) => {
            const item = (data?.achievements ?? []).find((candidate) => candidate.definitionKey === key);
            if (!item) {
              return;
            }
            // Defer mounting the next modal out of the touch handler, or the
            // tap's touch-up lands on its backdrop and closes it instantly.
            setTimeout(() => {
              exerciseInfo.close();
              setSelectedAchievement(item);
            }, 0);
          }}
          onClose={exerciseInfo.close}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 14,
  },
  tagline: {
    fontSize: 13,
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 16,
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroCopy: {
    flex: 1,
    gap: 2,
  },
  overlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  overline: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  heroFigureRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  heroFigure: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  },
  heroFigureGoal: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 2,
    fontVariant: ['tabular-nums'],
  },
  heroCaption: {
    fontSize: 13,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  sectionTitleBlock: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionMeta: {
    fontSize: 13,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  seeAllLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  summaryGroup: {
    gap: 8,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  listCard: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  summaryBody: {
    flex: 1,
    gap: 6,
  },
  summaryName: {
    fontSize: 15,
    fontWeight: '700',
  },
  summaryStatus: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  summaryProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryPercent: {
    width: 36,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
});
