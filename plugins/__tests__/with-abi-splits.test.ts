// eslint-disable-next-line @typescript-eslint/no-require-imports
const { appendAbiSplits } = require('../with-abi-splits') as {
  appendAbiSplits: (contents: string) => string;
};

const TEMPLATE = `android {
    defaultConfig {
        versionCode 1
    }
}
`;

describe('with-abi-splits', () => {
  it('appends an opt-in ABI split block', () => {
    const out = appendAbiSplits(TEMPLATE);
    expect(out.startsWith(TEMPLATE.trimEnd())).toBe(true);
    expect(out).toContain("findProperty('anvilAbiSplit')");
    expect(out).toContain("findProperty('reactNativeArchitectures')");
    expect(out).toContain('universalApk false');
  });

  it('ranks 64-bit ABIs above their 32-bit counterparts', () => {
    const out = appendAbiSplits(TEMPLATE);
    expect(out).toContain("['armeabi-v7a': 1, 'arm64-v8a': 2, 'x86': 3, 'x86_64': 4]");
    expect(out).toContain('output.versionCode.get() * 10 + anvilAbiCodes[abiFilter.identifier]');
  });

  it('is idempotent', () => {
    const once = appendAbiSplits(TEMPLATE);
    expect(appendAbiSplits(once)).toBe(once);
  });
});
