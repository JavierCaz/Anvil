// Config plugin: optional per-ABI release APKs.
//
// A universal APK carries native code for every CPU architecture (~190 MB with
// Skia). For F-Droid / IzzyOnDroid / GitHub releases we ship one APK per ABI
// instead. Opt in with `-PanvilAbiSplit=true`; one APK is produced for each
// architecture in `reactNativeArchitectures` (so the split list always matches
// the native code that was actually compiled).
//
// Each split gets versionCode = base * 10 + ABI code, with 64-bit ABIs ranked
// higher so stores prefer them on devices that support both:
//   armeabi-v7a → 1, arm64-v8a → 2, x86 → 3, x86_64 → 4
// (F-Droid: `VercodeOperation: ["10 * %c + 1", "10 * %c + 2"]`).
//
// Without the flag nothing changes (dev builds, `expo run:android`, EAS).
const { withAppBuildGradle } = require('expo/config-plugins');

const MARKER = '// anvil:abi-splits';

const ABI_SPLITS = `
${MARKER}
def anvilAbiCodes = ['armeabi-v7a': 1, 'arm64-v8a': 2, 'x86': 3, 'x86_64': 4]
if ((findProperty('anvilAbiSplit') ?: 'false').toBoolean()) {
    def anvilAbis = (findProperty('reactNativeArchitectures') ?: 'armeabi-v7a,arm64-v8a,x86,x86_64')
        .split(',').collect { it.trim() }.findAll { it }
    android {
        splits {
            abi {
                enable true
                reset()
                include(*anvilAbis)
                universalApk false
            }
        }
    }
    androidComponents {
        onVariants(selector().all()) { variant ->
            variant.outputs.each { output ->
                def abiFilter = output.filters.find {
                    it.filterType == com.android.build.api.variant.FilterConfiguration.FilterType.ABI
                }
                if (abiFilter != null) {
                    output.versionCode.set(output.versionCode.get() * 10 + anvilAbiCodes[abiFilter.identifier])
                }
            }
        }
    }
}
`;

function appendAbiSplits(contents) {
  if (contents.includes(MARKER)) {
    return contents;
  }
  return `${contents.trimEnd()}\n${ABI_SPLITS}`;
}

module.exports = function withAbiSplits(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      throw new Error('[with-abi-splits] expected a Groovy app/build.gradle');
    }
    cfg.modResults.contents = appendAbiSplits(cfg.modResults.contents);
    return cfg;
  });
};

module.exports.appendAbiSplits = appendAbiSplits;
