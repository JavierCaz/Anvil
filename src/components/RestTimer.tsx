import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';
import {
  ALARM_DURATION_MS,
  ALARM_SOUND,
  cancelAlarmNotification,
  configureAlarmAudioMode,
  dismissAlarmNotification,
  playAlarm,
  scheduleAlarmNotification,
} from '@/utils/alarm';

/** Seconds added when the user taps "+30s". */
const EXTEND_SECONDS = 30;

/** Identifier of the scheduled background alarm notification. */
const REST_TIMER_NOTIFICATION_ID = 'anvil-rest-timer';

/** Android notification channel used by the rest timer alarm. */
const REST_TIMER_CHANNEL_ID = 'rest-timer';

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
 *
 * The countdown is driven by an absolute deadline instead of a decrementing
 * timer, so it stays accurate even when the app is backgrounded and JS timers
 * are frozen. A local notification is scheduled for the deadline so the alarm
 * sounds while the screen is locked; on return to the foreground the countdown
 * catches up to where it actually is.
 */
export function RestTimer({ seconds, onDone }: RestTimerProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const player = useAudioPlayer(ALARM_SOUND);
  const [remaining, setRemaining] = useState(seconds);
  // True once the alarm chime is playing — the component stays mounted (so the
  // player isn't released and the sound isn't cut) but hides its UI.
  const [alarmActive, setAlarmActive] = useState(false);

  /** Absolute end timestamp (ms) — the source of truth for the countdown. */
  const endTimeRef = useRef(0);
  const finishedRef = useRef(false);
  const alarmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDoneRef = useRef(onDone);
  const appStateRef = useRef(AppState.currentState);

  // Keep the latest `onDone` available to timers/listeners without re-binding.
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    configureAlarmAudioMode();
  }, []);

  // Schedule (or replace) the background alarm notification for the deadline.
  // Passing the same identifier replaces any previously scheduled one.
  const scheduleNotification = useCallback(
    (delaySeconds: number) =>
      scheduleAlarmNotification({
        identifier: REST_TIMER_NOTIFICATION_ID,
        channelId: REST_TIMER_CHANNEL_ID,
        channelName: t('workout.rest'),
        title: t('workout.restFinishedTitle'),
        body: t('workout.restFinishedBody'),
        delaySeconds,
      }),
    [t]
  );

  // Schedule the alarm on mount and anchor the deadline. The parent remounts
  // this component (via `key`) for every rest period, so this runs once per rest.
  useEffect(() => {
    endTimeRef.current = Date.now() + seconds * 1000;
    void scheduleNotification(seconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only, see above
  }, []);

  // Cancel a pending alarm if the timer is skipped or dismissed early.
  useEffect(() => {
    return () => {
      if (alarmTimerRef.current) {
        clearTimeout(alarmTimerRef.current);
      }
      cancelAlarmNotification(REST_TIMER_NOTIFICATION_ID);
    };
  }, []);

  // Drive the displayed countdown from the deadline.
  useEffect(() => {
    const update = () => {
      setRemaining(Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000)));
    };
    update();
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, []);

  // When the app returns to the foreground, re-sync from the deadline — JS
  // timers are frozen in the background, so restore from where the countdown
  // actually is rather than where it stalled.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      appStateRef.current = state;
      if (state !== 'active') {
        return;
      }
      const msLeft = endTimeRef.current - Date.now();
      if (msLeft <= 0) {
        // Expired while backgrounded — the notification already sounded.
        finishedRef.current = true;
        setRemaining(0);
        dismissAlarmNotification(REST_TIMER_NOTIFICATION_ID);
        alarmTimerRef.current = setTimeout(() => onDoneRef.current(), 0);
        return;
      }
      setRemaining(Math.max(0, Math.ceil(msLeft / 1000)));
    });
    return () => subscription.remove();
  }, []);

  // Handle the countdown reaching zero.
  useEffect(() => {
    if (remaining > 0 || finishedRef.current) {
      return;
    }
    finishedRef.current = true;

    if (appStateRef.current !== 'active') {
      // Deadline passed while backgrounded — the notification handled the
      // alarm; wrap up silently so the chime is not replayed on resume.
      alarmTimerRef.current = setTimeout(() => onDoneRef.current(), 0);
      return;
    }

    // Foreground finish: 3-beep chime + 3 vibration pulses.
    playAlarm(player);
    setAlarmActive(true);
    alarmTimerRef.current = setTimeout(() => onDoneRef.current(), ALARM_DURATION_MS);
  }, [remaining, player]);

  const handleExtend = () => {
    if (finishedRef.current) {
      return;
    }
    endTimeRef.current += EXTEND_SECONDS * 1000;
    const msLeft = endTimeRef.current - Date.now();
    setRemaining(Math.max(0, Math.ceil(msLeft / 1000)));
    void scheduleNotification(msLeft / 1000);
  };

  // Skip ends the rest immediately but still plays the alarm chime so the
  // user hears the "rest is over" cue. The component stays mounted until the
  // chime finishes — unmounting would release the player and cut the sound.
  const handleSkip = () => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    setRemaining(0);
    playAlarm(player);
    setAlarmActive(true);
    alarmTimerRef.current = setTimeout(() => onDoneRef.current(), ALARM_DURATION_MS);
  };

  // Hide the timer the moment the alarm starts — dismissal still happens after
  // the chime finishes (see the comment in `handleSkip`).
  if (alarmActive) {
    return null;
  }

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
          onPress={handleExtend}
          style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={[styles.actionLabel, { color: colors.primary }]}>30s</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('workout.skip')}
          hitSlop={6}
          onPress={handleSkip}
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
