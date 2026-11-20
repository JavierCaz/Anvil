// eslint-disable-next-line @typescript-eslint/no-require-imports
const { patchBuildGradle } = require('../with-release-signing') as {
  patchBuildGradle: (contents: string) => string;
};

// Trimmed copy of the signing / buildTypes section of Expo's app/build.gradle template.
const TEMPLATE = `android {
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // Caution! In production, you need to generate your own keystore file.
            signingConfig signingConfigs.debug
            minifyEnabled enableMinifyInReleaseBuilds
        }
    }
}
`;

describe('with-release-signing', () => {
  it('adds a release signing config and selects it for release builds', () => {
    const out = patchBuildGradle(TEMPLATE);

    expect(out).toContain("storeFile file(project.property('anvilReleaseStoreFile'))");
    expect(out).toContain('signingConfig signingConfigs.release');
    expect(out).toContain('signingConfig null');
    // The debug build type keeps the debug key.
    expect(out).toMatch(/debug \{\s*signingConfig signingConfigs\.debug\s*\}/);
    // The release block no longer starts with the unconditional debug key.
    const release = out.slice(out.indexOf('release {', out.indexOf('buildTypes')));
    expect(release.indexOf('anvilReleaseStoreFile')).toBeLessThan(release.indexOf('signingConfig signingConfigs.debug'));
  });

  it('is idempotent', () => {
    const once = patchBuildGradle(TEMPLATE);
    expect(patchBuildGradle(once)).toBe(once);
  });

  it('fails loudly if the template changes shape', () => {
    expect(() => patchBuildGradle('android {}')).toThrow(/signingConfigs\.debug block not found/);
  });
});
