import en from '../locales/en.json';
import es from '../locales/es.json';

type NestedDict = Record<string, unknown>;

function flattenKeys(obj: NestedDict, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === 'object'
      ? flattenKeys(value as NestedDict, path)
      : [path];
  });
}

describe('translation locales', () => {
  it('es.json has exactly the same keys as en.json', () => {
    expect(flattenKeys(es).sort()).toEqual(flattenKeys(en).sort());
  });

  it('does not contain empty translations', () => {
    for (const dict of [en, es] as const) {
      for (const key of flattenKeys(dict)) {
        const value = key
          .split('.')
          .reduce<unknown>((acc, part) => (acc as NestedDict)?.[part], dict);
        expect(typeof value).toBe('string');
        expect((value as string).trim().length).toBeGreaterThan(0);
      }
    }
  });
});
