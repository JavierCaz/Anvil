import * as Haptics from 'expo-haptics';
import { useId, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import Svg, { ClipPath, Defs, G, Line, LinearGradient, Rect, Stop } from 'react-native-svg';
import { AnimatedBar } from '@/components/charts/animated-svg';
import { barLayout } from '@/components/charts/chart-geometry';
import { ChartTooltip } from '@/components/charts/ChartTooltip';
import { useChartDismiss } from '@/components/charts/chart-dismiss';
import { useAppTheme } from '@/theme/app-theme-provider';
import { withAlpha } from '@/theme/colors';

export interface BarTrendPoint {
  /** Axis label under the bar. */
  label: string;
  value: number;
}

interface BarTrendChartProps {
  data: BarTrendPoint[];
  /** Bar drawn at full intensity (e.g. the current period); -1 for none. */
  highlightIndex?: number;
  /** Bright end of the bar gradient (top). */
  color: string;
  /** Deep end of the bar gradient (bottom). */
  colorDeep: string;
  height?: number;
  /** Tooltip figure for a tapped bar (e.g. "3 workouts"); defaults to the raw value. */
  formatValue?: (value: number) => string;
}

/** Most axis labels shown before thinning to every n-th one. */
const MAX_LABELS = 7;
/** Share of each slot left empty around a bar. */
const INNER_PADDING = 0.42;
/** Px kept free above the tallest bar (room for the tooltip anchor). */
const TOP_PADDING = 16;
/** Rounding of each bar's top corners. */
const BAR_RADIUS = 6;
/** Share of a slot (centred) that counts as a tap on its bar — the selection column. */
const HIT_WIDTH = 0.8;
/** Px above a bar's top that still counts as a tap on it. */
const HIT_SLOP_TOP = 12;
/** Minimum tappable height, so short and empty bars stay easy to hit. */
const MIN_HIT_HEIGHT = 28;

/**
 * Premium bar chart: gradient bars rising from a quiet dashed grid, with the
 * highlighted bar at full intensity and the rest receding. Axis labels are
 * plain RN text aligned to each bar's centre. Tapping a bar selects it — it
 * takes the full-intensity treatment over a faint column, with a value
 * tooltip on top. Tapping it again, or anywhere that isn't a bar, clears the
 * selection (see `ChartDismissArea` for taps outside the chart itself).
 */
export function BarTrendChart({
  data,
  highlightIndex = -1,
  color,
  colorDeep,
  height = 180,
  formatValue = String,
}: BarTrendChartProps) {
  const { colors } = useAppTheme();
  // Unique SVG ids per chart instance (several charts share one screen).
  const id = `bar${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [width, setWidth] = useState(0);
  // Remember the label too, so a selection doesn't carry over to a different series.
  const [selection, setSelection] = useState<{ index: number; label: string } | null>(null);
  const selectedIndex =
    selection && data[selection.index]?.label === selection.label ? selection.index : -1;
  const emphasisIndex = selectedIndex >= 0 ? selectedIndex : highlightIndex;

  const maxValue = Math.max(0, ...data.map((point) => point.value));
  const layout = barLayout(data.length, maxValue, width, height, {
    innerPadding: INNER_PADDING,
    topPadding: TOP_PADDING,
  });
  const labelStep = Math.max(1, Math.ceil(data.length / MAX_LABELS));

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  useChartDismiss(() => setSelection(null));

  const toggleBar = (index: number) => {
    void Haptics.selectionAsync();
    setSelection(index === selectedIndex ? null : { index, label: data[index].label });
  };

  // Each slot spans the full chart height; only taps on (or just above) the bar select it.
  const onSlotPress = (index: number, event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    const barTop = layout.y(data[index].value);
    const onBar =
      Math.abs(locationX - layout.slotWidth / 2) <= (layout.slotWidth * HIT_WIDTH) / 2 &&
      locationY >= Math.min(barTop - HIT_SLOP_TOP, layout.baseline - MIN_HIT_HEIGHT);
    if (onBar) {
      toggleBar(index);
    } else {
      setSelection(null);
    }
  };

  const selectedPoint = selectedIndex >= 0 ? data[selectedIndex] : null;

  return (
    <View>
      <View style={{ height }} onLayout={onLayout}>
        {width > 0 && (
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor={color} />
                <Stop offset="1" stopColor={colorDeep} />
              </LinearGradient>
              <LinearGradient id={`${id}-dim`} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor={color} stopOpacity={0.45} />
                <Stop offset="1" stopColor={colorDeep} stopOpacity={0.18} />
              </LinearGradient>
              {/* Cuts the bars off at the baseline so only their top corners are rounded. */}
              <ClipPath id={`${id}-clip`}>
                <Rect x={0} y={0} width={width} height={layout.baseline} />
              </ClipPath>
            </Defs>
            {[0, 1 / 3, 2 / 3].map((fraction) => (
              <Line
                key={fraction}
                x1={0}
                x2={width}
                y1={height * fraction}
                y2={height * fraction}
                stroke={colors.border}
                strokeWidth={1}
                strokeDasharray="4 6"
              />
            ))}
            {selectedIndex >= 0 && (
              <Rect
                x={layout.x(selectedIndex) - (layout.slotWidth * HIT_WIDTH) / 2}
                y={0}
                width={layout.slotWidth * HIT_WIDTH}
                height={height}
                rx={8}
                fill={withAlpha(color, 0.1)}
              />
            )}
            <Line x1={0} x2={width} y1={layout.baseline} y2={layout.baseline} stroke={colors.border} strokeWidth={1} />
            {/* Keyed by position so bars ease to their new heights when the period changes. */}
            <G clipPath={`url(#${id}-clip)`}>
              {data.map((point, index) => (
                <AnimatedBar
                  key={index}
                  x={layout.x(index)}
                  width={layout.barWidth}
                  top={layout.y(point.value)}
                  baseline={layout.baseline}
                  radius={BAR_RADIUS}
                  fill={
                    emphasisIndex < 0 || index === emphasisIndex ? `url(#${id}-bar)` : `url(#${id}-dim)`
                  }
                />
              ))}
            </G>
          </Svg>
        )}
        {width > 0 && (
          <View style={StyleSheet.absoluteFill}>
            <View style={styles.slotRow}>
              {data.map((point, index) => (
                <Pressable
                  key={`${point.label}-${index}`}
                  style={styles.slot}
                  onPress={(event) => onSlotPress(index, event)}
                  accessibilityActions={[{ name: 'activate' }]}
                  onAccessibilityAction={() => toggleBar(index)}
                  accessibilityRole="button"
                  accessibilityLabel={`${point.label}: ${formatValue(point.value)}`}
                  accessibilityState={{ selected: index === selectedIndex }}
                />
              ))}
            </View>
            {selectedPoint && (
              <ChartTooltip
                x={layout.x(selectedIndex)}
                y={layout.y(selectedPoint.value)}
                containerWidth={width}
                value={formatValue(selectedPoint.value)}
                label={selectedPoint.label}
              />
            )}
          </View>
        )}
      </View>
      <View style={styles.axisRow}>
        {data.map((point, index) => (
          <Text
            key={`${point.label}-${index}`}
            numberOfLines={1}
            style={[
              styles.axisLabel,
              {
                color: index === emphasisIndex ? colors.text : colors.textSecondary,
                fontWeight: index === emphasisIndex ? '700' : '500',
              },
            ]}
          >
            {index % labelStep === 0 || index === emphasisIndex ? point.label : ''}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slotRow: {
    flex: 1,
    flexDirection: 'row',
  },
  slot: {
    flex: 1,
  },
  axisRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  axisLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },
});
