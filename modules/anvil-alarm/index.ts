/**
 * Anvil's local-only alarm notifications.
 *
 * A tiny replacement for `expo-notifications` covering just what the rest timer
 * needs: schedule / cancel / dismiss a one-shot local notification and manage
 * the notification permission. Unlike `expo-notifications` it ships no push
 * (Firebase Cloud Messaging) code, which keeps the Android build free of
 * proprietary Google dependencies (required for F-Droid).
 *
 * The native module is optional: on web and in Jest every call is a no-op.
 */
import { requireOptionalNativeModule } from 'expo';

export interface AlarmOptions {
  /** Stable identifier — scheduling again with the same id replaces it. */
  identifier: string;
  /** Android notification channel id (ignored on iOS). */
  channelId: string;
  /** User-visible Android channel name (ignored on iOS). */
  channelName: string;
  title: string;
  body: string;
  /** Seconds from now until the alarm fires (minimum 1). */
  delaySeconds: number;
}

interface AnvilAlarmNativeModule {
  getPermissionStatusAsync(): Promise<boolean>;
  requestPermissionAsync(): Promise<boolean>;
  scheduleAsync(options: AlarmOptions): Promise<void>;
  cancel(identifier: string): void;
  dismiss(identifier: string): void;
}

const AnvilAlarm = requireOptionalNativeModule<AnvilAlarmNativeModule>('AnvilAlarm');

/** Whether the app may currently post notifications. */
export async function getPermissionStatusAsync(): Promise<boolean> {
  return AnvilAlarm ? AnvilAlarm.getPermissionStatusAsync() : false;
}

/** Ask the OS for notification permission; resolves to whether it was granted. */
export async function requestPermissionAsync(): Promise<boolean> {
  return AnvilAlarm ? AnvilAlarm.requestPermissionAsync() : false;
}

/** Schedule (or replace) a one-shot alarm notification. */
export async function scheduleAsync(options: AlarmOptions): Promise<void> {
  await AnvilAlarm?.scheduleAsync({
    ...options,
    delaySeconds: Math.max(1, Math.round(options.delaySeconds)),
  });
}

/** Cancel a pending alarm before it fires. */
export function cancel(identifier: string): void {
  try {
    AnvilAlarm?.cancel(identifier);
  } catch {
    // Best effort — a stale alarm is caught up when the app foregrounds.
  }
}

/** Remove an already-delivered alarm notification from the tray. */
export function dismiss(identifier: string): void {
  try {
    AnvilAlarm?.dismiss(identifier);
  } catch {
    // Best effort.
  }
}
