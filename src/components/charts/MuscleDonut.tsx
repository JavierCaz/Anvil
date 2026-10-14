import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pie, PolarChart } from 'victory-native';
import { useAppTheme } from '@/theme/app-theme-provider';

// A type alias (not an interface) so it satisfies victory's Record<string, unknown> data constraint.
export type DonutSlice = {
  label: string;
  value: number;
  color: string;
};

interface MuscleDonutProps {
  slices: DonutSlice[];
  /** Caption under the centre total (e.g. "sets"). */
  centerCaption: string;
  size?: number;
}

/**
 * Donut with hairline gaps between slices, the total in its centre, and a
 * ranked legend where each row carries its own share bar.
 */
export function MuscleDonut({ slices, centerCaption, size = 196 }: MuscleDonutProps) {
  const { colors } = useAppTheme();
  const total = useMemo(() => slices.reduce((sum, slice) => sum + slice.value, 0), [slices]);
  const ranked = useMemo(() => [...slices].sort((a, b) => b.value - a.value), [slices]);

  return (
    <View style={styles.root}>
      <View style={[styles.chart, { width: size, height: size }]}>
        <PolarChart data={slices} labelKey="label" valueKey="value" colorKey="color">
          <Pie.Chart innerRadius="74%">
            {() => (
              <>
                <Pie.Slice />
                {slices.length > 1 && (
                  <Pie.SliceAngularInset
                    angularInset={{ angularStrokeWidth: 4, angularStrokeColor: colors.surface }}
                  />
                )}
              </>
            )}
          </Pie.Chart>
        </PolarChart>
        <View style={styles.center} pointerEvents="none">
          <Text style={[styles.total, { color: colors.text }]}>{total}</Text>
          <Text style={[styles.caption, { color: colors.textSecondary }]}>{centerCaption}</Text>
        </View>
      </View>

      <View style={styles.legend}>
        {ranked.map((slice, index) => {
          const share = total > 0 ? slice.value / total : 0;
          return (
            <View key={`${slice.label}-${index}`} style={styles.legendRow}>
              <View style={[styles.swatch, { backgroundColor: slice.color }]} />
              <Text style={[styles.legendLabel, { color: colors.text }]} numberOfLines={1}>
                {slice.label}
              </Text>
              <View style={[styles.shareTrack, { backgroundColor: colors.surfaceElevated }]}>
                <View
                  style={[styles.shareFill, { backgroundColor: slice.color, width: `${share * 100}%` }]}
                />
              </View>
              <Text style={[styles.legendValue, { color: colors.textSecondary }]}>
                {Math.round(share * 100)}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 20,
  },
  chart: {
    alignSelf: 'center',
  },
  center: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  total: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  caption: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  legend: {
    gap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendLabel: {
    width: 104,
    fontSize: 13,
    fontWeight: '600',
  },
  shareTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  shareFill: {
    height: '100%',
    borderRadius: 3,
  },
  legendValue: {
    width: 38,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
});
