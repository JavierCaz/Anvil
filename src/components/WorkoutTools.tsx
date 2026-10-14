import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '@/components/ToastProvider';
import {
  getStopwatchElapsedMs,
  getTimerRemainingMs,
  getTimerStatus,
  isStopwatchActive,
  TIMER_ADJUST_SECONDS,
  TIMER_PRESETS_SECONDS,
  useWorkoutToolsStore,
} from '@/store/workout-tools';
import { useAppTheme } from '@/theme/app-theme-provider';
import { withAlpha } from '@/theme/colors';
import { hairline, radius, shape, typography } from '@/theme/tokens';
import {
  ALARM_SOUND,
  cancelAlarmNotification,
  configureAlarmAudioMode,
  dismissAlarmNotification,
  playAlarm,
  scheduleAlarmNotification,
} from '@/utils/alarm';

/** Identifier of the workout timer's scheduled background alarm. */
const WORKOUT_TIMER_NOTIFICATION_ID = 'anvil-workout-timer';

/** Android notification channel used by the workout timer alarm. */
const WORKOUT_TIMER_CHANNEL_ID = 'workout-timer';

/**
 * A deadline callback that runs later than this was frozen in the background —
 * the notification already sounded, so the in-app chime is skipped.
 */
const LATE_FIRE_THRESHOLD_MS = 1500;

type ToolTab = 'timer' | 'stopwatch';

/** `m:ss` countdown, rounding up so the display hits 0:00 exactly at the deadline. */
export function formatTimer(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** `m:ss.t` (or `h:mm:ss.t` past an hour) stopwatch reading. */
export function formatStopwatch(ms: number, withTenths = true): string {
  const tenths = Math.floor(ms / 100) % 10;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const base =
    hours > 0
      ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${minutes}:${String(seconds).padStart(2, '0')}`;
  return withTenths ? `${base}.${tenths}` : base;
}

/**
 * Re-render on an interval while `enabled`, returning the current time. The
 * first sync runs in a layout effect so a freshly started timer never paints
 * one frame with a stale clock. Callers only read `now` while running.
 */
function useNow(intervalMs: number, enabled: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    const update = () => setNow(Date.now());
    update();
    const interval = setInterval(update, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs, enabled]);
  return now;
}

/**
 * Headless alarm for the workout timer. Mount it once for the whole session
 * (the session screen stays mounted while exercise screens are pushed on top)
 * so the timer rings wherever the user is in the workout.
 *
 * Mirrors `RestTimer`: a background notification is scheduled for the
 * deadline, and in the foreground the in-app chime + vibration play instead.
 */
export function WorkoutTimerAlarm() {
  const { t } = useTranslation();
  const toast = useToast();
  const player = useAudioPlayer(ALARM_SOUND);
  const endAt = useWorkoutToolsStore((state) => state.timer.endAt);

  useEffect(() => {
    configureAlarmAudioMode();
  }, []);

  // (Re)arm the alarm whenever the deadline changes; pausing/resetting clears it.
  useEffect(() => {
    if (endAt === null) {
      cancelAlarmNotification(WORKOUT_TIMER_NOTIFICATION_ID);
      return;
    }

    const finish = () => {
      const late = Date.now() - endAt > LATE_FIRE_THRESHOLD_MS;
      if (AppState.currentState === 'active' && !late) {
        playAlarm(player);
        toast.show({ icon: '⏱️', title: t('workout.tools.timerFinished') });
      } else {
        // Ran out while backgrounded — the notification already sounded.
        dismissAlarmNotification(WORKOUT_TIMER_NOTIFICATION_ID);
      }
      useWorkoutToolsStore.getState().finishTimer();
    };

    const msLeft = endAt - Date.now();
    void scheduleAlarmNotification({
      identifier: WORKOUT_TIMER_NOTIFICATION_ID,
      channelId: WORKOUT_TIMER_CHANNEL_ID,
      channelName: t('workout.tools.timer'),
      title: t('workout.tools.timerFinished'),
      body: t('workout.tools.timerFinishedBody'),
      delaySeconds: msLeft / 1000,
    });
    const timeout = setTimeout(finish, Math.max(0, msLeft));

    // JS timers are frozen in the background — catch up as soon as we return.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && Date.now() >= endAt) {
        clearTimeout(timeout);
        finish();
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.remove();
    };
  }, [endAt, player, t, toast]);

  // Session over — drop any pending alarm.
  useEffect(() => {
    return () => cancelAlarmNotification(WORKOUT_TIMER_NOTIFICATION_ID);
  }, []);

  return null;
}

interface WorkoutToolsButtonProps {
  onPress: () => void;
}

/**
 * Header button that opens the workout tools. While the timer or stopwatch is
 * running it shows a live readout next to the icon.
 */
export function WorkoutToolsButton({ onPress }: WorkoutToolsButtonProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const timer = useWorkoutToolsStore((state) => state.timer);
  const stopwatch = useWorkoutToolsStore((state) => state.stopwatch);

  const timerStatus = getTimerStatus(timer);
  const stopwatchActive = isStopwatchActive(stopwatch);
  const ticking = timerStatus === 'running' || stopwatch.startedAt !== null;
  const now = useNow(500, ticking);

  // The timer takes precedence — a countdown is the more time-sensitive readout.
  let readout: string | null = null;
  let readoutColor = colors.primary;
  let icon: keyof typeof Ionicons.glyphMap = 'stopwatch-outline';
  if (timerStatus !== 'idle') {
    readout = formatTimer(getTimerRemainingMs(timer, now));
    icon = 'timer-outline';
  } else if (stopwatchActive) {
    readout = formatStopwatch(getStopwatchElapsedMs(stopwatch, now), false);
    readoutColor = colors.accent;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('workout.tools.open')}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.headerButton,
        readout && { backgroundColor: withAlpha(readoutColor, 0.14) },
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <Ionicons name={icon} size={22} color={readout ? readoutColor : colors.textSecondary} />
      {readout && (
        <Text style={[styles.headerReadout, { color: readoutColor }]}>{readout}</Text>
      )}
    </Pressable>
  );
}

interface WorkoutToolsSheetProps {
  visible: boolean;
  onClose: () => void;
}

/** Bottom sheet with the workout timer and stopwatch. */
export function WorkoutToolsSheet({ visible, onClose }: WorkoutToolsSheetProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<ToolTab>('timer');

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              paddingBottom: insets.bottom + 20,
            },
          ]}
        >
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />
          <View style={styles.sheetHeader}>
            <View style={[styles.segmented, { backgroundColor: colors.background, borderColor: colors.border }]}>
              {(['timer', 'stopwatch'] as const).map((value) => {
                const selected = tab === value;
                return (
                  <Pressable
                    key={value}
                    accessibilityRole="tab"
                    accessibilityState={{ selected }}
                    onPress={() => setTab(value)}
                    style={[
                      styles.segment,
                      selected && { backgroundColor: colors.surfaceElevated },
                    ]}
                  >
                    <Ionicons
                      name={value === 'timer' ? 'timer-outline' : 'stopwatch-outline'}
                      size={16}
                      color={selected ? colors.text : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.segmentLabel,
                        { color: selected ? colors.text : colors.textSecondary },
                      ]}
                    >
                      {t(`workout.tools.${value}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              hitSlop={8}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Only tick while the sheet is on screen. */}
          {visible && (tab === 'timer' ? <TimerPanel /> : <StopwatchPanel />)}
        </View>
      </View>
    </Modal>
  );
}

