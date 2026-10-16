import {
  CONVERTER_CATEGORIES,
  convertUnit,
  converterUnits,
  defaultConverterUnits,
  formatConverted,
} from '@/utils/unit-converter';

describe('convertUnit', () => {
  it('converts weights', () => {
    expect(convertUnit(100, 'weight', 'kg', 'lb')).toBeCloseTo(220.462, 3);
    expect(convertUnit(45, 'weight', 'lb', 'kg')).toBeCloseTo(20.412, 3);
    expect(convertUnit(1, 'weight', 'st', 'lb')).toBeCloseTo(14, 10);
    expect(convertUnit(1, 'weight', 'lb', 'oz')).toBeCloseTo(16, 10);
  });

  it('converts distances', () => {
    expect(convertUnit(1, 'distance', 'mi', 'km')).toBeCloseTo(1.609344, 10);
    expect(convertUnit(5, 'distance', 'km', 'mi')).toBeCloseTo(3.10686, 4);
    expect(convertUnit(1, 'distance', 'ft', 'in')).toBeCloseTo(12, 10);
    expect(convertUnit(180, 'distance', 'cm', 'ft')).toBeCloseTo(5.9055, 4);
  });

  it('converts speeds', () => {
    expect(convertUnit(10, 'speed', 'km/h', 'mph')).toBeCloseTo(6.2137, 4);
    expect(convertUnit(1, 'speed', 'm/s', 'km/h')).toBeCloseTo(3.6, 10);
  });

  it('round-trips every unit pair', () => {
    for (const category of CONVERTER_CATEGORIES) {
      for (const from of converterUnits(category)) {
        for (const to of converterUnits(category)) {
          const there = convertUnit(42, category, from, to);
          expect(convertUnit(there, category, to, from)).toBeCloseTo(42, 10);
        }
      }
    }
  });

  it('returns NaN for units outside the category', () => {
    expect(convertUnit(1, 'weight', 'kg', 'km')).toBeNaN();
  });
});

describe('defaultConverterUnits', () => {
  it("starts from the user's unit system", () => {
    expect(defaultConverterUnits('weight', 'metric')).toEqual({ from: 'kg', to: 'lb' });
    expect(defaultConverterUnits('weight', 'imperial')).toEqual({ from: 'lb', to: 'kg' });
    expect(defaultConverterUnits('distance', 'metric')).toEqual({ from: 'km', to: 'mi' });
  });

  it('only uses units of the category', () => {
    for (const category of CONVERTER_CATEGORIES) {
      for (const system of ['metric', 'imperial'] as const) {
        const { from, to } = defaultConverterUnits(category, system);
        expect(converterUnits(category)).toEqual(expect.arrayContaining([from, to]));
      }
    }
  });
});

describe('formatConverted', () => {
  it('rounds to two decimals and trims trailing zeros', () => {
    expect(formatConverted(220.46226218)).toBe('220.46');
    expect(formatConverted(100)).toBe('100');
    expect(formatConverted(2.5)).toBe('2.5');
  });

  it('keeps significant digits for values too small to round', () => {
    expect(formatConverted(0.0022046)).toBe('0.0022');
    expect(formatConverted(0)).toBe('0');
  });

  it('renders a dash for non-finite values', () => {
    expect(formatConverted(NaN)).toBe('—');
  });
});
