package expo.modules.anvilalarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Receives the AlarmManager broadcast and posts the alarm notification. */
class AlarmReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != AlarmNotifier.ACTION_FIRE) {
      return
    }
    val identifier = intent.getStringExtra(AlarmNotifier.EXTRA_IDENTIFIER) ?: return
    val channelId = intent.getStringExtra(AlarmNotifier.EXTRA_CHANNEL_ID) ?: return
    AlarmNotifier.post(
      context,
      identifier,
      channelId,
      intent.getStringExtra(AlarmNotifier.EXTRA_TITLE).orEmpty(),
      intent.getStringExtra(AlarmNotifier.EXTRA_BODY).orEmpty()
    )
  }
}
