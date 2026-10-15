# Graph Report - anvil  (2026-10-15)

## Corpus Check
- 124 files · ~139,525 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1316 nodes · 3332 edges · 44 communities (41 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bdca495a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- ExerciseSetEditor.tsx
- backup.ts
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
- workout/[id].tsx
- AchievementBadge.tsx
- index.ts
- routine/[id].tsx
- gamification.ts
- [exerciseId].tsx
- backup-file.ts
- tsconfig.json
- generate-icons.mjs
- app-theme-provider.tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- jest
- app.config.js
- README npm scripts
- utils/body-weight.ts
- useAppTheme
- ProgressBar.tsx
- schema.ts
- WorkoutRecap
- WeeklyGoalEditor.tsx
- AnvilLogo.tsx
- devDependencies
- react-native
- add-exercise.tsx
- WeekStrip.tsx
- RoutineForm.tsx
- ref_expo_sqlite_kv_store

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 111 edges
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

## Communities (44 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (303): EXERCISE_FRAMES, frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up (+295 more)

### Community 1 - "ExerciseSetEditor.tsx"
Cohesion: 0.07
Nodes (65): RoutineSetEditorScreen(), firstIncompleteSet(), shiftMapDown(), WorkoutExerciseScreen(), DurationInput(), ExerciseSetEditor(), ExerciseSetEditorProps, formatReps() (+57 more)

### Community 2 - "backup.ts"
Cohesion: 0.13
Nodes (22): BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_VERSION, BackupErrorCode, BackupPreferences, BackupRow, BackupRowValue, BackupTableData (+14 more)

### Community 3 - "routines.ts"
Cohesion: 0.12
Nodes (24): getDefaultSetTarget(), addExerciseToRoutine(), clampInt(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS, getRoutineExercise(), isTimedTarget() (+16 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.11
Nodes (31): EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS, DistanceAchievementDefinition, DistanceAchievementKind (+23 more)

### Community 6 - "settings.tsx"
Cohesion: 0.17
Nodes (18): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, resetAppLanguage(), setAppLanguage(), clampStep(), formatWeightStep() (+10 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (40): main, name, private, version, @bryllim/workout-guide, eslint, eslint-config-expo, expo (+32 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.06
Nodes (51): ref_dayjs_locale_es, @shopify/react-native-skia, victory-native, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf() (+43 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (48): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), AdjustButton(), AdjustButtonProps, ControlRow() (+40 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "constants/achievements.ts"
Cohesion: 0.15
Nodes (17): ACHIEVEMENT_CATEGORY_ORDER, AchievementProgress, AchievementScope, AchievementTier, BODY_ACHIEVEMENTS, BODY_GOAL_ACHIEVEMENT_KEYS, computeAchievementProgress(), EXERCISE_METRIC_READERS (+9 more)

### Community 13 - "index.tsx"
Cohesion: 0.17
Nodes (23): react-native-svg, AchievementsScreen(), styles, getMonday(), HomeScreen(), styles, HeroGlow(), HeroGlowProps (+15 more)

### Community 14 - "workout/[id].tsx"
Cohesion: 0.13
Nodes (27): styles, WorkoutSessionScreen(), formatElapsed(), useElapsedSeconds(), getExercisesAchievements(), getRoutineExerciseSets(), applyWorkoutExerciseOrder(), cancelWorkout() (+19 more)

### Community 15 - "AchievementBadge.tsx"
Cohesion: 0.10
Nodes (18): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, AchievementBadge(), AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER (+10 more)

### Community 16 - "index.ts"
Cohesion: 0.20
Nodes (10): expo-localization, i18next, AppLanguage, detectInitialLanguage(), isAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 17 - "routine/[id].tsx"
Cohesion: 0.13
Nodes (21): ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, RoutineDetailScreen(), styles, RoutinesScreen(), styles, LoadingOverlay() (+13 more)

### Community 18 - "gamification.ts"
Cohesion: 0.11
Nodes (31): computeExerciseAchievementProgress(), getNextWeightComparative(), getWeightComparativeByKey(), WeightComparativeDefinition, buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests (+23 more)

### Community 19 - "[exerciseId].tsx"
Cohesion: 0.12
Nodes (22): @expo/vector-icons, react-i18next, react-native-safe-area-context, TabsLayout(), SetDraft, styles, DetailModal(), DetailModalProps (+14 more)

### Community 20 - "backup-file.ts"
Cohesion: 0.15
Nodes (19): expo-document-picker, expo-file-system, expo-sharing, BACKUP_APP, BACKUP_TYPE, BackupError, BackupFile, buildBackupData() (+11 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "app-theme-provider.tsx"
Cohesion: 0.07
Nodes (36): expo-constants, expo-intent-launcher, expo-navigation-bar, expo-notifications, expo-status-bar, expo-system-ui, react, react-native-gesture-handler (+28 more)

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
Nodes (85): dayjs, zustand, ref_zustand_middleware, AchievementCard(), AchievementCardProps, styles, AchievementDetailModal(), AchievementDetailModalProps (+77 more)

### Community 32 - "useAppTheme"
Cohesion: 0.16
Nodes (14): FilterChip(), FilterSection(), DangerButton(), DangerButtonProps, styles, Chip(), EXERCISE_TYPES, ExerciseForm() (+6 more)

### Community 33 - "ProgressBar.tsx"
Cohesion: 0.50
Nodes (3): ProgressBar(), ProgressBarProps, styles

### Community 34 - "schema.ts"
Cohesion: 0.12
Nodes (16): MIGRATIONS, SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14, SCHEMA_V15 (+8 more)

### Community 35 - "WorkoutRecap"
Cohesion: 0.50
Nodes (4): WorkoutRecapModalProps, WorkoutRecap, WeeklyConsistency, WorkoutSummary

### Community 36 - "WeeklyGoalEditor.tsx"
Cohesion: 0.32
Nodes (6): StepIcon(), styles, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState

### Community 38 - "AnvilLogo.tsx"
Cohesion: 0.25
Nodes (7): AnvilLogo(), AnvilLogoProps, AnvilMark(), AnvilMarkProps, MARK_COLORS, styles, VIEWBOX

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 41 - "react-native"
Cohesion: 0.12
Nodes (27): expo-router, expo-sqlite, react-native, EditExerciseScreen(), styles, NewExerciseScreen(), EditRoutineScreen(), SetDraft (+19 more)

### Community 42 - "add-exercise.tsx"
Cohesion: 0.19
Nodes (18): AddExerciseScreen(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel(), styles, ExerciseThumbnail(), ExerciseThumbnailProps (+10 more)

### Community 43 - "WeekStrip.tsx"
Cohesion: 0.25
Nodes (7): HomeData, styles, WeekDayItem, WeekStrip(), WeekStripProps, AchievementCategory, AchievementProgressItem

### Community 44 - "RoutineForm.tsx"
Cohesion: 0.18
Nodes (11): CarouselArrow(), RoutineFormProps, styles, RoutineHeaderTitle(), RoutineHeaderTitleProps, styles, DEFAULT_ROUTINE_GLYPH, getRoutineGlyph() (+3 more)

### Community 45 - "ref_expo_sqlite_kv_store"
Cohesion: 0.40
Nodes (4): ref_expo_sqlite_kv_store, THEME_STORAGE_KEY, ThemePreference, ThemeState

## Knowledge Gaps
- **673 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+668 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 703 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `ExerciseSetEditor.tsx`, `settings.tsx`, `package.json`, `statistics.tsx`, `WorkoutTools.tsx`, `index.tsx`, `workout/[id].tsx`, `AchievementBadge.tsx`, `routine/[id].tsx`, `[exerciseId].tsx`, `backup-file.ts`, `app-theme-provider.tsx`, `utils/body-weight.ts`, `useAppTheme`, `ProgressBar.tsx`, `WeeklyGoalEditor.tsx`, `AnvilLogo.tsx`, `add-exercise.tsx`, `WeekStrip.tsx`, `RoutineForm.tsx`?**
  _High betweenness centrality (0.357) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `react-native` to `backup.ts`, `routines.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `add-exercise.tsx`, `workout/[id].tsx`, `routine/[id].tsx`, `gamification.ts`, `[exerciseId].tsx`, `backup-file.ts`, `app-theme-provider.tsx`, `utils/body-weight.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _673 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006578947368421052 - nodes in this community are weakly interconnected._
- **Should `ExerciseSetEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07077625570776255 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._