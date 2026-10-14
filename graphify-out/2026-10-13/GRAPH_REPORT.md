# Graph Report - anvil  (2026-10-13)

## Corpus Check
- 93 files · ~168,691 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1130 nodes · 2507 edges · 29 communities (26 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5b8a09f7`
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
- WorkoutTools.tsx
- scripts
- devDependencies
- routines.ts
- routine/[id].tsx
- Screen.tsx
- add-exercise.tsx
- tsconfig.json
- generate-icons.mjs
- AppDialog.tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- jest
- app.config.js
- README npm scripts
- useAppTheme
- app-theme-provider.tsx

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 79 edges
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

## Communities (29 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (303): EXERCISE_FRAMES, frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up (+295 more)

### Community 1 - "workout/[id].tsx"
Cohesion: 0.06
Nodes (67): styles, WorkoutSessionScreen(), formatElapsed(), styles, useElapsedSeconds(), WorkoutElapsedBar(), WorkoutElapsedBarProps, WorkoutRecapModalProps (+59 more)

### Community 2 - "backup-file.ts"
Cohesion: 0.06
Nodes (55): seedAchievements(), BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE, BACKUP_VERSION, BackupError, BackupErrorCode (+47 more)

### Community 3 - "[exerciseId].tsx"
Cohesion: 0.06
Nodes (88): RoutineSetEditorScreen(), firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), AchievementCard(), AchievementCardProps (+80 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+45 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.06
Nodes (67): AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, styles, WeekDayItem (+59 more)

### Community 6 - "settings.tsx"
Cohesion: 0.08
Nodes (38): expo-localization, ref_expo_sqlite_kv_store, i18next, zustand, ref_zustand_middleware, SettingsScreen(), styles, SwitchRow() (+30 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (42): main, name, private, version, eslint, eslint-config-expo, expo, expo-application (+34 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.11
Nodes (28): dayjs, ref_dayjs_locale_es, victory-native, getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey (+20 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (51): assets_audio_rest_finished, expo-audio, expo-haptics, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, AdjustButton() (+43 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 14 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 16 - "routines.ts"
Cohesion: 0.13
Nodes (20): NewRoutineScreen(), RoutineForm(), getDefaultSetTarget(), addExerciseToRoutine(), clampInt(), createRoutine(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS (+12 more)

### Community 17 - "routine/[id].tsx"
Cohesion: 0.17
Nodes (19): expo-router, expo-sqlite, react-native-reanimated, react-native-sortables, EditRoutineScreen(), styles, RoutineDetailScreen(), styles (+11 more)

### Community 18 - "Screen.tsx"
Cohesion: 0.18
Nodes (15): @bryllim/workout-guide, EditExerciseScreen(), styles, NewExerciseScreen(), ExerciseForm(), Screen(), ScreenProps, styles (+7 more)

### Community 19 - "add-exercise.tsx"
Cohesion: 0.13
Nodes (22): AddExerciseScreen(), FilterChip(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel(), styles, Chip() (+14 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "AppDialog.tsx"
Cohesion: 0.12
Nodes (20): expo-constants, expo-intent-launcher, expo-notifications, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), AppDialogProvider() (+12 more)

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

### Community 32 - "useAppTheme"
Cohesion: 0.18
Nodes (15): @expo/vector-icons, react-i18next, ref_react_native_gesture_handler_reanimatedswipeable, SetDraft, styles, TabsLayout(), styles, LoadingOverlay() (+7 more)

### Community 33 - "app-theme-provider.tsx"
Cohesion: 0.08
Nodes (28): expo-navigation-bar, expo-system-ui, react, react-native, react-native-safe-area-context, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps (+20 more)

## Knowledge Gaps
- **617 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+612 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 643 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `app-theme-provider.tsx` to `useAppTheme`, `workout/[id].tsx`, `exercise-frames.ts`, `[exerciseId].tsx`, `backup-file.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `WorkoutTools.tsx`, `routines.ts`, `routine/[id].tsx`, `Screen.tsx`, `add-exercise.tsx`, `AppDialog.tsx`?**
  _High betweenness centrality (0.386) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `routine/[id].tsx` to `useAppTheme`, `workout/[id].tsx`, `backup-file.ts`, `[exerciseId].tsx`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `routines.ts`, `Screen.tsx`, `add-exercise.tsx`, `AppDialog.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _617 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006578947368421052 - nodes in this community are weakly interconnected._
- **Should `workout/[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05864197530864197 - nodes in this community are weakly interconnected._
- **Should `backup-file.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.060109289617486336 - nodes in this community are weakly interconnected._