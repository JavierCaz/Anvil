import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { RoutineForm } from '@/components/RoutineForm';
import { Screen } from '@/components/Screen';
import { useDialog } from '@/components/AppDialog';
import { deleteRoutine, getRoutine, updateRoutine } from '@/db/routines';
import { useFocusQuery } from '@/hooks/use-focus-query';
import { useAppTheme } from '@/theme/app-theme-provider';

export default function EditRoutineScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dialog = useDialog();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routineId = Number(id);

  const { data: routine, loaded } = useFocusQuery(
    (db) => getRoutine(db, routineId),
    [routineId],
    { refetchOnFocus: false }
  );

  const handleSave = (name: string, description: string) => {
    void updateRoutine(db, routineId, { name, description }).then(() => {
      router.back();
    });
  };

  const confirmDelete = () => {
    dialog.alert({
      title: t('routines.deleteConfirmTitle'),
      message: t('routines.deleteConfirmMessage', { name: routine?.name ?? '' }),
      icon: 'trash-outline',
      tone: 'error',
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            void deleteRoutine(db, routineId).then(() => {
              router.dismissTo('/routines');
            });
          },
        },
      ],
    });
  };

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: true, title: t('routines.form.editTitle') }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {loaded && routine && (
          <>
            <RoutineForm
              initialName={routine.name}
              initialDescription={routine.description ?? ''}
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
