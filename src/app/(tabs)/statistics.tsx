import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { BarTrendChart, type BarTrendPoint } from '@/components/charts/BarTrendChart';
import { MuscleDonut, type DonutSlice } from '@/components/charts/MuscleDonut';
import { muscleI18nKey } from '@/constants/exercises';
import {
  buildTimeSeries,
  getCardioDayDistances,
  getCardioStats,
  getMuscleDistribution,
  getSessionStats,
  getWorkoutDayCounts,
  type BucketGranularity,
} from '@/db/stats';
import { useFocusQuery } from '@/hooks/use-focus-query';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import { withAlpha } from '@/theme/colors';
import { distanceUnitLabel, formatDistance, formatPace, metersToDisplay } from '@/utils/distance';
import { formatDuration } from '@/utils/duration';

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

type ThemeColors = ReturnType<typeof useAppTheme>['colors'];

interface StatTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  label: string;
  value: string;
  colors: ThemeColors;
}

/** Metric tile: tinted icon well, large figure, quiet label. */
function StatTile({ icon, tint, label, value, colors }: StatTileProps) {
  return (
    <View style={[styles.statTile, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor: withAlpha(tint, 0.16) }]}>
        <Ionicons name={icon} size={16} color={tint} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

interface ChartCardProps {
  title: string;
  /** Short figure on the right of the title (total, peak…). */
  meta?: string;
  colors: ThemeColors;
  children: ReactNode;
}

function ChartCard({ title, meta, colors, children }: ChartCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        {meta ? <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>{meta}</Text> : null}
      </View>
      {children}
    </View>
  );
}

/** Index of the bucket containing today (the "current" bar), or -1. */
function currentBucketIndex(series: { start: string }[]): number {
  const today = dayjs().format('YYYY-MM-DD');
  let index = -1;
  series.forEach((point, i) => {
    if (point.start <= today) {
      index = i;
    }
  });
  return index;
}

