#!/usr/bin/env bash
# Build signed, production Android release APKs locally (no EAS) — one APK
# per CPU architecture (see plugins/with-abi-splits.js).
#
#   npm run build:apk
#   ANVIL_ABIS=arm64-v8a npm run build:apk     # build a subset
#
# Signing comes from Gradle properties — put these in ~/.gradle/gradle.properties
# (never in the repo):
#
#   anvilReleaseStoreFile=/absolute/path/to/anvil-release.jks
#   anvilReleaseStorePassword=...
#   anvilReleaseKeyAlias=anvil
#   anvilReleaseKeyPassword=...
#
# Output: dist/anvil-<version>-<abi>.apk
set -euo pipefail

cd "$(dirname "$0")/.."

GRADLE_PROPS="${GRADLE_USER_HOME:-$HOME/.gradle}/gradle.properties"
if ! grep -qs '^anvilReleaseStoreFile=' "$GRADLE_PROPS"; then
  echo "error: anvilReleaseStoreFile is not set in $GRADLE_PROPS" >&2
  echo "       Without it the APK would be signed with the public debug key." >&2
  exit 1
fi

# 32- and 64-bit ARM cover practically all phones; x86/x86_64 are emulators.
ABIS="${ANVIL_ABIS:-armeabi-v7a,arm64-v8a}"

VERSION=$(node -p "require('./package.json').version")
VERSION_CODE=$(node -p "require('./package.json').versionCode")
echo "Building Anvil $VERSION ($VERSION_CODE) for $ABIS…"

export EXPO_PUBLIC_APP_VARIANT=production
npx expo prebuild --platform android --clean --no-install

(cd android && ./gradlew :app:assembleRelease -PanvilAbiSplit=true -PreactNativeArchitectures="$ABIS")

mkdir -p dist
APKSIGNER=$(ls -d "${ANDROID_HOME:-$HOME/Android/Sdk}"/build-tools/*/apksigner 2>/dev/null | sort -V | tail -1 || true)
echo
IFS=',' read -ra ABI_LIST <<< "$ABIS"
for ABI in "${ABI_LIST[@]}"; do
  OUT="dist/anvil-$VERSION-$ABI.apk"
  cp "android/app/build/outputs/apk/release/app-$ABI-release.apk" "$OUT"
  echo "✔ $OUT ($(du -h "$OUT" | cut -f1))"
done

if [ -n "$APKSIGNER" ]; then
  echo "  Signing certificate (share this SHA-256 with F-Droid / IzzyOnDroid):"
  "$APKSIGNER" verify --print-certs "$OUT" 2>/dev/null | grep -m1 'SHA-256' || true
fi
