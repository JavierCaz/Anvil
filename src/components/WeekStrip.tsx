import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';

export interface WeekDayItem {
  /** ISO date (`YYYY-MM-DD`). */
  iso: string;
  /** Short weekday label (e.g. "Mon"). */
  label: string;
  /** Day of month (1–31). */
  dayOfMonth: number;
  isToday: boolean;
  workedOut: boolean;
}

interface WeekStripProps {
  days: WeekDayItem[];
}

/**
 * A Mon–Sun row of day tiles. Days with a logged workout are filled with
 * forge orange; today is outlined; the rest sit quietly on the surface.
 */
export function WeekStrip({ days }: WeekStripProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      {days.map((day) => (
        <View key={day.iso} style={styles.column}>
          <Text
            style={[styles.label, { color: day.isToday ? colors.primary : colors.textSecondary }]}
          >
            {day.label}
          </Text>
          <View
            style={[
              styles.circle,
              {
                backgroundColor: day.workedOut ? colors.primary : colors.surfaceElevated,
                borderColor: day.isToday ? colors.primary : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                styles.dayNumber,
                { color: day.workedOut ? colors.onPrimary : colors.text },
              ]}
            >
              {day.dayOfMonth}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
