/**
 * Floating in-app notification (toast) system.
 *
 * Rendered once from the root layout via `ToastProvider` and triggered
 * imperatively from anywhere with `useToast().show(...)`. Toasts are queued
 * (one at a time), slide+fade in from the top, auto-dismiss, then the next
 * queued toast takes over. Follows the same provider/animation conventions as
 * `AppDialog` (lazy `useState` for stable `Animated.Value`s — React Compiler
 * ref rule).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/app-theme-provider';

export interface ToastOptions {
  /** Emoji rendered before the title (e.g. an achievement icon). */
  icon?: string;
  title: string;
  description?: string;
  /** How long the toast stays on screen before auto-dismissing. */
  durationMs?: number;
  /** Optional tap handler — dismisses the toast when invoked. */
  onPress?: () => void;
}

interface ToastItem extends ToastOptions {
  id: number;
}

interface ToastApi {
  show: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const DEFAULT_DURATION_MS = 2600;
const ANIM_IN_MS = 220;
const ANIM_OUT_MS = 180;
/**
 * Top offset below the safe-area inset so a toast doesn't overlap a native
 * stack header (the set-logging screen shows one). ~56px clears a standard
 * 44px header; on header-less screens the toast just floats a bit lower.
 */
const TOP_OFFSET = 56;

/**
 * Pressable with animated style support, so the entrance transform is applied
 * directly to the touchable itself — native hit-testing then tracks the visual
 * position and the first tap always registers.
 */
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Single source of truth: the queue. Its head is the visible toast, so a
  // toast needs no separate state — showing pushes, dismissing shifts.
  const [queue, setQueue] = useState<ToastItem[]>([]);
  const current = queue[0] ?? null;

  // Stable Animated values (lazy state, not refs — satisfies the React Compiler ref rule).
  const [translateY] = useState(() => new Animated.Value(-120));
  const [opacity] = useState(() => new Animated.Value(0));

  const nextIdRef = useRef(1);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((options: ToastOptions) => {
    const item: ToastItem = { ...options, id: nextIdRef.current };
    nextIdRef.current += 1;
    setQueue((queued) => [...queued, item]);
  }, []);

  const api = useMemo<ToastApi>(() => ({ show }), [show]);

  // Remove the visible toast. Only animation callbacks call this, never render.
  const dismiss = useCallback(() => {
    setQueue((queued) => queued.slice(1));
  }, []);

  // Animate the current toast in, hold, then animate it out.
  useEffect(() => {
    if (!current) {
      return;
    }
    translateY.setValue(-120);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 260 }),
      Animated.timing(opacity, { toValue: 1, duration: ANIM_IN_MS, useNativeDriver: true }),
    ]).start();

    hideTimerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -120, duration: ANIM_OUT_MS, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: ANIM_OUT_MS, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) {
          dismiss();
        }
      });
    }, current.durationMs ?? DEFAULT_DURATION_MS);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [current, translateY, opacity, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {current && (
        <View
          pointerEvents="box-none"
          style={[
            styles.overlay,
            { top: insets.top + TOP_OFFSET },
          ]}
        >
          <AnimatedPressable
            accessibilityRole={current.onPress ? 'button' : undefined}
            disabled={!current.onPress}
            onPressIn={() => {
              current.onPress?.();
              // Defer dismissal until after the touch gesture completes, so the
              // touch-up isn't delivered to a freshly-mounted modal backdrop.
              setTimeout(dismiss, 150);
            }}
            style={[
              styles.toast,
              {
                backgroundColor: colors.surface,
                borderColor: colors.primary,
                shadowColor: '#000000',
                opacity,
                transform: [{ translateY }],
              },
            ]}
          >
            {current.icon ? <Text style={styles.icon}>{current.icon}</Text> : null}
            <View style={styles.body}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                {current.title}
              </Text>
              {current.description ? (
                <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                  {current.description}
                </Text>
              ) : null}
            </View>
          </AnimatedPressable>
        </View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: '92%',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  icon: {
    fontSize: 26,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
  },
});
