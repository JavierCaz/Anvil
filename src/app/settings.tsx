import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Screen } from '@/components/Screen';
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
import { useAppTheme } from '@/theme/app-theme-provider';
import { useThemeStore } from '@/theme/theme-store';

interface SwitchRowProps {
  offLabel: string;
  onLabel: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function SwitchRow({ offLabel, onLabel, value, onValueChange }: SwitchRowProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.rowLabel,
          { color: value ? colors.textSecondary : colors.text },
        ]}
      >
        {offLabel}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        ios_backgroundColor={colors.border}
      />
      <Text
        style={[
          styles.rowLabel,
          { color: value ? colors.text : colors.textSecondary },
        ]}
      >
        {onLabel}
      </Text>
    </View>
  );
}

export default function SettingsScreen() {
  const { scheme, colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const db = useSQLiteContext();
  const dialog = useDialog();
  const [busyAction, setBusyAction] = useState<'export' | 'import' | 'erase' | null>(null);

  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const weeklyWorkouts = useWeeklyGoalStore((state) => state.weeklyWorkouts);
  const setWeeklyWorkouts = useWeeklyGoalStore((state) => state.setWeeklyWorkouts);
  const unitSystem = useUnitsStore((state) => state.unitSystem);
  const setUnitSystem = useUnitsStore((state) => state.setUnitSystem);

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
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.appearance')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SwitchRow
            offLabel={t('theme.light')}
            onLabel={t('theme.dark')}
            value={isDark}
            onValueChange={(dark) => setPreference(dark ? 'dark' : 'light')}
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.language')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SwitchRow
            offLabel={t('language.english')}
            onLabel={t('language.spanish')}
            value={language === 'es'}
            onValueChange={(es) => void setAppLanguage(es ? 'es' : 'en')}
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.units')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SwitchRow
            offLabel={t('units.metric')}
            onLabel={t('units.imperial')}
            value={unitSystem === 'imperial'}
            onValueChange={(imperial) => setUnitSystem(imperial ? 'imperial' : 'metric')}
          />
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
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('settings.data')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Pressable
            accessibilityRole="button"
            disabled={busyAction !== null}
            onPress={confirmExport}
            style={styles.row}
          >
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.exportData')}</Text>
            {busyAction === 'export' ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="share-outline" size={22} color={colors.textSecondary} />
            )}
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable
            accessibilityRole="button"
            disabled={busyAction !== null}
            onPress={confirmImport}
            style={styles.row}
          >
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.importData')}</Text>
            {busyAction === 'import' ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="download-outline" size={22} color={colors.textSecondary} />
            )}
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable
            accessibilityRole="button"
            disabled={busyAction !== null}
            onPress={confirmErase}
            style={styles.row}
          >
            <Text style={[styles.rowLabel, { color: colors.error }]}>{t('settings.eraseAllData')}</Text>
            {busyAction === 'erase' ? (
              <ActivityIndicator size="small" color={colors.error} />
            ) : (
              <Ionicons name="trash-outline" size={22} color={colors.error} />
            )}
          </Pressable>
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
  divider: {
    height: StyleSheet.hairlineWidth,
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
