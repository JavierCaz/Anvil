import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AchievementBadge } from '@/components/AchievementBadge';
import { AnvilMark } from '@/components/AnvilLogo';
import { HeroGlow } from '@/components/HeroGlow';
import { getAchievementByKey } from '@/constants/achievements';
import type { DetectedPR, WorkoutRecap as RecapData } from '@/db/gamification';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import { withAlpha } from '@/theme/colors';
import { hairline, radius, shape, typography } from '@/theme/tokens';
import { distanceUnitLabel, formatDistance, formatDistanceWithUnit, formatPace } from '@/utils/distance';
import { formatDuration as formatSetDuration } from '@/utils/duration';
import { formatWeight, formatWeightWithUnit, weightUnitLabel } from '@/utils/weight';

interface WorkoutRecapModalProps {
  recap: RecapData;
  /** Dismisses the recap (and the finished workout screen). */
  onClose: () => void;
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return [hours, minutes].map((value) => String(value).padStart(2, '0')).join(':');
}
/**
 * Post-workout gamification recap — the main emotional payoff. Shown as a
 * modal when a workout completes; only relevant sections are rendered.
 */
export function WorkoutRecapModal({ recap, onClose }: WorkoutRecapModalProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const unit = useUnitsStore((state) => state.unitSystem);

  const { summary, consistency, prs, milestonesUnlocked, nextMilestone, achievementsUnlocked } = recap;
  const showMilestones = milestonesUnlocked.length > 0 || nextMilestone !== null;
  const showConsistency = consistency.weeklyGoal > 0;
  // Global unlocks are keys without exercise context; per-exercise ones carry it.
  const globalUnlocked = achievementsUnlocked.filter((entry) => entry.exerciseId === undefined);
  const exerciseUnlocked = achievementsUnlocked.filter((entry) => entry.exerciseId !== undefined);

  const hasCardio = summary.totalDistanceM > 0 || summary.timedSeconds > 0;
  // A pure cardio session has no lifting volume — hide that tile.
  const showVolume = summary.totalVolumeKg > 0 || !hasCardio;

  const prLabel = (pr: DetectedPR) => {
    switch (pr.type) {
      case 'weight':
        return t('recap.newWeightPr');
      case 'oneRM':
        return t('recap.newOneRmPr');
      case 'distance':
        return t('recap.newDistancePr');
      case 'duration':
        return t('recap.newDurationPr');
      case 'pace':
        return t('recap.newPacePr');
    }
  };

  const prDetail = (pr: DetectedPR) => {
    if (pr.type === 'weight' || pr.type === 'oneRM') {
      // Loaded carries/holds log 0 reps — show just the load.
      return pr.reps > 0
        ? `${formatWeightWithUnit(pr.weight, unit)} × ${pr.reps}`
        : formatWeightWithUnit(pr.weight, unit);
    }
    const parts: string[] = [];
    if (pr.distanceM) {
      // Sub-kilometre efforts (carries, laps) read better in m / yd.
      parts.push(formatDistanceWithUnit(pr.distanceM, unit, pr.distanceM < 1000 ? 'short' : 'long'));
    }
    if (pr.durationSeconds) {
      parts.push(formatSetDuration(pr.durationSeconds));
    }
    if (pr.type === 'pace' && pr.durationSeconds && pr.distanceM) {
      const pace = formatPace(pr.durationSeconds, pr.distanceM, unit);
      if (pace) {
        parts.push(pace);
      }
    }
    return parts.join(' · ');
  };

  const renderPR = (pr: DetectedPR) => {
    const label = prLabel(pr);
    return (
      <View key={`${pr.exerciseId}-${pr.type}`} style={styles.prRow}>
        <View style={[styles.prIcon, { backgroundColor: withAlpha(colors.gold, 0.16) }]}>
          <Ionicons name="trophy" size={16} color={colors.gold} />
        </View>
        <View style={styles.prBody}>
          <Text style={[styles.prName, { color: colors.text }]} numberOfLines={1}>
            {pr.exerciseName}
          </Text>
          <Text style={[styles.prDetail, { color: colors.textSecondary }]}>
            {prDetail(pr)}
          </Text>
        </View>
        <View style={[styles.prBadge, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.prBadgeLabel, { color: colors.primary }]}>{label}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          <HeroGlow color={colors.primary} intensity={0.18} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <AnvilMark width={84} style={styles.headerMark} />
              <Text style={[styles.title, { color: colors.text }]}>{t('recap.title')}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                {recap.routineName ? `${recap.routineName} · ${formatDuration(summary.durationSeconds)}` : formatDuration(summary.durationSeconds)}
              </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={[styles.statCell, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.statValue, { color: colors.text }]}>{summary.setsCompleted}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('recap.sets', { count: summary.setsCompleted })}</Text>
              </View>
              {showVolume && (
                <View style={[styles.statCell, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {formatWeight(summary.totalVolumeKg, unit)}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    {t('recap.volume', { unit: weightUnitLabel(unit) })}
                  </Text>
                </View>
              )}
              {showVolume && recap.volumeDeltaPct !== null && (
                <View style={[styles.statCell, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.statValue, { color: recap.volumeDeltaPct >= 0 ? colors.success : colors.textSecondary }]}>
                    {recap.volumeDeltaPct >= 0 ? '+' : ''}
                    {recap.volumeDeltaPct}%
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('recap.volumeDelta')}</Text>
                </View>
              )}
            </View>

            {/* Cardio */}
            {hasCardio && (
              <View style={styles.statsRow}>
                {summary.totalDistanceM > 0 && (
                  <View style={[styles.statCell, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                      {formatDistance(summary.totalDistanceM, unit)}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      {t('recap.distance', { unit: distanceUnitLabel(unit) })}
                    </Text>
                  </View>
                )}
                {summary.timedSeconds > 0 && (
                  <View style={[styles.statCell, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                      {formatSetDuration(summary.timedSeconds)}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      {t('recap.timedTime')}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* PRs */}
            {prs.length > 0 && (
              <View style={styles.section}>
                <Text style={[typography.overline, styles.sectionTitle, { color: colors.primary }]}>
                  {t('recap.recordsForged', { count: prs.length })}
                </Text>
                {prs.map(renderPR)}
              </View>
            )}

            {/* Milestones */}
            {showMilestones && (
              <View style={styles.section}>
                <Text style={[typography.overline, styles.sectionTitle, { color: colors.primary }]}>
                  {t('recap.milestoneUnlocked')}
                </Text>
                {milestonesUnlocked.map((milestone) => (
                  <View key={`${milestone.key}-${milestone.exerciseName}`} style={styles.milestoneRow}>
                    <AchievementBadge achievementKey={milestone.key} size={36} />
                    <View style={styles.milestoneBody}>
                      <Text style={[styles.milestoneName, { color: colors.text }]} numberOfLines={1}>
                        {t(milestone.nameKey)}
                      </Text>
                      {milestone.exerciseName ? (
                        <Text style={[styles.milestoneExercise, { color: colors.textSecondary }]} numberOfLines={1}>
                          {milestone.exerciseName}
                        </Text>
                      ) : null}
                    </View>
                    <Text style={[styles.milestoneKg, { color: colors.textSecondary }]}>
                      {formatWeightWithUnit(milestone.thresholdKg, unit)}
                    </Text>
                  </View>
                ))}
                {nextMilestone && (
                  <View style={[styles.nextMilestone, { borderColor: colors.border }]}>
                    <Text style={[styles.nextLabel, { color: colors.textSecondary }]}>
                      {t('recap.nextMilestone')}
                    </Text>
                    <View style={styles.nextValueRow}>
                      <AchievementBadge achievementKey={nextMilestone.key} size={24} locked />
                      <Text style={[styles.nextValue, { color: colors.text }]} numberOfLines={1}>
                        {t(nextMilestone.nameKey)} — {formatWeightWithUnit(nextMilestone.thresholdKg, unit)}
                      </Text>
                    </View>
                    <Text style={[styles.nextToGo, { color: colors.textSecondary }]}>
                      {t('recap.nextMilestoneToGo', {
                        weight: formatWeight(Math.max(0, nextMilestone.thresholdKg - recap.maxWeightKg), unit),
                        unit: weightUnitLabel(unit),
                      })}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Consistency */}
            {showConsistency && (
              <View style={styles.section}>
                <Text style={[typography.overline, styles.sectionTitle, { color: colors.primary }]}>
                  {t('recap.consistency')}
                </Text>
                <View style={styles.consistencyRow}>
                  <Ionicons name="calendar" size={18} color={colors.accent} />
                  <Text style={[styles.consistencyText, { color: colors.text }]}>
                    {t('recap.workoutsThisWeek', { done: consistency.weeklyDays, goal: consistency.weeklyGoal })}
                  </Text>
                  {consistency.hitThisWeek && (
                    <View style={[styles.perfectBadge, { backgroundColor: withAlpha(colors.success, 0.16) }]}>
                      <Text style={[styles.perfectLabel, { color: colors.success }]}>{t('recap.perfectWeek')}</Text>
                    </View>
                  )}
                </View>
                {consistency.consistencyStreakWeeks > 0 && (
                  <Text style={[styles.consistencyStreak, { color: colors.textSecondary }]}>
                    {t('recap.weekStreak', { count: consistency.consistencyStreakWeeks })}
                  </Text>
                )}
              </View>
            )}

            {/* Newly unlocked achievements (global + per-exercise) */}
            {(globalUnlocked.length > 0 || exerciseUnlocked.length > 0) && (
              <View style={styles.section}>
                <Text style={[typography.overline, styles.sectionTitle, { color: colors.primary }]}>
                  {t('recap.achievementsUnlocked')}
                </Text>
                {globalUnlocked.map(({ key }) => {
                  const definition = getAchievementByKey(key);
                  return definition ? (
                    <View key={key} style={styles.specialRow}>
                      <AchievementBadge achievementKey={definition.key} size={36} />
                      <Text style={[styles.specialName, { color: colors.text }]} numberOfLines={1}>
                        {t(definition.nameKey)}
                      </Text>
                    </View>
                  ) : null;
                })}
                {exerciseUnlocked.map(({ key, exerciseName }) => {
                  const definition = getAchievementByKey(key);
                  return definition ? (
                    <View key={`${key}-${exerciseName}`} style={styles.specialRow}>
                      <AchievementBadge achievementKey={definition.key} size={36} />
                      <View style={styles.specialBody}>
                        <Text style={[styles.specialName, { color: colors.text }]} numberOfLines={1}>
                          {t(definition.nameKey)}
                        </Text>
                        <Text style={[styles.specialExercise, { color: colors.textSecondary }]} numberOfLines={1}>
                          {exerciseName}
                        </Text>
                      </View>
                    </View>
                  ) : null;
                })}
              </View>
            )}
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [
              shape.primaryButton,
              styles.closeButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[typography.button, { color: colors.onPrimary }]}>{t('common.confirm')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 390,
    maxHeight: '86%',
    borderRadius: radius.xl + 4,
    borderWidth: hairline,
    paddingTop: 26,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  headerMark: {
    marginBottom: 6,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  statCell: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: hairline,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  section: {
    marginTop: 16,
    gap: 8,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prBody: {
    flex: 1,
    gap: 1,
  },
  prName: {
    fontSize: 15,
    fontWeight: '700',
  },
  prDetail: {
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  prBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  prBadgeLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  milestoneBody: {
    flex: 1,
    gap: 1,
  },
  milestoneName: {
    fontSize: 15,
    fontWeight: '700',
  },
  milestoneExercise: {
    fontSize: 12,
  },
  milestoneKg: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  nextMilestone: {
    borderTopWidth: hairline,
    paddingTop: 12,
    marginTop: 4,
    gap: 4,
  },
  nextLabel: {
    ...typography.overline,
  },
  nextValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextValue: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  nextToGo: {
    fontSize: 12,
  },
  consistencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  consistencyText: {
    fontSize: 15,
    fontWeight: '600',
  },
  perfectBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  perfectLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  consistencyStreak: {
    fontSize: 13,
  },
  specialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  specialBody: {
    flex: 1,
    gap: 1,
  },
  specialName: {
    fontSize: 15,
    fontWeight: '700',
  },
  specialExercise: {
    fontSize: 12,
  },
  closeButton: {
    marginTop: 18,
  },
  prIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
