import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
 * an achievement card. Mirrors the AppDialog presentation (themed, subtle
 * scale+fade entrance, tap-outside / back / button to dismiss).
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
  const insets = useSafeAreaInsets();
  const unit = useUnitsStore((state) => state.unitSystem);

  // Stable Animated values (lazy state, not refs — satisfies the React Compiler ref rule).
  const [scale] = useState(() => new Animated.Value(0.92));
  const [fade] = useState(() => new Animated.Value(0));

  useEffect(() => {
    scale.setValue(0.92);
    fade.setValue(0);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 280 }),
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [scale, fade]);

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
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.cancel')}
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: fade,
              transform: [{ scale }],
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
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

          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.closeLabel}>{t('common.ok')}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    alignItems: 'center',
  },
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
  closeButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 14,
  },
  closeLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
