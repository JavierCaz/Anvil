import dayjs from 'dayjs';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { BodyComparisonLine } from '@/components/BodyComparisonLine';
import { BodyWeightDelta } from '@/components/BodyWeightDelta';
import { LineTrendChart, type LineTrendPoint } from '@/components/charts/LineTrendChart';
import { useBodyWeightGoalStore } from '@/store/body-weight-goal';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import { withAlpha } from '@/theme/colors';
import {
  entriesInRange,
  formatBodyWeight,
  movingAverage,
  MOVING_AVERAGE_DAYS,
  type BodyWeightEntry,
} from '@/utils/body-weight';
import { kgToDisplay, weightUnitLabel } from '@/utils/weight';

export type BodyWeightRange = 'week' | 'month' | 'year' | 'all';

interface BodyWeightTrendProps {
  /** All weigh-ins, oldest first. */
  entries: readonly BodyWeightEntry[];
  range: BodyWeightRange;
  /** Local-day bounds `[fromDay, toDay)` of the selected range; null = open. */
  fromDay: string | null;
  toDay: string | null;
}

/**
 * Body of the Statistics tab's bodyweight card: current weight, change over
 * the selected range, the trend chart (raw weigh-ins + moving average + goal
 * line) and the fun comparison. Logging happens on the Home card.
 */
export function BodyWeightTrend({ entries, range, fromDay, toDay }: BodyWeightTrendProps) {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const unit = useUnitsStore((state) => state.unitSystem);
  const goal = useBodyWeightGoalStore((state) => state.goal);

  const inRange = useMemo(() => entriesInRange(entries, fromDay, toDay), [entries, fromDay, toDay]);

  // Average over the full history so the first points of a range still get a
  // complete window from the days before it.
  const points = useMemo<LineTrendPoint[]>(() => {
    const averages = movingAverage(entries);
    const averageByDay = new Map(entries.map((entry, index) => [entry.day, averages[index]]));
    return inRange.map((entry) => ({
      day: entry.day,
      value: kgToDisplay(entry.weightKg, unit),
      average: kgToDisplay(averageByDay.get(entry.day) ?? entry.weightKg, unit),
    }));
  }, [entries, inRange, unit]);

  const latest = entries[entries.length - 1] ?? null;
  const rangeDelta =
    inRange.length >= 2 ? inRange[inRange.length - 1].weightKg - inRange[0].weightKg : null;
  const formatDay = (day: string) =>
    dayjs(day)
      .locale(i18n.language)
      .format(range === 'week' ? 'ddd D' : 'MMM D');

  return (
    <View style={styles.container}>
      {latest ? (
        <View style={styles.summaryRow}>
          <Text style={[styles.figure, { color: colors.text }]}>
            {formatBodyWeight(latest.weightKg, unit)}
            <Text style={[styles.figureUnit, { color: colors.textSecondary }]}>
              {' '}
              {weightUnitLabel(unit)}
            </Text>
          </Text>
          {rangeDelta !== null && (
            <BodyWeightDelta
              deltaKg={rangeDelta}
              goal={goal}
              label={t(`bodyWeight.range.${range}`)}
            />
          )}
        </View>
      ) : (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>{t('bodyWeight.emptyStatsHint')}</Text>
      )}

      {latest &&
        (points.length > 0 ? (
          <>
            <LineTrendChart
              data={points}
              reference={goal ? kgToDisplay(goal.targetKg, unit) : null}
              startLabel={formatDay(points[0].day)}
              endLabel={points.length > 1 ? formatDay(points[points.length - 1].day) : undefined}
              height={170}
              formatValue={(value) => `${value.toFixed(1)} ${weightUnitLabel(unit)}`}
              formatDay={(day) => dayjs(day).locale(i18n.language).format('MMM D, YYYY')}
            />
            <View style={styles.legend}>
              <LegendItem
                swatch={<View style={[styles.dot, { backgroundColor: withAlpha(colors.textSecondary, 0.55) }]} />}
                label={t('bodyWeight.legend.weighIns')}
              />
              <LegendItem
                swatch={<View style={[styles.bar, { backgroundColor: colors.primary }]} />}
                label={t('bodyWeight.legend.average', { days: MOVING_AVERAGE_DAYS })}
              />
              {goal && (
                <LegendItem
                  swatch={<View style={[styles.dash, { borderColor: colors.success }]} />}
                  label={t('bodyWeight.legend.goal')}
                />
              )}
            </View>
          </>
        ) : (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            {t('bodyWeight.noDataInRange')}
          </Text>
        ))}

      <BodyComparisonLine entries={entries} />
    </View>
  );
}

function LegendItem({ swatch, label }: { swatch: ReactNode; label: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.legendItem}>
      {swatch}
      <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  figure: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    fontVariant: ['tabular-nums'],
  },
  figureUnit: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  empty: {
    fontSize: 14,
    lineHeight: 20,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  bar: {
    width: 14,
    height: 3,
    borderRadius: 2,
  },
  dash: {
    width: 14,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
  },
});
