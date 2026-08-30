import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ExerciseSetEditor, type SetEditorItem } from '@/components/ExerciseSetEditor';
import { Screen } from '@/components/Screen';
import { useDialog } from '@/components/AppDialog';
import {
  getRoutineExercise,
  getRoutineExerciseSets,
  removeExerciseFromRoutine,
  saveRoutineExerciseSets,
} from '@/db/routines';
import type { RoutineExerciseWithExercise } from '@/db/types';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import { displayToKg, kgToDisplay } from '@/utils/weight';

interface SetDraft {
  weight: string;
  reps: string;
  restSeconds: number;
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

  const [exercise, setExercise] = useState<RoutineExerciseWithExercise | null>(null);
  const [sets, setSets] = useState<SetDraft[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all([
      getRoutineExercise(db, routineExerciseId),
      getRoutineExerciseSets(db, routineExerciseId),
    ]).then(([exerciseRow, setRows]) => {
      if (!active) {
        return;
      }
      setExercise(exerciseRow);
      setSets(
        setRows.map((row) => ({
          weight: row.weight && row.weight > 0 ? String(kgToDisplay(row.weight, unit)) : '',
          reps: String(row.reps),
          restSeconds: row.rest_seconds,
        }))
      );
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [db, routineExerciseId, unit]);

  const setItems: SetEditorItem[] = sets.map((set, index) => ({
    setNumber: index + 1,
    weight: set.weight,
    reps: set.reps,
    restSeconds: set.restSeconds,
  }));

  const updateSet = (index: number, patch: Partial<SetDraft>) => {
    setSets((current) => current.map((set, i) => (i === index ? { ...set, ...patch } : set)));
  };

  const handleAddSet = () => {
    setSets((current) => {
      if (current.length >= MAX_SETS) {
        return current;
      }
      const template = current[0] ?? { weight: '', reps: '10', restSeconds: 90 };
      return [...current, { ...template }];
    });
  };

  const handleRemoveSet = (setNumber: number) => {
    setSets((current) => (current.length > 1 ? current.filter((_, i) => i !== setNumber - 1) : current));
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
      sets.map((set, index) => ({
        setNumber: index + 1,
        reps: Math.max(1, Math.round(parseNumber(set.reps) || 1)),
        restSeconds: set.restSeconds,
        weight: parseNumber(set.weight) ? displayToKg(parseNumber(set.weight), unit) : null,
      }))
    ).then(() => {
      router.back();
    });
  };

  const confirmRemoveFromRoutine = () => {
    dialog.alert({
      title: t('routines.deleteConfirmTitle'),
      message: t('routines.detail.removeExercise'),
      icon: 'trash-outline',
      tone: 'error',
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            void removeExerciseFromRoutine(db, routineExerciseId).then(() => {
              router.back();
            });
          },
        },
      ],
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
              mode="routine"
              exerciseName={exercise.exercise_name}
              slug={exercise.exercise_slug}
              sets={setItems}
              fallbackReps={10}
              onWeightChange={(number, value) => updateSet(number - 1, { weight: value })}
              onRepsChange={(number, value) => updateSet(number - 1, { reps: value })}
              onRestChange={(number, seconds) => updateSet(number - 1, { restSeconds: seconds })}
              onAddSet={handleAddSet}
              onRemoveSet={handleRemoveSet}
              onApplyToAll={handleApplyToAll}
            />

            <Pressable
              accessibilityRole="button"
              onPress={confirmRemoveFromRoutine}
              style={({ pressed }) => [styles.removeRow, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Ionicons name="remove-circle-outline" size={18} color={colors.error} />
              <Text style={[styles.removeLabel, { color: colors.error }]}>
                {t('routines.detail.removeExercise')}
              </Text>
            </Pressable>

            {exercise.exercise_source === 'custom' && (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push(`/exercise/${exercise.exercise_id}/edit`)}
                style={({ pressed }) => [styles.removeRow, { opacity: pressed ? 0.6 : 1 }]}
              >
                <Ionicons name="pencil" size={16} color={colors.textSecondary} />
                <Text style={[styles.editExerciseLabel, { color: colors.textSecondary }]}>
                  {t('common.edit')}
                </Text>
              </Pressable>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.save')}
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={styles.saveLabel}>{t('common.save')}</Text>
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
  removeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 4,
  },
  removeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  editExerciseLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  saveButton: {
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 15,
  },
  saveLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
