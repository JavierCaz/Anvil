import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import Storage from 'expo-sqlite/kv-store';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, Platform } from 'react-native';
import { useDialog } from '@/components/AppDialog';

/** kv-store key marking that the one-time exact-alarm prompt has been shown. */
const EXACT_ALARM_PROMPT_KEY = 'anvil.notifications.exactAlarmPrompted';

/**
 * Android 14+ no longer auto-grants `SCHEDULE_EXACT_ALARM`. Without it,
 * expo-notifications falls back to inexact alarms, which Android batches while
 * the screen is locked — so the rest-timer notification rings late.
 *
 * This one-time prompt (shown only after notifications are already granted,
 * right when the app returns to the foreground) walks the user through the
 * "Alarms & reminders" special-access screen. On Android 12/13 the permission
 * is granted on install and on older Android exact alarms need no permission,
 * so this component renders nothing there.
 */
export function AndroidExactAlarmPermissionPrompt() {
  const { t } = useTranslation();
  const dialog = useDialog();
  const shownRef = useRef(false);

  const openAlarmAccess = () => {
    const pkg = Constants.expoConfig?.android?.package;
    void IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.REQUEST_SCHEDULE_EXACT_ALARM, {
      // Scope the settings page to this app so the user toggles the right entry.
      data: pkg ? `package:${pkg}` : undefined,
    }).catch(() => {
      // Settings screen unavailable (e.g. an OEM without it) — the timer still
      // rings in the foreground; only locked-screen timing is affected.
    });
  };

  const maybePrompt = useCallback(async () => {
    if (Platform.OS !== 'android' || shownRef.current) {
      return;
    }
    // API < 34: exact alarms are auto-granted (12/13) or need no permission.
    if (Number(Platform.Version) < 34) {
      return;
    }
    let alreadyPrompted = false;
    try {
      alreadyPrompted = Storage.getItemSync(EXACT_ALARM_PROMPT_KEY) === 'true';
    } catch {
      // KV store unavailable — default to prompting.
    }
    if (alreadyPrompted) {
      return;
    }
    // Pointless until notifications are on — re-checked on later foregrounds.
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    // Mark as prompted before showing so a re-mount / double-invoked effect
    // never stacks a second dialog.
    shownRef.current = true;
    void Storage.setItem(EXACT_ALARM_PROMPT_KEY, 'true').catch(() => {});

    dialog.alert({
      title: t('notifications.exactAlarmTitle'),
      message: t('notifications.exactAlarmMessage'),
      icon: 'alarm-outline',
      tone: 'info',
      buttons: [
        {
          text: t('notifications.allowExactAlarms'),
          onPress: openAlarmAccess,
        },
        {
          text: t('common.notNow'),
          style: 'cancel',
        },
      ],
    });
  }, [dialog, t]);

  useEffect(() => {
    void maybePrompt();
    // Also re-check when the app returns to the foreground — e.g. right after
    // the user grants notification permission via the first-launch prompt.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void maybePrompt();
      }
    });
    return () => subscription.remove();
  }, [maybePrompt]);

  return null;
}
