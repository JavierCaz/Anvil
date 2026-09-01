// Dynamic app config — drives per-variant builds (development / preview / production).
//
// Each variant gets a unique Android package name and iOS bundle identifier so that
// multiple variants can be installed side-by-side on the same device, plus a distinct
// display name and URL scheme so they are easy to tell apart.
//
// The active variant is selected by the EXPO_PUBLIC_APP_VARIANT env var, which is set
// per EAS build profile in eas.json. When unset (e.g. `npx expo start`), the
// development variant is used.

const variant = process.env.EXPO_PUBLIC_APP_VARIANT ?? 'development';

const VARIANTS = {
  development: {
    name: 'Anvil Dev',
    package: 'com.javiercaz.anvil.dev',
    scheme: 'anvil-dev',
  },
  preview: {
    name: 'Anvil Preview',
    package: 'com.javiercaz.anvil.preview',
    scheme: 'anvil-preview',
  },
  production: {
    name: 'Anvil',
    package: 'com.javiercaz.anvil',
    scheme: 'anvil',
  },
};

const appVariant = VARIANTS[variant] ?? VARIANTS.development;

export default {
  expo: {
    name: appVariant.name,
    slug: 'anvil',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: appVariant.scheme,
    userInterfaceStyle: 'automatic',
    ios: {
      icon: './assets/expo.icon',
      bundleIdentifier: appVariant.package,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
      package: appVariant.package,
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-dev-client',
        // Only the development build registers the generated scheme, so preview and
        // production builds don't intercept dev-client deep links on the same device.
        { addGeneratedScheme: variant === 'development' },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#208AEF',
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      ],
      '@react-native-community/datetimepicker',
      'expo-font',
      'expo-image',
      'expo-localization',
      'expo-sharing',
      'expo-sqlite',
      'expo-status-bar',
      'expo-web-browser',
      'expo-audio',
      [
        'expo-notifications',
        {
          // Bundle the rest-timer chime so scheduled notifications can play it
          // while the app is backgrounded / the screen is locked.
          sounds: ['./assets/audio/rest_finished.wav'],
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '436d3a07-948d-4505-a317-45b40e3776fb',
      },
    },
    owner: 'javiercaz',
  },
};
