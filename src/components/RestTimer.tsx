import { Ionicons } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, Platform, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';

const REST_FINISHED_SOUND = require('../../assets/audio/rest_finished.wav');

/** 3-beep chime (~2.1s) + a little slack before dismissing the timer. */
const ALARM_DURATION_MS = 2300;

/** Seconds added when the user taps "+30s". */
const EXTEND_SECONDS = 30;

/** Identifier of the scheduled background alarm notification. */
const REST_TIMER_NOTIFICATION_ID = 'anvil-rest-timer';

/** Android notification channel used by the rest timer alarm. */
const REST_TIMER_CHANNEL_ID = 'rest-timer';

// While the app is in the foreground, the alarm is handled by the in-app audio
// player (chime + vibration) — suppress the notification so the sound does not
// play twice. When the app is backgrounded or the screen is locked, the OS
// delivers the notification with its sound normally.
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: false,
      shouldShowList: false,
    }),
  });
}

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
  const player = useAudioPlayer(REST_FINISHED_SOUND);
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

  // Configure the audio session so the alarm mixes with (rather than pauses)
  // music from other apps: iOS `.mixWithOthers`, Android no audio-focus.
  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }
    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
    }).catch(() => {});
  }, []);

  // Schedule (or replace) the background alarm notification for the deadline.
  // Passing the same identifier replaces any previously scheduled one.
  const scheduleNotification = useCallback(
    async (delaySeconds: number) => {
      if (Platform.OS === 'web') {
        return;
      }
      try {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync(REST_TIMER_CHANNEL_ID, {
            name: t('workout.rest'),
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'rest_finished.wav',
            vibrationPattern: [0, 400, 200, 400],
          });
        }
        await Notifications.scheduleNotificationAsync({
          identifier: REST_TIMER_NOTIFICATION_ID,
          content: {
            title: t('workout.restFinishedTitle'),
            body: t('workout.restFinishedBody'),
            sound: 'rest_finished.wav',
            data: { type: 'anvil-rest-timer' },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: Math.max(1, Math.round(delaySeconds)),
            channelId: Platform.OS === 'android' ? REST_TIMER_CHANNEL_ID : undefined,
          },
        });
      } catch {
        // Notifications unavailable (e.g. permission denied) — the countdown
        // still catches up to zero when the app returns to the foreground.
      }
    },
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
      if (Platform.OS !== 'web') {
        void Notifications.cancelScheduledNotificationAsync(
          REST_TIMER_NOTIFICATION_ID
        ).catch(() => {});
      }
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
        if (Platform.OS !== 'web') {
          void Notifications.dismissNotificationAsync(REST_TIMER_NOTIFICATION_ID).catch(() => {});
        }
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
    void player.seekTo(0);
    player.play();
    fireAlarmVibration();
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
    void player.seekTo(0);
    player.play();
    fireAlarmVibration();
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
