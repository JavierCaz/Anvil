import type { SQLiteDatabase } from 'expo-sqlite';
import {
  applyWorkoutExerciseOrder,
  cancelWorkout,
  deleteOrphanedSets,
  getRoutineSetValueChanges,
  getWorkoutRoutineIdentity,
  getWorkoutOrderDiffersFromRoutine,
  setDiffersFromTarget,
  setWorkoutExerciseOrder,
  syncRoutineOrderFromWorkout,
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
    exercise_order: null,
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
    // INSERT params: (routine_exercise_id, set_number, reps, rest_seconds, weight, duration_seconds, distance_m, incline_percent, level)
    expect(calls[1]).toEqual([expect.stringContaining('INSERT'), 10, 1, 8, 90, 102.5, null, null, null, null]);
    expect(calls[2]).toEqual([expect.stringContaining('INSERT'), 10, 2, 10, 90, 100, null, null, null, null]);
    expect(calls[3]).toEqual([expect.stringContaining('INSERT'), 10, 3, 10, 90, 100, null, null, null, null]);
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
    expect(calls[1]).toEqual([expect.stringContaining('INSERT'), 10, 1, 10, 90, null, null, null, null, null]);
    expect(calls[2]).toEqual([expect.stringContaining('INSERT'), 10, 2, 10, 90, 60, null, null, null, null]);
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

describe('applyWorkoutExerciseOrder', () => {
  const row = (routine_exercise_id: number) => ({ routine_exercise_id });

  it('returns rows unchanged when no stored order exists', () => {
    expect(applyWorkoutExerciseOrder([row(1), row(2), row(3)], null)).toEqual([
      row(1),
      row(2),
      row(3),
    ]);
  });

  it('applies a stored session order', () => {
    expect(applyWorkoutExerciseOrder([row(1), row(2), row(3)], '[2,3,1]')).toEqual([
      row(2),
      row(3),
      row(1),
    ]);
  });

  it('appends live rows missing from the stored array in routine order', () => {
    expect(applyWorkoutExerciseOrder([row(1), row(2), row(3)], '[3]')).toEqual([
      row(3),
      row(1),
      row(2),
    ]);
  });

  it('ignores malformed stored orders', () => {
    expect(applyWorkoutExerciseOrder([row(1), row(2)], 'not-json')).toEqual([row(1), row(2)]);
    expect(applyWorkoutExerciseOrder([row(1), row(2)], '["a"]')).toEqual([row(1), row(2)]);
  });
});

describe('setWorkoutExerciseOrder', () => {
  it('stores the ordered routine exercise ids as JSON on the log', async () => {
    const { db, runAsync } = makeDb();
    await setWorkoutExerciseOrder(db, 1, [3, 1, 2]);
    expect(runAsync).toHaveBeenCalledWith(
      'UPDATE workout_logs SET exercise_order = ? WHERE id = ?',
      '[3,1,2]',
      1
    );
  });
});

describe('getWorkoutOrderDiffersFromRoutine', () => {
  it('returns false for a session that was never reordered', async () => {
    const { db, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow()); // exercise_order null
    const result = await getWorkoutOrderDiffersFromRoutine(db, 1);
    expect(result).toBe(false);
  });

  it('returns true when the session order differs from the routine order', async () => {
    const { db, getAllQueue, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow({ exercise_order: '[20,10]' }));
    // getActiveWorkoutExercises rows in effective (session) order + set targets.
    getAllQueue.push([
      exerciseRow({ routine_exercise_id: 20, exercise_id: 2, exercise_name: 'Squat' }),
      exerciseRow(),
    ]);
    getAllQueue.push([targetRow(1), targetRow(2)]);
    // routine_exercises in routine order (Bench first, Squat second).
    getAllQueue.push([{ id: 10 }, { id: 20 }]);

    await expect(getWorkoutOrderDiffersFromRoutine(db, 1)).resolves.toBe(true);
  });

  it('returns false when the session order matches the routine order', async () => {
    const { db, getAllQueue, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow({ exercise_order: '[10,20]' }));
    getAllQueue.push([exerciseRow(), exerciseRow({ routine_exercise_id: 20, exercise_id: 2 })]);
    getAllQueue.push([targetRow(1), targetRow(2)]);
    getAllQueue.push([{ id: 10 }, { id: 20 }]);

    await expect(getWorkoutOrderDiffersFromRoutine(db, 1)).resolves.toBe(false);
  });
});

describe('syncRoutineOrderFromWorkout', () => {
  it('rewrites the routine exercise order from the session', async () => {
    const { db, getAllQueue, getFirstQueue, runAsync } = makeDb();
    getFirstQueue.push(logRow({ exercise_order: '[20,10]' }));
    // Session exercises in effective order: Squat, then Bench.
    getAllQueue.push([
      exerciseRow({ routine_exercise_id: 20, exercise_id: 2 }),
      exerciseRow(),
    ]);
    getAllQueue.push([targetRow(1), targetRow(2)]);

    await syncRoutineOrderFromWorkout(db, 1);

    const calls = runAsync.mock.calls as unknown[][];
    expect(calls[0]).toEqual([
      'UPDATE routine_exercises SET order_index = ? WHERE id = ? AND routine_id = ?',
      0,
      20,
      5,
    ]);
    expect(calls[1]).toEqual([
      'UPDATE routine_exercises SET order_index = ? WHERE id = ? AND routine_id = ?',
      1,
      10,
      5,
    ]);
  });

  it('is a no-op without a routine or stored order', async () => {
    const { db, getFirstQueue, runAsync } = makeDb();
    getFirstQueue.push(logRow({ routine_id: null }));
    await syncRoutineOrderFromWorkout(db, 1);
    getFirstQueue.push(logRow()); // exercise_order null
    await syncRoutineOrderFromWorkout(db, 1);
    expect(runAsync).not.toHaveBeenCalled();
  });
});

describe('cardio / timed sets', () => {
  const running = { exercise_type: 'distance_duration' };
  const runTarget = (setNumber: number, overrides: Record<string, unknown> = {}) =>
    targetRow(setNumber, {
      reps: 0,
      rest_seconds: 0,
      weight: null,
      duration_seconds: 1800,
      distance_m: 5000,
      ...overrides,
    });
  const runSet = (setNumber: number, overrides: Record<string, unknown> = {}) =>
    setRow(setNumber, {
      reps: 0,
      rest_seconds: 0,
      weight: 0,
      duration_seconds: 1800,
      distance_m: 5000,
      ...overrides,
    });

  it('compares only the fields the exercise type records', () => {
    const target = { weight: null, reps: 0, rest_seconds: 0, duration_seconds: 1800, distance_m: 5000 };
    const set = { weight: 0, reps: 0, rest_seconds: 0, duration_seconds: 1800, distance_m: 5000 };
    expect(setDiffersFromTarget(set, target, 'distance_duration')).toBe(false);
    // Reps are irrelevant for cardio.
    expect(setDiffersFromTarget({ ...set, reps: 12 }, target, 'distance_duration')).toBe(false);
    expect(setDiffersFromTarget({ ...set, duration_seconds: 1750 }, target, 'distance_duration')).toBe(true);
    expect(setDiffersFromTarget({ ...set, distance_m: 5200 }, target, 'distance_duration')).toBe(true);
    // Sub-meter float noise from km/mi round-trips is ignored.
    expect(setDiffersFromTarget({ ...set, distance_m: 5000.4 }, target, 'distance_duration')).toBe(false);
    // Holds ignore distance.
    expect(setDiffersFromTarget({ ...set, distance_m: 9999 }, target, 'duration')).toBe(false);
    // A loaded carry flags a changed load.
    expect(
      setDiffersFromTarget(
        { ...set, weight: 36 },
        { ...target, weight: 32 },
        'distance_duration'
      )
    ).toBe(true);
    // A changed treadmill incline is flagged; NULL and 0 both mean flat.
    expect(
      setDiffersFromTarget({ ...set, incline_percent: 6 }, { ...target, incline_percent: 4 }, 'distance_duration')
    ).toBe(true);
    expect(
      setDiffersFromTarget({ ...set, incline_percent: 0 }, { ...target, incline_percent: null }, 'distance_duration')
    ).toBe(false);
    // Same for a machine level; NULL and 0 both mean not set.
    expect(setDiffersFromTarget({ ...set, level: 8 }, { ...target, level: 6 }, 'duration')).toBe(true);
    expect(setDiffersFromTarget({ ...set, level: 0 }, { ...target, level: null }, 'duration')).toBe(false);
    // An unloaded hold treats logged 0 kg and a NULL planned load as equal.
    expect(setDiffersFromTarget({ ...set, weight: 0 }, { ...target, weight: null }, 'duration')).toBe(false);
    // Rep-based exercises ignore duration.
    expect(
      setDiffersFromTarget(
        { weight: 100, reps: 10, rest_seconds: 90, duration_seconds: 30, distance_m: null },
        { weight: 100, reps: 10, rest_seconds: 90, duration_seconds: null, distance_m: null },
        'weight_reps'
      )
    ).toBe(false);
  });

  it('flags a cardio exercise whose logged duration differs from the plan', async () => {
    const { db, getAllQueue, getFirstQueue } = makeDb();
    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow({ ...running, exercise_name: 'Running', target_sets: 1, completed_sets: 1 })]);
    getAllQueue.push([runTarget(1)]);
    getAllQueue.push([runSet(1, { duration_seconds: 1700 })]);

    await expect(getRoutineSetValueChanges(db, 1)).resolves.toEqual([
      { routine_exercise_id: 10, exercise_id: 1, exercise_name: 'Running' },
    ]);
  });

  it('writes logged duration and distance back to the routine', async () => {
    const { db, getAllQueue, getFirstQueue, runAsync } = makeDb();
    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow({ ...running, target_sets: 1, completed_sets: 1 })]);
    getAllQueue.push([runTarget(1)]);
    getAllQueue.push([runSet(1, { duration_seconds: 1650, distance_m: 5500 })]);
    getAllQueue.push([runTarget(1)]);
    getAllQueue.push([runSet(1, { duration_seconds: 1650, distance_m: 5500 })]);

    await syncRoutineSetValuesFromWorkout(db, 1);

    const calls = runAsync.mock.calls as unknown[][];
    // Timed targets keep 0 planned reps (not clamped up to 1) and no weight.
    expect(calls[1]).toEqual([expect.stringContaining('INSERT'), 10, 1, 0, 0, null, 1650, 5500, null, null]);
  });

  it('writes a logged treadmill incline back to the routine', async () => {
    const { db, getAllQueue, getFirstQueue, runAsync } = makeDb();
    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow({ ...running, target_sets: 1, completed_sets: 1 })]);
    getAllQueue.push([runTarget(1, { incline_percent: null })]);
    getAllQueue.push([runSet(1, { incline_percent: 4.5 })]);
    getAllQueue.push([runTarget(1, { incline_percent: null })]);
    getAllQueue.push([runSet(1, { incline_percent: 4.5 })]);

    await syncRoutineSetValuesFromWorkout(db, 1);

    const calls = runAsync.mock.calls as unknown[][];
    expect(calls[1]).toEqual([expect.stringContaining('INSERT'), 10, 1, 0, 0, null, 1800, 5000, 4.5, null]);
  });

  it('writes a logged machine level back to the routine', async () => {
    const { db, getAllQueue, getFirstQueue, runAsync } = makeDb();
    getFirstQueue.push(logRow());
    getAllQueue.push([exerciseRow({ ...running, target_sets: 1, completed_sets: 1 })]);
    getAllQueue.push([runTarget(1, { level: null })]);
    getAllQueue.push([runSet(1, { level: 8 })]);
    getAllQueue.push([runTarget(1, { level: null })]);
    getAllQueue.push([runSet(1, { level: 8 })]);

    await syncRoutineSetValuesFromWorkout(db, 1);

    const calls = runAsync.mock.calls as unknown[][];
    expect(calls[1]).toEqual([expect.stringContaining('INSERT'), 10, 1, 0, 0, null, 1800, 5000, null, 8]);
  });
});

