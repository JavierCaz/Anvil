# Graph Report - anvil  (2026-10-16)

## Corpus Check
- 133 files · ~146,420 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1367 nodes · 3559 edges · 44 communities (41 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5f25bfb6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- [exerciseId].tsx
- backup.ts
- utils/body-weight.ts
- dependencies
- constants/achievements.ts
- settings.tsx
- package.json
- add-exercise.tsx
- Anvil
- WorkoutTools.tsx
- scripts
- AchievementBadge.tsx
- index.tsx
- workouts.ts
- workout-goals.ts
- ExerciseForm.tsx
- backup-file.ts
- achievements.test.ts
- db/achievements.ts
- schema.ts
- tsconfig.json
- generate-icons.mjs
- ToastProvider.tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- weight-comparatives.ts
- app.config.js
- README npm scripts
- routines.ts
- app/_layout.tsx
- index.ts
- useAppTheme
- workout/[id].tsx
- android-navigation-bar.tsx
- database.ts
- devDependencies
- WorkoutShareCard.tsx
- statistics.tsx
- jest
- RoutineForm.tsx
- expo-sqlite

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

## Communities (44 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "[exerciseId].tsx"
Cohesion: 0.06
Nodes (74): RoutineSetEditorScreen(), SetDraft, styles, firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen() (+66 more)

### Community 2 - "backup.ts"
Cohesion: 0.14
Nodes (21): BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_VERSION, BackupError, BackupErrorCode, BackupRow, BackupRowValue, BackupTableData (+13 more)

### Community 3 - "utils/body-weight.ts"
Cohesion: 0.08
Nodes (68): dayjs, AchievementDetailModal(), metricUnit(), BodyComparisonLine(), BodyComparisonLineProps, styles, BodyWeightDelta(), BodyWeightDeltaProps (+60 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "constants/achievements.ts"
Cohesion: 0.15
Nodes (18): AchievementProgress, AchievementScope, AchievementTier, computeAchievementProgress(), EXERCISE_METRIC_READERS, EXERCISE_STAT_ACHIEVEMENTS, getAchievementByKey(), normalizeBodyComparative() (+10 more)

### Community 6 - "settings.tsx"
Cohesion: 0.18
Nodes (17): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, setAppLanguage(), clampStep(), formatWeightStep(), useWeightStepStore (+9 more)

### Community 7 - "package.json"
Cohesion: 0.06
Nodes (35): main, name, private, version, @bryllim/workout-guide, eslint, eslint-config-expo, expo (+27 more)

### Community 8 - "add-exercise.tsx"
Cohesion: 0.14
Nodes (23): AddExerciseScreen(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel(), styles, ExerciseThumbnail(), EXERCISE_FRAMES (+15 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (51): assets_audio_rest_finished, expo-audio, SetTimerButton(), formatCountdown(), RestTimer(), RestTimerAlarm(), styles, AdjustButton() (+43 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "AchievementBadge.tsx"
Cohesion: 0.13
Nodes (13): AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles, BadgeGlyph (+5 more)

### Community 13 - "index.tsx"
Cohesion: 0.09
Nodes (40): react, react-native-svg, AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles (+32 more)

### Community 14 - "workouts.ts"
Cohesion: 0.06
Nodes (61): WorkoutSessionScreen(), METRIC_READERS, getNextWeightComparative(), buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests, CardioSetRow (+53 more)

### Community 15 - "workout-goals.ts"
Cohesion: 0.20
Nodes (9): zustand, ref_zustand_middleware, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState, THEME_STORAGE_KEY, ThemePreference (+1 more)

### Community 16 - "ExerciseForm.tsx"
Cohesion: 0.28
Nodes (7): NewExerciseScreen(), Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps, styles, createExercise()

### Community 17 - "backup-file.ts"
Cohesion: 0.16
Nodes (18): expo-document-picker, expo-file-system, BACKUP_APP, BACKUP_TYPE, BackupFile, BackupPreferences, buildBackupData(), assertNotWeb() (+10 more)

### Community 18 - "achievements.test.ts"
Cohesion: 0.21
Nodes (12): computeExerciseAchievementProgress(), getEarnedDistanceAchievements(), getWeightComparativesAtOrBelow(), backfillPerExerciseAchievements(), getLiveExerciseDistance(), reconcileExerciseAchievements(), revokeUnsupported(), unlockDistanceAchievements() (+4 more)

### Community 19 - "db/achievements.ts"
Cohesion: 0.20
Nodes (13): ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS, DistanceAchievementDefinition, DistanceAchievementKind, AchievementRow (+5 more)

### Community 20 - "schema.ts"
Cohesion: 0.11
Nodes (18): DATABASE_VERSION, MIGRATIONS, SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14 (+10 more)

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

### Community 28 - "weight-comparatives.ts"
Cohesion: 0.22
Nodes (8): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, ACHIEVEMENTS, DISTANCE_ACHIEVEMENTS, ALL_KEYS, getWeightComparativeByKey(), VolumeComparison, WEIGHT_COMPARATIVES, WeightComparativeDefinition

### Community 32 - "routines.ts"
Cohesion: 0.18
Nodes (15): getDefaultSetTarget(), addExerciseToRoutine(), clampInt(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS, isTimedTarget(), positiveIntOrNull() (+7 more)

### Community 33 - "app/_layout.tsx"
Cohesion: 0.19
Nodes (10): expo-constants, expo-intent-launcher, expo-notifications, ref_expo_sqlite_kv_store, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt() (+2 more)

### Community 34 - "index.ts"
Cohesion: 0.21
Nodes (10): expo-localization, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 35 - "useAppTheme"
Cohesion: 0.14
Nodes (20): react-i18next, ref_react_native_gesture_handler_reanimatedswipeable, FilterChip(), FilterSection(), RoutineDetailScreen(), styles, TabsLayout(), GoalToggleButton() (+12 more)

### Community 36 - "workout/[id].tsx"
Cohesion: 0.08
Nodes (40): @expo/vector-icons, react-native, react-native-reanimated, react-native-sortables, styles, DialogApi, DialogButton, DialogButtonStyle (+32 more)

### Community 37 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 38 - "database.ts"
Cohesion: 0.48
Nodes (6): seedAchievements(), DATABASE_NAME, initializeDatabase(), migrateDbIfNeeded(), seedExerciseCatalog(), deleteOrphanedSets()

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 40 - "WorkoutShareCard.tsx"
Cohesion: 0.06
Nodes (60): ref_dayjs_locale_es, expo-clipboard, expo-haptics, expo-media-library, expo-sharing, i18next, react-native-view-shot, @testing-library/react-native (+52 more)

### Community 42 - "statistics.tsx"
Cohesion: 0.06
Nodes (50): @shopify/react-native-skia, victory-native, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS (+42 more)

### Community 43 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 44 - "RoutineForm.tsx"
Cohesion: 0.15
Nodes (14): NewRoutineScreen(), CarouselArrow(), RoutineForm(), RoutineFormProps, styles, RoutineHeaderTitle(), RoutineHeaderTitleProps, styles (+6 more)

### Community 49 - "expo-sqlite"
Cohesion: 0.18
Nodes (20): expo-router, expo-sqlite, EditExerciseScreen(), styles, EditRoutineScreen(), RoutinesScreen(), styles, useDialog() (+12 more)

## Knowledge Gaps
- **678 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+673 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 711 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `workout/[id].tsx` to `exercise-frames.ts`, `[exerciseId].tsx`, `utils/body-weight.ts`, `settings.tsx`, `package.json`, `add-exercise.tsx`, `WorkoutTools.tsx`, `AchievementBadge.tsx`, `index.tsx`, `ExerciseForm.tsx`, `backup-file.ts`, `ToastProvider.tsx`, `app/_layout.tsx`, `useAppTheme`, `android-navigation-bar.tsx`, `WorkoutShareCard.tsx`, `statistics.tsx`, `RoutineForm.tsx`, `expo-sqlite`?**
  _High betweenness centrality (0.350) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `app/_layout.tsx`, `[exerciseId].tsx`, `utils/body-weight.ts`, `workout/[id].tsx`, `android-navigation-bar.tsx`, `settings.tsx`, `add-exercise.tsx`, `WorkoutShareCard.tsx`, `statistics.tsx`, `WorkoutTools.tsx`, `RoutineForm.tsx`, `index.tsx`, `workouts.ts`, `ExerciseForm.tsx`, `expo-sqlite`, `ToastProvider.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _678 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `[exerciseId].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06494269761974727 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._