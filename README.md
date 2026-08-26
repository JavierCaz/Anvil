# Anvil

An Expo (SDK 57) app built with TypeScript, [expo-router](https://docs.expo.dev/router/introduction), and [Zustand](https://zustand.docs.pmnd.rs/).

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

## Project structure

```
├── src/
│   ├── app/          # expo-router file-based routes (src/app/_layout.tsx is the root layout)
│   ├── components/   # Shared UI components
│   ├── constants/    # Shared constants
│   └── hooks/        # Shared hooks
├── assets/           # Static assets (app icons, splash screen)
└── app.json          # Expo app configuration
```

## TypeScript

The project uses strict TypeScript. Path aliases are configured in `tsconfig.json`:

- `@/*` → `src/*`
- `@/assets/*` → `assets/*`

Run the type checker with:

```bash
npx tsc --noEmit
```
