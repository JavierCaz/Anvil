# Graph Report - anvil  (2026-10-13)

## Corpus Check
- 93 files · ~167,610 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1122 nodes · 2483 edges · 34 communities (31 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5b8a09f7`
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
- workout-tools.ts
- RestTimer.tsx
- devDependencies
- ExerciseSetEditor.tsx
- routines.ts
- routine/[id].tsx
- [reId].tsx
- add-exercise.tsx
- ExerciseForm.tsx
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
- exercise-metrics.ts
- react-i18next
- useAppTheme

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 79 edges
2. `react-native` - 40 edges
3. `react-i18next` - 33 edges
4. `WorkoutExerciseScreen()` - 30 edges
5. `expo-sqlite` - 28 edges
6. `react` - 27 edges
7. `useFocusQuery()` - 23 edges
8. `WorkoutSessionScreen()` - 21 edges
9. `useDialog()` - 21 edges
10. `getAchievementByKey()` - 20 edges

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

## Communities (34 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "workout/[id].tsx"
Cohesion: 0.06
Nodes (69): styles, WorkoutSessionScreen(), formatElapsed(), styles, useElapsedSeconds(), WorkoutElapsedBar(), WorkoutElapsedBarProps, WorkoutRecapModalProps (+61 more)

### Community 2 - "backup-file.ts"
Cohesion: 0.06
Nodes (57): expo-document-picker, expo-file-system, expo-sharing, seedAchievements(), BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE (+49 more)

### Community 3 - "[exerciseId].tsx"
Cohesion: 0.10
Nodes (49): firstIncompleteSet(), SetDraft, shiftMapDown(), styles, WorkoutExerciseScreen(), AchievementCard(), AchievementCardProps, styles (+41 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+45 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.06
Nodes (65): AchievementsScreen(), styles, getMonday(), HomeData, HomeScreen(), styles, styles, WeekDayItem (+57 more)

### Community 6 - "settings.tsx"
Cohesion: 0.08
Nodes (38): expo-localization, ref_expo_sqlite_kv_store, i18next, zustand, ref_zustand_middleware, SettingsScreen(), styles, SwitchRow() (+30 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (40): main, name, private, version, @bryllim/workout-guide, eslint, eslint-config-expo, expo (+32 more)

### Community 8 - "statistics.tsx"
Cohesion: 0.11
Nodes (28): dayjs, ref_dayjs_locale_es, victory-native, getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey (+20 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.18
Nodes (18): AdjustButton(), AdjustButtonProps, ControlRow(), ControlRowProps, formatStopwatch(), formatTimer(), StopwatchPanel(), styles (+10 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "workout-tools.ts"
Cohesion: 0.13
Nodes (18): SetTimerButton(), clampDuration(), getSetTimerElapsedSeconds(), getTimerRemainingMs(), initialStopwatch, initialTimer, RestState, SetTimerState (+10 more)

### Community 13 - "RestTimer.tsx"
Cohesion: 0.23
Nodes (16): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, WorkoutTimerAlarm(), ALARM_DURATION_MS (+8 more)

### Community 14 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 15 - "ExerciseSetEditor.tsx"
Cohesion: 0.18
Nodes (15): expo-haptics, DurationInput(), ExerciseSetEditorProps, formatReps(), REST_MAX_SECONDS, REST_STEP_SECONDS, SetCardProps, SetEditorItem (+7 more)

### Community 16 - "routines.ts"
Cohesion: 0.16
Nodes (16): getDefaultSetTarget(), addExerciseToRoutine(), clampInt(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS, isTimedTarget(), positiveIntOrNull() (+8 more)

### Community 17 - "routine/[id].tsx"
Cohesion: 0.15
Nodes (23): @expo/vector-icons, ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, EditRoutineScreen(), styles, RoutineDetailScreen(), styles (+15 more)

### Community 18 - "[reId].tsx"
Cohesion: 0.14
Nodes (22): expo-router, expo-sqlite, EditExerciseScreen(), styles, NewExerciseScreen(), RoutineSetEditorScreen(), SetDraft, styles (+14 more)

### Community 19 - "add-exercise.tsx"
Cohesion: 0.19
Nodes (17): AddExerciseScreen(), FilterChip(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel(), styles, ExerciseThumbnail() (+9 more)

### Community 20 - "ExerciseForm.tsx"
Cohesion: 0.29
Nodes (6): Chip(), EXERCISE_TYPES, ExerciseFormProps, styles, EXERCISE_TYPE_I18N_KEYS, MUSCLE_I18N_KEYS

### Community 21 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "generate-icons.mjs"
Cohesion: 0.10
Nodes (18): ref_node_child_process, ref_node_fs, ref_node_os, ref_node_path, ref_node_url, entries, lines, manifest (+10 more)

### Community 23 - "app-theme-provider.tsx"
Cohesion: 0.08
Nodes (34): expo-constants, expo-intent-launcher, expo-navigation-bar, expo-notifications, expo-status-bar, expo-system-ui, react, react-native (+26 more)

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

### Community 31 - "exercise-metrics.ts"
Cohesion: 0.23
Nodes (15): ExerciseSetEditor(), DefaultSetTarget, DISTANCE_DURATION, distanceScale, distanceStep(), DURATION, durationStepSeconds(), FREE_WEIGHT_EQUIPMENT (+7 more)

### Community 32 - "react-i18next"
Cohesion: 0.36
Nodes (6): react-i18next, NewRoutineScreen(), RoutineForm(), RoutineFormProps, styles, createRoutine()

### Community 33 - "useAppTheme"
Cohesion: 0.13
Nodes (16): react-native-safe-area-context, TabsLayout(), DetailModal(), DetailModalProps, styles, LoadingOverlay(), LoadingOverlayProps, styles (+8 more)

## Knowledge Gaps
- **613 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+608 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 639 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `app-theme-provider.tsx` to `react-i18next`, `workout/[id].tsx`, `useAppTheme`, `[exerciseId].tsx`, `exercise-frames.ts`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `backup-file.ts`, `WorkoutTools.tsx`, `RestTimer.tsx`, `ExerciseSetEditor.tsx`, `routine/[id].tsx`, `[reId].tsx`, `add-exercise.tsx`, `ExerciseForm.tsx`?**
  _High betweenness centrality (0.376) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `[reId].tsx` to `react-i18next`, `workout/[id].tsx`, `backup-file.ts`, `[exerciseId].tsx`, `db/achievements.ts`, `settings.tsx`, `package.json`, `statistics.tsx`, `routines.ts`, `routine/[id].tsx`, `add-exercise.tsx`, `app-theme-provider.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _613 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `workout/[id].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05700852189244784 - nodes in this community are weakly interconnected._
- **Should `backup-file.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05734767025089606 - nodes in this community are weakly interconnected._