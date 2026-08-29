import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { deleteRoutine, getRoutines } from '@/db/routines';
import type { RoutineWithCount } from '@/db/types';
import { useAppTheme } from '@/theme/app-theme-provider';

export default function RoutinesScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const [routines, setRoutines] = useState<RoutineWithCount[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void getRoutines(db).then((rows) => {
        if (active) {
          setRoutines(rows);
        }
      });
      return () => {
        active = false;
      };
    }, [db])
  );

  const confirmDelete = (routine: RoutineWithCount) => {
    Alert.alert(
      t('routines.deleteConfirmTitle'),
      t('routines.deleteConfirmMessage', { name: routine.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            void deleteRoutine(db, routine.id).then(() => {
              setRoutines((current) => current.filter((item) => item.id !== routine.id));
            });
          },
        },
      ]
    );
  };

  const showActions = (routine: RoutineWithCount) => {
    Alert.alert(routine.name, undefined, [
      {
        text: t('common.edit'),
        onPress: () => router.push(`/routine/${routine.id}/edit`),
      },
      { text: t('common.delete'), style: 'destructive', onPress: () => confirmDelete(routine) },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const openRoutine = (routine: RoutineWithCount) => {
    router.push(`/routine/${routine.id}`);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('tabs.routines')}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('routines.newRoutine')}
          hitSlop={8}
          onPress={() => router.push('/routine/new')}
          style={[styles.newButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={styles.newButtonLabel}>{t('routines.newRoutine')}</Text>
        </Pressable>
      </View>

      <FlatList
        data={routines}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.listContent,
          routines.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="barbell-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('routines.emptyTitle')}
            </Text>
            <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
              {t('routines.emptyHint')}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => openRoutine(item)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              {item.description ? (
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.description}
                </Text>
              ) : null}
              <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
                {t('routines.exerciseCount', { count: item.exercise_count })}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.edit')}
              hitSlop={8}
              onPress={() => showActions(item)}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
            </Pressable>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  newButtonLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 13,
  },
  cardMeta: {
    fontSize: 12,
    marginTop: 2,
  },
});
