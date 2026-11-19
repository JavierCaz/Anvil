# Anvil

**Forge your strength. Track your progress.**

A privacy-first gym tracker: routines, workout logging, progress charts, personal records and achievements. All data stays on your device — no account, no cloud, no ads, no tracking, and release builds don't request internet access.

Built with Expo (SDK 57), TypeScript, [expo-router](https://docs.expo.dev/router/introduction) and [Zustand](https://zustand.docs.pmnd.rs/).

## Getting started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm start`       | Start the Expo dev server     |
| `npm run android` | Start and open on Android     |
| `npm run ios`     | Start and open on iOS         |
| `npm run web`     | Start and open in the browser |
| `npm run lint`    | Run ESLint                    |
| `npm run bump -- patch\|minor\|major` | Bump `version` + `versionCode` for a release |
| `npm run build:apk` | Build a signed production APK locally |

## Project structure

```
├── src/
│   ├── app/          # expo-router file-based routes (src/app/_layout.tsx is the root layout)
│   ├── components/   # Shared UI components
│   ├── constants/    # Shared constants
│   └── hooks/        # Shared hooks
├── modules/          # Local native modules (anvil-alarm: offline rest-timer notifications)
├── plugins/          # Expo config plugins (release signing)
├── fastlane/         # Store listing metadata (F-Droid / IzzyOnDroid)
├── assets/           # Static assets (app icons, splash screen)
└── app.config.js     # Expo app configuration (per-variant)
```

## TypeScript

The project uses strict TypeScript. Path aliases are configured in `tsconfig.json`:

- `@/*` → `src/*`
- `@/assets/*` → `assets/*`

Run the type checker with:

```bash
npx tsc --noEmit
```

## Releasing (Android)

The version lives in `package.json` (`version` + `versionCode`); `app.config.js` reads it from there.

1. `npm run bump -- patch` (or `minor` / `major`), then write the release notes in `fastlane/metadata/android/*/changelogs/<versionCode>.txt`.
2. Commit and tag: `git commit -am "chore: release vX.Y.Z" && git tag vX.Y.Z`.
3. `npm run build:apk` → `dist/anvil-X.Y.Z.apk`, signed with your release key.
4. Push the tag and attach the APK to a GitHub release.

Signing reads these Gradle properties from `~/.gradle/gradle.properties` (never commit them):

```properties
anvilReleaseStoreFile=/absolute/path/to/anvil-release.jks
anvilReleaseStorePassword=…
anvilReleaseKeyAlias=anvil
anvilReleaseKeyPassword=…
```

Build an unsigned release (as F-Droid's build server does) with `./gradlew assembleRelease -PanvilUnsigned=true`.

## License and credits

Anvil is released under the [MIT License](LICENSE).

Exercise illustrations come from [Workout Guide](https://github.com/bryllim/workout-guide) by Bryl Lim, licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
