package expo.modules.anvilalarm

import android.Manifest
import android.content.Context
import android.os.Build
import expo.modules.interfaces.permissions.PermissionsResponseListener
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class AlarmOptions : Record {
  @Field val identifier: String = ""
  @Field val channelId: String = ""
  @Field val channelName: String = ""
  @Field val title: String = ""
  @Field val body: String = ""
  @Field val delaySeconds: Double = 1.0
}

class AnvilAlarmModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("AnvilAlarm")

    AsyncFunction("getPermissionStatusAsync") {
      AlarmNotifier.areNotificationsEnabled(context)
    }

    AsyncFunction("requestPermissionAsync") { promise: Promise ->
      // Before Android 13 notifications need no runtime permission.
      val permissions = appContext.permissions
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU || permissions == null) {
        promise.resolve(AlarmNotifier.areNotificationsEnabled(context))
        return@AsyncFunction
      }
      permissions.askForPermissions(
        PermissionsResponseListener { promise.resolve(AlarmNotifier.areNotificationsEnabled(context)) },
        Manifest.permission.POST_NOTIFICATIONS
      )
    }

    AsyncFunction("scheduleAsync") { options: AlarmOptions ->
      AlarmNotifier.schedule(context, options)
    }

    Function("cancel") { identifier: String ->
      AlarmNotifier.cancel(context, identifier)
    }

    Function("dismiss") { identifier: String ->
      AlarmNotifier.dismiss(context, identifier)
    }
  }
}
