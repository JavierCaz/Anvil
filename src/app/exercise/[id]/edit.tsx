import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ExerciseForm } from '@/components/ExerciseForm';
import { DangerButton } from '@/components/DangerButton';
import { Screen } from '@/components/Screen';
import { useDialog } from '@/components/AppDialog';
import { deleteExercise, getExerciseById, updateExercise } from '@/db/exercises';
import { useFocusQuery } from '@/hooks/use-focus-query';

export default function EditExerciseScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { t } = useTranslation();
  const dialog = useDialog();
  const { id } = useLocalSearchParams<{ id: string }>();
  const exerciseId = Number(id);

  const { data: exercise, loaded } = useFocusQuery(
    async (db) => {
      const row = await getExerciseById(db, exerciseId);
      // Catalog exercises are read-only — only custom ones can be edited.
      return row?.source === 'custom' ? row : null;
    },
    [exerciseId],
    { refetchOnFocus: false }
  );

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
    dialog.alert({
      title: t('exercises.form.deleteTitle'),
      message: t('exercises.form.deleteMessage', { name: exercise?.name ?? '' }),
      icon: 'trash-outline',
      tone: 'error',
      buttons: [
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
      ],
    });
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
            <DangerButton label={t('common.delete')} onPress={confirmDelete} style={styles.deleteButton} />
          </>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    marginHorizontal: 20,
  },
});
