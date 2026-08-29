import { Stack, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { RoutineForm } from '@/components/RoutineForm';
import { Screen } from '@/components/Screen';
import { createRoutine } from '@/db/routines';

export default function NewRoutineScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { t } = useTranslation();

  const handleSave = (name: string, description: string) => {
    void createRoutine(db, { name, description }).then(() => {
      router.back();
    });
  };

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: true, title: t('routines.form.newTitle') }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <RoutineForm submitLabel={t('common.save')} onSave={handleSave} />
      </KeyboardAvoidingView>
    </Screen>
  );
}
