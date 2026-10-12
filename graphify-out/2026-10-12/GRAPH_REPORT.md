# Graph Report - anvil  (2026-09-21)

## Corpus Check
- 81 files · ~85,378 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 984 nodes · 2007 edges · 24 communities (22 shown, 2 thin omitted)
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
- useAppTheme
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- statistics.tsx
- Anvil
- routines.ts
- devDependencies
- app-theme-provider.tsx
- add-exercise.tsx
- tsconfig.json
- generate-exercise-frames.mjs
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- expo-symbol 2.svg — white vector glyph (Expo default symbol, tent/chevron mark) used as the iOS app icon layer
- jest
- app.config.js
- README npm scripts
- scripts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 68 edges
2. `react-native` - 37 edges
3. `react-i18next` - 31 edges
4. `expo-sqlite` - 27 edges
5. `react` - 25 edges
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

## Communities (24 total, 2 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "workouts.ts"
Cohesion: 0.06
Nodes (66): dayjs, expo-sqlite, formatStopwatch(), styles, WorkoutSessionScreen(), WorkoutRecapModalProps, getNextWeightComparative(), getWeightComparativeByKey() (+58 more)

### Community 2 - "backup-file.ts"
Cohesion: 0.06
Nodes (56): expo-document-picker, expo-file-system, expo-sharing, seedAchievements(), BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE (+48 more)

### Community 3 - "useAppTheme"
Cohesion: 0.06
Nodes (77): @expo/vector-icons, react-i18next, react-native, ref_react_native_gesture_handler_reanimatedswipeable, react-native-safe-area-context, RoutineSetEditorScreen(), SetDraft, styles (+69 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+45 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.08
Nodes (50): expo-router, react, AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles (+42 more)

### Community 6 - "settings.tsx"
Cohesion: 0.08
Nodes (38): expo-localization, ref_expo_sqlite_kv_store, i18next, zustand, ref_zustand_middleware, SettingsScreen(), styles, SwitchRow() (+30 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (39): main, name, private, version, eslint, eslint-config-expo, expo, expo-application (+31 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.17
Nodes (15): ref_dayjs_locale_es, victory-native, getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey, StatCardProps (+7 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "routines.ts"
Cohesion: 0.08
Nodes (39): react-native-reanimated, react-native-sortables, NewExerciseScreen(), EditRoutineScreen(), styles, RoutineDetailScreen(), styles, NewRoutineScreen() (+31 more)

### Community 11 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 15 - "app-theme-provider.tsx"
Cohesion: 0.06
Nodes (41): assets_audio_rest_finished, expo-audio, expo-constants, expo-intent-launcher, expo-navigation-bar, expo-notifications, expo-status-bar, expo-system-ui (+33 more)

### Community 19 - "add-exercise.tsx"
Cohesion: 0.09
Nodes (34): @bryllim/workout-guide, expo-image, EditExerciseScreen(), styles, AddExerciseScreen(), FilterChip(), styles, ExerciseDetailModal() (+26 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-exercise-frames.mjs"
Cohesion: 0.22
Nodes (8): ref_node_fs, ref_node_path, ref_node_url, entries, lines, manifest, outPath, root

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

### Community 35 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, android, build:all, build:android, build:ios, ios, lint, start (+3 more)

## Ambiguous Edges - Review These
- `grid.png — 1024×1024 RGBA grid/pattern texture layer composited under the iOS app icon symbol (visual content not verifiable by vision; role inferred from assets/expo.icon/icon.json)` → `android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)`  [AMBIGUOUS]
  assets/expo.icon/Assets/grid.png · relation: semantically_similar_to

## Knowledge Gaps
- **573 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+568 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 597 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `grid.png — 1024×1024 RGBA grid/pattern texture layer composited under the iOS app icon symbol (visual content not verifiable by vision; role inferred from assets/expo.icon/icon.json)` and `android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `react-native` connect `useAppTheme` to `exercise-frames.ts`, `workouts.ts`, `backup-file.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `routines.ts`, `app-theme-provider.tsx`, `add-exercise.tsx`?**
  _High betweenness centrality (0.389) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `workouts.ts` to `backup-file.ts`, `useAppTheme`, `db/achievements.ts`, `settings.tsx`, `package.json`, `routines.ts`, `app-theme-provider.tsx`, `add-exercise.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _573 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `workouts.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05906553041434029 - nodes in this community are weakly interconnected._