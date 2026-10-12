import {
  getStopwatchElapsedMs,
  getTimerRemainingMs,
  getTimerStatus,
  TIMER_MIN_SECONDS,
  useWorkoutToolsStore,
} from '@/store/workout-tools';

const store = () => useWorkoutToolsStore.getState();

beforeEach(() => {
  store().resetAll();
});

describe('workout timer', () => {
  it('counts down from the configured duration', () => {
    store().setTimerDuration(90);
    store().startTimer(1_000);
    const { timer } = store();
    expect(getTimerStatus(timer)).toBe('running');
    expect(getTimerRemainingMs(timer, 31_000)).toBe(60_000);
    expect(getTimerRemainingMs(timer, 200_000)).toBe(0);
  });

  it('freezes on pause and resumes from the frozen remainder', () => {
    store().setTimerDuration(60);
    store().startTimer(0);
    store().pauseTimer(20_000);
    expect(getTimerStatus(store().timer)).toBe('paused');
    expect(getTimerRemainingMs(store().timer, 999_999)).toBe(40_000);

    store().startTimer(100_000);
    expect(getTimerRemainingMs(store().timer, 110_000)).toBe(30_000);
  });

  it('ignores duration changes unless idle', () => {
    store().setTimerDuration(60);
    store().startTimer(0);
    store().setTimerDuration(300);
    expect(store().timer.durationSeconds).toBe(60);
  });

  it('adjusts duration, paused remainder or deadline depending on status', () => {
    store().setTimerDuration(60);
    store().adjustTimer(15);
    expect(store().timer.durationSeconds).toBe(75);
    store().adjustTimer(-1_000);
    expect(store().timer.durationSeconds).toBe(TIMER_MIN_SECONDS);

    store().setTimerDuration(60);
    store().startTimer(0);
    store().adjustTimer(15, 10_000);
    expect(getTimerRemainingMs(store().timer, 10_000)).toBe(65_000);
    // A running deadline never moves into the past.
    store().adjustTimer(-600, 10_000);
    expect(getTimerRemainingMs(store().timer, 10_000)).toBe(1_000);
  });

  it('returns to idle with the configured duration on reset/finish', () => {
    store().setTimerDuration(120);
    store().startTimer(0);
    store().finishTimer();
    expect(getTimerStatus(store().timer)).toBe('idle');
    expect(getTimerRemainingMs(store().timer, 0)).toBe(120_000);
  });
});

describe('workout stopwatch', () => {
  it('accumulates across pauses and records cumulative laps', () => {
    store().startStopwatch(0);
    store().lapStopwatch(5_000);
    store().pauseStopwatch(8_000);
    expect(getStopwatchElapsedMs(store().stopwatch, 50_000)).toBe(8_000);

    // Laps are only recorded while running.
    store().lapStopwatch(9_000);
    store().startStopwatch(10_000);
    store().lapStopwatch(12_000);
    expect(store().stopwatch.laps).toEqual([5_000, 10_000]);
    expect(getStopwatchElapsedMs(store().stopwatch, 15_000)).toBe(13_000);
  });

  it('clears everything on reset', () => {
    store().startStopwatch(0);
    store().lapStopwatch(1_000);
    store().resetStopwatch();
    expect(store().stopwatch).toEqual({ startedAt: null, accumulatedMs: 0, laps: [] });
  });
});

describe('rest countdown', () => {
  it('starts from the completed set and survives until cleared', () => {
    store().startRest(7, 2, 90, 1_000);
    expect(store().rest).toEqual({ exerciseId: 7, setNumber: 2, endAt: 91_000 });
    store().clearRest();
    expect(store().rest).toBeNull();
  });

  it('extends a running rest and ignores an expired one', () => {
    store().startRest(7, 2, 60, 0);
    store().extendRest(30, 10_000);
    expect(store().rest?.endAt).toBe(90_000);
    store().extendRest(30, 100_000);
    expect(store().rest?.endAt).toBe(90_000);
  });

  it('skips by moving the deadline to now', () => {
    store().startRest(7, 2, 60, 0);
    store().skipRest(5_000);
    expect(store().rest?.endAt).toBe(5_000);
  });

  it('is released only by its own set', () => {
    store().startRest(7, 3, 60, 0);
    store().releaseRestSet(8, 3);
    store().releaseRestSet(7, 2);
    expect(store().rest?.setNumber).toBe(3);
    store().releaseRestSet(7, 3);
    expect(store().rest).toBeNull();
  });

  it('follows renumbering when an earlier set is deleted', () => {
    store().startRest(7, 3, 60, 0);
    store().releaseRestSet(7, 1, true);
    expect(store().rest?.setNumber).toBe(2);
  });

  it('is cleared with the session', () => {
    store().startRest(7, 1, 60, 0);
    store().resetAll();
    expect(store().rest).toBeNull();
  });
});
