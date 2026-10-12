import { create } from 'zustand';

export const TIMER_DEFAULT_SECONDS = 60;
export const TIMER_MIN_SECONDS = 5;
export const TIMER_MAX_SECONDS = 99 * 60 + 59;
export const TIMER_PRESETS_SECONDS = [30, 60, 90, 120, 180, 300] as const;
/** Step used by the timer's -/+ adjust buttons. */
export const TIMER_ADJUST_SECONDS = 15;

/**
 * Countdown timer. Running is driven by an absolute deadline (`endAt`) so it
 * stays accurate while the app is backgrounded; pausing freezes the remaining
 * time in `pausedRemainingMs`. Idle when both are null.
 */
export interface TimerState {
  /** Configured duration — what the timer shows / restarts from when idle. */
  durationSeconds: number;
  endAt: number | null;
  pausedRemainingMs: number | null;
}

/**
 * Stopwatch. While running, elapsed = `accumulatedMs + (now - startedAt)`;
 * pausing folds the running segment into `accumulatedMs`.
 */
export interface StopwatchState {
  startedAt: number | null;
  accumulatedMs: number;
  /** Cumulative elapsed time (ms) at each lap, oldest first. */
  laps: number[];
}

export type TimerStatus = 'idle' | 'running' | 'paused';

export function getTimerStatus(timer: TimerState): TimerStatus {
  if (timer.endAt !== null) {
    return 'running';
  }
  return timer.pausedRemainingMs !== null ? 'paused' : 'idle';
}

export function getTimerRemainingMs(timer: TimerState, now: number): number {
  if (timer.endAt !== null) {
    return Math.max(0, timer.endAt - now);
  }
  if (timer.pausedRemainingMs !== null) {
    return timer.pausedRemainingMs;
  }
  return timer.durationSeconds * 1000;
}

export function getStopwatchElapsedMs(stopwatch: StopwatchState, now: number): number {
  const running = stopwatch.startedAt !== null ? Math.max(0, now - stopwatch.startedAt) : 0;
  return stopwatch.accumulatedMs + running;
}

export function isStopwatchActive(stopwatch: StopwatchState): boolean {
  return stopwatch.startedAt !== null || stopwatch.accumulatedMs > 0;
}

function clampDuration(seconds: number): number {
  return Math.min(TIMER_MAX_SECONDS, Math.max(TIMER_MIN_SECONDS, Math.round(seconds)));
}

const initialTimer: TimerState = {
  durationSeconds: TIMER_DEFAULT_SECONDS,
  endAt: null,
  pausedRemainingMs: null,
};

const initialStopwatch: StopwatchState = {
  startedAt: null,
  accumulatedMs: 0,
  laps: [],
};

interface WorkoutToolsState {
  timer: TimerState;
  stopwatch: StopwatchState;

  /** Set the idle timer's duration (ignored while running/paused). */
  setTimerDuration: (seconds: number) => void;
  /** Start from idle, or resume when paused. */
  startTimer: (now?: number) => void;
  pauseTimer: (now?: number) => void;
  /** Back to idle, keeping the configured duration. */
  resetTimer: () => void;
  /**
   * Add (or subtract, with a negative delta) time. Idle/paused timers adjust
   * the duration / frozen remainder; a running timer moves its deadline.
   */
  adjustTimer: (deltaSeconds: number, now?: number) => void;
  /** Mark a running timer as finished — returns it to idle. */
  finishTimer: () => void;

  startStopwatch: (now?: number) => void;
  pauseStopwatch: (now?: number) => void;
  resetStopwatch: () => void;
  lapStopwatch: (now?: number) => void;

  /** Clear both tools — called when the workout session ends. */
  resetAll: () => void;
}

/**
 * Session-scoped timer + stopwatch available during a workout. Shared across
 * the session and exercise screens; intentionally not persisted.
 */
export const useWorkoutToolsStore = create<WorkoutToolsState>()((set, get) => ({
  timer: initialTimer,
  stopwatch: initialStopwatch,

  setTimerDuration: (seconds) => {
    const { timer } = get();
    if (getTimerStatus(timer) !== 'idle') {
      return;
    }
    set({ timer: { ...timer, durationSeconds: clampDuration(seconds) } });
  },

  startTimer: (now = Date.now()) => {
    const { timer } = get();
    const status = getTimerStatus(timer);
    if (status === 'running') {
      return;
    }
    const remainingMs =
      status === 'paused' ? (timer.pausedRemainingMs ?? 0) : timer.durationSeconds * 1000;
    set({ timer: { ...timer, endAt: now + remainingMs, pausedRemainingMs: null } });
  },

  pauseTimer: (now = Date.now()) => {
    const { timer } = get();
    if (timer.endAt === null) {
      return;
    }
    set({ timer: { ...timer, endAt: null, pausedRemainingMs: Math.max(0, timer.endAt - now) } });
  },

  resetTimer: () => {
    set((state) => ({ timer: { ...state.timer, endAt: null, pausedRemainingMs: null } }));
  },

  adjustTimer: (deltaSeconds, now = Date.now()) => {
    const { timer } = get();
    const deltaMs = deltaSeconds * 1000;
    switch (getTimerStatus(timer)) {
      case 'idle':
        set({ timer: { ...timer, durationSeconds: clampDuration(timer.durationSeconds + deltaSeconds) } });
        return;
      case 'paused':
        set({
          timer: {
            ...timer,
            pausedRemainingMs: Math.max(1000, (timer.pausedRemainingMs ?? 0) + deltaMs),
          },
        });
        return;
      case 'running':
        // Never move the deadline into the past — keep at least one second.
        set({ timer: { ...timer, endAt: Math.max(now + 1000, (timer.endAt ?? now) + deltaMs) } });
        return;
    }
  },

  finishTimer: () => {
    set((state) => ({ timer: { ...state.timer, endAt: null, pausedRemainingMs: null } }));
  },

  startStopwatch: (now = Date.now()) => {
    const { stopwatch } = get();
    if (stopwatch.startedAt !== null) {
      return;
    }
    set({ stopwatch: { ...stopwatch, startedAt: now } });
  },

  pauseStopwatch: (now = Date.now()) => {
    const { stopwatch } = get();
    if (stopwatch.startedAt === null) {
      return;
    }
    set({
      stopwatch: {
        ...stopwatch,
        startedAt: null,
        accumulatedMs: getStopwatchElapsedMs(stopwatch, now),
      },
    });
  },

  resetStopwatch: () => {
    set({ stopwatch: initialStopwatch });
  },

  lapStopwatch: (now = Date.now()) => {
    const { stopwatch } = get();
    if (stopwatch.startedAt === null) {
      return;
    }
    set({ stopwatch: { ...stopwatch, laps: [...stopwatch.laps, getStopwatchElapsedMs(stopwatch, now)] } });
  },

  resetAll: () => {
    set({ timer: initialTimer, stopwatch: initialStopwatch });
  },
}));
