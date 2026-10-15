import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDialog } from '@/components/AppDialog';
import { StepIcon } from '@/components/StepIcon';
import { useBodyWeightActions } from '@/hooks/use-body-weight-actions';
import { useBodyWeightGoalStore } from '@/store/body-weight-goal';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import { hairline, radius } from '@/theme/tokens';
import {
  BODY_WEIGHT_MAX_KG,
  BODY_WEIGHT_MIN_KG,
  formatBodyWeight,
  formatBodyWeightWithUnit,
  goalDirection,
  isValidBodyWeightKg,
  parseWeightInput,
  type BodyWeightEntry,
} from '@/utils/body-weight';
import { displayToKg, kgToDisplay, weightUnitLabel } from '@/utils/weight';

/** Stepper increments in the display unit. */
const GOAL_STEP = { metric: 0.5, imperial: 1 } as const;
/** A target this close to the start weight isn't a goal (kg). */
const MIN_GOAL_DISTANCE_KG = 0.1;

interface BodyWeightGoalEditorProps {
  /** Latest weigh-in — a new goal starts from it. */
  latest: BodyWeightEntry;
}

/**
 * Inline bodyweight goal editor (shown in the Home card): a typed target with
 * −/+ steppers in the display unit, plus clear.
 */
export function BodyWeightGoalEditor({ latest }: BodyWeightGoalEditorProps) {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const dialog = useDialog();
  const unit = useUnitsStore((state) => state.unitSystem);
  const goal = useBodyWeightGoalStore((state) => state.goal);
  const { setGoalTarget, clearGoal } = useBodyWeightActions();

  // Uncommitted edit; null shows the stored target (in the current unit).
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? (goal ? formatBodyWeight(goal.targetKg, unit) : '');

  const unitLabel = weightUnitLabel(unit);
  const step = GOAL_STEP[unit];

  const apply = (targetKg: number) => {
    const startKg = goal?.startKg ?? latest.weightKg;
    if (!isValidBodyWeightKg(targetKg)) {
      dialog.alert({
        title: t('bodyWeight.invalidTitle'),
        message: t('bodyWeight.invalidMessage', {
          min: formatBodyWeight(BODY_WEIGHT_MIN_KG, unit),
          max: formatBodyWeight(BODY_WEIGHT_MAX_KG, unit),
          unit: unitLabel,
        }),
        icon: 'alert-circle',
        tone: 'error',
      });
      return;
    }
    if (Math.abs(targetKg - startKg) < MIN_GOAL_DISTANCE_KG) {
      dialog.alert({
        title: t('bodyWeight.goalEditor.title'),
        message: t('bodyWeight.goalEditor.sameAsStart'),
        icon: 'information-circle',
      });
      return;
    }
    void setGoalTarget(targetKg, latest);
  };

  const commitText = () => {
    if (draft === null) return;
    const value = parseWeightInput(draft);
    setDraft(null);
    if (value === null) return;
    if (goal && formatBodyWeight(goal.targetKg, unit) === value.toFixed(1)) return;
    apply(displayToKg(value, unit));
  };

  const stepBy = (delta: number) => {
    const baseKg = goal?.targetKg ?? latest.weightKg;
    // Step on the display grid (0.5 kg / 1 lb) so values stay round.
    const display = Math.round((kgToDisplay(baseKg, unit) + delta) / step) * step;
    apply(displayToKg(display, unit));
  };

  const confirmClear = () =>
    dialog.alert({
      title: t('bodyWeight.goalEditor.clearTitle'),
      message: t('bodyWeight.goalEditor.clearMessage'),
      icon: 'flag-outline',
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('bodyWeight.goalEditor.clear'),
          style: 'destructive',
          onPress: () => void clearGoal(),
        },
      ],
    });

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        {t('bodyWeight.goalEditor.hint')}
      </Text>

      <View style={styles.stepper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('bodyWeight.goalEditor.decrease')}
          hitSlop={8}
          onPress={() => stepBy(-step)}
        >
          <StepIcon kind="minus" />
        </Pressable>
        <View style={styles.valueBlock}>
          <TextInput
            value={text}
            onChangeText={setDraft}
            onEndEditing={commitText}
            placeholder={formatBodyWeight(latest.weightKg, unit)}
            placeholderTextColor={colors.textSecondary}
            keyboardType="decimal-pad"
            returnKeyType="done"
            accessibilityLabel={t('bodyWeight.goalEditor.title')}
            style={[styles.value, { color: colors.text }]}
          />
          <Text style={[styles.unit, { color: colors.textSecondary }]}>{unitLabel}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('bodyWeight.goalEditor.increase')}
          hitSlop={8}
          onPress={() => stepBy(step)}
        >
          <StepIcon kind="plus" />
        </Pressable>
      </View>

      {goal && (
        <View style={styles.footer}>
          <Text style={[styles.summary, { color: colors.textSecondary }]}>
            {t(
              goalDirection(goal) === 'lose'
                ? 'bodyWeight.goalEditor.summaryLose'
                : 'bodyWeight.goalEditor.summaryGain',
              {
                weight: formatBodyWeightWithUnit(Math.abs(goal.targetKg - goal.startKg), unit),
                start: formatBodyWeightWithUnit(goal.startKg, unit),
                date: dayjs(goal.startDay).locale(i18n.language).format('MMM D, YYYY'),
              }
            )}
          </Text>
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={confirmClear}
            style={({ pressed }) => [styles.clear, { borderColor: colors.border, opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={[styles.clearLabel, { color: colors.error }]}>
              {t('bodyWeight.goalEditor.clear')}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: hairline,
    paddingTop: 14,
    gap: 14,
  },
  hint: {
    fontSize: 13,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  valueBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    minWidth: 72,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    paddingVertical: 0,
  },
  unit: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    gap: 10,
    alignItems: 'center',
  },
  summary: {
    fontSize: 13,
    textAlign: 'center',
  },
  clear: {
    borderWidth: hairline,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  clearLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
});
