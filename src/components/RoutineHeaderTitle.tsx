import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { getRoutineGlyph } from '@/constants/routine-icons';
import { useAppTheme } from '@/theme/app-theme-provider';
import { radius } from '@/theme/tokens';

interface RoutineHeaderTitleProps {
  name: string;
  /** Preset icon key; null falls back to the default glyph. */
  icon: string | null | undefined;
}

/** Navigation-bar title: the routine's icon in a tinted well, then its name. */
export function RoutineHeaderTitle({ name, icon }: RoutineHeaderTitleProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel={name}>
      <View style={[styles.well, { backgroundColor: colors.primarySoft }]}>
        <MaterialCommunityIcons name={getRoutineGlyph(icon)} size={18} color={colors.primary} />
      </View>
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: 240,
  },
  well: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '800',
  },
});
