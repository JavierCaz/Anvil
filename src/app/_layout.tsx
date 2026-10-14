// Initialize i18next before any screen renders. Route modules are lazy-loaded in
// production builds, so the init must live on the always-loaded root layout —
// otherwise useTranslation() finds no instance and t() is undefined.
import '@/i18n';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppDialogProvider } from '@/components/AppDialog';
import { ToastProvider } from '@/components/ToastProvider';
import { AndroidNavigationBar } from '@/components/android-navigation-bar';
import { NotificationPermissionPrompt } from '@/components/NotificationPermissionPrompt';
import { AndroidExactAlarmPermissionPrompt } from '@/components/AndroidExactAlarmPermissionPrompt';
import { DATABASE_NAME, initializeDatabase } from '@/db/database';
import { AppThemeProvider, useAppTheme } from '@/theme/app-theme-provider';

function RootNavigator() {
  const { scheme, colors } = useAppTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          // Pushed screens share one flat, brand-tinted header.
          headerShadowVisible: false,
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text, fontWeight: '800', fontSize: 17 },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDatabase}>
        <AppThemeProvider>
          <AndroidNavigationBar />
          <AppDialogProvider>
            <ToastProvider>
              <NotificationPermissionPrompt />
              <AndroidExactAlarmPermissionPrompt />
              <RootNavigator />
            </ToastProvider>
          </AppDialogProvider>
        </AppThemeProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
