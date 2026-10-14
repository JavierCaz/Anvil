import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ExerciseDetailModal } from '@/components/ExerciseDetailModal';
import { ExerciseSetEditor, type SetEditorItem } from '@/components/ExerciseSetEditor';
import { Screen } from '@/components/Screen';
import { useDialog } from '@/components/AppDialog';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { getExerciseById } from '@/db/exercises';
import {
  getRoutineExercise,
  getRoutineExerciseSets,
  saveRoutineExerciseSets,
} from '@/db/routines';
import type { Exercise } from '@/db/types';
import { useFocusQuery } from '@/hooks/use-focus-query';
import { useUnitsStore } from '@/store/units';
import { clampIncline, distanceScale, getExerciseMetrics } from '@/constants/exercise-metrics';
import { useAppTheme } from '@/theme/app-theme-provider';
import { hairline, shape, typography } from '@/theme/tokens';
import { displayToMeters, formatDistance } from '@/utils/distance';
import { displayToKg, kgToDisplay } from '@/utils/weight';

interface SetDraft {
  weight: string;
  reps: string;
  restSeconds: number;
  durationSeconds: number;
  /** Display unit (km / mi). */
  distance: string;
  /** Treadmill incline, percent ('' = flat). */
  incline: string;
}

const MAX_SETS = 99;

