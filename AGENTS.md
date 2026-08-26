# Anvil — Project Context

## ⚠️ Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Product Overview

Anvil is a **privacy-first, locally-stored gym tracking app** that combines workout logging, performance analytics, and gamification to help users build strength and stay motivated.

- **Tagline:** "Forge your strength. Track your progress."
- **Brand:** Name "Anvil" (strength, forging, durability). Colors — primary deep iron gray `#2C2C2C`, accent forge orange `#E86A33`, success steel blue `#4A90D9`, dark theme background.
- **Target users:** Fitness enthusiasts and intermediate/advanced lifters who care about data ownership and motivation.

## Core Features (MVP)

1. **Workout Management** — Custom routines (e.g., "Push Day", "Pull Day", "Leg Day"); pre-populated + custom exercise library; logging exercise, weight, reps, sets, notes; workout history with dates and performance.
2. **Progress Tracking & Analytics** — Interactive line/bar charts: weight per exercise over time, volume (weight × reps), 1RM estimate trends. Automatic PR detection: heaviest weight, most reps at a weight, best 1RM estimate. Post-workout session summary (total volume, PRs broken, time spent).
3. **Gamification & Achievements** — Badges ("First Workout", "1000kg Club", "Consistency King" 30-day streak, "Progressive Overload" 5 PRs/month); level system based on total volume/workouts; daily/weekly goals per exercise.
4. **Fun Comparisons (USP)** — "What am I lifting?" maps weights to everyday objects (100kg = fridge, 200kg = motorcycle engine, 80kg = pig, 50kg = washing machine, 20kg = car tire). Non-identifiable social sharing of achievements/comparisons.
5. **Data Privacy & Ownership** — 100% local storage; no cloud sync, no accounts, no servers, no data collection; JSON/CSV export/backup; no third-party tracking/analytics.

**Monetization (future):** one-time purchase / Pro — unlimited custom exercises, advanced analytics, custom achievements, spreadsheet export. No ads, no subscription.

## Tech Stack (installed)

> **NOTE:** The original brief said "Expo SDK 54" — **the project is actually Expo SDK 57** (expo@57.0.15, React Native 0.86.2, React 19.2.3). Always follow v57 docs.

| Area | Choice | Installed |
|---|---|---|
| Framework | React Native via Expo | expo `57.0.15` (SDK 57), react-native `0.86.2`, react `19.2.3` |
| Language | TypeScript (strict) | typescript `6.0.3` |
| Navigation | expo-router (file-based, `src/app/`) | expo-router `57.0.15` |
| State | Zustand | zustand `5.0.15` |
| i18n | i18next + react-i18next | i18next `26.4.0`, react-i18next `17.0.12` |
| Preferences KV | expo-sqlite/kv-store (no AsyncStorage) | bundled with expo-sqlite `57.0.1` |
| Database | expo-sqlite (local only) | expo-sqlite `57.0.1` |
| Charts | victory-native | victory-native `41.26.0` |
| Icons | expo-symbols (SF Symbols) + @expo/vector-icons | expo-symbols `57.0.2`, @expo/vector-icons `15.x` |
| Custom SVG | react-native-svg | `15.15.4` |
| Animations | react-native-reanimated | reanimated `4.5.1` + react-native-worklets `0.10.1` |
| Haptics | expo-haptics | `57.0.1` |
| Testing | jest-expo (Jest preset) + @testing-library/react-native | jest-expo `57.0.4`, jest `29.7.0`, @testing-library/react-native `14.0.1` |
| Dates | dayjs | `1.11.23` |
| Media/Share | expo-image, expo-sharing, expo-file-system, expo-clipboard, expo-document-picker, expo-media-library, react-native-view-shot | SDK 57.x |
| Other | @react-native-community/datetimepicker, expo-localization, expo-glass-effect, @expo/ui, expo-splash-screen, react-native-safe-area-context `5.7`, react-native-gesture-handler `2.32`, react-native-screens `4.26`, react-native-web `0.21` | — |

**App config (`app.json`):** entry `main: "expo-router/entry"`; experiments **typedRoutes + reactCompiler both ON**; `web.output: "static"`; scheme `anvil`; EAS project id configured (owner `javiercaz`); expo-router plugin included as plain string (no options).

## Architecture Rules

- **Privacy-first is a HARD constraint:** no auth, no cloud sync, no analytics/tracking libraries, no external APIs. All data persists locally in SQLite.
- **Navigation:** import from `expo-router` ONLY. SDK 56+ removed support for importing `@react-navigation/*` directly in app code (those packages exist only as transitive deps — never import them in `src/`).
- **Planned SQLite tables:** `routines`, `exercises`, `routine_exercises`, `workout_logs`, `sets`, `personal_records`, `achievements` (DDL lives in `src/db/schema.ts`, versioned via `PRAGMA user_version`).
- **Path aliases:** `@/*` → `src/*`, `@/assets/*` → `assets/*` (strict TS).
- **Layout:** screens live in `src/app/` (root layout `src/app/_layout.tsx` — Stack + SQLiteProvider + AppThemeProvider). Shared code goes in `src/components`, `src/constants`, `src/hooks`.
- **Theming:** user preference (`system` | `light` | `dark`) lives in `src/theme/theme-store.ts` (Zustand, persisted to `expo-sqlite/kv-store` under `anvil.theme`); default is `system`. The root layout wraps the app in `AppThemeProvider` — consume the resolved theme via `useAppTheme()` → `{ scheme, colors }`. Navigation theme and `StatusBar` style derive from the resolved scheme. Semantic brand colors are in `src/theme/colors.ts` (iron `#2C2C2C`, forge orange `#E86A33`, steel blue `#4A90D9`); components use `colors`, never hardcode hex values.
- **i18n:** `i18next` + `react-i18next` initialized in `src/i18n/index.ts` with `react: { useSuspense: false }` (required in RN — no Suspense boundary). Supported languages: `en`, `es` (`SUPPORTED_LANGUAGES` / `AppLanguage` in `src/i18n/`). Locale JSON files live in `src/i18n/locales/{en,es}.json` — **every key must exist in every locale** (a parity test in `src/i18n/__tests__/` enforces this). Initial language: persisted choice → device locale (`expo-localization`) → `en`. Switch via `setAppLanguage()` (persists under `anvil.language`). Use `useTranslation()` from `react-i18next` in components — never hardcode user-facing strings.
- **Preferences persistence:** use `expo-sqlite/kv-store` (`import Storage from 'expo-sqlite/kv-store'`) — a local SQLite-backed KV store with sync + async APIs. Key convention: `anvil.<feature>.<key>` (e.g. `anvil.theme`, `anvil.language`). Do NOT add the AsyncStorage dependency.
- **Testing:** unit/component tests via **jest-expo** preset + **@testing-library/react-native**. Config lives in `package.json` (`jest.preset`) + `tsconfig.json` (`types: ["jest"]`). Test files use `*.test.ts(x)` / `*.spec.ts(x)` naming. Run all tests with `npm test` (`jest --watchAll`); for a one-shot CI-style run use `npx jest --runInBand`.
- **Verification:** `npx tsc --noEmit`, `npm run lint` (eslint-config-expo), and `npm test` must pass.
