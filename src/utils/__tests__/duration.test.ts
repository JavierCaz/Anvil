import {
  MAX_SET_DURATION_SECONDS,
  clampDuration,
  formatDuration,
  joinDuration,
  splitDuration,
} from '@/utils/duration';

describe('duration helpers', () => {
  it('formats as m:ss under an hour', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(45)).toBe('0:45');
    expect(formatDuration(1530)).toBe('25:30');
  });

  it('formats as h:mm:ss from one hour', () => {
    expect(formatDuration(3600)).toBe('1:00:00');
    expect(formatDuration(5405)).toBe('1:30:05');
  });

  it('splits into minutes (unbounded) and seconds', () => {
    expect(splitDuration(5405)).toEqual({ min: 90, sec: 5 });
    expect(splitDuration(-3)).toEqual({ min: 0, sec: 0 });
  });

  it('joins minutes + seconds and clamps', () => {
    expect(joinDuration(25, 30)).toBe(1530);
    expect(joinDuration(-1, 10)).toBe(10);
    expect(joinDuration(Number.NaN, 5)).toBe(5);
    expect(joinDuration(100000, 0)).toBe(MAX_SET_DURATION_SECONDS);
  });

  it('clamps arbitrary values to whole seconds', () => {
    expect(clampDuration(12.6)).toBe(13);
    expect(clampDuration(-5)).toBe(0);
    expect(clampDuration(Number.POSITIVE_INFINITY)).toBe(0);
  });
});
