import type { SQLiteDatabase } from 'expo-sqlite';
import { createRoutine, reorderRoutines } from '@/db/routines';

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
      'INSERT INTO routines (name, description, order_index) VALUES (?, ?, 0)',
      'Push Day',
      null,
    ]);
  });

  it('trims the routine name and rejects an empty one', async () => {
    const { db, runAsync } = makeDb();
    await expect(createRoutine(db, { name: '  ' })).rejects.toThrow('Routine name is required');
    expect(runAsync).not.toHaveBeenCalled();
  });
});