export default function RoutineSetEditorScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dialog = useDialog();
  const unit = useUnitsStore((state) => state.unitSystem);
  const { reId } = useLocalSearchParams<{ reId: string }>();
  const routineExerciseId = Number(reId);

  const { data, loaded } = useFocusQuery(
    async (db) => {
      const [exerciseRow, setRows] = await Promise.all([
        getRoutineExercise(db, routineExerciseId),
        getRoutineExerciseSets(db, routineExerciseId),
      ]);
      return { exercise: exerciseRow, setRows };
    },
    [routineExerciseId, unit],
    { refetchOnFocus: false }
  );
  const exercise = data?.exercise ?? null;
  const [sets, setSets] = useState<SetDraft[]>([]);
  const [infoExercise, setInfoExercise] = useState<Exercise | null>(null);
  const seededRef = useRef<string | null>(null);
  const seedKey = `${routineExerciseId}:${unit}`;

  useEffect(() => {
    if (!data || seededRef.current === seedKey) {
      return;
    }
    seededRef.current = seedKey;
    setSets(
      data.setRows.map((row) => ({
        weight: row.weight && row.weight > 0 ? String(kgToDisplay(row.weight, unit)) : '',
        reps: String(row.reps),
        restSeconds: row.rest_seconds,
        incline: row.incline_percent && row.incline_percent > 0 ? String(row.incline_percent) : '',
        durationSeconds: row.duration_seconds ?? 0,
        distance:
          row.distance_m && row.distance_m > 0
            ? formatDistance(
                row.distance_m,
                unit,
                distanceScale(
                  data.exercise?.exercise_type,
                  data.exercise?.exercise_slug,
                  data.exercise?.exercise_equipment
                )
              )
            : '',
      }))
    );
  }, [data, seedKey, unit]);

  const setItems: SetEditorItem[] = sets.map((set, index) => ({
    setNumber: index + 1,
    weight: set.weight,
    reps: set.reps,
    restSeconds: set.restSeconds,
    durationSeconds: set.durationSeconds,
    distance: set.distance,
    incline: set.incline,
  }));
  const metrics = getExerciseMetrics(exercise?.exercise_type ?? null);
  const scale = distanceScale(
    exercise?.exercise_type,
    exercise?.exercise_slug,
    exercise?.exercise_equipment
  );

  const updateSet = (index: number, patch: Partial<SetDraft>) => {
    setSets((current) => current.map((set, i) => (i === index ? { ...set, ...patch } : set)));
  };

  const handleAddSet = () => {
    setSets((current) => {
      if (current.length >= MAX_SETS) {
        return current;
      }
      const template = current[0] ?? {
        weight: '',
        reps: '10',
        restSeconds: 90,
        durationSeconds: 0,
        distance: '',
        incline: '',
      };
      return [...current, { ...template }];
    });
  };

  const handleRemoveSet = (setNumber: number) => {
    setSets((current) => (current.length > 1 ? current.filter((_, i) => i !== setNumber - 1) : current));
  };

  const confirmRemoveSet = (setNumber: number) => {
    dialog.alert({
      title: t('routines.setsEditor.removeSetConfirmTitle'),
      message: t('routines.setsEditor.removeSetConfirmMessage', { number: setNumber }),
      icon: 'trash-outline',
      tone: 'error',
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => handleRemoveSet(setNumber),
        },
      ],
    });
  };

  const handleApplyToAll = (setNumber: number) => {
    const template = sets[setNumber - 1];
    if (!template) {
      return;
    }
    setSets((current) => current.map(() => ({ ...template })));
  };

  const parseNumber = (value: string): number => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  };

  const handleSave = () => {
    void saveRoutineExerciseSets(
      db,
      routineExerciseId,
      sets.map((set, index) =>
        metrics.duration
          ? {
              setNumber: index + 1,
              reps: 0,
              restSeconds: set.restSeconds,
              // Optional load (farmer carry, weighted plank…).
              weight: parseNumber(set.weight) ? displayToKg(parseNumber(set.weight), unit) : null,
              durationSeconds: set.durationSeconds,
              distanceM:
                metrics.distance && parseNumber(set.distance)
                  ? displayToMeters(parseNumber(set.distance), unit, scale)
                  : null,
              inclinePercent: clampIncline(parseNumber(set.incline)) || null,
            }
          : {
              setNumber: index + 1,
              reps: Math.max(1, Math.round(parseNumber(set.reps) || 1)),
              restSeconds: set.restSeconds,
              weight: parseNumber(set.weight) ? displayToKg(parseNumber(set.weight), unit) : null,
            }
      )
    ).then(() => {
      router.back();
    });
  };

  const showExerciseInfo = () => {
    void getExerciseById(db, exercise?.exercise_id ?? -1).then((row) => {
      if (row) {
        setInfoExercise(row);
      }
    });
  };

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: true, title: exercise?.exercise_name ?? '' }} />

      {loaded && exercise && (
        <>
          <ScrollView
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ExerciseSetEditor
              mode="routine"
              exerciseName={exercise.exercise_name}
              slug={exercise.exercise_slug}
              exerciseType={exercise.exercise_type}
              exerciseEquipment={exercise.exercise_equipment}
              sets={setItems}
              fallbackReps={10}
              onHeaderPress={showExerciseInfo}
              onWeightChange={(number, value) => updateSet(number - 1, { weight: value })}
              onRepsChange={(number, value) => updateSet(number - 1, { reps: value })}
              onRestChange={(number, seconds) => updateSet(number - 1, { restSeconds: seconds })}
              onDurationChange={(number, seconds) => updateSet(number - 1, { durationSeconds: seconds })}
              onDistanceChange={(number, value) => updateSet(number - 1, { distance: value })}
              onInclineChange={(number, value) => updateSet(number - 1, { incline: value })}
              onAddSet={handleAddSet}
              onRemoveSet={confirmRemoveSet}
              onApplyToAll={handleApplyToAll}
            />

            {exercise.exercise_source === 'custom' && (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push(`/exercise/${exercise.exercise_id}/edit`)}
                style={({ pressed }) => [
                  shape.secondaryButton,
                  styles.editExerciseButton,
                  { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Ionicons name="pencil" size={16} color={colors.textSecondary} />
                <Text style={[styles.editExerciseLabel, { color: colors.textSecondary }]}>
                  {t('common.edit')}
                </Text>
              </Pressable>
            )}
          </ScrollView>

          {infoExercise && (
            <ExerciseDetailModal
              exercise={infoExercise}
              onClose={() => setInfoExercise(null)}
            />
          )}

          <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.save')}
              onPress={handleSave}
              style={({ pressed }) => [
                shape.primaryButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Ionicons name="checkmark" size={20} color={colors.onPrimary} />
              <Text style={[typography.button, { color: colors.onPrimary }]}>{t('common.save')}</Text>
            </Pressable>
          </View>
        </>
      )}

      <LoadingOverlay visible={!loaded} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
    paddingBottom: 12,
  },
  editExerciseButton: {
    marginTop: 14,
  },
  editExerciseLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: hairline,
  },
});
