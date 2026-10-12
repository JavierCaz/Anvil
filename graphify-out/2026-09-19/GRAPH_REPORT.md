# Graph Report - anvil  (2026-09-19)

## Corpus Check
- 89 files · ~85,145 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 985 nodes · 2009 edges · 31 communities (29 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.84)
- Token cost: 1,450 input · 1,250 output

## Community Hubs (Navigation)
- Exercise Frame Assets
- Workout Logging & Gamification
- Database Schema & Backup
- Workout Exercise Logging UI
- NPM Dependencies
- Achievements System
- Settings, Stores & Persistence
- Package Manifest
- Statistics & Analytics
- Project Documentation & Architecture
- Routines Management
- Dev Dependencies & Tooling
- Shared UI Components & Theme
- Exercise Detail & Library UI
- Routine Detail UI & Primitives
- Theme & Dialog System
- Exercise CRUD
- App Shell & Notifications
- Screen & Routine Forms
- Exercise Form & Constants
- Rest Timer & Audio
- TypeScript Configuration
- Exercise Frame Generation Script
- Android Navigation Bar
- Development Conventions
- Brand Iconography
- ESLint Configuration
- App Icon Layer Assets
- Jest Configuration
- App Config Variants
- README Scripts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 68 edges
2. `react-native` - 37 edges
3. `react-i18next` - 31 edges
4. `expo-sqlite` - 29 edges
5. `react` - 26 edges
6. `WorkoutExerciseScreen()` - 22 edges
7. `useDialog()` - 21 edges
8. `WorkoutSessionScreen()` - 19 edges
9. `expo-router` - 18 edges
10. `getAchievementByKey()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Anvil app` --semantically_similar_to--> `Anvil`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `expo-router` --semantically_similar_to--> `expo-router file-based navigation`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Zustand` --semantically_similar_to--> `Zustand state management`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Strict TypeScript in README` --semantically_similar_to--> `Strict TypeScript`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `README path aliases` --semantically_similar_to--> `Path aliases @/* and @/assets/*`  [INFERRED] [semantically similar]
  README.md → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Anvil technology stack** — agents_expo_sdk_57, agents_expo_router, agents_zustand, agents_expo_sqlite, agents_app_config [EXTRACTED 1.00]
- **Anvil MVP core features** — agents_workout_management, agents_progress_tracking, agents_gamification, agents_fun_comparisons, agents_data_privacy [EXTRACTED 1.00]
- **Quality gates enforced before completion** — agents_testing, agents_verification, agents_typescript [INFERRED 0.85]
- **Anvil app icon asset set — iOS icon layer stack (expo-symbol 2 + grid) and Android adaptive icon layers (foreground + background)** — assets_expo_icon_assets_expo_symbol_2, assets_expo_icon_assets_grid, assets_images_android_icon_background, assets_images_android_icon_foreground [INFERRED 0.75]
- **Anvil cross-platform app icon set sharing the blue/white chevron 'A' brand mark** — assets_images_icon_anvil_mark, assets_images_splash_icon_anvil_mark, assets_images_android_icon_monochrome_anvil_mark, assets_images_favicon_anvil_mark [INFERRED 0.85]

## Communities (31 total, 2 thin omitted)

### Community 0 - "Exercise Frame Assets"
Cohesion: 0.01
Nodes (302): frame_ab_wheel, frame_active_hang, frame_archer_push_up, frame_arm_circles, frame_arnold_press, frame_assault_bike, frame_assisted_chin_up, frame_assisted_dip (+294 more)

### Community 1 - "Workout Logging & Gamification"
Cohesion: 0.07
Nodes (59): dayjs, formatStopwatch(), styles, WorkoutSessionScreen(), WorkoutRecapModalProps, getNextWeightComparative(), getWeightComparativeByKey(), WEIGHT_COMPARATIVES (+51 more)

### Community 2 - "Database Schema & Backup"
Cohesion: 0.06
Nodes (58): expo-document-picker, expo-file-system, expo-sharing, backfillPerExerciseAchievements(), seedAchievements(), BACKUP_APP, BACKUP_INSERT_ORDER, BACKUP_TABLES (+50 more)

### Community 3 - "Workout Exercise Logging UI"
Cohesion: 0.07
Nodes (56): zustand, RoutineSetEditorScreen(), SetDraft, styles, ActiveRest, firstIncompleteSet(), SetDraft, shiftMapDown() (+48 more)

