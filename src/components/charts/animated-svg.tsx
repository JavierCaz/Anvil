import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Path, Rect } from 'react-native-svg';
import { naturalCurvePath, type Point } from '@/components/charts/chart-geometry';

/** Shared timing for chart transitions. */
const TIMING = { duration: 450, easing: Easing.out(Easing.cubic) };

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface AnimatedBarProps {
  /** Centre x of the bar. */
  x: number;
  width: number;
  /** Top of the bar. */
  top: number;
  /** Bottom of the bar (value 0). */
  baseline: number;
  /** Corner radius; the bar extends this far below the baseline so the clip hides its bottom corners. */
  radius: number;
  fill: string;
}

/**
 * A bar with rounded top corners that grows from the baseline on mount and
 * eases to its new height when the value changes. Must be drawn inside a clip
 * at the baseline (see `BarTrendChart`) so only the top corners show.
 */
export function AnimatedBar({ x, width, top, baseline, radius, fill }: AnimatedBarProps) {
  const animatedTop = useSharedValue(baseline);

  useEffect(() => {
    animatedTop.value = withTiming(top, TIMING);
  }, [animatedTop, top]);

  const animatedProps = useAnimatedProps(() => ({
    y: animatedTop.value,
    height: Math.max(0, baseline - animatedTop.value) + radius,
  }));

  return (
    <AnimatedRect
      x={x - width / 2}
      width={width}
      rx={radius}
      ry={radius}
      fill={fill}
      animatedProps={animatedProps}
    />
  );
}

interface AnimatedCurveProps {
  points: readonly Point[];
  stroke: string;
  strokeWidth: number;
}

/**
 * Smooth natural-spline line that morphs from its previous points to new
 * ones. Morphs only between series of equal length; otherwise it redraws in
 * place (point-for-point interpolation would be meaningless).
 */
export function AnimatedCurve({ points, stroke, strokeWidth }: AnimatedCurveProps) {
  const progress = useSharedValue(1);
  const from = useSharedValue<readonly Point[]>(points);
  const to = useSharedValue<readonly Point[]>(points);

  useEffect(() => {
    // Morph from the previous target; snap when the point count changed.
    from.value = to.value.length === points.length ? to.value : points;
    to.value = points;
    progress.value = 0;
    progress.value = withTiming(1, TIMING);
  }, [from, to, progress, points]);

  const animatedProps = useAnimatedProps(() => {
    const t = progress.value;
    const start = from.value;
    const current = to.value.map((point, index) => ({
      x: start[index].x + (point.x - start[index].x) * t,
      y: start[index].y + (point.y - start[index].y) * t,
    }));
    return { d: naturalCurvePath(current) };
  });

  return (
    <AnimatedPath
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      animatedProps={animatedProps}
    />
  );
}
