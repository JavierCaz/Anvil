import type { DistanceScale } from '@/constants/exercise-metrics';
import type { UnitSystem } from '@/store/units';

/**
 * Distance conversion helpers.
 *
 * The database always stores distances in **meters** (`sets.distance_m`,
 * `routine_exercise_sets.distance_m`, PRs). The unit-system preference only
 * changes how they are rendered and entered: km / mi on the `long` scale
 * (runs, rides), m / yd on the `short` scale (carries, swimming). Keep
 * conversion at the display/input boundary, like `src/utils/weight.ts`.
 */

/** Exact meters per international mile. */
export const M_PER_MI = 1609.344;

/** Exact meters per international yard. */
export const M_PER_YD = 0.9144;

/** Meters per display unit for the unit system + scale. */
function metersPerUnit(unit: UnitSystem, scale: DistanceScale): number {
  if (scale === 'short') {
    return unit === 'imperial' ? M_PER_YD : 1;
  }
  return unit === 'imperial' ? M_PER_MI : 1000;
}

/** Short label for the distance unit: "km" / "mi", or "m" / "yd" on the short scale. */
export function distanceUnitLabel(unit: UnitSystem, scale: DistanceScale = 'long'): string {
  if (scale === 'short') {
    return unit === 'imperial' ? 'yd' : 'm';
  }
  return unit === 'imperial' ? 'mi' : 'km';
}

/** Meters → display unit. */
export function metersToDisplay(meters: number, unit: UnitSystem, scale: DistanceScale = 'long'): number {
  return meters / metersPerUnit(unit, scale);
}

/** Display unit → meters. */
export function displayToMeters(value: number, unit: UnitSystem, scale: DistanceScale = 'long'): number {
  return value * metersPerUnit(unit, scale);
}

/** Round a display distance to 2 decimals and drop trailing zeros ("5", "5.25"). */
export function formatDistanceValue(value: number): string {
  return String(Math.round(value * 100) / 100);
}

/** Meters formatted in the display unit, without the unit label. */
export function formatDistance(meters: number, unit: UnitSystem, scale: DistanceScale = 'long'): string {
  return formatDistanceValue(metersToDisplay(meters, unit, scale));
}

/** Meters formatted with the unit label, e.g. "5.2 km" or "40 m". */
export function formatDistanceWithUnit(
  meters: number,
  unit: UnitSystem,
  scale: DistanceScale = 'long'
): string {
  return `${formatDistance(meters, unit, scale)} ${distanceUnitLabel(unit, scale)}`;
}

/**
 * Pace per display unit, e.g. "5:12 /km". Returns null when distance or
 * duration is missing.
 */
export function formatPace(seconds: number, meters: number, unit: UnitSystem): string | null {
  if (!(seconds > 0) || !(meters > 0)) {
    return null;
  }
  const perUnit = Math.round(seconds / metersToDisplay(meters, unit));
  const minutes = Math.floor(perUnit / 60);
  const rest = perUnit % 60;
  return `${minutes}:${String(rest).padStart(2, '0')} /${distanceUnitLabel(unit)}`;
}