### Community 4 - "NPM Dependencies"
Cohesion: 0.04
Nodes (53): dependencies, @bryllim/workout-guide, dayjs, expo, expo-application, expo-audio, expo-clipboard, expo-constants (+45 more)

### Community 5 - "Achievements System"
Cohesion: 0.11
Nodes (39): AchievementsScreen(), load(), styles, getMonday(), HomeData, HomeScreen(), load(), styles (+31 more)

### Community 6 - "Settings, Stores & Persistence"
Cohesion: 0.08
Nodes (37): expo-application, expo-localization, ref_expo_sqlite_kv_store, i18next, ref_zustand_middleware, SettingsScreen(), styles, SwitchRowProps (+29 more)

### Community 7 - "Package Manifest"
Cohesion: 0.05
Nodes (38): main, name, private, version, eslint, eslint-config-expo, expo, expo-clipboard (+30 more)

### Community 8 - "Statistics & Analytics"
Cohesion: 0.13
Nodes (25): ref_dayjs_locale_es, victory-native, getRangeBounds(), GRANULARITY, mondayOf(), RANGE_KEYS, RangeKey, StatCardProps (+17 more)

### Community 9 - "Project Documentation & Architecture"
Cohesion: 0.09
Nodes (25): Anvil, app.json Expo configuration, Anvil brand identity and colors, Data Privacy & Ownership feature, expo-router file-based navigation, Expo SDK 57, expo-sqlite local database, Fun Comparisons USP (+17 more)

### Community 10 - "Routines Management"
Cohesion: 0.13
Nodes (18): EditRoutineScreen(), styles, RoutinesScreen(), DEFAULT_REST_SECONDS, DEFAULT_TARGET_REPS, DEFAULT_TARGET_SETS, deleteRoutine(), getRoutine() (+10 more)

### Community 11 - "Dev Dependencies & Tooling"
Cohesion: 0.09
Nodes (22): devDependencies, eslint, eslint-config-expo, expo-version, jest, jest-expo, test-renderer, @testing-library/react-native (+14 more)

### Community 12 - "Shared UI Components & Theme"
Cohesion: 0.12
Nodes (18): react-i18next, react-native-safe-area-context, SwitchRow(), TabsLayout(), DetailModal(), DetailModalProps, styles, AnimatedPressable (+10 more)

### Community 13 - "Exercise Detail & Library UI"
Cohesion: 0.17
Nodes (18): expo-image, @expo/vector-icons, AddExerciseScreen(), FilterChip(), styles, ExerciseDetailModal(), ExerciseDetailModalProps, muscleLabel() (+10 more)

### Community 14 - "Routine Detail UI & Primitives"
Cohesion: 0.16
Nodes (17): react-native, ref_react_native_gesture_handler_reanimatedswipeable, react-native-reanimated, react-native-sortables, RoutineDetailScreen(), styles, styles, LoadingOverlay() (+9 more)

### Community 15 - "Theme & Dialog System"
Cohesion: 0.14
Nodes (17): AppDialogProvider(), buttonColor(), DialogApi, DialogButton, DialogButtonStyle, DialogContext, DialogOptions, DialogTone (+9 more)

### Community 16 - "Exercise CRUD"
Cohesion: 0.20
Nodes (14): @bryllim/workout-guide, expo-sqlite, EditExerciseScreen(), styles, NewExerciseScreen(), createExercise(), deleteExercise(), ExerciseFilters (+6 more)

### Community 17 - "App Shell & Notifications"
Cohesion: 0.19
Nodes (11): expo-constants, expo-intent-launcher, expo-notifications, expo-status-bar, react-native-gesture-handler, RootNavigator(), AndroidExactAlarmPermissionPrompt(), useDialog() (+3 more)

### Community 18 - "Screen & Routine Forms"
Cohesion: 0.21
Nodes (10): expo-router, react, NewRoutineScreen(), RoutineForm(), RoutineFormProps, styles, Screen(), ScreenProps (+2 more)

### Community 19 - "Exercise Form & Constants"
Cohesion: 0.24
Nodes (8): Chip(), EXERCISE_TYPES, ExerciseForm(), ExerciseFormProps, styles, EXERCISE_FRAMES, EXERCISE_TYPE_I18N_KEYS, MUSCLE_I18N_KEYS

### Community 20 - "Rest Timer & Audio"
Cohesion: 0.28
Nodes (8): assets_audio_rest_finished, expo-audio, fireAlarmVibration(), formatCountdown(), REST_FINISHED_SOUND, RestTimer(), RestTimerProps, styles

### Community 21 - "TypeScript Configuration"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, paths, strict, types, extends, include, @/assets/*

