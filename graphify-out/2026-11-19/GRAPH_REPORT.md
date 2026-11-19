# Graph Report - anvil  (2026-11-19)

## Corpus Check
- 147 files · ~153,247 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .xml 2, .podspec 1)

## Summary
- 1491 nodes · 3828 edges · 56 communities (53 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `53dec7f4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- [exerciseId].tsx
- backup.ts
- utils/body-weight.ts
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- [reId].tsx
- Anvil
- RestTimer.tsx
- scripts
- gamification.ts
- index.tsx
- workouts.ts
- routines.ts
- useAppTheme
- backup-file.ts
- workout-goals.ts
- AlarmNotifier.kt
- schema.ts
- tsconfig.json
- generate-icons.mjs
- colors.ts
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- ToastProvider.tsx
- app.config.js
- README npm scripts
- WorkoutTools.tsx
- routine/[id].tsx
- statistics.tsx
- index.ts
- workout-tools.ts
- chart-dismiss.tsx
- AppDialog.tsx
- calculator.ts
- devDependencies
- WorkoutShareCard.tsx
- LineTrendChart.tsx
- stats.ts
- jest
- react
- anvil-alarm/index.ts
- useWorkoutToolsStore
- withAlpha
- add-exercise.tsx
- AlarmNotifier
- workout/[id].tsx
- AnvilAlarmModule.kt
- types.ts
- AnvilAlarmModule
- AnvilAlarmModule.swift
- AlarmReceiver.kt

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

## Communities (56 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (303): EXERCISE_FRAMES, frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up (+295 more)

### Community 1 - "[exerciseId].tsx"
Cohesion: 0.07
Nodes (72): RoutineSetEditorScreen(), findNextPendingExercise(), firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), DurationInput() (+64 more)

### Community 2 - "backup.ts"
Cohesion: 0.13
Nodes (22): BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_VERSION, BackupError, BackupErrorCode, BackupFile, BackupRow, BackupRowValue (+14 more)

### Community 3 - "utils/body-weight.ts"
Cohesion: 0.09
Nodes (64): dayjs, BodyWeightDelta(), BodyWeightDeltaProps, ICONS, styles, BodyWeightGoalEditor(), BodyWeightGoalEditorProps, GOAL_STEP (+56 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+45 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.05
Nodes (72): AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles, BadgeGlyph (+64 more)

### Community 6 - "settings.tsx"
Cohesion: 0.18
Nodes (17): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, setAppLanguage(), clampStep(), formatWeightStep(), useWeightStepStore (+9 more)

### Community 7 - "package.json"
Cohesion: 0.06
Nodes (35): main, name, private, version, eslint, eslint-config-expo, expo-application, expo-constants (+27 more)

### Community 8 - "[reId].tsx"
Cohesion: 0.11
Nodes (22): SetDraft, styles, DetailModal(), DetailModalProps, styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel() (+14 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "RestTimer.tsx"
Cohesion: 0.23
Nodes (16): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, WorkoutTimerAlarm(), ALARM_DURATION_MS (+8 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "gamification.ts"
Cohesion: 0.12
Nodes (31): unlockAchievementIfNew(), buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests, CardioSetRow, computeCardioPRs(), detectAndRecordPRs() (+23 more)

### Community 13 - "index.tsx"
Cohesion: 0.14
Nodes (25): react-native-svg, AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, HeroGlow() (+17 more)

### Community 14 - "workouts.ts"
Cohesion: 0.12
Nodes (27): WorkoutSessionScreen(), formatElapsed(), useElapsedSeconds(), WorkoutElapsedHeaderTitle(), getRoutineExerciseSets(), WorkoutLog, applyWorkoutExerciseOrder(), cancelWorkout() (+19 more)

### Community 15 - "routines.ts"
Cohesion: 0.21
Nodes (13): addExerciseToRoutine(), clampInt(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS, getRoutineExercise(), isTimedTarget(), positiveIntOrNull() (+5 more)

### Community 16 - "useAppTheme"
Cohesion: 0.12
Nodes (17): react-i18next, FilterChip(), FilterSection(), TabsLayout(), AnvilLogo(), AnvilLogoProps, AnvilMarkProps, MARK_COLORS (+9 more)

### Community 17 - "backup-file.ts"
Cohesion: 0.16
Nodes (18): expo-document-picker, expo-file-system, expo-sharing, BACKUP_TABLES, BACKUP_TYPE, BackupPreferences, buildBackupData(), assertNotWeb() (+10 more)

### Community 18 - "workout-goals.ts"
Cohesion: 0.20
Nodes (10): ref_expo_sqlite_kv_store, zustand, ref_zustand_middleware, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState, THEME_STORAGE_KEY (+2 more)

### Community 19 - "AlarmNotifier.kt"
Cohesion: 0.13
Nodes (14): activitymanager, alarmmanager, audioattributes, contextcompat, keyguardmanager, notificationchannel, notificationcompat, notificationmanager (+6 more)

### Community 20 - "schema.ts"
Cohesion: 0.11
Nodes (18): DATABASE_VERSION, MIGRATIONS, SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14 (+10 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "colors.ts"
Cohesion: 0.33
Nodes (5): AppTheme, darkColors, lightColors, palette, ThemeColors

### Community 24 - "Strict TypeScript"
Cohesion: 0.33
Nodes (6): Path aliases @/* and @/assets/*, Testing (jest-expo + testing-library), Strict TypeScript, Verification gates (tsc, lint, test), README path aliases, Strict TypeScript in README

### Community 25 - "Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms"
Cohesion: 0.90
Nodes (5): Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms, Android Adaptive Icon Monochrome Layer — flat gray chevron 'A' silhouette with transparent background for Android themed icons, Anvil Web Favicon — solid blue chevron 'A' mark on a light-blue rounded square, small square format for browser tabs, Anvil App Icon — glossy white chevron 'A' mark centered on a blue gradient background with a faint blueprint grid and crosshairs, Anvil Splash Icon — faint white/translucent chevron 'A' mark on a transparent background, used for the native splash screen

### Community 26 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, ref_eslint_config, ref_eslint_config_expo_flat

### Community 28 - "ToastProvider.tsx"
Cohesion: 0.25
Nodes (8): react-native-safe-area-context, AnimatedPressable, styles, ToastApi, ToastContext, ToastItem, ToastOptions, ToastProvider()

### Community 31 - "WorkoutTools.tsx"
Cohesion: 0.13
Nodes (23): AdjustButton(), AdjustButtonProps, ControlRow(), ControlRowProps, ConverterPanel(), KEY_LABELS, KEYPAD_ROWS, KEYPAD_SIDE (+15 more)

### Community 32 - "routine/[id].tsx"
Cohesion: 0.13
Nodes (21): ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, EditRoutineScreen(), RoutineDetailScreen(), styles, RoutinesScreen(), styles (+13 more)

### Community 33 - "statistics.tsx"
Cohesion: 0.18
Nodes (16): ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey, StatisticsScreen() (+8 more)

### Community 34 - "index.ts"
Cohesion: 0.21
Nodes (10): expo-localization, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 35 - "workout-tools.ts"
Cohesion: 0.14
Nodes (17): KeypadButtonProps, ConverterState, initialConverter, initialStopwatch, initialTimer, RestState, SetTimerState, StopwatchState (+9 more)

### Community 36 - "chart-dismiss.tsx"
Cohesion: 0.40
Nodes (4): ChartDismissArea(), ChartDismissAreaProps, ChartDismissContext, Subscribe

### Community 37 - "AppDialog.tsx"
Cohesion: 0.10
Nodes (21): expo-navigation-bar, expo-status-bar, expo-system-ui, react-native-gesture-handler, RootNavigator(), AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps (+13 more)

### Community 38 - "calculator.ts"
Cohesion: 0.24
Nodes (14): KeypadButton(), applyCalculatorKey(), CALCULATOR_MAX_LENGTH, CalculatorOperator, currentNumber(), evaluateExpression(), formatExpression(), formatResult() (+6 more)

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 40 - "WorkoutShareCard.tsx"
Cohesion: 0.07
Nodes (58): ref_dayjs_locale_es, expo-clipboard, expo-media-library, i18next, react-native-view-shot, @testing-library/react-native, AchievementBadge(), AchievementCard() (+50 more)

### Community 41 - "LineTrendChart.tsx"
Cohesion: 0.15
Nodes (14): expo-haptics, @shopify/react-native-skia, victory-native, BarTrendChartProps, BarTrendPoint, Scale, styles, ChartTooltip() (+6 more)

### Community 42 - "stats.ts"
Cohesion: 0.19
Nodes (12): addBucket(), BucketGranularity, bucketStart(), buildTimeSeries(), CardioStats, DayCount, getCardioStats(), mondayOf() (+4 more)

### Community 43 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 44 - "react"
Cohesion: 0.22
Nodes (11): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, react, CarouselArrow(), RoutineForm(), RoutineFormProps, styles, DEFAULT_ROUTINE_GLYPH, getRoutineGlyph() (+3 more)

### Community 45 - "anvil-alarm/index.ts"
Cohesion: 0.18
Nodes (9): AlarmOptions, AnvilAlarm, AnvilAlarmNativeModule, cancel(), dismiss(), getPermissionStatusAsync(), requestPermissionAsync(), scheduleAsync() (+1 more)

### Community 46 - "useWorkoutToolsStore"
Cohesion: 0.21
Nodes (16): SetTimerButton(), formatStopwatch(), formatTimer(), StopwatchPanel(), TimerPanel(), useNow(), WorkoutToolsButton(), clampDuration() (+8 more)

### Community 47 - "withAlpha"
Cohesion: 0.16
Nodes (16): StatTile(), AppDialogProvider(), buttonAppearance(), toneColor(), BarTrendChart(), useChartDismiss(), LineTrendChart(), DonutSlice (+8 more)

### Community 48 - "add-exercise.tsx"
Cohesion: 0.13
Nodes (24): @bryllim/workout-guide, expo-router, expo-sqlite, EditExerciseScreen(), styles, NewExerciseScreen(), AddExerciseScreen(), styles (+16 more)

### Community 49 - "AlarmNotifier"
Cohesion: 0.38
Nodes (3): AlarmOptions, AlarmNotifier, Context

### Community 50 - "workout/[id].tsx"
Cohesion: 0.12
Nodes (27): @expo/vector-icons, react-native, styles, DangerButton(), DangerButtonProps, styles, ExerciseThumbnail(), ExerciseThumbnailProps (+19 more)

### Community 51 - "AnvilAlarmModule.kt"
Cohesion: 0.19
Nodes (10): exceptions, field, manifest, AlarmOptions, AnvilAlarmModule, Context, Module, Record (+2 more)

### Community 52 - "types.ts"
Cohesion: 0.22
Nodes (10): Achievement, ActiveWorkoutExercise, PersonalRecord, Routine, RoutineExercise, RoutineExerciseSet, RoutineExerciseWithExercise, RoutineWithCount (+2 more)

### Community 53 - "AnvilAlarmModule"
Cohesion: 0.33
Nodes (5): Bool, Module, ModuleDefinition, AnvilAlarmModule, UNAuthorizationStatus

### Community 54 - "AnvilAlarmModule.swift"
Cohesion: 0.29
Nodes (6): Double, ExpoModulesCore, AlarmOptions, Record, String, UserNotifications

### Community 55 - "AlarmReceiver.kt"
Cohesion: 0.53
Nodes (4): BroadcastReceiver, Intent, AlarmReceiver, Context

## Knowledge Gaps
- **681 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `AlarmOptions`, `ExpoModulesCore` (+676 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 744 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `workout/[id].tsx` to `exercise-frames.ts`, `[exerciseId].tsx`, `utils/body-weight.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `[reId].tsx`, `RestTimer.tsx`, `index.tsx`, `useAppTheme`, `backup-file.ts`, `ToastProvider.tsx`, `WorkoutTools.tsx`, `routine/[id].tsx`, `statistics.tsx`, `chart-dismiss.tsx`, `AppDialog.tsx`, `WorkoutShareCard.tsx`, `LineTrendChart.tsx`, `react`, `withAlpha`, `add-exercise.tsx`?**
  _High betweenness centrality (0.302) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `add-exercise.tsx` to `routine/[id].tsx`, `[exerciseId].tsx`, `backup.ts`, `utils/body-weight.ts`, `AppDialog.tsx`, `settings.tsx`, `package.json`, `[reId].tsx`, `db/achievements.ts`, `stats.ts`, `gamification.ts`, `workouts.ts`, `routines.ts`, `backup-file.ts`, `workout/[id].tsx`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _681 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006578947368421052 - nodes in this community are weakly interconnected._
- **Should `[exerciseId].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06759259259259259 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._