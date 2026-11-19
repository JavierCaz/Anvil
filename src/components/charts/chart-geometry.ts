/**
 * Pure layout maths shared by the SVG charts (no React, no drawing), so it
 * can be unit-tested and reused for hit-testing and tooltip placement.
 */

export interface Point {
  x: number;
  y: number;
}

export type Scale = (value: number) => number;

/**
 * Linear map from `domain` to `range`. A zero-width domain maps every value
 * to the middle of the range (e.g. a single data point).
 */
export function linearScale([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  const span = d1 - d0;
  if (span === 0) {
    const mid = (r0 + r1) / 2;
    return () => mid;
  }
  return (value) => r0 + ((value - d0) / span) * (r1 - r0);
}

export interface BarLayout {
  /** Width of each of the n equal slots the bars sit in. */
  slotWidth: number;
  /** Drawn width of each bar. */
  barWidth: number;
  /** Bottom of the bars (value 0). */
  baseline: number;
  /** Centre x of the bar at `index`. */
  x: Scale;
  /** Top y of a bar with `value`. */
  y: Scale;
}

/**
 * Bars centred in `count` equal slots across `width`, each `1 - innerPadding`
 * of its slot wide, scaled from 0 (bottom) to `maxValue` (`topPadding` px
 * below the top). An all-zero series still gets a 0–1 scale.
 */
export function barLayout(
  count: number,
  maxValue: number,
  width: number,
  height: number,
  { innerPadding, topPadding }: { innerPadding: number; topPadding: number }
): BarLayout {
  const slotWidth = count > 0 ? width / count : 0;
  const y = linearScale([0, maxValue > 0 ? maxValue : 1], [height, topPadding]);
  return {
    slotWidth,
    barWidth: slotWidth * (1 - innerPadding),
    baseline: height,
    x: (index) => (index + 0.5) * slotWidth,
    y,
  };
}

/**
 * Control points of a natural cubic spline through `values` (one axis),
 * solved with the Thomas algorithm — the same curve as d3's `curveNatural`.
 */
function naturalControlPoints(values: readonly number[]): [number[], number[]] {
  'worklet';
  const n = values.length - 1;
  const a = new Array<number>(n);
  const b = new Array<number>(n);
  const r = new Array<number>(n);
  a[0] = 0;
  b[0] = 2;
  r[0] = values[0] + 2 * values[1];
  for (let i = 1; i < n - 1; i++) {
    a[i] = 1;
    b[i] = 4;
    r[i] = 4 * values[i] + 2 * values[i + 1];
  }
  a[n - 1] = 2;
  b[n - 1] = 7;
  r[n - 1] = 8 * values[n - 1] + values[n];
  for (let i = 1; i < n; i++) {
    const m = a[i] / b[i - 1];
    b[i] -= m;
    r[i] -= m * r[i - 1];
  }
  a[n - 1] = r[n - 1] / b[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    a[i] = (r[i] - a[i + 1]) / b[i];
  }
  b[n - 1] = (values[n] + a[n - 1]) / 2;
  for (let i = 0; i < n - 1; i++) {
    b[i] = 2 * values[i + 1] - a[i + 1];
  }
  return [a, b];
}

const fmt = (value: number) => {
  'worklet';
  return Math.round(value * 100) / 100;
};

/**
 * SVG path data for a smooth natural-spline line through `points` (sorted by
 * x). One point yields a bare move; two a straight segment. Runs on the UI
 * thread too (animated line morphs), hence the worklet directive.
 */
export function naturalCurvePath(points: readonly Point[]): string {
  'worklet';
  if (points.length === 0) return '';
  let d = `M${fmt(points[0].x)},${fmt(points[0].y)}`;
  if (points.length === 1) return d;
  if (points.length === 2) return `${d}L${fmt(points[1].x)},${fmt(points[1].y)}`;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const [ax, bx] = naturalControlPoints(xs);
  const [ay, by] = naturalControlPoints(ys);
  for (let i = 0; i < points.length - 1; i++) {
    d +=
      `C${fmt(ax[i])},${fmt(ay[i])},${fmt(bx[i])},${fmt(by[i])},` +
      `${fmt(points[i + 1].x)},${fmt(points[i + 1].y)}`;
  }
  return d;
}

export interface SliceAngles {
  /** Degrees, clockwise from 3 o'clock. */
  start: number;
  end: number;
}

/**
 * Start/end angles of each slice, sweeping clockwise from 3 o'clock in data
 * order (the layout `sliceAt` hit-tests against).
 */
export function sliceAngles(values: readonly number[], total: number): SliceAngles[] {
  let start = 0;
  return values.map((value) => {
    const sweep = total > 0 ? (value / total) * 360 : 0;
    const angles = { start, end: start + sweep };
    start += sweep;
    return angles;
  });
}

/** Point on a circle at `degrees` clockwise from 3 o'clock (screen coordinates). */
export function polar(cx: number, cy: number, radius: number, degrees: number): Point {
  const radians = (degrees * Math.PI) / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

/**
 * SVG path data for a ring segment between `innerRadius` and `outerRadius`,
 * from `start` to `end` degrees (clockwise from 3 o'clock). A full turn is
 * drawn as two half-arcs, since a single SVG arc can't close on itself.
 */
export function ringSlicePath(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  start: number,
  end: number
): string {
  const sweep = end - start;
  if (sweep <= 0) return '';
  if (sweep >= 359.999) {
    const half = start + 180;
    return [
      ringSlicePath(cx, cy, outerRadius, innerRadius, start, half),
      ringSlicePath(cx, cy, outerRadius, innerRadius, half, start + 360),
    ].join('');
  }
  const largeArc = sweep > 180 ? 1 : 0;
  const o0 = polar(cx, cy, outerRadius, start);
  const o1 = polar(cx, cy, outerRadius, end);
  const i1 = polar(cx, cy, innerRadius, end);
  const i0 = polar(cx, cy, innerRadius, start);
  return (
    `M${fmt(o0.x)},${fmt(o0.y)}` +
    `A${fmt(outerRadius)},${fmt(outerRadius)},0,${largeArc},1,${fmt(o1.x)},${fmt(o1.y)}` +
    `L${fmt(i1.x)},${fmt(i1.y)}` +
    `A${fmt(innerRadius)},${fmt(innerRadius)},0,${largeArc},0,${fmt(i0.x)},${fmt(i0.y)}Z`
  );
}
