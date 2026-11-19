import dayjs from 'dayjs';
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
import Svg, { Circle, Line } from 'react-native-svg';
import { AnimatedCurve } from '@/components/charts/animated-svg';
import { linearScale } from '@/components/charts/chart-geometry';
import { ChartTooltip } from '@/components/charts/ChartTooltip';
import { useChartDismiss } from '@/components/charts/chart-dismiss';
import { useAppTheme } from '@/theme/app-theme-provider';
import { withAlpha } from '@/theme/colors';

export interface LineTrendPoint {
  /** Local day ('YYYY-MM-DD') — positions the point on a true time axis. */
  day: string;
  /** Raw value (display unit). */
  value: number;
  /** Smoothed value (display unit), drawn as the trend line. */
  average: number;
}

interface LineTrendChartProps {
  data: LineTrendPoint[];
  /** Optional dashed reference line (display unit), e.g. a goal. */
  reference?: number | null;
  /** Labels under the chart's left and right edges. */
  startLabel?: string;
  endLabel?: string;
  height?: number;
  /** Tooltip figure for a tapped point (e.g. "72.4 kg"); defaults to the raw value. */
  formatValue?: (value: number) => string;
  /** Tooltip context for a tapped point; defaults to the 'YYYY-MM-DD' day. */
  formatDay?: (day: string) => string;
}

/** Vertical breathing room above/below the data, as a share of its span. */
const Y_PADDING = 0.15;
/** Minimum y span so a flat series doesn't render as noise. */
const MIN_Y_SPAN = 2;
/** Px from a weigh-in that still counts as a tap on it. */
const HIT_RADIUS = 24;
/** Horizontal inset so the first/last points aren't clipped at the edges. */
const X_PADDING = 10;

/**
 * Trend line chart: faint raw points under a bold smoothed line, an optional
 * dashed reference (goal) line, over the same quiet dashed grid as
 * `BarTrendChart`. Points are spaced by real time, so gaps between
 * weigh-ins read as gaps. Tapping a weigh-in selects it: a guide line and an
 * enlarged marker pick it out, with a value tooltip. Tapping it again, or
 * anywhere away from a point, clears the selection.
 */
export function LineTrendChart({
  data,
  reference = null,
  startLabel,
  endLabel,
  height = 180,
  formatValue = String,
  formatDay = (day: string) => day,
}: LineTrendChartProps) {
  const { colors } = useAppTheme();
  const [width, setWidth] = useState(0);
  // Keyed by day so the selection survives re-renders and drops when the day leaves the range.
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const selectedIndex = selectedDay === null ? -1 : data.findIndex((point) => point.day === selectedDay);

  const chartData = useMemo(() => {
    const first = data[0] ? dayjs(data[0].day) : null;
    return data.map((point) => ({
      x: first ? dayjs(point.day).diff(first, 'day') : 0,
      value: point.value,
      average: point.average,
    }));
  }, [data]);

  const yDomain = useMemo<[number, number]>(() => {
    const values = data.flatMap((point) => [point.value, point.average]);
    if (reference !== null) values.push(reference);
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (max - min < MIN_Y_SPAN) {
      const mid = (max + min) / 2;
      min = mid - MIN_Y_SPAN / 2;
      max = mid + MIN_Y_SPAN / 2;
    }
    const pad = (max - min) * Y_PADDING;
    return [min - pad, max + pad];
  }, [data, reference]);

  const { scales, rawPoints, averagePoints } = useMemo(() => {
    const lastX = chartData.length > 0 ? chartData[chartData.length - 1].x : 0;
    const x = linearScale([0, lastX], [X_PADDING, width - X_PADDING]);
    const y = linearScale(yDomain, [height, 0]);
    return {
      scales: { x, y },
      rawPoints: chartData.map((point) => ({ x: x(point.x), y: y(point.value) })),
      averagePoints: chartData.map((point) => ({ x: x(point.x), y: y(point.average) })),
    };
  }, [chartData, yDomain, width, height]);

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  useChartDismiss(() => setSelectedDay(null));

  const onPress = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    let nearest = -1;
    let nearestDistance = HIT_RADIUS;
    rawPoints.forEach((point, index) => {
      const distance = Math.hypot(point.x - locationX, point.y - locationY);
      if (distance <= nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });
    if (nearest < 0) {
      setSelectedDay(null);
      return;
    }
    void Haptics.selectionAsync();
    setSelectedDay(nearest === selectedIndex ? null : data[nearest].day);
  };

  const selectedPoint = selectedIndex >= 0 ? data[selectedIndex] : null;
  const selected = selectedIndex >= 0 ? rawPoints[selectedIndex] : undefined;

  return (
    <View>
      <View style={{ height }} onLayout={onLayout}>
        {width > 0 && data.length > 0 && (
          <Svg width={width} height={height}>
            {[0, 1 / 3, 2 / 3, 1].map((fraction) => (
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
            {reference !== null && (
              <Line
                x1={0}
                x2={width}
                y1={scales.y(reference)}
                y2={scales.y(reference)}
                stroke={colors.success}
                strokeWidth={1.5}
                strokeDasharray="8 6"
              />
            )}
            {selected && (
              <Line
                x1={selected.x}
                x2={selected.x}
                y1={0}
                y2={height}
                stroke={withAlpha(colors.primary, 0.5)}
                strokeWidth={1.5}
                strokeDasharray="3 4"
              />
            )}
            {rawPoints.map((point, index) => (
              <Circle
                key={data[index].day}
                cx={point.x}
                cy={point.y}
                r={3}
                fill={withAlpha(colors.textSecondary, 0.55)}
              />
            ))}
            <AnimatedCurve points={averagePoints} stroke={colors.primary} strokeWidth={3} />
            {selected && (
              <>
                <Circle cx={selected.x} cy={selected.y} r={7} fill={colors.surface} />
                <Circle cx={selected.x} cy={selected.y} r={5} fill={colors.primary} />
              </>
            )}
          </Svg>
        )}
        {width > 0 && data.length > 0 && (
          <View style={StyleSheet.absoluteFill}>
            <Pressable style={styles.hitArea} onPress={onPress} />
            {selectedPoint && selected && (
              <ChartTooltip
                x={selected.x}
                y={selected.y}
                containerWidth={width}
                value={formatValue(selectedPoint.value)}
                label={formatDay(selectedPoint.day)}
              />
            )}
          </View>
        )}
      </View>
      {(startLabel || endLabel) && (
        <View style={styles.axisRow}>
          <Text style={[styles.axisLabel, { color: colors.textSecondary }]}>{startLabel}</Text>
          <Text style={[styles.axisLabel, { color: colors.textSecondary }]}>{endLabel}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    flex: 1,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  axisLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },
});
