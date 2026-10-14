# Graph Report - anvil  (2026-10-13)

## Corpus Check
- 100 files · ~127,037 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1184 nodes · 2652 edges · 36 communities (33 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc67ffe4`
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
- Screen.tsx
- index.tsx
- devDependencies
- constants/achievements.ts
- expo-sqlite
- routine/[id].tsx
- routines.ts
- useAppTheme
- AchievementBadge.tsx
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
- app/_layout.tsx
- app-theme-provider.tsx
- ToastProvider.tsx
- android-navigation-bar.tsx
- getAchievementByKey

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 87 edges
2. `react-native` - 45 edges
3. `react-i18next` - 34 edges
4. `react` - 33 edges
5. `WorkoutExerciseScreen()` - 31 edges
6. `expo-sqlite` - 28 edges
7. `useFocusQuery()` - 23 edges
8. `getAchievementByKey()` - 22 edges
9. `@expo/vector-icons` - 21 edges
10. `WorkoutSessionScreen()` - 21 edges

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

## Communities (36 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "workout/[id].tsx"
Cohesion: 0.06
Nodes (69): styles, WorkoutSessionScreen(), formatElapsed(), styles, useElapsedSeconds(), WorkoutElapsedBar(), WorkoutElapsedBarProps, WorkoutRecapModalProps (+61 more)

### Community 2 - "backup-file.ts"
Cohesion: 0.06
Nodes (58): expo-document-picker, expo-file-system, expo-sharing, seedAchievements(), BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE (+50 more)

### Community 3 - "[exerciseId].tsx"
Cohesion: 0.06
Nodes (93): expo-haptics, react-i18next, RoutineSetEditorScreen(), SetDraft, styles, firstIncompleteSet(), SetDraft, shiftMapDown() (+85 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.16
Nodes (20): EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats, getEarnedDistanceAchievements(), getWeightComparativesAtOrBelow(), ACHIEVEMENT_SEED, AchievementRow, backfillPerExerciseAchievements(), ExerciseAchievementOptions (+12 more)

### Community 6 - "settings.tsx"
Cohesion: 0.08
Nodes (38): expo-localization, ref_expo_sqlite_kv_store, i18next, zustand, ref_zustand_middleware, SettingsScreen(), styles, SwitchRow() (+30 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (39): main, name, private, version, @bryllim/workout-guide, eslint, eslint-config-expo, expo (+31 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.07
Nodes (45): dayjs, ref_dayjs_locale_es, @shopify/react-native-skia, victory-native, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY (+37 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (51): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, AdjustButton(), AdjustButtonProps (+43 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "Screen.tsx"
Cohesion: 0.18
Nodes (13): EditRoutineScreen(), styles, NewRoutineScreen(), RoutineForm(), RoutineFormProps, styles, Screen(), ScreenProps (+5 more)

### Community 13 - "index.tsx"
Cohesion: 0.18
Nodes (21): expo-router, AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, WeekDayItem (+13 more)

### Community 14 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 15 - "constants/achievements.ts"
Cohesion: 0.11
Nodes (22): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, ACHIEVEMENT_CATEGORY_ORDER, AchievementMetric, AchievementProgress, ACHIEVEMENTS, AchievementScope, AchievementTier, EXERCISE_METRIC_READERS (+14 more)

### Community 16 - "expo-sqlite"
Cohesion: 0.24
Nodes (12): expo-sqlite, EditExerciseScreen(), styles, NewExerciseScreen(), ExerciseForm(), createExercise(), deleteExercise(), ExerciseFilters (+4 more)

### Community 17 - "routine/[id].tsx"
Cohesion: 0.12
Nodes (21): @expo/vector-icons, ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, RoutineDetailScreen(), styles, TabsLayout(), RoutinesScreen() (+13 more)

### Community 18 - "routines.ts"
Cohesion: 0.17
Nodes (15): getDefaultSetTarget(), addExerciseToRoutine(), clampInt(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS, isTimedTarget(), positiveIntOrNull() (+7 more)

### Community 19 - "useAppTheme"
Cohesion: 0.11
Nodes (32): react-native-safe-area-context, AddExerciseScreen(), FilterChip(), FilterSection(), styles, DetailModal(), DetailModalProps, styles (+24 more)

### Community 20 - "AchievementBadge.tsx"
Cohesion: 0.14
Nodes (12): AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles, BadgeGlyph (+4 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "AppDialog.tsx"
Cohesion: 0.19
Nodes (12): AppDialogProvider(), buttonColor(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions, DialogTone (+4 more)

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

### Community 31 - "app/_layout.tsx"
Cohesion: 0.18
Nodes (9): expo-constants, expo-intent-launcher, expo-notifications, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), DATABASE_NAME (+1 more)

### Community 32 - "app-theme-provider.tsx"
Cohesion: 0.11
Nodes (20): react, react-native, react-native-svg, AnvilLogo(), AnvilLogoProps, AnvilMark(), AnvilMarkProps, MARK_COLORS (+12 more)

### Community 33 - "ToastProvider.tsx"
Cohesion: 0.29
Nodes (7): AnimatedPressable, styles, ToastApi, ToastContext, ToastItem, ToastOptions, ToastProvider()

### Community 34 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 35 - "getAchievementByKey"
Cohesion: 0.60
Nodes (5): computeAchievementProgress(), computeExerciseAchievementProgress(), getAchievementByKey(), normalizeDistanceAchievement(), buildAchievementItems()

## Knowledge Gaps
- **640 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+635 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 669 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `app-theme-provider.tsx` to `exercise-frames.ts`, `workout/[id].tsx`, `android-navigation-bar.tsx`, `[exerciseId].tsx`, `ToastProvider.tsx`, `backup-file.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `WorkoutTools.tsx`, `Screen.tsx`, `index.tsx`, `expo-sqlite`, `routine/[id].tsx`, `useAppTheme`, `AchievementBadge.tsx`, `AppDialog.tsx`, `app/_layout.tsx`?**
  _High betweenness centrality (0.365) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `expo-sqlite` to `workout/[id].tsx`, `backup-file.ts`, `[exerciseId].tsx`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `Screen.tsx`, `index.tsx`, `routine/[id].tsx`, `routines.ts`, `useAppTheme`, `app/_layout.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _640 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `workout/[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05700852189244784 - nodes in this community are weakly interconnected._
- **Should `backup-file.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05654761904761905 - nodes in this community are weakly interconnected._