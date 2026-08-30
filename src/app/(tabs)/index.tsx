import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AchievementDetailModal } from '@/components/AchievementDetailModal';
import { Screen } from '@/components/Screen';
import { WeekStrip, type WeekDayItem } from '@/components/WeekStrip';
import { getAchievementByKey } from '@/constants/achievements';
import {
  buildAchievementItems,
  getAchievements,
  type AchievementProgressItem,
} from '@/db/achievements';
import { getWorkoutDaysInRange, getWorkoutStats } from '@/db/workouts';
import { useWeeklyGoalStore } from '@/store/workout-goals';
import { useAppTheme } from '@/theme/app-theme-provider';

interface HomeData {
  weekDays: WeekDayItem[];
  workoutCountThisWeek: number;
  achievements: AchievementProgressItem[];
}

/** Monday of the current week, independent of the dayjs locale week start. */
function getMonday(locale: string): dayjs.Dayjs {
  const today = dayjs().locale(locale);
  const day = today.day(); // 0 = Sunday … 6 = Saturday
  return (day === 0 ? today.subtract(6, 'day') : today.subtract(day - 1, 'day')).startOf('day');
}

export default function HomeScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const weeklyGoal = useWeeklyGoalStore((state) => state.weeklyWorkouts);

  const [data, setData] = useState<HomeData | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementProgressItem | null>(null);

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

  // Reload on every focus so newly unlocked achievements / fresh stats show
  // immediately when returning from a workout (tab screens stay mounted).
  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        const stats = await getWorkoutStats(db, { weeklyGoal });
        const rows = await getAchievements(db);
        const workedOut = await getWorkoutDaysInRange(
          db,
          weekDays[0].iso,
          weekDays[6].iso
        );

        if (!active) {
          return;
        }

        const achievements = buildAchievementItems(rows, stats);

        setData({
          weekDays: weekDays.map((day) => ({ ...day, workedOut: workedOut.has(day.iso) })),
          workoutCountThisWeek: [...workedOut].filter((iso) =>
            weekDays.some((day) => day.iso === iso)
          ).length,
          achievements,
        });
      }

      void load();
      return () => {
        active = false;
      };
    }, [db, weekDays, weeklyGoal])
  );

  // Summary: most recently unlocked first, then the closest-to-unlocking, capped at 3.
  const summaryItems = useMemo(() => {
    const items = data?.achievements ?? [];
    const unlocked = items
      .filter((item) => item.unlocked)
      .sort((a, b) => (b.unlockedAt ?? '').localeCompare(a.unlockedAt ?? ''));
    const inProgress = items
      .filter((item) => !item.unlocked)
      .sort((a, b) => b.progress - a.progress);
    return [...unlocked, ...inProgress].slice(0, 3);
  }, [data]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('common.appName')}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('settings.title')}
          hitSlop={8}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.thisWeek')}</Text>
          <Text style={[styles.sectionMeta, { color: colors.textSecondary }]}>
            {t('home.workoutsOf', {
              done: Math.min(data?.workoutCountThisWeek ?? 0, weeklyGoal),
              goal: weeklyGoal,
            })}
          </Text>
        </View>
        {data && <WeekStrip days={data.weekDays} />}

        <View style={styles.achievementsHeader}>
          <View style={styles.achievementsTitleRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('home.achievements')}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('home.seeAll')}
              hitSlop={8}
              onPress={() => router.push('/achievements')}
              style={({ pressed }) => [styles.seeAllButton, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.seeAllLabel, { color: colors.primary }]}>
                {t('home.seeAll')}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </Pressable>
          </View>
          <Text style={[styles.sectionMeta, { color: colors.textSecondary }]}>
            {t('home.achievementsHint')}
          </Text>
        </View>

        {summaryItems.map((item) => {
          const definition = getAchievementByKey(item.definitionKey);
          if (!definition) {
            return null;
          }
          return (
            <Pressable
              key={definition.key}
              accessibilityRole="button"
              onPress={() => setSelectedAchievement(item)}
              style={({ pressed }) => [
                styles.summaryRow,
                {
                  backgroundColor: colors.surface,
                  borderColor: item.unlocked ? colors.primary : colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={styles.summaryIcon}>{definition.icon}</Text>
              <Text style={[styles.summaryName, { color: colors.text }]} numberOfLines={1}>
                {t(definition.nameKey)}
              </Text>
              <Text
                style={[
                  styles.summaryPercent,
                  { color: item.unlocked ? colors.primary : colors.textSecondary },
                ]}
              >
                {item.unlocked ? t('achievements.unlocked') : `${Math.round(item.progress * 100)}%`}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {selectedAchievement && (() => {
        const definition = getAchievementByKey(selectedAchievement.definitionKey);
        return definition ? (
          <AchievementDetailModal
            definition={definition}
            progress={selectedAchievement.progress}
            unlocked={selectedAchievement.unlocked}
            unlockedAt={selectedAchievement.unlockedAt}
            onClose={() => setSelectedAchievement(null)}
          />
        ) : null;
      })()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  achievementsHeader: {
    marginTop: 16,
    gap: 2,
  },
  achievementsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  summaryIcon: {
    fontSize: 20,
  },
  summaryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryPercent: {
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionMeta: {
    fontSize: 13,
  },
});
