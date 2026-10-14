import { DashPathEffect, LinearGradient, Line, vec } from '@shopify/react-native-skia';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';
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
}

/** Most axis labels shown before thinning to every n-th one. */
const MAX_LABELS = 7;

/**
 * Premium bar chart: gradient bars rising from a quiet dashed grid, with the
 * highlighted bar at full intensity and the rest receding. Axis labels are
 * plain RN text aligned to each bar's centre.
 */
export function BarTrendChart({
  data,
  highlightIndex = -1,
  color,
  colorDeep,
  height = 180,
}: BarTrendChartProps) {
  const { colors } = useAppTheme();
  const [width, setWidth] = useState(0);

  const chartData = useMemo(() => data.map((point, index) => ({ x: index, y: point.value })), [data]);
  const maxValue = Math.max(0, ...data.map((point) => point.value));
  // Bars sit at the centre of n equal slots, matching the flex label row below.
  const slotPad = width > 0 && data.length > 0 ? width / (2 * data.length) : 0;
  const labelStep = Math.max(1, Math.ceil(data.length / MAX_LABELS));

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

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
          >
            {({ points, chartBounds }) => {
              const gridYs = [0, 1 / 3, 2 / 3].map(
                (fraction) => chartBounds.top + (chartBounds.bottom - chartBounds.top) * fraction
              );
              const highlighted = highlightIndex >= 0 ? points.y[highlightIndex] : undefined;
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
                  <Line
                    p1={vec(chartBounds.left, chartBounds.bottom)}
                    p2={vec(chartBounds.right, chartBounds.bottom)}
                    color={colors.border}
                    strokeWidth={1}
                  />
                  <Bar
                    points={points.y}
                    chartBounds={chartBounds}
                    innerPadding={0.42}
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
                      innerPadding={0.42}
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
      </View>
      <View style={styles.axisRow}>
        {data.map((point, index) => (
          <Text
            key={`${point.label}-${index}`}
            numberOfLines={1}
            style={[
              styles.axisLabel,
              {
                color: index === highlightIndex ? colors.text : colors.textSecondary,
                fontWeight: index === highlightIndex ? '700' : '500',
              },
            ]}
          >
            {index % labelStep === 0 || index === highlightIndex ? point.label : ''}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
