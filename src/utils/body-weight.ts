import dayjs from 'dayjs';
import type { BodyWeightGoal } from '@/store/body-weight-goal';
import type { UnitSystem } from '@/store/units';
import { kgToDisplay, weightUnitLabel } from './weight';

/**
 * Bodyweight tracker helpers. Pure functions over weigh-in entries so the
 * Home card, the Statistics card and achievements all derive the same numbers.
 *
 * Like every other weight in the app, bodyweight is stored and computed in
 * **kg**; convert only at the display/input boundary.
 */

/** One weigh-in: a local calendar day ('YYYY-MM-DD') and its weight in kg. */
export interface BodyWeightEntry {
  day: string;
  weightKg: number;
}

/** Valid input range (kg). Guards against typos like 7.8 or 780. */
export const BODY_WEIGHT_MIN_KG = 20;
export const BODY_WEIGHT_MAX_KG = 400;

/** A change from the previous weigh-in above this asks the user to confirm. */
export const BODY_WEIGHT_SANITY_JUMP_KG = 5;

/** Changes within ± this band read as "stable" (daily water fluctuation). */
export const BODY_WEIGHT_STABLE_BAND_KG = 0.2;

/** Days in the moving-average window drawn on the chart. */
export const MOVING_AVERAGE_DAYS = 7;

export type TrendDirection = 'up' | 'down' | 'stable';
export type GoalDirection = 'lose' | 'gain';

/** Today's local day key, the `measured_on` of a new weigh-in. */
export function todayKey(): string {
  return dayjs().format('YYYY-MM-DD');
}

export function isValidBodyWeightKg(kg: number): boolean {
  return Number.isFinite(kg) && kg >= BODY_WEIGHT_MIN_KG && kg <= BODY_WEIGHT_MAX_KG;
}

/**
 * Parse a user-typed weight in the display unit. Accepts a comma decimal
 * separator (es locale). Returns null for empty or non-numeric input.
 */
export function parseWeightInput(text: string): number | null {
  const normalized = text.trim().replace(',', '.');
  if (normalized === '' || !/^\d*\.?\d*$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/** Bodyweight always shows one decimal ("80.0"), unlike set weights. */
export function formatBodyWeight(kg: number, unit: UnitSystem): string {
  return kgToDisplay(kg, unit).toFixed(1);
}

export function formatBodyWeightWithUnit(kg: number, unit: UnitSystem): string {
  return `${formatBodyWeight(kg, unit)} ${weightUnitLabel(unit)}`;
}

export function trendDirection(deltaKg: number, bandKg = BODY_WEIGHT_STABLE_BAND_KG): TrendDirection {
  if (deltaKg > bandKg) return 'up';
  if (deltaKg < -bandKg) return 'down';
  return 'stable';
}

/**
 * Time-based trailing moving average: for each entry, the mean of every entry
 * within the previous `windowDays` days (inclusive). Gaps simply shrink the
 * sample instead of skewing the window. Entries must be sorted by day.
 */
export function movingAverage(
  entries: readonly BodyWeightEntry[],
  windowDays = MOVING_AVERAGE_DAYS
): number[] {
  return entries.map((entry, index) => {
    const windowStart = dayjs(entry.day).subtract(windowDays - 1, 'day').format('YYYY-MM-DD');
    let sum = 0;
    let count = 0;
    for (let i = index; i >= 0 && entries[i].day >= windowStart; i--) {
      sum += entries[i].weightKg;
      count++;
    }
    return sum / count;
  });
}

/** Latest entry on or before `day`, or null. Entries must be sorted by day. */
export function entryOnOrBefore(
  entries: readonly BodyWeightEntry[],
  day: string
): BodyWeightEntry | null {
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].day <= day) return entries[i];
  }
  return null;
}

/**
 * Change of the latest weigh-in against a baseline roughly `days` ago: the
 * latest entry on or before that day, falling back to the first entry when
 * history is shorter. Returns null with fewer than two entries. The baseline
 * day is returned so the UI can label the comparison honestly.
 */
