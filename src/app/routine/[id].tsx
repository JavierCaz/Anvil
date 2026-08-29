import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ExerciseThumbnail } from '@/components/ExerciseThumbnail';
import { Screen } from '@/components/Screen';
import { muscleI18nKey } from '@/constants/exercises';
import { getRoutine, getRoutineExercises, moveRoutineExercise } from '@/db/routines';
import type { Routine, RoutineExerciseWithExercise } from '@/db/types';
import { startWorkout } from '@/db/workouts';
import { useAppTheme } from '@/theme/app-theme-provider';

export default function RoutineDetailScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routineId = Number(id);

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exercises, setExercises] = useState<RoutineExerciseWithExercise[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void Promise.all([getRoutine(db, routineId), getRoutineExercises(db, routineId)]).then(
        ([routineRow, exerciseRows]) => {
          if (active) {
            setRoutine(routineRow);
            setExercises(exerciseRows);
          }
        }
      );
      return () => {
        active = false;
      };
    }, [db, routineId])
  );

  const reload = () => {
    void getRoutineExercises(db, routineId).then(setExercises);
  };

  const handleMove = (item: RoutineExerciseWithExercise, direction: 'up' | 'down') => {
    void moveRoutineExercise(db, routineId, item.id, direction).then((moved) => {
      if (moved) {
        reload();
      }
    });
  };

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: routine?.name ?? '',
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('routines.detail.editRoutine')}
              hitSlop={8}
              onPress={() => router.push(`/routine/${routineId}/edit`)}
            >
              <Ionicons name="pencil" size={20} color={colors.primary} />
            </Pressable>
          ),
        }}
      />

      {routine?.description ? (
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {routine.description}
        </Text>
      ) : null}

      <View style={styles.startWrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('workout.startWorkout')}
          disabled={exercises.length === 0}
          onPress={() => {
            void startWorkout(db, routineId).then((logId) => {
              router.push(`/workout/${logId}`);
            });
          }}
          style={({ pressed }) => [
            styles.startButton,
            {
              backgroundColor: exercises.length === 0 ? colors.border : colors.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name="play" size={18} color="#FFFFFF" />
          <Text style={styles.startLabel}>{t('workout.startWorkout')}</Text>
        </Pressable>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.listContent,
          exercises.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="fitness-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('routines.detail.emptyTitle')}
            </Text>
            <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
              {t('routines.detail.emptyHint')}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const muscleKey = muscleI18nKey(item.exercise_primary_muscle);
          const firstReps = item.first_set_reps ?? item.reps;
          const firstRest = item.first_set_rest ?? item.rest_seconds;
          return (
            <View
              style={[
                styles.row,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                style={styles.rowMain}
                onPress={() => router.push(`/routine/${routineId}/exercise/${item.id}`)}
              >
                <ExerciseThumbnail slug={item.exercise_slug} />
                <View style={styles.rowBody}>
                  <View style={styles.rowTitleLine}>
                    <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={1}>
                      {item.exercise_name}
                    </Text>
                    {item.exercise_source === 'custom' && (
                      <View style={[styles.badge, { backgroundColor: colors.background }]}>
                        <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                          {t('routines.detail.customBadge')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                    {muscleKey ? t(muscleKey) : ''}
                    {item.exercise_equipment ? ` · ${item.exercise_equipment}` : ''}
                  </Text>
                  <Text style={[styles.rowMeta, { color: colors.primary }]}>
                    {t('routines.detail.targetSets')}: {item.sets} ·{' '}
                    {t('routines.detail.targetReps')}: {firstReps} ·{' '}
                    {t('routines.detail.targetRest')}: {firstRest}s
                  </Text>
                </View>
              </Pressable>

              <View style={styles.rowActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('common.moveUp')}
                  hitSlop={6}
                  disabled={index === 0}
                  onPress={() => handleMove(item, 'up')}
                >
                  <Ionicons
                    name="chevron-up"
                    size={20}
                    color={index === 0 ? colors.border : colors.textSecondary}
                  />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('common.moveDown')}
                  hitSlop={6}
                  disabled={index === exercises.length - 1}
                  onPress={() => handleMove(item, 'down')}
                >
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={
                      index === exercises.length - 1 ? colors.border : colors.textSecondary
                    }
                  />
                </Pressable>
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/routine/${routineId}/add-exercise`)}
            style={({ pressed }) => [
              styles.addButton,
              {
                borderColor: colors.primary,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="add" size={20} color={colors.primary} />
            <Text style={[styles.addLabel, { color: colors.primary }]}>
              {t('routines.detail.addExercise')}
            </Text>
          </Pressable>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 13,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  startWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
  },
  startLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  rowSubtitle: {
    fontSize: 12,
  },
  rowMeta: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  rowActions: {
    justifyContent: 'center',
    gap: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 4,
  },
  addLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
});
