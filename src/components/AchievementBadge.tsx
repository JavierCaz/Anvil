import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useId } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { ClipPath, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { getBadgeGlyph } from '@/constants/achievement-glyphs';
import { getAchievementByKey, type AchievementTier } from '@/constants/achievements';

/**
 * Metal finishes for badge rims, light → mid → shadow. A badge is a physical
 * medal, so these are fixed artwork colors rather than theme tokens.
 */
type Finish = AchievementTier | 'forge' | 'locked';

const FINISHES: Record<Finish, readonly [string, string, string]> = {
  bronze: ['#F2B680', '#B8743C', '#6E3D1C'],
  silver: ['#F5F7F9', '#B3BAC3', '#646C77'],
  gold: ['#FFE38F', '#DFA62B', '#93630A'],
  diamond: ['#DDF8FF', '#6DCBE8', '#25779D'],
  forge: ['#FFB37E', '#E86A33', '#93360F'],
  locked: ['#5C616B', '#3B3F47', '#23262C'],
};

/** Inner face of every badge: dark forged iron. */
const FACE = ['#2E323A', '#16181D'] as const;
const LOCKED_GLYPH = '#767B85';

/** Rounded regular polygon (pointy-top), centred at (cx, cy). */
function roundedPolygon(sides: number, cx: number, cy: number, radius: number, corner: number): string {
  const points = Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / sides;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });
  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  });
  const side = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
  const t = Math.min(0.5, corner / side);

  return (
    points
      .map((point, index) => {
        const prev = points[(index + sides - 1) % sides];
        const next = points[(index + 1) % sides];
        const start = lerp(point, prev, t);
        const end = lerp(point, next, t);
        const f = (n: number) => n.toFixed(2);
        return `${index === 0 ? 'M' : 'L'}${f(start.x)} ${f(start.y)} Q${f(point.x)} ${f(point.y)} ${f(end.x)} ${f(end.y)}`;
      })
      .join(' ') + ' Z'
  );
}

const OUTER = roundedPolygon(6, 50, 50, 49, 9);
const INNER = roundedPolygon(6, 50, 50, 40, 7);
// Upper half of the face, for a soft specular sheen.
const SHEEN = 'M15.4 30 L50 10 L84.6 30 L84.6 46 Q50 38 15.4 50 Z';

interface AchievementBadgeProps {
  achievementKey: string;
  /** Edge length of the square badge, in points. */
  size?: number;
  /** Locked badges render in dark iron with a muted glyph. */
  locked?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Hexagonal medal for an achievement: a metal rim in the tier's finish
 * (bronze / silver / gold / diamond, forge orange when untiered) around a
 * dark iron face carrying the achievement's glyph or numeral.
 */
export function AchievementBadge({ achievementKey, size = 48, locked = false, style }: AchievementBadgeProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const definition = getAchievementByKey(achievementKey);
  const glyph = getBadgeGlyph(achievementKey, definition?.category);
  const finish: Finish = locked ? 'locked' : (definition?.tier ?? 'forge');
  const [light, mid, shadow] = FINISHES[finish];
  const glyphColor = locked ? LOCKED_GLYPH : light;

  const rimId = `badge-rim-${uid}`;
  const faceId = `badge-face-${uid}`;
  const clipId = `badge-clip-${uid}`;

  return (
    <View
      style={[{ width: size, height: size }, styles.root, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width={size} height={size} viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={rimId} x1="0.15" y1="0" x2="0.85" y2="1">
            <Stop offset="0" stopColor={light} />
            <Stop offset="0.5" stopColor={mid} />
            <Stop offset="1" stopColor={shadow} />
          </LinearGradient>
          <LinearGradient id={faceId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={FACE[0]} />
            <Stop offset="1" stopColor={FACE[1]} />
          </LinearGradient>
          <ClipPath id={clipId}>
            <Path d={INNER} />
          </ClipPath>
        </Defs>
        <Path d={OUTER} fill={`url(#${rimId})`} />
        <Path d={INNER} fill={`url(#${faceId})`} stroke={light} strokeOpacity={locked ? 0.15 : 0.35} strokeWidth={1.2} />
        <Path d={SHEEN} fill="#FFFFFF" opacity={0.05} clipPath={`url(#${clipId})`} />
      </Svg>

      {'icon' in glyph ? (
        <MaterialCommunityIcons name={glyph.icon} size={size * 0.4} color={glyphColor} />
      ) : (
        <Text
          numberOfLines={1}
          style={[
            styles.numeral,
            {
              color: glyphColor,
              fontSize: size * (glyph.numeral.length > 2 ? 0.24 : 0.3),
            },
          ]}
        >
          {glyph.numeral}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeral: {
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
});
