import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { setAppLanguage, type AppLanguage } from '@/i18n';
import {
  useWeeklyGoalStore,
  WEEKLY_WORKOUTS_MAX,
  WEEKLY_WORKOUTS_MIN,
} from '@/store/workout-goals';
import { useAppTheme } from '@/theme/app-theme-provider';
import { useThemeStore, type ThemePreference } from '@/theme/theme-store';

const THEME_OPTIONS: { value: ThemePreference; labelKey: string }[] = [
  { value: 'system', labelKey: 'theme.system' },
  { value: 'light', labelKey: 'theme.light' },
  { value: 'dark', labelKey: 'theme.dark' },
];

const LANGUAGE_OPTIONS: { value: AppLanguage; labelKey: string }[] = [
  { value: 'en', labelKey: 'language.english' },
  { value: 'es', labelKey: 'language.spanish' },
];

interface CheckRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function CheckRow({ label, selected, onPress }: CheckRowProps) {
  const { colors } = useAppTheme();
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      <Ionicons
        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
        size={22}
        color={selected ? colors.primary : colors.textSecondary}
      />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();

  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const weeklyWorkouts = useWeeklyGoalStore((state) => state.weeklyWorkouts);
  const setWeeklyWorkouts = useWeeklyGoalStore((state) => state.setWeeklyWorkouts);

  const language = i18n.language as AppLanguage;

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('settings.title'),
        }}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.appearance')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {THEME_OPTIONS.map((option) => (
            <CheckRow
              key={option.value}
              label={t(option.labelKey)}
              selected={preference === option.value}
              onPress={() => setPreference(option.value)}
            />
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.language')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {LANGUAGE_OPTIONS.map((option) => (
            <CheckRow
              key={option.value}
              label={t(option.labelKey)}
              selected={language === option.value}
              onPress={() => void setAppLanguage(option.value)}
            />
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.weeklyGoal')}
        </Text>
        <View
          style={[
            styles.card,
            styles.goalCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.goalHint, { color: colors.textSecondary }]}>
            {t('settings.weeklyGoalHint')}
          </Text>
          <View style={styles.stepper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="decrease"
              disabled={weeklyWorkouts <= WEEKLY_WORKOUTS_MIN}
              hitSlop={8}
              onPress={() => setWeeklyWorkouts(weeklyWorkouts - 1)}
            >
              <Ionicons
                name="remove-circle-outline"
                size={30}
                color={
                  weeklyWorkouts <= WEEKLY_WORKOUTS_MIN
                    ? colors.textSecondary
                    : colors.primary
                }
              />
            </Pressable>
            <Text style={[styles.goalValue, { color: colors.text }]}>{weeklyWorkouts}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="increase"
              disabled={weeklyWorkouts >= WEEKLY_WORKOUTS_MAX}
              hitSlop={8}
              onPress={() => setWeeklyWorkouts(weeklyWorkouts + 1)}
            >
              <Ionicons
                name="add-circle-outline"
                size={30}
                color={
                  weeklyWorkouts >= WEEKLY_WORKOUTS_MAX
                    ? colors.textSecondary
                    : colors.primary
                }
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 16,
  },
  goalCard: {
    paddingVertical: 14,
    gap: 12,
  },
  goalHint: {
    fontSize: 13,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  goalValue: {
    fontSize: 28,
    fontWeight: '800',
    minWidth: 40,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
});
