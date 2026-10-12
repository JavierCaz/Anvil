import { setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Notifications from 'expo-notifications';
import { Platform, Vibration } from 'react-native';

/** Chime played (in-app and by the background notification) when a countdown ends. */
export const ALARM_SOUND = require('../../assets/audio/rest_finished.wav');

/** Bundled sound file name referenced by notifications / Android channels. */
const ALARM_SOUND_FILE = 'rest_finished.wav';

/** 3-beep chime (~2.1s) + a little slack before dismissing a timer. */
export const ALARM_DURATION_MS = 2300;

// While the app is in the foreground, alarms are handled by the in-app audio
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
export function fireAlarmVibration() {
  if (Platform.OS === 'ios') {
    Vibration.vibrate(500);
    setTimeout(() => Vibration.vibrate(500), 750);
    setTimeout(() => Vibration.vibrate(500), 1500);
  } else {
    Vibration.vibrate([0, 500, 250, 500, 250, 500]);
  }
}

/** Play the chime from the start and fire the matching vibration pulses. */
export function playAlarm(player: AudioPlayer) {
  void player.seekTo(0);
  player.play();
  fireAlarmVibration();
}

/**
 * Configure the audio session so the alarm mixes with (rather than pauses)
 * music from other apps: iOS `.mixWithOthers`, Android no audio-focus.
 */
export function configureAlarmAudioMode() {
  if (Platform.OS === 'web') {
    return;
  }
  void setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: 'mixWithOthers',
  }).catch(() => {});
}

interface AlarmNotificationOptions {
  /** Stable identifier — scheduling again with the same id replaces it. */
  identifier: string;
  /** Android notification channel id. */
  channelId: string;
  /** User-visible Android channel name. */
  channelName: string;
  title: string;
  body: string;
  /** Seconds from now until the alarm fires. */
  delaySeconds: number;
}

/**
 * Schedule (or replace) a background alarm notification. Failures are
 * swallowed — callers catch up to the deadline when the app returns to the
 * foreground anyway.
 */
export async function scheduleAlarmNotification({
  identifier,
  channelId,
  channelName,
  title,
  body,
  delaySeconds,
}: AlarmNotificationOptions) {
  if (Platform.OS === 'web') {
    return;
  }
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(channelId, {
        name: channelName,
        importance: Notifications.AndroidImportance.HIGH,
        sound: ALARM_SOUND_FILE,
        vibrationPattern: [0, 400, 200, 400],
      });
    }
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title,
        body,
        sound: ALARM_SOUND_FILE,
        data: { type: identifier },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.round(delaySeconds)),
        channelId: Platform.OS === 'android' ? channelId : undefined,
      },
    });
  } catch {
    // Notifications unavailable (e.g. permission denied).
  }
}

/** Cancel a pending alarm notification. */
export function cancelAlarmNotification(identifier: string) {
  if (Platform.OS === 'web') {
    return;
  }
  void Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});
}

/** Remove an already-delivered alarm notification from the tray. */
export function dismissAlarmNotification(identifier: string) {
  if (Platform.OS === 'web') {
    return;
  }
  void Notifications.dismissNotificationAsync(identifier).catch(() => {});
}
