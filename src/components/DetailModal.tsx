import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/app-theme-provider';
import { hairline, radius, shape, typography } from '@/theme/tokens';

interface DetailModalProps {
  onClose: () => void;
  children: ReactNode;
}

/**
 * Reusable detail-card modal shell (themed, subtle scale+fade entrance,
 * tap-outside / back / button to dismiss). Used by achievement and exercise
 * info cards — the caller supplies the card content via `children`.
 */
export function DetailModal({ onClose, children }: DetailModalProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Stable Animated values (lazy state, not refs — satisfies the React Compiler ref rule).
  const [scale] = useState(() => new Animated.Value(0.92));
  const [fade] = useState(() => new Animated.Value(0));

  useEffect(() => {
    scale.setValue(0.92);
    fade.setValue(0);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 280 }),
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [scale, fade]);

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.cancel')}
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: fade,
              transform: [{ scale }],
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          {children}
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [
              shape.primaryButton,
              styles.closeButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[typography.button, { color: colors.onPrimary }]}>{t('common.ok')}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    borderRadius: radius.xl + 4,
    borderWidth: hairline,
    paddingHorizontal: 22,
    paddingTop: 24,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'stretch',
    minHeight: 50,
  },
});
