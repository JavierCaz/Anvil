# Graph Report - anvil  (2026-10-15)

## Corpus Check
- 125 files · ~140,223 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1320 nodes · 3362 edges · 42 communities (39 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4d52bf3f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- [exerciseId].tsx
- backup.ts
- utils/body-weight.ts
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- statistics.tsx
- Anvil
- WorkoutTools.tsx
- scripts
- constants/achievements.ts
- index.tsx
- workout/[id].tsx
- AchievementBadge.tsx
- useAppTheme
- react-native
- gamification.ts
- routine/[id].tsx
- backup-file.ts
- tsconfig.json
- generate-icons.mjs
- ToastProvider.tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- jest
- app.config.js
- README npm scripts
- BodyWeightHomeCard.tsx
- [reId].tsx
- app/_layout.tsx
- index.ts
- schema.ts
- workout-goals.ts
- android-navigation-bar.tsx
- AnvilLogo.tsx
- devDependencies
- routines.ts
- @expo/vector-icons

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 111 edges
2. `react-native` - 60 edges
3. `react` - 42 edges
4. `react-i18next` - 42 edges
5. `expo-sqlite` - 32 edges
6. `WorkoutExerciseScreen()` - 32 edges
7. `@expo/vector-icons` - 31 edges
8. `useUnitsStore` - 31 edges
9. `withAlpha()` - 31 edges
10. `getAchievementByKey()` - 29 edges

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

## Communities (42 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "[exerciseId].tsx"
Cohesion: 0.06
Nodes (84): RoutineSetEditorScreen(), firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), AchievementCardProps, AchievementDetailModal() (+76 more)

### Community 2 - "backup.ts"
Cohesion: 0.13
Nodes (22): BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE, BACKUP_VERSION, BackupErrorCode, BackupRow, BackupRowValue, BackupTableData (+14 more)

