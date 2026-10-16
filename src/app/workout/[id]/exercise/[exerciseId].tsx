import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AchievementDetailModal } from '@/components/AchievementDetailModal';
import { ExerciseDetailModal } from '@/components/ExerciseDetailModal';
import {
  ExerciseSetEditor,
  type SetEditorItem,
} from '@/components/ExerciseSetEditor';
import { RestTimer } from '@/components/RestTimer';
import { Screen } from '@/components/Screen';
import { useDialog } from '@/components/AppDialog';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useToast } from '@/components/ToastProvider';
import { WorkoutElapsedBar } from '@/components/WorkoutElapsed';
import { WorkoutToolsButton, WorkoutToolsSheet } from '@/components/WorkoutTools';
import { getAchievementByKey } from '@/constants/achievements';
import {
  clampIncline,
  clampLevel,
  distanceScale,
  getExerciseMetrics,
} from '@/constants/exercise-metrics';
import type { AchievementDefinition } from '@/constants/achievements';
import {
  getExerciseAchievements,
  getExerciseAchievementUnlockedAt,
  reconcileExerciseAchievements,
  unlockDistanceAchievements,
  unlockWeightComparatives,
} from '@/db/achievements';
import {
  deleteSetAndShift,
  getActiveWorkoutExercise,
  getWorkoutLog,
  getWorkoutSets,
  markWorkoutSetsEdited,
  upsertSet,
} from '@/db/workouts';
import type { WorkoutSet } from '@/db/types';
import { useExerciseInfo } from '@/hooks/use-exercise-info';
import { useFocusQuery } from '@/hooks/use-focus-query';
import { useUnitsStore } from '@/store/units';
import { useWorkoutToolsStore } from '@/store/workout-tools';
import { useAppTheme } from '@/theme/app-theme-provider';
import { hairline, shape, typography } from '@/theme/tokens';
import { displayToMeters, formatDistance, formatDistanceWithUnit } from '@/utils/distance';
import { displayToKg, formatWeight, kgToDisplay, weightUnitLabel } from '@/utils/weight';

const DEFAULT_REST_SECONDS = 90;

interface SetDraft {
  weight: string;
  reps: string;
  durationSeconds: number;
  /** Display unit (km / mi). */
  distance: string;
  /** Treadmill incline, percent ('' = flat). */
  incline: string;
  /** Machine resistance level ('' = not set). */
  level: string;
}

