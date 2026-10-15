# Graph Report - anvil  (2026-10-15)

## Corpus Check
- 132 files · ~144,208 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1358 nodes · 3526 edges · 55 communities (52 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65f4f9a2`
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
- statistics.tsx
- Anvil
- WorkoutTools.tsx
- scripts
- constants/achievements.ts
- index.tsx
- workout/[id].tsx
- AchievementBadge.tsx
- useAppTheme
- routine/[id].tsx
- gamification.ts
- [reId].tsx
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
- BodyWeightDelta.tsx
- add-exercise.tsx
- app/_layout.tsx
- index.ts
- schema.ts
- AppDialog.tsx
- android-navigation-bar.tsx
- AnvilLogo.tsx
- devDependencies
- WorkoutRecap.tsx
- routines.ts
- stats.ts
- WorkoutSharePanel.tsx
- routine-icons.ts
- expo-sqlite
- [exerciseId].tsx
- BodyWeightTrend.tsx
- WorkoutShareCard.test.tsx
- AchievementDetailModal.tsx
- distance.ts
- weight-comparatives.ts
- types.ts
- Screen.tsx
- duration.ts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 113 edges
2. `react-native` - 63 edges
3. `react` - 46 edges
4. `react-i18next` - 45 edges
5. `withAlpha()` - 33 edges
6. `@expo/vector-icons` - 32 edges
7. `expo-sqlite` - 32 edges
8. `WorkoutExerciseScreen()` - 32 edges
9. `useUnitsStore` - 31 edges
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

## Communities (55 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "ExerciseSetEditor.tsx"
Cohesion: 0.12
Nodes (31): ExerciseSetEditor(), ExerciseSetEditorProps, formatReps(), parseNumber(), REST_MAX_SECONDS, REST_STEP_SECONDS, SetCard(), SetCardProps (+23 more)

### Community 2 - "backup.ts"
Cohesion: 0.14
Nodes (21): BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_VERSION, BackupErrorCode, BackupRow, BackupRowValue, BackupTableData, BackupTableName (+13 more)

### Community 3 - "utils/body-weight.ts"
Cohesion: 0.16
Nodes (33): BodyWeightGoalEditor(), GOAL_STEP, styles, BodyWeightHomeCard(), styles, BodyWeightLogField(), styles, useToast() (+25 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.14
Nodes (24): ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS, DistanceAchievementDefinition, DistanceAchievementKind, getEarnedDistanceAchievements() (+16 more)

### Community 6 - "settings.tsx"
Cohesion: 0.13
Nodes (22): zustand, ref_zustand_middleware, SettingsScreen(), styles, SwitchRow(), SwitchRowProps, setAppLanguage(), clampStep() (+14 more)

### Community 7 - "package.json"
Cohesion: 0.06
Nodes (35): main, name, private, version, @bryllim/workout-guide, eslint, eslint-config-expo, expo (+27 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.12
Nodes (18): victory-native, ChartCardProps, getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey, StatTileProps (+10 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (52): assets_audio_rest_finished, expo-audio, SetTimerButton(), formatCountdown(), RestTimer(), RestTimerAlarm(), styles, AdjustButton() (+44 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "constants/achievements.ts"
Cohesion: 0.10
Nodes (26): ACHIEVEMENT_CATEGORY_ORDER, AchievementMetric, AchievementProgress, AchievementScope, AchievementTier, BODY_ACHIEVEMENTS, BODY_GOAL_ACHIEVEMENT_KEYS, computeAchievementProgress() (+18 more)

### Community 13 - "index.tsx"
Cohesion: 0.14
Nodes (28): AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, HeroGlow(), HeroGlowProps (+20 more)

### Community 14 - "workout/[id].tsx"
Cohesion: 0.12
Nodes (35): styles, WorkoutSessionScreen(), formatElapsed(), useElapsedSeconds(), WorkoutElapsedBar(), getExercisesAchievements(), detectAndUnlockSpecials(), getWorkoutRecap() (+27 more)

### Community 15 - "AchievementBadge.tsx"
Cohesion: 0.13
Nodes (14): AchievementBadge(), AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles (+6 more)

### Community 16 - "useAppTheme"
Cohesion: 0.08
Nodes (41): @expo/vector-icons, react, react-i18next, react-native, ref_react_native_gesture_handler_reanimatedswipeable, TabsLayout(), DetailModal(), DetailModalProps (+33 more)

### Community 17 - "routine/[id].tsx"
Cohesion: 0.16
Nodes (23): expo-router, react-native-reanimated, react-native-sortables, EditRoutineScreen(), RoutineDetailScreen(), styles, RoutinesScreen(), styles (+15 more)

### Community 18 - "gamification.ts"
Cohesion: 0.12
Nodes (25): EXERCISE_STAT_ACHIEVEMENTS, unlockAchievementIfNew(), buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests, CardioSetRow, computeCardioPRs() (+17 more)

### Community 19 - "[reId].tsx"
Cohesion: 0.33
Nodes (6): RoutineSetEditorScreen(), SetDraft, styles, SetEditorItem, LoadingOverlay(), getRoutineExercise()

### Community 20 - "backup-file.ts"
Cohesion: 0.15
Nodes (19): expo-document-picker, expo-file-system, BACKUP_APP, BACKUP_TYPE, BackupError, BackupFile, BackupPreferences, buildBackupData() (+11 more)

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "ToastProvider.tsx"
Cohesion: 0.29
Nodes (7): AnimatedPressable, styles, ToastApi, ToastContext, ToastItem, ToastOptions, ToastProvider()

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

### Community 31 - "BodyWeightDelta.tsx"
Cohesion: 0.14
Nodes (18): BodyComparisonLine(), BodyComparisonLineProps, styles, BodyWeightDelta(), BodyWeightDeltaProps, ICONS, styles, BodyWeightGoalEditorProps (+10 more)

### Community 32 - "add-exercise.tsx"
Cohesion: 0.15
Nodes (22): AddExerciseScreen(), FilterChip(), FilterSection(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel(), styles (+14 more)

### Community 33 - "app/_layout.tsx"
Cohesion: 0.17
Nodes (11): expo-constants, expo-intent-launcher, expo-notifications, ref_expo_sqlite_kv_store, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt() (+3 more)

### Community 34 - "index.ts"
Cohesion: 0.21
Nodes (10): expo-localization, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es (+2 more)

### Community 35 - "schema.ts"
Cohesion: 0.12
Nodes (16): MIGRATIONS, SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14, SCHEMA_V15 (+8 more)

### Community 36 - "AppDialog.tsx"
Cohesion: 0.11
Nodes (22): StatTile(), AppDialogProvider(), buttonAppearance(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions (+14 more)

### Community 37 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 38 - "AnvilLogo.tsx"
Cohesion: 0.25
Nodes (7): react-native-svg, AnvilLogo(), AnvilLogoProps, AnvilMarkProps, MARK_COLORS, styles, VIEWBOX

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 40 - "WorkoutRecap.tsx"
Cohesion: 0.22
Nodes (17): AnvilMark(), ShareLayout, styles, WorkoutShareCard(), styles, WorkoutRecapModal(), DetectedPR, UNITS_STORAGE_KEY (+9 more)

### Community 41 - "routines.ts"
Cohesion: 0.18
Nodes (15): getDefaultSetTarget(), addExerciseToRoutine(), clampInt(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS, isTimedTarget(), positiveIntOrNull() (+7 more)

### Community 42 - "stats.ts"
Cohesion: 0.16
Nodes (19): currentBucketIndex(), StatisticsScreen(), addBucket(), BucketGranularity, bucketStart(), buildTimeSeries(), CardioStats, DayCount (+11 more)

### Community 43 - "WorkoutSharePanel.tsx"
Cohesion: 0.16
Nodes (18): expo-clipboard, expo-haptics, expo-media-library, expo-sharing, react-native-view-shot, capture(), copyShareImage(), saveShareImage() (+10 more)

### Community 44 - "routine-icons.ts"
Cohesion: 0.38
Nodes (4): DEFAULT_ROUTINE_GLYPH, GlyphName, ROUTINE_ICONS, RoutineIconDefinition

### Community 45 - "expo-sqlite"
Cohesion: 0.16
Nodes (17): expo-sqlite, EditExerciseScreen(), styles, NewExerciseScreen(), Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps (+9 more)

### Community 46 - "[exerciseId].tsx"
Cohesion: 0.17
Nodes (19): firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), AchievementCardProps, AchievementDetailModalProps, AchievementDefinition (+11 more)

### Community 47 - "BodyWeightTrend.tsx"
Cohesion: 0.18
Nodes (13): dayjs, @shopify/react-native-skia, BodyWeightRange, BodyWeightTrend(), LegendItem(), styles, LineTrendChart(), LineTrendChartProps (+5 more)

### Community 48 - "WorkoutShareCard.test.tsx"
Cohesion: 0.16
Nodes (12): i18next, @testing-library/react-native, exercise(), makeRecap(), WorkoutShareCardProps, WorkoutSharePanelProps, WorkoutRecapModalProps, RecapExercise (+4 more)

### Community 49 - "AchievementDetailModal.tsx"
Cohesion: 0.28
Nodes (11): ref_dayjs_locale_es, AchievementCard(), styles, AchievementDetailModal(), formatNumber(), metricUnit(), styles, ACHIEVEMENT_TIER_COLORS (+3 more)

### Community 50 - "distance.ts"
Cohesion: 0.38
Nodes (11): formatSetValues(), displayToMeters(), distanceUnitLabel(), formatDistance(), formatDistanceValue(), formatDistanceWithUnit(), formatPace(), M_PER_MI (+3 more)

### Community 51 - "weight-comparatives.ts"
Cohesion: 0.20
Nodes (9): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, ACHIEVEMENTS, DISTANCE_ACHIEVEMENTS, ALL_KEYS, getNextWeightComparative(), getVolumeComparison(), VolumeComparison, WEIGHT_COMPARATIVES (+1 more)

### Community 52 - "types.ts"
Cohesion: 0.24
Nodes (9): Achievement, ActiveWorkoutExercise, PersonalRecord, Routine, RoutineExercise, RoutineExerciseSet, RoutineExerciseWithExercise, RoutineWithCount (+1 more)

### Community 53 - "Screen.tsx"
Cohesion: 0.32
Nodes (6): react-native-safe-area-context, NewRoutineScreen(), Screen(), ScreenProps, styles, createRoutine()

### Community 54 - "duration.ts"
Cohesion: 0.57
Nodes (5): DurationInput(), clampDuration(), joinDuration(), MAX_SET_DURATION_SECONDS, splitDuration()

## Knowledge Gaps
- **673 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+668 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 706 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `useAppTheme` to `exercise-frames.ts`, `ExerciseSetEditor.tsx`, `utils/body-weight.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `WorkoutTools.tsx`, `index.tsx`, `workout/[id].tsx`, `AchievementBadge.tsx`, `routine/[id].tsx`, `[reId].tsx`, `backup-file.ts`, `ToastProvider.tsx`, `BodyWeightDelta.tsx`, `add-exercise.tsx`, `app/_layout.tsx`, `AppDialog.tsx`, `android-navigation-bar.tsx`, `AnvilLogo.tsx`, `WorkoutRecap.tsx`, `WorkoutSharePanel.tsx`, `expo-sqlite`, `[exerciseId].tsx`, `BodyWeightTrend.tsx`, `AchievementDetailModal.tsx`, `Screen.tsx`?**
  _High betweenness centrality (0.347) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `ExerciseSetEditor.tsx`, `utils/body-weight.ts`, `settings.tsx`, `statistics.tsx`, `WorkoutTools.tsx`, `index.tsx`, `workout/[id].tsx`, `routine/[id].tsx`, `[reId].tsx`, `ToastProvider.tsx`, `BodyWeightDelta.tsx`, `add-exercise.tsx`, `app/_layout.tsx`, `AppDialog.tsx`, `android-navigation-bar.tsx`, `AnvilLogo.tsx`, `WorkoutRecap.tsx`, `stats.ts`, `WorkoutSharePanel.tsx`, `expo-sqlite`, `[exerciseId].tsx`, `BodyWeightTrend.tsx`, `AchievementDetailModal.tsx`, `Screen.tsx`, `duration.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _673 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `ExerciseSetEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12477718360071301 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._