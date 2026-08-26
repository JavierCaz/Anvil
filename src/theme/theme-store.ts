import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * User theme preference.
 * - `system`: follow the OS appearance (default)
 * - `light` / `dark`: explicit override
 */
export type ThemePreference = 'system' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'anvil.theme';

interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

/**
 * Persisted theme preference. Storage is `expo-sqlite/kv-store` (local
 * SQLite-backed KV store) — no AsyncStorage dependency, stays on-device.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => Storage),
    }
  )
);
