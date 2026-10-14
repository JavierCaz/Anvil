import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type GlyphName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface RoutineIconDefinition {
  /** Stored in `routines.icon`. Never rename a key once shipped. */
  key: string;
  glyph: GlyphName;
  /** i18n key under `routines.icons.*`. */
  labelKey: string;
}

/**
 * Preset icons for routines, covering the most common session types: classic
 * splits (push / pull / legs, upper / lower, full body), muscle focus days,
 * conditioning and mobility. Order is the picker order.
 */
export const ROUTINE_ICONS: readonly RoutineIconDefinition[] = [
  { key: 'strength', glyph: 'anvil', labelKey: 'routines.icons.strength' },
  { key: 'push', glyph: 'arrow-up-bold-box', labelKey: 'routines.icons.push' },
  { key: 'pull', glyph: 'arrow-down-bold-box', labelKey: 'routines.icons.pull' },
  { key: 'legs', glyph: 'foot-print', labelKey: 'routines.icons.legs' },
  { key: 'upper', glyph: 'human-handsup', labelKey: 'routines.icons.upper' },
  { key: 'lower', glyph: 'human-handsdown', labelKey: 'routines.icons.lower' },
  { key: 'full_body', glyph: 'human', labelKey: 'routines.icons.fullBody' },
  { key: 'arms', glyph: 'arm-flex', labelKey: 'routines.icons.arms' },
  { key: 'chest', glyph: 'weight-lifter', labelKey: 'routines.icons.chest' },
  { key: 'core', glyph: 'target', labelKey: 'routines.icons.core' },
  { key: 'dumbbell', glyph: 'dumbbell', labelKey: 'routines.icons.dumbbell' },
  { key: 'kettlebell', glyph: 'kettlebell', labelKey: 'routines.icons.kettlebell' },
  { key: 'cardio', glyph: 'heart-pulse', labelKey: 'routines.icons.cardio' },
  { key: 'hiit', glyph: 'lightning-bolt', labelKey: 'routines.icons.hiit' },
  { key: 'run', glyph: 'run-fast', labelKey: 'routines.icons.run' },
  { key: 'cycling', glyph: 'bike', labelKey: 'routines.icons.cycling' },
  { key: 'swim', glyph: 'swim', labelKey: 'routines.icons.swim' },
  { key: 'mobility', glyph: 'yoga', labelKey: 'routines.icons.mobility' },
];

/** Glyph shown for routines without a chosen (or with an unknown) icon. */
export const DEFAULT_ROUTINE_GLYPH: GlyphName = 'dumbbell';

export function getRoutineGlyph(key: string | null | undefined): GlyphName {
  return ROUTINE_ICONS.find((icon) => icon.key === key)?.glyph ?? DEFAULT_ROUTINE_GLYPH;
}
