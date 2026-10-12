# Graph Report - anvil  (2026-09-19)

## Corpus Check
- 80 files · ~85,240 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 983 nodes · 2005 edges · 36 communities (34 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0413ace4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- workouts.ts
- backup-file.ts
- react-i18next
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- statistics.tsx
- Anvil
- routines.ts
- devDependencies
- ToastProvider.tsx
- useAppTheme
- routines.tsx
- app-theme-provider.tsx
- exercise/[id]/edit.tsx
- app/_layout.tsx
- expo-sqlite
- add-exercise.tsx
- RestTimer.tsx
- tsconfig.json
- generate-exercise-frames.mjs
- android-navigation-bar.tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- expo-symbol 2.svg — white vector glyph (Expo default symbol, tent/chevron mark) used as the iOS app icon layer
- jest
- app.config.js
- README npm scripts
- [exerciseId].tsx
- react
- react-native
- ExerciseDetailModal.tsx
- scripts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 68 edges
2. `react-native` - 37 edges
3. `react-i18next` - 31 edges
4. `expo-sqlite` - 29 edges
5. `react` - 26 edges
6. `WorkoutExerciseScreen()` - 22 edges
7. `useDialog()` - 21 edges
8. `WorkoutSessionScreen()` - 19 edges
9. `expo-router` - 18 edges
10. `getAchievementByKey()` - 18 edges

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

## Communities (36 total, 2 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "workouts.ts"
Cohesion: 0.08
Nodes (49): dayjs, formatStopwatch(), styles, WorkoutSessionScreen(), WorkoutRecapModalProps, WeightComparativeDefinition, unlockExerciseAchievement(), buildHistoryBests() (+41 more)

### Community 2 - "backup-file.ts"
Cohesion: 0.06
Nodes (56): expo-document-picker, expo-file-system, expo-sharing, seedAchievements(), BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE (+48 more)

### Community 3 - "react-i18next"
Cohesion: 0.17
Nodes (24): react-i18next, AchievementCard(), AchievementCardProps, styles, AchievementDetailModal(), AchievementDetailModalProps, formatNumber(), metricUnit() (+16 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+45 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.08
Nodes (49): AchievementsScreen(), load(), styles, getMonday(), HomeData, HomeScreen(), load(), styles (+41 more)

### Community 6 - "settings.tsx"
Cohesion: 0.08
Nodes (37): expo-localization, ref_expo_sqlite_kv_store, i18next, zustand, ref_zustand_middleware, SettingsScreen(), styles, SwitchRowProps (+29 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (39): main, name, private, version, eslint, eslint-config-expo, expo, expo-application (+31 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.13
Nodes (25): ref_dayjs_locale_es, victory-native, getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey, StatCardProps (+17 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "routines.ts"
Cohesion: 0.17
Nodes (15): RoutineDetailScreen(), styles, DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS, getRoutineExercises(), removeExerciseFromRoutine(), reorderRoutineExercises() (+7 more)

### Community 11 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 12 - "ToastProvider.tsx"
Cohesion: 0.29
Nodes (7): AnimatedPressable, styles, ToastApi, ToastContext, ToastItem, ToastOptions, ToastProvider()

### Community 13 - "useAppTheme"
Cohesion: 0.14
Nodes (18): expo-image, @expo/vector-icons, SwitchRow(), TabsLayout(), ExerciseSetEditorProps, formatReps(), parseNumber(), REST_MAX_SECONDS (+10 more)

### Community 14 - "routines.tsx"
Cohesion: 0.21
Nodes (10): ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, RoutinesScreen(), styles, styles, SwipeToDelete(), SwipeToDeleteProps (+2 more)

### Community 15 - "app-theme-provider.tsx"
Cohesion: 0.14
Nodes (17): AppDialogProvider(), buttonColor(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions, DialogTone (+9 more)

### Community 16 - "exercise/[id]/edit.tsx"
Cohesion: 0.29
Nodes (9): @bryllim/workout-guide, EditExerciseScreen(), styles, deleteExercise(), ExerciseFilters, getExerciseById(), NewExerciseInput, updateExercise() (+1 more)

### Community 17 - "app/_layout.tsx"
Cohesion: 0.20
Nodes (8): expo-constants, expo-intent-launcher, expo-notifications, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), AppThemeProvider()

### Community 18 - "expo-sqlite"
Cohesion: 0.18
Nodes (12): expo-router, expo-sqlite, NewExerciseScreen(), NewRoutineScreen(), ExerciseForm(), Screen(), ScreenProps, styles (+4 more)

### Community 19 - "add-exercise.tsx"
Cohesion: 0.17
Nodes (13): AddExerciseScreen(), FilterChip(), styles, Chip(), EXERCISE_TYPES, ExerciseFormProps, styles, EXERCISE_FRAMES (+5 more)

### Community 20 - "RestTimer.tsx"
Cohesion: 0.28
Nodes (8): assets_audio_rest_finished, expo-audio, fireAlarmVibration(), formatCountdown(), REST_FINISHED_SOUND, RestTimer(), RestTimerProps, styles

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-exercise-frames.mjs"
Cohesion: 0.22
Nodes (8): ref_node_fs, ref_node_path, ref_node_url, entries, lines, manifest, outPath, root

### Community 23 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

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

### Community 31 - "[exerciseId].tsx"
Cohesion: 0.14
Nodes (22): ActiveRest, firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), useToast(), getWeightComparativesAtOrBelow() (+14 more)

### Community 32 - "react"
Cohesion: 0.23
Nodes (11): react, EditRoutineScreen(), styles, useDialog(), NotificationPermissionPrompt(), RoutineForm(), RoutineFormProps, styles (+3 more)

### Community 33 - "react-native"
Cohesion: 0.21
Nodes (10): react-native, RoutineSetEditorScreen(), SetDraft, styles, ExerciseSetEditor(), SetEditorItem, LoadingOverlay(), LoadingOverlayProps (+2 more)

### Community 34 - "ExerciseDetailModal.tsx"
Cohesion: 0.23
Nodes (10): react-native-safe-area-context, DetailModal(), DetailModalProps, styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel(), styles (+2 more)

### Community 35 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, android, build:all, build:android, build:ios, ios, lint, start (+3 more)

## Ambiguous Edges - Review These
- `grid.png — 1024×1024 RGBA grid/pattern texture layer composited under the iOS app icon symbol (visual content not verifiable by vision; role inferred from assets/expo.icon/icon.json)` → `android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)`  [AMBIGUOUS]
  assets/expo.icon/Assets/grid.png · relation: semantically_similar_to

## Knowledge Gaps
- **568 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+563 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 592 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `grid.png — 1024×1024 RGBA grid/pattern texture layer composited under the iOS app icon symbol (visual content not verifiable by vision; role inferred from assets/expo.icon/icon.json)` and `android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `workouts.ts`, `backup-file.ts`, `react-i18next`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `routines.ts`, `ToastProvider.tsx`, `useAppTheme`, `routines.tsx`, `app-theme-provider.tsx`, `exercise/[id]/edit.tsx`, `app/_layout.tsx`, `expo-sqlite`, `add-exercise.tsx`, `RestTimer.tsx`, `android-navigation-bar.tsx`, `[exerciseId].tsx`, `react`, `ExerciseDetailModal.tsx`?**
  _High betweenness centrality (0.389) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `expo-sqlite` to `react`, `react-native`, `workouts.ts`, `backup-file.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `routines.ts`, `routines.tsx`, `exercise/[id]/edit.tsx`, `app/_layout.tsx`, `add-exercise.tsx`, `[exerciseId].tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _568 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `workouts.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08196721311475409 - nodes in this community are weakly interconnected._