export default function StatisticsScreen() {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const unit = useUnitsStore((state) => state.unitSystem);

  const [range, setRange] = useState<RangeKey>('week');

  const bounds = useMemo(() => getRangeBounds(range), [range]);
  const granularity = GRANULARITY[range];

  const { data, loaded } = useFocusQuery(
    async (db) => {
      const [sessionStats, muscleSlices, dayCounts, cardioStats, cardioDays] = await Promise.all([
        getSessionStats(db, bounds.from, bounds.to),
        getMuscleDistribution(db, bounds.from, bounds.to),
        getWorkoutDayCounts(db, bounds.from, bounds.to),
        getCardioStats(db, bounds.from, bounds.to),
        getCardioDayDistances(db, bounds.from, bounds.to),
      ]);
      return {
        stats: sessionStats,
        muscles: muscleSlices,
        series: buildTimeSeries(dayCounts, granularity, bounds.from, bounds.to),
        cardio: cardioStats,
        // Same bucket span as the sessions chart so both read on one timeline.
        distanceSeries: buildTimeSeries(
          cardioDays,
          granularity,
          bounds.from ?? dayCounts[0]?.day ?? null,
          bounds.to
        ),
      };
    },
    [bounds, granularity],
    { refetchOnFocus: true }
  );
  const stats = data?.stats ?? null;
  const muscles = useMemo(() => data?.muscles ?? [], [data]);
  const series = useMemo(() => data?.series ?? [], [data]);
  const cardio = data?.cardio ?? null;
  const distanceSeries = useMemo(() => data?.distanceSeries ?? [], [data]);
  const hasCardio = cardio !== null && cardio.sets > 0;

  const pieData = useMemo<DonutSlice[]>(
    () =>
      muscles.map((m, index) => ({
        label: m.muscle ? t(muscleI18nKey(m.muscle) ?? 'statistics.other') : t('statistics.other'),
        value: m.sets,
        color: colors.chartSeries[index % colors.chartSeries.length],
      })),
    [muscles, colors, t]
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

  const hasDistance = (cardio?.totalDistanceM ?? 0) > 0;

  const distanceChartTitle =
    granularity === 'day'
      ? t('statistics.distancePerDay', { unit: distanceUnitLabel(unit) })
      : granularity === 'week'
        ? t('statistics.distancePerWeek', { unit: distanceUnitLabel(unit) })
        : t('statistics.distancePerMonth', { unit: distanceUnitLabel(unit) });

  const avgPace = cardio ? formatPace(cardio.pacedSeconds, cardio.pacedDistanceM, unit) : null;

  const sessionPoints: BarTrendPoint[] = series.map((point) => ({
    label: bucketLabel(point.start),
    value: point.count,
  }));
  const distancePoints: BarTrendPoint[] = distanceSeries.map((point) => ({
    label: bucketLabel(point.start),
    value: metersToDisplay(point.count, unit),
  }));
  const sessionsHighlight = currentBucketIndex(series);
  const distanceHighlight = currentBucketIndex(distanceSeries);
  const peakSessions = Math.max(0, ...series.map((point) => point.count));

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
              style={[styles.filterPill, active && { backgroundColor: colors.surfaceElevated }]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  { color: active ? colors.text : colors.textSecondary },
                  active && styles.filterLabelActive,
                ]}
              >
                {t(`statistics.filters.${key}`)}
              </Text>
              {active && <View style={[styles.filterDot, { backgroundColor: colors.primary }]} />}
            </Pressable>
          );
        })}
      </View>

      {!loaded ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : stats === null ? (
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t('statistics.noData')}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statsGrid}>
            <StatTile
              icon="barbell"
              tint={colors.primary}
              label={t('statistics.sessions')}
              value={String(stats.sessions)}
              colors={colors}
            />
            <StatTile
              icon="time"
              tint={colors.accent}
              label={t('statistics.totalTime')}
              value={`${totalHours} ${t('statistics.hoursShort')}`}
              colors={colors}
            />
            <StatTile
              icon="hourglass"
              tint={colors.gold}
              label={t('statistics.avgDuration')}
              value={`${avgMinutes} ${t('statistics.minutesShort')}`}
              colors={colors}
            />
            <StatTile
              icon="layers"
              tint={colors.success}
              label={t('statistics.setsCompleted')}
              value={String(stats.setsCompleted)}
              colors={colors}
            />
          </View>

          <ChartCard
            title={barChartTitle}
            meta={
              stats.sessions > 0 ? t('statistics.peak', { value: peakSessions }) : undefined
            }
            colors={colors}
          >
            {stats.sessions === 0 || sessionPoints.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('statistics.noData')}
              </Text>
            ) : (
              <BarTrendChart
                data={sessionPoints}
                highlightIndex={sessionsHighlight}
                color={colors.primaryBright}
                colorDeep={colors.primaryPressed}
              />
            )}
          </ChartCard>

          <ChartCard title={t('statistics.musclesTitle')} colors={colors}>
            {stats.sessions === 0 || pieData.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('statistics.noData')}
              </Text>
            ) : (
              <MuscleDonut slices={pieData} centerCaption={t('statistics.setsUnit')} />
            )}
          </ChartCard>

          {hasCardio && cardio && (
            <ChartCard title={t('statistics.cardioTitle')} colors={colors}>
              <View style={styles.statsGrid}>
                {hasDistance && (
                  <StatTile
                    icon="navigate"
                    tint={colors.accent}
                    label={t('statistics.totalDistance')}
                    value={`${formatDistance(cardio.totalDistanceM, unit)} ${distanceUnitLabel(unit)}`}
                    colors={colors}
                  />
                )}
                <StatTile
                  icon="stopwatch"
                  tint={colors.primary}
                  label={t('statistics.cardioTime')}
                  value={formatDuration(cardio.totalDurationSeconds)}
                  colors={colors}
                />
                {avgPace && (
                  <StatTile
                    icon="speedometer"
                    tint={colors.gold}
                    label={t('statistics.avgPace')}
                    value={avgPace}
                    colors={colors}
                  />
                )}
              </View>

              {hasDistance && distancePoints.length > 0 && (
                <>
                  <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                    {distanceChartTitle}
                  </Text>
                  <BarTrendChart
                    data={distancePoints}
                    highlightIndex={distanceHighlight}
                    color={withAlpha(colors.accent, 1)}
                    colorDeep={withAlpha(colors.accent, 0.35)}
                    height={150}
                  />
                </>
              )}
            </ChartCard>
          )}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 4,
  },
  filterPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 6,
    borderRadius: 12,
    gap: 3,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterLabelActive: {
    fontWeight: '800',
  },
  filterDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statTile: {
    flexBasis: '46%',
    flexGrow: 1,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 6,
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  card: {
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cardMeta: {
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
});