export default function WorkoutExerciseScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const toast = useToast();
  const dialog = useDialog();
  const unit = useUnitsStore((state) => state.unitSystem);
  const { id, exerciseId } = useLocalSearchParams<{ id: string; exerciseId: string }>();
  const logId = Number(id);
  const exerciseIdNum = Number(exerciseId);

  const { data, loaded, reload: reloadQuery } = useFocusQuery(
    async (db) => {
      const [exerciseRow, setRows, logRow] = await Promise.all([
        getActiveWorkoutExercise(db, logId, exerciseIdNum),
        getWorkoutSets(db, logId, exerciseIdNum),
        getWorkoutLog(db, logId),
      ]);
      return { exercise: exerciseRow, sets: setRows, startedAt: logRow?.started_at ?? null };
    },
    [logId, exerciseIdNum, unit],
    { refetchOnFocus: false }
  );
  const exercise = data?.exercise ?? null;
  const sets = data?.sets ?? [];

  const [drafts, setDrafts] = useState<Record<number, SetDraft>>({});
  const [restConfig, setRestConfig] = useState<Record<number, number>>({});
  const [setCount, setSetCount] = useState(0);
  const [expandedSet, setExpandedSet] = useState<number | null>(null);
  const [toolsOpen, setToolsOpen] = useState(false);
  const exerciseInfo = useExerciseInfo();
  const [achievementKeys, setAchievementKeys] = useState<string[]>([]);
  // Achievement detail card: opened from an unlock toast or from a medal in the exercise info modal.
  const [detailAchievement, setDetailAchievement] = useState<{
    definition: AchievementDefinition;
    unlockedAt: string;
  } | null>(null);

  const showAchievementDetail = (key: string) => {
    const definition = getAchievementByKey(key);
    if (!definition) {
      return;
    }
    void getExerciseAchievementUnlockedAt(db, exerciseIdNum, key).then((unlockedAt) => {
      exerciseInfo.close();
      setDetailAchievement({ definition, unlockedAt: unlockedAt ?? new Date().toISOString() });
    });
  };

  const showExerciseInfo = () => {
    if (exercise) {
      exerciseInfo.open(exercise.exercise_id);
    }
  };

  const scale = distanceScale(
    exercise?.exercise_type,
    exercise?.exercise_slug,
    exercise?.exercise_equipment
  );

  /** Planned/logged meters → distance input text in the display unit. */
  const distanceDraft = (meters: number | null | undefined) =>
    meters && meters > 0 ? formatDistance(meters, unit, scale) : '';

  /** Planned/logged incline → input text ('' = flat). */
  const inclineDraft = (percent: number | null | undefined) =>
    percent && percent > 0 ? String(percent) : '';

  /** Planned/logged machine level → input text ('' = not set). */
  const levelDraft = (level: number | null | undefined) =>
    level && level > 0 ? String(level) : '';

  const seededRef = useRef<string | null>(null);
  const seedKey = `${logId}:${exerciseIdNum}:${unit}`;

  useEffect(() => {
    if (!data || seededRef.current === seedKey) {
      return;
    }
    seededRef.current = seedKey;
    const exerciseRow = data.exercise;
    const setRows = data.sets;
    const count = Math.max(
      exerciseRow?.target_sets ?? 0,
      setRows.reduce((max, set) => Math.max(max, set.set_number), 0)
    );
    setSetCount(count);
    setExpandedSet(firstIncompleteSet(count, setRows));

    // Prefill the inputs from the routine's planned per-set targets so the
    // user doesn't have to re-enter weight/reps/rest when the session starts.
    const loggedByNumber = new Map(setRows.map((row) => [row.set_number, row]));
    const initialDrafts: Record<number, SetDraft> = {};
    const initialRest: Record<number, number> = {};
    for (const target of exerciseRow?.set_targets ?? []) {
      const logged = loggedByNumber.get(target.set_number);
      if (logged) {
        initialDrafts[target.set_number] = {
          weight: logged.weight > 0 ? String(kgToDisplay(logged.weight, unit)) : '',
          reps: String(logged.reps),
          durationSeconds: logged.duration_seconds ?? target.duration_seconds ?? 0,
          distance: distanceDraft(logged.distance_m ?? target.distance_m),
          incline: inclineDraft(logged.incline_percent ?? target.incline_percent),
          level: levelDraft(logged.level ?? target.level),
        };
        initialRest[target.set_number] = logged.rest_seconds;
      } else {
        initialDrafts[target.set_number] = {
          weight: target.weight && target.weight > 0 ? String(kgToDisplay(target.weight, unit)) : '',
          reps: String(target.reps),
          durationSeconds: target.duration_seconds ?? 0,
          distance: distanceDraft(target.distance_m),
          incline: inclineDraft(target.incline_percent),
          level: levelDraft(target.level),
        };
        initialRest[target.set_number] = target.rest_seconds;
      }
    }
    setDrafts(initialDrafts);
    setRestConfig(initialRest);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- distanceDraft only depends on `unit`
  }, [data, seedKey, unit]);

  const targetReps = exercise?.target_reps ?? 0;
  const defaultRest = exercise?.target_rest_seconds ?? DEFAULT_REST_SECONDS;
  const metrics = getExerciseMetrics(exercise?.exercise_type ?? null);
  const targetsByNumber = new Map(
    (exercise?.set_targets ?? []).map((target) => [target.set_number, target])
  );
  // Sets added during the session copy the first planned set's duration/distance.
  const firstTarget = exercise?.set_targets[0];
  const emptyDraft = (): SetDraft => ({
    weight: '',
    reps: String(targetReps),
    durationSeconds: firstTarget?.duration_seconds ?? 0,
    distance: distanceDraft(firstTarget?.distance_m),
    incline: inclineDraft(firstTarget?.incline_percent),
    level: levelDraft(firstTarget?.level),
  });

  const setNumbers = Array.from({ length: setCount }, (_, i) => i + 1);

  const setByNumber = new Map(sets.map((set) => [set.set_number, set]));
  const doneCount = setNumbers.filter(
    (number) => setByNumber.get(number)?.completed === 1
  ).length;
  const allDone = doneCount === setNumbers.length;

  const setItems: SetEditorItem[] = setNumbers.map((number) => {
    const set = setByNumber.get(number);
    const draft = drafts[number] ?? emptyDraft();
    return {
      setNumber: number,
      weight: draft.weight,
      reps: draft.reps,
      restSeconds: restConfig[number] ?? defaultRest,
      durationSeconds: draft.durationSeconds,
      distance: draft.distance,
      incline: draft.incline,
      level: draft.level,
      targetDurationSeconds:
        targetsByNumber.get(number)?.duration_seconds ?? firstTarget?.duration_seconds ?? 0,
      done: set?.completed === 1,
    };
  });

  const updateDraft = (setNumber: number, patch: Partial<SetDraft>) => {
    setDrafts((current) => ({
      ...current,
      [setNumber]: { ...(current[setNumber] ?? emptyDraft()), ...patch },
    }));
  };

  const setRestFor = (setNumber: number, seconds: number) => {
    setRestConfig((current) => ({
      ...current,
      [setNumber]: Math.min(300, Math.max(0, seconds)),
    }));
  };
  const loadAchievementIcons = useCallback(() => {
    void getExerciseAchievements(db, exerciseIdNum).then((definitions) => {
      setAchievementKeys(definitions.map((definition) => definition.key));
    });
  }, [db, exerciseIdNum]);

  useEffect(() => {
    loadAchievementIcons();
  }, [loadAchievementIcons]);

  const reload = useCallback(() => {
    reloadQuery();
    loadAchievementIcons();
  }, [reloadQuery, loadAchievementIcons]);

  const handleAddSet = () => {
    const next = Math.min(99, setCount + 1);
    setSetCount(next);
    setExpandedSet(next);
    void markWorkoutSetsEdited(db, logId);
  };

  const confirmRemoveSet = (setNumber: number) => {
    dialog.alert({
      title: t('workout.removeSetConfirmTitle'),
      message: t('workout.removeSetConfirmMessage', { number: setNumber }),
      icon: 'trash-outline',
      tone: 'error',
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            setSetCount((count) => Math.max(1, count - 1));
            setDrafts((current) => shiftMapDown(current, setNumber));
            setRestConfig((current) => shiftMapDown(current, setNumber));
            setExpandedSet(null);
            // Keep the rest timer running unless it's counting down for the
            // set being deleted.
            useWorkoutToolsStore.getState().releaseRestSet(exerciseIdNum, setNumber, true);
            useWorkoutToolsStore.getState().releaseSetTimer(exerciseIdNum, setNumber, true);
            void deleteSetAndShift(db, logId, exerciseIdNum, setNumber).then(reload);
            void markWorkoutSetsEdited(db, logId);
          },
        },
      ],
    });
  };

  /** Drop a set from the session, renumbering the ones after it. */
  const handleRemoveSet = (setNumber: number) => {
    confirmRemoveSet(setNumber);
  };

  const parseNumber = (value: string): number => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  };

  /** Draft → the values persisted for a set, per exercise type. */
  const setLogValues = (draft: SetDraft) => {
    if (metrics.duration) {
      const distance = parseNumber(draft.distance);
      return {
        // Optional load (farmer carry, weighted plank…). Reps stay 0, so it
        // never adds to lifting volume — but it counts for weight PRs/milestones.
        weight: displayToKg(parseNumber(draft.weight), unit),
        reps: 0,
        durationSeconds: draft.durationSeconds,
        distanceM: metrics.distance && distance > 0 ? displayToMeters(distance, unit, scale) : null,
        inclinePercent: clampIncline(parseNumber(draft.incline)) || null,
        level: clampLevel(parseNumber(draft.level)) || null,
      };
    }
    return {
      weight: displayToKg(parseNumber(draft.weight), unit),
      reps: Math.round(parseNumber(draft.reps)),
      durationSeconds: null,
      distanceM: null,
      inclinePercent: null,
      level: null,
    };
  };

  const handleComplete = (setNumber: number) => {
    let draft = drafts[setNumber] ?? emptyDraft();
    // A set timer still running for this set is stopped and its time logged.
    const timed = useWorkoutToolsStore.getState().stopSetTimer(exerciseIdNum, setNumber);
    if (timed !== null && metrics.duration) {
      draft = { ...draft, durationSeconds: timed };
      updateDraft(setNumber, { durationSeconds: timed });
    }
    const restSeconds = restConfig[setNumber] ?? defaultRest;
    const values = setLogValues(draft);
    const weightKg = values.weight;
    void upsertSet(db, logId, exerciseIdNum, setNumber, {
      ...values,
      restSeconds,
      completed: 1,
    }).then(() => {
      reload();
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (restSeconds > 0) {
        useWorkoutToolsStore.getState().startRest(exerciseIdNum, setNumber, restSeconds);
      }
      // Auto-advance the accordion to the next set when the open one is done.
      setExpandedSet((current) => {
        if (current !== setNumber) {
          return current;
        }
        return setNumber + 1 <= setCount ? setNumber + 1 : null;
      });

      // Distance milestones (best single set) and landmarks (cumulative
      // distance): unlock per exercise and toast the most notable — the
      // longest effort if any, otherwise the furthest landmark.
      if ((values.distanceM ?? 0) > 0) {
        void unlockDistanceAchievements(db, exerciseIdNum).then((unlocked) => {
          if (unlocked.length > 0) {
            const efforts = unlocked.filter((entry) => entry.definition.kind === 'effort');
            const pool = efforts.length > 0 ? efforts : unlocked;
            const top = pool[pool.length - 1];
            const extras = unlocked.length - 1;
            const distance = formatDistanceWithUnit(
              top.distanceM,
              unit,
              top.distanceM < 1000 ? 'short' : 'long'
            );
            const detail = t(
              top.definition.kind === 'effort'
                ? 'notifications.distanceDetail'
                : 'notifications.landmarkDetail',
              { distance, exercise: exercise?.exercise_name ?? '' }
            );
            toast.show({
              achievementKey: top.definition.key,
              title:
                top.definition.kind === 'effort'
                  ? t('notifications.distanceEffort', { name: t(top.definition.nameKey) })
                  : t('notifications.landmarkReached', { object: t(top.definition.nameKey) }),
              description:
                extras > 0
                  ? `${detail} · ${t('notifications.comparativeMore', { count: extras })}`
                  : detail,
              onPress: () => {
                // Deferred for the same reason as the weight toast below.
                setTimeout(() => {
                  const definition = getAchievementByKey(top.definition.key);
                  if (definition) {
                    exerciseInfo.close();
                    setDetailAchievement({ definition, unlockedAt: new Date().toISOString() });
                  }
                }, 0);
              },
            });
          }
          loadAchievementIcons();
        });
      }

      // Weight comparatives: unlock every object reached by this set for this
      // exercise and toast the highest newly-unlocked one; the rest count as
      // extras. Unlocks are per-exercise. Unloaded timed sets lift no weight.
      if (weightKg <= 0) {
        return;
      }
      void unlockWeightComparatives(db, exerciseIdNum, weightKg).then((unlocked) => {
        if (unlocked.length > 0) {
          const top = unlocked[unlocked.length - 1];
          const extras = unlocked.length - 1;
          const detail = t('notifications.comparativeDetail', {
            weight: formatWeight(weightKg, unit),
            unit: weightUnitLabel(unit),
            exercise: exercise?.exercise_name ?? '',
          });
          toast.show({
            achievementKey: top.key,
            title: t('notifications.comparativeLifted', { object: t(top.nameKey) }),
            description:
              extras > 0
                ? `${detail} · ${t('notifications.comparativeMore', { count: extras })}`
                : detail,
            onPress: () => {
              // Defer mounting the native Modal out of the touch handler —
              // mounting it synchronously makes the tap's touch-up land on the
              // modal backdrop, which closes it instantly (first tap appears dead).
              setTimeout(() => {
                const definition = getAchievementByKey(top.key);
                if (definition) {
                  exerciseInfo.close();
                  setDetailAchievement({ definition, unlockedAt: new Date().toISOString() });
                }
              }, 0);
            },
          });
        }
        // Show newly-unlocked achievement icons immediately.
        loadAchievementIcons();
      });
    });
  };

  const handleUndo = (setNumber: number) => {
    void upsertSet(db, logId, exerciseIdNum, setNumber, {
      ...setLogValues(drafts[setNumber] ?? emptyDraft()),
      restSeconds: restConfig[setNumber] ?? defaultRest,
      completed: 0,
    }).then(() => {
      // Only stop the rest timer when undoing the set it's counting down for.
      useWorkoutToolsStore.getState().releaseRestSet(exerciseIdNum, setNumber);
      // Undoing a done set reopens it as an editable accordion — make it the open one.
      setExpandedSet(setNumber);
      reload();
      // Revoke weight comparatives no longer backed by a completed set.
      void reconcileExerciseAchievements(db, exerciseIdNum);
    });
  };

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: exercise?.exercise_name ?? '',
          headerRight: () => <WorkoutToolsButton onPress={() => setToolsOpen(true)} />,
        }}
      />

      {loaded && exercise && (
        <>
          <ScrollView
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <WorkoutElapsedBar startedAt={data?.startedAt} />
            <ExerciseSetEditor
              mode="workout"
              exerciseName={exercise.exercise_name}
              slug={exercise.exercise_slug}
              exerciseType={exercise.exercise_type}
              exerciseEquipment={exercise.exercise_equipment}
              timerExerciseId={exerciseIdNum}
              onHeaderPress={showExerciseInfo}
              sets={setItems}
              fallbackReps={targetReps}
              doneCount={doneCount}
              totalSets={setCount}
              expanded={expandedSet}
              onExpandedChange={setExpandedSet}
              onWeightChange={(number, value) => updateDraft(number, { weight: value })}
              onRepsChange={(number, value) => updateDraft(number, { reps: value })}
              onRestChange={setRestFor}
              onDurationChange={(number, seconds) => updateDraft(number, { durationSeconds: seconds })}
              onDistanceChange={(number, value) => updateDraft(number, { distance: value })}
              onInclineChange={(number, value) => updateDraft(number, { incline: value })}
              onLevelChange={(number, value) => updateDraft(number, { level: value })}
              onAddSet={handleAddSet}
              onRemoveSet={handleRemoveSet}
              onCompleteSet={handleComplete}
              onUndoSet={handleUndo}
              achievementKeys={achievementKeys}
            />
          </ScrollView>

          {/* Only one detail modal at a time: opening one closes the other. */}
          {exerciseInfo.info && (
            <ExerciseDetailModal
              exercise={exerciseInfo.info.exercise}
              onClose={exerciseInfo.close}
              achievementKeys={exerciseInfo.info.achievementKeys}
              onAchievementPress={showAchievementDetail}
            />
          )}
          {detailAchievement && (
            <AchievementDetailModal
              definition={detailAchievement.definition}
              progress={1}
              unlocked
              unlockedAt={detailAchievement.unlockedAt}
              exercises={
                exercise
                  ? [{
                      id: exercise.exercise_id,
                      name: exercise.exercise_name,
                      slug: exercise.exercise_slug,
                      unlockedAt: detailAchievement.unlockedAt,
                    }]
                  : undefined
              }
              onExercisePress={(exerciseId) =>
                exerciseInfo.open(exerciseId, () => setDetailAchievement(null))
              }
              onClose={() => setDetailAchievement(null)}
            />
          )}

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <RestTimer />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('workout.finishExercise')}
              disabled={!allDone}
              onPress={() => router.back()}
              style={({ pressed }) => [
                shape.primaryButton,
                {
                  backgroundColor: allDone ? colors.primary : colors.surfaceElevated,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Ionicons
                name="checkmark-done"
                size={20}
                color={allDone ? colors.onPrimary : colors.textSecondary}
              />
              <Text style={[typography.button, { color: allDone ? colors.onPrimary : colors.textSecondary }]}>
                {t('workout.finishExercise')}
              </Text>
            </Pressable>
          </View>
        </>
      )}

      <LoadingOverlay visible={!loaded} />

      <WorkoutToolsSheet visible={toolsOpen} onClose={() => setToolsOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
    paddingBottom: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 10,
    borderTopWidth: hairline,
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