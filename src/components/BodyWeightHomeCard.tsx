import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BodyComparisonLine } from '@/components/BodyComparisonLine';
import { BodyWeightDelta } from '@/components/BodyWeightDelta';
import { BodyWeightGoalEditor } from '@/components/BodyWeightGoalEditor';
import { BodyWeightLogField } from '@/components/BodyWeightLogField';
import { GoalToggleButton } from '@/components/GoalToggleButton';
import { ProgressBar } from '@/components/ProgressBar';
import { useBodyWeightGoalStore } from '@/store/body-weight-goal';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import { radius } from '@/theme/tokens';
import {
  formatBodyWeight,
  formatBodyWeightWithUnit,
  goalProgress,
  isGoalReached,
  recentChange,
  remainingToGoalKg,
  type BodyWeightEntry,
} from '@/utils/body-weight';
import { weightUnitLabel } from '@/utils/weight';

interface BodyWeightHomeCardProps {
  entries: readonly BodyWeightEntry[];
  onSaved: () => void;
}

/**
 * Home quick action for bodyweight: current weight, recent change, the goal
 * progress bar (when a goal is set), the fun comparison, and an inline
 * field to log today's weight. The trend chart lives on the Statistics tab.
 */
export function BodyWeightHomeCard({ entries, onSaved }: BodyWeightHomeCardProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const unit = useUnitsStore((state) => state.unitSystem);
  const goal = useBodyWeightGoalStore((state) => state.goal);
  const [editingGoal, setEditingGoal] = useState(false);

  const latest = entries[entries.length - 1] ?? null;
  const change = recentChange(entries, 7);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.overline, { color: colors.primary }]}>{t('bodyWeight.title')}</Text>
        {latest && (
          <View style={styles.headerActions}>
            <GoalToggleButton
              editing={editingGoal}
              hasGoal={goal !== null}
              onPress={() => setEditingGoal((editing) => !editing)}
            />
            <Pressable
              accessibilityRole="link"
              hitSlop={8}
              onPress={() => router.navigate('/statistics')}
              style={({ pressed }) => [styles.link, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.linkLabel, { color: colors.primary }]}>
                {t('bodyWeight.seeTrend')}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </Pressable>
          </View>
        )}
      </View>

      {latest ? (
        <View style={styles.figureRow}>
          <Text style={[styles.figure, { color: colors.text }]}>
            {formatBodyWeight(latest.weightKg, unit)}
            <Text style={[styles.figureUnit, { color: colors.textSecondary }]}>
              {' '}
              {weightUnitLabel(unit)}
            </Text>
          </Text>
          {change && (
            <BodyWeightDelta
              deltaKg={change.deltaKg}
              goal={goal}
              label={t('bodyWeight.since', {
                date: dayjs(change.sinceDay).locale(i18n.language).format('MMM D'),
              })}
            />
          )}
        </View>
      ) : (
        <Text style={[styles.hint, { color: colors.textSecondary }]}>{t('bodyWeight.emptyHint')}</Text>
      )}

      {latest && goal && (
        <View style={styles.goalBlock}>
          <View style={styles.goalRow}>
            <ProgressBar progress={goalProgress(goal, latest.weightKg)} height={8} />
            <Text style={[styles.goalPercent, { color: colors.text }]}>
              {Math.round(goalProgress(goal, latest.weightKg) * 100)}%
            </Text>
          </View>
          <View style={styles.goalLabels}>
            <Text style={[styles.goalCaption, { color: colors.textSecondary }]}>
              {formatBodyWeightWithUnit(goal.startKg, unit)}
            </Text>
            <Text style={[styles.goalStatus, { color: colors.text }]}>
              {isGoalReached(goal, latest.weightKg)
                ? t('bodyWeight.goalReached')
                : t('bodyWeight.toGo', {
                    weight: formatBodyWeightWithUnit(remainingToGoalKg(goal, latest.weightKg), unit),
                  })}
            </Text>
            <Text style={[styles.goalCaption, { color: colors.textSecondary }]}>
              {formatBodyWeightWithUnit(goal.targetKg, unit)}
            </Text>
          </View>
        </View>
      )}

      {latest && editingGoal && <BodyWeightGoalEditor latest={latest} />}

      <BodyComparisonLine entries={entries} />

      <BodyWeightLogField entries={entries} onSaved={onSaved} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overline: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  figureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  figure: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
    fontVariant: ['tabular-nums'],
  },
  figureUnit: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
  },
  goalBlock: {
    gap: 6,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  goalPercent: {
    width: 42,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  goalLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 52,
  },
  goalCaption: {
    fontSize: 11,
    fontWeight: '600',
  },
  goalStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
});
