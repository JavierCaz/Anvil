import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ExerciseThumbnail } from '@/components/ExerciseThumbnail';
import { SwipeToDelete } from '@/components/SwipeToDelete';
import { useUnitsStore } from '@/store/units';
import { formatWeightStep, useWeightStepStore } from '@/store/weight-step';
import { useAppTheme } from '@/theme/app-theme-provider';
import { weightUnitLabel } from '@/utils/weight';

/** Parse a numeric input string; empty/invalid input reads as 0. */
function parseNumber(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Format a reps value as a non-negative integer string. */
function formatReps(value: number): string {
  return String(Math.max(0, Math.round(value)));
}
export const REST_STEP_SECONDS = 15;
export const REST_MAX_SECONDS = 300;

export type SetEditorMode = 'workout' | 'routine';

export interface SetEditorItem {
  setNumber: number;
  weight: string;
  reps: string;
  restSeconds: number;
  /** Workout mode only: set already logged as completed. */
  done?: boolean;
}

interface ExerciseSetEditorProps {
  mode: SetEditorMode;
  exerciseName: string;
  slug?: string | null;
  sets: SetEditorItem[];
  /** Reps shown when a set has no value. */
  fallbackReps?: number;
  /** Workout mode progress (completed sets). */
  doneCount?: number;
  /** Workout mode total target sets. */
  totalSets?: number;
  onWeightChange: (setNumber: number, value: string) => void;
  onRepsChange: (setNumber: number, value: string) => void;
  onRestChange: (setNumber: number, seconds: number) => void;
  onAddSet: () => void;
  /** Routine mode: remove this set from the plan. */
  onRemoveSet?: (setNumber: number) => void;
  /** Routine mode: copy this set's targets to all other sets. */
  onApplyToAll?: (setNumber: number) => void;
  /** Workout mode: mark this set as done. */
  onCompleteSet?: (setNumber: number) => void;
  /** Workout mode: reopen this set. */
  onUndoSet?: (setNumber: number) => void;
  /** When provided, the exercise header card is tappable (opens the exercise info card). */
  onHeaderPress?: () => void;
  /** Controlled accordion state (the workout screen drives auto-advance). */
  expanded?: number | null;
  onExpandedChange?: (next: number | null) => void;
}

/**
 * Shared per-set editor used both while logging a workout and when planning
 * the routine. In `routine` mode sets are collapsed accordions with an
 * "apply to all sets" action; in `workout` mode they are expanded for logging.
 * Screens render their own sticky action bar below this list.
 */
export function ExerciseSetEditor({
  mode,
  exerciseName,
  slug,
  sets,
  fallbackReps = 10,
  doneCount = 0,
  totalSets = 0,
  onWeightChange,
  onRepsChange,
  onRestChange,
  onAddSet,
  onRemoveSet,
  onApplyToAll,
  onCompleteSet,
  onUndoSet,
  onHeaderPress,
  expanded: expandedProp,
  onExpandedChange,
}: ExerciseSetEditorProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const isControlled = onExpandedChange !== undefined;
  // Routine mode (uncontrolled): the first set starts expanded so editing
  // begins immediately. Workout mode (uncontrolled): first incomplete set.
  const [internalExpanded, setInternalExpanded] = useState<number | null>(() => {
    if (isControlled) {
      return expandedProp ?? null;
    }
    if (mode === 'routine') {
      return sets[0]?.setNumber ?? null;
    }
    return sets.find((set) => !set.done)?.setNumber ?? null;
  });
  const activeExpanded = isControlled ? (expandedProp ?? null) : internalExpanded;

  const handleToggle = (setNumber: number) => {
    const next = activeExpanded === setNumber ? null : setNumber;
    if (isControlled) {
      onExpandedChange?.(next);
    } else {
      setInternalExpanded(next);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={exerciseName}
        disabled={!onHeaderPress}
        onPress={onHeaderPress}
        style={({ pressed }) => [
          onHeaderPress && pressed && { opacity: 0.7 },
        ]}
      >
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ExerciseThumbnail slug={slug} />
          <View style={styles.infoBody}>
            <Text style={[styles.infoTitle, { color: colors.text }]} numberOfLines={1}>
              {exerciseName}
            </Text>
            <Text style={[styles.infoMeta, { color: colors.textSecondary }]}>
              {mode === 'workout'
                ? t('workout.setsDone', { done: doneCount, total: totalSets || sets.length })
                : t('routines.setsEditor.setCount', { count: sets.length })}
            </Text>
          </View>
        </View>
      </Pressable>

      {sets.map((item) => {
        const isExpanded = activeExpanded === item.setNumber;
        const card = (
          <SetCard
            mode={mode}
            item={item}
            fallbackReps={fallbackReps}
            expanded={isExpanded}
            onToggle={() => handleToggle(item.setNumber)}
            onWeightChange={(value) => onWeightChange(item.setNumber, value)}
            onRepsChange={(value) => onRepsChange(item.setNumber, value)}
            onRestChange={(seconds) => onRestChange(item.setNumber, seconds)}
            onApplyToAll={onApplyToAll ? () => onApplyToAll(item.setNumber) : undefined}
            onComplete={onCompleteSet ? () => onCompleteSet(item.setNumber) : undefined}
            onUndo={onUndoSet ? () => onUndoSet(item.setNumber) : undefined}
          />
        );
        return onRemoveSet ? (
          <SwipeToDelete key={item.setNumber} onDelete={() => onRemoveSet(item.setNumber)}>
            {card}
          </SwipeToDelete>
        ) : (
          <View key={item.setNumber}>{card}</View>
        );
      })}

      <Pressable
        accessibilityRole="button"
        onPress={onAddSet}
        style={({ pressed }) => [
          styles.addSetButton,
          { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Ionicons name="add" size={18} color={colors.textSecondary} />
        <Text style={[styles.addSetLabel, { color: colors.textSecondary }]}>
          {t('workout.addSet')}
        </Text>
      </Pressable>
    </View>
  );
}

interface SetCardProps {
  mode: SetEditorMode;
  item: SetEditorItem;
  fallbackReps: number;
  expanded: boolean;
  onToggle: () => void;
  onWeightChange: (value: string) => void;
  onRepsChange: (value: string) => void;
  onRestChange: (seconds: number) => void;
  onApplyToAll?: () => void;
  onComplete?: () => void;
  onUndo?: () => void;
}

function SetCard({
  mode,
  item,
  fallbackReps,
  expanded,
  onToggle,
  onWeightChange,
  onRepsChange,
  onRestChange,
  onApplyToAll,
  onComplete,
  onUndo,
}: SetCardProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const unit = useUnitsStore((state) => state.unitSystem);
  const weightStep = useWeightStepStore((state) => (unit === 'imperial' ? state.stepLb : state.stepKg));
  const unitLabel = weightUnitLabel(unit);

  const weightValue = parseNumber(item.weight);
  const repsValue = parseNumber(item.reps);
  const weightMinusDisabled = weightValue <= 0;
  const repsMinusDisabled = repsValue <= 0;

  const stepWeight = (delta: number) => {
    onWeightChange(formatWeightStep(Math.max(0, weightValue + delta)));
  };

  const stepReps = (delta: number) => {
    onRepsChange(formatReps(repsValue + delta));
  };

  const onRestInputChange = (value: string) => {
    onRestChange(Math.min(REST_MAX_SECONDS, Math.max(0, Math.round(parseNumber(value)))));
  };

  if (mode === 'workout' && item.done) {
    return (
      <View style={[styles.setCard, { backgroundColor: colors.surface, borderColor: colors.success }]}>
        <View style={styles.setHeader}>
          <Text style={[styles.setTitle, { color: colors.text }]}>
            {t('workout.set', { number: item.setNumber })}
          </Text>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        </View>
        <Text style={[styles.setSummary, { color: colors.text }]}>
          {item.weight
            ? `${item.weight} ${unitLabel} × ${item.reps || fallbackReps}`
            : `${item.reps || fallbackReps} reps`}
          {item.restSeconds > 0 ? ` · ${t('workout.rest')}: ${item.restSeconds}s` : ''}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onUndo}
          style={({ pressed }) => [styles.undoButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.undoLabel, { color: colors.textSecondary }]}>{t('workout.undo')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.setCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable accessibilityRole="button" onPress={onToggle} style={styles.setHeader}>
        <Text style={[styles.setTitle, { color: colors.text }]}>
          {t('workout.set', { number: item.setNumber })}
        </Text>
        {!expanded && (
          <Text style={[styles.collapsedSummary, { color: colors.textSecondary }]} numberOfLines={1}>
            {`${item.weight ? `${item.weight} ${unitLabel} × ` : ''}${item.reps || fallbackReps} reps · ${item.restSeconds}s ${t('workout.rest')}`}
          </Text>
        )}
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.textSecondary}
        />
      </Pressable>

      {expanded && (
        <>
          <View style={styles.inputColumn}>
            <View style={styles.stepperField}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('workout.decreaseWeight')}
                hitSlop={8}
                disabled={weightMinusDisabled}
                onPress={() => stepWeight(-weightStep)}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={26}
                  color={weightMinusDisabled ? colors.border : colors.primary}
                />
              </Pressable>
              <View style={[styles.inputField, { borderColor: colors.border }]}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  {t('workout.weight', { unit: weightUnitLabel(unit) })}
                </Text>
                <TextInput
                  value={item.weight}
                  onChangeText={onWeightChange}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  style={[styles.inputValue, { color: colors.text }]}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('workout.increaseWeight')}
                hitSlop={8}
                onPress={() => stepWeight(weightStep)}
              >
                <Ionicons name="add-circle-outline" size={26} color={colors.primary} />
              </Pressable>
            </View>
            <View style={styles.stepperField}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('workout.decreaseReps')}
                hitSlop={8}
                disabled={repsMinusDisabled}
                onPress={() => stepReps(-1)}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={26}
                  color={repsMinusDisabled ? colors.border : colors.primary}
                />
              </Pressable>
              <View style={[styles.inputField, { borderColor: colors.border }]}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  {t('workout.reps')}
                </Text>
                <TextInput
                  value={item.reps}
                  onChangeText={onRepsChange}
                  placeholder={String(fallbackReps)}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  style={[styles.inputValue, { color: colors.text }]}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('workout.increaseReps')}
                hitSlop={8}
                onPress={() => stepReps(1)}
              >
                <Ionicons name="add-circle-outline" size={26} color={colors.primary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.restRow}>
            <Text style={[styles.restLabel, { color: colors.textSecondary }]}>
              {t('workout.restAfterSet')}
            </Text>
            <View style={styles.restStepper}>
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                disabled={item.restSeconds <= 0}
                onPress={() => onRestChange(item.restSeconds - REST_STEP_SECONDS)}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={26}
                  color={item.restSeconds <= 0 ? colors.border : colors.primary}
                />
              </Pressable>
              <View style={[styles.restInputField, { borderColor: colors.border }]}>
                <TextInput
                  value={String(item.restSeconds)}
                  onChangeText={onRestInputChange}
                  accessibilityLabel={t('workout.restAfterSet')}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  style={[styles.restInputValue, { color: colors.text }]}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                disabled={item.restSeconds >= REST_MAX_SECONDS}
                onPress={() => onRestChange(item.restSeconds + REST_STEP_SECONDS)}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={26}
                  color={item.restSeconds >= REST_MAX_SECONDS ? colors.border : colors.primary}
                />
              </Pressable>
            </View>
          </View>

          {mode === 'routine' && onApplyToAll && (
            <Pressable
              accessibilityRole="button"
              onPress={onApplyToAll}
              style={({ pressed }) => [
                styles.applyButton,
                { borderColor: colors.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="copy-outline" size={16} color={colors.primary} />
              <Text style={[styles.applyLabel, { color: colors.primary }]}>
                {t('routines.setsEditor.applyToAll')}
              </Text>
            </Pressable>
          )}

          {mode === 'workout' && onComplete && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('workout.markDone')}
              onPress={onComplete}
              style={({ pressed }) => [
                styles.doneButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              <Text style={styles.doneLabel}>{t('workout.markDone')}</Text>
            </Pressable>
          )}
        </>
      )}

      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  infoBody: {
    flex: 1,
    gap: 2,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  infoMeta: {
    fontSize: 13,
  },
  setCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  setHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  setTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  collapsedSummary: {
    flex: 1,
    fontSize: 13,
    textAlign: 'right',
  },
  setSummary: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputColumn: {
    flexDirection: 'column',
    gap: 12,
  },
  stepperField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputField: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  inputValue: {
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 2,
  },
  restRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restLabel: {
    fontSize: 13,
  },
  restStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  restInputField: {
    width: 56,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  restInputValue: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    paddingVertical: 0,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
  },
  applyLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    paddingVertical: 12,
  },
  doneLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  undoButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  undoLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
  },
  addSetLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
