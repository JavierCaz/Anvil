# Graph Report - anvil  (2026-10-16)

## Corpus Check
- 132 files · ~145,185 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 1357 nodes · 3532 edges · 38 communities (35 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `68023858`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- exercise-frames.ts
- [exerciseId].tsx
- backup-file.ts
- react-i18next
- dependencies
- db/achievements.ts
- settings.tsx
- package.json
- RestTimer.tsx
- Anvil
- WorkoutTools.tsx
- scripts
- constants/achievements.ts
- index.tsx
- workout/[id].tsx
- WeeklyGoalEditor.tsx
- useAppTheme
- weight-comparatives.ts
- tsconfig.json
- generate-icons.mjs
- ToastProvider.tsx
- Strict TypeScript
- Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms
- eslint.config.js
- android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)
- app.config.js
- README npm scripts
- routines.ts
- useDialog
- index.ts
- app-theme-provider.tsx
- android-navigation-bar.tsx
- devDependencies
- WorkoutShareCard.tsx
- statistics.tsx
- react-native
- react
- AchievementBadge.tsx

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

## Communities (38 total, 3 thin omitted)

### Community 0 - "exercise-frames.ts"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "[exerciseId].tsx"
Cohesion: 0.06
Nodes (81): ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, RoutineSetEditorScreen(), SetDraft, styles, RoutineDetailScreen(), styles (+73 more)

### Community 2 - "backup-file.ts"
Cohesion: 0.05
Nodes (61): expo-document-picker, expo-file-system, seedAchievements(), BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES, BACKUP_TYPE, BACKUP_VERSION (+53 more)

### Community 3 - "react-i18next"
Cohesion: 0.08
Nodes (70): dayjs, react-i18next, BodyComparisonLine(), BodyComparisonLineProps, styles, BodyWeightDelta(), BodyWeightDeltaProps, ICONS (+62 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (54): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+46 more)

### Community 5 - "db/achievements.ts"
Cohesion: 0.11
Nodes (26): computeAchievementProgress(), computeExerciseAchievementProgress(), EXERCISE_STAT_ACHIEVEMENTS, ExerciseAchievementStats, DISTANCE_EFFORT_KEY_PREFIX, DISTANCE_EFFORTS, DISTANCE_LANDMARK_KEY_PREFIX, DISTANCE_LANDMARKS (+18 more)

