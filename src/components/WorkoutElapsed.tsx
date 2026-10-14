import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';
import { hairline, radius, typography } from '@/theme/tokens';

/** `hh:mm:ss` session duration. */
export function formatElapsed(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':');
}

/**
 * Live seconds since the session started. Derived from `startedAt` on every
 * tick, so it stays accurate even if the screen was backgrounded.
 */
export function useElapsedSeconds(startedAt: string | null | undefined): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return startedAt ? Math.max(0, dayjs(now).diff(dayjs(startedAt), 'second')) : 0;
}

interface WorkoutElapsedBarProps {
  startedAt: string | null | undefined;
}

/** Compact session-duration readout for screens pushed on top of the session. */
export function WorkoutElapsedBar({ startedAt }: WorkoutElapsedBarProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const elapsedSeconds = useElapsedSeconds(startedAt);

  return (
    <View style={[styles.bar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Ionicons name="time" size={16} color={colors.primary} />
      <Text style={[typography.overline, styles.label, { color: colors.textSecondary }]}>
        {t('workout.elapsed')}
      </Text>
      <Text style={[styles.value, { color: colors.text }]}>{formatElapsed(elapsedSeconds)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.lg,
    borderWidth: hairline,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  label: {
    flex: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
});
