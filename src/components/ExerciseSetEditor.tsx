import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ExerciseThumbnail } from '@/components/ExerciseThumbnail';
import { SwipeToDelete } from '@/components/SwipeToDelete';
import {
  clampIncline,
  distanceScale,
  distanceStep,
  durationStepSeconds,
  getExerciseMetrics,
  INCLINE_STEP,
  inclineByDefault,
  isFreeWeightEquipment,
  supportsIncline,
  type DistanceScale,
  type ExerciseMetrics,
} from '@/constants/exercise-metrics';
import type { UnitSystem } from '@/store/units';
import { useUnitsStore } from '@/store/units';
import { formatWeightStep, useWeightStepStore } from '@/store/weight-step';
import { getSetTimerElapsedSeconds, useWorkoutToolsStore } from '@/store/workout-tools';
import { useAppTheme } from '@/theme/app-theme-provider';
import {
  displayToMeters,
  distanceUnitLabel,
  formatDistanceValue,
  formatPace,
} from '@/utils/distance';
import { clampDuration, formatDuration, joinDuration, splitDuration } from '@/utils/duration';
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
  /** Timed exercises: set duration in seconds. */
  durationSeconds: number;
  /** Distance exercises: distance in the display unit (km / mi), as typed. */
  distance: string;
  /** Treadmill-capable cardio: incline in percent, as typed ('' = flat / not set). */
  incline: string;
  /** Workout mode, timed exercises: planned duration (haptic cue when the set timer reaches it). */
  targetDurationSeconds?: number;
  /** Workout mode only: set already logged as completed. */
  done?: boolean;
}

