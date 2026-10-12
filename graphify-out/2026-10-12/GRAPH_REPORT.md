# Graph Report - anvil  (2026-10-12)

## Corpus Check
- 87 files · ~64,993 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1047 nodes · 2184 edges · 35 communities (32 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b75e324c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- workout/[id].tsx
- backup-file.ts
- useAppTheme
- dependencies
- index.tsx
- settings.tsx
- package.json
- statistics.tsx
- Anvil
- db/achievements.ts
- devDependencies
- WorkoutTools.tsx
- gamification.ts
- types.ts
- AppDialog.tsx
- routines.ts
- index.ts
- exercise/[id]/edit.tsx
- add-exercise.tsx
- react
- tsconfig.json
- generate-icons.mjs
- app/_layout.tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- jest
- app.config.js
- README npm scripts
- android-navigation-bar.tsx
- routine/[id].tsx
- app-theme-provider.tsx
- workout-goals.ts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 77 edges
2. `react-native` - 40 edges
3. `react-i18next` - 33 edges
4. `expo-sqlite` - 27 edges
5. `react` - 27 edges
6. `WorkoutExerciseScreen()` - 24 edges
7. `useFocusQuery()` - 23 edges
8. `WorkoutSessionScreen()` - 21 edges
9. `useDialog()` - 21 edges
10. `@expo/vector-icons` - 18 edges

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

## Communities (35 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "workout/[id].tsx"
Cohesion: 0.15
Nodes (32): styles, WorkoutSessionScreen(), formatElapsed(), styles, useElapsedSeconds(), WorkoutElapsedBar(), WorkoutElapsedBarProps, getExercisesAchievements() (+24 more)

### Community 2 - "backup-file.ts"
Cohesion: 0.06
Nodes (56): expo-document-picker, expo-file-system, expo-sharing, seedAchievements(), BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE (+48 more)

### Community 3 - "useAppTheme"
Cohesion: 0.06
Nodes (71): @expo/vector-icons, react-i18next, react-native-safe-area-context, RoutineSetEditorScreen(), SetDraft, styles, SwitchRow(), firstIncompleteSet() (+63 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+45 more)

### Community 5 - "index.tsx"
Cohesion: 0.15
Nodes (23): AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, styles, WeekDayItem (+15 more)

### Community 6 - "settings.tsx"
Cohesion: 0.17
Nodes (18): expo-application, SettingsScreen(), styles, SwitchRowProps, resetAppLanguage(), setAppLanguage(), clampStep(), formatWeightStep() (+10 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (38): main, name, private, version, eslint, eslint-config-expo, expo, expo-clipboard (+30 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.11
Nodes (25): dayjs, ref_dayjs_locale_es, victory-native, getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey (+17 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "db/achievements.ts"
Cohesion: 0.12
Nodes (26): AchievementMetric, AchievementProgress, ACHIEVEMENTS, AchievementScope, AchievementTier, computeAchievementProgress(), computeExerciseAchievementProgress(), EXERCISE_METRIC_READERS (+18 more)

### Community 11 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+14 more)

### Community 12 - "WorkoutTools.tsx"
Cohesion: 0.09
Nodes (47): assets_audio_rest_finished, expo-audio, react-native, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, AdjustButtonProps (+39 more)

### Community 13 - "gamification.ts"
Cohesion: 0.13
Nodes (19): WorkoutRecapModalProps, WeightComparativeDefinition, buildHistoryBests(), buildSessionAggregates(), detectAndRecordPRs(), DetectedPR, epley1RM(), ExerciseAchievementUnlock (+11 more)

### Community 14 - "types.ts"
Cohesion: 0.14
Nodes (9): Achievement, ActiveWorkoutExercise, PersonalRecord, RoutineExercise, RoutineExerciseSet, RoutineExerciseWithExercise, WorkoutLog, WorkoutSet (+1 more)

### Community 15 - "AppDialog.tsx"
Cohesion: 0.22
Nodes (10): AppDialogProvider(), buttonColor(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions, DialogTone (+2 more)

### Community 16 - "routines.ts"
Cohesion: 0.12
Nodes (23): expo-sqlite, react-native-reanimated, react-native-sortables, EditRoutineScreen(), styles, RoutinesScreen(), styles, DEFAULT_REST_SECONDS (+15 more)

### Community 17 - "index.ts"
Cohesion: 0.20
Nodes (10): expo-localization, i18next, AppLanguage, detectInitialLanguage(), isAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 18 - "exercise/[id]/edit.tsx"
Cohesion: 0.14
Nodes (18): @bryllim/workout-guide, EditExerciseScreen(), styles, NewExerciseScreen(), Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps (+10 more)

### Community 19 - "add-exercise.tsx"
Cohesion: 0.15
Nodes (20): expo-image, AddExerciseScreen(), FilterChip(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel(), styles (+12 more)

### Community 20 - "react"
Cohesion: 0.23
Nodes (9): react, NewRoutineScreen(), RoutineForm(), RoutineFormProps, styles, Screen(), ScreenProps, styles (+1 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (20): ref_node_child_process, ref_node_fs, ref_node_path, ref_node_url, entries, lines, manifest, outPath (+12 more)

### Community 23 - "app/_layout.tsx"
Cohesion: 0.20
Nodes (11): expo-constants, expo-intent-launcher, expo-notifications, ref_expo_sqlite_kv_store, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt() (+3 more)

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

### Community 31 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 32 - "routine/[id].tsx"
Cohesion: 0.24
Nodes (10): ref_react_native_gesture_handler_reanimatedswipeable, RoutineDetailScreen(), styles, styles, SwipeToDelete(), SwipeToDeleteProps, getRoutineExercises(), removeExerciseFromRoutine() (+2 more)

### Community 33 - "app-theme-provider.tsx"
Cohesion: 0.24
Nodes (9): expo-router, TabsLayout(), AppColorScheme, AppTheme, AppThemeContext, darkColors, lightColors, palette (+1 more)

### Community 34 - "workout-goals.ts"
Cohesion: 0.20
Nodes (9): zustand, ref_zustand_middleware, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState, THEME_STORAGE_KEY, ThemePreference (+1 more)

## Knowledge Gaps
- **599 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+594 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 624 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `WorkoutTools.tsx` to `routine/[id].tsx`, `workout/[id].tsx`, `exercise-frames.ts`, `useAppTheme`, `backup-file.ts`, `index.tsx`, `settings.tsx`, `package.json`, `statistics.tsx`, `app-theme-provider.tsx`, `AppDialog.tsx`, `routines.ts`, `exercise/[id]/edit.tsx`, `add-exercise.tsx`, `react`, `app/_layout.tsx`, `android-navigation-bar.tsx`?**
  _High betweenness centrality (0.400) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `routines.ts` to `routine/[id].tsx`, `workout/[id].tsx`, `backup-file.ts`, `useAppTheme`, `settings.tsx`, `package.json`, `statistics.tsx`, `db/achievements.ts`, `gamification.ts`, `types.ts`, `exercise/[id]/edit.tsx`, `add-exercise.tsx`, `react`, `app/_layout.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _599 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `workout/[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1495798319327731 - nodes in this community are weakly interconnected._
- **Should `backup-file.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.058699101004759384 - nodes in this community are weakly interconnected._