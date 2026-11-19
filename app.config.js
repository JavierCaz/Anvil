// Dynamic app config — drives per-variant builds (development / preview / production).
//
// Each variant gets a unique Android package name and iOS bundle identifier so that
// multiple variants can be installed side-by-side on the same device, plus a distinct
// display name and URL scheme so they are easy to tell apart.
//
// The active variant is selected by the EXPO_PUBLIC_APP_VARIANT env var, which is set
// per EAS build profile in eas.json. When unset (e.g. `npx expo start`), the
// development variant is used.

const { version, versionCode } = require('./package.json');

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
const isDevelopment = appVariant === VARIANTS.development;

// Android permissions stripped from the merged manifest. Anvil is 100% offline
// and never reads the photo library, so these only widen its footprint:
// - READ_MEDIA_*: expo-media-library adds them, but sharing saves images
//   write-only (no read permission needed on Android 13+).
// - INTERNET / SYSTEM_ALERT_WINDOW: added by the React Native template; only the
//   development build needs them (Metro bundler + dev menu overlay).
const BLOCKED_ANDROID_PERMISSIONS = [
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
  ...(isDevelopment ? [] : ['android.permission.INTERNET', 'android.permission.SYSTEM_ALERT_WINDOW']),
];

export default {
  expo: {
    name: appVariant.name,
    slug: 'anvil',
    // Single source of truth: `version` / `versionCode` in package.json, bumped
    // with `npm run bump`. F-Droid reads them from there too.
    version,
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: appVariant.scheme,
    userInterfaceStyle: 'automatic',
    ios: {
      bundleIdentifier: appVariant.package,
      buildNumber: String(versionCode),
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#0C0D11',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
      package: appVariant.package,
      versionCode,
      // Notification + exact-alarm permissions for the rest timer are declared
      // by the local `modules/anvil-alarm` native module's manifest.
      blockedPermissions: BLOCKED_ANDROID_PERMISSIONS,
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      './plugins/with-release-signing',
      [
        'expo-dev-client',
        // Only the development build registers the generated scheme, so preview and
        // production builds don't intercept dev-client deep links on the same device.
        { addGeneratedScheme: variant === 'development' },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#0C0D11',
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
        },
      ],
      '@react-native-community/datetimepicker',
      'expo-font',
      'expo-image',
      'expo-localization',
      [
        'expo-media-library',
        {
          // Write-only: the workout share image is saved to Photos; the app
          // never reads the library.
          photosPermission: false,
          savePhotosPermission: 'Allow $(PRODUCT_NAME) to save your workout images to Photos.',
          granularPermissions: ['photo'],
        },
      ],
      'expo-sharing',
      'expo-sqlite',
      'expo-status-bar',
      'expo-web-browser',
      [
        'expo-audio',
        {
          // Playback only: the app never records. In the background the rest
          // timer rings via its notification, so no background-playback
          // foreground service (or iOS audio background mode) is needed.
          microphonePermission: false,
          recordAudioAndroid: false,
          enableBackgroundPlayback: false,
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