function TimerPanel() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const timer = useWorkoutToolsStore((state) => state.timer);
  const { setTimerDuration, startTimer, pauseTimer, resetTimer, adjustTimer } =
    useWorkoutToolsStore.getState();

  const status = getTimerStatus(timer);
  const now = useNow(250, status === 'running');
  const remainingMs = getTimerRemainingMs(timer, now);

  const handlePrimary = () => {
    void Haptics.selectionAsync();
    if (status === 'running') {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const primaryLabel =
    status === 'running'
      ? t('workout.tools.pause')
      : status === 'paused'
        ? t('workout.tools.resume')
        : t('workout.tools.start');

  return (
    <View style={styles.panel}>
      <View style={styles.adjustRow}>
        <AdjustButton
          label={`−${TIMER_ADJUST_SECONDS}s`}
          accessibilityLabel={t('workout.tools.subtractSeconds', { seconds: TIMER_ADJUST_SECONDS })}
          onPress={() => adjustTimer(-TIMER_ADJUST_SECONDS)}
        />
        <Text
          accessibilityRole="timer"
          style={[
            styles.bigTime,
            { color: status === 'paused' ? colors.textSecondary : colors.text },
          ]}
        >
          {formatTimer(remainingMs)}
        </Text>
        <AdjustButton
          label={`+${TIMER_ADJUST_SECONDS}s`}
          accessibilityLabel={t('workout.tools.addSeconds', { seconds: TIMER_ADJUST_SECONDS })}
          onPress={() => adjustTimer(TIMER_ADJUST_SECONDS)}
        />
      </View>

      <View style={styles.presets}>
        {TIMER_PRESETS_SECONDS.map((seconds) => {
          const selected = status === 'idle' && timer.durationSeconds === seconds;
          return (
            <Pressable
              key={seconds}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: status !== 'idle' }}
              disabled={status !== 'idle'}
              onPress={() => setTimerDuration(seconds)}
              style={({ pressed }) => [
                styles.preset,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? colors.primarySoft : 'transparent',
                  opacity: status !== 'idle' ? 0.4 : pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.presetLabel,
                  { color: selected ? colors.primary : colors.text },
                  selected && styles.presetLabelSelected,
                ]}
              >
                {formatTimer(seconds * 1000)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ControlRow
        secondaryLabel={t('workout.tools.reset')}
        secondaryDisabled={status === 'idle'}
        onSecondary={resetTimer}
        primaryLabel={primaryLabel}
        primaryRunning={status === 'running'}
        onPrimary={handlePrimary}
      />
    </View>
  );
}

function StopwatchPanel() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const stopwatch = useWorkoutToolsStore((state) => state.stopwatch);
  const { startStopwatch, pauseStopwatch, resetStopwatch, lapStopwatch } =
    useWorkoutToolsStore.getState();

  const running = stopwatch.startedAt !== null;
  const active = isStopwatchActive(stopwatch);
  const now = useNow(100, running);
  const elapsedMs = getStopwatchElapsedMs(stopwatch, now);

  const handlePrimary = () => {
    void Haptics.selectionAsync();
    if (running) {
      pauseStopwatch();
    } else {
      startStopwatch();
    }
  };

  // Running → "Lap"; paused → "Reset"; idle → disabled "Lap".
  const handleSecondary = () => {
    void Haptics.selectionAsync();
    if (running) {
      lapStopwatch();
    } else {
      resetStopwatch();
    }
  };

  const primaryLabel = running
    ? t('workout.tools.pause')
    : active
      ? t('workout.tools.resume')
      : t('workout.tools.start');

  // Newest lap first, each with its split and the cumulative time.
  const laps = stopwatch.laps
    .map((total, index) => ({
      number: index + 1,
      split: total - (index > 0 ? stopwatch.laps[index - 1] : 0),
      total,
    }))
    .reverse();

  return (
    <View style={styles.panel}>
      <Text
        accessibilityRole="timer"
        style={[styles.bigTime, { color: running || !active ? colors.text : colors.textSecondary }]}
      >
        {formatStopwatch(elapsedMs)}
      </Text>

      <ControlRow
        secondaryLabel={running || !active ? t('workout.tools.lap') : t('workout.tools.reset')}
        secondaryDisabled={!active}
        onSecondary={handleSecondary}
        primaryLabel={primaryLabel}
        primaryRunning={running}
        onPrimary={handlePrimary}
      />

      {laps.length > 0 && (
        <ScrollView style={styles.laps} contentContainerStyle={styles.lapsContent}>
          {laps.map((lap) => (
            <View key={lap.number} style={[styles.lapRow, { borderColor: colors.border }]}>
              <Text style={[styles.lapLabel, { color: colors.textSecondary }]}>
                {t('workout.tools.lapNumber', { number: lap.number })}
              </Text>
              <Text style={[styles.lapSplit, { color: colors.text }]}>
                {formatStopwatch(lap.split)}
              </Text>
              <Text style={[styles.lapTotal, { color: colors.textSecondary }]}>
                {formatStopwatch(lap.total)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

interface AdjustButtonProps {
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
}

function AdjustButton({ label, accessibilityLabel, onPress }: AdjustButtonProps) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.adjustButton,
        { backgroundColor: colors.primarySoft, opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <Text style={[styles.adjustLabel, { color: colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

interface ControlRowProps {
  secondaryLabel: string;
  secondaryDisabled: boolean;
  onSecondary: () => void;
  primaryLabel: string;
  /** Running → the primary button is a (muted) pause instead of a forge-orange start. */
  primaryRunning: boolean;
  onPrimary: () => void;
}

function ControlRow({
  secondaryLabel,
  secondaryDisabled,
  onSecondary,
  primaryLabel,
  primaryRunning,
  onPrimary,
}: ControlRowProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.controls}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: secondaryDisabled }}
        disabled={secondaryDisabled}
        onPress={onSecondary}
        style={({ pressed }) => [
          shape.secondaryButton,
          styles.controlButton,
          {
            borderColor: colors.border,
            opacity: secondaryDisabled ? 0.4 : pressed ? 0.6 : 1,
          },
        ]}
      >
        <Text style={[typography.button, { color: colors.text }]}>{secondaryLabel}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onPrimary}
        style={({ pressed }) => [
          shape.primaryButton,
          styles.controlButton,
          {
            backgroundColor: primaryRunning ? colors.warning : colors.primary,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text style={[typography.button, { color: colors.onPrimary }]}>{primaryLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  headerReadout: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.xl + 4,
    borderTopRightRadius: radius.xl + 4,
    borderWidth: hairline,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  segmented: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: radius.md,
    borderWidth: hairline,
    padding: 4,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.sm,
    paddingVertical: 9,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  panel: {
    alignItems: 'center',
    gap: 20,
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  adjustButton: {
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
    minWidth: 68,
    alignItems: 'center',
  },
  adjustLabel: {
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  bigTime: {
    fontSize: 60,
    fontWeight: '800',
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  preset: {
    ...shape.chip,
  },
  presetLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: 12,
  },
  controlButton: {
    flex: 1,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  presetLabelSelected: {
    fontWeight: '800',
  },
  laps: {
    alignSelf: 'stretch',
    maxHeight: 200,
  },
  lapsContent: {
    paddingBottom: 4,
  },
  lapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
  },
  lapLabel: {
    flex: 1,
    fontSize: 14,
  },
  lapSplit: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  lapTotal: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
});
