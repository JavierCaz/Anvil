# Graph Report - anvil  (2026-10-12)

## Corpus Check
- 86 files · ~89,130 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1034 nodes · 2168 edges · 32 communities (30 shown, 2 thin omitted)
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
- [reId].tsx
- devDependencies
- WorkoutTools.tsx
- ToastProvider.tsx
- app-theme-provider.tsx
- routines.ts
- expo-sqlite
- add-exercise.tsx
- react-native
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
- android-navigation-bar.tsx
- useAppTheme
- scripts

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
- **Anvil app icon asset set — iOS icon layer stack (expo-symbol 2 + grid) and Android adaptive icon layers (foreground + background)** — assets_expo_icon_assets_expo_symbol_2, assets_expo_icon_assets_grid, assets_images_android_icon_background, assets_images_android_icon_foreground [INFERRED 0.75]
- **Quality gates enforced before completion** — agents_testing, agents_verification, agents_typescript [INFERRED 0.85]
- **Anvil cross-platform app icon set sharing the blue/white chevron 'A' brand mark** — assets_images_icon_anvil_mark, assets_images_splash_icon_anvil_mark, assets_images_android_icon_monochrome_anvil_mark, assets_images_favicon_anvil_mark [INFERRED 0.85]

## Communities (32 total, 2 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "workout/[id].tsx"
Cohesion: 0.06
Nodes (60): styles, WorkoutSessionScreen(), formatElapsed(), styles, useElapsedSeconds(), WorkoutElapsedBar(), WorkoutElapsedBarProps, getNextWeightComparative() (+52 more)

### Community 2 - "backup-file.ts"
Cohesion: 0.06
Nodes (55): expo-document-picker, expo-file-system, expo-sharing, seedAchievements(), BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE (+47 more)

### Community 3 - "[exerciseId].tsx"
Cohesion: 0.07
Nodes (55): ref_dayjs_locale_es, zustand, SettingsScreen(), firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen() (+47 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+45 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.09
Nodes (44): AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, styles, WeekDayItem (+36 more)

### Community 6 - "settings.tsx"
Cohesion: 0.07
Nodes (37): expo-application, expo-localization, ref_expo_sqlite_kv_store, i18next, ref_zustand_middleware, styles, SwitchRow(), SwitchRowProps (+29 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (39): main, name, private, version, eslint, eslint-config-expo, expo, expo-clipboard (+31 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.12
Nodes (24): dayjs, victory-native, getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey, StatCardProps (+16 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "[reId].tsx"
Cohesion: 0.21
Nodes (11): react-i18next, RoutineSetEditorScreen(), SetDraft, styles, useDialog(), ExerciseSetEditor(), LoadingOverlay(), LoadingOverlayProps (+3 more)

### Community 11 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 12 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (49): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, AdjustButton(), AdjustButtonProps (+41 more)

### Community 13 - "ToastProvider.tsx"
Cohesion: 0.29
Nodes (7): AnimatedPressable, styles, ToastApi, ToastContext, ToastItem, ToastOptions, ToastProvider()

### Community 15 - "app-theme-provider.tsx"
Cohesion: 0.14
Nodes (17): AppDialogProvider(), buttonColor(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions, DialogTone (+9 more)

### Community 16 - "routines.ts"
Cohesion: 0.11
Nodes (28): expo-router, react-native-reanimated, react-native-sortables, EditRoutineScreen(), styles, RoutineDetailScreen(), styles, RoutinesScreen() (+20 more)

### Community 18 - "expo-sqlite"
Cohesion: 0.20
Nodes (14): @bryllim/workout-guide, expo-sqlite, EditExerciseScreen(), styles, NewExerciseScreen(), createExercise(), deleteExercise(), ExerciseFilters (+6 more)

### Community 19 - "add-exercise.tsx"
Cohesion: 0.19
Nodes (17): @expo/vector-icons, AddExerciseScreen(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel(), styles, ExerciseThumbnail() (+9 more)

### Community 20 - "react-native"
Cohesion: 0.16
Nodes (14): react, react-native, react-native-safe-area-context, NewRoutineScreen(), DetailModal(), DetailModalProps, styles, RoutineForm() (+6 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-exercise-frames.mjs"
Cohesion: 0.22
Nodes (8): ref_node_fs, ref_node_path, ref_node_url, entries, lines, manifest, outPath, root

### Community 23 - "app/_layout.tsx"
Cohesion: 0.20
Nodes (8): expo-constants, expo-intent-launcher, expo-notifications, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), DATABASE_NAME

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

### Community 31 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 32 - "useAppTheme"
Cohesion: 0.15
Nodes (14): ref_react_native_gesture_handler_reanimatedswipeable, FilterChip(), TabsLayout(), Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps, styles (+6 more)

### Community 35 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, android, build:all, build:android, build:ios, ios, lint, start (+3 more)

## Ambiguous Edges - Review These
- `grid.png — 1024×1024 RGBA grid/pattern texture layer composited under the iOS app icon symbol (visual content not verifiable by vision; role inferred from assets/expo.icon/icon.json)` → `android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)`  [AMBIGUOUS]
  assets/expo.icon/Assets/grid.png · relation: semantically_similar_to

## Knowledge Gaps
- **589 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+584 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 614 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `grid.png — 1024×1024 RGBA grid/pattern texture layer composited under the iOS app icon symbol (visual content not verifiable by vision; role inferred from assets/expo.icon/icon.json)` and `android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `react-native` connect `react-native` to `useAppTheme`, `workout/[id].tsx`, `exercise-frames.ts`, `[exerciseId].tsx`, `backup-file.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `[reId].tsx`, `WorkoutTools.tsx`, `ToastProvider.tsx`, `app-theme-provider.tsx`, `routines.ts`, `expo-sqlite`, `add-exercise.tsx`, `app/_layout.tsx`, `android-navigation-bar.tsx`?**
  _High betweenness centrality (0.383) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `expo-sqlite` to `workout/[id].tsx`, `backup-file.ts`, `[exerciseId].tsx`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `[reId].tsx`, `routines.ts`, `add-exercise.tsx`, `react-native`, `app/_layout.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _589 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `workout/[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06486486486486487 - nodes in this community are weakly interconnected._