import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { exerciseFrameSource } from '@/constants/exercises';
import { useAppTheme } from '@/theme/app-theme-provider';

/** Fixed backdrop for pose frames — the artwork is a light silhouette. */
const FRAME_BACKGROUND = '#2C2C2C';
interface ExerciseThumbnailProps {
  /** Catalog slug (e.g. "bench-press") — renders the pose frame when available. */
  slug: string | null | undefined;
  /** Rendered size in px. */
  size?: number;
  borderRadius?: number;
}

/**
 * Exercise visual: the catalog pose frame (frame 1) for catalog exercises,
 * or a themed barbell placeholder for custom exercises without artwork.
 */
export function ExerciseThumbnail({
  slug,
  size = 48,
  borderRadius = 10,
}: ExerciseThumbnailProps) {
  const { colors } = useAppTheme();
  const frame = exerciseFrameSource(slug);

  if (frame) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: FRAME_BACKGROUND,
        }}
      >
        <Image
          source={frame}
          style={{ width: size, height: size }}
          contentFit="contain"
          accessibilityLabel={slug ?? 'exercise'}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons name="barbell-outline" size={size * 0.5} color={colors.textSecondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
