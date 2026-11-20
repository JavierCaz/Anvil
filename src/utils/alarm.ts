import { setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { Platform, Vibration } from 'react-native';
import * as AnvilAlarm from '../../modules/anvil-alarm';

/** Chime played (in-app and by the background notification) when a countdown ends. */
export const ALARM_SOUND = require('../../assets/audio/rest_finished.wav');

/** 3-beep chime (~2.1s) + a little slack before dismissing a timer. */
export const ALARM_DURATION_MS = 2300;

// While the app is in the foreground, alarms are handled by the in-app audio
// player (chime + vibration). The native `anvil-alarm` module skips the
// notification in that case so the sound does not play twice; when the app is
// backgrounded or the screen is locked, the OS delivers it with its sound.

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
    await AnvilAlarm.scheduleAsync({ identifier, channelId, channelName, title, body, delaySeconds });
  } catch {
    // Notifications unavailable (e.g. permission denied).
  }
}

/** Cancel a pending alarm notification. */
export function cancelAlarmNotification(identifier: string) {
  if (Platform.OS === 'web') {
    return;
  }
  AnvilAlarm.cancel(identifier);
}

/** Remove an already-delivered alarm notification from the tray. */
export function dismissAlarmNotification(identifier: string) {
  if (Platform.OS === 'web') {
    return;
  }
  AnvilAlarm.dismiss(identifier);
}
