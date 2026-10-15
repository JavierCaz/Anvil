import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';
import type { WorkoutRecap } from '@/db/gamification';
import type { UnitSystem } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import { palette } from '@/theme/colors';
import { radius, shape, typography } from '@/theme/tokens';
import { copyShareImage, saveShareImage, shareShareImage, ShareImageError } from './share-image';
import {
  SHARE_CARD_HEIGHT,
  SHARE_CARD_WIDTH,
  SHARE_LAYOUTS,
  WorkoutShareCard,
  type ShareLayout,
  type ShareTone,
} from './WorkoutShareCard';

interface WorkoutSharePanelProps {
  recap: WorkoutRecap;
  unitSystem: UnitSystem;
  /** Returns to the recap. */
  onBack: () => void;
}

type ShareAction = 'copy' | 'save' | 'share';

interface Status {
  kind: 'success' | 'error';
  text: string;
}

/**
 * The share step of the post-workout recap. Rendered inside the recap modal
 * (no stacked modals): pick a layout + text tone, then copy / save / share the
 * transparent story sticker. Feedback is inline because app toasts render
 * beneath a native modal.
 */
export function WorkoutSharePanel({ recap, unitSystem, onBack }: WorkoutSharePanelProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { height: windowHeight } = useWindowDimensions();
  const captureTarget = useRef<View>(null);

  const [layout, setLayout] = useState<ShareLayout>('recap');
  const [tone, setTone] = useState<ShareTone>('light');
  const [pageWidth, setPageWidth] = useState(0);
  const [busy, setBusy] = useState<ShareAction | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  // Fit the 9:16 preview into the modal on small and large phones alike.
  const previewHeight = Math.min(400, Math.max(260, Math.round(windowHeight * 0.42)));
  const scale = previewHeight / SHARE_CARD_HEIGHT;
  const previewWidth = SHARE_CARD_WIDTH * scale;
  const layoutIndex = SHARE_LAYOUTS.indexOf(layout);

  const onPageEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageWidth <= 0) {
      return;
    }
    const index = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    const next = SHARE_LAYOUTS[Math.min(SHARE_LAYOUTS.length - 1, Math.max(0, index))];
    if (next !== layout) {
      setLayout(next);
      void Haptics.selectionAsync();
    }
  };

  const run = async (action: ShareAction) => {
    if (busy) {
      return;
    }
    setBusy(action);
    setStatus(null);
    try {
      if (action === 'copy') {
        await copyShareImage(captureTarget);
        setStatus({ kind: 'success', text: `${t('recap.share.copied')} · ${t('recap.share.copiedHint')}` });
      } else if (action === 'save') {
        await saveShareImage(captureTarget);
        setStatus({ kind: 'success', text: t('recap.share.saved') });
      } else {
        await shareShareImage(captureTarget);
      }
      if (action !== 'share') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      const denied = error instanceof ShareImageError && error.reason === 'permissionDenied';
      setStatus({ kind: 'error', text: t(denied ? 'recap.share.permissionDenied' : 'recap.share.failed') });
    } finally {
      setBusy(null);
    }
  };

  const actions: { key: ShareAction; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    // Only iOS stories turn a pasted image into a sticker.
    ...(Platform.OS === 'ios' ? [{ key: 'copy' as const, icon: 'copy-outline' as const, label: t('recap.share.copy') }] : []),
    { key: 'save', icon: 'download-outline', label: t('recap.share.save') },
    { key: 'share', icon: 'share-outline', label: t('recap.share.share') },
  ];

  const checker = tone === 'light' ? [palette.iron, palette.textSecondaryLight] : [palette.white, palette.borderLight];

  return (
    <View style={styles.root}>
      {/* Full-size capture target. It stays mounted in the window (Android
          can't snapshot detached views) but is clipped out of sight; the
          native snapshot draws the view itself, ignoring ancestor clipping. */}
      <View style={styles.captureClip} pointerEvents="none" importantForAccessibility="no-hide-descendants">
        <WorkoutShareCard ref={captureTarget} recap={recap} layout={layout} tone={tone} unitSystem={unitSystem} />
      </View>

      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('recap.share.back')}
          onPress={onBack}
          hitSlop={10}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[typography.heading, { color: colors.text }]}>{t('recap.share.title')}</Text>
      </View>

      <View onLayout={(event) => setPageWidth(event.nativeEvent.layout.width)}>
        {pageWidth > 0 && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onPageEnd}
          >
            {SHARE_LAYOUTS.map((item) => (
              <View key={item} style={[styles.page, { width: pageWidth }]}>
                <View
                  style={[styles.preview, { width: previewWidth, height: previewHeight }]}
                  accessibilityLabel={t(`recap.share.layouts.${item}`)}
                >
                  <Svg style={StyleSheet.absoluteFill}>
                    <Defs>
                      <Pattern id={`checker-${item}`} width={16} height={16} patternUnits="userSpaceOnUse">
                        <Rect width={16} height={16} fill={checker[0]} />
                        <Rect width={8} height={8} fill={checker[1]} />
                        <Rect x={8} y={8} width={8} height={8} fill={checker[1]} />
                      </Pattern>
                    </Defs>
                    <Rect width="100%" height="100%" fill={`url(#checker-${item})`} />
                  </Svg>
                  <WorkoutShareCard
                    recap={recap}
                    layout={item}
                    tone={tone}
                    unitSystem={unitSystem}
                    style={{
                      position: 'absolute',
                      left: (previewWidth - SHARE_CARD_WIDTH) / 2,
                      top: (previewHeight - SHARE_CARD_HEIGHT) / 2,
                      transform: [{ scale }],
                    }}
                  />
                </View>
                <Text style={[styles.layoutName, { color: colors.textSecondary }]}>
                  {t(`recap.share.layouts.${item}`)}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
        <View style={styles.dots}>
          {SHARE_LAYOUTS.map((item, index) => (
            <View
              key={item}
              style={[styles.dot, { backgroundColor: index === layoutIndex ? colors.primary : colors.border }]}
            />
          ))}
        </View>
      </View>

      <View style={styles.toneRow}>
        {(['light', 'dark'] as const).map((value) => {
          const selected = value === tone;
          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setTone(value)}
              style={[
                shape.chip,
                {
                  backgroundColor: selected ? colors.primarySoft : 'transparent',
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.chipLabel, { color: selected ? colors.primary : colors.textSecondary }]}>
                {t(`recap.share.tone.${value}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text
        style={[
          styles.status,
          {
            color:
              status?.kind === 'error' ? colors.error : status?.kind === 'success' ? colors.success : colors.textSecondary,
          },
        ]}
        accessibilityLiveRegion="polite"
      >
        {status?.text ?? t(Platform.OS === 'ios' ? 'recap.share.tip.ios' : 'recap.share.tip.android')}
      </Text>

      <View style={styles.actions}>
        {actions.map(({ key, icon, label }, index) => {
          const primary = index === 0;
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              disabled={busy !== null}
              onPress={() => void run(key)}
              style={({ pressed }) => [
                primary ? shape.primaryButton : shape.secondaryButton,
                styles.action,
                primary
                  ? { backgroundColor: colors.primary }
                  : { borderColor: colors.border, backgroundColor: colors.surfaceElevated },
                { opacity: pressed || (busy !== null && busy !== key) ? 0.7 : 1 },
              ]}
            >
              {busy === key ? (
                <ActivityIndicator color={primary ? colors.onPrimary : colors.text} />
              ) : (
                <Ionicons name={icon} size={18} color={primary ? colors.onPrimary : colors.text} />
              )}
              <Text style={[typography.button, styles.actionLabel, { color: primary ? colors.onPrimary : colors.text }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 12,
  },
  captureClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButton: {
    marginLeft: -4,
  },
  page: {
    alignItems: 'center',
    gap: 8,
  },
  preview: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  layoutName: {
    ...typography.overline,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  toneRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  status: {
    fontSize: 13,
    textAlign: 'center',
    minHeight: 36,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 8,
    gap: 6,
  },
  actionLabel: {
    fontSize: 14,
  },
});
