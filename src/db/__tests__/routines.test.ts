import type { SQLiteDatabase } from 'expo-sqlite';
import { addExerciseToRoutine, createRoutine, reorderRoutines, updateRoutine } from '@/db/routines';

/**
 * Queue-based mock DB: each `getAllAsync`/`getFirstAsync` call consumes the
 * next queued result, mirroring the call order of the functions under test.
 */
function makeDb() {
  const getAllQueue: unknown[][] = [];
  const getFirstQueue: unknown[] = [];
  const runAsync = jest.fn(async () => ({ changes: 1, lastInsertRowId: 0 }));
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

describe('reorderRoutines', () => {
  it('rewrites order_index 0..n to match the given id order', async () => {
    const { db, getAllQueue, runAsync } = makeDb();
    getAllQueue.push([
      { id: 1, order_index: 0 },
      { id: 2, order_index: 1 },
      { id: 3, order_index: 2 },
    ]);

    await reorderRoutines(db, [3, 1, 2]);

    const calls = runAsync.mock.calls as unknown[][];
    expect(calls).toEqual([
      ['UPDATE routines SET order_index = ? WHERE id = ?', 0, 3],
      ['UPDATE routines SET order_index = ? WHERE id = ?', 1, 1],
      ['UPDATE routines SET order_index = ? WHERE id = ?', 2, 2],
    ]);
  });

  it('keeps routines not listed in the new order at the end', async () => {
    const { db, getAllQueue, runAsync } = makeDb();
    getAllQueue.push([
      { id: 1, order_index: 0 },
      { id: 2, order_index: 1 },
      { id: 3, order_index: 2 },
    ]);

    await reorderRoutines(db, [2]);

    const calls = runAsync.mock.calls as unknown[][];
    expect(calls.map((call) => call[2])).toEqual([2, 1, 3]);
  });
});

describe('createRoutine', () => {
  it('shifts existing routines down and inserts the new one at index 0', async () => {
    const { db, runAsync, withTransactionAsync } = makeDb();
    runAsync.mockImplementation(async () => ({ changes: 1, lastInsertRowId: 42 }));

    await createRoutine(db, { name: 'Push Day' });

    expect(withTransactionAsync).toHaveBeenCalled();
    const calls = runAsync.mock.calls as unknown[][];
    // 1) shift existing rows, 2) insert at order_index 0
    expect(calls[0]).toEqual(['UPDATE routines SET order_index = order_index + 1']);
    expect(calls[1]).toEqual([
      'INSERT INTO routines (name, description, icon, order_index) VALUES (?, ?, ?, 0)',
      'Push Day',
      null,
      null,
    ]);
  });

  it('stores the chosen preset icon', async () => {
    const { db, runAsync } = makeDb();
    await createRoutine(db, { name: 'Leg Day', icon: 'legs' });
    const calls = runAsync.mock.calls as unknown[][];
    expect(calls[1]).toEqual([
      'INSERT INTO routines (name, description, icon, order_index) VALUES (?, ?, ?, 0)',
      'Leg Day',
      null,
      'legs',
    ]);
  });

  it('trims the routine name and rejects an empty one', async () => {
    const { db, runAsync } = makeDb();
    await expect(createRoutine(db, { name: '  ' })).rejects.toThrow('Routine name is required');
    expect(runAsync).not.toHaveBeenCalled();
  });
});

describe('updateRoutine', () => {
  it('updates name, description and icon together', async () => {
    const { db, runAsync } = makeDb();
    await updateRoutine(db, 7, { name: ' Pull Day ', description: '', icon: 'pull' });
    expect(runAsync.mock.calls[0]).toEqual([
      'UPDATE routines SET name = ?, description = ?, icon = ? WHERE id = ?',
      'Pull Day',
      null,
      'pull',
      7,
    ]);
  });
});

describe('addExerciseToRoutine defaults', () => {
  /** INSERT params for routine_exercise_sets rows, in call order. */
  const setInserts = (runAsync: jest.Mock) =>
    (runAsync.mock.calls as unknown[][])
      .filter((call) => String(call[0]).includes('INSERT INTO routine_exercise_sets'))
      .map((call) => call.slice(1));

  it('plans one 30-minute set with no rest for distance cardio', async () => {
    const { db, getFirstQueue, runAsync } = makeDb();
    getFirstQueue.push({ exercise_type: 'distance_duration' }); // type lookup
    getFirstQueue.push({ m: 0 }); // current max order_index

    await addExerciseToRoutine(db, 1, 42);

    // (routine_exercise_id, set_number, reps, rest_seconds, weight, duration_seconds, distance_m)
    expect(setInserts(runAsync)).toEqual([[0, 1, 0, 0, null, 1800, null]]);
  });

  it('plans 3 × 30 s holds for timed exercises', async () => {
    const { db, getFirstQueue, runAsync } = makeDb();
    getFirstQueue.push({ exercise_type: 'duration' });
    getFirstQueue.push({ m: null });

    await addExerciseToRoutine(db, 1, 7);

    expect(setInserts(runAsync)).toEqual([
      [0, 1, 0, 60, null, 30, null],
      [0, 2, 0, 60, null, 30, null],
      [0, 3, 0, 60, null, 30, null],
    ]);
  });

  it('keeps 3 × 10 with 90 s rest for strength exercises', async () => {
    const { db, getFirstQueue, runAsync } = makeDb();
    getFirstQueue.push({ exercise_type: 'weight_reps' });
    getFirstQueue.push({ m: 2 });

    await addExerciseToRoutine(db, 1, 3);

    expect(setInserts(runAsync)).toEqual([
      [0, 1, 10, 90, null, null, null],
      [0, 2, 10, 90, null, null, null],
      [0, 3, 10, 90, null, null, null],
    ]);
  });
});
