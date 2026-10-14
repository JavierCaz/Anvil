import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';
import { withAlpha } from '@/theme/colors';
import { shape } from '@/theme/tokens';

interface DangerButtonProps {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

/** Outlined destructive action (delete, discard), tinted with the error color. */
export function DangerButton({ label, onPress, icon = 'trash-outline', style }: DangerButtonProps) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        shape.secondaryButton,
        {
          borderColor: withAlpha(colors.error, 0.5),
          backgroundColor: pressed ? withAlpha(colors.error, 0.1) : 'transparent',
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={18} color={colors.error} />
      <Text style={[styles.label, { color: colors.error }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
});
