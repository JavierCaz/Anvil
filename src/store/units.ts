import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** Measurement system used for display/input of weights and volume. */
export type UnitSystem = 'metric' | 'imperial';

export const UNITS_STORAGE_KEY = 'anvil.units';

interface UnitsState {
  /** Weights are always stored in kg; this only affects display/input. */
  unitSystem: UnitSystem;
  setUnitSystem: (unitSystem: UnitSystem) => void;
}

/**
 * Persisted unit-system preference. Storage is `expo-sqlite/kv-store` (local
 * SQLite-backed KV store) — no AsyncStorage dependency, stays on-device.
 * Default is metric; switching to imperial converts at display/input time
 * without touching the kg values in the database.
 */
export const useUnitsStore = create<UnitsState>()(
  persist(
    (set) => ({
      unitSystem: 'metric',
      setUnitSystem: (unitSystem) => set({ unitSystem }),
    }),
    {
      name: UNITS_STORAGE_KEY,
      storage: createJSONStorage(() => Storage),
    }
  )
);
