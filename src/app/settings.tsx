import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { AnvilMark } from '@/components/AnvilLogo';
import { Screen } from '@/components/Screen';
import { StepIcon } from '@/components/StepIcon';
import { useDialog } from '@/components/AppDialog';
import { resetAppLanguage, setAppLanguage, type AppLanguage } from '@/i18n';
import { type BackupPreferences } from '@/db/backup';
import { eraseAllData, exportBackupFile, importBackupFile } from '@/db/backup-file';
import {
  useWeeklyGoalStore,
  WEEKLY_WORKOUTS_MAX,
  WEEKLY_WORKOUTS_MIN,
} from '@/store/workout-goals';
import { useUnitsStore } from '@/store/units';
import {
  formatWeightStep,
  useWeightStepStore,
  WEIGHT_STEP_KG_ADJUST,
  WEIGHT_STEP_KG_MAX,
  WEIGHT_STEP_KG_MIN,
  WEIGHT_STEP_LB_ADJUST,
  WEIGHT_STEP_LB_MAX,
  WEIGHT_STEP_LB_MIN,
} from '@/store/weight-step';
import { useAppTheme } from '@/theme/app-theme-provider';
import { withAlpha } from '@/theme/colors';
import { hairline, radius, shape, typography } from '@/theme/tokens';
import { useThemeStore } from '@/theme/theme-store';
import { weightUnitLabel } from '@/utils/weight';

interface SwitchRowProps {
  offLabel: string;
  onLabel: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

/** Two-option segmented control (kept as `SwitchRow` for its on/off API). */
function SwitchRow({ offLabel, onLabel, value, onValueChange }: SwitchRowProps) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.segmented, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {([false, true] as const).map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={String(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onValueChange(option)}
            style={[styles.segment, active && { backgroundColor: colors.surfaceElevated }]}
          >
            <Text
              style={[
                styles.segmentLabel,
                { color: active ? colors.text : colors.textSecondary },
                active && styles.segmentLabelActive,
              ]}
            >
              {option ? onLabel : offLabel}
            </Text>
            {active && <View style={[styles.segmentDot, { backgroundColor: colors.primary }]} />}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SettingsScreen() {
  const { scheme, colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const db = useSQLiteContext();
  const dialog = useDialog();
  const [busyAction, setBusyAction] = useState<'export' | 'import' | 'erase' | null>(null);

  // `nativeApplicationVersion` is null on web, so fall back to the app config version.
  const appVersion = Application.nativeApplicationVersion ?? Constants.expoConfig?.version ?? null;

  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const weeklyWorkouts = useWeeklyGoalStore((state) => state.weeklyWorkouts);
  const setWeeklyWorkouts = useWeeklyGoalStore((state) => state.setWeeklyWorkouts);
  const unitSystem = useUnitsStore((state) => state.unitSystem);
  const setUnitSystem = useUnitsStore((state) => state.setUnitSystem);
  const stepKg = useWeightStepStore((state) => state.stepKg);
  const stepLb = useWeightStepStore((state) => state.stepLb);
  const setStepKg = useWeightStepStore((state) => state.setStepKg);
  const setStepLb = useWeightStepStore((state) => state.setStepLb);

  // Weight increment is stored per unit system; edit the active one.
  const isImperial = unitSystem === 'imperial';
  const weightStep = isImperial ? stepLb : stepKg;
  const setWeightStep = isImperial ? setStepLb : setStepKg;
  const stepMin = isImperial ? WEIGHT_STEP_LB_MIN : WEIGHT_STEP_KG_MIN;
  const stepMax = isImperial ? WEIGHT_STEP_LB_MAX : WEIGHT_STEP_KG_MAX;
  const stepAdjust = isImperial ? WEIGHT_STEP_LB_ADJUST : WEIGHT_STEP_KG_ADJUST;

  const language = i18n.language as AppLanguage;

  // `system` is the default. The switch mirrors the resolved scheme until
  // the user makes an explicit light/dark override.
  const isDark = preference === 'dark' || (preference === 'system' && scheme === 'dark');
  const notifyWebUnsupported = () => {
    dialog.alert({
      title: t('settings.webUnsupported'),
      message: t('settings.webUnsupportedMessage'),
      icon: 'globe-outline',
    });
  };

  const runExport = async () => {
    try {
      await exportBackupFile(db);
    } catch {
      dialog.alert({
        title: t('settings.data'),
        message: t('settings.exportFailed'),
        icon: 'alert-circle',
        tone: 'error',
      });
    }
  };

  const confirmExport = () => {
    if (Platform.OS === 'web') return notifyWebUnsupported();
    setBusyAction('export');
    void runExport().finally(() => setBusyAction(null));
  };

  const runImport = async () => {
    try {
      const backup = await importBackupFile(db);
      if (backup) {
        await restorePreferences(backup.preferences);
        dialog.alert({
          title: t('settings.importTitle'),
          message: t('settings.importSuccess'),
          icon: 'checkmark-circle',
          tone: 'success',
        });
      }
    } catch {
      dialog.alert({
        title: t('settings.importTitle'),
        message: t('settings.importFailed'),
        icon: 'alert-circle',
        tone: 'error',
      });
    }
  };

  const confirmImport = () => {
    if (Platform.OS === 'web') return notifyWebUnsupported();
    dialog.alert({
      title: t('settings.importTitle'),
      message: t('settings.importMessage'),
      icon: 'download-outline',
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.importConfirm'),
          onPress: () => {
            setBusyAction('import');
            void runImport().finally(() => setBusyAction(null));
          },
        },
      ],
    });
  };

  const runErase = async () => {
    try {
      await eraseAllData(db);
      resetPreferences();
      dialog.alert({
        title: t('settings.eraseTitle'),
        message: t('settings.eraseSuccess'),
        icon: 'checkmark-circle',
        tone: 'success',
      });
    } catch {
      dialog.alert({
        title: t('settings.eraseTitle'),
        message: t('settings.eraseFailed'),
        icon: 'alert-circle',
        tone: 'error',
      });
    }
  };

  const confirmErase = () => {
    if (Platform.OS === 'web') return notifyWebUnsupported();
    dialog.alert({
      title: t('settings.eraseTitle'),
      message: t('settings.eraseMessage'),
      icon: 'trash-outline',
      tone: 'error',
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.eraseConfirm'),
          style: 'destructive',
          onPress: () => {
            setBusyAction('erase');
            void runErase().finally(() => setBusyAction(null));
          },
        },
      ],
    });
  };

