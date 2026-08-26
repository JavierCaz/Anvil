import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AchievementCard } from '@/components/AchievementCard';
import { Screen } from '@/components/Screen';
import { WeekStrip, type WeekDayItem } from '@/components/WeekStrip';
import {
  computeAchievementProgress,
  getAchievementByKey,
} from '@/constants/achievements';
import { getAchievements } from '@/db/achievements';
import { getWorkoutDaysInRange, getWorkoutStats } from '@/db/workouts';
import { useWeeklyGoalStore } from '@/store/workout-goals';
import { useAppTheme } from '@/theme/app-theme-provider';

interface HomeData {
  weekDays: WeekDayItem[];
  workoutCountThisWeek: number;
  achievements: {
    definitionKey: string;
    progress: number;
    unlocked: boolean;
  }[];
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

  useEffect(() => {
    let active = true;

    async function load() {
      const stats = await getWorkoutStats(db);
      const rows = await getAchievements(db);
      const workedOut = await getWorkoutDaysInRange(
        db,
        weekDays[0].iso,
        weekDays[6].iso
      );

      if (!active) {
        return;
      }

      const achievements = rows.map((row) => {
        const { progress } = computeAchievementProgress(row.key, stats);
        return {
          definitionKey: row.key,
          progress,
          unlocked: row.unlocked_at !== null,
        };
      });

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
  }, [db, weekDays]);

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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('home.achievements')}
          </Text>
          <Text style={[styles.sectionMeta, { color: colors.textSecondary }]}>
            {t('home.achievementsHint')}
          </Text>
        </View>
        {data?.achievements.map((item) => {
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
            />
          );
        })}
      </ScrollView>
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionMeta: {
    fontSize: 13,
  },
});