describe('cancelWorkout', () => {
  it('deletes the session sets explicitly and returns the affected exercises', async () => {
    const { db, getFirstQueue, getAllQueue, runAsync } = makeDb();
    getFirstQueue.push({ id: 1 });
    getAllQueue.push([{ exercise_id: 3 }, { exercise_id: 7 }]);

    await expect(cancelWorkout(db, 1)).resolves.toEqual([3, 7]);
    const statements = runAsync.mock.calls.map((call) => (call as unknown[])[0]);
    expect(statements).toEqual([
      'DELETE FROM sets WHERE workout_log_id = ?',
      'DELETE FROM workout_logs WHERE id = ?',
    ]);
  });

  it('does nothing for a finished or missing session', async () => {
    const { db, runAsync } = makeDb();
    await expect(cancelWorkout(db, 1)).resolves.toEqual([]);
    expect(runAsync).not.toHaveBeenCalled();
  });
});

describe('deleteOrphanedSets', () => {
  it('removes sets of deleted workouts and returns their exercises', async () => {
    const { db, getAllQueue, runAsync } = makeDb();
    getAllQueue.push([{ exercise_id: 4 }]);
    await expect(deleteOrphanedSets(db)).resolves.toEqual([4]);
    expect(runAsync).toHaveBeenCalledTimes(1);
  });

  it('skips the delete when there are no orphans', async () => {
    const { db, runAsync } = makeDb();
    await expect(deleteOrphanedSets(db)).resolves.toEqual([]);
    expect(runAsync).not.toHaveBeenCalled();
  });
});

describe('getWorkoutRoutineIdentity', () => {
  it("returns the session routine's name and icon", async () => {
    const { db, getFirstQueue } = makeDb();
    getFirstQueue.push({ name: 'Leg Day', icon: 'legs' });
    await expect(getWorkoutRoutineIdentity(db, 5)).resolves.toEqual({ name: 'Leg Day', icon: 'legs' });
  });

  it('returns nulls when the session has no routine', async () => {
    const { db } = makeDb();
    await expect(getWorkoutRoutineIdentity(db, 5)).resolves.toEqual({ name: null, icon: null });
  });
});
