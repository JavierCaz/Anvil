import { DashPathEffect, LinearGradient, Line, RoundedRect, vec } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import { Bar, CartesianChart } from 'victory-native';
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

type Scale = (value: number) => number;

/** Most axis labels shown before thinning to every n-th one. */
const MAX_LABELS = 7;
/** Share of each slot left empty around a bar (victory `innerPadding`). */
const INNER_PADDING = 0.42;
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
  const [width, setWidth] = useState(0);
  const [scales, setScales] = useState<{ x: Scale; y: Scale } | null>(null);
  // Remember the label too, so a selection doesn't carry over to a different series.
  const [selection, setSelection] = useState<{ index: number; label: string } | null>(null);
  const selectedIndex =
    selection && data[selection.index]?.label === selection.label ? selection.index : -1;
  const emphasisIndex = selectedIndex >= 0 ? selectedIndex : highlightIndex;

  const chartData = useMemo(() => data.map((point, index) => ({ x: index, y: point.value })), [data]);
  const maxValue = Math.max(0, ...data.map((point) => point.value));
  // Bars sit at the centre of n equal slots, matching the flex label row below.
  const slotPad = width > 0 && data.length > 0 ? width / (2 * data.length) : 0;
  const labelStep = Math.max(1, Math.ceil(data.length / MAX_LABELS));

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  useChartDismiss(() => setSelection(null));

  const toggleBar = (index: number) => {
    void Haptics.selectionAsync();
    setSelection(index === selectedIndex ? null : { index, label: data[index].label });
  };

  // Each slot spans the full chart height; only taps on (or just above) the bar select it.
  const onSlotPress = (index: number, event: GestureResponderEvent) => {
    const slotWidth = width / data.length;
    const { locationX, locationY } = event.nativeEvent;
    const baseline = scales ? scales.y(0) : height;
    const barTop = scales ? scales.y(data[index].value) : 0;
    const onBar =
      Math.abs(locationX - slotWidth / 2) <= (slotWidth * HIT_WIDTH) / 2 &&
      locationY >= Math.min(barTop - HIT_SLOP_TOP, baseline - MIN_HIT_HEIGHT);
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
          <CartesianChart
            data={chartData}
            xKey="x"
            yKeys={['y']}
            domain={{ y: [0, maxValue > 0 ? maxValue : 1] }}
            domainPadding={{ left: slotPad, right: slotPad, top: 16 }}
            onScaleChange={(x, y) => setScales({ x, y })}
          >
            {({ points, chartBounds }) => {
              const gridYs = [0, 1 / 3, 2 / 3].map(
                (fraction) => chartBounds.top + (chartBounds.bottom - chartBounds.top) * fraction
              );
              const highlighted = emphasisIndex >= 0 ? points.y[emphasisIndex] : undefined;
              const slotWidth = data.length > 0 ? (chartBounds.right - chartBounds.left) / data.length : 0;
              const selectedX = selectedIndex >= 0 ? points.y[selectedIndex]?.x : undefined;
              const gradientStart = vec(0, chartBounds.top);
              const gradientEnd = vec(0, chartBounds.bottom);
              return (
                <>
                  {gridYs.map((y) => (
                    <Line
                      key={y}
                      p1={vec(chartBounds.left, y)}
                      p2={vec(chartBounds.right, y)}
                      color={colors.border}
                      strokeWidth={1}
                    >
                      <DashPathEffect intervals={[4, 6]} />
                    </Line>
                  ))}
                  {selectedX !== undefined && (
                    <RoundedRect
                      x={selectedX - (slotWidth * HIT_WIDTH) / 2}
                      y={chartBounds.top}
                      width={slotWidth * HIT_WIDTH}
                      height={chartBounds.bottom - chartBounds.top}
                      r={8}
                      color={withAlpha(color, 0.1)}
                    />
                  )}
                  <Line
                    p1={vec(chartBounds.left, chartBounds.bottom)}
                    p2={vec(chartBounds.right, chartBounds.bottom)}
                    color={colors.border}
                    strokeWidth={1}
                  />
                  <Bar
                    points={points.y}
                    chartBounds={chartBounds}
                    innerPadding={INNER_PADDING}
                    roundedCorners={{ topLeft: 6, topRight: 6 }}
                    animate={{ type: 'timing', duration: 450 }}
                  >
                    <LinearGradient
                      start={gradientStart}
                      end={gradientEnd}
                      colors={
                        highlighted
                          ? [withAlpha(color, 0.45), withAlpha(colorDeep, 0.18)]
                          : [color, colorDeep]
                      }
                    />
                  </Bar>
                  {highlighted && (
                    <Bar
                      points={[highlighted]}
                      chartBounds={chartBounds}
                      barCount={points.y.length}
                      innerPadding={INNER_PADDING}
                      roundedCorners={{ topLeft: 6, topRight: 6 }}
                      animate={{ type: 'timing', duration: 450 }}
                    >
                      <LinearGradient start={gradientStart} end={gradientEnd} colors={[color, colorDeep]} />
                    </Bar>
                  )}
                </>
              );
            }}
          </CartesianChart>
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
            {selectedPoint && scales && (
              <ChartTooltip
                x={scales.x(selectedIndex)}
                y={scales.y(selectedPoint.value)}
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
