import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StepIcon } from '@/components/StepIcon';
import {
  useWeeklyGoalStore,
  WEEKLY_WORKOUTS_MAX,
  WEEKLY_WORKOUTS_MIN,
} from '@/store/workout-goals';
import { useAppTheme } from '@/theme/app-theme-provider';
import { hairline } from '@/theme/tokens';

/** Inline weekly workout-goal stepper (shown in the Home hero card). */
export function WeeklyGoalEditor() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const weeklyWorkouts = useWeeklyGoalStore((state) => state.weeklyWorkouts);
  const setWeeklyWorkouts = useWeeklyGoalStore((state) => state.setWeeklyWorkouts);

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>{t('home.weeklyGoalHint')}</Text>
      <View style={styles.stepper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.weeklyGoalDecrease')}
          disabled={weeklyWorkouts <= WEEKLY_WORKOUTS_MIN}
          hitSlop={8}
          onPress={() => setWeeklyWorkouts(weeklyWorkouts - 1)}
        >
          <StepIcon kind="minus" disabled={weeklyWorkouts <= WEEKLY_WORKOUTS_MIN} />
        </Pressable>
        <Text style={[styles.value, { color: colors.text }]}>{weeklyWorkouts}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.weeklyGoalIncrease')}
          disabled={weeklyWorkouts >= WEEKLY_WORKOUTS_MAX}
          hitSlop={8}
          onPress={() => setWeeklyWorkouts(weeklyWorkouts + 1)}
        >
          <StepIcon kind="plus" disabled={weeklyWorkouts >= WEEKLY_WORKOUTS_MAX} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: hairline,
    paddingTop: 14,
    gap: 14,
  },
  hint: {
    fontSize: 13,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  value: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    minWidth: 48,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
});
