# Graph Report - anvil  (2026-10-13)

## Corpus Check
- 104 files · ~128,631 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1199 nodes · 2810 edges · 44 communities (41 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc67ffe4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- [exerciseId].tsx
- backup.ts
- AchievementDetailModal.tsx
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- statistics.tsx
- Anvil
- WorkoutTools.tsx
- scripts
- gamification.ts
- index.tsx
- devDependencies
- constants/achievements.ts
- ExerciseSetEditor.tsx
- routine/[id].tsx
- routines.ts
- add-exercise.tsx
- AchievementBadge.tsx
- tsconfig.json
- generate-icons.mjs
- [reId].tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- jest
- app.config.js
- README npm scripts
- app/_layout.tsx
- useAppTheme
- withAlpha
- android-navigation-bar.tsx
- RestTimer.tsx
- backup-file.ts
- schema.ts
- index.ts
- workout-tools.ts
- workout-goals.ts
- distance.ts
- MuscleDonut.tsx
- AndroidExactAlarmPermissionPrompt.tsx

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 87 edges
2. `react-native` - 49 edges
3. `react` - 34 edges
4. `react-i18next` - 34 edges
5. `WorkoutExerciseScreen()` - 31 edges
6. `expo-sqlite` - 28 edges
7. `withAlpha()` - 25 edges
8. `@expo/vector-icons` - 24 edges
9. `useFocusQuery()` - 23 edges
10. `WorkoutSessionScreen()` - 22 edges

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
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "[exerciseId].tsx"
Cohesion: 0.05
Nodes (70): firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), WorkoutSessionScreen(), ExerciseSetEditor(), SetCardProps (+62 more)

### Community 2 - "backup.ts"
Cohesion: 0.12
Nodes (24): BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE, BACKUP_VERSION, BackupErrorCode, BackupFile, BackupPreferences (+16 more)

