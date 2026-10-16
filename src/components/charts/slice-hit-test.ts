/** Inner radius of the ring, as a share of the outer radius. */
export const INNER_RATIO = 0.74;
/** Extra px around the ring that still counts as a tap on it. */
const HIT_SLOP = 10;

/**
 * Index of the slice under a tap at (x, y) in a `size` square, or `null` for
 * the hole / outside the ring. Mirrors victory's layout: slices sweep
 * clockwise from 3 o'clock in data order.
 */
export function sliceAt(
  slices: readonly { value: number }[],
  total: number,
  size: number,
  x: number,
  y: number
): number | null {
  const radius = size / 2;
  const dx = x - radius;
  const dy = y - radius;
  const distance = Math.hypot(dx, dy);
  if (total <= 0 || distance < radius * INNER_RATIO - HIT_SLOP || distance > radius + HIT_SLOP) {
    return null;
  }
  const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
  let end = 0;
  for (let index = 0; index < slices.length; index++) {
    end += (slices[index].value / total) * 360;
    if (angle < end) return index;
  }
  return slices.length - 1;
}
