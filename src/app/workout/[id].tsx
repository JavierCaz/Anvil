import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import type { NativeStackNavigationProp } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import Sortable, { type SortableGridRenderItem } from 'react-native-sortables';
import { ExerciseThumbnail } from '@/components/ExerciseThumbnail';
import { Screen } from '@/components/Screen';
import { useDialog } from '@/components/AppDialog';
import { WorkoutRecapModal } from '@/components/WorkoutRecap';
import { getWorkoutRecap, type WorkoutRecap } from '@/db/gamification';
import { getExercisesAchievements, reconcileExerciseAchievements } from '@/db/achievements';
import type { AchievementDefinition } from '@/constants/achievements';
import { useWeeklyGoalStore } from '@/store/workout-goals';
import {
  cancelWorkout,
  completeWorkout,
  getActiveWorkoutExercises,
  getRoutineSetValueChanges,
  getWorkoutLog,
  getWorkoutOrderDiffersFromRoutine,
  getWorkoutRoutineName,
  setWorkoutExerciseOrder,
  syncRoutineOrderFromWorkout,
  syncRoutineSetCountFromWorkout,
  syncRoutineSetValuesFromWorkout,
  wasWorkoutSetsEdited,
} from '@/db/workouts';
import type { ActiveWorkoutExercise, WorkoutLog } from '@/db/types';
import { useAppTheme } from '@/theme/app-theme-provider';

function formatStopwatch(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':');
}

