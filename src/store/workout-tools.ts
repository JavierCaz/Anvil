import { create } from 'zustand';
import {
  applyCalculatorKey,
  type CalculatorKey,
  type CalculatorState,
  INITIAL_CALCULATOR,
} from '@/utils/calculator';
import type { ConverterCategory } from '@/utils/unit-converter';

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

/**
 * Rest countdown between sets, started when a set is completed. Lives here
 * (not in the exercise screen) so it keeps running and stays visible while the
 * user moves between the session and exercise screens.
 */
export interface RestState {
  /** Exercise whose set started the rest. */
  exerciseId: number;
  /** Set that started the rest — undoing/deleting it cancels the rest. */
  setNumber: number;
  /** Absolute deadline (ms). */
  endAt: number;
}

/**
 * Live timer for a timed set (plank hold, a run…). Counts up from `startedAt`;
 * stopping it fills that set's duration. Only one set timer runs at a time.
 */
export interface SetTimerState {
  exerciseId: number;
  setNumber: number;
  /** Absolute start (ms). */
  startedAt: number;
}

/**
 * Unit converter with a small calculator for the input value. `from`/`to` are
 * null until the user picks units — the panel then falls back to the pair for
 * their unit-system preference.
 */
export interface ConverterState {
  category: ConverterCategory;
  from: string | null;
  to: string | null;
  calculator: CalculatorState;
}

export function getSetTimerElapsedSeconds(setTimer: SetTimerState, now: number): number {
  return Math.max(0, Math.floor((now - setTimer.startedAt) / 1000));
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

const initialConverter: ConverterState = {
  category: 'weight',
  from: null,
  to: null,
  calculator: INITIAL_CALCULATOR,
};

interface WorkoutToolsState {
  timer: TimerState;
  stopwatch: StopwatchState;
  rest: RestState | null;
  setTimer: SetTimerState | null;
  converter: ConverterState;

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

  /** Start (or restart) the rest countdown for a just-completed set. */
  startRest: (exerciseId: number, setNumber: number, seconds: number, now?: number) => void;
  /** Push a running rest's deadline back. */
  extendRest: (seconds: number, now?: number) => void;
  /** End the rest now — the alarm still rings as the "rest is over" cue. */
  skipRest: (now?: number) => void;
  /** Drop the rest without ringing (it finished or was cancelled). */
  clearRest: () => void;
  /**
   * A set was undone or deleted: cancel the rest if it belongs to that set.
   * With `shift`, later sets of the exercise were renumbered down by one.
   */
  releaseRestSet: (exerciseId: number, setNumber: number, shift?: boolean) => void;

  /** Start timing a set — replaces any other running set timer. */
  startSetTimer: (exerciseId: number, setNumber: number, now?: number) => void;
  /**
   * Stop the set timer and return the elapsed whole seconds, or null when no
   * timer is running for that set.
   */
  stopSetTimer: (exerciseId: number, setNumber: number, now?: number) => number | null;
  /**
   * A set was completed, undone or deleted: drop its timer. With `shift`, later
   * sets of the exercise were renumbered down by one.
   */
  releaseSetTimer: (exerciseId: number, setNumber: number, shift?: boolean) => void;

  /** Switch converter category — units go back to the defaults, the typed value stays. */
  setConverterCategory: (category: ConverterCategory) => void;
  /** Pick the converter's units (both resolved by the caller, never equal). */
  setConverterUnits: (from: string, to: string) => void;
  /** Apply a calculator keypad press to the converter's input. */
  pressConverterKey: (key: CalculatorKey) => void;

  /** Clear all tools — called when the workout session ends. */
  resetAll: () => void;
}

/**
 * Session-scoped timer, stopwatch, unit converter and rest countdown available during a workout. Shared across
 * the session and exercise screens; intentionally not persisted.
 */
export const useWorkoutToolsStore = create<WorkoutToolsState>()((set, get) => ({
  timer: initialTimer,
  stopwatch: initialStopwatch,
  rest: null,
  setTimer: null,
  converter: initialConverter,

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

  startRest: (exerciseId, setNumber, seconds, now = Date.now()) => {
    set({ rest: { exerciseId, setNumber, endAt: now + seconds * 1000 } });
  },

  extendRest: (seconds, now = Date.now()) => {
    const { rest } = get();
    if (!rest || rest.endAt <= now) {
      return;
    }
    set({ rest: { ...rest, endAt: rest.endAt + seconds * 1000 } });
  },

  skipRest: (now = Date.now()) => {
    const { rest } = get();
    if (!rest || rest.endAt <= now) {
      return;
    }
    set({ rest: { ...rest, endAt: now } });
  },

  clearRest: () => {
    set({ rest: null });
  },

  releaseRestSet: (exerciseId, setNumber, shift = false) => {
    const { rest } = get();
    if (!rest || rest.exerciseId !== exerciseId) {
      return;
    }
    if (rest.setNumber === setNumber) {
      set({ rest: null });
    } else if (shift && rest.setNumber > setNumber) {
      set({ rest: { ...rest, setNumber: rest.setNumber - 1 } });
    }
  },

  startSetTimer: (exerciseId, setNumber, now = Date.now()) => {
    set({ setTimer: { exerciseId, setNumber, startedAt: now } });
  },

  stopSetTimer: (exerciseId, setNumber, now = Date.now()) => {
    const { setTimer } = get();
    if (!setTimer || setTimer.exerciseId !== exerciseId || setTimer.setNumber !== setNumber) {
      return null;
    }
    set({ setTimer: null });
    return getSetTimerElapsedSeconds(setTimer, now);
  },

  releaseSetTimer: (exerciseId, setNumber, shift = false) => {
    const { setTimer } = get();
    if (!setTimer || setTimer.exerciseId !== exerciseId) {
      return;
    }
    if (setTimer.setNumber === setNumber) {
      set({ setTimer: null });
    } else if (shift && setTimer.setNumber > setNumber) {
      set({ setTimer: { ...setTimer, setNumber: setTimer.setNumber - 1 } });
    }
  },

  setConverterCategory: (category) => {
    set((state) => ({ converter: { ...state.converter, category, from: null, to: null } }));
  },

  setConverterUnits: (from, to) => {
    set((state) => ({ converter: { ...state.converter, from, to } }));
  },

  pressConverterKey: (key) => {
    set((state) => ({
      converter: {
        ...state.converter,
        calculator: applyCalculatorKey(state.converter.calculator, key),
      },
    }));
  },

  resetAll: () => {
    set({
      timer: initialTimer,
      stopwatch: initialStopwatch,
      rest: null,
      setTimer: null,
      converter: initialConverter,
    });
  },
}));
