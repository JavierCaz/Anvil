# Graph Report - anvil  (2026-10-16)

## Corpus Check
- 136 files · ~148,083 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1378 nodes · 3590 edges · 49 communities (46 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e9bab519`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- exercise-metrics.ts
- backup.ts
- index.tsx
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- ExerciseDetailModal.tsx
- Anvil
- WorkoutTools.tsx
- scripts
- AchievementBadge.tsx
- workout/[id].tsx
- workouts.ts
- WeeklyGoalEditor.tsx
- withAlpha
- backup-file.ts
- gamification.ts
- ExerciseSetEditor.tsx
- schema.ts
- tsconfig.json
- generate-icons.mjs
- app-theme-provider.tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- WorkoutRecap.tsx
- app.config.js
- README npm scripts
- [exerciseId].tsx
- routines.ts
- app/_layout.tsx
- index.ts
- routine/[id].tsx
- react-native
- android-navigation-bar.tsx
- distance.ts
- devDependencies
- WorkoutShareCard.tsx
- share-image.ts
- statistics.tsx
- jest
- useAppTheme
- types.ts
- AnvilLogo.tsx
- WorkoutShareCard.test.tsx
- add-exercise.tsx

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 115 edges
2. `react-native` - 64 edges
3. `react` - 47 edges
4. `react-i18next` - 45 edges
5. `withAlpha()` - 35 edges
6. `WorkoutExerciseScreen()` - 33 edges
7. `@expo/vector-icons` - 32 edges
8. `expo-sqlite` - 32 edges
9. `getAchievementByKey()` - 31 edges
10. `useUnitsStore` - 31 edges

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

## Communities (49 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "exercise-metrics.ts"
Cohesion: 0.14
Nodes (24): ExerciseSetEditor(), DefaultSetTarget, DISTANCE_DURATION, distanceScale, DURATION, durationStepSeconds(), FREE_WEIGHT_EQUIPMENT, INCLINE_DEFAULT_SLUGS (+16 more)

### Community 2 - "backup.ts"
Cohesion: 0.11
Nodes (24): BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE, BACKUP_VERSION, BackupErrorCode, BackupFile, BackupPreferences (+16 more)

### Community 3 - "index.tsx"
Cohesion: 0.05
Nodes (99): dayjs, ref_dayjs_locale_es, zustand, ref_zustand_middleware, HomeData, styles, AchievementCard(), AchievementCardProps (+91 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.05
Nodes (72): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, AchievementsScreen(), getMonday(), HomeScreen(), BadgeGlyph, BadgeGlyphName, CATEGORY_GLYPHS, getBadgeGlyph() (+64 more)

### Community 6 - "settings.tsx"
Cohesion: 0.14
Nodes (21): ref_expo_sqlite_kv_store, SettingsScreen(), styles, SwitchRow(), SwitchRowProps, setAppLanguage(), clampStep(), formatWeightStep() (+13 more)

### Community 7 - "package.json"
Cohesion: 0.06
Nodes (34): main, name, private, version, eslint, eslint-config-expo, expo, expo-application (+26 more)

### Community 8 - "ExerciseDetailModal.tsx"
Cohesion: 0.16
Nodes (16): ExerciseDetailModal(), muscleLabel(), styles, Chip(), EXERCISE_TYPES, ExerciseFormProps, styles, ExerciseThumbnail() (+8 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (48): assets_audio_rest_finished, expo-audio, SetTimerButton(), RestTimerAlarm(), AdjustButton(), AdjustButtonProps, ControlRow(), ControlRowProps (+40 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "AchievementBadge.tsx"
Cohesion: 0.12
Nodes (16): react-native-safe-area-context, AchievementBadge(), AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER (+8 more)

### Community 13 - "workout/[id].tsx"
Cohesion: 0.14
Nodes (19): react, react-native-reanimated, styles, styles, HeroGlow(), HeroGlowProps, ProgressRing(), ProgressRingProps (+11 more)

### Community 14 - "workouts.ts"
Cohesion: 0.13
Nodes (26): WorkoutSessionScreen(), getExercisesAchievements(), getRoutineExerciseSets(), WorkoutLog, applyWorkoutExerciseOrder(), cancelWorkout(), completeWorkout(), EMPTY_EXERCISE_STATS (+18 more)

### Community 15 - "WeeklyGoalEditor.tsx"
Cohesion: 0.29
Nodes (8): StepIcon(), styles, WeeklyGoalEditor(), useWeeklyGoalStore, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState

### Community 16 - "withAlpha"
Cohesion: 0.09
Nodes (28): expo-haptics, @shopify/react-native-skia, victory-native, StatTile(), BarTrendChart(), BarTrendChartProps, BarTrendPoint, Scale (+20 more)

### Community 17 - "backup-file.ts"
Cohesion: 0.20
Nodes (15): expo-document-picker, expo-file-system, BackupError, buildBackupData(), assertNotWeb(), clearPreferences(), eraseAllData(), exportBackupFile() (+7 more)

### Community 18 - "gamification.ts"
Cohesion: 0.12
Nodes (27): METRIC_READERS, buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests, CardioSetRow, computeCardioPRs(), detectAndRecordPRs() (+19 more)

### Community 19 - "ExerciseSetEditor.tsx"
Cohesion: 0.15
Nodes (22): RoutineSetEditorScreen(), DurationInput(), ExerciseSetEditorProps, formatReps(), parseNumber(), REST_MAX_SECONDS, REST_STEP_SECONDS, SetCard() (+14 more)

### Community 20 - "schema.ts"
Cohesion: 0.11
Nodes (18): DATABASE_VERSION, MIGRATIONS, SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14 (+10 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "app-theme-provider.tsx"
Cohesion: 0.16
Nodes (14): AppDialogProvider(), buttonAppearance(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions, DialogTone (+6 more)

### Community 24 - "Strict TypeScript"
Cohesion: 0.33
Nodes (6): Path aliases @/* and @/assets/*, Testing (jest-expo + testing-library), Strict TypeScript, Verification gates (tsc, lint, test), README path aliases, Strict TypeScript in README

### Community 25 - "Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms"
Cohesion: 0.90
Nodes (5): Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms, Android Adaptive Icon Monochrome Layer — flat gray chevron 'A' silhouette with transparent background for Android themed icons, Anvil Web Favicon — solid blue chevron 'A' mark on a light-blue rounded square, small square format for browser tabs, Anvil App Icon — glossy white chevron 'A' mark centered on a blue gradient background with a faint blueprint grid and crosshairs, Anvil Splash Icon — faint white/translucent chevron 'A' mark on a transparent background, used for the native splash screen

### Community 26 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, ref_eslint_config, ref_eslint_config_expo_flat

### Community 28 - "WorkoutRecap.tsx"
Cohesion: 0.37
Nodes (11): WorkoutShareCard(), styles, WorkoutRecapModal(), DetectedPR, formatDuration(), formatPRDetail(), formatSessionClock(), formatSessionLength() (+3 more)

### Community 31 - "[exerciseId].tsx"
Cohesion: 0.26
Nodes (13): firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), getExerciseMetrics(), getExerciseAchievements(), getExerciseAchievementUnlockedAt() (+5 more)

### Community 32 - "routines.ts"
Cohesion: 0.15
Nodes (18): NewRoutineScreen(), getDefaultSetTarget(), addExerciseToRoutine(), clampInt(), createRoutine(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS (+10 more)

### Community 33 - "app/_layout.tsx"
Cohesion: 0.18
Nodes (9): expo-constants, expo-intent-launcher, expo-notifications, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), DATABASE_NAME (+1 more)

### Community 34 - "index.ts"
Cohesion: 0.21
Nodes (10): expo-localization, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 35 - "routine/[id].tsx"
Cohesion: 0.11
Nodes (25): ref_react_native_gesture_handler_reanimatedswipeable, react-native-sortables, EditRoutineScreen(), RoutineDetailScreen(), styles, RoutinesScreen(), styles, useDialog() (+17 more)

### Community 36 - "react-native"
Cohesion: 0.13
Nodes (21): @expo/vector-icons, react-native, SetDraft, styles, DetailModal(), DetailModalProps, styles, ExerciseThumbnailProps (+13 more)

### Community 37 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 38 - "distance.ts"
Cohesion: 0.38
Nodes (11): formatSetValues(), displayToMeters(), distanceUnitLabel(), formatDistance(), formatDistanceValue(), formatDistanceWithUnit(), formatPace(), M_PER_MI (+3 more)

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 40 - "WorkoutShareCard.tsx"
Cohesion: 0.16
Nodes (18): SHARE_CARD_HEIGHT, SHARE_CARD_WIDTH, SHARE_LAYOUTS, ShareLayout, ShareTone, styles, WorkoutShareCardProps, ShareAction (+10 more)

### Community 41 - "share-image.ts"
Cohesion: 0.27
Nodes (10): expo-clipboard, expo-media-library, expo-sharing, react-native-view-shot, capture(), copyShareImage(), saveShareImage(), ShareImageError (+2 more)

### Community 42 - "statistics.tsx"
Cohesion: 0.11
Nodes (28): ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey, StatisticsScreen() (+20 more)

### Community 43 - "jest"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

### Community 44 - "useAppTheme"
Cohesion: 0.15
Nodes (19): expo-router, react-i18next, NewExerciseScreen(), FilterChip(), FilterSection(), TabsLayout(), DangerButton(), DangerButtonProps (+11 more)

### Community 45 - "types.ts"
Cohesion: 0.24
Nodes (9): Achievement, ActiveWorkoutExercise, PersonalRecord, Routine, RoutineExercise, RoutineExerciseSet, RoutineExerciseWithExercise, RoutineWithCount (+1 more)

### Community 46 - "AnvilLogo.tsx"
Cohesion: 0.22
Nodes (8): react-native-svg, AnvilLogo(), AnvilLogoProps, AnvilMark(), AnvilMarkProps, MARK_COLORS, styles, VIEWBOX

### Community 47 - "WorkoutShareCard.test.tsx"
Cohesion: 0.33
Nodes (5): i18next, @testing-library/react-native, exercise(), makeRecap(), RecapExercise

### Community 49 - "add-exercise.tsx"
Cohesion: 0.15
Nodes (21): @bryllim/workout-guide, expo-sqlite, EditExerciseScreen(), styles, AddExerciseScreen(), styles, ExerciseDetailModalProps, deleteExercise() (+13 more)

## Knowledge Gaps
- **683 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+678 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 716 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `index.tsx`, `settings.tsx`, `package.json`, `ExerciseDetailModal.tsx`, `WorkoutTools.tsx`, `AchievementBadge.tsx`, `workout/[id].tsx`, `WeeklyGoalEditor.tsx`, `withAlpha`, `backup-file.ts`, `ExerciseSetEditor.tsx`, `app-theme-provider.tsx`, `WorkoutRecap.tsx`, `[exerciseId].tsx`, `app/_layout.tsx`, `routine/[id].tsx`, `android-navigation-bar.tsx`, `WorkoutShareCard.tsx`, `share-image.ts`, `statistics.tsx`, `useAppTheme`, `AnvilLogo.tsx`, `add-exercise.tsx`?**
  _High betweenness centrality (0.344) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `exercise-metrics.ts`, `index.tsx`, `db/achievements.ts`, `settings.tsx`, `ExerciseDetailModal.tsx`, `WorkoutTools.tsx`, `AchievementBadge.tsx`, `workout/[id].tsx`, `workouts.ts`, `WeeklyGoalEditor.tsx`, `withAlpha`, `ExerciseSetEditor.tsx`, `app-theme-provider.tsx`, `WorkoutRecap.tsx`, `[exerciseId].tsx`, `app/_layout.tsx`, `routine/[id].tsx`, `react-native`, `android-navigation-bar.tsx`, `WorkoutShareCard.tsx`, `share-image.ts`, `statistics.tsx`, `AnvilLogo.tsx`, `add-exercise.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _683 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `exercise-metrics.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14153846153846153 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11384615384615385 - nodes in this community are weakly interconnected._