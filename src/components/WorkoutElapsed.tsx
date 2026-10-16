import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';
import { hairline, radius } from '@/theme/tokens';

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

interface WorkoutElapsedHeaderTitleProps {
  startedAt: string | null | undefined;
  /**
   * Informative "up next" exercise shown after the duration. A name shows that
   * exercise, `null` means no other exercise is pending, `undefined` hides it.
   */
  nextExerciseName?: string | null;
  /** Tapping the next exercise (e.g. to show its info card). Ignored when none is pending. */
  onNextExercisePress?: () => void;
}

/**
 * Live session duration (plus the next exercise, when given), used as the
 * header title on screens pushed on top of the session.
 */
export function WorkoutElapsedHeaderTitle({
  startedAt,
  nextExerciseName,
  onNextExercisePress,
}: WorkoutElapsedHeaderTitleProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const elapsed = formatElapsed(useElapsedSeconds(startedAt));
  const nextLabel = nextExerciseName ?? t('workout.lastExercise');
  const nextPressable = Boolean(nextExerciseName && onNextExercisePress);

  return (
    // Leave room for the back button and the tools button on either side.
    <View style={[styles.row, { maxWidth: width - HEADER_SIDE_RESERVE * 2 }]}>
      <View
        style={styles.group}
        accessible
        accessibilityLabel={`${t('workout.elapsed')}: ${elapsed}`}
      >
        <Ionicons name="time" size={16} color={colors.primary} />
        <Text style={[styles.elapsed, { color: colors.text }]}>{elapsed}</Text>
      </View>
      {nextExerciseName !== undefined && (
        <Pressable
          // Outlined pill (with an info glyph) so it reads as tappable.
          style={({ pressed }) => [
            styles.group,
            styles.next,
            nextPressable && [
              styles.nextPill,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ],
            { opacity: pressed && nextPressable ? 0.6 : 1 },
          ]}
          disabled={!nextPressable}
          onPress={onNextExercisePress}
          hitSlop={8}
          accessibilityRole={nextPressable ? 'button' : undefined}
          accessibilityLabel={`${t('workout.nextExercise')}: ${nextLabel}`}
        >
          <Ionicons name="play-skip-forward" size={14} color={colors.textSecondary} />
          <Text
            style={[styles.nextName, { color: nextExerciseName ? colors.text : colors.textSecondary }]}
            numberOfLines={1}
          >
            {nextLabel}
          </Text>
          {nextPressable && (
            <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
          )}
        </Pressable>
      )}
    </View>
  );
}

/** Approximate width taken by the header's side buttons (back arrow / tools). */
const HEADER_SIDE_RESERVE = 72;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  elapsed: {
    fontSize: 17,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  next: {
    flexShrink: 1,
  },
  nextPill: {
    borderRadius: radius.pill,
    borderWidth: hairline,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  nextName: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '600',
  },
});
