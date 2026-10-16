# Graph Report - anvil  (2026-10-16)

## Corpus Check
- 140 files · ~151,922 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1418 nodes · 3681 edges · 53 communities (50 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `647e2b88`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- ExerciseSetEditor.tsx
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
- gamification.ts
- index.tsx
- workout/[id].tsx
- routines.ts
- constants/achievements.ts
- backup-file.ts
- workout-goals.ts
- ExerciseThumbnail.tsx
- schema.ts
- tsconfig.json
- generate-icons.mjs
- AppDialog.tsx
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
- app/_layout.tsx
- calculator.ts
- devDependencies
- WorkoutShareCard.tsx
- colors.ts
- stats.ts
- jest
- useAppTheme
- android-navigation-bar.tsx
- useWorkoutToolsStore
- withAlpha
- react
- WorkoutExerciseScreen
- [exerciseId].tsx
- unit-converter.ts
- database.ts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 116 edges
2. `react-native` - 64 edges
3. `react` - 48 edges
4. `react-i18next` - 44 edges
5. `withAlpha()` - 35 edges
6. `WorkoutExerciseScreen()` - 34 edges
7. `@expo/vector-icons` - 32 edges
8. `expo-sqlite` - 32 edges
9. `getAchievementByKey()` - 31 edges
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

## Communities (53 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "ExerciseSetEditor.tsx"
Cohesion: 0.09
Nodes (48): RoutineSetEditorScreen(), DurationInput(), ExerciseSetEditor(), ExerciseSetEditorProps, formatReps(), parseNumber(), REST_MAX_SECONDS, REST_STEP_SECONDS (+40 more)

### Community 2 - "backup.ts"
Cohesion: 0.13
Nodes (21): BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_VERSION, BackupErrorCode, BackupRow, BackupRowValue, BackupTableData (+13 more)

### Community 3 - "utils/body-weight.ts"
Cohesion: 0.08
Nodes (60): dayjs, BodyWeightDelta(), BodyWeightDeltaProps, ICONS, styles, BodyWeightGoalEditor(), BodyWeightGoalEditorProps, GOAL_STEP (+52 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.11
Nodes (30): computeAchievementProgress(), computeExerciseAchievementProgress(), EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats, getAchievementByKey(), DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX (+22 more)

### Community 6 - "settings.tsx"
Cohesion: 0.18
Nodes (17): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, setAppLanguage(), clampStep(), formatWeightStep(), useWeightStepStore (+9 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (37): main, name, private, version, @bryllim/workout-guide, eslint, eslint-config-expo, expo (+29 more)

### Community 8 - "add-exercise.tsx"
Cohesion: 0.15
Nodes (22): AddExerciseScreen(), FilterChip(), FilterSection(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel(), styles (+14 more)

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
Cohesion: 0.13
Nodes (29): unlockAchievementIfNew(), buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests, CardioSetRow, computeCardioPRs(), detectAndRecordPRs() (+21 more)

### Community 13 - "index.tsx"
Cohesion: 0.09
Nodes (35): react-native-svg, AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, AnvilLogo() (+27 more)

### Community 14 - "workout/[id].tsx"
Cohesion: 0.10
Nodes (38): styles, WorkoutSessionScreen(), formatElapsed(), useElapsedSeconds(), WorkoutElapsedHeaderTitle(), getRoutineExerciseSets(), SetTargetInput, Achievement (+30 more)

### Community 15 - "routines.ts"
Cohesion: 0.18
Nodes (16): NewExerciseScreen(), ExerciseForm(), createExercise(), addExerciseToRoutine(), clampInt(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS (+8 more)

### Community 16 - "constants/achievements.ts"
Cohesion: 0.09
Nodes (24): ACHIEVEMENT_CATEGORY_ORDER, AchievementMetric, AchievementProgress, ACHIEVEMENTS, AchievementScope, AchievementTier, BODY_ACHIEVEMENTS, EXERCISE_METRIC_READERS (+16 more)

### Community 17 - "backup-file.ts"
Cohesion: 0.16
Nodes (18): expo-document-picker, expo-file-system, BACKUP_TYPE, BackupError, BackupFile, BackupPreferences, buildBackupData(), assertNotWeb() (+10 more)

### Community 18 - "workout-goals.ts"
Cohesion: 0.20
Nodes (10): ref_expo_sqlite_kv_store, zustand, ref_zustand_middleware, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState, THEME_STORAGE_KEY (+2 more)

### Community 19 - "ExerciseThumbnail.tsx"
Cohesion: 0.17
Nodes (12): Chip(), EXERCISE_TYPES, ExerciseFormProps, styles, ExerciseThumbnail(), ExerciseThumbnailProps, styles, EXERCISE_FRAMES (+4 more)

### Community 20 - "schema.ts"
Cohesion: 0.11
Nodes (18): DATABASE_VERSION, MIGRATIONS, SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14 (+10 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "AppDialog.tsx"
Cohesion: 0.18
Nodes (12): AppDialogProvider(), buttonAppearance(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions, DialogTone (+4 more)

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
Cohesion: 0.12
Nodes (16): AdjustButton(), AdjustButtonProps, ControlRow(), ControlRowProps, KEY_LABELS, KEYPAD_ROWS, KEYPAD_SIDE, KeypadButton() (+8 more)

### Community 32 - "routine/[id].tsx"
Cohesion: 0.23
Nodes (11): ref_react_native_gesture_handler_reanimatedswipeable, RoutineDetailScreen(), styles, styles, SwipeToDelete(), SwipeToDeleteProps, getRoutine(), getRoutineExercises() (+3 more)

### Community 33 - "statistics.tsx"
Cohesion: 0.18
Nodes (17): ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey, StatisticsScreen() (+9 more)

### Community 34 - "index.ts"
Cohesion: 0.21
Nodes (10): expo-localization, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 35 - "workout-tools.ts"
Cohesion: 0.13
Nodes (17): KeypadButtonProps, ConverterState, initialConverter, initialStopwatch, initialTimer, RestState, SetTimerState, StopwatchState (+9 more)

### Community 36 - "chart-dismiss.tsx"
Cohesion: 0.40
Nodes (4): ChartDismissArea(), ChartDismissAreaProps, ChartDismissContext, Subscribe

### Community 37 - "app/_layout.tsx"
Cohesion: 0.18
Nodes (9): expo-constants, expo-intent-launcher, expo-notifications, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), DATABASE_NAME (+1 more)

### Community 38 - "calculator.ts"
Cohesion: 0.24
Nodes (14): applyCalculatorKey(), CALCULATOR_MAX_LENGTH, CalculatorOperator, CalculatorState, currentNumber(), evaluateExpression(), formatExpression(), formatResult() (+6 more)

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 40 - "WorkoutShareCard.tsx"
Cohesion: 0.05
Nodes (83): ref_dayjs_locale_es, expo-clipboard, expo-media-library, expo-sharing, i18next, react-native-view-shot, @testing-library/react-native, AchievementBadge() (+75 more)

### Community 41 - "colors.ts"
Cohesion: 0.12
Nodes (17): expo-haptics, @shopify/react-native-skia, victory-native, BarTrendChartProps, BarTrendPoint, Scale, styles, ChartTooltip() (+9 more)

### Community 42 - "stats.ts"
Cohesion: 0.20
Nodes (11): addBucket(), BucketGranularity, bucketStart(), buildTimeSeries(), CardioStats, DayCount, mondayOf(), MuscleSlice (+3 more)

### Community 43 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 44 - "useAppTheme"
Cohesion: 0.12
Nodes (21): @expo/vector-icons, ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, TabsLayout(), DangerButton(), DangerButtonProps, styles, GoalToggleButton(), CarouselArrow() (+13 more)

### Community 45 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 46 - "useWorkoutToolsStore"
Cohesion: 0.23
Nodes (15): SetTimerButton(), formatStopwatch(), formatTimer(), StopwatchPanel(), TimerPanel(), useNow(), WorkoutToolsButton(), clampDuration() (+7 more)

### Community 47 - "withAlpha"
Cohesion: 0.19
Nodes (13): StatTile(), BarTrendChart(), useChartDismiss(), LineTrendChart(), DonutSlice, MuscleDonut(), MuscleDonutProps, styles (+5 more)

### Community 48 - "react"
Cohesion: 0.14
Nodes (24): expo-router, expo-sqlite, react, EditExerciseScreen(), styles, EditRoutineScreen(), NewRoutineScreen(), RoutinesScreen() (+16 more)

### Community 49 - "WorkoutExerciseScreen"
Cohesion: 0.25
Nodes (8): findNextPendingExercise(), firstIncompleteSet(), shiftMapDown(), WorkoutExerciseScreen(), getExerciseAchievementUnlockedAt(), deleteSetAndShift(), markWorkoutSetsEdited(), upsertSet()

### Community 50 - "[exerciseId].tsx"
Cohesion: 0.12
Nodes (27): react-i18next, react-native, SetDraft, styles, SetDraft, styles, DetailModal(), DetailModalProps (+19 more)

### Community 53 - "unit-converter.ts"
Cohesion: 0.38
Nodes (8): ConverterPanel(), CONVERTER_CATEGORIES, converterUnits(), convertUnit(), DEFAULT_PAIRS, defaultConverterUnits(), formatConverted(), UNITS

### Community 55 - "database.ts"
Cohesion: 0.52
Nodes (6): backfillPerExerciseAchievements(), seedAchievements(), initializeDatabase(), migrateDbIfNeeded(), seedExerciseCatalog(), deleteOrphanedSets()

## Knowledge Gaps
- **695 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+690 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 729 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `[exerciseId].tsx` to `exercise-frames.ts`, `ExerciseSetEditor.tsx`, `utils/body-weight.ts`, `settings.tsx`, `package.json`, `add-exercise.tsx`, `RestTimer.tsx`, `index.tsx`, `workout/[id].tsx`, `routines.ts`, `backup-file.ts`, `ExerciseThumbnail.tsx`, `AppDialog.tsx`, `ToastProvider.tsx`, `WorkoutTools.tsx`, `routine/[id].tsx`, `statistics.tsx`, `chart-dismiss.tsx`, `app/_layout.tsx`, `WorkoutShareCard.tsx`, `colors.ts`, `useAppTheme`, `android-navigation-bar.tsx`, `withAlpha`, `react`?**
  _High betweenness centrality (0.327) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `ExerciseSetEditor.tsx`, `utils/body-weight.ts`, `settings.tsx`, `add-exercise.tsx`, `RestTimer.tsx`, `index.tsx`, `workout/[id].tsx`, `routines.ts`, `ExerciseThumbnail.tsx`, `AppDialog.tsx`, `ToastProvider.tsx`, `WorkoutTools.tsx`, `routine/[id].tsx`, `statistics.tsx`, `app/_layout.tsx`, `WorkoutShareCard.tsx`, `colors.ts`, `android-navigation-bar.tsx`, `useWorkoutToolsStore`, `withAlpha`, `react`, `WorkoutExerciseScreen`, `[exerciseId].tsx`, `unit-converter.ts`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _695 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `ExerciseSetEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08780841799709724 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._