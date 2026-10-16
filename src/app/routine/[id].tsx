import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import Sortable, {
  type SortableGridDragEndParams,
  type SortableGridRenderItem,
} from 'react-native-sortables';
import { ExerciseThumbnail } from '@/components/ExerciseThumbnail';
import { RoutineHeaderTitle } from '@/components/RoutineHeaderTitle';
import { Screen } from '@/components/Screen';
import { SwipeToDelete } from '@/components/SwipeToDelete';
import { useDialog } from '@/components/AppDialog';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { distanceScale, getExerciseMetrics } from '@/constants/exercise-metrics';
import { muscleI18nKey } from '@/constants/exercises';
import {
  getRoutine,
  getRoutineExercises,
  removeExerciseFromRoutine,
  reorderRoutineExercises,
} from '@/db/routines';
import type { RoutineExerciseWithExercise } from '@/db/types';
import { startWorkout } from '@/db/workouts';
import { useFocusQuery } from '@/hooks/use-focus-query';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import { hairline, radius, shape, typography } from '@/theme/tokens';
import { formatDistanceWithUnit } from '@/utils/distance';
import { formatDuration } from '@/utils/duration';
import { formatWeightWithUnit } from '@/utils/weight';
export default function RoutineDetailScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dialog = useDialog();
  const unit = useUnitsStore((state) => state.unitSystem);
  const { id } = useLocalSearchParams<{ id: string }>();
  const routineId = Number(id);

  const scrollableRef = useAnimatedRef<Animated.ScrollView>();

  const { data, loaded, reload, setData } = useFocusQuery(
    async (queryDb) => {
      const [routineRow, exerciseRows] = await Promise.all([
        getRoutine(queryDb, routineId),
        getRoutineExercises(queryDb, routineId),
      ]);
      return { routine: routineRow, exercises: exerciseRows };
    },
    [routineId],
    { refetchOnFocus: true }
  );
  const routine = data?.routine ?? null;
  const exercises = data?.exercises ?? [];

  const confirmRemoveExercise = useCallback((item: RoutineExerciseWithExercise) => {
    dialog.alert({
      title: t('routines.detail.removeExerciseConfirmTitle'),
      message: t('routines.detail.removeExerciseConfirmMessage', { name: item.exercise_name }),
      icon: 'trash-outline',
      tone: 'error',
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            void removeExerciseFromRoutine(db, item.id).then(() => {
              reload();
            });
          },
        },
      ],
    });
  }, [db, dialog, reload, t]);

  const handleDragEnd = useCallback(
    (params: SortableGridDragEndParams<RoutineExerciseWithExercise>) => {
      if (params.fromIndex === params.toIndex) {
        return;
      }
      setData((current) => (current ? { ...current, exercises: params.data } : current));
      void reorderRoutineExercises(
        db,
        routineId,
        params.data.map((item) => item.id)
      );
    },
    [db, routineId, setData]
  );

  const renderItem = useCallback<SortableGridRenderItem<RoutineExerciseWithExercise>>(
    ({ item }) => {
      const muscleKey = muscleI18nKey(item.exercise_primary_muscle);
      const firstReps = item.first_set_reps ?? item.reps;
      const firstRest = item.first_set_rest ?? item.rest_seconds;
      const metrics = getExerciseMetrics(item.exercise_type);
      const scale = distanceScale(item.exercise_type, item.exercise_slug, item.exercise_equipment);
      // The whole row is the drag surface: sortables activates a drag after a
      // ~200 ms hold and self-cancels on any quick movement, while the
      // SwipeToDelete pan (wrapped outside) only claims fast horizontal
      // swipes. Sortable.Touchable keeps a plain tap from being eaten by the
      // drag gesture.
      return (
        <SwipeToDelete onDelete={() => confirmRemoveExercise(item)}>
          <Sortable.Touchable
            accessibilityRole="button"
            style={[
              styles.row,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onTap={() => router.push(`/routine/${routineId}/exercise/${item.id}`)}
          >
            <ExerciseThumbnail slug={item.exercise_slug} size={56} borderRadius={radius.md} />
            <View style={styles.rowBody}>
              <View style={styles.rowTitleLine}>
                <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={1}>
                  {item.exercise_name}
                </Text>
                {item.exercise_source === 'custom' && (
                  <View style={[styles.badge, { borderColor: colors.border }]}>
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
              <View style={styles.chipRow}>
                {[
                  `${t('routines.detail.targetSets')} ${item.sets}`,
                  ...(metrics.duration
                    ? [
                        metrics.load && item.first_set_weight
                          ? `${t('routines.detail.targetLoad')} ${formatWeightWithUnit(item.first_set_weight, unit)}`
                          : null,
                        `${t('routines.detail.targetDuration')} ${formatDuration(item.first_set_duration ?? 0)}`,
                        metrics.distance && item.first_set_distance
                          ? `${t('routines.detail.targetDistance')} ${formatDistanceWithUnit(item.first_set_distance, unit, scale)}`
                          : null,
                        item.first_set_incline
                          ? `${t('routines.detail.targetIncline')} ${item.first_set_incline}%`
                          : null,
                        item.first_set_level
                          ? `${t('routines.detail.targetLevel')} ${item.first_set_level}`
                          : null,
                      ]
                    : [`${t('routines.detail.targetReps')} ${firstReps}`]),
                  `${t('routines.detail.targetRest')} ${firstRest}s`,
                ]
                  .filter((chip): chip is string => chip !== null)
                  .map((chip, index) => (
                    <View
                      key={chip}
                      style={[
                        styles.metaChip,
                        { backgroundColor: index === 0 ? colors.primarySoft : colors.surfaceElevated },
                      ]}
                    >
                      <Text
                        style={[
                          styles.metaChipText,
                          { color: index === 0 ? colors.primary : colors.textSecondary },
                        ]}
                      >
                        {chip}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </Sortable.Touchable>
        </SwipeToDelete>
      );
    },
    [colors, confirmRemoveExercise, router, routineId, t, unit]
  );

  const addExerciseButton = (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/routine/${routineId}/add-exercise`)}
      style={({ pressed }) => [
        styles.addButton,
        {
          borderColor: colors.primary,
          backgroundColor: pressed ? colors.primarySoft : 'transparent',
        },
      ]}
    >
      <Ionicons name="add" size={20} color={colors.primary} />
      <Text style={[styles.addLabel, { color: colors.primary }]}>
        {t('routines.detail.addExercise')}
      </Text>
    </Pressable>
  );

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: routine?.name ?? '',
          headerTitle: () => <RoutineHeaderTitle name={routine?.name ?? ''} icon={routine?.icon} />,
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

      {loaded && (
        <>
          <View style={styles.headerBlock}>
            {routine?.description ? (
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {routine.description}
              </Text>
            ) : null}
            <View style={styles.summaryRow}>
              <View style={[styles.summaryChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="barbell-outline" size={14} color={colors.primary} />
                <Text style={[styles.summaryText, { color: colors.text }]}>
                  {t('routines.exerciseCount', { count: exercises.length })}
                </Text>
              </View>
              <View style={[styles.summaryChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="layers-outline" size={14} color={colors.accent} />
                <Text style={[styles.summaryText, { color: colors.text }]}>
                  {t('routines.setsEditor.setCount', {
                    count: exercises.reduce((sum, item) => sum + item.sets, 0),
                  })}
                </Text>
              </View>
            </View>

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
                shape.primaryButton,
                styles.startButton,
                {
                  backgroundColor: exercises.length === 0 ? colors.surfaceElevated : colors.primary,
                  shadowColor: colors.primary,
                  shadowOpacity: exercises.length === 0 ? 0 : 0.35,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Ionicons
                name="play"
                size={18}
                color={exercises.length === 0 ? colors.textSecondary : colors.onPrimary}
              />
              <Text
                style={[
                  typography.button,
                  { color: exercises.length === 0 ? colors.textSecondary : colors.onPrimary },
                ]}
              >
                {t('workout.startWorkout')}
              </Text>
            </Pressable>
          </View>

          {exercises.length === 0 ? (
            <View style={[styles.listContent, styles.listContentEmpty]}>
              <View style={styles.empty}>
                <View style={[shape.iconWell, styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
                  <Ionicons name="fitness" size={36} color={colors.primary} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  {t('routines.detail.emptyTitle')}
                </Text>
                <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
                  {t('routines.detail.emptyHint')}
                </Text>
              </View>
              {addExerciseButton}
            </View>
          ) : (
            <Animated.ScrollView
              ref={scrollableRef}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              <Sortable.Grid
                columns={1}
                data={exercises}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                rowGap={12}
                scrollableRef={scrollableRef}
                onDragEnd={handleDragEnd}
              />
              {addExerciseButton}
            </Animated.ScrollView>
          )}
        </>
      )}

      <LoadingOverlay visible={!loaded} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 14,
  },
  description: {
    ...typography.body,
    lineHeight: 21,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  summaryChip: {
    ...shape.chip,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  startButton: {
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 4,
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
    paddingTop: 48,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: radius.xl,
    marginBottom: 8,
  },
  emptyTitle: {
    ...typography.heading,
  },
  emptyHint: {
    ...typography.caption,
    textAlign: 'center',
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
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowTitle: {
    ...typography.rowTitle,
    flexShrink: 1,
  },
  badge: {
    borderRadius: radius.pill,
    borderWidth: hairline,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  rowSubtitle: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 5,
  },
  metaChip: {
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  addButton: {
    ...shape.secondaryButton,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
});
