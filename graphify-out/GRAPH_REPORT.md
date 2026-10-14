# Graph Report - anvil  (2026-10-13)

## Corpus Check
- 93 files · ~169,483 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1135 nodes · 2526 edges · 37 communities (34 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `99b5fb00`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- workout/[id].tsx
- backup.ts
- [exerciseId].tsx
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- statistics.tsx
- Anvil
- WorkoutTools.tsx
- scripts
- gamification.ts
- index.tsx
- devDependencies
- constants/achievements.ts
- useAppTheme
- routine/[id].tsx
- routines.ts
- add-exercise.tsx
- schema.ts
- tsconfig.json
- generate-icons.mjs
- react-native
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- jest
- app.config.js
- README npm scripts
- backup-file.ts
- app-theme-provider.tsx
- ToastProvider.tsx
- index.ts
- weight-comparatives.ts
- database.ts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 80 edges
2. `react-native` - 40 edges
3. `react-i18next` - 33 edges
4. `WorkoutExerciseScreen()` - 31 edges
5. `expo-sqlite` - 28 edges
6. `react` - 27 edges
7. `useFocusQuery()` - 23 edges
8. `WorkoutSessionScreen()` - 21 edges
9. `useDialog()` - 21 edges
10. `getAchievementByKey()` - 20 edges

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

## Communities (37 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "workout/[id].tsx"
Cohesion: 0.09
Nodes (40): dayjs, styles, WorkoutSessionScreen(), formatElapsed(), styles, useElapsedSeconds(), WorkoutElapsedBar(), WorkoutElapsedBarProps (+32 more)

### Community 2 - "backup.ts"
Cohesion: 0.13
Nodes (23): BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE, BACKUP_VERSION, BackupError, BackupErrorCode, BackupRow (+15 more)

### Community 3 - "[exerciseId].tsx"
Cohesion: 0.06
Nodes (90): RoutineSetEditorScreen(), SetDraft, styles, firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen() (+82 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+45 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.11
Nodes (30): AchievementTier, EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats, DISTANCE_ACHIEVEMENTS, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS (+22 more)

### Community 6 - "settings.tsx"
Cohesion: 0.11
Nodes (28): ref_expo_sqlite_kv_store, zustand, ref_zustand_middleware, SettingsScreen(), styles, SwitchRow(), SwitchRowProps, resetAppLanguage() (+20 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (40): main, name, private, version, eslint, eslint-config-expo, expo, expo-application (+32 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.11
Nodes (27): ref_dayjs_locale_es, victory-native, getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey, StatCardProps (+19 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (50): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, AdjustButton(), AdjustButtonProps (+42 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "gamification.ts"
Cohesion: 0.12
Nodes (28): getDistanceAchievementByKey(), unlockAchievementIfNew(), buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests, CardioSetRow, computeCardioPRs() (+20 more)

### Community 13 - "index.tsx"
Cohesion: 0.19
Nodes (19): AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, styles, WeekDayItem (+11 more)

### Community 14 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 15 - "constants/achievements.ts"
Cohesion: 0.20
Nodes (13): ACHIEVEMENT_CATEGORY_ORDER, AchievementCategory, AchievementMetric, AchievementProgress, ACHIEVEMENTS, AchievementScope, computeAchievementProgress(), computeExerciseAchievementProgress() (+5 more)

### Community 16 - "useAppTheme"
Cohesion: 0.14
Nodes (20): react-native-safe-area-context, EditExerciseScreen(), styles, NewExerciseScreen(), DetailModal(), DetailModalProps, styles, Chip() (+12 more)

### Community 17 - "routine/[id].tsx"
Cohesion: 0.10
Nodes (27): @expo/vector-icons, react, ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, RoutineDetailScreen(), styles, RoutinesScreen() (+19 more)

### Community 18 - "routines.ts"
Cohesion: 0.11
Nodes (25): expo-sqlite, EditRoutineScreen(), styles, NewRoutineScreen(), RoutineForm(), RoutineFormProps, styles, getDefaultSetTarget() (+17 more)

### Community 19 - "add-exercise.tsx"
Cohesion: 0.14
Nodes (23): @bryllim/workout-guide, AddExerciseScreen(), FilterChip(), FilterSection(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel() (+15 more)

### Community 20 - "schema.ts"
Cohesion: 0.14
Nodes (13): SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V2, SCHEMA_V3, SCHEMA_V4 (+5 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "react-native"
Cohesion: 0.08
Nodes (29): expo-constants, expo-intent-launcher, expo-navigation-bar, expo-notifications, expo-status-bar, expo-system-ui, react-i18next, react-native (+21 more)

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

### Community 31 - "backup-file.ts"
Cohesion: 0.18
Nodes (16): expo-document-picker, expo-file-system, expo-sharing, BackupFile, BackupPreferences, buildBackupData(), assertNotWeb(), clearPreferences() (+8 more)

### Community 32 - "app-theme-provider.tsx"
Cohesion: 0.24
Nodes (9): expo-router, TabsLayout(), AppColorScheme, AppTheme, AppThemeContext, darkColors, lightColors, palette (+1 more)

### Community 33 - "ToastProvider.tsx"
Cohesion: 0.29
Nodes (7): AnimatedPressable, styles, ToastApi, ToastContext, ToastItem, ToastOptions, ToastProvider()

### Community 34 - "index.ts"
Cohesion: 0.20
Nodes (10): expo-localization, i18next, AppLanguage, detectInitialLanguage(), isAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 35 - "weight-comparatives.ts"
Cohesion: 0.22
Nodes (8): WorkoutRecapModalProps, getNextWeightComparative(), getWeightComparativeByKey(), WEIGHT_COMPARATIVES, WeightComparativeDefinition, WorkoutRecap, WeeklyConsistency, WorkoutSummary

### Community 36 - "database.ts"
Cohesion: 0.48
Nodes (6): seedAchievements(), initializeDatabase(), migrateDbIfNeeded(), seedExerciseCatalog(), MIGRATIONS, deleteOrphanedSets()

## Knowledge Gaps
- **618 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+613 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 644 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `workout/[id].tsx`, `ToastProvider.tsx`, `[exerciseId].tsx`, `app-theme-provider.tsx`, `settings.tsx`, `package.json`, `statistics.tsx`, `WorkoutTools.tsx`, `index.tsx`, `useAppTheme`, `routine/[id].tsx`, `routines.ts`, `add-exercise.tsx`, `backup-file.ts`?**
  _High betweenness centrality (0.377) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `routines.ts` to `workout/[id].tsx`, `backup.ts`, `[exerciseId].tsx`, `database.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `gamification.ts`, `useAppTheme`, `routine/[id].tsx`, `add-exercise.tsx`, `react-native`, `backup-file.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _618 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `workout/[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09142857142857143 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12615384615384614 - nodes in this community are weakly interconnected._