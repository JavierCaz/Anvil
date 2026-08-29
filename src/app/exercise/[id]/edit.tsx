import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { ExerciseForm } from '@/components/ExerciseForm';
import { Screen } from '@/components/Screen';
import { deleteExercise, getExerciseById, updateExercise } from '@/db/exercises';
import type { Exercise } from '@/db/types';
import { useAppTheme } from '@/theme/app-theme-provider';

export default function EditExerciseScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const exerciseId = Number(id);

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void getExerciseById(db, exerciseId).then((row) => {
      if (active) {
        // Catalog exercises are read-only — only custom ones can be edited.
        setExercise(row?.source === 'custom' ? row : null);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, [db, exerciseId]);

  const handleSave = (input: {
    name: string;
    muscleGroup: string | null;
    equipment: string | null;
    exerciseType: string | null;
  }) => {
    void updateExercise(db, exerciseId, input).then(() => {
      router.back();
    });
  };

  const confirmDelete = () => {
    Alert.alert(
      t('exercises.form.deleteTitle'),
      t('exercises.form.deleteMessage', { name: exercise?.name ?? '' }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            void deleteExercise(db, exerciseId).then(() => {
              router.back();
            });
          },
        },
      ]
    );
  };

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: true, title: t('exercises.form.editTitle') }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {loaded && exercise && (
          <>
            <ExerciseForm
              initialName={exercise.name}
              initialMuscleGroup={exercise.primary_muscle}
              initialEquipment={exercise.equipment ?? ''}
              initialExerciseType={exercise.exercise_type ?? 'weight_reps'}
              submitLabel={t('common.save')}
              onSave={handleSave}
            />
            <Pressable accessibilityRole="button" onPress={confirmDelete} style={styles.deleteButton}>
              <Text style={[styles.deleteLabel, { color: colors.error }]}>{t('common.delete')}</Text>
            </Pressable>
          </>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  deleteLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
