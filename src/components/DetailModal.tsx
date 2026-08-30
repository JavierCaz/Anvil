import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/app-theme-provider';

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
              styles.closeButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.closeLabel}>{t('common.ok')}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 14,
  },
  closeLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
