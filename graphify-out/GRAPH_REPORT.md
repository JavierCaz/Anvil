# Graph Report - anvil  (2026-10-15)

## Corpus Check
- 124 files · ~139,175 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1315 nodes · 3330 edges · 46 communities (43 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8e56eb38`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- [exerciseId].tsx
- backup.ts
- routines.ts
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- statistics.tsx
- Anvil
- useAppTheme
- scripts
- constants/achievements.ts
- index.tsx
- stats.ts
- AchievementBadge.tsx
- index.ts
- routine/[id].tsx
- workout/[id].tsx
- react-native
- backup-file.ts
- tsconfig.json
- generate-icons.mjs
- react
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- jest
- app.config.js
- README npm scripts
- utils/body-weight.ts
- ExerciseForm.tsx
- LineTrendChart.tsx
- schema.ts
- ToastProvider.tsx
- WeeklyGoalEditor.tsx
- AppDialog.tsx
- AnvilLogo.tsx
- devDependencies
- app-theme-provider.tsx
- useFocusQuery
- add-exercise.tsx
- WeekStrip.tsx
- RoutineHeaderTitle.tsx
- ref_expo_sqlite_kv_store

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 110 edges
2. `react-native` - 60 edges
3. `react-i18next` - 42 edges
4. `react` - 41 edges
5. `@expo/vector-icons` - 31 edges
6. `expo-sqlite` - 31 edges
7. `WorkoutExerciseScreen()` - 31 edges
8. `useUnitsStore` - 31 edges
9. `withAlpha()` - 31 edges
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

## Communities (46 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "[exerciseId].tsx"
Cohesion: 0.07
Nodes (70): expo-haptics, RoutineSetEditorScreen(), SetDraft, styles, firstIncompleteSet(), SetDraft, shiftMapDown(), styles (+62 more)

### Community 2 - "backup.ts"
Cohesion: 0.13
Nodes (22): BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_VERSION, BackupErrorCode, BackupPreferences, BackupRow, BackupRowValue, BackupTableData (+14 more)

### Community 3 - "routines.ts"
Cohesion: 0.13
Nodes (20): expo-sqlite, NewRoutineScreen(), getDefaultSetTarget(), addExerciseToRoutine(), clampInt(), createRoutine(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS (+12 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.10
Nodes (32): EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS, DistanceAchievementDefinition, DistanceAchievementKind (+24 more)

### Community 6 - "settings.tsx"
Cohesion: 0.17
Nodes (18): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, resetAppLanguage(), setAppLanguage(), clampStep(), formatWeightStep() (+10 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (38): main, name, private, version, @bryllim/workout-guide, eslint, eslint-config-expo, expo (+30 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.18
Nodes (17): ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey, StatisticsScreen() (+9 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "useAppTheme"
Cohesion: 0.07
Nodes (58): assets_audio_rest_finished, expo-audio, expo-notifications, LegendItem(), SetTimerButton(), ProgressBar(), ProgressBarProps, styles (+50 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "constants/achievements.ts"
Cohesion: 0.15
Nodes (18): ACHIEVEMENT_CATEGORY_ORDER, AchievementProgress, AchievementScope, AchievementTier, computeAchievementProgress(), computeExerciseAchievementProgress(), EXERCISE_METRIC_READERS, getAchievementByKey() (+10 more)

### Community 13 - "index.tsx"
Cohesion: 0.17
Nodes (23): react-native-svg, AchievementsScreen(), styles, getMonday(), HomeScreen(), styles, HeroGlow(), HeroGlowProps (+15 more)

### Community 14 - "stats.ts"
Cohesion: 0.19
Nodes (12): dayjs, addBucket(), BucketGranularity, bucketStart(), buildTimeSeries(), CardioStats, DayCount, mondayOf() (+4 more)

### Community 15 - "AchievementBadge.tsx"
Cohesion: 0.10
Nodes (18): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, AchievementBadge(), AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER (+10 more)

### Community 16 - "index.ts"
Cohesion: 0.20
Nodes (10): expo-localization, i18next, AppLanguage, detectInitialLanguage(), isAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 17 - "routine/[id].tsx"
Cohesion: 0.13
Nodes (21): expo-constants, expo-intent-launcher, ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, RoutineDetailScreen(), styles, RoutinesScreen() (+13 more)

### Community 18 - "workout/[id].tsx"
Cohesion: 0.06
Nodes (66): styles, WorkoutSessionScreen(), WorkoutRecapModalProps, METRIC_READERS, getNextWeightComparative(), getWeightComparativeByKey(), WeightComparativeDefinition, getExercisesAchievements() (+58 more)

### Community 19 - "react-native"
Cohesion: 0.11
Nodes (27): @expo/vector-icons, react-native, react-native-safe-area-context, DangerButton(), DangerButtonProps, styles, DetailModal(), DetailModalProps (+19 more)

### Community 20 - "backup-file.ts"
Cohesion: 0.15
Nodes (19): expo-document-picker, expo-file-system, expo-sharing, BACKUP_APP, BACKUP_TYPE, BackupError, BackupFile, buildBackupData() (+11 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "react"
Cohesion: 0.14
Nodes (12): expo-navigation-bar, expo-status-bar, expo-system-ui, react, react-native-gesture-handler, RootNavigator(), AndroidNavigationBar(), loadNavigationBar() (+4 more)

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
Nodes (85): ref_dayjs_locale_es, react-i18next, zustand, ref_zustand_middleware, AchievementCard(), AchievementCardProps, styles, AchievementDetailModal() (+77 more)

### Community 32 - "ExerciseForm.tsx"
Cohesion: 0.22
Nodes (9): NewExerciseScreen(), Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps, styles, EXERCISE_TYPE_I18N_KEYS, MUSCLE_I18N_KEYS (+1 more)

### Community 33 - "LineTrendChart.tsx"
Cohesion: 0.12
Nodes (14): @shopify/react-native-skia, victory-native, BarTrendChart(), BarTrendChartProps, BarTrendPoint, styles, LineTrendChart(), LineTrendChartProps (+6 more)

### Community 34 - "schema.ts"
Cohesion: 0.12
Nodes (15): SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14, SCHEMA_V15, SCHEMA_V2 (+7 more)

### Community 35 - "ToastProvider.tsx"
Cohesion: 0.29
Nodes (7): AnimatedPressable, styles, ToastApi, ToastContext, ToastItem, ToastOptions, ToastProvider()

### Community 36 - "WeeklyGoalEditor.tsx"
Cohesion: 0.32
Nodes (6): StepIcon(), styles, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState

### Community 37 - "AppDialog.tsx"
Cohesion: 0.21
Nodes (12): StatTile(), AppDialogProvider(), buttonAppearance(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions (+4 more)

### Community 38 - "AnvilLogo.tsx"
Cohesion: 0.25
Nodes (7): AnvilLogo(), AnvilLogoProps, AnvilMark(), AnvilMarkProps, MARK_COLORS, styles, VIEWBOX

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 40 - "app-theme-provider.tsx"
Cohesion: 0.33
Nodes (7): AppColorScheme, AppTheme, AppThemeContext, darkColors, lightColors, palette, ThemeColors

### Community 41 - "useFocusQuery"
Cohesion: 0.16
Nodes (17): expo-router, EditExerciseScreen(), styles, EditRoutineScreen(), TabsLayout(), Screen(), ScreenProps, styles (+9 more)

### Community 42 - "add-exercise.tsx"
Cohesion: 0.13
Nodes (25): expo-image, AddExerciseScreen(), FilterChip(), FilterSection(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel() (+17 more)

### Community 43 - "WeekStrip.tsx"
Cohesion: 0.25
Nodes (7): HomeData, styles, WeekDayItem, WeekStrip(), WeekStripProps, AchievementCategory, AchievementProgressItem

### Community 44 - "RoutineHeaderTitle.tsx"
Cohesion: 0.22
Nodes (9): RoutineForm(), RoutineHeaderTitle(), RoutineHeaderTitleProps, styles, DEFAULT_ROUTINE_GLYPH, getRoutineGlyph(), GlyphName, ROUTINE_ICONS (+1 more)

### Community 45 - "ref_expo_sqlite_kv_store"
Cohesion: 0.40
Nodes (4): ref_expo_sqlite_kv_store, THEME_STORAGE_KEY, ThemePreference, ThemeState

## Knowledge Gaps
- **673 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+668 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 703 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `[exerciseId].tsx`, `routines.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `useAppTheme`, `index.tsx`, `AchievementBadge.tsx`, `routine/[id].tsx`, `workout/[id].tsx`, `backup-file.ts`, `react`, `utils/body-weight.ts`, `ExerciseForm.tsx`, `LineTrendChart.tsx`, `ToastProvider.tsx`, `WeeklyGoalEditor.tsx`, `AppDialog.tsx`, `AnvilLogo.tsx`, `app-theme-provider.tsx`, `useFocusQuery`, `add-exercise.tsx`, `WeekStrip.tsx`, `RoutineHeaderTitle.tsx`?**
  _High betweenness centrality (0.363) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `routines.ts` to `ExerciseForm.tsx`, `[exerciseId].tsx`, `backup.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `useFocusQuery`, `add-exercise.tsx`, `constants/achievements.ts`, `stats.ts`, `routine/[id].tsx`, `workout/[id].tsx`, `backup-file.ts`, `react`, `utils/body-weight.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _673 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `[exerciseId].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06993670886075949 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._