import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import type { NativeStackNavigationProp } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import Sortable, { type SortableGridRenderItem } from 'react-native-sortables';
import { AchievementBadge } from '@/components/AchievementBadge';
import { DangerButton } from '@/components/DangerButton';
import { ExerciseThumbnail } from '@/components/ExerciseThumbnail';
import { HeroGlow } from '@/components/HeroGlow';
import { ProgressRing } from '@/components/ProgressRing';
import { Screen } from '@/components/Screen';
import { useDialog } from '@/components/AppDialog';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { RestTimer, RestTimerAlarm } from '@/components/RestTimer';
import { RoutineHeaderTitle } from '@/components/RoutineHeaderTitle';
import { formatElapsed, useElapsedSeconds } from '@/components/WorkoutElapsed';
import { WorkoutRecapModal } from '@/components/WorkoutRecap';
import { WorkoutTimerAlarm, WorkoutToolsButton, WorkoutToolsSheet } from '@/components/WorkoutTools';
import { getWorkoutRecap, type WorkoutRecap } from '@/db/gamification';
import { getExercisesAchievements, reconcileExerciseAchievements } from '@/db/achievements';
import type { AchievementDefinition } from '@/constants/achievements';
import { useWeeklyGoalStore } from '@/store/workout-goals';
import { useWorkoutToolsStore } from '@/store/workout-tools';
import {
  cancelWorkout,
  completeWorkout,
  getActiveWorkoutExercises,
  getRoutineSetValueChanges,
  getWorkoutLog,
  getWorkoutOrderDiffersFromRoutine,
  getWorkoutRoutineIdentity,
  setWorkoutExerciseOrder,
  syncRoutineOrderFromWorkout,
  syncRoutineSetCountFromWorkout,
  syncRoutineSetValuesFromWorkout,
  wasWorkoutSetsEdited,
} from '@/db/workouts';
import type { ActiveWorkoutExercise } from '@/db/types';
import { useFocusQuery } from '@/hooks/use-focus-query';
import { useAppTheme } from '@/theme/app-theme-provider';
import { withAlpha } from '@/theme/colors';
import { hairline, radius, shape, typography } from '@/theme/tokens';

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

  const [recap, setRecap] = useState<WorkoutRecap | null>(null);
  const [toolsOpen, setToolsOpen] = useState(false);
  // The animated scroll container that hosts the sortable grid; passed to
  // Sortable.Grid so dragging auto-scrolls near the screen edges.
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();

  // The timer/stopwatch tools are scoped to this session — clear them once the
  // session screen goes away (finished, discarded or otherwise left).
  useEffect(() => {
    return () => useWorkoutToolsStore.getState().resetAll();
  }, []);

  const { data, loaded, setData } = useFocusQuery(
    async (queryDb) => {
      const [logRow, routine, exerciseRows] = await Promise.all([
        getWorkoutLog(queryDb, logId),
        getWorkoutRoutineIdentity(queryDb, logId),
        getActiveWorkoutExercises(queryDb, logId),
      ]);
      const achievements = await getExercisesAchievements(
        queryDb,
        exerciseRows.map((exercise) => exercise.exercise_id)
      );
      return {
        log: logRow,
        routineName: routine.name ?? '',
        routineIcon: routine.icon,
        exercises: exerciseRows,
        exerciseAchievements: achievements,
      };
    },
    [logId],
    { refetchOnFocus: true }
  );
  const log = data?.log ?? null;
  const routineName = data?.routineName ?? '';
  const routineIcon = data?.routineIcon ?? null;
  const exercises = data?.exercises ?? [];
  const exerciseAchievements = useMemo(
    () => data?.exerciseAchievements ?? new Map<number, AchievementDefinition[]>(),
    [data]
  );

  const elapsedSeconds = useElapsedSeconds(log?.started_at);
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
            void cancelWorkout(db, logId).then(async (exerciseIds) => {
              // Revoke achievements (weight comparatives, distance) unlocked by
              // the discarded session's sets — a discarded workout never counts.
              await Promise.all(
                exerciseIds.map((exerciseId) => reconcileExerciseAchievements(db, exerciseId))
              );
              // The session row is gone — let the pop below pass the guard.
              allowLeaveRef.current = true;
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
    setData((current) => (current ? { ...current, exercises: next } : current));
    void setWorkoutExerciseOrder(
      db,
      logId,
      next.map((exercise) => exercise.routine_exercise_id)
    );
  }, [db, logId, setData]);

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
              backgroundColor: done ? withAlpha(colors.success, 0.07) : colors.surface,
              borderColor: done ? withAlpha(colors.success, 0.45) : colors.border,
            },
          ]}
          onTap={() => router.push(`/workout/${logId}/exercise/${item.exercise_id}`)}
        >
          <ExerciseThumbnail slug={item.exercise_slug} size={52} borderRadius={radius.md} />
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
                  <AchievementBadge key={achievement.key} achievementKey={achievement.key} size={20} />
                ))}
                {achievements.length > 5 && (
                  <Text style={[styles.achievementMore, { color: colors.textSecondary }]}>
                    +{achievements.length - 5}
                  </Text>
                )}
              </View>
            )}
          </View>
          {done ? (
            <View style={[styles.doneCheck, { backgroundColor: colors.success }]}>
              <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
            </View>
          ) : (
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          )}
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
          headerTitle: () => <RoutineHeaderTitle name={routineName} icon={routineIcon} />,
          headerRight: () => (
            <View style={styles.headerActions}>
              <WorkoutToolsButton onPress={() => setToolsOpen(true)} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('workout.cancelWorkout')}
                hitSlop={8}
                onPress={handleCancel}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>
          ),
        }}
      />

      {loaded && (
        <>
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
              <HeroGlow color={colors.primary} />
              <View style={styles.timerCopy}>
                <Text style={[typography.overline, { color: colors.primary }]}>
                  {t('workout.elapsed')}
                </Text>
                <Text style={[styles.timerValue, { color: colors.text }]}>
                  {formatElapsed(elapsedSeconds)}
                </Text>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                  {t('workout.exercisesDone', { done: doneCount, total: exercises.length })}
                </Text>
              </View>
              <ProgressRing
                progress={exercises.length > 0 ? doneCount / exercises.length : 0}
                size={78}
                strokeWidth={7}
              >
                <Text style={[styles.ringValue, { color: colors.text }]}>
                  {doneCount}
                  <Text style={{ color: colors.textSecondary }}>/{exercises.length}</Text>
                </Text>
              </ProgressRing>
            </View>

            {exercises.length === 0 ? (
              <View style={styles.empty}>
                <View style={[shape.iconWell, styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
                  <Ionicons name="fitness" size={34} color={colors.primary} />
                </View>
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

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <RestTimer />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('workout.finishWorkout')}
              onPress={handleFinish}
              style={({ pressed }) => [
                shape.primaryButton,
                styles.finishButton,
                { backgroundColor: colors.primary, shadowColor: colors.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Ionicons name="flag" size={18} color={colors.onPrimary} />
              <Text style={[typography.button, { color: colors.onPrimary }]}>
                {t('workout.finishWorkout')}
              </Text>
            </Pressable>
            <DangerButton label={t('workout.discardWorkout')} onPress={handleCancel} />
          </View>
        </>
      )}

      <LoadingOverlay visible={!loaded} />

      <WorkoutTimerAlarm />
      <RestTimerAlarm />
      <WorkoutToolsSheet visible={toolsOpen} onClose={() => setToolsOpen(false)} />

      {recap && <WorkoutRecapModal recap={recap} onClose={handleRecapClose} />}
    </Screen>
  );
}


const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  timerCard: {
    borderRadius: radius.xl,
    borderWidth: hairline,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
    overflow: 'hidden',
  },
  timerCopy: {
    flex: 1,
    gap: 2,
  },
  timerValue: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1.2,
    fontVariant: ['tabular-nums'],
  },
  progressText: {
    ...typography.caption,
  },
  ringValue: {
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  row: {
    ...shape.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    ...typography.rowTitle,
  },
  rowMeta: {
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  doneCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
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
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    marginBottom: 6,
  },
  emptyTitle: {
    ...typography.heading,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 10,
    borderTopWidth: hairline,
  },
  finishButton: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 4,
  },
});
