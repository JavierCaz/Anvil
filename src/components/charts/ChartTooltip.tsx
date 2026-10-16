import { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';

interface ChartTooltipProps {
  /** Anchor point (px, relative to the chart area) the tooltip points at. */
  x: number;
  y: number;
  /** Chart area width, so the pill never spills past either edge. */
  containerWidth: number;
  /** Bold figure (e.g. "3 workouts", "72.4 kg"). */
  value: string;
  /** Quiet context after the value (e.g. the day or bucket). */
  label?: string;
}

/** Gap between the anchor and the pill. */
const OFFSET = 8;

/**
 * Value callout for a selected chart element: a small pill centred above the
 * anchor, flipped below it when there's no room on top and clamped to the
 * chart's horizontal bounds. Hidden until measured so it never jumps.
 */
export function ChartTooltip({ x, y, containerWidth, value, label }: ChartTooltipProps) {
  const { colors } = useAppTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  const left = Math.min(Math.max(0, x - size.width / 2), Math.max(0, containerWidth - size.width));
  const above = y - OFFSET - size.height;
  const top = above >= 0 ? above : y + OFFSET;

  return (
    <View
      pointerEvents="none"
      onLayout={onLayout}
      style={[
        styles.pill,
        {
          left,
          top,
          opacity: size.width > 0 ? 1 : 0,
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
          shadowColor: colors.text,
        },
      ]}
    >
      <Text style={[styles.value, { color: colors.text }]} numberOfLines={1}>
        {value}
      </Text>
      {label ? (
        <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  value: {
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
