/**
 * Custom app dialog — a themed replacement for the native `Alert`.
 *
 * Rendered once from the root layout via `AppDialogProvider` and triggered
 * imperatively from anywhere with `useDialog().alert(...)`. Mirrors the
 * native API shape (title / message / buttons) but is styled with the app
 * theme (dark mode aware, brand colors, subtle scale-in animation).
 */
import { Ionicons } from '@expo/vector-icons';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { withAlpha, type ThemeColors } from '@/theme/colors';
import { hairline, radius, shape, typography } from '@/theme/tokens';
import { useAppTheme } from '@/theme/app-theme-provider';

export type DialogButtonStyle = 'default' | 'cancel' | 'destructive';

export interface DialogButton {
  text: string;
  style?: DialogButtonStyle;
  onPress?: () => void;
}

/** Colors the icon for the dialog's purpose. */
export type DialogTone = 'info' | 'success' | 'error' | 'warning';

export interface DialogOptions {
  title?: string;
  message?: string;
  /** Optional Ionicons name shown above the title. */
  icon?: keyof typeof Ionicons.glyphMap;
  tone?: DialogTone;
  /** Rendered stacked in order. Defaults to a single "OK" button. */
  buttons?: DialogButton[];
}

interface DialogApi {
  alert: (options: DialogOptions) => void;
}

const DialogContext = createContext<DialogApi | null>(null);

function toneColor(tone: DialogTone, colors: ThemeColors): string {
  switch (tone) {
    case 'success':
      return colors.success;
    case 'error':
      return colors.error;
    case 'warning':
      return colors.warning;
    case 'info':
      return colors.primary;
  }
}

/**
 * Button treatment by role: the first default action is the filled forge CTA,
 * further defaults are tinted, destructive is error-tinted, cancel is outlined.
 */
function buttonAppearance(
  button: DialogButton,
  isFirstDefault: boolean,
  colors: ThemeColors
): { background: string; border: string; label: string } {
  switch (button.style) {
    case 'destructive':
      return { background: withAlpha(colors.error, 0.14), border: 'transparent', label: colors.error };
    case 'cancel':
      return { background: 'transparent', border: colors.border, label: colors.text };
    default:
      return isFirstDefault
        ? { background: colors.primary, border: 'transparent', label: colors.onPrimary }
        : { background: colors.primarySoft, border: 'transparent', label: colors.primary };
  }
}

export function AppDialogProvider({ children }: { children: ReactNode }) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [options, setOptions] = useState<DialogOptions | null>(null);

  // Stable Animated values (lazy state, not refs — satisfies the React Compiler ref rule).
  const [scale] = useState(() => new Animated.Value(0.92));
  const [fade] = useState(() => new Animated.Value(0));

  const alert = useCallback((next: DialogOptions) => setOptions(next), []);
  const close = useCallback(() => setOptions(null), []);
  const api = useMemo<DialogApi>(() => ({ alert }), [alert]);

  // Scale + fade the card in whenever a dialog opens.
  useEffect(() => {
    if (options) {
      scale.setValue(0.92);
      fade.setValue(0);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 280 }),
        Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [options, scale, fade]);

  const buttons =
    options && options.buttons && options.buttons.length > 0
      ? options.buttons
      : [{ text: t('common.ok') }];
  const tone = options?.tone ?? 'info';

  const handlePress = (button: DialogButton) => {
    close();
    button.onPress?.();
  };

  return (
    <DialogContext.Provider value={api}>
      {children}
      <Modal
        transparent
        visible={options !== null}
        animationType="fade"
        onRequestClose={close}
        statusBarTranslucent
      >
        <View style={styles.backdrop}>
          <Animated.View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: fade,
                transform: [{ scale }],
              },
            ]}
          >
            {options?.icon ? (
              <View style={[styles.iconWrap, { backgroundColor: withAlpha(toneColor(tone, colors), 0.14) }]}>
                <Ionicons name={options.icon} size={28} color={toneColor(tone, colors)} />
              </View>
            ) : null}
            {options?.title ? (
              <Text style={[styles.title, { color: colors.text }]}>{options.title}</Text>
            ) : null}
            {options?.message ? (
              <Text style={[styles.message, { color: colors.textSecondary }]}>
                {options.message}
              </Text>
            ) : null}
            <View style={styles.buttonGroup}>
              {buttons.map((button, index) => {
                const firstDefaultIndex = buttons.findIndex(
                  (candidate) => (candidate.style ?? 'default') === 'default'
                );
                const look = buttonAppearance(button, index === firstDefaultIndex, colors);
                return (
                  <Pressable
                    key={index}
                    accessibilityRole="button"
                    onPress={() => handlePress(button)}
                    style={({ pressed }) => [
                      shape.secondaryButton,
                      {
                        backgroundColor: look.background,
                        borderColor: look.border,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.buttonLabel, { color: look.label }]}>{button.text}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogApi {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within an AppDialogProvider');
  }
  return context;
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
    borderRadius: radius.xl,
    borderWidth: hairline,
    padding: 22,
    paddingTop: 26,
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    ...typography.heading,
    fontSize: 19,
    textAlign: 'center',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 18,
  },
  buttonGroup: {
    alignSelf: 'stretch',
    gap: 8,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
});
