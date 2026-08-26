import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/app-theme-provider';

interface ScreenProps {
  children: ReactNode;
  /**
   * Safe-area edges to pad. Defaults to top/left/right — the tab bar already
   * handles the bottom inset on screens inside `(tabs)`.
   */
  edges?: readonly Edge[];
  style?: StyleProp<ViewStyle>;
}

/** Themed full-height screen container with safe-area insets. */
export function Screen({ children, edges = ['top', 'left', 'right'], style }: ScreenProps) {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.root, { backgroundColor: colors.background }, style]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
