import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

/**
 * Shared layout and typography tokens for the Anvil look: rounded, hairline-
 * bordered surfaces, tight heavy headings, small tracked overlines. Colors
 * stay in `useAppTheme().colors`; these tokens are color-free.
 */

export const radius = {
  /** Chips, small inputs, thumbnails. */
  sm: 10,
  /** Inputs, list rows, icon wells. */
  md: 14,
  /** Cards. */
  lg: 20,
  /** Hero cards, sheets, modals. */
  xl: 24,
  pill: 999,
} as const;

export const hairline = StyleSheet.hairlineWidth;

export const typography = StyleSheet.create({
  /** Large screen title (tab roots). */
  screenTitle: { fontSize: 30, fontWeight: '800', letterSpacing: -0.6 },
  /** Title inside a pushed screen's body or a modal. */
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  /** Section and card headings. */
  heading: { fontSize: 17, fontWeight: '800', letterSpacing: -0.2 },
  /** Row titles. */
  rowTitle: { fontSize: 15, fontWeight: '700' },
  body: { fontSize: 15 },
  caption: { fontSize: 13 },
  /** Small uppercase label above a group or value. */
  overline: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  /** Large numeric figures. */
  figure: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6, fontVariant: ['tabular-nums'] },
  /** Primary button label. */
  button: { fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
}) satisfies Record<string, TextStyle>;

export const shape = StyleSheet.create({
  /** Standard content card (pair with `surface` bg + `border` color). */
  card: { borderRadius: radius.lg, borderWidth: hairline },
  /** Full-width primary call to action. */
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 54,
    borderRadius: radius.md,
    paddingHorizontal: 20,
  },
  /** Secondary action: hairline-outlined, same footprint as primary. */
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: hairline,
    paddingHorizontal: 18,
  },
  /** Text input field. */
  input: {
    borderRadius: radius.md,
    borderWidth: hairline,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  /** Selectable filter chip. */
  chip: {
    borderRadius: radius.pill,
    borderWidth: hairline,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  /** Square tinted well behind an icon. */
  iconWell: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
}) satisfies Record<string, ViewStyle>;
