// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    rules: {
      // The barrel import makes Metro bundle every icon font (~1.2 MB of
      // unused fonts in the APK); import each icon set from its own path.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@expo/vector-icons",
              message: "Import the icon set directly, e.g. `import Ionicons from '@expo/vector-icons/Ionicons'`.",
            },
          ],
        },
      ],
    },
  },
]);
