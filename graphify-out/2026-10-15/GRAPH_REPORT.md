# Graph Report - anvil  (2026-10-15)

## Corpus Check
- 122 files · ~138,843 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1307 nodes · 3301 edges · 43 communities (40 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `44fe258c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- [exerciseId].tsx
- backup-file.ts
- routines.ts
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
- stats.ts
- AchievementBadge.tsx
- index.ts
- routine/[id].tsx
- gamification.ts
- react-native
- StatisticsScreen
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
- utils/body-weight.ts
- exercise/[id]/edit.tsx
- withAlpha
- ToastProvider.tsx
- workout-goals.ts
- workouts.ts
- AnvilLogo.tsx
- database.ts
- useAppTheme
- add-exercise.tsx
- @expo/vector-icons
- types.ts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 106 edges
2. `react-native` - 58 edges
3. `react` - 40 edges
4. `react-i18next` - 40 edges
5. `expo-sqlite` - 31 edges
6. `WorkoutExerciseScreen()` - 31 edges
7. `useUnitsStore` - 31 edges
8. `withAlpha()` - 31 edges
9. `@expo/vector-icons` - 30 edges
10. `getAchievementByKey()` - 27 edges

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

## Communities (43 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (303): EXERCISE_FRAMES, frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up (+295 more)

### Community 1 - "[exerciseId].tsx"
Cohesion: 0.07
Nodes (66): RoutineSetEditorScreen(), firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), DurationInput(), ExerciseSetEditor() (+58 more)

### Community 2 - "backup-file.ts"
Cohesion: 0.05
Nodes (57): expo-document-picker, expo-file-system, expo-sharing, BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE, BACKUP_VERSION (+49 more)

### Community 3 - "routines.ts"
Cohesion: 0.20
Nodes (14): getDefaultSetTarget(), addExerciseToRoutine(), clampInt(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS, getRoutineExercise(), isTimedTarget() (+6 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.12
Nodes (25): computeAchievementProgress(), EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS, DistanceAchievementDefinition (+17 more)

### Community 6 - "settings.tsx"
Cohesion: 0.16
Nodes (19): expo-application, SettingsScreen(), styles, SwitchRow(), SwitchRowProps, resetAppLanguage(), setAppLanguage(), clampStep() (+11 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (38): main, name, private, version, eslint, eslint-config-expo, expo, expo-clipboard (+30 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.13
Nodes (15): ref_dayjs_locale_es, victory-native, ChartCardProps, getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey (+7 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (51): assets_audio_rest_finished, expo-audio, expo-notifications, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, AdjustButton() (+43 more)

### Community 11 - "scripts"
Cohesion: 0.08
Nodes (23): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+15 more)

### Community 12 - "constants/achievements.ts"
Cohesion: 0.12
Nodes (21): ACHIEVEMENT_CATEGORY_ORDER, AchievementProgress, ACHIEVEMENTS, AchievementScope, AchievementTier, computeExerciseAchievementProgress(), EXERCISE_METRIC_READERS, getAchievementByKey() (+13 more)

### Community 13 - "index.tsx"
Cohesion: 0.14
Nodes (25): AchievementsScreen(), getMonday(), HomeData, HomeScreen(), styles, ProgressBar(), ProgressBarProps, styles (+17 more)

### Community 14 - "stats.ts"
Cohesion: 0.20
Nodes (11): addBucket(), BucketGranularity, bucketStart(), buildTimeSeries(), CardioStats, DayCount, mondayOf(), MuscleSlice (+3 more)

### Community 15 - "AchievementBadge.tsx"
Cohesion: 0.14
Nodes (13): AchievementBadge(), AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles (+5 more)

### Community 16 - "index.ts"
Cohesion: 0.20
Nodes (10): expo-localization, i18next, AppLanguage, detectInitialLanguage(), isAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 17 - "routine/[id].tsx"
Cohesion: 0.13
Nodes (24): ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, EditRoutineScreen(), RoutineDetailScreen(), styles, RoutinesScreen(), styles (+16 more)

### Community 18 - "gamification.ts"
Cohesion: 0.10
Nodes (32): WorkoutRecapModalProps, WeightComparativeDefinition, unlockExerciseAchievement(), buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests, CardioSetRow (+24 more)

### Community 19 - "react-native"
Cohesion: 0.12
Nodes (23): react-i18next, react-native, SetDraft, styles, DialogApi, DialogButton, DialogButtonStyle, DialogContext (+15 more)

### Community 20 - "StatisticsScreen"
Cohesion: 0.39
Nodes (8): currentBucketIndex(), StatisticsScreen(), getCardioDayDistances(), getCardioStats(), getMuscleDistribution(), getSessionStats(), getWorkoutDayCounts(), rangeParams()

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "app/_layout.tsx"
Cohesion: 0.12
Nodes (14): expo-constants, expo-intent-launcher, expo-navigation-bar, expo-status-bar, expo-system-ui, react-native-gesture-handler, RootNavigator(), AndroidNavigationBar() (+6 more)

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

### Community 31 - "utils/body-weight.ts"
Cohesion: 0.06
Nodes (86): dayjs, AchievementCard(), AchievementCardProps, styles, AchievementDetailModal(), AchievementDetailModalProps, formatNumber(), metricUnit() (+78 more)

### Community 32 - "exercise/[id]/edit.tsx"
Cohesion: 0.13
Nodes (18): EditExerciseScreen(), styles, NewExerciseScreen(), DangerButton(), DangerButtonProps, styles, Chip(), EXERCISE_TYPES (+10 more)

### Community 33 - "withAlpha"
Cohesion: 0.13
Nodes (17): @shopify/react-native-skia, StatTile(), AppDialogProvider(), buttonAppearance(), toneColor(), BarTrendChart(), BarTrendChartProps, BarTrendPoint (+9 more)

### Community 35 - "ToastProvider.tsx"
Cohesion: 0.25
Nodes (8): react-native-safe-area-context, AnimatedPressable, styles, ToastApi, ToastContext, ToastItem, ToastOptions, ToastProvider()

### Community 36 - "workout-goals.ts"
Cohesion: 0.20
Nodes (10): ref_expo_sqlite_kv_store, zustand, ref_zustand_middleware, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState, THEME_STORAGE_KEY (+2 more)

### Community 37 - "workouts.ts"
Cohesion: 0.13
Nodes (26): WorkoutSessionScreen(), getRoutineExerciseSets(), WorkoutLog, applyWorkoutExerciseOrder(), cancelWorkout(), completeWorkout(), EMPTY_EXERCISE_STATS, ExerciseStats (+18 more)

### Community 38 - "AnvilLogo.tsx"
Cohesion: 0.22
Nodes (8): react-native-svg, AnvilLogo(), AnvilLogoProps, AnvilMark(), AnvilMarkProps, MARK_COLORS, styles, VIEWBOX

### Community 39 - "database.ts"
Cohesion: 0.52
Nodes (6): backfillPerExerciseAchievements(), seedAchievements(), initializeDatabase(), migrateDbIfNeeded(), seedExerciseCatalog(), deleteOrphanedSets()

### Community 41 - "useAppTheme"
Cohesion: 0.14
Nodes (24): expo-router, react, styles, TabsLayout(), styles, HeroGlow(), HeroGlowProps, ProgressRing() (+16 more)

### Community 42 - "add-exercise.tsx"
Cohesion: 0.13
Nodes (25): @bryllim/workout-guide, expo-sqlite, AddExerciseScreen(), FilterChip(), FilterSection(), styles, ExerciseDetailModal(), ExerciseDetailModalProps (+17 more)

### Community 44 - "@expo/vector-icons"
Cohesion: 0.15
Nodes (15): @expo/vector-icons, ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, NewRoutineScreen(), RoutineForm(), RoutineFormProps, styles, RoutineHeaderTitle(), RoutineHeaderTitleProps (+7 more)

### Community 46 - "types.ts"
Cohesion: 0.24
Nodes (9): Achievement, ActiveWorkoutExercise, PersonalRecord, Routine, RoutineExercise, RoutineExerciseSet, RoutineExerciseWithExercise, RoutineWithCount (+1 more)

## Knowledge Gaps
- **670 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+665 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 700 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `[exerciseId].tsx`, `backup-file.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `WorkoutTools.tsx`, `index.tsx`, `AchievementBadge.tsx`, `routine/[id].tsx`, `app/_layout.tsx`, `utils/body-weight.ts`, `exercise/[id]/edit.tsx`, `withAlpha`, `ToastProvider.tsx`, `AnvilLogo.tsx`, `useAppTheme`, `add-exercise.tsx`, `@expo/vector-icons`?**
  _High betweenness centrality (0.351) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `add-exercise.tsx` to `exercise/[id]/edit.tsx`, `[exerciseId].tsx`, `backup-file.ts`, `routines.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `database.ts`, `useAppTheme`, `workouts.ts`, `@expo/vector-icons`, `stats.ts`, `routine/[id].tsx`, `gamification.ts`, `react-native`, `app/_layout.tsx`, `utils/body-weight.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _670 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006578947368421052 - nodes in this community are weakly interconnected._
- **Should `[exerciseId].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0727927927927928 - nodes in this community are weakly interconnected._
- **Should `backup-file.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05446853516657853 - nodes in this community are weakly interconnected._