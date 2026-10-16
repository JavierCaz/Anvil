import { sliceAt } from '@/components/charts/slice-hit-test';

// 200px donut: centre (100, 100), outer radius 100, ring from 74px outwards.
const SIZE = 200;
const slices = [{ value: 1 }, { value: 1 }, { value: 2 }]; // 0–90°, 90–180°, 180–360°
const total = 4;

describe('sliceAt', () => {
  it('maps ring taps to slices clockwise from 3 o’clock', () => {
    expect(sliceAt(slices, total, SIZE, 190, 110)).toBe(0); // just below 3 o'clock
    expect(sliceAt(slices, total, SIZE, 90, 190)).toBe(1); // just left of 6 o'clock
    expect(sliceAt(slices, total, SIZE, 10, 100)).toBe(2); // 9 o'clock
    expect(sliceAt(slices, total, SIZE, 100, 10)).toBe(2); // 12 o'clock
  });

  it('ignores taps in the hole or well outside the ring', () => {
    expect(sliceAt(slices, total, SIZE, 100, 100)).toBeNull();
    expect(sliceAt(slices, total, SIZE, 150, 100)).toBeNull(); // 50px out: inside the hole
    expect(sliceAt(slices, total, SIZE, 0, 0)).toBeNull(); // corner: ~141px out
  });

  it('accepts taps just past the ring edge', () => {
    expect(sliceAt(slices, total, SIZE, 205, 101)).toBe(0);
  });

  it('returns null when there is nothing to select', () => {
    expect(sliceAt([], 0, SIZE, 190, 110)).toBeNull();
  });
});
