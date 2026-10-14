import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';
import { radius } from '@/theme/tokens';

interface StepIconProps {
  kind: 'plus' | 'minus';
  disabled?: boolean;
  size?: number;
}

/**
 * Rounded-square stepper face: a forge-tinted "+" and a quiet "−", dimmed when
 * disabled. Wrap in a Pressable that owns the press handling.
 */
export function StepIcon({ kind, disabled = false, size = 42 }: StepIconProps) {
  const { colors } = useAppTheme();
  const plus = kind === 'plus';
  return (
    <View
      style={[
        styles.button,
        {
          width: size,
          height: size,
          backgroundColor: plus ? colors.primarySoft : colors.surfaceElevated,
          opacity: disabled ? 0.35 : 1,
        },
      ]}
    >
      <Ionicons name={plus ? 'add' : 'remove'} size={size * 0.48} color={plus ? colors.primary : colors.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