### Community 3 - "AchievementDetailModal.tsx"
Cohesion: 0.18
Nodes (22): AchievementCard(), AchievementCardProps, styles, AchievementDetailModal(), AchievementDetailModalProps, formatNumber(), metricUnit(), styles (+14 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.12
Nodes (29): AchievementTier, computeExerciseAchievementProgress(), EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS (+21 more)

### Community 6 - "settings.tsx"
Cohesion: 0.18
Nodes (17): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, setAppLanguage(), clampStep(), formatWeightStep(), useWeightStepStore (+9 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (39): main, name, private, version, @bryllim/workout-guide, eslint, eslint-config-expo, expo (+31 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.11
Nodes (30): dayjs, ref_dayjs_locale_es, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS (+22 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.15
Nodes (23): SetTimerButton(), AdjustButton(), AdjustButtonProps, ControlRow(), ControlRowProps, formatStopwatch(), formatTimer(), StopwatchPanel() (+15 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "gamification.ts"
Cohesion: 0.10
Nodes (33): WorkoutRecapModalProps, getDistanceAchievementByKey(), getNextWeightComparative(), getWeightComparativeByKey(), WeightComparativeDefinition, unlockAchievementIfNew(), buildCardioBests(), buildHistoryBests() (+25 more)

### Community 13 - "index.tsx"
Cohesion: 0.18
Nodes (23): AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, AchievementBadge(), styles (+15 more)

### Community 14 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 15 - "constants/achievements.ts"
Cohesion: 0.12
Nodes (18): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, BadgeGlyph, BadgeGlyphName, CATEGORY_GLYPHS, getBadgeGlyph(), GLYPHS, ACHIEVEMENT_CATEGORY_ORDER, AchievementCategory (+10 more)

### Community 16 - "ExerciseSetEditor.tsx"
Cohesion: 0.19
Nodes (18): expo-haptics, DurationInput(), ExerciseSetEditorProps, formatReps(), formatSetValues(), parseNumber(), REST_MAX_SECONDS, REST_STEP_SECONDS (+10 more)

### Community 17 - "routine/[id].tsx"
Cohesion: 0.12
Nodes (30): expo-router, react-native-reanimated, react-native-sortables, EditExerciseScreen(), styles, EditRoutineScreen(), styles, RoutineSetEditorScreen() (+22 more)

### Community 18 - "routines.ts"
Cohesion: 0.11
Nodes (24): react-native-safe-area-context, NewExerciseScreen(), NewRoutineScreen(), ExerciseForm(), Screen(), ScreenProps, styles, getDefaultSetTarget() (+16 more)

### Community 19 - "add-exercise.tsx"
Cohesion: 0.11
Nodes (29): expo-sqlite, AddExerciseScreen(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel(), styles, Chip() (+21 more)

### Community 20 - "AchievementBadge.tsx"
Cohesion: 0.22
Nodes (7): AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "[reId].tsx"
Cohesion: 0.15
Nodes (14): react-i18next, SetDraft, styles, DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions (+6 more)

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
Cohesion: 0.21
Nodes (11): expo-status-bar, react-native-gesture-handler, RootNavigator(), NotificationPermissionPrompt(), seedAchievements(), DATABASE_NAME, initializeDatabase(), migrateDbIfNeeded() (+3 more)

### Community 32 - "useAppTheme"
Cohesion: 0.08
Nodes (47): @expo/vector-icons, react, react-native, ref_react_native_gesture_handler_reanimatedswipeable, react-native-svg, FilterChip(), FilterSection(), styles (+39 more)

### Community 33 - "withAlpha"
Cohesion: 0.10
Nodes (22): @shopify/react-native-skia, StatTile(), AppDialogProvider(), buttonAppearance(), toneColor(), BarTrendChart(), BarTrendChartProps, BarTrendPoint (+14 more)

### Community 34 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 35 - "RestTimer.tsx"
Cohesion: 0.23
Nodes (16): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, WorkoutTimerAlarm(), ALARM_DURATION_MS (+8 more)

### Community 36 - "backup-file.ts"
Cohesion: 0.20
Nodes (15): expo-document-picker, expo-file-system, expo-sharing, BackupError, buildBackupData(), assertNotWeb(), clearPreferences(), eraseAllData() (+7 more)

### Community 37 - "schema.ts"
Cohesion: 0.13
Nodes (14): MIGRATIONS, SCHEMA_V1, SCHEMA_V10, SCHEMA_V11, SCHEMA_V12, SCHEMA_V13, SCHEMA_V2, SCHEMA_V3 (+6 more)

### Community 38 - "index.ts"
Cohesion: 0.19
Nodes (11): expo-localization, i18next, AppLanguage, detectInitialLanguage(), isAppLanguage(), resetAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en (+3 more)

### Community 39 - "workout-tools.ts"
Cohesion: 0.15
Nodes (12): initialStopwatch, initialTimer, RestState, SetTimerState, StopwatchState, TIMER_ADJUST_SECONDS, TIMER_DEFAULT_SECONDS, TIMER_MAX_SECONDS (+4 more)

### Community 40 - "workout-goals.ts"
Cohesion: 0.20
Nodes (10): ref_expo_sqlite_kv_store, zustand, ref_zustand_middleware, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN, WEEKLY_WORKOUTS_STORAGE_KEY, WeeklyGoalState, THEME_STORAGE_KEY (+2 more)

### Community 41 - "distance.ts"
Cohesion: 0.45
Nodes (9): displayToMeters(), distanceUnitLabel(), formatDistance(), formatDistanceWithUnit(), formatPace(), M_PER_MI, M_PER_YD, metersPerUnit() (+1 more)

### Community 42 - "MuscleDonut.tsx"
Cohesion: 0.33
Nodes (5): victory-native, DonutSlice, MuscleDonut(), MuscleDonutProps, styles

### Community 43 - "AndroidExactAlarmPermissionPrompt.tsx"
Cohesion: 0.40
Nodes (4): expo-constants, expo-intent-launcher, expo-notifications, AndroidExactAlarmPermissionPrompt()

## Knowledge Gaps
- **645 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+640 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 673 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `useAppTheme` to `exercise-frames.ts`, `[exerciseId].tsx`, `AchievementDetailModal.tsx`, `settings.tsx`, `package.json`, `statistics.tsx`, `WorkoutTools.tsx`, `index.tsx`, `ExerciseSetEditor.tsx`, `routine/[id].tsx`, `routines.ts`, `add-exercise.tsx`, `AchievementBadge.tsx`, `[reId].tsx`, `withAlpha`, `android-navigation-bar.tsx`, `RestTimer.tsx`, `backup-file.ts`, `MuscleDonut.tsx`, `AndroidExactAlarmPermissionPrompt.tsx`?**
  _High betweenness centrality (0.379) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `add-exercise.tsx` to `useAppTheme`, `[exerciseId].tsx`, `backup.ts`, `backup-file.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `gamification.ts`, `routine/[id].tsx`, `routines.ts`, `[reId].tsx`, `app/_layout.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _645 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `[exerciseId].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05246913580246913 - nodes in this community are weakly interconnected._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11692307692307692 - nodes in this community are weakly interconnected._