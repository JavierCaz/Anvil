# Graph Report - anvil  (2026-11-19)

## Corpus Check
- 159 files · ~396,482 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .xml 2, .podspec 1)

## Summary
- 1550 nodes · 3934 edges · 71 communities (65 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f094402c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- WorkoutShareCard.tsx
- backup.ts
- react-i18next
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- add-exercise.tsx
- Anvil
- RestTimer.tsx
- scripts
- AchievementBadge.tsx
- index.tsx
- RoutineForm.tsx
- routines.ts
- exercise-metrics.ts
- backup-file.ts
- ProgressBar.tsx
- AlarmNotifier.kt
- schema.ts
- tsconfig.json
- generate-exercise-frames.mjs
- workout/[id].tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- [exerciseId].tsx
- app.config.js
- README npm scripts
- useAppTheme
- exercise/[id]/edit.tsx
- stats.ts
- i18n/index.ts
- statistics.tsx
- achievements.test.ts
- android-navigation-bar.tsx
- calculator.ts
- devDependencies
- MuscleDonut.tsx
- ExerciseSetEditor.tsx
- distance.ts
- jest
- react-native
- anvil-alarm/index.ts
- workout-tools.ts
- LineTrendChart.tsx
- animated-svg.tsx
- AlarmNotifier
- app-theme-provider.tsx
- AnvilAlarmModule.kt
- ExerciseForm.tsx
- AnvilAlarmModule
- AnvilAlarmModule.swift
- AlarmReceiver.kt
- constants/achievements.ts
- unit-converter.ts
- routine/[id].tsx
- charts.test.tsx
- AppDialog.tsx
- with-abi-splits.test.ts
- with-abi-splits.js
- build-android-release.sh
- with-release-signing.test.ts
- withAlpha
- DetailModal.tsx
- README.md
- ToastProvider.tsx
- Screen.tsx
- WeekStrip.tsx

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 116 edges
2. `react-native` - 64 edges
3. `react` - 50 edges
4. `react-i18next` - 44 edges
5. `withAlpha()` - 35 edges
6. `WorkoutExerciseScreen()` - 34 edges
7. `expo-sqlite` - 32 edges
8. `getAchievementByKey()` - 32 edges
9. `useUnitsStore` - 31 edges
10. `weightUnitLabel()` - 28 edges

## Surprising Connections (you probably didn't know these)
- `README path aliases` --semantically_similar_to--> `Path aliases @/* and @/assets/*`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Strict TypeScript in README` --semantically_similar_to--> `Strict TypeScript`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Anvil app` --semantically_similar_to--> `Anvil`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `expo-router` --semantically_similar_to--> `expo-router file-based navigation`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `README project structure` --semantically_similar_to--> `Source layout (src/app, components, constants, hooks)`  [INFERRED] [semantically similar]
  README.md → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Anvil MVP core features** — agents_workout_management, agents_progress_tracking, agents_gamification, agents_fun_comparisons, agents_data_privacy [EXTRACTED 1.00]
- **Anvil technology stack** — agents_expo_sdk_57, agents_expo_router, agents_zustand, agents_expo_sqlite, agents_app_config [EXTRACTED 1.00]
- **Quality gates enforced before completion** — agents_testing, agents_verification, agents_typescript [INFERRED 0.85]
- **Anvil cross-platform app icon set sharing the blue/white chevron 'A' brand mark** — assets_images_icon_anvil_mark, assets_images_splash_icon_anvil_mark, assets_images_android_icon_monochrome_anvil_mark, assets_images_favicon_anvil_mark [INFERRED 0.85]

## Communities (71 total, 6 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "WorkoutShareCard.tsx"
Cohesion: 0.08
Nodes (47): expo-clipboard, expo-media-library, expo-sharing, react-native-view-shot, AchievementBadge(), AnvilLogo(), AnvilLogoProps, AnvilMark() (+39 more)

### Community 2 - "backup.ts"
Cohesion: 0.12
Nodes (23): BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TYPE, BACKUP_VERSION, BackupErrorCode, BackupFile, BackupPreferences, BackupRow (+15 more)

### Community 3 - "react-i18next"
Cohesion: 0.07
Nodes (81): dayjs, ref_dayjs_locale_es, ref_expo_sqlite_kv_store, react-i18next, zustand, ref_zustand_middleware, AchievementCard(), AchievementCardProps (+73 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (51): dependencies, @bryllim/workout-guide, dayjs, expo, expo-audio, expo-build-properties, expo-clipboard, expo-constants (+43 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.16
Nodes (20): ExerciseAchievementStats, DISTANCE_ACHIEVEMENTS, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS, DistanceAchievementDefinition, DistanceAchievementKind (+12 more)

### Community 6 - "settings.tsx"
Cohesion: 0.14
Nodes (20): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, setAppLanguage(), clampStep(), formatWeightStep(), useWeightStepStore (+12 more)

### Community 7 - "package.json"
Cohesion: 0.06
Nodes (34): main, name, private, eslint, eslint-config-expo, expo-build-properties, expo-dev-client, expo-device (+26 more)

### Community 8 - "add-exercise.tsx"
Cohesion: 0.14
Nodes (22): @bryllim/workout-guide, AddExerciseScreen(), FilterChip(), FilterSection(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel() (+14 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "RestTimer.tsx"
Cohesion: 0.23
Nodes (16): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, WorkoutTimerAlarm(), ALARM_DURATION_MS (+8 more)

### Community 11 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, android, build:all, build:android, build:apk, build:ios, bump, icons (+5 more)

### Community 12 - "AchievementBadge.tsx"
Cohesion: 0.12
Nodes (15): AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles, BadgeGlyph (+7 more)

### Community 13 - "index.tsx"
Cohesion: 0.10
Nodes (38): expo-router, react, react-native-svg, AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen() (+30 more)

### Community 14 - "RoutineForm.tsx"
Cohesion: 0.18
Nodes (14): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, ref_expo_vector_icons_materialcommunityicons, CarouselArrow(), RoutineForm(), RoutineFormProps, styles, RoutineHeaderTitle(), RoutineHeaderTitleProps (+6 more)

### Community 15 - "routines.ts"
Cohesion: 0.13
Nodes (24): expo-sqlite, react-native-sortables, EditRoutineScreen(), RoutinesScreen(), styles, addExerciseToRoutine(), clampInt(), DEFAULT_REST_SECONDS (+16 more)

### Community 16 - "exercise-metrics.ts"
Cohesion: 0.16
Nodes (26): ExerciseSetEditor(), DefaultSetTarget, DISTANCE_DURATION, distanceScale, DURATION, durationStepSeconds(), FREE_WEIGHT_EQUIPMENT, getDefaultSetTarget() (+18 more)

### Community 17 - "backup-file.ts"
Cohesion: 0.23
Nodes (14): BACKUP_TABLES, BackupError, buildBackupData(), assertNotWeb(), clearPreferences(), eraseAllData(), exportBackupFile(), importBackupFile() (+6 more)

### Community 18 - "ProgressBar.tsx"
Cohesion: 0.50
Nodes (3): ProgressBar(), ProgressBarProps, styles

### Community 19 - "AlarmNotifier.kt"
Cohesion: 0.13
Nodes (14): activitymanager, alarmmanager, audioattributes, contextcompat, keyguardmanager, notificationchannel, notificationcompat, notificationmanager (+6 more)

### Community 20 - "schema.ts"
Cohesion: 0.10
Nodes (24): seedAchievements(), DATABASE_NAME, initializeDatabase(), migrateDbIfNeeded(), seedExerciseCatalog(), DATABASE_VERSION, MIGRATIONS, SCHEMA_V1 (+16 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-exercise-frames.mjs"
Cohesion: 0.06
Nodes (33): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, ref_node_util, created, lockPath (+25 more)

### Community 23 - "workout/[id].tsx"
Cohesion: 0.06
Nodes (68): styles, WorkoutSessionScreen(), formatElapsed(), styles, useElapsedSeconds(), WorkoutElapsedHeaderTitle(), WorkoutElapsedHeaderTitleProps, unlockExerciseAchievement() (+60 more)

### Community 24 - "Strict TypeScript"
Cohesion: 0.33
Nodes (6): Path aliases @/* and @/assets/*, Testing (jest-expo + testing-library), Strict TypeScript, Verification gates (tsc, lint, test), README path aliases, Strict TypeScript in README

### Community 25 - "Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms"
Cohesion: 0.90
Nodes (5): Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms, Android Adaptive Icon Monochrome Layer — flat gray chevron 'A' silhouette with transparent background for Android themed icons, Anvil Web Favicon — solid blue chevron 'A' mark on a light-blue rounded square, small square format for browser tabs, Anvil App Icon — glossy white chevron 'A' mark centered on a blue gradient background with a faint blueprint grid and crosshairs, Anvil Splash Icon — faint white/translucent chevron 'A' mark on a transparent background, used for the native splash screen

### Community 26 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, ref_eslint_config, ref_eslint_config_expo_flat

### Community 28 - "[exerciseId].tsx"
Cohesion: 0.17
Nodes (19): RoutineSetEditorScreen(), SetDraft, styles, findNextPendingExercise(), firstIncompleteSet(), SetDraft, shiftMapDown(), styles (+11 more)

### Community 29 - "app.config.js"
Cohesion: 0.33
Nodes (5): BLOCKED_ANDROID_PERMISSIONS, VARIANTS, { version, versionCode }, version, versionCode

### Community 31 - "useAppTheme"
Cohesion: 0.15
Nodes (17): TabsLayout(), LegendItem(), AdjustButton(), AdjustButtonProps, ControlRow(), ControlRowProps, KEY_LABELS, KeypadButton() (+9 more)

### Community 32 - "exercise/[id]/edit.tsx"
Cohesion: 0.53
Nodes (5): EditExerciseScreen(), styles, deleteExercise(), getExerciseById(), updateExercise()

### Community 33 - "stats.ts"
Cohesion: 0.14
Nodes (21): currentBucketIndex(), RANGE_KEYS, StatisticsScreen(), addBucket(), BucketGranularity, bucketStart(), buildTimeSeries(), CardioStats (+13 more)

### Community 34 - "i18n/index.ts"
Cohesion: 0.18
Nodes (11): expo-localization, i18next, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en (+3 more)

### Community 35 - "statistics.tsx"
Cohesion: 0.13
Nodes (14): ChartCardProps, getRangeBounds(), GRANULARITY, mondayOf(), RangeKey, StatTile(), StatTileProps, styles (+6 more)

### Community 36 - "achievements.test.ts"
Cohesion: 0.16
Nodes (13): EXERCISE_STAT_ACHIEVEMENTS, getNextWeightComparative(), getVolumeComparison(), getWeightComparativeByKey(), getWeightComparativesAtOrBelow(), VolumeComparison, WEIGHT_COMPARATIVES, WeightComparativeDefinition (+5 more)

### Community 37 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 38 - "calculator.ts"
Cohesion: 0.23
Nodes (15): KeypadButtonProps, applyCalculatorKey(), CALCULATOR_MAX_LENGTH, CalculatorKey, CalculatorOperator, currentNumber(), evaluateExpression(), formatExpression() (+7 more)

### Community 39 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-expo, jest, jest-expo, test-renderer, @testing-library/react-native, @types/jest (+2 more)

### Community 40 - "MuscleDonut.tsx"
Cohesion: 0.24
Nodes (13): fmt(), naturalControlPoints(), naturalCurvePath(), polar(), ringSlicePath(), Scale, sliceAngles, MuscleDonut() (+5 more)

### Community 41 - "ExerciseSetEditor.tsx"
Cohesion: 0.16
Nodes (18): expo-haptics, DurationInput(), ExerciseSetEditorProps, formatReps(), REST_MAX_SECONDS, REST_STEP_SECONDS, SetCard(), SetCardProps (+10 more)

### Community 42 - "distance.ts"
Cohesion: 0.38
Nodes (11): formatSetValues(), displayToMeters(), distanceUnitLabel(), formatDistance(), formatDistanceValue(), formatDistanceWithUnit(), formatPace(), M_PER_MI (+3 more)

### Community 43 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 44 - "react-native"
Cohesion: 0.21
Nodes (10): expo-constants, expo-intent-launcher, expo-status-bar, react-native, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), useDialog() (+2 more)

### Community 45 - "anvil-alarm/index.ts"
Cohesion: 0.18
Nodes (9): AlarmOptions, AnvilAlarm, AnvilAlarmNativeModule, cancel(), dismiss(), getPermissionStatusAsync(), requestPermissionAsync(), scheduleAsync() (+1 more)

### Community 46 - "workout-tools.ts"
Cohesion: 0.11
Nodes (31): SetTimerButton(), formatStopwatch(), formatTimer(), StopwatchPanel(), TimerPanel(), useNow(), WorkoutToolsButton(), clampDuration() (+23 more)

### Community 47 - "LineTrendChart.tsx"
Cohesion: 0.18
Nodes (14): BarTrendChart(), BarTrendChartProps, BarTrendPoint, styles, useChartDismiss(), barLayout, linearScale(), ChartTooltip() (+6 more)

### Community 48 - "animated-svg.tsx"
Cohesion: 0.22
Nodes (9): react-native-reanimated, AnimatedBar(), AnimatedBarProps, AnimatedCurve(), AnimatedCurveProps, AnimatedPath, AnimatedRect, TIMING (+1 more)

### Community 49 - "AlarmNotifier"
Cohesion: 0.38
Nodes (3): AlarmOptions, AlarmNotifier, Context

### Community 50 - "app-theme-provider.tsx"
Cohesion: 0.39
Nodes (6): AppColorScheme, AppTheme, AppThemeContext, darkColors, lightColors, ThemeColors

### Community 51 - "AnvilAlarmModule.kt"
Cohesion: 0.19
Nodes (10): exceptions, field, manifest, AlarmOptions, AnvilAlarmModule, Context, Module, Record (+2 more)

### Community 52 - "ExerciseForm.tsx"
Cohesion: 0.24
Nodes (9): NewExerciseScreen(), Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps, styles, EXERCISE_TYPE_I18N_KEYS, MUSCLE_I18N_KEYS (+1 more)

### Community 53 - "AnvilAlarmModule"
Cohesion: 0.33
Nodes (5): Bool, Module, ModuleDefinition, AnvilAlarmModule, UNAuthorizationStatus

### Community 54 - "AnvilAlarmModule.swift"
Cohesion: 0.29
Nodes (6): Double, ExpoModulesCore, AlarmOptions, Record, String, UserNotifications

### Community 55 - "AlarmReceiver.kt"
Cohesion: 0.53
Nodes (4): BroadcastReceiver, Intent, AlarmReceiver, Context

### Community 56 - "constants/achievements.ts"
Cohesion: 0.17
Nodes (17): AchievementProgress, AchievementScope, AchievementTier, computeAchievementProgress(), computeExerciseAchievementProgress(), EXERCISE_METRIC_READERS, getAchievementByKey(), METRIC_READERS (+9 more)

### Community 57 - "unit-converter.ts"
Cohesion: 0.30
Nodes (10): ConverterPanel(), KEYPAD_ROWS, KEYPAD_SIDE, CONVERTER_CATEGORIES, converterUnits(), convertUnit(), DEFAULT_PAIRS, defaultConverterUnits() (+2 more)

### Community 58 - "routine/[id].tsx"
Cohesion: 0.10
Nodes (28): ref_expo_vector_icons_ionicons, ref_react_native_gesture_handler_reanimatedswipeable, RoutineDetailScreen(), styles, ExerciseThumbnail(), ExerciseThumbnailProps, styles, GoalToggleButton() (+20 more)

### Community 59 - "charts.test.tsx"
Cohesion: 0.32
Nodes (6): @testing-library/react-native, Container, findAll(), Instance, layout(), svgNodes()

### Community 60 - "AppDialog.tsx"
Cohesion: 0.22
Nodes (10): AppDialogProvider(), buttonAppearance(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions, DialogTone (+2 more)

### Community 62 - "with-abi-splits.js"
Cohesion: 0.29
Nodes (3): { withAppBuildGradle }, { withAppBuildGradle }, ref_expo_config_plugins

### Community 65 - "withAlpha"
Cohesion: 0.33
Nodes (6): DangerButton(), DangerButtonProps, styles, ToneColors, ToastProvider(), withAlpha()

### Community 66 - "DetailModal.tsx"
Cohesion: 0.40
Nodes (4): react-native-safe-area-context, DetailModal(), DetailModalProps, styles

### Community 68 - "ToastProvider.tsx"
Cohesion: 0.33
Nodes (6): AnimatedPressable, styles, ToastApi, ToastContext, ToastItem, ToastOptions

### Community 69 - "Screen.tsx"
Cohesion: 0.40
Nodes (4): NewRoutineScreen(), ScreenProps, styles, createRoutine()

### Community 70 - "WeekStrip.tsx"
Cohesion: 0.50
Nodes (3): styles, WeekStrip(), WeekStripProps

## Knowledge Gaps
- **705 isolated node(s):** `{ version, versionCode }`, `VARIANTS`, `BLOCKED_ANDROID_PERMISSIONS`, `{ defineConfig }`, `expoConfig` (+700 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 773 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `WorkoutShareCard.tsx`, `react-i18next`, `settings.tsx`, `package.json`, `add-exercise.tsx`, `RestTimer.tsx`, `AchievementBadge.tsx`, `index.tsx`, `RoutineForm.tsx`, `routines.ts`, `backup-file.ts`, `ProgressBar.tsx`, `workout/[id].tsx`, `[exerciseId].tsx`, `useAppTheme`, `exercise/[id]/edit.tsx`, `statistics.tsx`, `android-navigation-bar.tsx`, `MuscleDonut.tsx`, `ExerciseSetEditor.tsx`, `LineTrendChart.tsx`, `app-theme-provider.tsx`, `ExerciseForm.tsx`, `routine/[id].tsx`, `AppDialog.tsx`, `withAlpha`, `DetailModal.tsx`, `ToastProvider.tsx`, `Screen.tsx`, `WeekStrip.tsx`?**
  _High betweenness centrality (0.302) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `WorkoutShareCard.tsx`, `react-i18next`, `settings.tsx`, `add-exercise.tsx`, `RestTimer.tsx`, `index.tsx`, `RoutineForm.tsx`, `routines.ts`, `exercise-metrics.ts`, `ProgressBar.tsx`, `workout/[id].tsx`, `[exerciseId].tsx`, `stats.ts`, `statistics.tsx`, `android-navigation-bar.tsx`, `MuscleDonut.tsx`, `ExerciseSetEditor.tsx`, `react-native`, `workout-tools.ts`, `LineTrendChart.tsx`, `app-theme-provider.tsx`, `ExerciseForm.tsx`, `unit-converter.ts`, `routine/[id].tsx`, `AppDialog.tsx`, `withAlpha`, `DetailModal.tsx`, `ToastProvider.tsx`, `Screen.tsx`, `WeekStrip.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `{ version, versionCode }`, `VARIANTS`, `BLOCKED_ANDROID_PERMISSIONS` to the rest of the system?**
  _705 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `WorkoutShareCard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07924984875983061 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._