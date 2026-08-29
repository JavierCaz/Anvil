import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ExerciseThumbnail } from '@/components/ExerciseThumbnail';
import { useAppTheme } from '@/theme/app-theme-provider';

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
}: ExerciseSetEditorProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  // Routine mode: the first set starts expanded so editing begins immediately.
  // Workout mode: the first incomplete set starts expanded for logging.
  const [expanded, setExpanded] = useState<number | null>(() => {
    if (mode === 'routine') {
      return sets[0]?.setNumber ?? null;
    }
    return sets.find((set) => !set.done)?.setNumber ?? null;
  });

  return (
    <View style={styles.container}>
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

      {sets.map((item) => {
        const isExpanded = expanded === item.setNumber;
        return (
          <SetCard
            key={item.setNumber}
            mode={mode}
            item={item}
            fallbackReps={fallbackReps}
            expanded={isExpanded}
            onToggle={() => setExpanded(isExpanded ? null : item.setNumber)}
            onWeightChange={(value) => onWeightChange(item.setNumber, value)}
            onRepsChange={(value) => onRepsChange(item.setNumber, value)}
            onRestChange={(seconds) => onRestChange(item.setNumber, seconds)}
            onRemove={onRemoveSet ? () => onRemoveSet(item.setNumber) : undefined}
            onApplyToAll={onApplyToAll ? () => onApplyToAll(item.setNumber) : undefined}
            onComplete={onCompleteSet ? () => onCompleteSet(item.setNumber) : undefined}
            onUndo={onUndoSet ? () => onUndoSet(item.setNumber) : undefined}
          />
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
  onRemove?: () => void;
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
  onRemove,
  onApplyToAll,
  onComplete,
  onUndo,
}: SetCardProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

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
            ? `${item.weight} kg × ${item.reps || fallbackReps}`
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
        {onRemove && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('routines.setsEditor.removeSet')}
            hitSlop={8}
            onPress={onRemove}
            style={styles.removeSet}
          >
            <Ionicons name="trash-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.removeSetLabel, { color: colors.textSecondary }]}>
              {t('routines.setsEditor.removeSet')}
            </Text>
          </Pressable>
        )}
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
            {`${item.weight ? `${item.weight} kg × ` : ''}${item.reps || fallbackReps} reps · ${item.restSeconds}s ${t('workout.rest')}`}
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
          <View style={styles.inputRow}>
            <View style={[styles.inputField, { borderColor: colors.border }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                {t('workout.weight')}
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
              <Text style={[styles.restValue, { color: colors.text }]}>{item.restSeconds}s</Text>
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

      {onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('routines.setsEditor.removeSet')}
          hitSlop={8}
          onPress={onRemove}
          style={styles.removeSet}
        >
          <Ionicons name="trash-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.removeSetLabel, { color: colors.textSecondary }]}>
            {t('routines.setsEditor.removeSet')}
          </Text>
        </Pressable>
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
  inputRow: {
    flexDirection: 'row',
    gap: 12,
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
  restValue: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 48,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
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
  removeSet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  removeSetLabel: {
    fontSize: 12,
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