interface ExerciseSetEditorProps {
  mode: SetEditorMode;
  exerciseName: string;
  slug?: string | null;
  /** Exercise type — decides which fields each set shows (see `getExerciseMetrics`). */
  exerciseType: string | null;
  /**
   * Exercise equipment — free-weight equipment shows the optional load field
   * of timed exercises by default and measures distance in m / yd.
   */
  exerciseEquipment?: string | null;
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
  onDurationChange: (setNumber: number, seconds: number) => void;
  onDistanceChange: (setNumber: number, value: string) => void;
  onInclineChange: (setNumber: number, value: string) => void;
  /**
   * Workout mode: exercise id keying the live set timer (shown for timed
   * exercises). Omit to hide the timer.
   */
  timerExerciseId?: number;
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
  /** Icons of achievements unlocked for this exercise (shown under the header, workout mode). */
  achievementIcons?: string[];
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
  exerciseType,
  exerciseEquipment,
  sets,
  fallbackReps = 10,
  doneCount = 0,
  totalSets = 0,
  onWeightChange,
  onRepsChange,
  onRestChange,
  onDurationChange,
  onDistanceChange,
  onInclineChange,
  timerExerciseId,
  onAddSet,
  onRemoveSet,
  onApplyToAll,
  onCompleteSet,
  onUndoSet,
  onHeaderPress,
  achievementIcons,
  expanded: expandedProp,
  onExpandedChange,
}: ExerciseSetEditorProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const metrics = getExerciseMetrics(exerciseType);
  const scale = distanceScale(exerciseType, slug, exerciseEquipment);
  // Timed exercises carry an optional load: shown for free-weight equipment
  // (farmer carry), when any set already has one, or once the user asks.
  const [loadRequested, setLoadRequested] = useState(false);
  const showLoad =
    metrics.load &&
    (loadRequested ||
      isFreeWeightEquipment(exerciseEquipment) ||
      sets.some((set) => parseNumber(set.weight) > 0));
  // Treadmill incline: same opt-in pattern — shown for incline-focused
  // exercises, when any set has one, or once the user asks.
  const [inclineRequested, setInclineRequested] = useState(false);
  const canIncline = supportsIncline(exerciseType, slug);
  const showIncline =
    canIncline &&
    (inclineRequested ||
      inclineByDefault(slug) ||
      sets.some((set) => parseNumber(set.incline) > 0));
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
            {achievementIcons && achievementIcons.length > 0 && (
              <View style={styles.achievementRow}>
                {achievementIcons.slice(0, 5).map((icon, index) => (
                  <Text key={`${icon}-${index}`} style={styles.achievementIcon}>
                    {icon}
                  </Text>
                ))}
                {achievementIcons.length > 5 && (
                  <Text style={[styles.achievementMore, { color: colors.textSecondary }]}>
                    +{achievementIcons.length - 5}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </Pressable>

      {sets.map((item) => {
        const isExpanded = activeExpanded === item.setNumber;
        const card = (
          <SetCard
            mode={mode}
            item={item}
            metrics={metrics}
            showLoad={showLoad}
            scale={scale}
            onAddLoad={metrics.load && !showLoad ? () => setLoadRequested(true) : undefined}
            showIncline={showIncline}
            onAddIncline={canIncline && !showIncline ? () => setInclineRequested(true) : undefined}
            durationStep={durationStepSeconds(exerciseType)}
            fallbackReps={fallbackReps}
            expanded={isExpanded}
            timerExerciseId={timerExerciseId}
            onToggle={() => handleToggle(item.setNumber)}
            onWeightChange={(value) => onWeightChange(item.setNumber, value)}
            onRepsChange={(value) => onRepsChange(item.setNumber, value)}
            onRestChange={(seconds) => onRestChange(item.setNumber, seconds)}
            onDurationChange={(seconds) => onDurationChange(item.setNumber, seconds)}
            onDistanceChange={(value) => onDistanceChange(item.setNumber, value)}
            onInclineChange={(value) => onInclineChange(item.setNumber, value)}
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
  metrics: ExerciseMetrics;
  /** Timed exercises: the optional load field is visible. */
  showLoad: boolean;
  scale: DistanceScale;
  /** Timed exercises without a visible load: reveal the load field. */
  onAddLoad?: () => void;
  /** Treadmill-capable cardio: the incline field is visible. */
  showIncline: boolean;
  /** Treadmill-capable cardio without a visible incline: reveal it. */
  onAddIncline?: () => void;
  durationStep: number;
  fallbackReps: number;
  expanded: boolean;
  timerExerciseId?: number;
  onToggle: () => void;
  onWeightChange: (value: string) => void;
  onRepsChange: (value: string) => void;
  onRestChange: (seconds: number) => void;
  onDurationChange: (seconds: number) => void;
  onDistanceChange: (value: string) => void;
  onInclineChange: (value: string) => void;
  onApplyToAll?: () => void;
  onComplete?: () => void;
  onUndo?: () => void;
}

/**
 * One-line set summary for the collapsed/done states, per exercise type:
 * "80 kg × 8", "12 reps", "5 km · 25:30 · 5:06 /km · 6% incline",
 * "32 kg · 40 m · 0:45" or "0:45".
 */
function formatSetValues(
  item: SetEditorItem,
  metrics: ExerciseMetrics,
  fallbackReps: number,
  unit: UnitSystem,
  scale: DistanceScale,
  inclineLabel: string
): string {
  if (!metrics.duration) {
    const reps = item.reps || fallbackReps;
    return item.weight ? `${item.weight} ${weightUnitLabel(unit)} × ${reps}` : `${reps} reps`;
  }
  const parts: string[] = [];
  if (metrics.load && parseNumber(item.weight) > 0) {
    parts.push(`${item.weight} ${weightUnitLabel(unit)}`);
  }
  const distance = parseNumber(item.distance);
  if (metrics.distance && distance > 0) {
    parts.push(`${item.distance} ${distanceUnitLabel(unit, scale)}`);
  }
  parts.push(formatDuration(item.durationSeconds));
  // Pace per km/mi is meaningless for short-scale efforts (carries, laps).
  if (metrics.distance && scale === 'long') {
    const pace = formatPace(item.durationSeconds, displayToMeters(distance, unit), unit);
    if (pace) {
      parts.push(pace);
    }
  }
  if (parseNumber(item.incline) > 0) {
    parts.push(`${item.incline}% ${inclineLabel}`);
  }
  return parts.join(' · ');
}

function SetCard({
  mode,
  item,
  metrics,
  showLoad,
  scale,
  onAddLoad,
  showIncline,
  onAddIncline,
  durationStep,
  fallbackReps,
  expanded,
  timerExerciseId,
  onToggle,
  onWeightChange,
  onRepsChange,
  onRestChange,
  onDurationChange,
  onDistanceChange,
  onInclineChange,
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
  const distanceValue = parseNumber(item.distance);
  const weightMinusDisabled = weightValue <= 0;
  const repsMinusDisabled = repsValue <= 0;
  const distanceMinusDisabled = distanceValue <= 0;
  const durationMinusDisabled = item.durationSeconds <= 0;
  const kmStep = distanceStep(unit, scale);
  const showWeight = metrics.weight || showLoad;

  const stepWeight = (delta: number) => {
    onWeightChange(formatWeightStep(Math.max(0, weightValue + delta)));
  };

  const stepReps = (delta: number) => {
    onRepsChange(formatReps(repsValue + delta));
  };

  const stepDistance = (delta: number) => {
    onDistanceChange(formatDistanceValue(Math.max(0, distanceValue + delta)));
  };

  const stepDuration = (delta: number) => {
    onDurationChange(clampDuration(item.durationSeconds + delta));
  };

  const onRestInputChange = (value: string) => {
    onRestChange(Math.min(REST_MAX_SECONDS, Math.max(0, Math.round(parseNumber(value)))));
  };

  const summary = formatSetValues(item, metrics, fallbackReps, unit, scale, t('workout.inclineShort'));
  const inclineValue = parseNumber(item.incline);

  const stepIncline = (delta: number) => {
    const next = clampIncline(inclineValue + delta);
    onInclineChange(next > 0 ? String(next) : '');
  };
  const timerRunning = useWorkoutToolsStore(
    (state) =>
      timerExerciseId !== undefined &&
      state.setTimer?.exerciseId === timerExerciseId &&
      state.setTimer.setNumber === item.setNumber
  );

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
          {summary}
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
        {timerRunning && (
          <Ionicons
            name="timer-outline"
            size={16}
            color={colors.primary}
          />
        )}
        {!expanded && (
          <Text style={[styles.collapsedSummary, { color: colors.textSecondary }]} numberOfLines={1}>
            {`${summary} · ${item.restSeconds}s ${t('workout.rest')}`}
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
            {showWeight && (
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
                    {metrics.weight
                      ? t('workout.weight', { unit: unitLabel })
                      : t('workout.load', { unit: unitLabel })}
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
            )}
            {metrics.reps && (
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
            )}
            {metrics.distance && (
              <View style={styles.stepperField}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('workout.decreaseDistance')}
                  hitSlop={8}
                  disabled={distanceMinusDisabled}
                  onPress={() => stepDistance(-kmStep)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={26}
                    color={distanceMinusDisabled ? colors.border : colors.primary}
                  />
                </Pressable>
                <View style={[styles.inputField, { borderColor: colors.border }]}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                    {t('workout.distance', { unit: distanceUnitLabel(unit, scale) })}
                  </Text>
                  <TextInput
                    value={item.distance}
                    onChangeText={onDistanceChange}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="decimal-pad"
                    style={[styles.inputValue, { color: colors.text }]}
                  />
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('workout.increaseDistance')}
                  hitSlop={8}
                  onPress={() => stepDistance(kmStep)}
                >
                  <Ionicons name="add-circle-outline" size={26} color={colors.primary} />
                </Pressable>
              </View>
            )}
            {metrics.duration && (
              <View style={styles.stepperField}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('workout.decreaseDuration')}
                  hitSlop={8}
                  disabled={durationMinusDisabled}
                  onPress={() => stepDuration(-durationStep)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={26}
                    color={durationMinusDisabled ? colors.border : colors.primary}
                  />
                </Pressable>
                <DurationInput seconds={item.durationSeconds} onChange={onDurationChange} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('workout.increaseDuration')}
                  hitSlop={8}
                  onPress={() => stepDuration(durationStep)}
                >
                  <Ionicons name="add-circle-outline" size={26} color={colors.primary} />
                </Pressable>
              </View>
            )}
            {showIncline && (
              <View style={styles.stepperField}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('workout.decreaseIncline')}
                  hitSlop={8}
                  disabled={inclineValue <= 0}
                  onPress={() => stepIncline(-INCLINE_STEP)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={26}
                    color={inclineValue <= 0 ? colors.border : colors.primary}
                  />
                </Pressable>
                <View style={[styles.inputField, { borderColor: colors.border }]}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                    {t('workout.incline')}
                  </Text>
                  <TextInput
                    value={item.incline}
                    onChangeText={onInclineChange}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="decimal-pad"
                    style={[styles.inputValue, { color: colors.text }]}
                  />
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('workout.increaseIncline')}
                  hitSlop={8}
                  onPress={() => stepIncline(INCLINE_STEP)}
                >
                  <Ionicons name="add-circle-outline" size={26} color={colors.primary} />
                </Pressable>
              </View>
            )}
            {(onAddLoad || onAddIncline) && (
              <View style={styles.optionalRow}>
                {onAddLoad && (
                  <Pressable
                    accessibilityRole="button"
                    onPress={onAddLoad}
                    style={({ pressed }) => [styles.addLoadButton, { opacity: pressed ? 0.6 : 1 }]}
                  >
                    <Ionicons name="barbell-outline" size={16} color={colors.primary} />
                    <Text style={[styles.addLoadLabel, { color: colors.primary }]}>
                      {t('workout.addLoad')}
                    </Text>
                  </Pressable>
                )}
                {onAddIncline && (
                  <Pressable
                    accessibilityRole="button"
                    onPress={onAddIncline}
                    style={({ pressed }) => [styles.addLoadButton, { opacity: pressed ? 0.6 : 1 }]}
                  >
                    <Ionicons name="trending-up-outline" size={16} color={colors.primary} />
                    <Text style={[styles.addLoadLabel, { color: colors.primary }]}>
                      {t('workout.addIncline')}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
            {metrics.duration && mode === 'workout' && timerExerciseId !== undefined && (
              <SetTimerButton
                exerciseId={timerExerciseId}
                setNumber={item.setNumber}
                targetSeconds={item.targetDurationSeconds ?? 0}
                onStop={onDurationChange}
              />
            )}
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

/** Minutes : seconds input pair for a set duration. Empty fields read as 0. */
function DurationInput({
  seconds,
  onChange,
}: {
  seconds: number;
  onChange: (seconds: number) => void;
}) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { min, sec } = splitDuration(seconds);

  const onMinutesChange = (value: string) => {
    onChange(joinDuration(parseNumber(value), sec));
  };
  const onSecondsChange = (value: string) => {
    onChange(joinDuration(min, Math.min(59, parseNumber(value))));
  };

  return (
    <View style={[styles.inputField, { borderColor: colors.border }]}>
      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
        {t('workout.duration')}
      </Text>
      <View style={styles.durationRow}>
        <TextInput
          value={min > 0 ? String(min) : ''}
          onChangeText={onMinutesChange}
          accessibilityLabel={t('workout.minutes')}
          placeholder="0"
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          selectTextOnFocus
          style={[styles.inputValue, styles.durationPart, { color: colors.text }]}
        />
        <Text style={[styles.inputValue, { color: colors.textSecondary }]}>:</Text>
        <TextInput
          value={sec > 0 ? String(sec).padStart(2, '0') : ''}
          onChangeText={onSecondsChange}
          accessibilityLabel={t('workout.seconds')}
          placeholder="00"
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus
          style={[styles.inputValue, styles.durationPart, { color: colors.text }]}
        />
      </View>
    </View>
  );
}

/**
 * Start/stop button for timing a set live. State lives in the workout tools
 * store so the timer keeps running while the user leaves the screen. Stopping
 * writes the elapsed time into the set's duration; a light haptic marks the
 * moment the planned target is reached.
 */
function SetTimerButton({
  exerciseId,
  setNumber,
  targetSeconds,
  onStop,
}: {
  exerciseId: number;
  setNumber: number;
  targetSeconds: number;
  onStop: (seconds: number) => void;
}) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const setTimer = useWorkoutToolsStore((state) => state.setTimer);
  const running =
    setTimer !== null && setTimer.exerciseId === exerciseId && setTimer.setNumber === setNumber;
  const [now, setNow] = useState(() => Date.now());
  const cuedRef = useRef(false);

  useEffect(() => {
    if (!running) {
      cuedRef.current = false;
      return;
    }
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [running]);

  const elapsed = running && setTimer ? getSetTimerElapsedSeconds(setTimer, now) : 0;

  useEffect(() => {
    if (running && targetSeconds > 0 && elapsed >= targetSeconds && !cuedRef.current) {
      cuedRef.current = true;
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [running, elapsed, targetSeconds]);

  const handlePress = () => {
    const store = useWorkoutToolsStore.getState();
    if (running) {
      const seconds = store.stopSetTimer(exerciseId, setNumber);
      if (seconds !== null) {
        onStop(clampDuration(seconds));
      }
      return;
    }
    store.startSetTimer(exerciseId, setNumber);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={running ? t('workout.stopSetTimer') : t('workout.startSetTimer')}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.timerButton,
        {
          borderColor: colors.primary,
          backgroundColor: running ? colors.primary : 'transparent',
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Ionicons name={running ? 'stop' : 'play'} size={16} color={running ? '#FFFFFF' : colors.primary} />
      <Text style={[styles.timerLabel, { color: running ? '#FFFFFF' : colors.primary }]}>
        {running
          ? `${t('workout.stopSetTimer')} · ${formatDuration(elapsed)}`
          : t('workout.startSetTimer')}
      </Text>
    </Pressable>
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
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  achievementIcon: {
    fontSize: 15,
  },
  achievementMore: {
    fontSize: 12,
    fontWeight: '600',
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
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationPart: {
    minWidth: 32,
    fontVariant: ['tabular-nums'],
  },
  optionalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  addLoadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 4,
  },
  addLoadLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
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
