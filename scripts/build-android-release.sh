#!/usr/bin/env bash
# Build a signed, production Android release APK locally (no EAS).
#
#   npm run build:apk
#
# Signing comes from Gradle properties — put these in ~/.gradle/gradle.properties
# (never in the repo):
#
#   anvilReleaseStoreFile=/absolute/path/to/anvil-release.jks
#   anvilReleaseStorePassword=...
#   anvilReleaseKeyAlias=anvil
#   anvilReleaseKeyPassword=...
#
# Output: dist/anvil-<version>.apk
set -euo pipefail

cd "$(dirname "$0")/.."

GRADLE_PROPS="${GRADLE_USER_HOME:-$HOME/.gradle}/gradle.properties"
if ! grep -qs '^anvilReleaseStoreFile=' "$GRADLE_PROPS"; then
  echo "error: anvilReleaseStoreFile is not set in $GRADLE_PROPS" >&2
  echo "       Without it the APK would be signed with the public debug key." >&2
  exit 1
fi

VERSION=$(node -p "require('./package.json').version")
VERSION_CODE=$(node -p "require('./package.json').versionCode")
echo "Building Anvil $VERSION ($VERSION_CODE)…"

export EXPO_PUBLIC_APP_VARIANT=production
npx expo prebuild --platform android --clean --no-install

(cd android && ./gradlew :app:assembleRelease)

mkdir -p dist
OUT="dist/anvil-$VERSION.apk"
cp android/app/build/outputs/apk/release/app-release.apk "$OUT"

echo
echo "✔ $OUT"
echo "  Signing certificate (share this SHA-256 with F-Droid / IzzyOnDroid):"
APKSIGNER=$(ls -d "${ANDROID_HOME:-$HOME/Android/Sdk}"/build-tools/*/apksigner 2>/dev/null | sort -V | tail -1 || true)
if [ -n "$APKSIGNER" ]; then
  "$APKSIGNER" verify --print-certs "$OUT" | grep -m1 'SHA-256' || true
else
  echo "  (apksigner not found — skipped)"
fi
