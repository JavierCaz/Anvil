import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  ExerciseSetEditor,
  type SetEditorItem,
} from '@/components/ExerciseSetEditor';
import { RestTimer } from '@/components/RestTimer';
import { Screen } from '@/components/Screen';
import { useToast } from '@/components/ToastProvider';
import { unlockWeightComparatives } from '@/db/achievements';
import {
  deleteSetAndShift,
  getActiveWorkoutExercise,
  getWorkoutSets,
  markWorkoutSetsEdited,
  upsertSet,
} from '@/db/workouts';
import type { ActiveWorkoutExercise, WorkoutSet } from '@/db/types';
import { useAppTheme } from '@/theme/app-theme-provider';

const DEFAULT_REST_SECONDS = 90;

interface SetDraft {
  weight: string;
  reps: string;
}

interface ActiveRest {
  setNumber: number;
  seconds: number;
}

export default function WorkoutExerciseScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const toast = useToast();
  const { id, exerciseId } = useLocalSearchParams<{ id: string; exerciseId: string }>();
  const logId = Number(id);
  const exerciseIdNum = Number(exerciseId);

  const [exercise, setExercise] = useState<ActiveWorkoutExercise | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [drafts, setDrafts] = useState<Record<number, SetDraft>>({});
  const [restConfig, setRestConfig] = useState<Record<number, number>>({});
  const [setCount, setSetCount] = useState(0);
  const [expandedSet, setExpandedSet] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [activeRest, setActiveRest] = useState<ActiveRest | null>(null);

  const handleRestDone = useCallback(() => {
    setActiveRest(null);
  }, []);

  useEffect(() => {
    let active = true;
    void Promise.all([
      getActiveWorkoutExercise(db, logId, exerciseIdNum),
      getWorkoutSets(db, logId, exerciseIdNum),
    ]).then(([exerciseRow, setRows]) => {
      if (!active) {
        return;
      }
      setExercise(exerciseRow);
      setSets(setRows);
      setLoaded(true);
      const count = Math.max(
        exerciseRow?.target_sets ?? 0,
        setRows.reduce((max, set) => Math.max(max, set.set_number), 0)
      );
      setSetCount(count);
      setExpandedSet(firstIncompleteSet(count, setRows));
    });
    return () => {
      active = false;
    };
  }, [db, logId, exerciseIdNum]);

  const targetReps = exercise?.target_reps ?? 0;
  const defaultRest = exercise?.target_rest_seconds ?? DEFAULT_REST_SECONDS;

  const setNumbers = Array.from({ length: setCount }, (_, i) => i + 1);

  const setByNumber = new Map(sets.map((set) => [set.set_number, set]));
  const doneCount = setNumbers.filter(
    (number) => setByNumber.get(number)?.completed === 1
  ).length;
  const allDone = doneCount === setNumbers.length;

  const setItems: SetEditorItem[] = setNumbers.map((number) => {
    const set = setByNumber.get(number);
    const draft = drafts[number] ?? { weight: '', reps: String(targetReps) };
    return {
      setNumber: number,
      weight: draft.weight,
      reps: draft.reps,
      restSeconds: restConfig[number] ?? defaultRest,
      done: set?.completed === 1,
    };
  });

  const updateDraft = (setNumber: number, patch: Partial<SetDraft>) => {
    setDrafts((current) => ({
      ...current,
      [setNumber]: { ...(current[setNumber] ?? { weight: '', reps: String(targetReps) }), ...patch },
    }));
  };

  const setRestFor = (setNumber: number, seconds: number) => {
    setRestConfig((current) => ({
      ...current,
      [setNumber]: Math.min(300, Math.max(0, seconds)),
    }));
  };

  const reload = () => {
    void getWorkoutSets(db, logId, exerciseIdNum).then((rows) => {
      setSets(rows);
    });
  };

  const handleAddSet = () => {
    const next = Math.min(99, setCount + 1);
    setSetCount(next);
    setExpandedSet(next);
    void markWorkoutSetsEdited(db, logId);
  };

  /** Drop a set from the session, renumbering the ones after it. */
  const handleRemoveSet = (setNumber: number) => {
    setSetCount((count) => Math.max(1, count - 1));
    setDrafts((current) => shiftMapDown(current, setNumber));
    setRestConfig((current) => shiftMapDown(current, setNumber));
    setExpandedSet(null);
    setActiveRest(null);
    void deleteSetAndShift(db, logId, exerciseIdNum, setNumber).then(reload);
    void markWorkoutSetsEdited(db, logId);
  };

  const parseNumber = (value: string): number => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  };

  const handleComplete = (setNumber: number) => {
    const draft = drafts[setNumber] ?? { weight: '', reps: String(targetReps) };
    const restSeconds = restConfig[setNumber] ?? defaultRest;
    const weight = parseNumber(draft.weight);
    void upsertSet(db, logId, exerciseIdNum, setNumber, {
      weight,
      reps: Math.round(parseNumber(draft.reps)),
      restSeconds,
      completed: 1,
    }).then(() => {
      reload();
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (restSeconds > 0) {
        setActiveRest({ setNumber, seconds: restSeconds });
      }
      // Auto-advance the accordion to the next set when the open one is done.
      setExpandedSet((current) => {
        if (current !== setNumber) {
          return current;
        }
        return setNumber + 1 <= setCount ? setNumber + 1 : null;
      });

      // Weight comparatives: unlock every object reached by this set and toast
      // the highest newly-unlocked one; the rest are counted as extras.
      void unlockWeightComparatives(db, weight).then((unlocked) => {
        if (unlocked.length === 0) {
          return;
        }
        const top = unlocked[unlocked.length - 1];
        const extras = unlocked.length - 1;
        const detail = t('notifications.comparativeDetail', {
          weight: String(weight),
          exercise: exercise?.exercise_name ?? '',
        });
        toast.show({
          icon: top.icon,
          title: t('notifications.comparativeLifted', { object: t(top.nameKey) }),
          description:
            extras > 0
              ? `${detail} · ${t('notifications.comparativeMore', { count: extras })}`
              : detail,
        });
      });
    });
  };

  const handleUndo = (setNumber: number) => {
    void upsertSet(db, logId, exerciseIdNum, setNumber, {
      weight: parseNumber(drafts[setNumber]?.weight ?? ''),
      reps: Math.round(parseNumber(drafts[setNumber]?.reps ?? String(targetReps))),
      restSeconds: restConfig[setNumber] ?? defaultRest,
      completed: 0,
    }).then(() => {
      setActiveRest(null);
      reload();
    });
  };

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: true, title: exercise?.exercise_name ?? '' }} />

      {!loaded || !exercise ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ExerciseSetEditor
              mode="workout"
              exerciseName={exercise.exercise_name}
              slug={exercise.exercise_slug}
              sets={setItems}
              fallbackReps={targetReps}
              doneCount={doneCount}
              totalSets={setCount}
              expanded={expandedSet}
              onExpandedChange={setExpandedSet}
              onWeightChange={(number, value) => updateDraft(number, { weight: value })}
              onRepsChange={(number, value) => updateDraft(number, { reps: value })}
              onRestChange={setRestFor}
              onAddSet={handleAddSet}
              onRemoveSet={handleRemoveSet}
              onCompleteSet={handleComplete}
              onUndoSet={handleUndo}
            />
          </ScrollView>

          <View style={styles.footer}>
            {activeRest && (
              <RestTimer key={activeRest.setNumber} seconds={activeRest.seconds} onDone={handleRestDone} />
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('workout.finishExercise')}
              disabled={!allDone}
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.finishButton,
                {
                  backgroundColor: allDone ? colors.primary : colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={styles.finishLabel}>{t('workout.finishExercise')}</Text>
            </Pressable>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
  finishButton: {
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 15,
  },
  finishLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

/** Re-key a number map after removing `removedNumber`: keys above it shift down. */
function shiftMapDown<T>(map: Record<number, T>, removedNumber: number): Record<number, T> {
  const next: Record<number, T> = {};
  for (const [key, value] of Object.entries(map)) {
    const number = Number(key);
    if (number === removedNumber) {
      continue;
    }
    next[number > removedNumber ? number - 1 : number] = value;
  }
  return next;
}

/** Lowest set number (1..total) that isn't completed yet, or null when all are done. */
function firstIncompleteSet(total: number, rows: WorkoutSet[]): number | null {
  const done = new Set(rows.filter((row) => row.completed === 1).map((row) => row.set_number));
  for (let number = 1; number <= total; number++) {
    if (!done.has(number)) {
      return number;
    }
  }
  return null;
}