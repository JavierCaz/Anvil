import ExpoModulesCore
import UserNotifications

struct AlarmOptions: Record {
  @Field var identifier: String = ""
  @Field var channelId: String = ""
  @Field var channelName: String = ""
  @Field var title: String = ""
  @Field var body: String = ""
  @Field var delaySeconds: Double = 1
}

/// Local-only rest-timer notifications via UNUserNotificationCenter.
///
/// No UNUserNotificationCenterDelegate is installed, so iOS does not present
/// these while the app is in the foreground — the in-app chime handles that
/// case, and the notification only rings when backgrounded / locked.
public class AnvilAlarmModule: Module {
  private static let soundName = UNNotificationSoundName("rest_finished.wav")

  public func definition() -> ModuleDefinition {
    Name("AnvilAlarm")

    AsyncFunction("getPermissionStatusAsync") { (promise: Promise) in
      UNUserNotificationCenter.current().getNotificationSettings { settings in
        promise.resolve(Self.isAuthorized(settings.authorizationStatus))
      }
    }

    AsyncFunction("requestPermissionAsync") { (promise: Promise) in
      UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { granted, _ in
        promise.resolve(granted)
      }
    }

    AsyncFunction("scheduleAsync") { (options: AlarmOptions, promise: Promise) in
      let content = UNMutableNotificationContent()
      content.title = options.title
      content.body = options.body
      content.sound = UNNotificationSound(named: Self.soundName)

      let trigger = UNTimeIntervalNotificationTrigger(
        timeInterval: max(1, options.delaySeconds),
        repeats: false
      )
      // Adding a request with an existing identifier replaces it.
      let request = UNNotificationRequest(identifier: options.identifier, content: content, trigger: trigger)
      UNUserNotificationCenter.current().add(request) { error in
        if let error {
          promise.reject("ERR_ALARM_SCHEDULE", error.localizedDescription)
        } else {
          promise.resolve(nil)
        }
      }
    }

    Function("cancel") { (identifier: String) in
      UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [identifier])
    }

    Function("dismiss") { (identifier: String) in
      UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers: [identifier])
    }
  }

  private static func isAuthorized(_ status: UNAuthorizationStatus) -> Bool {
    switch status {
    case .authorized, .provisional, .ephemeral:
      return true
    default:
      return false
    }
  }
}
