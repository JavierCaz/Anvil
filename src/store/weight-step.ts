import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** How much the +/− buttons in a set change the weight, in display units. */
export const WEIGHT_STEP_STORAGE_KEY = 'anvil.settings.weightStep';

/** Smallest allowed weight increment, per unit system (display units). */
export const WEIGHT_STEP_KG_MIN = 0.5;
export const WEIGHT_STEP_KG_MAX = 25;
export const WEIGHT_STEP_LB_MIN = 1;
export const WEIGHT_STEP_LB_MAX = 55;

/** Granularity of the stepper used to edit the setting itself. */
export const WEIGHT_STEP_KG_ADJUST = 0.5;
export const WEIGHT_STEP_LB_ADJUST = 1;

interface WeightStepState {
  /** Metric increment in kg. */
  stepKg: number;
  /** Imperial increment in lb. */
  stepLb: number;
  setStepKg: (value: number) => void;
  setStepLb: (value: number) => void;
}

function clampStep(value: number, min: number, max: number): number {
  const clamped = Math.min(max, Math.max(min, value));
  return Math.round(clamped * 10) / 10;
}

/**
 * Persisted weight-increment preference. Values are stored per unit system so
 * switching units keeps a sensible default (2.5 kg / 5 lb — the smallest
 * standard barbell plate jump). Storage is `expo-sqlite/kv-store`.
 */
export const useWeightStepStore = create<WeightStepState>()(
  persist(
    (set) => ({
      stepKg: 2.5,
      stepLb: 5,
      setStepKg: (value) => set({ stepKg: clampStep(value, WEIGHT_STEP_KG_MIN, WEIGHT_STEP_KG_MAX) }),
      setStepLb: (value) => set({ stepLb: clampStep(value, WEIGHT_STEP_LB_MIN, WEIGHT_STEP_LB_MAX) }),
    }),
    {
      name: WEIGHT_STEP_STORAGE_KEY,
      storage: createJSONStorage(() => Storage),
    }
  )
);

/** Format a step value for display: whole values without decimals, else 1 decimal. */
export function formatWeightStep(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
}
