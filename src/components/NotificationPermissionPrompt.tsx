import * as Notifications from 'expo-notifications';
import Storage from 'expo-sqlite/kv-store';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { useDialog } from '@/components/AppDialog';

/** kv-store key marking that the one-time permission prompt has been shown. */
const NOTIFICATION_PROMPT_KEY = 'anvil.notifications.prompted';

/**
 * One-time first-launch prompt explaining why notifications are required — the
 * rest-timer alarm has to sound while the app is in the background or the
 * screen is locked — before asking the OS for permission. Renders nothing;
 * no-op on web.
 */
export function NotificationPermissionPrompt() {
  const { t } = useTranslation();
  const dialog = useDialog();
  const handledRef = useRef(false);

  useEffect(() => {
    if (Platform.OS === 'web' || handledRef.current) {
      return;
    }
    handledRef.current = true;

    let alreadyPrompted = false;
    try {
      alreadyPrompted = Storage.getItemSync(NOTIFICATION_PROMPT_KEY) === 'true';
    } catch {
      // KV store unavailable — default to prompting.
    }
    if (alreadyPrompted) {
      return;
    }

    // Mark as prompted before showing so a re-mount / double-invoked effect
    // never stacks a second dialog. If the user dismisses, we don't re-ask —
    // they can still enable notifications later from system settings.
    void Storage.setItem(NOTIFICATION_PROMPT_KEY, 'true').catch(() => {});

    dialog.alert({
      title: t('notifications.promptTitle'),
      message: t('notifications.promptMessage'),
      icon: 'notifications-outline',
      tone: 'info',
      buttons: [
        {
          text: t('notifications.enable'),
          onPress: () => {
            void Notifications.requestPermissionsAsync().catch(() => {});
          },
        },
        {
          text: t('common.notNow'),
          style: 'cancel',
        },
      ],
    });
  }, [dialog, t]);

  return null;
}
