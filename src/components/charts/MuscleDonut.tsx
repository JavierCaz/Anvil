import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import { Pie, PolarChart } from 'victory-native';
import { useChartDismiss } from '@/components/charts/chart-dismiss';
import { INNER_RATIO, sliceAt } from '@/components/charts/slice-hit-test';
import { useAppTheme } from '@/theme/app-theme-provider';
import { withAlpha } from '@/theme/colors';

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
 * ranked legend where each row carries its own share bar. Tapping a slice or
 * its legend row selects it: the other slices recede and the centre shows
 * that muscle's figure and share. Tapping it again, the hole or anywhere off
 * the ring clears it.
 */
export function MuscleDonut({ slices, centerCaption, size = 196 }: MuscleDonutProps) {
  const { colors } = useAppTheme();
  const total = useMemo(() => slices.reduce((sum, slice) => sum + slice.value, 0), [slices]);
  const ranked = useMemo(
    () => slices.map((slice, index) => ({ slice, index })).sort((a, b) => b.slice.value - a.slice.value),
    [slices]
  );
  // Remember the label too, so a selection doesn't carry over to a different breakdown.
  const [selection, setSelection] = useState<{ index: number; label: string } | null>(null);
  const selectedIndex =
    selection && slices[selection.index]?.label === selection.label ? selection.index : -1;
  const selected = selectedIndex >= 0 ? slices[selectedIndex] : null;

  const chartSlices = useMemo(
    () =>
      selectedIndex < 0
        ? slices
        : slices.map((slice, index) =>
            index === selectedIndex ? slice : { ...slice, color: withAlpha(slice.color, 0.22) }
          ),
    [slices, selectedIndex]
  );

  useChartDismiss(() => setSelection(null));

  const select = (index: number | null) => {
    const next = index === null || index === selectedIndex ? null : index;
    if (next === null && selectedIndex < 0) return;
    void Haptics.selectionAsync();
    setSelection(next === null ? null : { index: next, label: slices[next].label });
  };

  const onChartPress = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    select(sliceAt(slices, total, size, locationX, locationY));
  };

  const share = (value: number) => (total > 0 ? value / total : 0);

  return (
    <View style={styles.root}>
      <View style={[styles.chart, { width: size, height: size }]}>
        <PolarChart data={chartSlices} labelKey="label" valueKey="value" colorKey="color">
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
          <Text style={[styles.total, { color: selected ? selected.color : colors.text }]}>
            {selected ? selected.value : total}
          </Text>
          <Text
            style={[styles.caption, { color: colors.textSecondary, maxWidth: size * INNER_RATIO - 16 }]}
            numberOfLines={1}
          >
            {selected ? selected.label : centerCaption}
          </Text>
          {selected && (
            <Text style={[styles.centerShare, { color: colors.textSecondary }]}>
              {Math.round(share(selected.value) * 100)}% · {centerCaption}
            </Text>
          )}
        </View>
        <Pressable style={StyleSheet.absoluteFill} onPress={onChartPress} />
      </View>

      <View style={styles.legend}>
        {ranked.map(({ slice, index }) => {
          const sliceShare = share(slice.value);
          const isSelected = index === selectedIndex;
          return (
            <Pressable
              key={`${slice.label}-${index}`}
              onPress={() => select(index)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.legendRow,
                isSelected && { backgroundColor: colors.surfaceElevated },
                selectedIndex >= 0 && !isSelected && styles.legendRowDimmed,
              ]}
            >
              <View style={[styles.swatch, { backgroundColor: slice.color }]} />
              <Text style={[styles.legendLabel, { color: colors.text }]} numberOfLines={1}>
                {slice.label}
              </Text>
              <View style={[styles.shareTrack, { backgroundColor: colors.surfaceElevated }]}>
                <View
                  style={[styles.shareFill, { backgroundColor: slice.color, width: `${sliceShare * 100}%` }]}
                />
              </View>
              <Text
                style={[
                  styles.legendValue,
                  { color: isSelected ? colors.text : colors.textSecondary },
                ]}
              >
                {Math.round(sliceShare * 100)}%
              </Text>
            </Pressable>
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
  centerShare: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  legend: {
    gap: 2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginHorizontal: -8,
    borderRadius: 8,
  },
  legendRowDimmed: {
    opacity: 0.45,
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
