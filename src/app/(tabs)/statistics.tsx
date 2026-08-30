import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bar, CartesianChart, Pie, PolarChart } from 'victory-native';
import { Screen } from '@/components/Screen';
import { muscleI18nKey } from '@/constants/exercises';
import {
  buildTimeSeries,
  getMuscleDistribution,
  getSessionStats,
  getWorkoutDayCounts,
  type BucketGranularity,
  type MuscleSlice,
  type SessionStats,
  type TimeSeriesPoint,
} from '@/db/stats';
import { useAppTheme } from '@/theme/app-theme-provider';

type RangeKey = 'week' | 'month' | 'year' | 'all';

const RANGE_KEYS: RangeKey[] = ['week', 'month', 'year', 'all'];

/** Bar chart bucketing adapts to the selected range: week → day, month → week, year/all → month. */
const GRANULARITY: Record<RangeKey, BucketGranularity> = {
  week: 'day',
  month: 'week',
  year: 'month',
  all: 'month',
};

/** Monday of the week containing `day`, independent of the dayjs locale week start. */
function mondayOf(day: dayjs.Dayjs): dayjs.Dayjs {
  const weekday = day.day(); // 0 = Sunday … 6 = Saturday
  return (weekday === 0 ? day.subtract(6, 'day') : day.subtract(weekday - 1, 'day')).startOf('day');
}

/** UTC bounds `[from, to)` for the selected range; `null` = unbounded ("all"). */
function getRangeBounds(range: RangeKey): { from: string | null; to: string | null } {
  const now = dayjs();
  switch (range) {
    case 'week': {
      const start = mondayOf(now);
      return { from: start.toISOString(), to: start.add(7, 'day').toISOString() };
    }
    case 'month': {
      const start = now.startOf('month');
      return { from: start.toISOString(), to: start.add(1, 'month').toISOString() };
    }
    case 'year': {
      const start = now.startOf('year');
      return { from: start.toISOString(), to: start.add(1, 'year').toISOString() };
    }
    case 'all':
      return { from: null, to: null };
  }
}

interface StatCardProps {
  label: string;
  value: string;
  colors: ReturnType<typeof useAppTheme>['colors'];
}

function StatCard({ label, value, colors }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

export default function StatisticsScreen() {
  const db = useSQLiteContext();
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();

  const [range, setRange] = useState<RangeKey>('week');
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [muscles, setMuscles] = useState<MuscleSlice[]>([]);
  const [series, setSeries] = useState<TimeSeriesPoint[]>([]);

  const bounds = useMemo(() => getRangeBounds(range), [range]);
  const granularity = GRANULARITY[range];

  // Reload on every focus so stats reflect completed workouts immediately
  // (tab screens stay mounted and a plain effect would go stale).
  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        const [sessionStats, muscleSlices, dayCounts] = await Promise.all([
          getSessionStats(db, bounds.from, bounds.to),
          getMuscleDistribution(db, bounds.from, bounds.to),
          getWorkoutDayCounts(db, bounds.from, bounds.to),
        ]);
        if (!active) {
          return;
        }
        setStats(sessionStats);
        setMuscles(muscleSlices);
        setSeries(buildTimeSeries(dayCounts, granularity, bounds.from, bounds.to));
      }

      void load();
      return () => {
        active = false;
      };
    }, [db, bounds, granularity])
  );

  // Categorical palette built from semantic theme colors (never hardcode hex).
  const chartPalette = useMemo(
    () => [
      colors.primary,
      colors.accent,
      colors.success,
      colors.warning,
      colors.error,
      colors.primaryPressed,
      colors.textSecondary,
    ],
    [colors]
  );

  const pieData = useMemo(
    () =>
      muscles.map((m, index) => ({
        label: m.muscle ? t(muscleI18nKey(m.muscle) ?? 'statistics.other') : t('statistics.other'),
        value: m.sets,
        color: chartPalette[index % chartPalette.length],
      })),
    [muscles, chartPalette, t]
  );

  const barData = useMemo(
    () =>
      series.map((point) => ({
        x: point.start,
        y: point.count,
      })),
    [series]
  );

  // Bucket labels: "Mon" (day), "Aug 3" (week), "Jan" or "Jan '25" (month, year-aware when long).
  const bucketLabel = (start: string) => {
    const d = dayjs(start).locale(i18n.language);
    if (granularity === 'day') {
      return d.format('ddd');
    }
    if (granularity === 'week') {
      return d.format('MMM D');
    }
    return series.length > 12 ? d.format('MMM YY') : d.format('MMM');
  };

  const barChartTitle =
    granularity === 'day'
      ? t('statistics.workoutsPerDay')
      : granularity === 'week'
        ? t('statistics.workoutsPerWeek')
        : t('statistics.workoutsPerMonth');

  const totalHours = ((stats?.totalSeconds ?? 0) / 3600).toFixed(1);
  const avgMinutes = Math.round((stats?.avgSeconds ?? 0) / 60);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('tabs.statistics')}</Text>
      </View>

      <View style={[styles.filterRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {RANGE_KEYS.map((key) => {
          const active = key === range;
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setRange(key)}
              style={[
                styles.filterPill,
                active && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  { color: active ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {t(`statistics.filters.${key}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {stats === null ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statsGrid}>
            <StatCard
              label={t('statistics.sessions')}
              value={String(stats.sessions)}
              colors={colors}
            />
            <StatCard
              label={t('statistics.totalTime')}
              value={`${totalHours} ${t('statistics.hoursShort')}`}
              colors={colors}
            />
            <StatCard
              label={t('statistics.avgDuration')}
              value={`${avgMinutes} ${t('statistics.minutesShort')}`}
              colors={colors}
            />
            <StatCard
              label={t('statistics.setsCompleted')}
              value={String(stats.setsCompleted)}
              colors={colors}
            />
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('statistics.musclesTitle')}</Text>
            {stats.sessions === 0 || pieData.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('statistics.noData')}
              </Text>
            ) : (
              <>
                <View style={styles.chartBox}>
                  <PolarChart
                    data={pieData}
                    labelKey="label"
                    valueKey="value"
                    colorKey="color"
                  >
                    <Pie.Chart innerRadius="55%" />
                  </PolarChart>
                </View>
                <View style={styles.legend}>
                  {pieData.map((slice, index) => (
                    <View key={`${slice.label}-${index}`} style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: slice.color }]} />
                      <Text style={[styles.legendText, { color: colors.text }]}>
                        {slice.label} · {slice.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{barChartTitle}</Text>
            {stats.sessions === 0 || barData.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('statistics.noData')}
              </Text>
            ) : (
              <>
                <View style={styles.chartBox}>
                  <CartesianChart data={barData} xKey="x" yKeys={['y']}>
                    {({ points, chartBounds }) => (
                      <Bar
                        points={points.y}
                        chartBounds={chartBounds}
                        color={colors.primary}
                        roundedCorners={{ topLeft: 6, topRight: 6 }}
                      />
                    )}
                  </CartesianChart>
                </View>
                <View style={styles.axisRow}>
                  {series.map((point) => (
                    <Text
                      key={point.start}
                      numberOfLines={1}
                      style={[styles.axisLabel, { color: colors.textSecondary }]}
                    >
                      {bucketLabel(point.start)}
                    </Text>
                  ))}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
  },
  filterPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 13,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  chartBox: {
    height: 220,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  axisLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
  },
});