  const restorePreferences = async (preferences: BackupPreferences) => {
    if (preferences.theme) void useThemeStore.persist.rehydrate();
    if (preferences.weeklyWorkouts) void useWeeklyGoalStore.persist.rehydrate();
    if (preferences.units) void useUnitsStore.persist.rehydrate();
    if (preferences.weightStep) void useWeightStepStore.persist.rehydrate();
    if (preferences.language === 'en' || preferences.language === 'es') {
      await setAppLanguage(preferences.language);
    }
  };

  const resetPreferences = () => {
    useThemeStore.getState().setPreference(useThemeStore.getInitialState().preference);
    useWeeklyGoalStore
      .getState()
      .setWeeklyWorkouts(useWeeklyGoalStore.getInitialState().weeklyWorkouts);
    useUnitsStore.getState().setUnitSystem(useUnitsStore.getInitialState().unitSystem);
    useWeightStepStore
      .getState()
      .setStepKg(useWeightStepStore.getInitialState().stepKg);
    useWeightStepStore
      .getState()
      .setStepLb(useWeightStepStore.getInitialState().stepLb);
    void resetAppLanguage();
  };

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('settings.title'),
        }}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[typography.overline, styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.appearance')}
        </Text>
        <SwitchRow
          offLabel={t('theme.light')}
          onLabel={t('theme.dark')}
          value={isDark}
          onValueChange={(dark) => setPreference(dark ? 'dark' : 'light')}
        />

        <Text style={[typography.overline, styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.language')}
        </Text>
        <SwitchRow
          offLabel={t('language.english')}
          onLabel={t('language.spanish')}
          value={language === 'es'}
          onValueChange={(es) => void setAppLanguage(es ? 'es' : 'en')}
        />

        <Text style={[typography.overline, styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.units')}
        </Text>
        <SwitchRow
          offLabel={t('units.metric')}
          onLabel={t('units.imperial')}
          value={unitSystem === 'imperial'}
          onValueChange={(imperial) => setUnitSystem(imperial ? 'imperial' : 'metric')}
        />

        <Text style={[typography.overline, styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.weightIncrement')}
        </Text>
        <View
          style={[
            styles.card,
            styles.goalCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.goalHint, { color: colors.textSecondary }]}>
            {t('settings.weightIncrementHint')}
          </Text>
          <View style={styles.stepper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('workout.decreaseWeight')}
              disabled={weightStep <= stepMin}
              hitSlop={8}
              onPress={() => setWeightStep(weightStep - stepAdjust)}
            >
              <StepIcon kind="minus" disabled={weightStep <= stepMin} />
            </Pressable>
            <Text style={[styles.weightStepValue, { color: colors.text }]}>
              {formatWeightStep(weightStep)} {weightUnitLabel(unitSystem)}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('workout.increaseWeight')}
              disabled={weightStep >= stepMax}
              hitSlop={8}
              onPress={() => setWeightStep(weightStep + stepAdjust)}
            >
              <StepIcon kind="plus" disabled={weightStep >= stepMax} />
            </Pressable>
          </View>
        </View>

        <Text style={[typography.overline, styles.sectionLabel, { color: colors.textSecondary }]}>
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
              <StepIcon kind="minus" disabled={weeklyWorkouts <= WEEKLY_WORKOUTS_MIN} />
            </Pressable>
            <Text style={[styles.goalValue, { color: colors.text }]}>{weeklyWorkouts}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="increase"
              disabled={weeklyWorkouts >= WEEKLY_WORKOUTS_MAX}
              hitSlop={8}
              onPress={() => setWeeklyWorkouts(weeklyWorkouts + 1)}
            >
              <StepIcon kind="plus" disabled={weeklyWorkouts >= WEEKLY_WORKOUTS_MAX} />
            </Pressable>
          </View>
        </View>
        <Text style={[typography.overline, styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.data')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Pressable
            accessibilityRole="button"
            disabled={busyAction !== null}
            onPress={confirmExport}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}
          >
            <View style={[shape.iconWell, styles.rowIcon, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name="share-outline" size={17} color={colors.accent} />
            </View>
            <Text style={[styles.rowLabel, styles.rowLabelFlex, { color: colors.text }]}>
              {t('settings.exportData')}
            </Text>
            {busyAction === 'export' ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            )}
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable
            accessibilityRole="button"
            disabled={busyAction !== null}
            onPress={confirmImport}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}
          >
            <View style={[shape.iconWell, styles.rowIcon, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name="download-outline" size={17} color={colors.accent} />
            </View>
            <Text style={[styles.rowLabel, styles.rowLabelFlex, { color: colors.text }]}>
              {t('settings.importData')}
            </Text>
            {busyAction === 'import' ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            )}
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable
            accessibilityRole="button"
            disabled={busyAction !== null}
            onPress={confirmErase}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}
          >
            <View style={[shape.iconWell, styles.rowIcon, { backgroundColor: withAlpha(colors.error, 0.14) }]}>
              <Ionicons name="trash-outline" size={17} color={colors.error} />
            </View>
            <Text style={[styles.rowLabel, styles.rowLabelFlex, { color: colors.error }]}>
              {t('settings.eraseAllData')}
            </Text>
            {busyAction === 'erase' ? (
              <ActivityIndicator size="small" color={colors.error} />
            ) : (
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            )}
          </Pressable>
        </View>

        <Text style={[typography.overline, styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.about')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={[shape.iconWell, styles.rowIcon, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.rowLabel, styles.rowLabelFlex, { color: colors.text }]}>
              {t('settings.version')}
            </Text>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{appVersion}</Text>
          </View>
        </View>

        <View style={styles.brandFooter}>
          <AnvilMark width={72} />
          <Text style={[styles.brandTagline, { color: colors.textSecondary }]}>
            {t('home.tagline')}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandFooter: {
    alignItems: 'center',
    gap: 10,
    marginTop: 28,
    marginBottom: 8,
    opacity: 0.85,
  },
  brandTagline: {
    fontSize: 12,
    letterSpacing: 0.4,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 10,
  },
  sectionLabel: {
    marginTop: 14,
    marginLeft: 4,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: hairline,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: hairline,
    marginLeft: 46,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
  },
  rowLabelFlex: {
    flex: 1,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    borderWidth: hairline,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 7,
    borderRadius: radius.md,
    gap: 4,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  segmentLabelActive: {
    fontWeight: '800',
  },
  segmentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  goalCard: {
    paddingVertical: 16,
    gap: 14,
  },
  goalHint: {
    fontSize: 13,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  goalValue: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    minWidth: 48,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  weightStepValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    minWidth: 88,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
});
