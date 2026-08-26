/**
 * Anvil brand palette and per-scheme semantic colors.
 *
 * Brand: iron gray `#2C2C2C`, forge orange `#E86A33`, success steel blue `#4A90D9`.
 * Components should consume semantic colors via `useAppTheme().colors`,
 * never import `palette` directly (keeps dark/light consistent).
 */

export const palette = {
  iron: '#2C2C2C',
  forge: '#E86A33',
  forgeDark: '#C9541F',
  steel: '#4A90D9',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#121212',
  surfaceLight: '#F4F4F5',
  surfaceDark: '#1E1E1E',
  textLight: '#1A1A1A',
  textDark: '#F4F4F5',
  textSecondaryLight: '#6B7280',
  textSecondaryDark: '#9CA3AF',
  borderLight: '#E5E7EB',
  borderDark: '#333333',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
} as const;

export interface ThemeColors {
  /** App background. */
  background: string;
  /** Elevated surfaces (cards, modals). */
  surface: string;
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
  /** Secondary accent — steel blue. Use for info, links. */
  accent: string;
  success: string;
  error: string;
  warning: string;
}

export const lightColors: ThemeColors = {
  background: palette.backgroundLight,
  surface: palette.surfaceLight,
  text: palette.textLight,
  textSecondary: palette.textSecondaryLight,
  border: palette.borderLight,
  primary: palette.forge,
  primaryPressed: palette.forgeDark,
  accent: palette.steel,
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
};

export const darkColors: ThemeColors = {
  background: palette.backgroundDark,
  surface: palette.surfaceDark,
  text: palette.textDark,
  textSecondary: palette.textSecondaryDark,
  border: palette.borderDark,
  primary: palette.forge,
  primaryPressed: palette.forgeDark,
  accent: palette.steel,
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
};
