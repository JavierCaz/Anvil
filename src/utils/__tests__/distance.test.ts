import {
  M_PER_MI,
  M_PER_YD,
  displayToMeters,
  distanceUnitLabel,
  formatDistance,
  formatDistanceWithUnit,
  formatPace,
  metersToDisplay,
} from '@/utils/distance';

describe('distance helpers', () => {
  it('labels the unit per system', () => {
    expect(distanceUnitLabel('metric')).toBe('km');
    expect(distanceUnitLabel('imperial')).toBe('mi');
  });

  it('converts meters to and from display units', () => {
    expect(metersToDisplay(5000, 'metric')).toBe(5);
    expect(metersToDisplay(M_PER_MI, 'imperial')).toBe(1);
    expect(displayToMeters(5, 'metric')).toBe(5000);
    expect(displayToMeters(1, 'imperial')).toBeCloseTo(M_PER_MI);
  });

  it('round-trips km → mi → meters without drift beyond float noise', () => {
    const meters = displayToMeters(metersToDisplay(5000, 'imperial'), 'imperial');
    expect(meters).toBeCloseTo(5000, 6);
  });

  it('formats with up to two decimals and no trailing zeros', () => {
    expect(formatDistance(5000, 'metric')).toBe('5');
    expect(formatDistance(5250, 'metric')).toBe('5.25');
    expect(formatDistance(5123.4, 'metric')).toBe('5.12');
    expect(formatDistanceWithUnit(10000, 'imperial')).toBe('6.21 mi');
  });

  it('formats pace per unit', () => {
    // 25:30 over 5 km → 5:06 /km.
    expect(formatPace(1530, 5000, 'metric')).toBe('5:06 /km');
    // 8:00 over one mile.
    expect(formatPace(480, M_PER_MI, 'imperial')).toBe('8:00 /mi');
  });

  it('returns null pace without distance or duration', () => {
    expect(formatPace(0, 5000, 'metric')).toBeNull();
    expect(formatPace(1500, 0, 'metric')).toBeNull();
  });
});

describe('short distance scale (m / yd)', () => {
  it('labels and converts in meters / yards', () => {
    expect(distanceUnitLabel('metric', 'short')).toBe('m');
    expect(distanceUnitLabel('imperial', 'short')).toBe('yd');
    expect(metersToDisplay(40, 'metric', 'short')).toBe(40);
    expect(metersToDisplay(M_PER_YD * 50, 'imperial', 'short')).toBeCloseTo(50);
    expect(displayToMeters(40, 'metric', 'short')).toBe(40);
    expect(displayToMeters(50, 'imperial', 'short')).toBeCloseTo(45.72);
  });

  it('formats a 40 m carry without km decimals', () => {
    expect(formatDistanceWithUnit(40, 'metric', 'short')).toBe('40 m');
    expect(formatDistanceWithUnit(40, 'imperial', 'short')).toBe('43.74 yd');
  });

  it('keeps km / mi as the default scale', () => {
    expect(formatDistanceWithUnit(40, 'metric')).toBe('0.04 km');
  });
});
