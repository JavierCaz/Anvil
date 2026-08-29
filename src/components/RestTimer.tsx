import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';

const REST_FINISHED_SOUND = require('../../assets/audio/rest-finished.wav');

/** 3-beep chime (~2.1s) + a little slack before dismissing the timer. */
const ALARM_DURATION_MS = 2300;

/** Three longer vibration pulses, synced to the beeps (pattern is Android-only). */
function fireAlarmVibration() {
  if (Platform.OS === 'ios') {
    Vibration.vibrate(500);
    setTimeout(() => Vibration.vibrate(500), 750);
    setTimeout(() => Vibration.vibrate(500), 1500);
  } else {
    Vibration.vibrate([0, 500, 250, 500, 250, 500]);
  }
}
interface RestTimerProps {
  /** Countdown duration in seconds. */
  seconds: number;
  /** Called once when the countdown reaches zero. */
  onDone: () => void;
}

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Rest countdown between sets. Mount it (with a stable key) to start; it
 * fires `onDone` when it reaches zero and lets the user skip or extend.
 */
export function RestTimer({ seconds, onDone }: RestTimerProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const player = useAudioPlayer(REST_FINISHED_SOUND);
  const [remaining, setRemaining] = useState(seconds);
  const finishedRef = useRef(false);
  const alarmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear a pending dismiss timeout if the component unmounts early (skip).
  useEffect(() => {
    return () => {
      if (alarmTimerRef.current) {
        clearTimeout(alarmTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (remaining <= 0) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        // Alarm: 3-beep chime + 3 vibration pulses.
        void player.seekTo(0);
        player.play();
        fireAlarmVibration();
        // Keep this component mounted until the chime finishes — unmounting
        // releases the player and would cut the sound short.
        alarmTimerRef.current = setTimeout(onDone, ALARM_DURATION_MS);
      }
      return;
    }
    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, onDone, player]);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.info}>
        <Ionicons name="timer-outline" size={20} color={colors.primary} />
        <Text style={[styles.label, { color: colors.textSecondary }]}>{t('workout.rest')}</Text>
        <Text style={[styles.time, { color: colors.text }]}>{formatCountdown(remaining)}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('workout.extendRest')}
          hitSlop={6}
          onPress={() => setRemaining((value) => value + 30)}
          style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={[styles.actionLabel, { color: colors.primary }]}>30s</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('workout.skip')}
          hitSlop={6}
          onPress={onDone}
          style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{t('workout.skip')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 13,
  },
  time: {
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
