# Graph Report - anvil  (2026-11-19)

## Corpus Check
- 158 files · ~158,771 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .xml 2, .podspec 1)

## Summary
- 1539 nodes · 3922 edges · 61 communities (56 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c2b8a128`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- WorkoutShareCard.tsx
- backup.ts
- utils/body-weight.ts
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
- gamification.ts
- routines.ts
- ExerciseSetEditor.tsx
- backup-file.ts
- body-weight-goal.ts
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
- [reId].tsx
- statistics.tsx
- WorkoutShareCard.test.tsx
- workout-tools.ts
- weight-comparatives.ts
- app-theme-provider.tsx
- calculator.ts
- devDependencies
- WorkoutRecap.tsx
- AchievementDetailModal.tsx
- distance.ts
- jest
- RoutineForm.tsx
- anvil-alarm/index.ts
- useWorkoutToolsStore
- withAlpha
- routine/[id].tsx
- AlarmNotifier
- useAppTheme
- AnvilAlarmModule.kt
- ExerciseForm.tsx
- AnvilAlarmModule
- AnvilAlarmModule.swift
- AlarmReceiver.kt
- react-native
- with-abi-splits.test.ts
- with-abi-splits.js
- build-android-release.sh
- with-release-signing.test.ts

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

## Communities (61 total, 5 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "WorkoutShareCard.tsx"
Cohesion: 0.11
Nodes (29): ref_dayjs_locale_es, expo-clipboard, expo-media-library, expo-sharing, react-native-view-shot, AnvilMark(), capture(), copyShareImage() (+21 more)

### Community 2 - "backup.ts"
Cohesion: 0.15
Nodes (20): BACKUP_INSERT_ORDER, BACKUP_VERSION, BackupError, BackupErrorCode, BackupRow, BackupRowValue, BackupTableData, BackupTableName (+12 more)

### Community 3 - "utils/body-weight.ts"
Cohesion: 0.08
Nodes (57): BodyWeightDelta(), BodyWeightDeltaProps, ICONS, styles, BodyWeightGoalEditor(), BodyWeightGoalEditorProps, GOAL_STEP, styles (+49 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (51): dependencies, @bryllim/workout-guide, dayjs, expo, expo-audio, expo-build-properties, expo-clipboard, expo-constants (+43 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.09
Nodes (45): AchievementProgress, AchievementScope, AchievementTier, computeAchievementProgress(), computeExerciseAchievementProgress(), EXERCISE_METRIC_READERS, EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats (+37 more)

### Community 6 - "settings.tsx"
Cohesion: 0.15
Nodes (21): ref_expo_sqlite_kv_store, SettingsScreen(), styles, SwitchRowProps, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage() (+13 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (37): main, name, private, @bryllim/workout-guide, eslint, eslint-config-expo, expo-build-properties, expo-constants (+29 more)

### Community 8 - "add-exercise.tsx"
Cohesion: 0.15
Nodes (22): AddExerciseScreen(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel(), styles, ExerciseThumbnail(), EXERCISE_FRAMES (+14 more)

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
Cohesion: 0.20
Nodes (8): AchievementBadge(), AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles

### Community 13 - "index.tsx"
Cohesion: 0.15
Nodes (26): AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, HeroGlow(), HeroGlowProps (+18 more)

### Community 14 - "gamification.ts"
Cohesion: 0.13
Nodes (27): unlockAchievementIfNew(), buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests, CardioSetRow, computeCardioPRs(), detectAndRecordPRs() (+19 more)

### Community 15 - "routines.ts"
Cohesion: 0.15
Nodes (18): NewRoutineScreen(), getDefaultSetTarget(), addExerciseToRoutine(), clampInt(), createRoutine(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS (+10 more)

### Community 16 - "ExerciseSetEditor.tsx"
Cohesion: 0.09
Nodes (48): DurationInput(), ExerciseSetEditor(), ExerciseSetEditorProps, formatReps(), formatSetValues(), parseNumber(), REST_MAX_SECONDS, REST_STEP_SECONDS (+40 more)

### Community 17 - "backup-file.ts"
Cohesion: 0.19
Nodes (16): BACKUP_APP, BACKUP_TABLES, BACKUP_TYPE, BackupFile, BackupPreferences, buildBackupData(), assertNotWeb(), clearPreferences() (+8 more)

### Community 18 - "body-weight-goal.ts"
Cohesion: 0.13
Nodes (15): zustand, ref_zustand_middleware, StepIcon(), StepIconProps, styles, styles, BODY_WEIGHT_GOAL_STORAGE_KEY, BodyWeightGoalState (+7 more)

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
Cohesion: 0.11
Nodes (36): styles, WorkoutSessionScreen(), getExercisesAchievements(), getRoutineExerciseSets(), SetTargetInput, Achievement, ActiveWorkoutExercise, PersonalRecord (+28 more)

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
Nodes (18): findNextPendingExercise(), firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), formatElapsed(), styles (+10 more)

### Community 29 - "app.config.js"
Cohesion: 0.33
Nodes (5): BLOCKED_ANDROID_PERMISSIONS, VARIANTS, { version, versionCode }, version, versionCode

### Community 31 - "WorkoutTools.tsx"
Cohesion: 0.13
Nodes (23): AdjustButton(), AdjustButtonProps, ControlRow(), ControlRowProps, ConverterPanel(), KEY_LABELS, KEYPAD_ROWS, KEYPAD_SIDE (+15 more)

### Community 32 - "[reId].tsx"
Cohesion: 0.15
Nodes (25): expo-router, expo-sqlite, react-native-safe-area-context, EditExerciseScreen(), styles, EditRoutineScreen(), RoutineSetEditorScreen(), SetDraft (+17 more)

### Community 33 - "statistics.tsx"
Cohesion: 0.10
Nodes (31): ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey, StatisticsScreen() (+23 more)

### Community 34 - "WorkoutShareCard.test.tsx"
Cohesion: 0.18
Nodes (9): i18next, @testing-library/react-native, exercise(), makeRecap(), RecapExercise, src_i18n_locales_en, src_i18n_locales_es, flattenKeys() (+1 more)

### Community 35 - "workout-tools.ts"
Cohesion: 0.14
Nodes (17): KeypadButtonProps, ConverterState, initialConverter, initialStopwatch, initialTimer, RestState, SetTimerState, StopwatchState (+9 more)

### Community 36 - "weight-comparatives.ts"
Cohesion: 0.17
Nodes (12): BadgeGlyph, BadgeGlyphName, CATEGORY_GLYPHS, getBadgeGlyph(), GLYPHS, ACHIEVEMENTS, ALL_KEYS, getNextWeightComparative() (+4 more)

### Community 37 - "app-theme-provider.tsx"
Cohesion: 0.07
Nodes (35): expo-navigation-bar, expo-status-bar, expo-system-ui, react, react-native-gesture-handler, RootNavigator(), AndroidNavigationBar(), loadNavigationBar() (+27 more)

### Community 38 - "calculator.ts"
Cohesion: 0.24
Nodes (14): KeypadButton(), applyCalculatorKey(), CALCULATOR_MAX_LENGTH, CalculatorOperator, currentNumber(), evaluateExpression(), formatExpression(), formatResult() (+6 more)

### Community 39 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-expo, jest, jest-expo, test-renderer, @testing-library/react-native, @types/jest (+2 more)

### Community 40 - "WorkoutRecap.tsx"
Cohesion: 0.37
Nodes (11): WorkoutShareCard(), styles, WorkoutRecapModal(), DetectedPR, formatDuration(), formatPRDetail(), formatSessionClock(), formatSessionLength() (+3 more)

### Community 41 - "AchievementDetailModal.tsx"
Cohesion: 0.18
Nodes (21): dayjs, AchievementCard(), AchievementCardProps, styles, AchievementDetailModal(), AchievementDetailModalProps, formatNumber(), metricUnit() (+13 more)

### Community 42 - "distance.ts"
Cohesion: 0.41
Nodes (10): displayToMeters(), distanceUnitLabel(), formatDistance(), formatDistanceValue(), formatDistanceWithUnit(), formatPace(), M_PER_MI, M_PER_YD (+2 more)

### Community 43 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 44 - "RoutineForm.tsx"
Cohesion: 0.21
Nodes (11): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, CarouselArrow(), RoutineForm(), RoutineFormProps, styles, RoutineHeaderTitle(), DEFAULT_ROUTINE_GLYPH, getRoutineGlyph() (+3 more)

### Community 45 - "anvil-alarm/index.ts"
Cohesion: 0.18
Nodes (9): AlarmOptions, AnvilAlarm, AnvilAlarmNativeModule, cancel(), dismiss(), getPermissionStatusAsync(), requestPermissionAsync(), scheduleAsync() (+1 more)

### Community 46 - "useWorkoutToolsStore"
Cohesion: 0.21
Nodes (16): SetTimerButton(), formatStopwatch(), formatTimer(), StopwatchPanel(), TimerPanel(), useNow(), WorkoutToolsButton(), clampDuration() (+8 more)

### Community 47 - "withAlpha"
Cohesion: 0.07
Nodes (49): expo-haptics, react-native-svg, AnimatedBar(), AnimatedBarProps, AnimatedCurve(), AnimatedCurveProps, AnimatedPath, AnimatedRect (+41 more)

### Community 48 - "routine/[id].tsx"
Cohesion: 0.31
Nodes (9): react-native-reanimated, react-native-sortables, RoutineDetailScreen(), styles, getRoutine(), getRoutineExercises(), removeExerciseFromRoutine(), reorderRoutineExercises() (+1 more)

### Community 49 - "AlarmNotifier"
Cohesion: 0.38
Nodes (3): AlarmOptions, AlarmNotifier, Context

### Community 50 - "useAppTheme"
Cohesion: 0.11
Nodes (19): react-i18next, FilterChip(), FilterSection(), SwitchRow(), TabsLayout(), AnvilLogo(), AnvilLogoProps, AnvilMarkProps (+11 more)

### Community 51 - "AnvilAlarmModule.kt"
Cohesion: 0.19
Nodes (10): exceptions, field, manifest, AlarmOptions, AnvilAlarmModule, Context, Module, Record (+2 more)

### Community 52 - "ExerciseForm.tsx"
Cohesion: 0.31
Nodes (7): NewExerciseScreen(), Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps, styles, createExercise()

### Community 53 - "AnvilAlarmModule"
Cohesion: 0.33
Nodes (5): Bool, Module, ModuleDefinition, AnvilAlarmModule, UNAuthorizationStatus

### Community 54 - "AnvilAlarmModule.swift"
Cohesion: 0.29
Nodes (6): Double, ExpoModulesCore, AlarmOptions, Record, String, UserNotifications

### Community 55 - "AlarmReceiver.kt"
Cohesion: 0.53
Nodes (4): BroadcastReceiver, Intent, AlarmReceiver, Context

### Community 58 - "react-native"
Cohesion: 0.12
Nodes (22): @expo/vector-icons, react-native, ref_react_native_gesture_handler_reanimatedswipeable, DangerButtonProps, styles, DetailModal(), DetailModalProps, styles (+14 more)

### Community 62 - "with-abi-splits.js"
Cohesion: 0.29
Nodes (3): { withAppBuildGradle }, { withAppBuildGradle }, ref_expo_config_plugins

## Knowledge Gaps
- **699 isolated node(s):** `{ version, versionCode }`, `VARIANTS`, `BLOCKED_ANDROID_PERMISSIONS`, `{ defineConfig }`, `expoConfig` (+694 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 767 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `WorkoutShareCard.tsx`, `utils/body-weight.ts`, `settings.tsx`, `package.json`, `add-exercise.tsx`, `RestTimer.tsx`, `AchievementBadge.tsx`, `index.tsx`, `routines.ts`, `ExerciseSetEditor.tsx`, `backup-file.ts`, `body-weight-goal.ts`, `workout/[id].tsx`, `[exerciseId].tsx`, `WorkoutTools.tsx`, `[reId].tsx`, `statistics.tsx`, `app-theme-provider.tsx`, `WorkoutRecap.tsx`, `AchievementDetailModal.tsx`, `RoutineForm.tsx`, `withAlpha`, `routine/[id].tsx`, `useAppTheme`, `ExerciseForm.tsx`?**
  _High betweenness centrality (0.295) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `WorkoutShareCard.tsx`, `utils/body-weight.ts`, `settings.tsx`, `add-exercise.tsx`, `RestTimer.tsx`, `index.tsx`, `ExerciseSetEditor.tsx`, `body-weight-goal.ts`, `workout/[id].tsx`, `[exerciseId].tsx`, `WorkoutTools.tsx`, `[reId].tsx`, `statistics.tsx`, `app-theme-provider.tsx`, `calculator.ts`, `WorkoutRecap.tsx`, `AchievementDetailModal.tsx`, `RoutineForm.tsx`, `useWorkoutToolsStore`, `withAlpha`, `routine/[id].tsx`, `ExerciseForm.tsx`, `react-native`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `{ version, versionCode }`, `VARIANTS`, `BLOCKED_ANDROID_PERMISSIONS` to the rest of the system?**
  _699 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `WorkoutShareCard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11363636363636363 - nodes in this community are weakly interconnected._
- **Should `utils/body-weight.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08065268065268065 - nodes in this community are weakly interconnected._