### Community 3 - "utils/body-weight.ts"
Cohesion: 0.10
Nodes (36): BodyWeightDeltaProps, BodyWeightHomeCard(), useToast(), AchievementMetric, BODY_ACHIEVEMENTS, BODY_GOAL_ACHIEVEMENT_KEYS, BODY_METRIC_READERS, getBodyWeights() (+28 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.11
Nodes (30): EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS, DistanceAchievementDefinition, DistanceAchievementKind (+22 more)

### Community 6 - "settings.tsx"
Cohesion: 0.18
Nodes (17): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, setAppLanguage(), clampStep(), formatWeightStep(), useWeightStepStore (+9 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (41): main, name, private, version, eslint, eslint-config-expo, expo, expo-application (+33 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.06
Nodes (52): dayjs, ref_dayjs_locale_es, @shopify/react-native-skia, victory-native, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY (+44 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (50): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, AdjustButton(), AdjustButtonProps (+42 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "constants/achievements.ts"
Cohesion: 0.11
Nodes (24): ACHIEVEMENT_CATEGORY_ORDER, ACHIEVEMENT_TIER_COLORS, AchievementProgress, ACHIEVEMENTS, AchievementScope, AchievementTier, computeAchievementProgress(), EXERCISE_METRIC_READERS (+16 more)

### Community 13 - "index.tsx"
Cohesion: 0.14
Nodes (26): react-native-svg, AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, HeroGlow() (+18 more)

### Community 14 - "workout/[id].tsx"
Cohesion: 0.10
Nodes (37): styles, WorkoutSessionScreen(), formatElapsed(), useElapsedSeconds(), WorkoutElapsedBar(), getExercisesAchievements(), detectAndUnlockSpecials(), getRoutineExerciseSets() (+29 more)

### Community 15 - "AchievementBadge.tsx"
Cohesion: 0.13
Nodes (14): AchievementBadge(), AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles (+6 more)

### Community 16 - "useAppTheme"
Cohesion: 0.10
Nodes (22): FilterChip(), FilterSection(), TabsLayout(), AchievementCard(), styles, AnvilLogo(), LegendItem(), GoalToggleButton() (+14 more)

### Community 17 - "react-native"
Cohesion: 0.12
Nodes (28): expo-router, react-i18next, react-native, styles, EditRoutineScreen(), RoutinesScreen(), styles, DialogApi (+20 more)

### Community 18 - "gamification.ts"
Cohesion: 0.10
Nodes (34): computeExerciseAchievementProgress(), getDistanceAchievementByKey(), WeightComparativeDefinition, unlockAchievementIfNew(), buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests (+26 more)

### Community 19 - "routine/[id].tsx"
Cohesion: 0.17
Nodes (14): ref_react_native_gesture_handler_reanimatedswipeable, RoutineDetailScreen(), styles, LoadingOverlay(), LoadingOverlayProps, styles, styles, SwipeToDelete() (+6 more)

### Community 20 - "backup-file.ts"
Cohesion: 0.16
Nodes (18): expo-document-picker, expo-file-system, expo-sharing, BACKUP_APP, BackupError, BackupFile, BackupPreferences, buildBackupData() (+10 more)

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

### Community 28 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 31 - "BodyWeightHomeCard.tsx"
Cohesion: 0.14
Nodes (32): BodyComparisonLine(), BodyComparisonLineProps, styles, BodyWeightDelta(), ICONS, styles, BodyWeightGoalEditor(), BodyWeightGoalEditorProps (+24 more)

### Community 32 - "[reId].tsx"
Cohesion: 0.11
Nodes (31): react, styles, SetDraft, styles, DetailModal(), DetailModalProps, styles, ExerciseDetailModal() (+23 more)

### Community 33 - "app/_layout.tsx"
Cohesion: 0.18
Nodes (9): expo-constants, expo-intent-launcher, expo-notifications, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), DATABASE_NAME (+1 more)

### Community 34 - "index.ts"
Cohesion: 0.14
Nodes (13): expo-localization, ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, i18next, DEFAULT_ROUTINE_GLYPH, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage() (+5 more)

### Community 35 - "schema.ts"
Cohesion: 0.12
Nodes (16): MIGRATIONS, SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14, SCHEMA_V15 (+8 more)

### Community 36 - "workout-goals.ts"
Cohesion: 0.20
Nodes (10): ref_expo_sqlite_kv_store, zustand, ref_zustand_middleware, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState, THEME_STORAGE_KEY (+2 more)

### Community 37 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 38 - "AnvilLogo.tsx"
Cohesion: 0.29
Nodes (6): AnvilLogoProps, AnvilMark(), AnvilMarkProps, MARK_COLORS, styles, VIEWBOX

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 41 - "routines.ts"
Cohesion: 0.07
Nodes (38): @bryllim/workout-guide, expo-sqlite, EditExerciseScreen(), NewExerciseScreen(), AddExerciseScreen(), NewRoutineScreen(), ExerciseDetailModalProps, getDefaultSetTarget() (+30 more)

### Community 44 - "@expo/vector-icons"
Cohesion: 0.21
Nodes (11): @expo/vector-icons, CarouselArrow(), RoutineFormProps, styles, RoutineHeaderTitle(), RoutineHeaderTitleProps, styles, getRoutineGlyph() (+3 more)

## Knowledge Gaps
- **673 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+668 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 703 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `[exerciseId].tsx`, `settings.tsx`, `package.json`, `statistics.tsx`, `WorkoutTools.tsx`, `index.tsx`, `workout/[id].tsx`, `AchievementBadge.tsx`, `useAppTheme`, `routine/[id].tsx`, `backup-file.ts`, `ToastProvider.tsx`, `BodyWeightHomeCard.tsx`, `[reId].tsx`, `app/_layout.tsx`, `android-navigation-bar.tsx`, `AnvilLogo.tsx`, `@expo/vector-icons`?**
  _High betweenness centrality (0.350) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `routines.ts` to `[reId].tsx`, `app/_layout.tsx`, `[exerciseId].tsx`, `backup.ts`, `utils/body-weight.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `constants/achievements.ts`, `workout/[id].tsx`, `react-native`, `gamification.ts`, `routine/[id].tsx`, `backup-file.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _673 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `[exerciseId].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06002239641657335 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._