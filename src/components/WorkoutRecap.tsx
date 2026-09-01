import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAchievementByKey } from '@/constants/achievements';
import type { DetectedPR, WorkoutRecap as RecapData } from '@/db/gamification';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
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

  const renderPR = (pr: DetectedPR) => {
    const label = pr.type === 'weight' ? t('recap.newWeightPr') : t('recap.newOneRmPr');
    return (
      <View key={`${pr.exerciseId}-${pr.type}`} style={styles.prRow}>
        <Ionicons name="trophy" size={16} color={colors.primary} />
        <View style={styles.prBody}>
          <Text style={[styles.prName, { color: colors.text }]} numberOfLines={1}>
            {pr.exerciseName}
          </Text>
          <Text style={[styles.prDetail, { color: colors.textSecondary }]}>
            {formatWeightWithUnit(pr.weight, unit)} × {pr.reps}
          </Text>
        </View>
        <View style={[styles.prBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.prBadgeLabel}>{label}</Text>
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
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.headerIcon, { backgroundColor: colors.background }]}>
                <Ionicons name="hammer" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>{t('recap.title')}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                {recap.routineName ? `${recap.routineName} · ${formatDuration(summary.durationSeconds)}` : formatDuration(summary.durationSeconds)}
              </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={[styles.statCell, { backgroundColor: colors.background }]}>
                <Text style={[styles.statValue, { color: colors.text }]}>{summary.setsCompleted}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('recap.sets', { count: summary.setsCompleted })}</Text>
              </View>
              <View style={[styles.statCell, { backgroundColor: colors.background }]}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatWeight(summary.totalVolumeKg, unit)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {t('recap.volume', { unit: weightUnitLabel(unit) })}
                </Text>
              </View>
              {recap.volumeDeltaPct !== null && (
                <View style={[styles.statCell, { backgroundColor: colors.background }]}>
                  <Text style={[styles.statValue, { color: recap.volumeDeltaPct >= 0 ? colors.success : colors.textSecondary }]}>
                    {recap.volumeDeltaPct >= 0 ? '+' : ''}
                    {recap.volumeDeltaPct}%
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('recap.volumeDelta')}</Text>
                </View>
              )}
            </View>

            {/* PRs */}
            {prs.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  {t('recap.recordsForged', { count: prs.length })}
                </Text>
                {prs.map(renderPR)}
              </View>
            )}

            {/* Milestones */}
            {showMilestones && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  {t('recap.milestoneUnlocked')}
                </Text>
                {milestonesUnlocked.map((milestone) => (
                  <View key={`${milestone.key}-${milestone.exerciseName}`} style={styles.milestoneRow}>
                    <Text style={styles.milestoneIcon}>{milestone.icon}</Text>
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
                    <Text style={[styles.nextValue, { color: colors.text }]} numberOfLines={1}>
                      {nextMilestone.icon} {t(nextMilestone.nameKey)} — {formatWeightWithUnit(nextMilestone.thresholdKg, unit)}
                    </Text>
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
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  {t('recap.consistency')}
                </Text>
                <View style={styles.consistencyRow}>
                  <Ionicons name="calendar" size={18} color={colors.accent} />
                  <Text style={[styles.consistencyText, { color: colors.text }]}>
                    {t('recap.workoutsThisWeek', { done: consistency.weeklyDays, goal: consistency.weeklyGoal })}
                  </Text>
                  {consistency.hitThisWeek && (
                    <View style={[styles.perfectBadge, { backgroundColor: colors.success }]}>
                      <Text style={styles.perfectLabel}>{t('recap.perfectWeek')}</Text>
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
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  {t('recap.achievementsUnlocked')}
                </Text>
                {globalUnlocked.map(({ key }) => {
                  const definition = getAchievementByKey(key);
                  return definition ? (
                    <View key={key} style={styles.specialRow}>
                      <Text style={styles.specialIcon}>{definition.icon}</Text>
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
                      <Text style={styles.specialIcon}>{definition.icon}</Text>
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
              styles.closeButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.closeLabel}>{t('common.confirm')}</Text>
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
    maxWidth: 380,
    maxHeight: '85%',
    borderRadius: 20,
    borderWidth: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
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
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
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
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
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
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  prBadgeLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  milestoneIcon: {
    fontSize: 22,
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
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    marginTop: 2,
    gap: 2,
  },
  nextLabel: {
    fontSize: 12,
  },
  nextValue: {
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
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  perfectLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  consistencyStreak: {
    fontSize: 13,
  },
  specialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  specialIcon: {
    fontSize: 20,
  },
  specialBody: {
    flex: 1,
    gap: 1,
  },
  specialName: {
    fontSize: 15,
    fontWeight: '600',
  },
  specialExercise: {
    fontSize: 12,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 18,
  },
  closeLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
