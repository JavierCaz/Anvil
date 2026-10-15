import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';
import { hairline, radius } from '@/theme/tokens';

interface GoalToggleButtonProps {
  /** Whether the inline goal editor is open. */
  editing: boolean;
  /** Whether a goal already exists ("Edit goal" vs "Set goal"). */
  hasGoal: boolean;
  onPress: () => void;
}

/** Small pill that opens / closes a card's inline goal editor. */
export function GoalToggleButton({ editing, hasGoal, onPress }: GoalToggleButtonProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const label = editing ? t('common.done') : hasGoal ? t('home.editGoal') : t('home.setGoal');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: editing }}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: editing ? colors.primary : colors.primarySoft,
          borderColor: editing ? colors.primary : colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Ionicons
        name={editing ? 'checkmark' : 'flag-outline'}
        size={13}
        color={editing ? colors.onPrimary : colors.primary}
      />
      <Text style={[styles.label, { color: editing ? colors.onPrimary : colors.primary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: hairline,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
  },
});
