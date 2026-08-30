import type { UnitSystem } from '@/store/units';

/**
 * Weight conversion helpers.
 *
 * The database always stores weights in **kg** (sets.weight, PRs, volume,
 * comparative thresholds, achievement targets). The unit-system preference
 * only changes how those kg values are rendered and how the user enters them.
 * Keep all conversion at the display/input boundary — never write converted
 * values back to the database.
 */

/** Exact pounds per kilogram (international avoirdupois). */
export const LB_PER_KG = 2.2046226218;

/** Short label for the unit system, as used inside strings like "Weight (lb)". */
export function weightUnitLabel(unit: UnitSystem): string {
  return unit === 'imperial' ? 'lb' : 'kg';
}

/** Convert a kg value to the display unit. Metric is a no-op. */
export function kgToDisplay(kg: number, unit: UnitSystem): number {
  return unit === 'imperial' ? kg * LB_PER_KG : kg;
}

/** Convert a display-unit value back to kg. Metric is a no-op. */
export function displayToKg(value: number, unit: UnitSystem): number {
  return unit === 'imperial' ? value / LB_PER_KG : value;
}

/**
 * Format a kg value for display in the given unit. Matches the app's existing
 * convention: whole values render without decimals, anything else with one.
 */
export function formatWeight(kg: number, unit: UnitSystem): string {
  const display = kgToDisplay(kg, unit);
  return display % 1 === 0 ? String(display) : display.toFixed(1);
}

/**
 * Format a kg value with its unit label, e.g. "220.5 lb". Use for display
 * strings that aren't composed through i18n interpolation.
 */
export function formatWeightWithUnit(kg: number, unit: UnitSystem): string {
  return `${formatWeight(kg, unit)} ${weightUnitLabel(unit)}`;
}

/**
 * Format a kg value in the given unit with thousands separators, for large
 * aggregates such as achievement targets (e.g. "1,000 kg" / "2,205 lb").
 */
export function formatWeightGrouped(kg: number, unit: UnitSystem): string {
  const display = kgToDisplay(kg, unit);
  const rounded = display % 1 === 0 ? String(display) : display.toFixed(1);
  return rounded.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
