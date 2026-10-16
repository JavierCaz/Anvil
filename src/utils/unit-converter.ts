import type { UnitSystem } from '@/store/units';
import { M_PER_MI, M_PER_YD } from '@/utils/distance';

/**
 * Unit conversions for the workout tools' converter. Each unit is expressed as
 * a factor of its category's base unit (kg, meters, km/h), so any pair in a
 * category converts through the base.
 */

export type ConverterCategory = 'weight' | 'distance' | 'speed';

export const CONVERTER_CATEGORIES: readonly ConverterCategory[] = ['weight', 'distance', 'speed'];

/** Exact kilograms per international avoirdupois pound. */
const KG_PER_LB = 0.45359237;

/** Base units per unit, keyed by unit label. Order is the order shown in the picker. */
const UNITS = {
  weight: { kg: 1, lb: KG_PER_LB, g: 0.001, oz: KG_PER_LB / 16, st: KG_PER_LB * 14 },
  distance: { km: 1000, mi: M_PER_MI, m: 1, yd: M_PER_YD, ft: 0.3048, in: 0.0254, cm: 0.01 },
  speed: { 'km/h': 1, mph: M_PER_MI / 1000, 'm/s': 3.6 },
} as const satisfies Record<ConverterCategory, Record<string, number>>;

/** Default from → to pair: the user's own system first, the other one second. */
const DEFAULT_PAIRS: Record<ConverterCategory, Record<UnitSystem, [string, string]>> = {
  weight: { metric: ['kg', 'lb'], imperial: ['lb', 'kg'] },
  distance: { metric: ['km', 'mi'], imperial: ['mi', 'km'] },
  speed: { metric: ['km/h', 'mph'], imperial: ['mph', 'km/h'] },
};

export function converterUnits(category: ConverterCategory): string[] {
  return Object.keys(UNITS[category]);
}

export function defaultConverterUnits(
  category: ConverterCategory,
  unitSystem: UnitSystem
): { from: string; to: string } {
  const [from, to] = DEFAULT_PAIRS[category][unitSystem];
  return { from, to };
}

/** Convert `value` between two units of `category`. Unknown units return NaN. */
export function convertUnit(
  value: number,
  category: ConverterCategory,
  from: string,
  to: string
): number {
  const units: Record<string, number> = UNITS[category];
  const fromFactor = units[from];
  const toFactor = units[to];
  if (fromFactor === undefined || toFactor === undefined) {
    return NaN;
  }
  return (value * fromFactor) / toFactor;
}

/**
 * Round to `maxDecimals` and drop trailing zeros ("55.12", "100"). Values too
 * small to show at that precision keep their significant digits instead of
 * collapsing to 0 (e.g. 1 g → "0.0022" lb at 2 decimals).
 */
export function formatConverted(value: number, maxDecimals = 2): string {
  if (!Number.isFinite(value)) {
    return '—';
  }
  const factor = 10 ** maxDecimals;
  const rounded = Math.round(value * factor) / factor;
  if (rounded === 0 && value !== 0) {
    return String(Number(value.toPrecision(2)));
  }
  return String(rounded);
}
