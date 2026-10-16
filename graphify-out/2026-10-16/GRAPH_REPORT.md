# Graph Report - anvil  (2026-10-16)

## Corpus Check
- 132 files · ~146,373 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1366 nodes · 3556 edges · 46 communities (43 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5f25bfb6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- exercise-metrics.ts
- backup.ts
- utils/body-weight.ts
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- add-exercise.tsx
- Anvil
- WorkoutTools.tsx
- scripts
- AchievementDetailModal.tsx
- index.tsx
- workout/[id].tsx
- workout-goals.ts
- useAppTheme
- backup-file.ts
- ExerciseSetEditor.tsx
- [exerciseId].tsx
- schema.ts
- tsconfig.json
- generate-icons.mjs
- ToastProvider.tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- WorkoutRecap.tsx
- app.config.js
- README npm scripts
- distance.ts
- routines.ts
- app/_layout.tsx
- index.ts
- routine/[id].tsx
- react-native
- android-navigation-bar.tsx
- database.ts
- devDependencies
- WorkoutShareCard.tsx
- WorkoutShareCard.test.tsx
- statistics.tsx
- jest
- @expo/vector-icons
- [reId].tsx

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 113 edges
2. `react-native` - 63 edges
3. `react` - 46 edges
4. `react-i18next` - 45 edges
5. `WorkoutExerciseScreen()` - 33 edges
6. `withAlpha()` - 33 edges
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

## Communities (46 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "exercise-metrics.ts"
Cohesion: 0.13
Nodes (28): RoutineSetEditorScreen(), ExerciseSetEditor(), DefaultSetTarget, DISTANCE_DURATION, distanceScale, DURATION, durationStepSeconds(), FREE_WEIGHT_EQUIPMENT (+20 more)

### Community 2 - "backup.ts"
Cohesion: 0.13
Nodes (22): BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_VERSION, BackupErrorCode, BackupPreferences, BackupRow, BackupRowValue, BackupTableData (+14 more)

### Community 3 - "utils/body-weight.ts"
Cohesion: 0.07
Nodes (66): dayjs, BodyComparisonLine(), BodyComparisonLineProps, styles, BodyWeightDelta(), BodyWeightDeltaProps, ICONS, styles (+58 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.05
Nodes (62): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles (+54 more)

### Community 6 - "settings.tsx"
Cohesion: 0.18
Nodes (17): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, setAppLanguage(), clampStep(), formatWeightStep(), useWeightStepStore (+9 more)

### Community 7 - "package.json"
Cohesion: 0.06
Nodes (35): main, name, private, version, @bryllim/workout-guide, eslint, eslint-config-expo, expo (+27 more)

### Community 8 - "add-exercise.tsx"
Cohesion: 0.17
Nodes (19): AddExerciseScreen(), styles, ExerciseDetailModal(), muscleLabel(), styles, ExerciseThumbnail(), ExerciseThumbnailProps, styles (+11 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (52): assets_audio_rest_finished, expo-audio, expo-notifications, SetTimerButton(), formatCountdown(), RestTimer(), RestTimerAlarm(), styles (+44 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "AchievementDetailModal.tsx"
Cohesion: 0.20
Nodes (18): AchievementBadge(), AchievementCard(), AchievementCardProps, styles, AchievementDetailModal(), AchievementDetailModalProps, formatNumber(), metricUnit() (+10 more)

### Community 13 - "index.tsx"
Cohesion: 0.08
Nodes (43): react-native-svg, AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, AnvilLogo() (+35 more)

### Community 14 - "workout/[id].tsx"
Cohesion: 0.06
Nodes (67): styles, WorkoutSessionScreen(), formatElapsed(), useElapsedSeconds(), WorkoutElapsedBar(), METRIC_READERS, getNextWeightComparative(), getExercisesAchievements() (+59 more)

### Community 15 - "workout-goals.ts"
Cohesion: 0.20
Nodes (10): ref_expo_sqlite_kv_store, zustand, ref_zustand_middleware, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState, THEME_STORAGE_KEY (+2 more)

### Community 16 - "useAppTheme"
Cohesion: 0.17
Nodes (13): FilterChip(), FilterSection(), DangerButton(), DangerButtonProps, styles, Chip(), EXERCISE_TYPES, ExerciseForm() (+5 more)

### Community 17 - "backup-file.ts"
Cohesion: 0.16
Nodes (18): expo-document-picker, expo-file-system, BACKUP_APP, BACKUP_TYPE, BackupError, BackupFile, buildBackupData(), assertNotWeb() (+10 more)

### Community 18 - "ExerciseSetEditor.tsx"
Cohesion: 0.20
Nodes (16): DurationInput(), ExerciseSetEditorProps, formatReps(), parseNumber(), REST_MAX_SECONDS, REST_STEP_SECONDS, SetCard(), SetCardProps (+8 more)

### Community 19 - "[exerciseId].tsx"
Cohesion: 0.19
Nodes (16): expo-haptics, firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), SetEditorItem, WorkoutToolsSheet() (+8 more)

### Community 20 - "schema.ts"
Cohesion: 0.12
Nodes (16): SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14, SCHEMA_V15, SCHEMA_V16 (+8 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "ToastProvider.tsx"
Cohesion: 0.25
Nodes (8): react-native-safe-area-context, AnimatedPressable, styles, ToastApi, ToastContext, ToastItem, ToastOptions, ToastProvider()

### Community 24 - "Strict TypeScript"
Cohesion: 0.33
Nodes (6): Path aliases @/* and @/assets/*, Testing (jest-expo + testing-library), Strict TypeScript, Verification gates (tsc, lint, test), README path aliases, Strict TypeScript in README

### Community 25 - "Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms"
Cohesion: 0.90
Nodes (5): Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms, Android Adaptive Icon Monochrome Layer — flat gray chevron 'A' silhouette with transparent background for Android themed icons, Anvil Web Favicon — solid blue chevron 'A' mark on a light-blue rounded square, small square format for browser tabs, Anvil App Icon — glossy white chevron 'A' mark centered on a blue gradient background with a faint blueprint grid and crosshairs, Anvil Splash Icon — faint white/translucent chevron 'A' mark on a transparent background, used for the native splash screen

### Community 26 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, ref_eslint_config, ref_eslint_config_expo_flat

### Community 28 - "WorkoutRecap.tsx"
Cohesion: 0.37
Nodes (11): WorkoutShareCard(), styles, WorkoutRecapModal(), DetectedPR, formatDuration(), formatPRDetail(), formatSessionClock(), formatSessionLength() (+3 more)

### Community 31 - "distance.ts"
Cohesion: 0.38
Nodes (11): formatSetValues(), displayToMeters(), distanceUnitLabel(), formatDistance(), formatDistanceValue(), formatDistanceWithUnit(), formatPace(), M_PER_MI (+3 more)

### Community 32 - "routines.ts"
Cohesion: 0.11
Nodes (27): react-native-reanimated, react-native-sortables, EditRoutineScreen(), RoutinesScreen(), styles, useDialog(), NotificationPermissionPrompt(), getDefaultSetTarget() (+19 more)

### Community 33 - "app/_layout.tsx"
Cohesion: 0.22
Nodes (7): expo-constants, expo-intent-launcher, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), AppThemeProvider()

### Community 34 - "index.ts"
Cohesion: 0.21
Nodes (10): expo-localization, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 35 - "routine/[id].tsx"
Cohesion: 0.24
Nodes (10): ref_react_native_gesture_handler_reanimatedswipeable, RoutineDetailScreen(), styles, styles, SwipeToDelete(), SwipeToDeleteProps, getRoutineExercises(), removeExerciseFromRoutine() (+2 more)

### Community 36 - "react-native"
Cohesion: 0.10
Nodes (31): react-i18next, react-native, DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions, DialogTone (+23 more)

### Community 37 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 38 - "database.ts"
Cohesion: 0.39
Nodes (7): seedAchievements(), DATABASE_NAME, initializeDatabase(), migrateDbIfNeeded(), seedExerciseCatalog(), MIGRATIONS, deleteOrphanedSets()

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 40 - "WorkoutShareCard.tsx"
Cohesion: 0.11
Nodes (28): ref_dayjs_locale_es, expo-clipboard, expo-media-library, expo-sharing, react-native-view-shot, AnvilMark(), capture(), copyShareImage() (+20 more)

### Community 41 - "WorkoutShareCard.test.tsx"
Cohesion: 0.33
Nodes (5): i18next, @testing-library/react-native, exercise(), makeRecap(), RecapExercise

### Community 42 - "statistics.tsx"
Cohesion: 0.06
Nodes (47): @shopify/react-native-skia, victory-native, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS (+39 more)

### Community 43 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 44 - "@expo/vector-icons"
Cohesion: 0.15
Nodes (14): @expo/vector-icons, TabsLayout(), CarouselArrow(), RoutineForm(), RoutineFormProps, styles, RoutineHeaderTitle(), RoutineHeaderTitleProps (+6 more)

### Community 49 - "[reId].tsx"
Cohesion: 0.12
Nodes (25): expo-router, expo-sqlite, react, EditExerciseScreen(), styles, NewExerciseScreen(), SetDraft, styles (+17 more)

## Knowledge Gaps
- **678 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+673 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 711 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `utils/body-weight.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `add-exercise.tsx`, `WorkoutTools.tsx`, `AchievementDetailModal.tsx`, `index.tsx`, `workout/[id].tsx`, `useAppTheme`, `backup-file.ts`, `ExerciseSetEditor.tsx`, `[exerciseId].tsx`, `ToastProvider.tsx`, `WorkoutRecap.tsx`, `routines.ts`, `app/_layout.tsx`, `routine/[id].tsx`, `android-navigation-bar.tsx`, `WorkoutShareCard.tsx`, `statistics.tsx`, `@expo/vector-icons`, `[reId].tsx`?**
  _High betweenness centrality (0.346) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `exercise-metrics.ts`, `utils/body-weight.ts`, `settings.tsx`, `add-exercise.tsx`, `WorkoutTools.tsx`, `AchievementDetailModal.tsx`, `index.tsx`, `workout/[id].tsx`, `ExerciseSetEditor.tsx`, `[exerciseId].tsx`, `ToastProvider.tsx`, `WorkoutRecap.tsx`, `routines.ts`, `app/_layout.tsx`, `routine/[id].tsx`, `react-native`, `android-navigation-bar.tsx`, `WorkoutShareCard.tsx`, `statistics.tsx`, `@expo/vector-icons`, `[reId].tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _678 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `exercise-metrics.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12643678160919541 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._