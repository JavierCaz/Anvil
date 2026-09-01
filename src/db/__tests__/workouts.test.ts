import type { SQLiteDatabase } from 'expo-sqlite';
import {
  getRoutineSetValueChanges,
  syncRoutineSetValuesFromWorkout,
} from '@/db/workouts';
import type { WorkoutLog } from '@/db/types';

/**
 * Queue-based mock DB: each `getAllAsync`/`getFirstAsync` call consumes the
 * next queued result, mirroring the call order of the functions under test.
 */
function makeDb() {
  const getAllQueue: unknown[][] = [];
  const getFirstQueue: unknown[] = [];
  const runAsync = jest.fn(async () => ({ changes: 1 }));
  const withTransactionAsync = jest.fn(async (callback: () => Promise<void>) => {
    await callback();
  });
  const db = {
    getAllAsync: jest.fn(async () => getAllQueue.shift() ?? []),
    getFirstAsync: jest.fn(async () => getFirstQueue.shift() ?? null),
    runAsync,
    withTransactionAsync,
  } as unknown as SQLiteDatabase;
  return { db, getAllQueue, getFirstQueue, runAsync, withTransactionAsync };
}

/** The workout log row the session functions read first. */
function logRow(overrides: Partial<WorkoutLog> = {}): WorkoutLog {
  return {
    id: 1,
    routine_id: 5,
    started_at: '2026-08-30T10:00:00.000Z',
    completed_at: null,
    notes: null,
    sets_edited: 0,
    ...overrides,
  };
}

/** One exercise row as returned by `getActiveWorkoutExercises` first query. */
function exerciseRow(overrides: Record<string, unknown> = {}) {
  return {
    routine_exercise_id: 10,
    exercise_id: 1,
    exercise_name: 'Bench Press',
    exercise_slug: 'bench-press',
    exercise_source: 'catalog',
    exercise_primary_muscle: 'chest',
    exercise_equipment: 'barbell',
    target_sets: 3,
    target_reps: 10,
    target_rest_seconds: 90,
    order_index: 0,
    completed_sets: 3,
    ...overrides,
  };
}

/** A routine per-set target row (`routine_exercise_sets`). */
function targetRow(setNumber: number, overrides: Record<string, unknown> = {}) {
  return {
    id: setNumber,
    routine_exercise_id: 10,
    set_number: setNumber,
    reps: 10,
    rest_seconds: 90,
    weight: 100,
    ...overrides,
  };
}

/** A logged set row (`sets`). */
function setRow(setNumber: number, overrides: Record<string, unknown> = {}) {
  return {
    id: setNumber,
    workout_log_id: 1,
    exercise_id: 1,
    set_number: setNumber,
    weight: 100,
    reps: 10,
    rest_seconds: 90,
    completed: 1,
    ...overrides,
  };
}

describe('getRoutineSetValueChanges', () => {
  it('returns [] for a free workout (no routine_id)', async () => {
    const { db, getAllQueue, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow({ routine_id: null }));
    getAllQueue.push([]); // never reached — no exercise queries expected

    await expect(getRoutineSetValueChanges(db, 1)).resolves.toEqual([]);
  });

  it('returns [] when logged values match the routine defaults', async () => {
    const { db, getAllQueue, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow()]); // getActiveWorkoutExercises rows
    getAllQueue.push([targetRow(1), targetRow(2), targetRow(3)]); // set targets
    getAllQueue.push([setRow(1), setRow(2), setRow(3)]); // logged sets

    await expect(getRoutineSetValueChanges(db, 1)).resolves.toEqual([]);
  });

  it('ignores float noise from unit round-trips (kg -> lb -> kg)', async () => {
    const { db, getAllQueue, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow()]);
    getAllQueue.push([targetRow(1, { weight: 100 }), targetRow(2), targetRow(3)]);
    // User prefilled 220.46 lb (~100.0000000001 kg) — must not count as a change.
    getAllQueue.push([
      setRow(1, { weight: 100.0000000001 }),
      setRow(2),
      setRow(3),
    ]);

    await expect(getRoutineSetValueChanges(db, 1)).resolves.toEqual([]);
  });

  it('flags an exercise when a weight differs', async () => {
    const { db, getAllQueue, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow()]);
    getAllQueue.push([targetRow(1), targetRow(2), targetRow(3)]);
    getAllQueue.push([setRow(1, { weight: 102.5 }), setRow(2), setRow(3)]);

    await expect(getRoutineSetValueChanges(db, 1)).resolves.toEqual([
      { routine_exercise_id: 10, exercise_id: 1, exercise_name: 'Bench Press' },
    ]);
  });

  it('flags an exercise when reps differ', async () => {
    const { db, getAllQueue, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow()]);
    getAllQueue.push([targetRow(1), targetRow(2), targetRow(3)]);
    getAllQueue.push([setRow(1, { reps: 12 }), setRow(2), setRow(3)]);

    await expect(getRoutineSetValueChanges(db, 1)).resolves.toHaveLength(1);
  });

  it('flags an exercise when rest seconds differ', async () => {
    const { db, getAllQueue, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow()]);
    getAllQueue.push([targetRow(1), targetRow(2), targetRow(3)]);
    getAllQueue.push([setRow(1, { rest_seconds: 60 }), setRow(2), setRow(3)]);

    await expect(getRoutineSetValueChanges(db, 1)).resolves.toHaveLength(1);
  });

  it('does not flag added sets (set count changes are handled elsewhere)', async () => {
    const { db, getAllQueue, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow({ target_sets: 4, completed_sets: 4 })]);
    getAllQueue.push([targetRow(1), targetRow(2), targetRow(3)]);
    // Set 4 is logged with different values but has no routine target.
    getAllQueue.push([setRow(1), setRow(2), setRow(3), setRow(4, { weight: 140 })]);

    await expect(getRoutineSetValueChanges(db, 1)).resolves.toEqual([]);
  });

  it('ignores incomplete (completed = 0) sets', async () => {
    const { db, getAllQueue, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow()]);
    getAllQueue.push([targetRow(1), targetRow(2), targetRow(3)]);
    getAllQueue.push([
      setRow(1, { completed: 0, weight: 200 }),
      setRow(2),
      setRow(3),
    ]);

    await expect(getRoutineSetValueChanges(db, 1)).resolves.toEqual([]);
  });

  it('flags multiple exercises independently', async () => {
    const { db, getAllQueue, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow());
    getAllQueue.push([
      exerciseRow(),
      exerciseRow({ routine_exercise_id: 11, exercise_id: 2, exercise_name: 'Squat' }),
    ]);
    getAllQueue.push([
      targetRow(1),
      targetRow(2),
      targetRow(3),
      { id: 4, routine_exercise_id: 11, set_number: 1, reps: 5, rest_seconds: 120, weight: 140 },
      { id: 5, routine_exercise_id: 11, set_number: 2, reps: 5, rest_seconds: 120, weight: 140 },
      { id: 6, routine_exercise_id: 11, set_number: 3, reps: 5, rest_seconds: 120, weight: 140 },
    ]);
    getAllQueue.push([setRow(1), setRow(2), setRow(3)]); // Bench unchanged
    getAllQueue.push([
      { ...setRow(1), exercise_id: 2, id: 10, weight: 145 }, // Squat changed
      { ...setRow(2), exercise_id: 2, id: 11 },
      { ...setRow(3), exercise_id: 2, id: 12 },
    ]);

    await expect(getRoutineSetValueChanges(db, 1)).resolves.toEqual([
      { routine_exercise_id: 11, exercise_id: 2, exercise_name: 'Squat' },
    ]);
  });
});

