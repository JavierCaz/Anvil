import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { DetailModal } from '@/components/DetailModal';
import {
  ACHIEVEMENT_TIER_COLORS,
  type AchievementDefinition,
  type AchievementMetric,
} from '@/constants/achievements';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import { formatWeightGrouped, kgToDisplay, weightUnitLabel } from '@/utils/weight';

interface AchievementDetailModalProps {
  definition: AchievementDefinition;
  progress: number;
  unlocked: boolean;
  /** ISO timestamp when unlocked, or null while locked. */
  unlockedAt: string | null;
  onClose: () => void;
}

function formatNumber(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** Human-readable unit suffix per aggregate metric. */
function metricUnit(metric: AchievementMetric, t: (key: string) => string, unit: 'metric' | 'imperial'): string {
  switch (metric) {
    case 'maxWeight':
    case 'totalVolume':
      return weightUnitLabel(unit);
    case 'totalWorkouts':
      return t('achievements.metrics.workouts');
    case 'consistencyStreak':
      return t('achievements.metrics.weeks');
    case 'prsThisMonth':
      return t('achievements.metrics.prs');
  }
}

/**
 * Detail card for a single achievement, shown as a modal when the user taps
 * an achievement card. Rendered inside the shared DetailModal shell.
 */
export function AchievementDetailModal({
  definition,
  progress,
  unlocked,
  unlockedAt,
  onClose,
}: AchievementDetailModalProps) {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const unit = useUnitsStore((state) => state.unitSystem);

  const tierColor = definition.tier ? ACHIEVEMENT_TIER_COLORS[definition.tier] : null;
  const hasProgress = definition.metric !== undefined && definition.target !== undefined;

  const progressLine = hasProgress
    ? (() => {
        const metric = definition.metric as AchievementMetric;
        const target = definition.target as number;
        const current = Math.round(progress * target);
        const isWeightMetric = metric === 'maxWeight' || metric === 'totalVolume';
        const currentDisplay = isWeightMetric ? kgToDisplay(current, unit) : current;
        const targetDisplay = isWeightMetric ? kgToDisplay(target, unit) : target;
        return `${formatNumber(currentDisplay)} / ${formatNumber(targetDisplay)} ${metricUnit(metric, t, unit)}`;
      })()
    : null;
  // Volume achievements describe their kg threshold; interpolate in the user's unit.
  const descriptionParams =
    definition.metric === 'totalVolume' && definition.target !== undefined
      ? { weight: formatWeightGrouped(definition.target, unit), unit: weightUnitLabel(unit) }
      : undefined;

  const unlockedDate = unlocked && unlockedAt ? dayjs(unlockedAt).locale(i18n.language).format('MMM D, YYYY') : null;

  return (
    <DetailModal onClose={onClose}>
      {/* Icon */}
      <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>
        <Text style={styles.icon}>{definition.icon}</Text>
      </View>

      {/* Name + badges */}
      <Text style={[styles.name, { color: colors.text }]}>{t(definition.nameKey)}</Text>
      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: colors.background }]}>
          <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>
            {t(`achievements.categories.${definition.category}`)}
          </Text>
        </View>
        {tierColor && (
          <View style={[styles.badge, { backgroundColor: tierColor }]}>
            <Text style={styles.tierLabel}>{t(`achievements.tiers.${definition.tier}`)}</Text>
          </View>
        )}
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {t(definition.descriptionKey, descriptionParams)}
      </Text>

      {/* Progress */}
      {hasProgress && progressLine && (
        <View style={styles.progressBlock}>
          <View style={[styles.track, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.fill,
                { backgroundColor: colors.primary, width: `${Math.round(progress * 100)}%` },
              ]}
            />
          </View>
          <Text style={[styles.progressLine, { color: colors.textSecondary }]}>
            {progressLine}
          </Text>
        </View>
      )}

      {/* Status */}
      <Text
        style={[
          styles.status,
          { color: unlocked ? colors.primary : colors.textSecondary },
        ]}
      >
        {unlocked && unlockedDate
          ? t('achievements.details.unlockedOn', { date: unlockedDate })
          : t('achievements.details.locked')}
      </Text>
    </DetailModal>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 32,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tierLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBlock: {
    alignSelf: 'stretch',
    gap: 6,
    marginBottom: 14,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLine: {
    fontSize: 13,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
  },
});
