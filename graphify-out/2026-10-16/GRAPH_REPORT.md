# Graph Report - anvil  (2026-10-16)

## Corpus Check
- 136 files · ~148,100 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1378 nodes · 3575 edges · 42 communities (39 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `467ddce1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- ExerciseSetEditor.tsx
- backup.ts
- utils/body-weight.ts
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- add-exercise.tsx
- Anvil
- WorkoutTools.tsx
- scripts
- gamification.ts
- index.tsx
- workouts.ts
- routines.ts
- constants/achievements.ts
- backup-file.ts
- weight-comparatives.ts
- useAppTheme
- schema.ts
- tsconfig.json
- generate-icons.mjs
- routine/[id].tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- ToastProvider.tsx
- app.config.js
- README npm scripts
- [exerciseId].tsx
- react-native
- share-image.ts
- index.ts
- workout/[id].tsx
- app/_layout.tsx
- devDependencies
- WorkoutShareCard.tsx
- statistics.tsx
- jest
- RoutineHeaderTitle.tsx

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 113 edges
2. `react-native` - 64 edges
3. `react` - 48 edges
4. `react-i18next` - 44 edges
5. `withAlpha()` - 35 edges
6. `WorkoutExerciseScreen()` - 33 edges
7. `@expo/vector-icons` - 32 edges
8. `expo-sqlite` - 32 edges
9. `getAchievementByKey()` - 31 edges
10. `useUnitsStore` - 29 edges

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
Nodes (303): EXERCISE_FRAMES, frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up (+295 more)

### Community 1 - "ExerciseSetEditor.tsx"
Cohesion: 0.07
Nodes (56): DurationInput(), ExerciseSetEditor(), ExerciseSetEditorProps, formatReps(), formatSetValues(), parseNumber(), REST_MAX_SECONDS, REST_STEP_SECONDS (+48 more)

### Community 2 - "backup.ts"
Cohesion: 0.14
Nodes (20): BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_VERSION, BackupErrorCode, BackupRow, BackupRowValue, BackupTableData, BackupTableName (+12 more)

### Community 3 - "utils/body-weight.ts"
Cohesion: 0.06
Nodes (85): dayjs, ref_dayjs_locale_es, ref_expo_sqlite_kv_store, zustand, ref_zustand_middleware, AchievementCard(), AchievementCardProps, styles (+77 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.12
Nodes (28): AchievementCategory, ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS, DistanceAchievementDefinition, DistanceAchievementKind (+20 more)

### Community 6 - "settings.tsx"
Cohesion: 0.18
Nodes (17): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, setAppLanguage(), clampStep(), formatWeightStep(), useWeightStepStore (+9 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (36): main, name, private, version, eslint, eslint-config-expo, expo, expo-application (+28 more)

### Community 8 - "add-exercise.tsx"
Cohesion: 0.20
Nodes (17): AddExerciseScreen(), FilterChip(), styles, ExerciseDetailModal(), muscleLabel(), styles, ExerciseThumbnail(), ExerciseThumbnailProps (+9 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (50): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, AdjustButton(), AdjustButtonProps (+42 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "gamification.ts"
Cohesion: 0.12
Nodes (28): METRIC_READERS, unlockExerciseAchievement(), buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests, CardioSetRow, computeCardioPRs() (+20 more)

### Community 13 - "index.tsx"
Cohesion: 0.10
Nodes (31): AchievementsScreen(), getMonday(), HomeData, HomeScreen(), styles, ProgressBar(), ProgressBarProps, styles (+23 more)

### Community 14 - "workouts.ts"
Cohesion: 0.13
Nodes (26): WorkoutSessionScreen(), getRoutineExerciseSets(), WorkoutLog, WorkoutSet, applyWorkoutExerciseOrder(), cancelWorkout(), completeWorkout(), EMPTY_EXERCISE_STATS (+18 more)

### Community 15 - "routines.ts"
Cohesion: 0.11
Nodes (26): NewRoutineScreen(), getDefaultSetTarget(), addExerciseToRoutine(), clampInt(), createRoutine(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS (+18 more)

### Community 16 - "constants/achievements.ts"
Cohesion: 0.13
Nodes (20): ACHIEVEMENT_CATEGORY_ORDER, AchievementProgress, AchievementScope, AchievementTier, computeAchievementProgress(), computeExerciseAchievementProgress(), EXERCISE_METRIC_READERS, EXERCISE_STAT_ACHIEVEMENTS (+12 more)

### Community 17 - "backup-file.ts"
Cohesion: 0.15
Nodes (19): expo-document-picker, expo-file-system, BACKUP_APP, BACKUP_TYPE, BackupError, BackupFile, BackupPreferences, buildBackupData() (+11 more)

### Community 18 - "weight-comparatives.ts"
Cohesion: 0.21
Nodes (9): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, ACHIEVEMENTS, DISTANCE_ACHIEVEMENTS, ALL_KEYS, getNextWeightComparative(), getVolumeComparison(), getWeightComparativesAtOrBelow(), VolumeComparison (+1 more)

### Community 19 - "useAppTheme"
Cohesion: 0.09
Nodes (25): @expo/vector-icons, ref_react_native_gesture_handler_reanimatedswipeable, FilterSection(), TabsLayout(), Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps (+17 more)

### Community 20 - "schema.ts"
Cohesion: 0.11
Nodes (18): DATABASE_VERSION, MIGRATIONS, SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14 (+10 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "routine/[id].tsx"
Cohesion: 0.12
Nodes (26): expo-notifications, react-native-reanimated, react-native-sortables, EditRoutineScreen(), RoutineDetailScreen(), styles, RoutinesScreen(), styles (+18 more)

### Community 24 - "Strict TypeScript"
Cohesion: 0.33
Nodes (6): Path aliases @/* and @/assets/*, Testing (jest-expo + testing-library), Strict TypeScript, Verification gates (tsc, lint, test), README path aliases, Strict TypeScript in README

### Community 25 - "Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms"
Cohesion: 0.90
Nodes (5): Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms, Android Adaptive Icon Monochrome Layer — flat gray chevron 'A' silhouette with transparent background for Android themed icons, Anvil Web Favicon — solid blue chevron 'A' mark on a light-blue rounded square, small square format for browser tabs, Anvil App Icon — glossy white chevron 'A' mark centered on a blue gradient background with a faint blueprint grid and crosshairs, Anvil Splash Icon — faint white/translucent chevron 'A' mark on a transparent background, used for the native splash screen

### Community 26 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, ref_eslint_config, ref_eslint_config_expo_flat

### Community 28 - "ToastProvider.tsx"
Cohesion: 0.29
Nodes (7): AnimatedPressable, styles, ToastApi, ToastContext, ToastItem, ToastOptions, ToastProvider()

### Community 31 - "[exerciseId].tsx"
Cohesion: 0.23
Nodes (15): RoutineSetEditorScreen(), firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), clampIncline(), clampLevel() (+7 more)

### Community 32 - "react-native"
Cohesion: 0.10
Nodes (35): @bryllim/workout-guide, expo-router, expo-sqlite, react, react-i18next, react-native, styles, EditExerciseScreen() (+27 more)

### Community 33 - "share-image.ts"
Cohesion: 0.27
Nodes (10): expo-clipboard, expo-media-library, expo-sharing, react-native-view-shot, capture(), copyShareImage(), saveShareImage(), ShareImageError (+2 more)

### Community 34 - "index.ts"
Cohesion: 0.21
Nodes (10): expo-localization, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 36 - "workout/[id].tsx"
Cohesion: 0.15
Nodes (20): react-native-safe-area-context, styles, DangerButton(), DangerButtonProps, styles, DetailModal(), DetailModalProps, styles (+12 more)

### Community 37 - "app/_layout.tsx"
Cohesion: 0.14
Nodes (11): expo-navigation-bar, expo-status-bar, expo-system-ui, react-native-gesture-handler, RootNavigator(), AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps (+3 more)

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 40 - "WorkoutShareCard.tsx"
Cohesion: 0.05
Nodes (62): i18next, react-native-svg, @testing-library/react-native, AchievementBadge(), AchievementBadgeProps, FACE, Finish, FINISHES (+54 more)

### Community 42 - "statistics.tsx"
Cohesion: 0.05
Nodes (57): expo-haptics, @shopify/react-native-skia, victory-native, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf() (+49 more)

### Community 43 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 44 - "RoutineHeaderTitle.tsx"
Cohesion: 0.24
Nodes (8): RoutineHeaderTitle(), RoutineHeaderTitleProps, styles, DEFAULT_ROUTINE_GLYPH, getRoutineGlyph(), GlyphName, ROUTINE_ICONS, RoutineIconDefinition

## Knowledge Gaps
- **685 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+680 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 718 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `ExerciseSetEditor.tsx`, `utils/body-weight.ts`, `settings.tsx`, `package.json`, `add-exercise.tsx`, `WorkoutTools.tsx`, `index.tsx`, `backup-file.ts`, `useAppTheme`, `routine/[id].tsx`, `ToastProvider.tsx`, `[exerciseId].tsx`, `share-image.ts`, `workout/[id].tsx`, `app/_layout.tsx`, `WorkoutShareCard.tsx`, `statistics.tsx`, `RoutineHeaderTitle.tsx`?**
  _High betweenness centrality (0.338) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `react-native`, `ExerciseSetEditor.tsx`, `share-image.ts`, `utils/body-weight.ts`, `workout/[id].tsx`, `app/_layout.tsx`, `settings.tsx`, `add-exercise.tsx`, `WorkoutShareCard.tsx`, `statistics.tsx`, `WorkoutTools.tsx`, `RoutineHeaderTitle.tsx`, `index.tsx`, `workouts.ts`, `routine/[id].tsx`, `ToastProvider.tsx`, `[exerciseId].tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _685 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006578947368421052 - nodes in this community are weakly interconnected._
- **Should `ExerciseSetEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0742447516641065 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._