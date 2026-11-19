package expo.modules.anvilalarm

import android.Manifest
import android.app.ActivityManager
import android.app.AlarmManager
import android.app.KeyguardManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.os.SystemClock
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat

/**
 * Schedules and posts the rest-timer alarm notifications with plain
 * AlarmManager + NotificationManager — no Google Play Services / Firebase.
 */
internal object AlarmNotifier {
  const val ACTION_FIRE = "expo.modules.anvilalarm.FIRE"
  const val EXTRA_IDENTIFIER = "identifier"
  const val EXTRA_CHANNEL_ID = "channelId"
  const val EXTRA_TITLE = "title"
  const val EXTRA_BODY = "body"

  /** Notifications are tagged with the identifier; the numeric id is constant. */
  private const val NOTIFICATION_ID = 1

  private const val ACCENT_COLOR = 0xFFE86A33.toInt() // forge orange
  private val VIBRATION_PATTERN = longArrayOf(0, 400, 200, 400)

  fun areNotificationsEnabled(context: Context): Boolean {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
      ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) !=
      PackageManager.PERMISSION_GRANTED
    ) {
      return false
    }
    return NotificationManagerCompat.from(context).areNotificationsEnabled()
  }

  fun schedule(context: Context, options: AlarmOptions) {
    ensureChannel(context, options.channelId, options.channelName)

    val intent = fireIntent(context)
      .putExtra(EXTRA_IDENTIFIER, options.identifier)
      .putExtra(EXTRA_CHANNEL_ID, options.channelId)
      .putExtra(EXTRA_TITLE, options.title)
      .putExtra(EXTRA_BODY, options.body)
    val pendingIntent = PendingIntent.getBroadcast(
      context,
      requestCode(options.identifier),
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    val alarmManager = context.getSystemService(AlarmManager::class.java) ?: return
    val triggerAt = SystemClock.elapsedRealtime() + (options.delaySeconds.coerceAtLeast(1.0) * 1000).toLong()
    val canUseExact = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || alarmManager.canScheduleExactAlarms()
    if (canUseExact) {
      alarmManager.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAt, pendingIntent)
    } else {
      // No exact-alarm access: Android may batch this while the screen is locked.
      alarmManager.setAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAt, pendingIntent)
    }
  }

  fun cancel(context: Context, identifier: String) {
    val pendingIntent = PendingIntent.getBroadcast(
      context,
      requestCode(identifier),
      fireIntent(context),
      PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
    ) ?: return
    context.getSystemService(AlarmManager::class.java)?.cancel(pendingIntent)
    pendingIntent.cancel()
  }

  fun dismiss(context: Context, identifier: String) {
    NotificationManagerCompat.from(context).cancel(identifier, NOTIFICATION_ID)
  }

  /** Called by [AlarmReceiver] when the alarm fires. */
  fun post(context: Context, identifier: String, channelId: String, title: String, body: String) {
    // While Anvil is open and visible the in-app chime handles the alarm —
    // skip the notification so the sound doesn't play twice.
    if (isAppVisibleToUser(context) || !areNotificationsEnabled(context)) {
      return
    }

    val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
    }
    val contentIntent = launchIntent?.let {
      PendingIntent.getActivity(
        context,
        requestCode(identifier),
        it,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
      )
    }

    val notification = NotificationCompat.Builder(context, channelId)
      .setSmallIcon(R.drawable.anvil_alarm_notification)
      .setColor(ACCENT_COLOR)
      .setContentTitle(title)
      .setContentText(body)
      .setCategory(NotificationCompat.CATEGORY_ALARM)
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      // Pre-Oreo devices take sound/vibration from the notification itself.
      .setSound(soundUri(context))
      .setVibrate(VIBRATION_PATTERN)
      .setAutoCancel(true)
      .setContentIntent(contentIntent)
      .build()

    try {
      NotificationManagerCompat.from(context).notify(identifier, NOTIFICATION_ID, notification)
    } catch (_: SecurityException) {
      // Permission revoked between the check and the post — nothing to do.
    }
  }

  private fun ensureChannel(context: Context, channelId: String, channelName: String) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }
    val manager = context.getSystemService(NotificationManager::class.java) ?: return
    // Channels are immutable once created (the user owns their settings), so
    // only create it when missing.
    if (manager.getNotificationChannel(channelId) != null) {
      return
    }
    val channel = NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_HIGH).apply {
      setSound(
        soundUri(context),
        AudioAttributes.Builder()
          .setUsage(AudioAttributes.USAGE_NOTIFICATION)
          .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
          .build()
      )
      enableVibration(true)
      vibrationPattern = VIBRATION_PATTERN
    }
    manager.createNotificationChannel(channel)
  }

  /**
   * True when the app is in the foreground AND the user can actually see it
   * (screen on and unlocked). With the screen locked the notification must
   * ring, since the in-app chime can't be relied on.
   */
  private fun isAppVisibleToUser(context: Context): Boolean {
    val processInfo = ActivityManager.RunningAppProcessInfo()
    ActivityManager.getMyMemoryState(processInfo)
    if (processInfo.importance != ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
      return false
    }
    val interactive = context.getSystemService(PowerManager::class.java)?.isInteractive ?: false
    val locked = context.getSystemService(KeyguardManager::class.java)?.isKeyguardLocked ?: false
    return interactive && !locked
  }

  private fun fireIntent(context: Context) =
    Intent(context, AlarmReceiver::class.java).setAction(ACTION_FIRE)

  private fun requestCode(identifier: String) = identifier.hashCode()

  /**
   * Reference the sound by resource *name*, never by numeric id: the channel
   * stores this URI permanently (channels are immutable), while numeric
   * resource ids can change between builds — which would silence the alarm
   * after an app update. `R.raw.rest_finished` is still touched so the
   * resource is never stripped as unused.
   */
  private fun soundUri(context: Context): Uri {
    val resName = context.resources.getResourceEntryName(R.raw.rest_finished)
    return Uri.parse("android.resource://${context.packageName}/raw/$resName")
  }
}