### Community 22 - "Exercise Frame Generation Script"
Cohesion: 0.22
Nodes (8): ref_node_fs, ref_node_path, ref_node_url, entries, lines, manifest, outPath, root

### Community 23 - "Android Navigation Bar"
Cohesion: 0.25
Nodes (6): expo-navigation-bar, expo-system-ui, AndroidNavigationBar(), loadNavigationBar(), NavigationBarProps, NavigationBarStyle

### Community 24 - "Development Conventions"
Cohesion: 0.33
Nodes (6): Path aliases @/* and @/assets/*, Testing (jest-expo + testing-library), Strict TypeScript, Verification gates (tsc, lint, test), README path aliases, Strict TypeScript in README

### Community 25 - "Brand Iconography"
Cohesion: 0.90
Nodes (5): Anvil Brand Mark — the recurring upward chevron/'A' glyph (blue/white) that identifies the Anvil app across platforms, Android Adaptive Icon Monochrome Layer — flat gray chevron 'A' silhouette with transparent background for Android themed icons, Anvil Web Favicon — solid blue chevron 'A' mark on a light-blue rounded square, small square format for browser tabs, Anvil App Icon — glossy white chevron 'A' mark centered on a blue gradient background with a faint blueprint grid and crosshairs, Anvil Splash Icon — faint white/translucent chevron 'A' mark on a transparent background, used for the native splash screen

### Community 26 - "ESLint Configuration"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, ref_eslint_config, ref_eslint_config_expo_flat

### Community 27 - "App Icon Layer Assets"
Cohesion: 0.67
Nodes (4): expo-symbol 2.svg — white vector glyph (Expo default symbol, tent/chevron mark) used as the iOS app icon layer, grid.png — 1024×1024 RGBA grid/pattern texture layer composited under the iOS app icon symbol (visual content not verifiable by vision; role inferred from assets/expo.icon/icon.json), android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset), android-icon-foreground.png — 512×512 Android adaptive icon foreground layer (default Expo blue template asset)

### Community 28 - "Jest Configuration"
Cohesion: 0.67
Nodes (3): jest, preset, transformIgnorePatterns

## Ambiguous Edges - Review These
- `grid.png — 1024×1024 RGBA grid/pattern texture layer composited under the iOS app icon symbol (visual content not verifiable by vision; role inferred from assets/expo.icon/icon.json)` → `android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)`  [AMBIGUOUS]
  assets/expo.icon/Assets/grid.png · relation: semantically_similar_to

## Knowledge Gaps
- **568 isolated node(s):** `VARIANTS`, `{ defineConfig }`, `expoConfig`, `name`, `main` (+563 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 592 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `grid.png — 1024×1024 RGBA grid/pattern texture layer composited under the iOS app icon symbol (visual content not verifiable by vision; role inferred from assets/expo.icon/icon.json)` and `android-icon-background.png — 512×512 Android adaptive icon background layer (default Expo blue template asset)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `react-native` connect `Routine Detail UI & Primitives` to `Exercise Frame Assets`, `Workout Logging & Gamification`, `Database Schema & Backup`, `Workout Exercise Logging UI`, `Achievements System`, `Settings, Stores & Persistence`, `Package Manifest`, `Statistics & Analytics`, `Routines Management`, `Shared UI Components & Theme`, `Exercise Detail & Library UI`, `Theme & Dialog System`, `Exercise CRUD`, `App Shell & Notifications`, `Screen & Routine Forms`, `Exercise Form & Constants`, `Rest Timer & Audio`, `Android Navigation Bar`?**
  _High betweenness centrality (0.389) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `Package Manifest`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `expo-sqlite` connect `Exercise CRUD` to `Workout Logging & Gamification`, `Database Schema & Backup`, `Workout Exercise Logging UI`, `Achievements System`, `Settings, Stores & Persistence`, `Package Manifest`, `Statistics & Analytics`, `Routines Management`, `Exercise Detail & Library UI`, `Routine Detail UI & Primitives`, `App Shell & Notifications`, `Screen & Routine Forms`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `VARIANTS`, `{ defineConfig }`, `expoConfig` to the rest of the system?**
  _568 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Exercise Frame Assets` be split into smaller, more focused modules?**
  _Cohesion score 0.006600660066006601 - nodes in this community are weakly interconnected._
- **Should `Workout Logging & Gamification` be split into smaller, more focused modules?**
  _Cohesion score 0.0684931506849315 - nodes in this community are weakly interconnected._