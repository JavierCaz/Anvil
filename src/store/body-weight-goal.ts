import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const BODY_WEIGHT_GOAL_STORAGE_KEY = 'anvil.bodyWeight.goal';

/**
 * Target bodyweight. `startKg`/`startDay` capture the latest weigh-in when the
 * goal was created, so progress and direction (lose vs gain) are implied by
 * the numbers — the user never picks "cut" or "bulk". All values in kg.
 */
export interface BodyWeightGoal {
  targetKg: number;
  startKg: number;
  startDay: string;
}

interface BodyWeightGoalState {
  goal: BodyWeightGoal | null;
  /**
   * Set the target. A new goal starts from `current`; adjusting an existing
   * goal keeps its original start so progress isn't reset.
   */
  setTarget: (targetKg: number, current: { weightKg: number; day: string }) => void;
  clearGoal: () => void;
}

/** Bodyweight goal, persisted to `expo-sqlite/kv-store`. */
export const useBodyWeightGoalStore = create<BodyWeightGoalState>()(
  persist(
    (set) => ({
      goal: null,
      setTarget: (targetKg, current) =>
        set((state) => ({
          goal: state.goal
            ? { ...state.goal, targetKg }
            : { targetKg, startKg: current.weightKg, startDay: current.day },
        })),
      clearGoal: () => set({ goal: null }),
    }),
    {
      name: BODY_WEIGHT_GOAL_STORAGE_KEY,
      storage: createJSONStorage(() => Storage),
    }
  )
);