export function recentChange(
  entries: readonly BodyWeightEntry[],
  days: number
): { deltaKg: number; sinceDay: string } | null {
  if (entries.length < 2) return null;
  const latest = entries[entries.length - 1];
  const target = dayjs(latest.day).subtract(days, 'day').format('YYYY-MM-DD');
  const baseline = entryOnOrBefore(entries.slice(0, -1), target) ?? entries[0];
  return { deltaKg: latest.weightKg - baseline.weightKg, sinceDay: baseline.day };
}

/** Entries whose day falls in `[fromDay, toDay)`; null bounds are open. */
export function entriesInRange(
  entries: readonly BodyWeightEntry[],
  fromDay: string | null,
  toDay: string | null
): BodyWeightEntry[] {
  return entries.filter(
    (entry) => (fromDay === null || entry.day >= fromDay) && (toDay === null || entry.day < toDay)
  );
}

export function goalDirection(goal: BodyWeightGoal): GoalDirection {
  return goal.targetKg < goal.startKg ? 'lose' : 'gain';
}

/** Share of the way from the goal's start to its target, clamped to 0..1. */
export function goalProgress(goal: BodyWeightGoal, currentKg: number): number {
  const span = goal.startKg - goal.targetKg;
  if (span === 0) return currentKg === goal.targetKg ? 1 : 0;
  return Math.min(1, Math.max(0, (goal.startKg - currentKg) / span));
}

export function isGoalReached(goal: BodyWeightGoal, currentKg: number): boolean {
  return goalDirection(goal) === 'lose' ? currentKg <= goal.targetKg : currentKg >= goal.targetKg;
}

/** kg still to go (0 once reached). */
export function remainingToGoalKg(goal: BodyWeightGoal, currentKg: number): number {
  return isGoalReached(goal, currentKg) ? 0 : Math.abs(goal.targetKg - currentKg);
}

/** Whether a change moves toward the goal. False without a goal or when stable. */
export function isTowardGoal(deltaKg: number, goal: BodyWeightGoal | null): boolean {
  if (!goal || trendDirection(deltaKg) === 'stable') return false;
  return goalDirection(goal) === 'lose' ? deltaKg < 0 : deltaKg > 0;
}

/** Longest run of consecutive logged days. Entries must be sorted by day. */
export function longestDayStreak(entries: readonly BodyWeightEntry[]): number {
  let best = 0;
  let run = 0;
  let previous: string | null = null;
  for (const entry of entries) {
    const consecutive =
      previous !== null && dayjs(previous).add(1, 'day').format('YYYY-MM-DD') === entry.day;
    run = consecutive ? run + 1 : 1;
    best = Math.max(best, run);
    previous = entry.day;
  }
  return best;
}

/** Signed change from the first weigh-in to the latest one (kg). */
export function changeSinceFirstKg(entries: readonly BodyWeightEntry[]): number {
  if (entries.length < 2) return 0;
  return entries[entries.length - 1].weightKg - entries[0].weightKg;
}

/** Bodyweight metrics that drive the `body` achievements. */
export interface BodyWeightStats {
  weighInCount: number;
  /** Longest consecutive-day logging streak. */
  weighInStreakDays: number;
  /** Absolute change since the first weigh-in (kg). Drives the comparatives. */
  bodyChangeKg: number;
  /** Whole-percent progress toward the current goal (0 without a goal). */
  bodyGoalPercent: number;
}

export function computeBodyWeightStats(
  entries: readonly BodyWeightEntry[],
  goal: BodyWeightGoal | null
): BodyWeightStats {
  const latest = entries[entries.length - 1];
  return {
    weighInCount: entries.length,
    weighInStreakDays: longestDayStreak(entries),
    bodyChangeKg: Math.abs(changeSinceFirstKg(entries)),
    // Epsilon keeps an exact hit at 100% despite float error in the ratio.
    bodyGoalPercent:
      goal && latest ? Math.floor(goalProgress(goal, latest.weightKg) * 100 + 1e-9) : 0,
  };
}
