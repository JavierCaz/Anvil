# Graph Report - anvil  (2026-10-15)

## Corpus Check
- 132 files · ~144,985 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1358 nodes · 3533 edges · 47 communities (44 shown, 3 thin omitted)
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
- workouts.ts
- HomeScreen
- react-native
- routine/[id].tsx
- gamification.ts
- database.ts
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
- add-exercise.tsx
- app/_layout.tsx
- index.ts
- schema.ts
- AppDialog.tsx
- android-navigation-bar.tsx
- devDependencies
- WorkoutShareCard.tsx
- stats.ts
- WorkoutSharePanel.tsx
- useAppTheme
- ExerciseForm.tsx
- [exerciseId].tsx
- withAlpha
- workout/[id].tsx
- weight-comparatives.ts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 113 edges
2. `react-native` - 63 edges
3. `react` - 46 edges
4. `react-i18next` - 45 edges
5. `withAlpha()` - 33 edges
6. `@expo/vector-icons` - 32 edges
7. `expo-sqlite` - 32 edges
8. `WorkoutExerciseScreen()` - 32 edges
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

## Communities (47 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (303): EXERCISE_FRAMES, frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up (+295 more)

### Community 1 - "ExerciseSetEditor.tsx"
Cohesion: 0.09
Nodes (48): RoutineSetEditorScreen(), DurationInput(), ExerciseSetEditor(), ExerciseSetEditorProps, formatReps(), formatSetValues(), parseNumber(), REST_MAX_SECONDS (+40 more)

### Community 2 - "backup.ts"
Cohesion: 0.13
Nodes (22): BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_VERSION, BackupErrorCode, BackupRow, BackupRowValue, BackupTableData (+14 more)

