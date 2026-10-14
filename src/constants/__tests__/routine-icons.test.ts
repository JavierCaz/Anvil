import glyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import en from '@/i18n/locales/en.json';
import { DEFAULT_ROUTINE_GLYPH, getRoutineGlyph, ROUTINE_ICONS } from '../routine-icons';

/** Resolves a dotted i18n key against a locale object. */
function lookup(locale: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>(
    (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
    locale
  );
}

describe('routine icon presets', () => {
  it('uses unique keys', () => {
    const keys = ROUTINE_ICONS.map((icon) => icon.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it.each(ROUTINE_ICONS.map((icon) => [icon.key, icon]))('%s has a real glyph and a label', (_, icon) => {
    expect(glyphMap).toHaveProperty(icon.glyph);
    expect(typeof lookup(en, icon.labelKey)).toBe('string');
  });

  it('falls back to the default glyph for missing or unknown keys', () => {
    expect(getRoutineGlyph(null)).toBe(DEFAULT_ROUTINE_GLYPH);
    expect(getRoutineGlyph('retired_key')).toBe(DEFAULT_ROUTINE_GLYPH);
    expect(getRoutineGlyph('legs')).toBe('foot-print');
  });
});
