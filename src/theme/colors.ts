/**
 * Anvil brand palette and per-scheme semantic colors.
 *
 * Brand: iron gray `#2C2C2C`, forge orange `#E86A33`, success steel blue `#4A90D9`.
 * The dark scheme is tuned to the app icon: near-black forged iron with warm
 * orange highlights and muted steel accents.
 *
 * Components should consume semantic colors via `useAppTheme().colors`,
 * never import `palette` directly (keeps dark/light consistent).
 */

export const palette = {
  iron: '#2C2C2C',
  forge: '#E86A33',
  forgeBright: '#FF8A4C',
  forgeDark: '#C9541F',
  steel: '#4A90D9',
  steelMuted: '#6B8CB3',
  gold: '#D9A441',
  backgroundLight: '#F6F5F2',
  backgroundDark: '#0C0D11',
  surfaceLight: '#FFFFFF',
  surfaceDark: '#15171C',
  surfaceElevatedLight: '#FFFFFF',
  surfaceElevatedDark: '#1D2027',
  textLight: '#16171A',
  textDark: '#F2F3F5',
  textSecondaryLight: '#6B6F76',
  textSecondaryDark: '#8B9099',
  borderLight: '#E6E3DD',
  borderDark: '#24272E',
  success: '#3DBE7A',
  error: '#E5534B',
  warning: '#E8A13A',
  white: '#FFFFFF',
} as const;

export interface ThemeColors {
  /** App background. */
  background: string;
  /** Cards and grouped content. */
  surface: string;
  /** Raised surfaces on top of `surface` (selected pills, chips, modals). */
  surfaceElevated: string;
  /** Primary text. */
  text: string;
  /** Secondary/muted text. */
  textSecondary: string;
  /** Hairline borders and dividers. */
  border: string;
  /** Brand accent — forge orange. Use for CTAs, highlights, PRs. */
  primary: string;
  /** Pressed/darker variant of primary. */
  primaryPressed: string;
  /** Lighter, glowing variant of primary (gradient highlights). */
  primaryBright: string;
  /** Translucent primary for tinted chips and icon wells. */
  primarySoft: string;
  /** Content drawn on top of `primary` (labels, icons). */
  onPrimary: string;
  /** Secondary accent — steel blue. Use for info, links. */
  accent: string;
  /** Translucent accent for tinted chips and icon wells. */
  accentSoft: string;
  /** Premium highlight (records, gold-tier moments). */
  gold: string;
  success: string;
  error: string;
  warning: string;
  /** Ordered categorical series for charts (harmonised with the brand). */
  chartSeries: readonly string[];
}

export const lightColors: ThemeColors = {
  background: palette.backgroundLight,
  surface: palette.surfaceLight,
  surfaceElevated: palette.surfaceElevatedLight,
  text: palette.textLight,
  textSecondary: palette.textSecondaryLight,
  border: palette.borderLight,
  primary: palette.forge,
  primaryPressed: palette.forgeDark,
  primaryBright: palette.forgeBright,
  primarySoft: 'rgba(232, 106, 51, 0.12)',
  onPrimary: palette.white,
  accent: palette.steel,
  accentSoft: 'rgba(74, 144, 217, 0.12)',
  gold: '#B9861F',
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
  chartSeries: ['#E86A33', '#4A90D9', '#C99A2E', '#5E9C94', '#9A6FC0', '#C2563A', '#7A8CA3', '#A3A7AE'],
};

export const darkColors: ThemeColors = {
  background: palette.backgroundDark,
  surface: palette.surfaceDark,
  surfaceElevated: palette.surfaceElevatedDark,
  text: palette.textDark,
  textSecondary: palette.textSecondaryDark,
  border: palette.borderDark,
  primary: palette.forge,
  primaryPressed: palette.forgeDark,
  primaryBright: palette.forgeBright,
  primarySoft: 'rgba(232, 106, 51, 0.16)',
  onPrimary: palette.white,
  accent: palette.steelMuted,
  accentSoft: 'rgba(107, 140, 179, 0.18)',
  gold: palette.gold,
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
  chartSeries: ['#E86A33', '#6B8CB3', '#D9A441', '#5FA8A0', '#9B7BC4', '#C2563A', '#8E9AAB', '#5B6068'],
};

/** `#RRGGBB` + opacity (0..1) → `#RRGGBBAA`, for tinted fills derived from theme colors. */
export function withAlpha(hex: string, alpha: number): string {
  const channel = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex.slice(0, 7)}${channel}`;
}
