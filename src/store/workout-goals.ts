import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const WEEKLY_WORKOUTS_STORAGE_KEY = 'anvil.goals.weeklyWorkouts';
export const WEEKLY_WORKOUTS_MIN = 0;
export const WEEKLY_WORKOUTS_MAX = 7;

interface WeeklyGoalState {
  /** How many days per week the user plans to train. */
  weeklyWorkouts: number;
  setWeeklyWorkouts: (workouts: number) => void;
}

/**
 * Weekly workout-day goal, persisted to `expo-sqlite/kv-store`.
 */
export const useWeeklyGoalStore = create<WeeklyGoalState>()(
  persist(
    (set) => ({
      weeklyWorkouts: 3,
      setWeeklyWorkouts: (workouts) =>
        set({
          weeklyWorkouts: Math.min(
            WEEKLY_WORKOUTS_MAX,
            Math.max(WEEKLY_WORKOUTS_MIN, Math.round(workouts))
          ),
        }),
    }),
    {
      name: WEEKLY_WORKOUTS_STORAGE_KEY,
      storage: createJSONStorage(() => Storage),
    }
  )
);