### Community 3 - "utils/body-weight.ts"
Cohesion: 0.08
Nodes (66): dayjs, BodyComparisonLine(), BodyComparisonLineProps, styles, BodyWeightDelta(), BodyWeightDeltaProps, ICONS, styles (+58 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.11
Nodes (26): computeAchievementProgress(), computeExerciseAchievementProgress(), EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS (+18 more)

### Community 6 - "settings.tsx"
Cohesion: 0.13
Nodes (23): zustand, ref_zustand_middleware, SettingsScreen(), styles, SwitchRow(), SwitchRowProps, resetAppLanguage(), setAppLanguage() (+15 more)

### Community 7 - "package.json"
Cohesion: 0.06
Nodes (34): main, name, private, version, eslint, eslint-config-expo, expo, expo-application (+26 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.13
Nodes (15): victory-native, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey (+7 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.08
Nodes (52): assets_audio_rest_finished, expo-audio, expo-notifications, SetTimerButton(), formatCountdown(), RestTimer(), RestTimerAlarm(), styles (+44 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "constants/achievements.ts"
Cohesion: 0.12
Nodes (18): AchievementCardProps, AchievementDetailModalProps, ACHIEVEMENT_CATEGORY_ORDER, AchievementDefinition, AchievementMetric, AchievementProgress, AchievementScope, AchievementTier (+10 more)

### Community 13 - "index.tsx"
Cohesion: 0.13
Nodes (17): HomeData, styles, AnvilLogo(), ProgressBar(), ProgressBarProps, styles, WeeklyGoalEditor(), styles (+9 more)

### Community 14 - "workouts.ts"
Cohesion: 0.06
Nodes (53): NewRoutineScreen(), WorkoutSessionScreen(), formatElapsed(), useElapsedSeconds(), WorkoutElapsedBar(), getDefaultSetTarget(), addExerciseToRoutine(), clampInt() (+45 more)

### Community 15 - "HomeScreen"
Cohesion: 0.26
Nodes (12): AchievementsScreen(), getMonday(), HomeScreen(), getAchievementExerciseMeta(), getAchievements(), getAllExerciseUnlocks(), getBodyWeights(), unlockEarnedAchievements() (+4 more)

### Community 16 - "react-native"
Cohesion: 0.13
Nodes (21): react-native, SetDraft, styles, DetailModal(), DetailModalProps, styles, GoalToggleButton(), GoalToggleButtonProps (+13 more)

### Community 17 - "routine/[id].tsx"
Cohesion: 0.14
Nodes (24): expo-sqlite, ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, EditRoutineScreen(), RoutineDetailScreen(), styles, RoutinesScreen() (+16 more)

### Community 18 - "gamification.ts"
Cohesion: 0.12
Nodes (30): unlockAchievementIfNew(), unlockExerciseAchievement(), buildCardioBests(), buildHistoryBests(), buildSessionAggregates(), CardioBests, CardioSetRow, computeCardioPRs() (+22 more)

### Community 19 - "database.ts"
Cohesion: 0.39
Nodes (8): backfillPerExerciseAchievements(), reconcileExerciseAchievements(), revokeUnsupported(), seedAchievements(), initializeDatabase(), migrateDbIfNeeded(), seedExerciseCatalog(), deleteOrphanedSets()

### Community 20 - "backup-file.ts"
Cohesion: 0.16
Nodes (18): expo-document-picker, expo-file-system, BACKUP_TYPE, BackupError, BackupFile, BackupPreferences, buildBackupData(), assertNotWeb() (+10 more)

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

### Community 32 - "add-exercise.tsx"
Cohesion: 0.13
Nodes (25): @bryllim/workout-guide, AddExerciseScreen(), FilterChip(), FilterSection(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel() (+17 more)

### Community 33 - "app/_layout.tsx"
Cohesion: 0.18
Nodes (9): expo-constants, expo-intent-launcher, ref_expo_sqlite_kv_store, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), DATABASE_NAME (+1 more)

### Community 34 - "index.ts"
Cohesion: 0.22
Nodes (9): expo-localization, AppLanguage, detectInitialLanguage(), isAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es, flattenKeys() (+1 more)

### Community 35 - "schema.ts"
Cohesion: 0.12
Nodes (16): MIGRATIONS, SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V14, SCHEMA_V15 (+8 more)

### Community 36 - "AppDialog.tsx"
Cohesion: 0.14
Nodes (15): EditExerciseScreen(), styles, DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions, DialogTone (+7 more)

### Community 37 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 40 - "WorkoutShareCard.tsx"
Cohesion: 0.07
Nodes (51): ref_dayjs_locale_es, i18next, react-native-svg, @testing-library/react-native, AchievementBadge(), AchievementBadgeProps, FACE, Finish (+43 more)

### Community 42 - "stats.ts"
Cohesion: 0.17
Nodes (18): StatisticsScreen(), addBucket(), BucketGranularity, bucketStart(), buildTimeSeries(), CardioStats, DayCount, getCardioDayDistances() (+10 more)

### Community 43 - "WorkoutSharePanel.tsx"
Cohesion: 0.15
Nodes (19): expo-clipboard, expo-haptics, expo-media-library, expo-sharing, react-native-view-shot, capture(), copyShareImage(), saveShareImage() (+11 more)

### Community 44 - "useAppTheme"
Cohesion: 0.17
Nodes (15): @expo/vector-icons, CarouselArrow(), RoutineForm(), RoutineFormProps, styles, RoutineHeaderTitle(), RoutineHeaderTitleProps, styles (+7 more)

### Community 45 - "ExerciseForm.tsx"
Cohesion: 0.22
Nodes (9): NewExerciseScreen(), Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps, styles, EXERCISE_TYPE_I18N_KEYS, MUSCLE_I18N_KEYS (+1 more)

### Community 46 - "[exerciseId].tsx"
Cohesion: 0.22
Nodes (15): firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), SetEditorItem, getExerciseAchievements(), getExerciseAchievementUnlockedAt() (+7 more)

### Community 47 - "withAlpha"
Cohesion: 0.12
Nodes (18): @shopify/react-native-skia, StatTile(), AppDialogProvider(), buttonAppearance(), toneColor(), BarTrendChart(), BarTrendChartProps, BarTrendPoint (+10 more)

### Community 49 - "workout/[id].tsx"
Cohesion: 0.13
Nodes (20): expo-router, react, react-i18next, styles, TabsLayout(), styles, AchievementCard(), styles (+12 more)

### Community 51 - "weight-comparatives.ts"
Cohesion: 0.12
Nodes (16): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, BadgeGlyph, BadgeGlyphName, CATEGORY_GLYPHS, getBadgeGlyph(), GLYPHS, AchievementCategory, ACHIEVEMENTS (+8 more)

## Knowledge Gaps
- **673 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+668 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 706 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `ExerciseSetEditor.tsx`, `utils/body-weight.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `WorkoutTools.tsx`, `index.tsx`, `routine/[id].tsx`, `backup-file.ts`, `ToastProvider.tsx`, `add-exercise.tsx`, `app/_layout.tsx`, `AppDialog.tsx`, `android-navigation-bar.tsx`, `WorkoutShareCard.tsx`, `WorkoutSharePanel.tsx`, `useAppTheme`, `ExerciseForm.tsx`, `[exerciseId].tsx`, `withAlpha`, `workout/[id].tsx`?**
  _High betweenness centrality (0.347) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `ExerciseSetEditor.tsx`, `utils/body-weight.ts`, `settings.tsx`, `statistics.tsx`, `WorkoutTools.tsx`, `index.tsx`, `workouts.ts`, `HomeScreen`, `react-native`, `routine/[id].tsx`, `ToastProvider.tsx`, `add-exercise.tsx`, `app/_layout.tsx`, `AppDialog.tsx`, `android-navigation-bar.tsx`, `WorkoutShareCard.tsx`, `stats.ts`, `WorkoutSharePanel.tsx`, `ExerciseForm.tsx`, `[exerciseId].tsx`, `withAlpha`, `workout/[id].tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _673 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006578947368421052 - nodes in this community are weakly interconnected._
- **Should `ExerciseSetEditor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09225589225589226 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._