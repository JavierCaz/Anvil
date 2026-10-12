# Graph Report - anvil  (2026-10-12)

## Corpus Check
- 85 files · ~88,927 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1029 nodes · 2147 edges · 35 communities (33 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1aad08c9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- workout/[id].tsx
- backup-file.ts
- [exerciseId].tsx
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- statistics.tsx
- Anvil
- routines.ts
- devDependencies
- useAppTheme
- gamification.ts
- index.tsx
- AppDialog.tsx
- routines.tsx
- routine/[id].tsx
- exercise/[id]/edit.tsx
- add-exercise.tsx
- expo-sqlite
- tsconfig.json
- generate-exercise-frames.mjs
- app/_layout.tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- expo-symbol 2.svg — white vector glyph (Expo default symbol, tent/chevron mark) used as the iOS app icon layer
- jest
- app.config.js
- README npm scripts
- react
- ExerciseForm.tsx
- app-theme-provider.tsx
- scripts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 75 edges
2. `react-native` - 39 edges
3. `react-i18next` - 32 edges
4. `expo-sqlite` - 27 edges
5. `react` - 26 edges
6. `WorkoutExerciseScreen()` - 23 edges
7. `useFocusQuery()` - 23 edges
8. `useDialog()` - 21 edges
9. `WorkoutSessionScreen()` - 20 edges
10. `expo-router` - 18 edges

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
- **Anvil app icon asset set — iOS icon layer stack (expo-symbol 2 + grid) and Android adaptive icon layers (foreground + background)** — assets_expo_icon_assets_expo_symbol_2, assets_expo_icon_assets_grid, assets_images_android_icon_background, assets_images_android_icon_foreground [INFERRED 0.75]
- **Quality gates enforced before completion** — agents_testing, agents_verification, agents_typescript [INFERRED 0.85]
- **Anvil cross-platform app icon set sharing the blue/white chevron 'A' brand mark** — assets_images_icon_anvil_mark, assets_images_splash_icon_anvil_mark, assets_images_android_icon_monochrome_anvil_mark, assets_images_favicon_anvil_mark [INFERRED 0.85]

## Communities (35 total, 2 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "workout/[id].tsx"
Cohesion: 0.13
Nodes (28): dayjs, formatStopwatch(), styles, WorkoutSessionScreen(), getExercisesAchievements(), getRoutineExerciseSets(), saveRoutineExerciseSets(), ActiveWorkoutExercise (+20 more)

### Community 2 - "backup-file.ts"
Cohesion: 0.06
Nodes (56): expo-document-picker, expo-file-system, expo-sharing, backfillPerExerciseAchievements(), seedAchievements(), BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES (+48 more)

### Community 3 - "[exerciseId].tsx"
Cohesion: 0.07
Nodes (62): @expo/vector-icons, react-i18next, ref_react_native_gesture_handler_reanimatedswipeable, zustand, RoutineSetEditorScreen(), SetDraft, styles, firstIncompleteSet() (+54 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+45 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.11
Nodes (24): ACHIEVEMENT_CATEGORY_ORDER, ACHIEVEMENT_TIER_COLORS, AchievementMetric, AchievementProgress, ACHIEVEMENTS, AchievementScope, AchievementTier, computeAchievementProgress() (+16 more)

### Community 6 - "settings.tsx"
Cohesion: 0.08
Nodes (37): expo-localization, ref_expo_sqlite_kv_store, i18next, ref_zustand_middleware, SettingsScreen(), styles, SwitchRow(), SwitchRowProps (+29 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (39): main, name, private, version, eslint, eslint-config-expo, expo, expo-application (+31 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.12
Nodes (24): ref_dayjs_locale_es, victory-native, getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey, StatCardProps (+16 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "routines.ts"
Cohesion: 0.16
Nodes (14): DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS, RoutineInput, SetTargetInput, TargetVolume, Achievement, PersonalRecord (+6 more)

### Community 11 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 12 - "useAppTheme"
Cohesion: 0.06
Nodes (65): assets_audio_rest_finished, expo-audio, react-native, react-native-safe-area-context, DetailModal(), DetailModalProps, styles, formatCountdown() (+57 more)

### Community 13 - "gamification.ts"
Cohesion: 0.13
Nodes (25): WorkoutRecapModalProps, WeightComparativeDefinition, unlockAchievementIfNew(), unlockExerciseAchievement(), buildHistoryBests(), buildSessionAggregates(), detectAndRecordPRs(), detectAndUnlockSpecials() (+17 more)

### Community 14 - "index.tsx"
Cohesion: 0.23
Nodes (17): AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, WeekDayItem, AchievementCategory (+9 more)

### Community 15 - "AppDialog.tsx"
Cohesion: 0.22
Nodes (10): AppDialogProvider(), buttonColor(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions, DialogTone (+2 more)

### Community 16 - "routines.tsx"
Cohesion: 0.16
Nodes (17): expo-router, EditRoutineScreen(), styles, TabsLayout(), RoutinesScreen(), styles, useDialog(), RoutineForm() (+9 more)

### Community 17 - "routine/[id].tsx"
Cohesion: 0.31
Nodes (9): react-native-reanimated, react-native-sortables, RoutineDetailScreen(), styles, getRoutine(), getRoutineExercises(), removeExerciseFromRoutine(), reorderRoutineExercises() (+1 more)

### Community 18 - "exercise/[id]/edit.tsx"
Cohesion: 0.29
Nodes (9): @bryllim/workout-guide, EditExerciseScreen(), styles, deleteExercise(), ExerciseFilters, getExerciseById(), NewExerciseInput, updateExercise() (+1 more)

### Community 19 - "add-exercise.tsx"
Cohesion: 0.17
Nodes (17): expo-image, AddExerciseScreen(), FilterChip(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel(), styles (+9 more)

### Community 20 - "expo-sqlite"
Cohesion: 0.20
Nodes (10): expo-sqlite, NewExerciseScreen(), NewRoutineScreen(), Screen(), ScreenProps, styles, createExercise(), addExerciseToRoutine() (+2 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-exercise-frames.mjs"
Cohesion: 0.22
Nodes (8): ref_node_fs, ref_node_path, ref_node_url, entries, lines, manifest, outPath, root

### Community 23 - "app/_layout.tsx"
Cohesion: 0.19
Nodes (9): expo-constants, expo-intent-launcher, expo-notifications, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), NotificationPermissionPrompt() (+1 more)

### Community 24 - "Strict TypeScript"
Cohesion: 0.33
Nodes (6): Path aliases @/* and @/assets/*, Testing (jest-expo + testing-library), Strict TypeScript, Verification gates (tsc, lint, test), README path aliases, Strict TypeScript in README

### Community 25 - "Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms"
Cohesion: 0.90
Nodes (5): Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms, Android Adaptive Icon Monochrome Layer — flat gray chevron 'A' silhouette with transparent background for Android themed icons, Anvil Web Favicon — solid blue chevron 'A' mark on a light-blue rounded square, small square format for browser tabs, Anvil App Icon — glossy white chevron 'A' mark centered on a blue gradient background with a faint blueprint grid and crosshairs, Anvil Splash Icon — faint white/translucent chevron 'A' mark on a transparent background, used for the native splash screen

### Community 26 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, ref_eslint_config, ref_eslint_config_expo_flat

### Community 27 - "expo-symbol 2.svg — white vector glyph (Expo default symbol, tent/chevron mark) used as the iOS app icon layer"
Cohesion: 0.67
Nodes (4): expo-symbol 2.svg — white vector glyph (Expo default symbol, tent/chevron mark) used as the iOS app icon layer, grid.png — 1024×1024 RGBA grid/pattern texture layer composited under the iOS app icon symbol (visual content not verifiable by vision; role inferred from assets/expo.icon/icon.json), android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset), android-icon-foreground.png — 512×512 Android adaptive icon foreground layer (default Expo blue template asset)

### Community 28 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 31 - "react"
Cohesion: 0.22
Nodes (7): expo-navigation-bar, expo-system-ui, react, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 32 - "ExerciseForm.tsx"
Cohesion: 0.24
Nodes (8): Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps, styles, EXERCISE_FRAMES, EXERCISE_TYPE_I18N_KEYS, MUSCLE_I18N_KEYS

### Community 33 - "app-theme-provider.tsx"
Cohesion: 0.29
Nodes (8): AppColorScheme, AppTheme, AppThemeContext, AppThemeProvider(), darkColors, lightColors, palette, ThemeColors

### Community 35 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, android, build:all, build:android, build:ios, ios, lint, start (+3 more)

## Ambiguous Edges - Review These
- `grid.png — 1024×1024 RGBA grid/pattern texture layer composited under the iOS app icon symbol (visual content not verifiable by vision; role inferred from assets/expo.icon/icon.json)` → `android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)`  [AMBIGUOUS]
  assets/expo.icon/Assets/grid.png · relation: semantically_similar_to

## Knowledge Gaps
- **587 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+582 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 612 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `grid.png — 1024×1024 RGBA grid/pattern texture layer composited under the iOS app icon symbol (visual content not verifiable by vision; role inferred from assets/expo.icon/icon.json)` and `android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `react-native` connect `useAppTheme` to `ExerciseForm.tsx`, `workout/[id].tsx`, `exercise-frames.ts`, `[exerciseId].tsx`, `backup-file.ts`, `app-theme-provider.tsx`, `settings.tsx`, `package.json`, `statistics.tsx`, `index.tsx`, `AppDialog.tsx`, `routines.tsx`, `routine/[id].tsx`, `exercise/[id]/edit.tsx`, `add-exercise.tsx`, `expo-sqlite`, `app/_layout.tsx`, `react`?**
  _High betweenness centrality (0.384) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `expo-sqlite` to `workout/[id].tsx`, `backup-file.ts`, `[exerciseId].tsx`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `routines.ts`, `gamification.ts`, `routines.tsx`, `routine/[id].tsx`, `exercise/[id]/edit.tsx`, `add-exercise.tsx`, `app/_layout.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _587 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `workout/[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1349206349206349 - nodes in this community are weakly interconnected._