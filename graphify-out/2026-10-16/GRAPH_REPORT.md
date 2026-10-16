# Graph Report - anvil  (2026-10-16)

## Corpus Check
- 137 files · ~148,530 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1384 nodes · 3608 edges · 43 communities (40 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e9bab519`
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
- useAppTheme
- Anvil
- WorkoutTools.tsx
- scripts
- AchievementBadge.tsx
- index.tsx
- workout/[id].tsx
- workout-goals.ts
- constants/achievements.ts
- backup-file.ts
- achievements.test.ts
- app-theme-provider.tsx
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
- [exerciseId].tsx
- app/_layout.tsx
- index.ts
- routine/[id].tsx
- react-native
- android-navigation-bar.tsx
- devDependencies
- WorkoutShareCard.tsx
- statistics.tsx
- jest
- @expo/vector-icons
- AnvilLogo.tsx

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 115 edges
2. `react-native` - 65 edges
3. `react` - 48 edges
4. `react-i18next` - 45 edges
5. `withAlpha()` - 35 edges
6. `WorkoutExerciseScreen()` - 33 edges
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

## Communities (43 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (303): EXERCISE_FRAMES, frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up (+295 more)

### Community 1 - "ExerciseSetEditor.tsx"
Cohesion: 0.09
Nodes (44): DurationInput(), ExerciseSetEditor(), ExerciseSetEditorProps, formatReps(), formatSetValues(), parseNumber(), REST_MAX_SECONDS, REST_STEP_SECONDS (+36 more)

### Community 2 - "backup.ts"
Cohesion: 0.13
Nodes (21): BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_VERSION, BackupErrorCode, BackupPreferences, BackupRow, BackupRowValue, BackupTableData (+13 more)

### Community 3 - "utils/body-weight.ts"
Cohesion: 0.07
Nodes (69): dayjs, BodyComparisonLine(), BodyComparisonLineProps, styles, BodyWeightDelta(), BodyWeightDeltaProps, ICONS, styles (+61 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.14
Nodes (24): ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS, DistanceAchievementDefinition, DistanceAchievementKind, getEarnedDistanceAchievements() (+16 more)

### Community 6 - "settings.tsx"
Cohesion: 0.18
Nodes (17): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, setAppLanguage(), clampStep(), formatWeightStep(), useWeightStepStore (+9 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (40): main, name, private, version, @bryllim/workout-guide, eslint, eslint-config-expo, expo (+32 more)

### Community 8 - "useAppTheme"
Cohesion: 0.14
Nodes (25): AddExerciseScreen(), FilterChip(), FilterSection(), styles, ExerciseDetailModal(), muscleLabel(), styles, Chip() (+17 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (52): assets_audio_rest_finished, expo-audio, SetTimerButton(), formatCountdown(), RestTimer(), RestTimerAlarm(), styles, AdjustButton() (+44 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "AchievementBadge.tsx"
Cohesion: 0.13
Nodes (13): AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles, BadgeGlyph (+5 more)

### Community 13 - "index.tsx"
Cohesion: 0.14
Nodes (27): react, react-native-svg, AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles (+19 more)

### Community 14 - "workout/[id].tsx"
Cohesion: 0.06
Nodes (62): styles, WorkoutSessionScreen(), formatElapsed(), useElapsedSeconds(), WorkoutElapsedBar(), computeExerciseAchievementProgress(), METRIC_READERS, getExercisesAchievements() (+54 more)

### Community 15 - "workout-goals.ts"
Cohesion: 0.16
Nodes (11): ref_expo_sqlite_kv_store, zustand, ref_zustand_middleware, NotificationPermissionPrompt(), WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState (+3 more)

### Community 16 - "constants/achievements.ts"
Cohesion: 0.17
Nodes (16): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, AchievementProgress, ACHIEVEMENTS, AchievementScope, AchievementTier, computeAchievementProgress(), EXERCISE_METRIC_READERS, getAchievementByKey() (+8 more)

### Community 17 - "backup-file.ts"
Cohesion: 0.15
Nodes (19): expo-document-picker, expo-file-system, expo-sharing, BACKUP_APP, BACKUP_TYPE, BackupError, BackupFile, buildBackupData() (+11 more)

### Community 18 - "achievements.test.ts"
Cohesion: 0.16
Nodes (11): EXERCISE_STAT_ACHIEVEMENTS, getNextWeightComparative(), getVolumeComparison(), getWeightComparativeByKey(), getWeightComparativesAtOrBelow(), VolumeComparison, WEIGHT_COMPARATIVES, WeightComparativeDefinition (+3 more)

### Community 19 - "app-theme-provider.tsx"
Cohesion: 0.17
Nodes (10): ProgressBar(), ProgressBarProps, styles, styles, WeekStrip(), WeekStripProps, AppColorScheme, AppTheme (+2 more)

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
Cohesion: 0.22
Nodes (10): AppDialogProvider(), buttonAppearance(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions, DialogTone (+2 more)

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

### Community 32 - "[exerciseId].tsx"
Cohesion: 0.06
Nodes (77): expo-router, expo-sqlite, EditExerciseScreen(), styles, NewExerciseScreen(), EditRoutineScreen(), RoutineSetEditorScreen(), SetDraft (+69 more)

### Community 33 - "app/_layout.tsx"
Cohesion: 0.18
Nodes (9): expo-constants, expo-intent-launcher, expo-notifications, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), DATABASE_NAME (+1 more)

### Community 34 - "index.ts"
Cohesion: 0.21
Nodes (10): expo-localization, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 35 - "routine/[id].tsx"
Cohesion: 0.24
Nodes (10): ref_react_native_gesture_handler_reanimatedswipeable, RoutineDetailScreen(), styles, styles, SwipeToDelete(), SwipeToDeleteProps, getRoutineExercises(), removeExerciseFromRoutine() (+2 more)

### Community 36 - "react-native"
Cohesion: 0.13
Nodes (22): react-i18next, react-native, DangerButtonProps, styles, DetailModal(), DetailModalProps, styles, GoalToggleButton() (+14 more)

### Community 37 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 40 - "WorkoutShareCard.tsx"
Cohesion: 0.07
Nodes (68): ref_dayjs_locale_es, i18next, @testing-library/react-native, AchievementBadge(), AchievementCard(), AchievementCardProps, styles, AchievementDetailModal() (+60 more)

### Community 42 - "statistics.tsx"
Cohesion: 0.05
Nodes (58): expo-haptics, @shopify/react-native-skia, victory-native, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf() (+50 more)

### Community 43 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 44 - "@expo/vector-icons"
Cohesion: 0.15
Nodes (14): @expo/vector-icons, TabsLayout(), CarouselArrow(), RoutineForm(), RoutineFormProps, styles, RoutineHeaderTitle(), RoutineHeaderTitleProps (+6 more)

### Community 46 - "AnvilLogo.tsx"
Cohesion: 0.29
Nodes (6): AnvilLogo(), AnvilLogoProps, AnvilMarkProps, MARK_COLORS, styles, VIEWBOX

## Knowledge Gaps
- **686 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+681 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 719 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `ExerciseSetEditor.tsx`, `utils/body-weight.ts`, `settings.tsx`, `package.json`, `useAppTheme`, `WorkoutTools.tsx`, `AchievementBadge.tsx`, `index.tsx`, `workout/[id].tsx`, `workout-goals.ts`, `backup-file.ts`, `app-theme-provider.tsx`, `AppDialog.tsx`, `ToastProvider.tsx`, `[exerciseId].tsx`, `app/_layout.tsx`, `routine/[id].tsx`, `android-navigation-bar.tsx`, `WorkoutShareCard.tsx`, `statistics.tsx`, `@expo/vector-icons`, `AnvilLogo.tsx`?**
  _High betweenness centrality (0.337) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `[exerciseId].tsx`, `app/_layout.tsx`, `ExerciseSetEditor.tsx`, `routine/[id].tsx`, `utils/body-weight.ts`, `android-navigation-bar.tsx`, `settings.tsx`, `react-native`, `WorkoutShareCard.tsx`, `statistics.tsx`, `WorkoutTools.tsx`, `@expo/vector-icons`, `index.tsx`, `workout/[id].tsx`, `AnvilLogo.tsx`, `app-theme-provider.tsx`, `AppDialog.tsx`, `ToastProvider.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _686 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006578947368421052 - nodes in this community are weakly interconnected._
- **Should `ExerciseSetEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09098639455782313 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._