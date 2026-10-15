import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';

interface ProgressBarProps {
  /** 0..1 — clamped. */
  progress: number;
  /** Fill color; defaults to the forge primary. */
  color?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/** Linear progress: a rounded fill over a quiet track. */
export function ProgressBar({ progress, color, height = 6, style }: ProgressBarProps) {
  const { colors } = useAppTheme();
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: colors.surfaceElevated },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            borderRadius: height / 2,
            backgroundColor: color ?? colors.primary,
            width: `${Math.round(clamped * 100)}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flex: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
