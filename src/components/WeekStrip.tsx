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
 * A Mon–Sun row of day circles. Days with a logged workout are filled with
 * the primary color; today is outlined.
 */
export function WeekStrip({ days }: WeekStripProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      {days.map((day) => (
        <View key={day.iso} style={styles.column}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{day.label}</Text>
          <View
            style={[
              styles.circle,
              { borderColor: day.isToday || day.workedOut ? colors.primary : colors.border },
              day.workedOut && { backgroundColor: colors.primary },
              day.isToday && !day.workedOut && styles.todayRing,
            ]}
          >
            <Text
              style={[
                styles.dayNumber,
                { color: day.workedOut ? colors.background : colors.text },
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
    fontSize: 12,
    textTransform: 'capitalize',
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayRing: {
    borderWidth: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
});
