# Graph Report - anvil  (2026-11-19)

## Corpus Check
- 154 files · ~156,467 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .xml 2, .podspec 1)

## Summary
- 1518 nodes · 3857 edges · 65 communities (60 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `26cde5d5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- WorkoutSharePanel.tsx
- backup.ts
- react
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- react-native
- Anvil
- RestTimer.tsx
- scripts
- constants/achievements.ts
- index.tsx
- gamification.ts
- routines.ts
- exercise-metrics.ts
- backup-file.ts
- WeeklyGoalEditor.tsx
- AlarmNotifier.kt
- schema.ts
- tsconfig.json
- generate-icons.mjs
- workout/[id].tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- [exerciseId].tsx
- app.config.js
- README npm scripts
- WorkoutTools.tsx
- Screen.tsx
- statistics.tsx
- i18n/index.ts
- workout-tools.ts
- AchievementBadge.tsx
- app-theme-provider.tsx
- calculator.ts
- devDependencies
- WorkoutShareCard.tsx
- AchievementDetailModal.tsx
- distance.ts
- jest
- RoutineForm.tsx
- anvil-alarm/index.ts
- useWorkoutToolsStore
- ExerciseSetEditor.tsx
- routine/[id].tsx
- AlarmNotifier
- useAppTheme
- AnvilAlarmModule.kt
- ExerciseForm.tsx
- AnvilAlarmModule
- AnvilAlarmModule.swift
- AlarmReceiver.kt
- android-navigation-bar.tsx
- types.ts
- routine/[id]/edit.tsx
- WorkoutElapsed.tsx
- AnvilLogo.tsx
- with-abi-splits.test.ts
- with-abi-splits.js
- build-android-release.sh
- with-release-signing.test.ts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 116 edges
2. `react-native` - 64 edges
3. `react` - 48 edges
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

## Communities (65 total, 5 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "WorkoutSharePanel.tsx"
Cohesion: 0.16
Nodes (19): expo-clipboard, expo-media-library, expo-sharing, react-native-view-shot, capture(), copyShareImage(), saveShareImage(), ShareImageError (+11 more)

### Community 2 - "backup.ts"
Cohesion: 0.16
Nodes (19): BACKUP_INSERT_ORDER, BACKUP_VERSION, BackupErrorCode, BackupRow, BackupRowValue, BackupTableData, BackupTableName, ColumnType (+11 more)

### Community 3 - "react"
Cohesion: 0.08
Nodes (64): dayjs, ref_expo_sqlite_kv_store, react, react-i18next, AndroidExactAlarmPermissionPrompt(), useDialog(), BodyWeightDelta(), BodyWeightDeltaProps (+56 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, @bryllim/workout-guide, dayjs, expo, expo-audio, expo-build-properties, expo-clipboard, expo-constants (+45 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.11
Nodes (30): computeExerciseAchievementProgress(), EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS, DistanceAchievementDefinition (+22 more)

### Community 6 - "settings.tsx"
Cohesion: 0.13
Nodes (23): zustand, ref_zustand_middleware, SettingsScreen(), styles, SwitchRow(), SwitchRowProps, resetAppLanguage(), setAppLanguage() (+15 more)

### Community 7 - "package.json"
Cohesion: 0.06
Nodes (35): main, name, private, eslint, eslint-config-expo, expo-build-properties, expo-constants, expo-dev-client (+27 more)

### Community 8 - "react-native"
Cohesion: 0.12
Nodes (28): react-native, AddExerciseScreen(), FilterChip(), FilterSection(), styles, DetailModal(), DetailModalProps, styles (+20 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "RestTimer.tsx"
Cohesion: 0.23
Nodes (16): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, WorkoutTimerAlarm(), ALARM_DURATION_MS (+8 more)

### Community 11 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, android, build:all, build:android, build:apk, build:ios, bump, icons (+5 more)

### Community 12 - "constants/achievements.ts"
Cohesion: 0.19
Nodes (15): AchievementMetric, AchievementProgress, AchievementScope, AchievementTier, computeAchievementProgress(), EXERCISE_METRIC_READERS, getAchievementByKey(), normalizeBodyComparative() (+7 more)

### Community 13 - "index.tsx"
Cohesion: 0.16
Nodes (25): expo-router, AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, HeroGlow() (+17 more)

### Community 14 - "gamification.ts"
Cohesion: 0.10
Nodes (35): METRIC_READERS, getNextWeightComparative(), unlockAchievementIfNew(), getBodyWeights(), buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests (+27 more)

### Community 15 - "routines.ts"
Cohesion: 0.16
Nodes (17): expo-sqlite, NewRoutineScreen(), getDefaultSetTarget(), addExerciseToRoutine(), clampInt(), createRoutine(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS (+9 more)

### Community 16 - "exercise-metrics.ts"
Cohesion: 0.17
Nodes (25): ExerciseSetEditor(), DefaultSetTarget, DISTANCE_DURATION, distanceScale, DURATION, durationStepSeconds(), FREE_WEIGHT_EQUIPMENT, getExerciseMetrics() (+17 more)

### Community 17 - "backup-file.ts"
Cohesion: 0.16
Nodes (18): BACKUP_APP, BACKUP_TABLES, BACKUP_TYPE, BackupError, BackupFile, BackupPreferences, buildBackupData(), assertNotWeb() (+10 more)

### Community 18 - "WeeklyGoalEditor.tsx"
Cohesion: 0.38
Nodes (5): styles, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState

### Community 19 - "AlarmNotifier.kt"
Cohesion: 0.13
Nodes (14): activitymanager, alarmmanager, audioattributes, contextcompat, keyguardmanager, notificationchannel, notificationcompat, notificationmanager (+6 more)

### Community 20 - "schema.ts"
Cohesion: 0.10
Nodes (23): seedAchievements(), initializeDatabase(), migrateDbIfNeeded(), seedExerciseCatalog(), DATABASE_VERSION, MIGRATIONS, SCHEMA_V1, SCHEMA_V10 (+15 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.08
Nodes (26): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, created, lockPath, [major, minor, patch] (+18 more)

### Community 23 - "workout/[id].tsx"
Cohesion: 0.14
Nodes (25): styles, WorkoutSessionScreen(), getRoutineExerciseSets(), WorkoutLog, applyWorkoutExerciseOrder(), cancelWorkout(), completeWorkout(), EMPTY_EXERCISE_STATS (+17 more)

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
Cohesion: 0.15
Nodes (20): RoutineSetEditorScreen(), SetDraft, styles, findNextPendingExercise(), firstIncompleteSet(), SetDraft, shiftMapDown(), styles (+12 more)

### Community 29 - "app.config.js"
Cohesion: 0.33
Nodes (5): BLOCKED_ANDROID_PERMISSIONS, VARIANTS, { version, versionCode }, version, versionCode

### Community 31 - "WorkoutTools.tsx"
Cohesion: 0.13
Nodes (23): AdjustButton(), AdjustButtonProps, ControlRow(), ControlRowProps, ConverterPanel(), KEY_LABELS, KEYPAD_ROWS, KEYPAD_SIDE (+15 more)

### Community 32 - "Screen.tsx"
Cohesion: 0.17
Nodes (15): @bryllim/workout-guide, react-native-safe-area-context, EditExerciseScreen(), styles, NewExerciseScreen(), Screen(), ScreenProps, styles (+7 more)

### Community 33 - "statistics.tsx"
Cohesion: 0.05
Nodes (57): ref_dayjs_locale_es, @shopify/react-native-skia, victory-native, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf() (+49 more)

### Community 34 - "i18n/index.ts"
Cohesion: 0.13
Nodes (14): expo-localization, i18next, @testing-library/react-native, exercise(), makeRecap(), RecapExercise, AppLanguage, detectInitialLanguage() (+6 more)

### Community 35 - "workout-tools.ts"
Cohesion: 0.14
Nodes (17): KeypadButtonProps, ConverterState, initialConverter, initialStopwatch, initialTimer, RestState, SetTimerState, StopwatchState (+9 more)

### Community 36 - "AchievementBadge.tsx"
Cohesion: 0.10
Nodes (18): AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles, BadgeGlyph (+10 more)

### Community 37 - "app-theme-provider.tsx"
Cohesion: 0.09
Nodes (28): expo-status-bar, react-native-gesture-handler, RootNavigator(), AppDialogProvider(), buttonAppearance(), DialogApi, DialogButton, DialogButtonStyle (+20 more)

### Community 38 - "calculator.ts"
Cohesion: 0.24
Nodes (14): KeypadButton(), applyCalculatorKey(), CALCULATOR_MAX_LENGTH, CalculatorOperator, currentNumber(), evaluateExpression(), formatExpression(), formatResult() (+6 more)

### Community 39 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-expo, jest, jest-expo, test-renderer, @testing-library/react-native, @types/jest (+2 more)

### Community 40 - "WorkoutShareCard.tsx"
Cohesion: 0.16
Nodes (25): AnvilMark(), styles, ToneColors, WorkoutShareCard(), WorkoutShareCardProps, WorkoutSharePanelProps, styles, WorkoutRecapModal() (+17 more)

### Community 41 - "AchievementDetailModal.tsx"
Cohesion: 0.25
Nodes (15): AchievementBadge(), AchievementCard(), AchievementCardProps, styles, AchievementDetailModal(), AchievementDetailModalProps, formatNumber(), metricUnit() (+7 more)

### Community 42 - "distance.ts"
Cohesion: 0.38
Nodes (11): formatSetValues(), displayToMeters(), distanceUnitLabel(), formatDistance(), formatDistanceValue(), formatDistanceWithUnit(), formatPace(), M_PER_MI (+3 more)

### Community 43 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 44 - "RoutineForm.tsx"
Cohesion: 0.18
Nodes (13): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, CarouselArrow(), RoutineForm(), RoutineFormProps, styles, RoutineHeaderTitle(), RoutineHeaderTitleProps, styles (+5 more)

### Community 45 - "anvil-alarm/index.ts"
Cohesion: 0.18
Nodes (9): AlarmOptions, AnvilAlarm, AnvilAlarmNativeModule, cancel(), dismiss(), getPermissionStatusAsync(), requestPermissionAsync(), scheduleAsync() (+1 more)

### Community 46 - "useWorkoutToolsStore"
Cohesion: 0.21
Nodes (16): SetTimerButton(), formatStopwatch(), formatTimer(), StopwatchPanel(), TimerPanel(), useNow(), WorkoutToolsButton(), clampDuration() (+8 more)

### Community 47 - "ExerciseSetEditor.tsx"
Cohesion: 0.16
Nodes (19): expo-haptics, DurationInput(), ExerciseSetEditorProps, formatReps(), parseNumber(), REST_MAX_SECONDS, REST_STEP_SECONDS, SetCard() (+11 more)

### Community 48 - "routine/[id].tsx"
Cohesion: 0.43
Nodes (7): RoutineDetailScreen(), styles, muscleI18nKey(), getRoutineExercises(), removeExerciseFromRoutine(), reorderRoutineExercises(), startWorkout()

### Community 49 - "AlarmNotifier"
Cohesion: 0.38
Nodes (3): AlarmOptions, AlarmNotifier, Context

### Community 50 - "useAppTheme"
Cohesion: 0.10
Nodes (23): @expo/vector-icons, ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, TabsLayout(), RoutinesScreen(), styles, LegendItem() (+15 more)

### Community 51 - "AnvilAlarmModule.kt"
Cohesion: 0.19
Nodes (10): exceptions, field, manifest, AlarmOptions, AnvilAlarmModule, Context, Module, Record (+2 more)

### Community 52 - "ExerciseForm.tsx"
Cohesion: 0.24
Nodes (9): Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps, styles, EXERCISE_FRAMES, EQUIPMENT_I18N_KEYS, EXERCISE_TYPE_I18N_KEYS (+1 more)

### Community 53 - "AnvilAlarmModule"
Cohesion: 0.33
Nodes (5): Bool, Module, ModuleDefinition, AnvilAlarmModule, UNAuthorizationStatus

### Community 54 - "AnvilAlarmModule.swift"
Cohesion: 0.29
Nodes (6): Double, ExpoModulesCore, AlarmOptions, Record, String, UserNotifications

### Community 55 - "AlarmReceiver.kt"
Cohesion: 0.53
Nodes (4): BroadcastReceiver, Intent, AlarmReceiver, Context

### Community 56 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 57 - "types.ts"
Cohesion: 0.22
Nodes (10): Achievement, ActiveWorkoutExercise, PersonalRecord, Routine, RoutineExercise, RoutineExerciseSet, RoutineExerciseWithExercise, RoutineWithCount (+2 more)

### Community 58 - "routine/[id]/edit.tsx"
Cohesion: 0.29
Nodes (8): EditRoutineScreen(), DangerButton(), DangerButtonProps, styles, deleteRoutine(), getRoutine(), updateRoutine(), shape

### Community 59 - "WorkoutElapsed.tsx"
Cohesion: 0.47
Nodes (5): formatElapsed(), styles, useElapsedSeconds(), WorkoutElapsedHeaderTitle(), WorkoutElapsedHeaderTitleProps

### Community 60 - "AnvilLogo.tsx"
Cohesion: 0.15
Nodes (10): react-native-svg, AnvilLogo(), AnvilLogoProps, AnvilMarkProps, MARK_COLORS, styles, VIEWBOX, HeroGlowProps (+2 more)

### Community 62 - "with-abi-splits.js"
Cohesion: 0.29
Nodes (3): { withAppBuildGradle }, { withAppBuildGradle }, ref_expo_config_plugins

## Knowledge Gaps
- **696 isolated node(s):** `{ version, versionCode }`, `VARIANTS`, `BLOCKED_ANDROID_PERMISSIONS`, `{ defineConfig }`, `expoConfig` (+691 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 763 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `WorkoutSharePanel.tsx`, `react`, `settings.tsx`, `package.json`, `RestTimer.tsx`, `index.tsx`, `routines.ts`, `backup-file.ts`, `WeeklyGoalEditor.tsx`, `workout/[id].tsx`, `[exerciseId].tsx`, `WorkoutTools.tsx`, `Screen.tsx`, `statistics.tsx`, `AchievementBadge.tsx`, `app-theme-provider.tsx`, `WorkoutShareCard.tsx`, `AchievementDetailModal.tsx`, `RoutineForm.tsx`, `ExerciseSetEditor.tsx`, `routine/[id].tsx`, `useAppTheme`, `ExerciseForm.tsx`, `android-navigation-bar.tsx`, `routine/[id]/edit.tsx`, `WorkoutElapsed.tsx`, `AnvilLogo.tsx`?**
  _High betweenness centrality (0.288) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `WorkoutSharePanel.tsx`, `react`, `settings.tsx`, `react-native`, `RestTimer.tsx`, `index.tsx`, `exercise-metrics.ts`, `WeeklyGoalEditor.tsx`, `workout/[id].tsx`, `[exerciseId].tsx`, `WorkoutTools.tsx`, `Screen.tsx`, `statistics.tsx`, `app-theme-provider.tsx`, `calculator.ts`, `WorkoutShareCard.tsx`, `AchievementDetailModal.tsx`, `RoutineForm.tsx`, `useWorkoutToolsStore`, `ExerciseSetEditor.tsx`, `routine/[id].tsx`, `ExerciseForm.tsx`, `android-navigation-bar.tsx`, `routine/[id]/edit.tsx`, `WorkoutElapsed.tsx`, `AnvilLogo.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `{ version, versionCode }`, `VARIANTS`, `BLOCKED_ANDROID_PERMISSIONS` to the rest of the system?**
  _696 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.08133971291866028 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03773584905660377 - nodes in this community are weakly interconnected._