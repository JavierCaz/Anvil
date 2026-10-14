# Graph Report - anvil  (2026-10-13)

## Corpus Check
- 107 files · ~130,051 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1212 nodes · 2854 edges · 41 communities (38 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9d121e0e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- ExerciseSetEditor.tsx
- backup.ts
- routines.ts
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- backup-file.ts
- Anvil
- WorkoutTools.tsx
- scripts
- constants/achievements.ts
- index.tsx
- devDependencies
- AchievementBadge.tsx
- index.ts
- react-native
- workout/[id].tsx
- [exerciseId].tsx
- schema.ts
- tsconfig.json
- generate-icons.mjs
- app-theme-provider.tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- jest
- app.config.js
- README npm scripts
- workout-tools.ts
- useAppTheme
- statistics.tsx
- android-navigation-bar.tsx
- ToastProvider.tsx
- workout-goals.ts
- WeekStrip.tsx
- AnvilLogo.tsx
- database.ts
- expo-sqlite

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 89 edges
2. `react-native` - 50 edges
3. `react` - 35 edges
4. `react-i18next` - 34 edges
5. `WorkoutExerciseScreen()` - 31 edges
6. `expo-sqlite` - 28 edges
7. `@expo/vector-icons` - 27 edges
8. `withAlpha()` - 25 edges
9. `useFocusQuery()` - 23 edges
10. `WorkoutSessionScreen()` - 22 edges

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

## Communities (41 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "ExerciseSetEditor.tsx"
Cohesion: 0.06
Nodes (84): RoutineSetEditorScreen(), firstIncompleteSet(), shiftMapDown(), WorkoutExerciseScreen(), AchievementBadge(), AchievementCard(), AchievementCardProps, styles (+76 more)

### Community 2 - "backup.ts"
Cohesion: 0.14
Nodes (21): BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_VERSION, BackupError, BackupErrorCode, BackupRow, BackupRowValue, BackupTableData (+13 more)

### Community 3 - "routines.ts"
Cohesion: 0.08
Nodes (36): @bryllim/workout-guide, EditExerciseScreen(), styles, NewExerciseScreen(), AddExerciseScreen(), RoutineDetailScreen(), NewRoutineScreen(), ExerciseForm() (+28 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.12
Nodes (28): AchievementTier, computeExerciseAchievementProgress(), EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS (+20 more)

### Community 6 - "settings.tsx"
Cohesion: 0.17
Nodes (18): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, resetAppLanguage(), setAppLanguage(), clampStep(), formatWeightStep() (+10 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (43): main, name, private, version, eslint, eslint-config-expo, expo, expo-application (+35 more)

### Community 8 - "backup-file.ts"
Cohesion: 0.20
Nodes (15): BACKUP_APP, BACKUP_TYPE, BackupFile, BackupPreferences, buildBackupData(), assertNotWeb(), clearPreferences(), eraseAllData() (+7 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.12
Nodes (35): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, AdjustButton(), AdjustButtonProps (+27 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "constants/achievements.ts"
Cohesion: 0.16
Nodes (16): ACHIEVEMENT_CATEGORY_ORDER, AchievementMetric, AchievementProgress, ACHIEVEMENTS, AchievementScope, computeAchievementProgress(), EXERCISE_METRIC_READERS, getAchievementByKey() (+8 more)

### Community 13 - "index.tsx"
Cohesion: 0.18
Nodes (22): react-native-svg, AchievementsScreen(), styles, getMonday(), HomeScreen(), styles, HeroGlow(), HeroGlowProps (+14 more)

### Community 14 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 15 - "AchievementBadge.tsx"
Cohesion: 0.14
Nodes (12): AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles, BadgeGlyph (+4 more)

### Community 16 - "index.ts"
Cohesion: 0.14
Nodes (12): expo-localization, ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, i18next, DEFAULT_ROUTINE_GLYPH, AppLanguage, detectInitialLanguage(), isAppLanguage(), SUPPORTED_LANGUAGES (+4 more)

### Community 17 - "react-native"
Cohesion: 0.10
Nodes (34): expo-notifications, react, react-i18next, react-native, ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, EditRoutineScreen() (+26 more)

### Community 18 - "workout/[id].tsx"
Cohesion: 0.06
Nodes (71): styles, WorkoutSessionScreen(), formatElapsed(), useElapsedSeconds(), WorkoutRecapModalProps, getExerciseMetrics(), WeightComparativeDefinition, getExercisesAchievements() (+63 more)

### Community 19 - "[exerciseId].tsx"
Cohesion: 0.12
Nodes (33): expo-haptics, @expo/vector-icons, styles, SetDraft, styles, styles, SetDraft, styles (+25 more)

### Community 20 - "schema.ts"
Cohesion: 0.13
Nodes (14): SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14, SCHEMA_V2, SCHEMA_V3 (+6 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "app-theme-provider.tsx"
Cohesion: 0.08
Nodes (34): expo-router, expo-status-bar, react-native-gesture-handler, @shopify/react-native-skia, StatTile(), AppDialogProvider(), buttonAppearance(), DialogApi (+26 more)

### Community 24 - "Strict TypeScript"
Cohesion: 0.33
Nodes (6): Path aliases @/* and @/assets/*, Testing (jest-expo + testing-library), Strict TypeScript, Verification gates (tsc, lint, test), README path aliases, Strict TypeScript in README

### Community 25 - "Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms"
Cohesion: 0.90
Nodes (5): Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms, Android Adaptive Icon Monochrome Layer — flat gray chevron 'A' silhouette with transparent background for Android themed icons, Anvil Web Favicon — solid blue chevron 'A' mark on a light-blue rounded square, small square format for browser tabs, Anvil App Icon — glossy white chevron 'A' mark centered on a blue gradient background with a faint blueprint grid and crosshairs, Anvil Splash Icon — faint white/translucent chevron 'A' mark on a transparent background, used for the native splash screen

### Community 26 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, ref_eslint_config, ref_eslint_config_expo_flat

### Community 28 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 31 - "workout-tools.ts"
Cohesion: 0.13
Nodes (14): clampDuration(), initialStopwatch, initialTimer, RestState, SetTimerState, StopwatchState, TIMER_ADJUST_SECONDS, TIMER_DEFAULT_SECONDS (+6 more)

### Community 32 - "useAppTheme"
Cohesion: 0.14
Nodes (14): RootNavigator(), FilterChip(), FilterSection(), TabsLayout(), Chip(), EXERCISE_TYPES, ExerciseFormProps, styles (+6 more)

### Community 33 - "statistics.tsx"
Cohesion: 0.09
Nodes (35): dayjs, ref_dayjs_locale_es, victory-native, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf() (+27 more)

### Community 34 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 35 - "ToastProvider.tsx"
Cohesion: 0.17
Nodes (11): react-native-safe-area-context, DetailModal(), DetailModalProps, styles, AnimatedPressable, styles, ToastApi, ToastContext (+3 more)

### Community 36 - "workout-goals.ts"
Cohesion: 0.20
Nodes (10): ref_expo_sqlite_kv_store, zustand, ref_zustand_middleware, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState, THEME_STORAGE_KEY (+2 more)

### Community 37 - "WeekStrip.tsx"
Cohesion: 0.25
Nodes (7): HomeData, styles, WeekDayItem, WeekStrip(), WeekStripProps, AchievementCategory, AchievementProgressItem

### Community 38 - "AnvilLogo.tsx"
Cohesion: 0.25
Nodes (7): AnvilLogo(), AnvilLogoProps, AnvilMark(), AnvilMarkProps, MARK_COLORS, styles, VIEWBOX

### Community 39 - "database.ts"
Cohesion: 0.48
Nodes (6): seedAchievements(), initializeDatabase(), migrateDbIfNeeded(), seedExerciseCatalog(), MIGRATIONS, deleteOrphanedSets()

### Community 40 - "expo-sqlite"
Cohesion: 0.50
Nodes (3): expo-sqlite, UseFocusQueryOptions, UseFocusQueryResult

## Knowledge Gaps
- **649 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+644 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 677 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `useAppTheme`, `statistics.tsx`, `ExerciseSetEditor.tsx`, `routines.ts`, `android-navigation-bar.tsx`, `ToastProvider.tsx`, `settings.tsx`, `package.json`, `AnvilLogo.tsx`, `WeekStrip.tsx`, `WorkoutTools.tsx`, `exercise-frames.ts`, `backup-file.ts`, `index.tsx`, `AchievementBadge.tsx`, `workout/[id].tsx`, `[exerciseId].tsx`, `app-theme-provider.tsx`?**
  _High betweenness centrality (0.371) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `expo-sqlite` to `statistics.tsx`, `backup.ts`, `routines.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `backup-file.ts`, `database.ts`, `react-native`, `workout/[id].tsx`, `[exerciseId].tsx`, `app-theme-provider.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _649 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `ExerciseSetEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05789473684210526 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14130434782608695 - nodes in this community are weakly interconnected._