import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type ThemeColors } from './colors';
import { useThemeStore } from './theme-store';

export type AppColorScheme = 'light' | 'dark';

export interface AppTheme {
  /** Resolved scheme (after applying the user's `system`/`light`/`dark` preference). */
  scheme: AppColorScheme;
  /** Semantic colors for the active scheme. */
  colors: ThemeColors;
}

const AppThemeContext = createContext<AppTheme | null>(null);

/**
 * Provides the resolved theme to the navigation `ThemeProvider` and to
 * app components via `useAppTheme()`.
 *
 * Resolution: user preference (`system` | `light` | `dark`) from
 * `useThemeStore`, defaulting to the OS appearance.
 */
export function AppThemeProvider({ children }: { children: ReactNode }) {
  const preference = useThemeStore((state) => state.preference);
  const systemScheme = useColorScheme();

  const scheme: AppColorScheme =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo<AppTheme>(
    () => ({ scheme, colors: scheme === 'dark' ? darkColors : lightColors }),
    [scheme]
  );

  return (
    <AppThemeContext.Provider value={value}>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        {children}
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
}

/** Returns the resolved theme. Must be used within `AppThemeProvider`. */
export function useAppTheme(): AppTheme {
  const theme = useContext(AppThemeContext);
  if (!theme) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return theme;
}