describe('syncRoutineSetValuesFromWorkout', () => {
  it('overlays logged values onto the planned sets, preserving the set count', async () => {
    const { db, getAllQueue, getFirstQueue, runAsync, withTransactionAsync } = makeDb();

    // getRoutineSetValueChanges queries
    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow()]);
    getAllQueue.push([targetRow(1), targetRow(2), targetRow(3)]);
    getAllQueue.push([setRow(1, { weight: 102.5, reps: 8 }), setRow(2), setRow(3)]);
    // getRoutineExerciseSets (planned targets)
    getAllQueue.push([targetRow(1), targetRow(2), targetRow(3)]);
    // getWorkoutSets (logged sets)
    getAllQueue.push([setRow(1, { weight: 102.5, reps: 8 }), setRow(2), setRow(3)]);

    await syncRoutineSetValuesFromWorkout(db, 1);

    expect(withTransactionAsync).toHaveBeenCalled();
    // DELETE + 3 INSERTs + 1 aggregate UPDATE = 5 runAsync calls.
    const calls = runAsync.mock.calls as unknown[][];
    expect(calls.length).toBe(5);
    // INSERT params: (routine_exercise_id, set_number, reps, rest_seconds, weight)
    expect(calls[1]).toEqual([expect.stringContaining('INSERT'), 10, 1, 8, 90, 102.5]);
    expect(calls[2]).toEqual([expect.stringContaining('INSERT'), 10, 2, 10, 90, 100]);
    expect(calls[3]).toEqual([expect.stringContaining('INSERT'), 10, 3, 10, 90, 100]);
  });

  it('stores a logged weight of 0 as NULL in the routine defaults', async () => {
    const { db, getAllQueue, getFirstQueue, runAsync } = makeDb();

    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow()]);
    getAllQueue.push([targetRow(1, { weight: 50 }), targetRow(2), targetRow(3)]);
    getAllQueue.push([setRow(1, { weight: 0 }), setRow(2, { weight: 60 }), setRow(3)]);
    getAllQueue.push([targetRow(1, { weight: 50 }), targetRow(2), targetRow(3)]);
    getAllQueue.push([setRow(1, { weight: 0 }), setRow(2, { weight: 60 }), setRow(3)]);

    await syncRoutineSetValuesFromWorkout(db, 1);

    const calls = runAsync.mock.calls as unknown[][];
    expect(calls[1]).toEqual([expect.stringContaining('INSERT'), 10, 1, 10, 90, null]);
    expect(calls[2]).toEqual([expect.stringContaining('INSERT'), 10, 2, 10, 90, 60]);
  });

  it('does nothing when no set values changed', async () => {
    const { db, getAllQueue, getFirstQueue, runAsync, withTransactionAsync } = makeDb();

    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow()]);
    getAllQueue.push([targetRow(1), targetRow(2), targetRow(3)]);
    getAllQueue.push([setRow(1), setRow(2), setRow(3)]);

    await syncRoutineSetValuesFromWorkout(db, 1);

    expect(withTransactionAsync).not.toHaveBeenCalled();
    expect(runAsync).not.toHaveBeenCalled();
  });
});
