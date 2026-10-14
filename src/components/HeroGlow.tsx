import { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

interface HeroGlowProps {
  color: string;
  /** Peak opacity at the corner. */
  intensity?: number;
}

/**
 * Soft radial glow from a card's top-right corner. Place as the first child of
 * a card with `overflow: 'hidden'`; it fills the card and ignores touches.
 */
export function HeroGlow({ color, intensity = 0.22 }: HeroGlowProps) {
  const gradientId = `hero-glow-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <RadialGradient id={gradientId} cx="100%" cy="0%" r="75%" fx="100%" fy="0%">
          <Stop offset="0" stopColor={color} stopOpacity={intensity} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
  );
}
