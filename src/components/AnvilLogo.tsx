import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { ClipPath, Defs, G, Mask, Path, Rect } from 'react-native-svg';
import { useAppTheme } from '@/theme/app-theme-provider';

/**
 * The Anvil brand mark (anvil over a dumbbell), drawn from the same geometry
 * as the app icon master at assets/icon/mark.svg. Keep the two in sync.
 */

const VIEWBOX = { x: 118, y: 376, width: 1019, height: 466 };
const ASPECT = VIEWBOX.height / VIEWBOX.width;

const ANVIL_PATH =
  'M284 409 H503 C512 409 518 404 524 397 L538 382 H1003 L925 468 L820 514 C765 540 748 580 748 615 C748 670 785 722 855 742 L903 836 H748 L740 827 H508 L500 836 H350 L396 747 C460 720 502 670 504 620 C506 605 500 580 480 553 C445 525 390 505 360 483 Z';
const RIGHT_RIM =
  'M1003 382 L925 468 L820 514 C765 540 748 580 748 615 C748 670 785 722 855 742 L903 836';
const LEFT_RIM = 'M480 553 C500 580 506 605 504 620 C502 670 460 720 396 747 L350 836';

// Fixed artwork colors: the mark is a logo, so it keeps its own palette in
// both color schemes (only the monochrome variant follows a theme color).
const MARK_COLORS = {
  bar: '#5F7690',
  plate: '#6581A0',
  body: '#575D65',
  face: '#6D7178',
  shadow: '#252B33',
  forge: '#FE6A20',
};

interface AnvilMarkProps {
  /** Rendered width in points; height follows the mark's aspect ratio. */
  width: number;
  /** Single-color silhouette (e.g. watermarks); defaults to full color. */
  monochrome?: string;
  style?: StyleProp<ViewStyle>;
}

export function AnvilMark({ width, monochrome, style }: AnvilMarkProps) {
  // Unique ids keep several marks on one screen from sharing clip/mask defs.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clipId = `anvil-clip-${uid}`;
  const maskId = `bar-gap-${uid}`;
  const fill = (color: string) => monochrome ?? color;

  return (
    <Svg
      width={width}
      height={width * ASPECT}
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.width} ${VIEWBOX.height}`}
      style={style}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Defs>
        <ClipPath id={clipId}>
          <Path d={ANVIL_PATH} />
        </ClipPath>
        <Mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254">
          <Rect width="1254" height="1254" fill="#FFFFFF" />
          <Path d={ANVIL_PATH} fill="#000000" stroke="#000000" strokeWidth={30} />
        </Mask>
      </Defs>

      <Rect x="292" y="583" width="670" height="52" fill={fill(MARK_COLORS.bar)} mask={`url(#${maskId})`} />
      <G fill={fill(MARK_COLORS.plate)}>
        <Rect x="123" y="509" width="55" height="200" rx="10" />
        <Rect x="196" y="458" width="79" height="299" rx="14" />
        <Rect x="980" y="458" width="79" height="299" rx="14" />
        <Rect x="1076" y="509" width="55" height="200" rx="10" />
      </G>

      <Path d={ANVIL_PATH} fill={fill(MARK_COLORS.body)} />
      {!monochrome && (
        <G clipPath={`url(#${clipId})`}>
          <Rect x="500" y="370" width="520" height="35" fill={MARK_COLORS.face} />
          <Path d="M440 521 L625 590 L478 728 L440 640 Z" fill={MARK_COLORS.shadow} />
          <Path d="M789 500 L494 836 H695 L896 600 L880 500 Z" fill={MARK_COLORS.shadow} />
          <Path d={RIGHT_RIM} fill="none" stroke={MARK_COLORS.forge} strokeWidth={42} strokeLinejoin="round" />
          <Path d={LEFT_RIM} fill="none" stroke={MARK_COLORS.forge} strokeWidth={42} strokeLinejoin="round" />
          <Path d="M918 382 H1003 L985 402 L952 409 Z" fill={MARK_COLORS.forge} />
        </G>
      )}
    </Svg>
  );
}

interface AnvilLogoProps {
  /** Width of the mark; the wordmark scales with it. */
  markWidth?: number;
  style?: StyleProp<ViewStyle>;
}

/** Horizontal lockup: brand mark + spaced "ANVIL" wordmark. */
export function AnvilLogo({ markWidth = 44, style }: AnvilLogoProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const fontSize = Math.round(markWidth * 0.42);

  return (
    <View style={[styles.lockup, style]} accessibilityRole="header" accessibilityLabel={t('common.appName')}>
      <AnvilMark width={markWidth} />
      <Text style={[styles.wordmark, { color: colors.text, fontSize, letterSpacing: fontSize * 0.32 }]}>
        {t('common.appName').toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    fontWeight: '800',
  },
});
