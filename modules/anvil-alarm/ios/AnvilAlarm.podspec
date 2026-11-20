Pod::Spec.new do |s|
  s.name           = 'AnvilAlarm'
  s.version        = '1.0.0'
  s.summary        = 'Local-only rest-timer alarm notifications for Anvil.'
  s.description    = 'Schedules one-shot local notifications without any push / remote code.'
  s.license        = 'MIT'
  s.author         = 'Anvil'
  s.homepage       = 'https://github.com/javiercaz/anvil'
  s.platforms      = {
    :ios => '16.4'
  }
  s.swift_version  = '5.9'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = '**/*.{h,m,swift}'
  # Copied into the main app bundle, where UNNotificationSound looks it up.
  s.resources = ['rest_finished.wav']
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end
