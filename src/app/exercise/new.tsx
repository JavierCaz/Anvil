import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { ExerciseForm } from '@/components/ExerciseForm';
import { Screen } from '@/components/Screen';
import { createExercise } from '@/db/exercises';
import { addExerciseToRoutine } from '@/db/routines';

export default function NewExerciseScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { t } = useTranslation();
  const { name, routineId } = useLocalSearchParams<{ name?: string; routineId?: string }>();

  const handleSave = (input: {
    name: string;
    muscleGroup: string | null;
    equipment: string | null;
    exerciseType: string | null;
  }) => {
    void createExercise(db, input).then((exerciseId) => {
      if (routineId) {
        // Picked from the add-exercise flow: link it and jump back to the routine.
        void addExerciseToRoutine(db, Number(routineId), exerciseId).then(() => {
          router.dismissTo(`/routine/${routineId}`);
        });
      } else {
        router.back();
      }
    });
  };

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: true, title: t('exercises.form.newTitle') }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ExerciseForm initialName={name ?? ''} submitLabel={t('common.save')} onSave={handleSave} />
      </KeyboardAvoidingView>
    </Screen>
  );
}
