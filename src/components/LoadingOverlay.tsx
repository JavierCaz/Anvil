import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';

interface LoadingOverlayProps {
  visible: boolean;
  /** Optional label under the spinner. Defaults to `common.loading`. */
  label?: string;
}

/**
 * Full-screen loading overlay rendered as a modal, mirroring the confirm
 * dialog's translucent backdrop so in-flight screens (workout session, routine
 * detail, Routines list) never flash their empty state while data loads.
 */
export function LoadingOverlay({ visible, label }: LoadingOverlayProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const text = label ?? t('common.loading');

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {}}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          {text ? (
            <Text style={[styles.label, { color: colors.textSecondary }]}>{text}</Text>
          ) : null}
        </View>
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
    padding: 32,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
