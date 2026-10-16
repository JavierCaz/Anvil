import {
  getSetTimerElapsedSeconds,
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

describe('set timer', () => {
  it('starts, reports elapsed seconds, and stops with the elapsed time', () => {
    store().startSetTimer(3, 2, 1_000);
    const timer = store().setTimer;
    expect(timer).toEqual({ exerciseId: 3, setNumber: 2, startedAt: 1_000 });
    expect(getSetTimerElapsedSeconds(timer!, 46_900)).toBe(45);

    expect(store().stopSetTimer(3, 2, 46_900)).toBe(45);
    expect(store().setTimer).toBeNull();
  });

  it('ignores a stop for a different set', () => {
    store().startSetTimer(3, 2, 0);
    expect(store().stopSetTimer(3, 1, 10_000)).toBeNull();
    expect(store().stopSetTimer(4, 2, 10_000)).toBeNull();
    expect(store().setTimer).not.toBeNull();
  });

  it('replaces the running timer when another set starts', () => {
    store().startSetTimer(3, 1, 0);
    store().startSetTimer(3, 2, 5_000);
    expect(store().setTimer).toEqual({ exerciseId: 3, setNumber: 2, startedAt: 5_000 });
  });

  it('drops or renumbers the timer when sets are removed', () => {
    store().startSetTimer(3, 3, 0);
    store().releaseSetTimer(3, 1, true);
    expect(store().setTimer?.setNumber).toBe(2);
    store().releaseSetTimer(3, 2);
    expect(store().setTimer).toBeNull();
  });

  it('is cleared with the rest of the tools', () => {
    store().startSetTimer(3, 1, 0);
    store().resetAll();
    expect(store().setTimer).toBeNull();
  });
});

describe('unit converter', () => {
  it('feeds keypad presses into the calculator', () => {
    store().pressConverterKey('2');
    store().pressConverterKey('0');
    store().pressConverterKey('+');
    store().pressConverterKey('5');
    expect(store().converter.calculator.expression).toBe('20+5');
  });

  it('resets units but keeps the typed value when the category changes', () => {
    store().pressConverterKey('5');
    store().setConverterUnits('g', 'oz');
    store().setConverterCategory('distance');
    expect(store().converter).toMatchObject({ category: 'distance', from: null, to: null });
    expect(store().converter.calculator.expression).toBe('5');
  });

  it('is cleared with the rest of the tools', () => {
    store().setConverterCategory('speed');
    store().pressConverterKey('9');
    store().resetAll();
    expect(store().converter).toMatchObject({ category: 'weight', from: null, to: null });
    expect(store().converter.calculator.expression).toBe('');
  });
});
