import type { SQLiteDatabase } from 'expo-sqlite';
import { getAchievementByKey } from '@/constants/achievements';
import { BODY_COMPARATIVES } from '@/constants/body-comparatives';
import { ACHIEVEMENT_SEED } from '@/db/achievements';
import { syncBodyWeightAchievements, upsertBodyWeight } from '@/db/body-weight';
import type { BodyWeightGoal } from '@/store/body-weight-goal';
import type { BodyWeightEntry } from '@/utils/body-weight';

/**
 * Fake db: `getAllAsync` serves weigh-ins or achievement rows by query;
 * `runAsync` applies unlock / revoke UPDATEs to the in-memory rows.
 */
function createMockDb(entries: BodyWeightEntry[], unlocked: string[] = []) {
  const rows = new Map<string, string | null>(
    ACHIEVEMENT_SEED.map((seed) => [seed.key, unlocked.includes(seed.key) ? '2026-10-01' : null])
  );
  const db = {
    getAllAsync: jest.fn(async (sql: string) =>
      sql.includes('body_weights')
        ? entries
        : [...rows].map(([key, unlocked_at]) => ({ key, unlocked_at }))
    ),
    runAsync: jest.fn(async (sql: string, ...params: unknown[]) => {
      if (sql.includes('unlocked_at IS NULL')) {
        const [at, key] = params as [string, string];
        if (rows.get(key) !== null) return { changes: 0 };
        rows.set(key, at);
        return { changes: 1 };
      }
      if (sql.includes('SET unlocked_at = NULL')) {
        rows.set(params[0] as string, null);
        return { changes: 1 };
      }
      return { changes: 1 };
    }),
  };
  return { db: db as unknown as SQLiteDatabase, rows, mock: db };
}

const days = (count: number, start = 1, weightKg = 80): BodyWeightEntry[] =>
  Array.from({ length: count }, (_, index) => ({
    day: `2026-10-${String(start + index).padStart(2, '0')}`,
    weightKg,
  }));

describe('upsertBodyWeight', () => {
  it('replaces the existing value for the same day', async () => {
    const { db, mock } = createMockDb([]);
    await upsertBodyWeight(db, '2026-10-15', 80.4);
    const [sql, ...params] = mock.runAsync.mock.calls[0];
    expect(sql).toContain('ON CONFLICT(measured_on) DO UPDATE');
    expect(params).toEqual(['2026-10-15', 80.4]);
  });
});

describe('syncBodyWeightAchievements', () => {
  it('unlocks the first weigh-in and the streak', async () => {
    const { db } = createMockDb(days(7));
    const unlocked = await syncBodyWeightAchievements(db, null);
    expect(unlocked).toEqual(expect.arrayContaining(['first_weigh_in', 'weigh_in_streak_7']));
    expect(unlocked).not.toContain('goal_set');
  });

  it('unlocks comparatives by change since the first weigh-in', async () => {
    const { db } = createMockDb([
      { day: '2026-10-01', weightKg: 85 },
      { day: '2026-10-15', weightKg: 77.5 },
    ]);
    const unlocked = await syncBodyWeightAchievements(db, null);
    expect(unlocked).toEqual(
      expect.arrayContaining([
        'body_comparative_pineapple',
        'body_comparative_cat',
        'body_comparative_bowling_ball',
      ])
    );
    expect(unlocked).not.toContain('body_comparative_turkey');
  });

  it('revokes achievements unlocked that day after a correction', async () => {
    const { db, rows } = createMockDb(
      [
        { day: '2026-10-01', weightKg: 80 },
        { day: '2026-10-15', weightKg: 80.4 },
      ],
      ['first_weigh_in']
    );
    rows.set('body_comparative_labrador', '2026-10-15T09:00:00');
    rows.set('body_comparative_cat', '2026-10-15T09:00:00');
    await syncBodyWeightAchievements(db, null, '2026-10-15');
    expect(rows.get('body_comparative_labrador')).toBeNull();
    expect(rows.get('body_comparative_cat')).toBeNull();
    expect(rows.get('first_weigh_in')).not.toBeNull();
  });

  it('keeps achievements unlocked on earlier days', async () => {
    const { db, rows } = createMockDb(
      [
        { day: '2026-10-01', weightKg: 80 },
        { day: '2026-10-15', weightKg: 80.4 },
      ],
      ['first_weigh_in', 'body_comparative_labrador']
    );
    await syncBodyWeightAchievements(db, null, '2026-10-15');
    expect(rows.get('body_comparative_labrador')).not.toBeNull();
  });

  it('does not revoke without a day to reconcile', async () => {
    const { db, rows } = createMockDb(days(1));
    rows.set('body_comparative_labrador', '2026-10-15T09:00:00');
    await syncBodyWeightAchievements(db, null);
    expect(rows.get('body_comparative_labrador')).not.toBeNull();
  });

  it('revokes goal progress unlocked that day but keeps goal_set', async () => {
    const goal: BodyWeightGoal = { targetKg: 75, startKg: 80, startDay: '2026-10-01' };
    const { db, rows } = createMockDb([
      { day: '2026-10-01', weightKg: 80 },
      { day: '2026-10-15', weightKg: 79 },
    ]);
    for (const key of ['goal_set', 'goal_halfway', 'goal_reached']) {
      rows.set(key, '2026-10-15T09:00:00');
    }
    await syncBodyWeightAchievements(db, goal, '2026-10-15');
    expect(rows.get('goal_set')).not.toBeNull();
    expect(rows.get('goal_halfway')).toBeNull();
    expect(rows.get('goal_reached')).toBeNull();
  });

  it('grants goal achievements and keeps earlier ones', async () => {
    const goal: BodyWeightGoal = { targetKg: 75, startKg: 80, startDay: '2026-10-01' };
    const reached = createMockDb([
      { day: '2026-10-01', weightKg: 80 },
      { day: '2026-10-15', weightKg: 75 },
    ]);
    const unlocked = await syncBodyWeightAchievements(reached.db, goal);
    expect(unlocked).toEqual(
      expect.arrayContaining(['goal_set', 'goal_halfway', 'goal_reached'])
    );

    const cleared = createMockDb(days(1), ['goal_set', 'goal_halfway', 'goal_reached']);
    await syncBodyWeightAchievements(cleared.db, null, '2026-10-15');
    expect(cleared.rows.get('goal_set')).not.toBeNull();
    expect(cleared.rows.get('goal_reached')).not.toBeNull();
  });
});

describe('body comparatives', () => {
  it('is seeded and resolvable as achievements', () => {
    const seeded = new Set<string>(ACHIEVEMENT_SEED.map((seed) => seed.key));
    for (const entry of BODY_COMPARATIVES) {
      expect(seeded.has(entry.key)).toBe(true);
      expect(getAchievementByKey(entry.key)?.category).toBe('body');
    }
  });
});
