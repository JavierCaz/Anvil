import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { getExerciseAchievements } from '@/db/achievements';
import { getExerciseById } from '@/db/exercises';
import type { Exercise } from '@/db/types';

export interface ExerciseInfo {
  exercise: Exercise;
  /** Keys of achievements unlocked for this exercise. */
  achievementKeys: string[];
}

/**
 * State for the exercise info modal (ExerciseDetailModal): loads the exercise
 * row plus its unlocked achievements before showing the card.
 */
export function useExerciseInfo() {
  const db = useSQLiteContext();
  const [info, setInfo] = useState<ExerciseInfo | null>(null);

  /**
   * Shows the card for `exerciseId` once loaded. `onShown` runs in the same
   * update — close the previous modal there so modals never stack.
   */
  const open = useCallback(
    (exerciseId: number, onShown?: () => void) => {
      void Promise.all([
        getExerciseById(db, exerciseId),
        getExerciseAchievements(db, exerciseId),
      ]).then(([exercise, definitions]) => {
        if (!exercise) {
          return;
        }
        setInfo({ exercise, achievementKeys: definitions.map((definition) => definition.key) });
        onShown?.();
      });
    },
    [db]
  );

  const close = useCallback(() => setInfo(null), []);

  return { info, open, close };
}
