import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import type { BodyWeightGoal } from '@/store/body-weight-goal';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import { withAlpha } from '@/theme/colors';
import { formatBodyWeightWithUnit, isTowardGoal, trendDirection } from '@/utils/body-weight';

interface BodyWeightDeltaProps {
  deltaKg: number;
  goal: BodyWeightGoal | null;
  /** Context after the amount, e.g. "since Oct 8". */
  label: string;
}

const ICONS = {
  up: 'caret-up',
  down: 'caret-down',
  stable: 'remove',
} as const;

/**
 * Bodyweight change chip. Gaining or losing isn't inherently good, so the
 * color only turns positive when the change moves toward the user's goal.
 */
export function BodyWeightDelta({ deltaKg, goal, label }: BodyWeightDeltaProps) {
  const { colors } = useAppTheme();
  const unit = useUnitsStore((state) => state.unitSystem);
  const direction = trendDirection(deltaKg);
  const tint = isTowardGoal(deltaKg, goal) ? colors.success : colors.textSecondary;

  return (
    <View style={styles.row}>
      <View style={[styles.chip, { backgroundColor: withAlpha(tint, 0.14) }]}>
        <Ionicons name={ICONS[direction]} size={12} color={tint} />
        <Text style={[styles.amount, { color: tint }]}>
          {formatBodyWeightWithUnit(Math.abs(deltaKg), unit)}
        </Text>
      </View>
      <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  amount: {
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 12,
    flexShrink: 1,
  },
});
