import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AchievementBadge } from '@/components/AchievementBadge';
import { ACHIEVEMENT_TIER_COLORS } from '@/constants/achievements';
import type { AchievementDefinition } from '@/constants/achievements';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import { formatWeightGrouped, weightUnitLabel } from '@/utils/weight';

interface AchievementCardProps {
  definition: AchievementDefinition;
  progress: number;
  unlocked: boolean;
  /** When provided, the card becomes tappable (opens the detail modal). */
  onPress?: () => void;
}

/** Achievement card: metal badge, translated name/description, tier tag, progress bar. */
export function AchievementCard({ definition, progress, unlocked, onPress }: AchievementCardProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const unit = useUnitsStore((state) => state.unitSystem);

  const tierColor = definition.tier ? ACHIEVEMENT_TIER_COLORS[definition.tier] : null;
  // Progress bars only make sense for global achievements — exercise-scoped
  // ones are earned per exercise (the detail card lists the earning exercises).
  const showProgress = definition.metric !== undefined && definition.scope !== 'exercise';
  // Volume achievements describe their kg threshold; interpolate in the user's unit.
  const descriptionParams =
    definition.metric === 'totalVolume' && definition.target !== undefined
      ? { weight: formatWeightGrouped(definition.target, unit), unit: weightUnitLabel(unit) }
      : undefined;

  const card = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <AchievementBadge achievementKey={definition.key} size={54} locked={!unlocked} />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.name, { color: unlocked ? colors.text : colors.textSecondary }]}
            numberOfLines={1}
          >
            {t(definition.nameKey)}
          </Text>
          {tierColor && (
            <View style={[styles.tierBadge, { borderColor: tierColor }]}>
              <Text style={[styles.tierLabel, { color: tierColor }]}>
                {t(`achievements.tiers.${definition.tier}`)}
              </Text>
            </View>
          )}
          {unlocked && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
        </View>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {t(definition.descriptionKey, descriptionParams)}
        </Text>

        {showProgress && (
          <View style={styles.progressRow}>
            <View style={[styles.track, { backgroundColor: colors.surfaceElevated }]}>
              <View
                style={[
                  styles.fill,
                  { backgroundColor: colors.primary, width: `${Math.round(progress * 100)}%` },
                ]}
              />
            </View>
            <Text style={[styles.percent, { color: colors.textSecondary }]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (!onPress) {
    return card;
  }
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      {card}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  tierBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  tierLabel: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  description: {
    fontSize: 13,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  percent: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    width: 36,
    textAlign: 'right',
  },
});
