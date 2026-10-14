import dayjs from 'dayjs';
import type { SQLiteDatabase } from 'expo-sqlite';
import { buildTimeSeries, getCardioStats, type DayCount } from '@/db/stats';

const DAYS: DayCount[] = [
  { day: '2026-08-03', count: 1 }, // Monday (week start)
  { day: '2026-08-05', count: 2 }, // Wednesday
  { day: '2026-08-10', count: 1 }, // Next Monday
  { day: '2026-08-31', count: 1 }, // Last Monday of August
  { day: '2026-09-01', count: 1 }, // September 1
];

/** Local-midnight ISO bounds, mirroring how the screen builds them. */
const iso = (day: string) => dayjs(day).startOf('day').toISOString();

describe('buildTimeSeries', () => {
  it('buckets daily counts by day and zero-fills gaps', () => {
    const series = buildTimeSeries(DAYS, 'day', iso('2026-08-03'), iso('2026-08-10'));
    expect(series).toEqual([
      { start: '2026-08-03', count: 1 },
      { start: '2026-08-04', count: 0 },
      { start: '2026-08-05', count: 2 },
      { start: '2026-08-06', count: 0 },
      { start: '2026-08-07', count: 0 },
      { start: '2026-08-08', count: 0 },
      { start: '2026-08-09', count: 0 },
    ]);
  });

  it('buckets by Monday-start weeks', () => {
    const series = buildTimeSeries(DAYS, 'week', iso('2026-08-01'), iso('2026-09-08'));
    expect(series).toEqual([
      { start: '2026-07-27', count: 0 }, // partial week containing Sat Aug 1
      { start: '2026-08-03', count: 3 }, // Aug 3 + Aug 5
      { start: '2026-08-10', count: 1 },
      { start: '2026-08-17', count: 0 },
      { start: '2026-08-24', count: 0 },
      { start: '2026-08-31', count: 2 }, // Aug 31 + Sep 1
      { start: '2026-09-07', count: 0 },
    ]);
  });

  it('buckets by month', () => {
    const series = buildTimeSeries(DAYS, 'month', iso('2026-08-01'), iso('2026-10-01'));
    expect(series).toEqual([
      { start: '2026-08-01', count: 5 },
      { start: '2026-09-01', count: 1 },
    ]);
  });

  it('spans first-to-last workout when no range is given', () => {
    const series = buildTimeSeries(DAYS, 'month');
    expect(series).toEqual([
      { start: '2026-08-01', count: 5 },
      { start: '2026-09-01', count: 1 },
    ]);
  });

  it('returns an empty array when there is no data and no range', () => {
    expect(buildTimeSeries([], 'week')).toEqual([]);
  });

  it('handles Sunday dates as part of the previous Monday week', () => {
    const sunday: DayCount[] = [{ day: '2026-08-09', count: 1 }];
    const series = buildTimeSeries(sunday, 'week', iso('2026-08-03'), iso('2026-08-10'));
    expect(series[0]).toEqual({ start: '2026-08-03', count: 1 });
  });
});

describe('cardio distance series', () => {
  it('sums meters per bucket through buildTimeSeries', () => {
    const meters: DayCount[] = [
      { day: '2026-08-03', count: 5000 },
      { day: '2026-08-05', count: 3200.5 },
      { day: '2026-08-12', count: 10000 },
    ];
    const series = buildTimeSeries(meters, 'week', iso('2026-08-03'), iso('2026-08-17'));
    expect(series).toEqual([
      { start: '2026-08-03', count: 8200.5 },
      { start: '2026-08-10', count: 10000 },
    ]);
  });
});

describe('getCardioStats', () => {
  it('maps the aggregate row and defaults to zeros', async () => {
    const getFirstAsync = jest
      .fn()
      .mockResolvedValueOnce({
        distance: 15000,
        duration: 4800,
        paced_seconds: 4500,
        paced_distance: 15000,
        sets: 4,
      })
      .mockResolvedValueOnce(null);
    const db = { getFirstAsync } as unknown as SQLiteDatabase;

    await expect(getCardioStats(db, null, null)).resolves.toEqual({
      totalDistanceM: 15000,
      totalDurationSeconds: 4800,
      pacedSeconds: 4500,
      pacedDistanceM: 15000,
      sets: 4,
    });
    await expect(getCardioStats(db, null, null)).resolves.toEqual({
      totalDistanceM: 0,
      totalDurationSeconds: 0,
      pacedSeconds: 0,
      pacedDistanceM: 0,
      sets: 0,
    });
  });
});
