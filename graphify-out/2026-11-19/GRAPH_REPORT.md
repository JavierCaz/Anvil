# Graph Report - anvil  (2026-11-19)

## Corpus Check
- 159 files · ~396,459 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .xml 2, .podspec 1)

## Summary
- 1548 nodes · 3933 edges · 68 communities (61 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0534593d`
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
- expo-sqlite
- routines.ts
- exercise-metrics.ts
- backup-file.ts
- useAppTheme
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
- WorkoutTools.tsx
- db/exercises.ts
- statistics.tsx
- i18n/index.ts
- workout-tools.ts
- weight-comparatives.ts
- app/_layout.tsx
- calculator.ts
- devDependencies
- MuscleDonut.tsx
- ExerciseSetEditor.tsx
- distance.ts
- jest
- getAchievementByKey
- anvil-alarm/index.ts
- useWorkoutToolsStore
- react-native
- animated-svg.tsx
- AlarmNotifier
- app-theme-provider.tsx
- AnvilAlarmModule.kt
- Screen.tsx
- AnvilAlarmModule
- AnvilAlarmModule.swift
- AlarmReceiver.kt
- constants/achievements.ts
- [reId].tsx
- routine/[id].tsx
- charts.test.tsx
- database.ts
- with-abi-splits.test.ts
- with-abi-splits.js
- build-android-release.sh
- with-release-signing.test.ts
- AnvilAlarmNativeModule
- DetailModal.tsx
- README.md

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 116 edges
2. `react-native` - 64 edges
3. `react` - 50 edges
4. `react-i18next` - 44 edges
5. `withAlpha()` - 35 edges
6. `WorkoutExerciseScreen()` - 34 edges
7. `@expo/vector-icons` - 32 edges
8. `expo-sqlite` - 32 edges
9. `getAchievementByKey()` - 32 edges
10. `useUnitsStore` - 31 edges

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

## Communities (68 total, 7 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "WorkoutShareCard.tsx"
Cohesion: 0.07
Nodes (56): expo-clipboard, expo-media-library, expo-sharing, react-native-view-shot, @testing-library/react-native, AchievementBadge(), AnvilMark(), DangerButton() (+48 more)

### Community 2 - "backup.ts"
Cohesion: 0.13
Nodes (24): BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_VERSION, BackupError, BackupErrorCode, BackupRow, BackupRowValue (+16 more)

### Community 3 - "react-i18next"
Cohesion: 0.06
Nodes (81): dayjs, ref_expo_sqlite_kv_store, react-i18next, zustand, ref_zustand_middleware, AchievementCard(), AchievementCardProps, styles (+73 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (51): dependencies, @bryllim/workout-guide, dayjs, expo, expo-audio, expo-build-properties, expo-clipboard, expo-constants (+43 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.15
Nodes (21): ExerciseAchievementStats, DISTANCE_ACHIEVEMENTS, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS, DistanceAchievementDefinition, DistanceAchievementKind (+13 more)

### Community 6 - "settings.tsx"
Cohesion: 0.16
Nodes (20): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, assertNotWeb(), eraseAllData(), importBackupFile(), setAppLanguage() (+12 more)

### Community 7 - "package.json"
Cohesion: 0.06
Nodes (32): main, name, private, eslint, eslint-config-expo, expo-build-properties, expo-dev-client, expo-device (+24 more)

### Community 8 - "add-exercise.tsx"
Cohesion: 0.16
Nodes (20): expo-image, AddExerciseScreen(), FilterChip(), FilterSection(), styles, ExerciseDetailModal(), muscleLabel(), styles (+12 more)

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
Cohesion: 0.11
Nodes (16): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles (+8 more)

### Community 13 - "index.tsx"
Cohesion: 0.20
Nodes (21): AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, HeroGlow(), HeroGlowProps (+13 more)

### Community 14 - "expo-sqlite"
Cohesion: 0.22
Nodes (12): expo-sqlite, AchievementMetric, BODY_ACHIEVEMENTS, ACHIEVEMENT_SEED, unlockAchievementIfNew(), BODY_METRIC_READERS, isBodyAchievementEarned(), syncBodyWeightAchievements() (+4 more)

### Community 15 - "routines.ts"
Cohesion: 0.08
Nodes (38): @expo/vector-icons, react-native-sortables, EditRoutineScreen(), NewRoutineScreen(), RoutinesScreen(), styles, CarouselArrow(), RoutineForm() (+30 more)

### Community 16 - "exercise-metrics.ts"
Cohesion: 0.14
Nodes (28): ExerciseSetEditor(), DefaultSetTarget, DISTANCE_DURATION, distanceScale, DURATION, durationStepSeconds(), FREE_WEIGHT_EQUIPMENT, getDefaultSetTarget() (+20 more)

### Community 17 - "backup-file.ts"
Cohesion: 0.22
Nodes (10): BACKUP_TYPE, BackupFile, BackupPreferences, buildBackupData(), clearPreferences(), exportBackupFile(), PREFERENCE_KEYS, readPreferences() (+2 more)

### Community 18 - "useAppTheme"
Cohesion: 0.13
Nodes (18): LegendItem(), ProgressBar(), ProgressBarProps, styles, StepIcon(), StepIconProps, styles, styles (+10 more)

### Community 19 - "AlarmNotifier.kt"
Cohesion: 0.13
Nodes (14): activitymanager, alarmmanager, audioattributes, contextcompat, keyguardmanager, notificationchannel, notificationcompat, notificationmanager (+6 more)

### Community 20 - "schema.ts"
Cohesion: 0.11
Nodes (18): DATABASE_VERSION, MIGRATIONS, SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14 (+10 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-exercise-frames.mjs"
Cohesion: 0.06
Nodes (33): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, ref_node_util, created, lockPath (+25 more)

### Community 23 - "workout/[id].tsx"
Cohesion: 0.06
Nodes (68): styles, WorkoutSessionScreen(), formatElapsed(), styles, useElapsedSeconds(), WorkoutElapsedHeaderTitle(), WorkoutElapsedHeaderTitleProps, METRIC_READERS (+60 more)

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
Cohesion: 0.25
Nodes (13): findNextPendingExercise(), firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), getExerciseAchievementUnlockedAt(), unlockDistanceAchievements() (+5 more)

### Community 29 - "app.config.js"
Cohesion: 0.33
Nodes (5): BLOCKED_ANDROID_PERMISSIONS, VARIANTS, { version, versionCode }, version, versionCode

### Community 31 - "WorkoutTools.tsx"
Cohesion: 0.13
Nodes (24): AdjustButton(), AdjustButtonProps, ControlRow(), ControlRowProps, ConverterPanel(), KEY_LABELS, KEYPAD_ROWS, KEYPAD_SIDE (+16 more)

### Community 32 - "db/exercises.ts"
Cohesion: 0.22
Nodes (12): @bryllim/workout-guide, EditExerciseScreen(), styles, ExerciseDetailModalProps, deleteExercise(), ExerciseFilters, getExerciseById(), NewExerciseInput (+4 more)

### Community 33 - "statistics.tsx"
Cohesion: 0.10
Nodes (30): ref_dayjs_locale_es, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey (+22 more)

### Community 34 - "i18n/index.ts"
Cohesion: 0.18
Nodes (11): expo-localization, i18next, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en (+3 more)

### Community 35 - "workout-tools.ts"
Cohesion: 0.14
Nodes (16): KeypadButtonProps, ConverterState, initialConverter, initialStopwatch, initialTimer, RestState, SetTimerState, StopwatchState (+8 more)

### Community 36 - "weight-comparatives.ts"
Cohesion: 0.43
Nodes (6): getNextWeightComparative(), getVolumeComparison(), getWeightComparativeByKey(), getWeightComparativesAtOrBelow(), VolumeComparison, WEIGHT_COMPARATIVES

### Community 37 - "app/_layout.tsx"
Cohesion: 0.14
Nodes (11): expo-navigation-bar, expo-status-bar, expo-system-ui, react-native-gesture-handler, RootNavigator(), AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps (+3 more)

### Community 38 - "calculator.ts"
Cohesion: 0.25
Nodes (14): applyCalculatorKey(), CALCULATOR_MAX_LENGTH, CalculatorOperator, CalculatorState, currentNumber(), evaluateExpression(), formatExpression(), formatResult() (+6 more)

### Community 39 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-expo, jest, jest-expo, test-renderer, @testing-library/react-native, @types/jest (+2 more)

### Community 40 - "MuscleDonut.tsx"
Cohesion: 0.22
Nodes (14): fmt(), naturalControlPoints(), naturalCurvePath(), polar(), ringSlicePath(), Scale, sliceAngles, DonutSlice (+6 more)

### Community 41 - "ExerciseSetEditor.tsx"
Cohesion: 0.20
Nodes (16): DurationInput(), ExerciseSetEditorProps, formatReps(), parseNumber(), REST_MAX_SECONDS, REST_STEP_SECONDS, SetCard(), SetCardProps (+8 more)

### Community 42 - "distance.ts"
Cohesion: 0.38
Nodes (11): formatSetValues(), displayToMeters(), distanceUnitLabel(), formatDistance(), formatDistanceValue(), formatDistanceWithUnit(), formatPace(), M_PER_MI (+3 more)

### Community 43 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 44 - "getAchievementByKey"
Cohesion: 0.23
Nodes (9): computeAchievementProgress(), computeExerciseAchievementProgress(), EXERCISE_STAT_ACHIEVEMENTS, getAchievementByKey(), normalizeBodyComparative(), normalizeDistanceAchievement(), buildAchievementItems(), STATS (+1 more)

### Community 45 - "anvil-alarm/index.ts"
Cohesion: 0.23
Nodes (11): AlarmOptions, AnvilAlarm, cancel(), dismiss(), getPermissionStatusAsync(), requestPermissionAsync(), scheduleAsync(), expo (+3 more)

### Community 46 - "useWorkoutToolsStore"
Cohesion: 0.21
Nodes (16): SetTimerButton(), formatStopwatch(), formatTimer(), StopwatchPanel(), TimerPanel(), useNow(), WorkoutToolsButton(), clampDuration() (+8 more)

### Community 47 - "react-native"
Cohesion: 0.12
Nodes (22): expo-haptics, react-native, AnimatedBar(), AnimatedCurve(), BarTrendChart(), BarTrendChartProps, BarTrendPoint, styles (+14 more)

### Community 48 - "animated-svg.tsx"
Cohesion: 0.25
Nodes (8): react-native-reanimated, react-native-svg, AnimatedBarProps, AnimatedCurveProps, AnimatedPath, AnimatedRect, TIMING, Point

### Community 49 - "AlarmNotifier"
Cohesion: 0.38
Nodes (3): AlarmOptions, AlarmNotifier, Context

### Community 50 - "app-theme-provider.tsx"
Cohesion: 0.10
Nodes (19): expo-router, react, TabsLayout(), AnvilLogo(), AnvilLogoProps, AnvilMarkProps, MARK_COLORS, styles (+11 more)

### Community 51 - "AnvilAlarmModule.kt"
Cohesion: 0.19
Nodes (10): exceptions, field, manifest, AlarmOptions, AnvilAlarmModule, Context, Module, Record (+2 more)

### Community 52 - "Screen.tsx"
Cohesion: 0.17
Nodes (12): NewExerciseScreen(), Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps, styles, Screen(), ScreenProps (+4 more)

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
Cohesion: 0.29
Nodes (8): AchievementProgress, AchievementScope, AchievementTier, EXERCISE_METRIC_READERS, BODY_COMPARATIVE_KEY_PREFIX, BODY_COMPARATIVES, BodyComparativeDefinition, getBodyComparativeByKey()

### Community 57 - "[reId].tsx"
Cohesion: 0.36
Nodes (7): RoutineSetEditorScreen(), SetDraft, styles, SetEditorItem, clampIncline(), clampLevel(), getRoutineExercise()

### Community 58 - "routine/[id].tsx"
Cohesion: 0.11
Nodes (27): ref_react_native_gesture_handler_reanimatedswipeable, RoutineDetailScreen(), styles, AppDialogProvider(), buttonAppearance(), DialogApi, DialogButton, DialogButtonStyle (+19 more)

### Community 59 - "charts.test.tsx"
Cohesion: 0.38
Nodes (5): Container, findAll(), Instance, layout(), svgNodes()

### Community 60 - "database.ts"
Cohesion: 0.52
Nodes (6): backfillPerExerciseAchievements(), seedAchievements(), initializeDatabase(), migrateDbIfNeeded(), seedExerciseCatalog(), deleteOrphanedSets()

### Community 62 - "with-abi-splits.js"
Cohesion: 0.29
Nodes (3): { withAppBuildGradle }, { withAppBuildGradle }, ref_expo_config_plugins

### Community 66 - "DetailModal.tsx"
Cohesion: 0.40
Nodes (4): react-native-safe-area-context, DetailModal(), DetailModalProps, styles

## Knowledge Gaps
- **704 isolated node(s):** `{ version, versionCode }`, `VARIANTS`, `BLOCKED_ANDROID_PERMISSIONS`, `{ defineConfig }`, `expoConfig` (+699 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 772 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `WorkoutShareCard.tsx`, `react-i18next`, `settings.tsx`, `package.json`, `add-exercise.tsx`, `RestTimer.tsx`, `AchievementBadge.tsx`, `index.tsx`, `routines.ts`, `backup-file.ts`, `useAppTheme`, `workout/[id].tsx`, `[exerciseId].tsx`, `WorkoutTools.tsx`, `db/exercises.ts`, `statistics.tsx`, `app/_layout.tsx`, `MuscleDonut.tsx`, `ExerciseSetEditor.tsx`, `anvil-alarm/index.ts`, `app-theme-provider.tsx`, `Screen.tsx`, `[reId].tsx`, `routine/[id].tsx`, `DetailModal.tsx`?**
  _High betweenness centrality (0.299) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `WorkoutShareCard.tsx`, `react-i18next`, `settings.tsx`, `add-exercise.tsx`, `RestTimer.tsx`, `index.tsx`, `routines.ts`, `exercise-metrics.ts`, `workout/[id].tsx`, `[exerciseId].tsx`, `WorkoutTools.tsx`, `statistics.tsx`, `app/_layout.tsx`, `MuscleDonut.tsx`, `ExerciseSetEditor.tsx`, `useWorkoutToolsStore`, `react-native`, `app-theme-provider.tsx`, `Screen.tsx`, `[reId].tsx`, `routine/[id].tsx`, `DetailModal.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `{ version, versionCode }`, `VARIANTS`, `BLOCKED_ANDROID_PERMISSIONS` to the rest of the system?**
  _704 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `WorkoutShareCard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06521739130434782 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12535612535612536 - nodes in this community are weakly interconnected._