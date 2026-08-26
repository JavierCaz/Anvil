import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import type { AchievementDefinition } from '@/constants/achievements';
import { useAppTheme } from '@/theme/app-theme-provider';

interface AchievementCardProps {
  definition: AchievementDefinition;
  progress: number;
  unlocked: boolean;
}

/** Achievement card: icon, translated name/description, and a progress bar. */
export function AchievementCard({ definition, progress, unlocked }: AchievementCardProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: unlocked ? colors.primary : colors.border,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>
        <Text style={styles.icon}>{definition.icon}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {t(definition.nameKey)}
          </Text>
          {unlocked && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
        </View>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {t(definition.descriptionKey)}
        </Text>

        <View style={styles.progressRow}>
          <View style={[styles.track, { backgroundColor: colors.border }]}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
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
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  percent: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    width: 36,
    textAlign: 'right',
  },
});