export default function WorkoutSessionScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dialog = useDialog();
  const navigation = useNavigation<NativeStackNavigationProp<ReactNavigation.RootParamList>>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const logId = Number(id);

  // When an internal finish/discard flow has already resolved the session, the
  // back-prevention guard must let the resulting navigation through.
  const allowLeaveRef = useRef(false);

  const [log, setLog] = useState<WorkoutLog | null>(null);
  const [routineName, setRoutineName] = useState('');
  const [exercises, setExercises] = useState<ActiveWorkoutExercise[]>([]);
  const [exerciseAchievements, setExerciseAchievements] = useState<Map<number, AchievementDefinition[]>>(new Map());
  const [now, setNow] = useState(() => Date.now());
  const [recap, setRecap] = useState<WorkoutRecap | null>(null);
  // The animated scroll container that hosts the sortable grid; passed to
  // Sortable.Grid so dragging auto-scrolls near the screen edges.
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();
  // Live stopwatch tick — elapsed is derived from `started_at`, so it stays
  // accurate even if the screen was backgrounded.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void Promise.all([
        getWorkoutLog(db, logId),
        getWorkoutRoutineName(db, logId),
        getActiveWorkoutExercises(db, logId),
      ]).then(([logRow, name, exerciseRows]) => {
        if (active) {
          setLog(logRow);
          setRoutineName(name ?? '');
          setExercises(exerciseRows);
        }
        return getExercisesAchievements(
          db,
          exerciseRows.map((exercise) => exercise.exercise_id)
        ).then((achievements) => {
          if (active) {
            setExerciseAchievements(achievements);
          }
        });
      });
      return () => {
        active = false;
      };
    }, [db, logId])
  );

  const elapsedSeconds = log ? Math.max(0, dayjs(now).diff(dayjs(log.started_at), 'second')) : 0;
  const doneCount = exercises.filter((e) => e.completed_sets >= e.target_sets).length;

  const backHref = log?.routine_id ? (`/routine/${log.routine_id}` as const) : ('/routines' as const);

  const handleCancel = () => {
    dialog.alert({
      title: t('workout.cancelConfirmTitle'),
      message: t('workout.cancelConfirmMessage'),
      icon: 'exit-outline',
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            void cancelWorkout(db, logId).then(() => {
              // The session row is gone — let the pop below pass the guard.
              allowLeaveRef.current = true;
              // Revoke weight comparatives unlocked by the discarded session's
              // sets (a discarded workout never counts).
              const ids = exercises.map((exercise) => exercise.exercise_id);
              void Promise.all(
                ids.map((exerciseId) => reconcileExerciseAchievements(db, exerciseId))
              );
              router.dismissTo(backHref);
            });
          },
        },
      ],
    });
  };

  // Session-only exercise reordering. Every reorder (drag-end) persists the
  // full ordered list of routine_exercise_ids to workout_logs.exercise_order
  // — never to the routine — then mirrors it into local state so the UI
  // follows immediately.
  const applySessionOrder = useCallback((next: ActiveWorkoutExercise[]) => {
    setExercises(next);
    void setWorkoutExerciseOrder(
      db,
      logId,
      next.map((exercise) => exercise.routine_exercise_id)
    );
  }, [db, logId]);

  const handleDragEnd = useCallback((data: ActiveWorkoutExercise[]) => {
    applySessionOrder(data);
  }, [applySessionOrder]);

  const keyExtractor = useCallback(
    (item: ActiveWorkoutExercise) => String(item.routine_exercise_id),
    []
  );

  const renderItem = useCallback<SortableGridRenderItem<ActiveWorkoutExercise>>(
    ({ item }) => {
      const done = item.completed_sets >= item.target_sets;
      const achievements = exerciseAchievements.get(item.exercise_id) ?? [];
      return (
        <Sortable.Touchable
          accessibilityRole="button"
          style={[
            styles.row,
            {
              backgroundColor: colors.surface,
              borderColor: done ? colors.success : colors.border,
            },
          ]}
          onTap={() => router.push(`/workout/${logId}/exercise/${item.exercise_id}`)}
        >
          <ExerciseThumbnail slug={item.exercise_slug} />
          <View style={styles.rowBody}>
            <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={1}>
              {item.exercise_name}
            </Text>
            <Text style={[styles.rowMeta, { color: colors.textSecondary }]}>
              {t('workout.setsDone', { done: item.completed_sets, total: item.target_sets })}
            </Text>
            {achievements.length > 0 && (
              <View style={styles.achievementRow}>
                {achievements.slice(0, 5).map((achievement) => (
                  <Text key={achievement.key} style={styles.achievementIcon}>
                    {achievement.icon}
                  </Text>
                ))}
                {achievements.length > 5 && (
                  <Text style={[styles.achievementMore, { color: colors.textSecondary }]}>
                    +{achievements.length - 5}
                  </Text>
                )}
              </View>
            )}
          </View>
          <Ionicons
            name={done ? 'checkmark-circle' : 'chevron-forward'}
            size={22}
            color={done ? colors.success : colors.textSecondary}
          />
        </Sortable.Touchable>
      );
    },
    [colors, t, router, logId, exerciseAchievements]
  );

  const completeAndSummarize = () => {
    void completeWorkout(db, logId).then(async (completed) => {
      // Only analyze once — a double-finish must not re-insert PRs.
      if (!completed) {
        return;
      }
      // The session is finished — allow the exit navigation through the guard.
      allowLeaveRef.current = true;
      const weeklyGoal = useWeeklyGoalStore.getState().weeklyWorkouts;
      const recapData = await getWorkoutRecap(db, logId, weeklyGoal);
      setRecap(recapData);
    });
  };

  const handleRecapClose = () => {
    setRecap(null);
    allowLeaveRef.current = true;
    router.dismissTo(backHref);
  };

  const finish = () => {
    void Promise.all([
      wasWorkoutSetsEdited(db, logId),
      getRoutineSetValueChanges(db, logId),
      getWorkoutOrderDiffersFromRoutine(db, logId),
    ]).then(([edited, valueChanges, orderChanged]) => {
      const hasCountChange = edited;
      const hasValueChange = valueChanges.length > 0;
      const hasOrderChange = orderChanged;
      if (!hasCountChange && !hasValueChange && !hasOrderChange) {
        completeAndSummarize();
        return;
      }

      // Pick copy that covers what changed. The order-only case has its own
      // wording; anything touching set count reuses the generic title, and
      // set-value changes keep the "defaults" framing.
      const title =
        hasOrderChange && !hasCountChange && !hasValueChange
          ? t('workout.saveOrderTitle')
          : hasCountChange && !hasValueChange
            ? t('workout.saveChangesTitle')
            : t('workout.updateDefaultsTitle');
      const message =
        hasOrderChange && hasCountChange && hasValueChange
          ? t('workout.saveOrderAllMessage')
          : hasOrderChange && hasCountChange
            ? t('workout.saveOrderAndChangesMessage')
            : hasOrderChange && hasValueChange
              ? t('workout.saveOrderAndValuesMessage')
              : hasOrderChange
                ? t('workout.saveOrderMessage')
                : hasCountChange && hasValueChange
                  ? t('workout.saveChangesAndValuesMessage')
                  : hasValueChange
                    ? t('workout.updateDefaultsMessage', {
                        exercises: valueChanges.map((change) => change.exercise_name).join(', '),
                      })
                    : t('workout.saveChangesMessage');

      dialog.alert({
        title,
        message,
        buttons: [
          { text: t('workout.keepRoutine'), style: 'cancel', onPress: completeAndSummarize },
          {
            text: t('workout.saveToRoutine'),
            onPress: () => {
              void saveRoutineChanges().then(completeAndSummarize);
            },
          },
        ],
      });
    });
  };

  // Apply the routine-facing changes the user confirmed: sync the exercise
  // order, then the set count (it can add/remove plan rows), then overlay the
  // logged set values.
  const saveRoutineChanges = async () => {
    const [edited, valueChanges, orderChanged] = await Promise.all([
      wasWorkoutSetsEdited(db, logId),
      getRoutineSetValueChanges(db, logId),
      getWorkoutOrderDiffersFromRoutine(db, logId),
    ]);
    if (orderChanged) {
      await syncRoutineOrderFromWorkout(db, logId);
    }
    if (edited) {
      await syncRoutineSetCountFromWorkout(db, logId);
    }
    if (valueChanges.length > 0) {
      await syncRoutineSetValuesFromWorkout(db, logId);
    }
  };

  const handleFinish = () => {
    const incomplete = exercises.filter((e) => e.completed_sets < e.target_sets).length;
    if (incomplete > 0) {
      dialog.alert({
        title: t('workout.finishEarlyConfirmTitle'),
        message: t('workout.finishEarlyConfirmMessage', { count: incomplete }),
        icon: 'warning-outline',
        tone: 'warning',
        buttons: [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('workout.finishWorkout'), style: 'destructive', onPress: finish },
        ],
      });
      return;
    }
    finish();
  };

  // The guard effect subscribes once with a lean dependency list; it reads the
  // latest handler closures through this ref instead of forcing a re-subscription
  // on every render.
  const exitHandlersRef = useRef({ handleCancel, handleFinish });
  useEffect(() => {
    exitHandlersRef.current = { handleCancel, handleFinish };
  });

  // While a session is live, leaving the screen (header back, Android
  // hardware back) must not silently abandon the workout — ask the user to
  // finish or discard it first. The native back button can't be intercepted
  // directly, so we listen for the stack's `beforeRemove` event, which fires
  // for every removal action (back button, hardware back, programmatic pop).
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (allowLeaveRef.current || !log) {
        return;
      }

      event.preventDefault();
      const { handleCancel: cancelSession, handleFinish: finishSession } = exitHandlersRef.current;
      dialog.alert({
        title: t('workout.leaveWorkoutTitle'),
        message: t('workout.leaveWorkoutMessage'),
        icon: 'warning-outline',
        tone: 'warning',
        buttons: [
          { text: t('workout.keepWorkingOut'), style: 'cancel' },
          { text: t('workout.finishWorkout'), onPress: finishSession },
          { text: t('workout.discardWorkout'), style: 'destructive', onPress: cancelSession },
        ],
      });
    });
    return unsubscribe;
  }, [navigation, dialog, log, t]);

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          gestureEnabled: false,
          title: routineName,
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('workout.cancelWorkout')}
              hitSlop={8}
              onPress={handleCancel}
            >
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          ),
        }}
      />

      <Animated.ScrollView
        ref={scrollableRef}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.timerCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>
            {t('workout.elapsed')}
          </Text>
          <Text style={[styles.timerValue, { color: colors.text }]}>
            {formatStopwatch(elapsedSeconds)}
          </Text>
          <View style={[styles.progressRow, { backgroundColor: colors.background }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${exercises.length > 0 ? (doneCount / exercises.length) * 100 : 0}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {t('workout.exercisesDone', { done: doneCount, total: exercises.length })}
          </Text>
        </View>

        {exercises.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="fitness-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('routines.detail.emptyTitle')}
            </Text>
          </View>
        ) : (
          <Sortable.Grid
            columns={1}
            data={exercises}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            rowGap={12}
            scrollableRef={scrollableRef}
            onDragEnd={({ data }) => handleDragEnd(data)}
          />
        )}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('workout.finishWorkout')}
          onPress={handleFinish}
          style={({ pressed }) => [
            styles.finishButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          <Text style={styles.finishLabel}>{t('workout.finishWorkout')}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('workout.discardWorkout')}
          onPress={handleCancel}
          style={({ pressed }) => [
            styles.discardButton,
            { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Ionicons name="trash-outline" size={18} color={colors.error} />
          <Text style={[styles.discardLabel, { color: colors.error }]}>
            {t('workout.discardWorkout')}
          </Text>
        </Pressable>
      </View>

      {recap && <WorkoutRecapModal recap={recap} onClose={handleRecapClose} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
    gap: 12,
  },
  timerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  timerLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timerValue: {
    fontSize: 40,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  progressRow: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  rowMeta: {
    fontSize: 12,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  achievementIcon: {
    fontSize: 15,
  },
  achievementMore: {
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 15,
  },
  finishLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  discardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
  },
  discardLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