### Community 6 - "settings.tsx"
Cohesion: 0.17
Nodes (18): SettingsScreen(), styles, SwitchRow(), SwitchRowProps, resetAppLanguage(), setAppLanguage(), clampStep(), formatWeightStep() (+10 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (36): jest, preset, transformIgnorePatterns, main, name, private, version, eslint (+28 more)

### Community 8 - "RestTimer.tsx"
Cohesion: 0.23
Nodes (16): assets_audio_rest_finished, expo-audio, formatCountdown(), RestTimer(), RestTimerAlarm(), styles, WorkoutTimerAlarm(), ALARM_DURATION_MS (+8 more)

### Community 9 - "Anvil"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "WorkoutTools.tsx"
Cohesion: 0.11
Nodes (33): SetTimerButton(), AdjustButtonProps, ControlRowProps, formatStopwatch(), formatTimer(), StopwatchPanel(), styles, TimerPanel() (+25 more)

### Community 11 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, build:all, build:android, build:ios, icons, ios, lint (+4 more)

### Community 12 - "constants/achievements.ts"
Cohesion: 0.17
Nodes (15): AchievementProgress, AchievementScope, AchievementTier, EXERCISE_METRIC_READERS, getAchievementByKey(), METRIC_READERS, normalizeBodyComparative(), normalizeDistanceAchievement() (+7 more)

### Community 13 - "index.tsx"
Cohesion: 0.19
Nodes (19): AchievementsScreen(), getMonday(), HomeData, HomeScreen(), styles, WeeklyGoalEditor(), styles, WeekDayItem (+11 more)

### Community 14 - "workout/[id].tsx"
Cohesion: 0.05
Nodes (74): styles, WorkoutSessionScreen(), WorkoutSharePanelProps, formatElapsed(), styles, useElapsedSeconds(), WorkoutElapsedBar(), WorkoutElapsedBarProps (+66 more)

### Community 15 - "WeeklyGoalEditor.tsx"
Cohesion: 0.15
Nodes (13): zustand, ref_zustand_middleware, StepIcon(), StepIconProps, styles, styles, WEEKLY_WORKOUTS_MAX, WEEKLY_WORKOUTS_MIN (+5 more)

### Community 16 - "useAppTheme"
Cohesion: 0.12
Nodes (18): @expo/vector-icons, react-native-safe-area-context, TabsLayout(), LegendItem(), DetailModal(), DetailModalProps, styles, GoalToggleButton() (+10 more)

### Community 17 - "weight-comparatives.ts"
Cohesion: 0.32
Nodes (6): getNextWeightComparative(), getVolumeComparison(), getWeightComparativeByKey(), getWeightComparativesAtOrBelow(), VolumeComparison, WEIGHT_COMPARATIVES

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

### Community 32 - "routines.ts"
Cohesion: 0.05
Nodes (63): @bryllim/workout-guide, expo-image, expo-sqlite, EditExerciseScreen(), styles, NewExerciseScreen(), AddExerciseScreen(), FilterChip() (+55 more)

### Community 33 - "useDialog"
Cohesion: 0.18
Nodes (12): expo-constants, expo-intent-launcher, expo-notifications, ref_expo_sqlite_kv_store, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt() (+4 more)

### Community 34 - "index.ts"
Cohesion: 0.22
Nodes (9): expo-localization, AppLanguage, detectInitialLanguage(), isAppLanguage(), SUPPORTED_LANGUAGES, src_i18n_locales_en, src_i18n_locales_es, flattenKeys() (+1 more)

### Community 36 - "app-theme-provider.tsx"
Cohesion: 0.11
Nodes (23): StatTile(), AppDialogProvider(), buttonAppearance(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions (+15 more)

### Community 37 - "android-navigation-bar.tsx"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 39 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+3 more)

### Community 40 - "WorkoutShareCard.tsx"
Cohesion: 0.06
Nodes (63): ref_dayjs_locale_es, expo-clipboard, expo-haptics, expo-media-library, expo-sharing, i18next, react-native-view-shot, @testing-library/react-native (+55 more)

### Community 42 - "statistics.tsx"
Cohesion: 0.08
Nodes (38): @shopify/react-native-skia, victory-native, ChartCardProps, currentBucketIndex(), getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS (+30 more)

### Community 44 - "react-native"
Cohesion: 0.17
Nodes (13): react-native, CarouselArrow(), RoutineForm(), RoutineFormProps, styles, RoutineHeaderTitle(), RoutineHeaderTitleProps, styles (+5 more)

### Community 49 - "react"
Cohesion: 0.12
Nodes (22): expo-router, react, react-native-svg, styles, RoutinesScreen(), styles, HeroGlow(), HeroGlowProps (+14 more)

### Community 51 - "AchievementBadge.tsx"
Cohesion: 0.10
Nodes (17): ref_expo_vector_icons_build_vendor_react_native_vector_icons_glyphmaps_materialcommunityicons_json, AchievementBadgeProps, FACE, Finish, FINISHES, INNER, OUTER, styles (+9 more)

## Knowledge Gaps
- **673 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+668 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 706 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `react-native` to `exercise-frames.ts`, `[exerciseId].tsx`, `backup-file.ts`, `react-i18next`, `settings.tsx`, `package.json`, `RestTimer.tsx`, `WorkoutTools.tsx`, `index.tsx`, `workout/[id].tsx`, `WeeklyGoalEditor.tsx`, `useAppTheme`, `ToastProvider.tsx`, `routines.ts`, `useDialog`, `app-theme-provider.tsx`, `android-navigation-bar.tsx`, `WorkoutShareCard.tsx`, `statistics.tsx`, `react`, `AchievementBadge.tsx`?**
  _High betweenness centrality (0.347) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `useAppTheme()` connect `useAppTheme` to `routines.ts`, `[exerciseId].tsx`, `useDialog`, `react-i18next`, `app-theme-provider.tsx`, `android-navigation-bar.tsx`, `settings.tsx`, `WorkoutShareCard.tsx`, `RestTimer.tsx`, `statistics.tsx`, `WorkoutTools.tsx`, `react-native`, `index.tsx`, `workout/[id].tsx`, `WeeklyGoalEditor.tsx`, `react`, `ToastProvider.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _673 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `exercise-frames.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `[exerciseId].tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05628002745367193 - nodes in this community are weakly interconnected._
- **Should `backup-file.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.052917232021709636 - nodes in this community are weakly interconnected._