import { setBackgroundColorAsync } from 'expo-system-ui';
import { useEffect, useState, type ComponentType } from 'react';
import { Platform } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';

type NavigationBarStyle = 'auto' | 'inverted' | 'light' | 'dark';

interface NavigationBarProps {
  style?: NavigationBarStyle;
}

/**
 * Keeps the Android system navigation bar (gesture pill / 3-button bar, which
 * some devices have) in sync with the active app theme. No-op on iOS/web.
 *
 * The nav bar background follows the app background via `expo-system-ui`
 * (edge-to-edge draws the root view behind the bar). The button color uses
 * `expo-navigation-bar`, whose native module is only present in binaries that
 * include it — a dev-client rebuilt after the package was added, or a matching
 * Expo Go. It is therefore imported lazily and guarded: on a build without the
 * module this component degrades to the background-only behavior instead of
 * crashing the app (safe-area insets already keep content clear of the bar).
 */
export function AndroidNavigationBar() {
  const { scheme, colors } = useAppTheme();
  const [Bar, setBar] = useState<ComponentType<NavigationBarProps> | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    let active = true;

    async function loadNavigationBar() {
      try {
        const module = await import('expo-navigation-bar');
        if (active) {
          setBar(() => module.NavigationBar);
        }
      } catch {
        // Native module missing (stale dev client / Expo Go version).
        // Degrade gracefully — background theming below still applies.
      }
    }

    void loadNavigationBar();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      void setBackgroundColorAsync(colors.background).catch(() => undefined);
    }
  }, [colors.background]);

  if (!Bar) {
    return null;
  }
  return <Bar style={scheme === 'dark' ? 'dark' : 'light'} />;
}
