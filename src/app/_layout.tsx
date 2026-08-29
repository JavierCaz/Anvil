import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { AndroidNavigationBar } from '@/components/android-navigation-bar';
import { DATABASE_NAME, initializeDatabase } from '@/db/database';
import { AppThemeProvider, useAppTheme } from '@/theme/app-theme-provider';

function RootNavigator() {
  const { scheme } = useAppTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDatabase}>
      <AppThemeProvider>
        <AndroidNavigationBar />
        <RootNavigator />
      </AppThemeProvider>
    </SQLiteProvider>
  );
}
