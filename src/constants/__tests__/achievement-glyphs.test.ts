import glyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import { getBadgeGlyph } from '../achievement-glyphs';
import { ACHIEVEMENTS } from '../achievements';
import { DISTANCE_ACHIEVEMENTS } from '../distance-achievements';
import { WEIGHT_COMPARATIVES } from '../weight-comparatives';

const ALL_KEYS = [
  ...ACHIEVEMENTS.map((entry) => entry.key),
  ...DISTANCE_ACHIEVEMENTS.map((entry) => entry.key),
  ...WEIGHT_COMPARATIVES.map((entry) => entry.key),
];

describe('achievement badge glyphs', () => {
  it.each(ALL_KEYS)('%s resolves to an existing glyph or a numeral', (key) => {
    const glyph = getBadgeGlyph(key);
    if ('icon' in glyph) {
      expect(glyphMap).toHaveProperty(glyph.icon);
    } else {
      expect(glyph.numeral).toMatch(/^\d+$/);
    }
  });

  it('gives every achievement a dedicated glyph rather than the generic fallback', () => {
    const fallback = getBadgeGlyph('__unknown__');
    for (const key of ALL_KEYS) {
      expect(getBadgeGlyph(key)).not.toEqual(fallback);
    }
  });
});
