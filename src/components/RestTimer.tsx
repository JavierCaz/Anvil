import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useWorkoutToolsStore } from '@/store/workout-tools';
import { useAppTheme } from '@/theme/app-theme-provider';
import {
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

/**
 * A deadline callback that runs later than this was frozen in the background —
 * the notification already sounded, so the in-app chime is skipped.
 */
const LATE_FIRE_THRESHOLD_MS = 1500;

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Headless alarm for the rest countdown. Mount it once for the whole session
 * (the session screen stays mounted while exercise screens are pushed on top)
 * so the rest keeps running — and rings — wherever the user is in the workout.
 *
 * A background notification is scheduled for the deadline so the alarm sounds
 * while the screen is locked; in the foreground the in-app chime + vibration
 * play instead. Skipping moves the deadline to now, so it still rings.
 */
export function RestTimerAlarm() {
  const { t } = useTranslation();
  const player = useAudioPlayer(ALARM_SOUND);
  const endAt = useWorkoutToolsStore((state) => state.rest?.endAt ?? null);

  useEffect(() => {
    configureAlarmAudioMode();
  }, []);

  // (Re)arm the alarm whenever the deadline changes; clearing the rest cancels it.
  useEffect(() => {
    if (endAt === null) {
      cancelAlarmNotification(REST_TIMER_NOTIFICATION_ID);
      return;
    }

    const finish = () => {
      const late = Date.now() - endAt > LATE_FIRE_THRESHOLD_MS;
      if (AppState.currentState === 'active' && !late) {
        cancelAlarmNotification(REST_TIMER_NOTIFICATION_ID);
        playAlarm(player);
      } else {
        // Ran out while backgrounded — the notification already sounded.
        dismissAlarmNotification(REST_TIMER_NOTIFICATION_ID);
      }
      useWorkoutToolsStore.getState().clearRest();
    };

    const msLeft = endAt - Date.now();
    if (msLeft > 0) {
      void scheduleAlarmNotification({
        identifier: REST_TIMER_NOTIFICATION_ID,
        channelId: REST_TIMER_CHANNEL_ID,
        channelName: t('workout.rest'),
        title: t('workout.restFinishedTitle'),
        body: t('workout.restFinishedBody'),
        delaySeconds: msLeft / 1000,
      });
    }
    const timeout = setTimeout(finish, Math.max(0, msLeft));

    // JS timers are frozen in the background — catch up as soon as we return.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && Date.now() >= endAt) {
        clearTimeout(timeout);
        finish();
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.remove();
    };
  }, [endAt, player, t]);

  // Session over — drop any pending alarm.
  useEffect(() => {
    return () => cancelAlarmNotification(REST_TIMER_NOTIFICATION_ID);
  }, []);

  return null;
}

/**
 * Rest countdown banner between sets, with skip / +30s actions. Reads the
 * session-wide rest from the workout tools store, so it can be rendered on any
 * workout screen and shows the same countdown; renders nothing when idle.
 * Ringing is handled by `RestTimerAlarm`.
 */
export function RestTimer() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const endAt = useWorkoutToolsStore((state) => state.rest?.endAt ?? null);
  const [now, setNow] = useState(() => Date.now());

  // Tick from the deadline; the first sync runs before paint so a newly started
  // (or re-entered) rest never flashes a stale value.
  useLayoutEffect(() => {
    if (endAt === null) {
      return;
    }
    const update = () => setNow(Date.now());
    update();
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, [endAt]);

  if (endAt === null || endAt <= now) {
    return null;
  }
  const remaining = Math.ceil((endAt - now) / 1000);

  const handleExtend = () => {
    useWorkoutToolsStore.getState().extendRest(EXTEND_SECONDS);
  };

  const handleSkip = () => {
    useWorkoutToolsStore.getState().skipRest();
  };

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
