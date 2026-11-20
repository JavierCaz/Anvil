import {
  barLayout,
  linearScale,
  naturalCurvePath,
  polar,
  ringSlicePath,
  sliceAngles,
} from '@/components/charts/chart-geometry';
import { sliceAt } from '@/components/charts/slice-hit-test';

describe('linearScale', () => {
  it('maps the domain onto the range (including inverted ranges)', () => {
    const y = linearScale([0, 10], [100, 0]);
    expect(y(0)).toBe(100);
    expect(y(5)).toBe(50);
    expect(y(10)).toBe(0);
  });

  it('centres everything when the domain has no span', () => {
    const x = linearScale([3, 3], [10, 110]);
    expect(x(3)).toBe(60);
    expect(x(99)).toBe(60);
  });
});

describe('barLayout', () => {
  const layout = barLayout(4, 20, 400, 180, { innerPadding: 0.5, topPadding: 16 });

  it('centres bars in equal slots', () => {
    expect(layout.slotWidth).toBe(100);
    expect(layout.barWidth).toBe(50);
    expect(layout.x(0)).toBe(50);
    expect(layout.x(3)).toBe(350);
  });

  it('scales values from the baseline to just below the top padding', () => {
    expect(layout.baseline).toBe(180);
    expect(layout.y(0)).toBe(180);
    expect(layout.y(20)).toBe(16);
    expect(layout.y(10)).toBe(98);
  });

  it('keeps a usable scale for an all-zero series', () => {
    const empty = barLayout(3, 0, 300, 100, { innerPadding: 0.4, topPadding: 10 });
    expect(empty.y(0)).toBe(100);
    expect(Number.isFinite(empty.y(1))).toBe(true);
  });
});

describe('naturalCurvePath', () => {
  it('handles degenerate series', () => {
    expect(naturalCurvePath([])).toBe('');
    expect(naturalCurvePath([{ x: 1, y: 2 }])).toBe('M1,2');
    expect(naturalCurvePath([{ x: 0, y: 0 }, { x: 10, y: 5 }])).toBe('M0,0L10,5');
  });

  it('draws one cubic segment per gap, ending exactly on each point', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 0 },
      { x: 30, y: 10 },
    ];
    const d = naturalCurvePath(points);
    const segments = d.split('C').slice(1);
    expect(d.startsWith('M0,0')).toBe(true);
    expect(segments).toHaveLength(3);
    segments.forEach((segment, index) => {
      const coords = segment.split(',').map(Number);
      expect(coords.slice(-2)).toEqual([points[index + 1].x, points[index + 1].y]);
    });
  });

  it('keeps a straight line straight', () => {
    const d = naturalCurvePath([
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ]);
    // Every control point of a natural spline through collinear points is on the line y = x.
    const numbers = d.replace(/[MC]/g, ',').split(',').filter(Boolean).map(Number);
    for (let i = 0; i < numbers.length; i += 2) {
      expect(numbers[i + 1]).toBeCloseTo(numbers[i], 5);
    }
  });
});

describe('donut geometry', () => {
  it('sweeps slices clockwise from 3 o’clock in data order', () => {
    expect(sliceAngles([1, 1, 2], 4)).toEqual([
      { start: 0, end: 90 },
      { start: 90, end: 180 },
      { start: 180, end: 360 },
    ]);
  });

  it('agrees with the tap hit-test at each slice’s mid-angle', () => {
    const values = [3, 1, 5, 2];
    const total = 11;
    const size = 200;
    sliceAngles(values, total).forEach(({ start, end }, index) => {
      const mid = polar(100, 100, 90, (start + end) / 2);
      expect(sliceAt(values.map((value) => ({ value })), total, size, mid.x, mid.y)).toBe(index);
    });
  });

  it('places polar points in screen coordinates', () => {
    const below = polar(100, 100, 50, 90); // 6 o'clock
    expect(below.x).toBeCloseTo(100);
    expect(below.y).toBeCloseTo(150);
  });

  it('builds closed ring segments, splitting a full turn into two arcs', () => {
    const quarter = ringSlicePath(100, 100, 100, 74, 0, 90);
    expect(quarter.startsWith('M200,100')).toBe(true);
    expect(quarter.match(/A/g)).toHaveLength(2);
    expect(quarter.endsWith('Z')).toBe(true);
    expect(ringSlicePath(100, 100, 100, 74, 0, 360).match(/A/g)).toHaveLength(4);
    expect(ringSlicePath(100, 100, 100, 74, 45, 45)).toBe('');
  });

  it('uses the large-arc flag only for sweeps over 180°', () => {
    expect(ringSlicePath(100, 100, 100, 74, 0, 90)).toContain('A100,100,0,0,1');
    expect(ringSlicePath(100, 100, 100, 74, 0, 270)).toContain('A100,100,0,1,1');
  });
});
