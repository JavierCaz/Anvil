import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useState, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { AchievementBadge } from '@/components/AchievementBadge';
import { AnvilMark } from '@/components/AnvilLogo';
import { getAchievementByKey } from '@/constants/achievements';
import { getVolumeComparison } from '@/constants/weight-comparatives';
import type { RecapExercise, WorkoutRecap } from '@/db/gamification';
import type { UnitSystem } from '@/store/units';
import { palette, withAlpha } from '@/theme/colors';
import { formatDistanceWithUnit } from '@/utils/distance';
import { formatDuration } from '@/utils/duration';
import { formatPRDetail, formatSessionLength, prLabelKey } from '@/utils/recap-format';
import { formatWeight, formatWeightGrouped, formatWeightWithUnit, weightUnitLabel } from '@/utils/weight';

/**
 * The story sticker: a 9:16 card with a fully transparent background, meant
 * to be captured as a PNG and laid over the user's own photo in IG/FB stories.
 *
 * Colors come from the brand `palette` on purpose — the image must look the
 * same regardless of the app's light/dark scheme; `tone` picks text color for
 * the photo it will sit on.
 */

export type ShareLayout = 'recap' | 'stats' | 'highlights' | 'full';
export type ShareTone = 'light' | 'dark';

export const SHARE_LAYOUTS: readonly ShareLayout[] = ['recap', 'stats', 'highlights', 'full'];

/** Logical canvas size; captured at 3× for a 1080×1920 story. */
export const SHARE_CARD_WIDTH = 360;
export const SHARE_CARD_HEIGHT = 640;

const MAX_PRS = 3;
const MAX_EXERCISES = 5;
/** Caps for the `recap` layout, which mirrors the whole post-workout modal. */
const MAX_RECAP_PRS = 4;
const MAX_RECAP_MILESTONES = 3;
const MAX_RECAP_ACHIEVEMENTS = 4;
const CANVAS_PADDING_Y = 48;

interface WorkoutShareCardProps {
  recap: WorkoutRecap;
  layout: ShareLayout;
  tone: ShareTone;
  unitSystem: UnitSystem;
  style?: StyleProp<ViewStyle>;
  /** Capture target for `react-native-view-shot`. */
  ref?: Ref<View>;
}

interface ToneColors {
  text: string;
  muted: string;
  accent: string;
  rule: string;
  shadow: TextStyle;
}

function toneColors(tone: ShareTone): ToneColors {
  const light = tone === 'light';
  return {
    text: light ? palette.white : palette.textLight,
    muted: withAlpha(light ? palette.white : palette.textLight, 0.78),
    accent: palette.forge,
    rule: withAlpha(light ? palette.white : palette.textLight, 0.35),
    // A soft halo keeps text legible on busy photos.
    shadow: {
      textShadowColor: light ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.45)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 6,
    },
  };
}

export function WorkoutShareCard({ recap, layout, tone, unitSystem, style, ref }: WorkoutShareCardProps) {
  const { t, i18n } = useTranslation();
  const c = toneColors(tone);
  // The recap layout can outgrow the canvas on big sessions — measure its
  // natural height and shrink it to fit (transforms don't affect layout).
  const [contentHeight, setContentHeight] = useState(0);
  const available = SHARE_CARD_HEIGHT - CANVAS_PADDING_Y * 2;
  const fitScale = contentHeight > available ? available / contentHeight : 1;
  const { summary } = recap;

  const hasCardio = summary.totalDistanceM > 0 || summary.timedSeconds > 0;
  // A pure cardio session has no lifting volume — hide it, like the recap.
  const showVolume = summary.totalVolumeKg > 0 || !hasCardio;
  const volume = `${formatWeightGrouped(summary.totalVolumeKg, unitSystem)} ${weightUnitLabel(unitSystem)}`;
  const date = dayjs(recap.finishedAt ?? undefined).locale(i18n.language).format('MMM D, YYYY');
  const title = recap.routineName ?? t('recap.title');

  const label = (text: string) => (
    <Text style={[styles.label, { color: c.accent }]}>{text}</Text>
  );

  const header = (
    <View style={styles.header}>
      <Text style={[styles.title, c.shadow, { color: c.text }]} numberOfLines={2}>
        {title}
      </Text>
      <Text style={[styles.date, c.shadow, { color: c.muted }]}>{date}</Text>
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      <AnvilMark width={44} />
      <Text style={[styles.wordmark, c.shadow, { color: c.text }]}>{t('common.appName').toUpperCase()}</Text>
    </View>
  );

  const more = (count: number) =>
    count > 0 ? (
      <Text style={[styles.listDetail, c.shadow, { color: c.muted }]}>{t('recap.share.more', { count })}</Text>
    ) : null;

  const statCell = (labelText: string, value: string, color = c.text) => (
    <View style={styles.statCell}>
      {label(labelText)}
      <Text style={[styles.rowValue, c.shadow, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );

  /** Everything the Workout Complete modal shows, section by section. */
  const renderRecap = () => {
    const { consistency, prs, milestonesUnlocked, nextMilestone, achievementsUnlocked } = recap;
    const delta = recap.volumeDeltaPct;
    const achievements = achievementsUnlocked.filter((entry) => getAchievementByKey(entry.key));
    const shownPrs = prs.slice(0, MAX_RECAP_PRS);
    const shownMilestones = milestonesUnlocked.slice(0, MAX_RECAP_MILESTONES);
    const shownAchievements = achievements.slice(0, MAX_RECAP_ACHIEVEMENTS);

    return (
      <View
        style={[styles.recapContent, { transform: [{ scale: fitScale }] }]}
        onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}
      >
        <View style={styles.header}>
          <Text style={[styles.label, { color: c.accent }]}>{t('recap.title')}</Text>
          <Text style={[styles.title, c.shadow, { color: c.text }]} numberOfLines={2}>
            {recap.routineName ?? t('recap.title')}
          </Text>
          <Text style={[styles.date, c.shadow, { color: c.muted }]}>
            {date} · {formatSessionLength(summary.durationSeconds)}
          </Text>
        </View>

        <View style={[styles.statsRow, { borderColor: c.rule }]}>
          {statCell(t('recap.share.labels.sets'), String(summary.setsCompleted))}
          {showVolume && statCell(t('recap.share.labels.volume'), volume)}
          {showVolume &&
            delta !== null &&
            statCell(t('recap.volumeDelta'), `${delta >= 0 ? '+' : ''}${delta}%`, delta >= 0 ? palette.success : c.muted)}
        </View>

        {hasCardio && (
          <View style={[styles.statsRow, { borderColor: c.rule }]}>
            {summary.totalDistanceM > 0 &&
              statCell(t('recap.share.labels.distance'), formatDistanceWithUnit(summary.totalDistanceM, unitSystem))}
            {summary.timedSeconds > 0 && statCell(t('recap.timedTime'), formatDuration(summary.timedSeconds))}
          </View>
        )}

        {shownPrs.length > 0 && (
          <View style={styles.section}>
            {label(t('recap.recordsForged', { count: prs.length }))}
            {shownPrs.map((pr) => (
              <View key={`${pr.exerciseId}-${pr.type}`} style={styles.listRow}>
                <Text style={styles.rowIcon}>🏆</Text>
                <View style={styles.listBody}>
                  <Text style={[styles.rowName, c.shadow, { color: c.text }]} numberOfLines={1}>
                    {pr.exerciseName}
                  </Text>
                  <Text style={[styles.rowDetail, c.shadow, { color: c.muted }]} numberOfLines={1}>
                    {t(prLabelKey(pr))} · {formatPRDetail(pr, unitSystem)}
                  </Text>
                </View>
              </View>
            ))}
            {more(prs.length - shownPrs.length)}
          </View>
        )}

        {(shownMilestones.length > 0 || nextMilestone) && (
          <View style={styles.section}>
            {label(t('recap.milestoneUnlocked'))}
            {shownMilestones.map((milestone) => (
              <View key={`${milestone.key}-${milestone.exerciseName}`} style={styles.listRow}>
                <AchievementBadge achievementKey={milestone.key} size={28} />
                <View style={styles.listBody}>
                  <Text style={[styles.rowName, c.shadow, { color: c.text }]} numberOfLines={1}>
                    {t(milestone.nameKey)} · {formatWeightWithUnit(milestone.thresholdKg, unitSystem)}
                  </Text>
                  {milestone.exerciseName ? (
                    <Text style={[styles.rowDetail, c.shadow, { color: c.muted }]} numberOfLines={1}>
                      {milestone.exerciseName}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
            {more(milestonesUnlocked.length - shownMilestones.length)}
            {nextMilestone && (
              <View style={styles.listRow}>
                <AchievementBadge achievementKey={nextMilestone.key} size={28} locked />
                <View style={styles.listBody}>
                  <Text style={[styles.rowDetail, c.shadow, { color: c.muted }]} numberOfLines={1}>
                    {t('recap.nextMilestone')}: {t(nextMilestone.nameKey)} —{' '}
                    {formatWeightWithUnit(nextMilestone.thresholdKg, unitSystem)}
                  </Text>
                  <Text style={[styles.rowDetail, c.shadow, { color: c.muted }]} numberOfLines={1}>
                    {t('recap.nextMilestoneToGo', {
                      weight: formatWeight(Math.max(0, nextMilestone.thresholdKg - recap.maxWeightKg), unitSystem),
                      unit: weightUnitLabel(unitSystem),
                    })}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {consistency.weeklyGoal > 0 && (
          <View style={styles.section}>
            {label(t('recap.consistency'))}
            <View style={styles.listRow}>
              <Text style={styles.rowIcon}>📅</Text>
              <View style={styles.listBody}>
                <Text style={[styles.rowName, c.shadow, { color: c.text }]} numberOfLines={1}>
                  {t('recap.workoutsThisWeek', { done: consistency.weeklyDays, goal: consistency.weeklyGoal })}
                  {consistency.hitThisWeek ? (
                    <Text style={{ color: palette.success }}> · {t('recap.perfectWeek')}</Text>
                  ) : null}
                </Text>
                {consistency.consistencyStreakWeeks > 0 && (
                  <Text style={[styles.rowDetail, c.shadow, { color: c.muted }]} numberOfLines={1}>
                    {t('recap.weekStreak', { count: consistency.consistencyStreakWeeks })}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {shownAchievements.length > 0 && (
          <View style={styles.section}>
            {label(t('recap.achievementsUnlocked'))}
            {shownAchievements.map(({ key, exerciseName }) => {
              const definition = getAchievementByKey(key);
              return definition ? (
                <View key={`${key}-${exerciseName ?? ''}`} style={styles.listRow}>
                  <AchievementBadge achievementKey={definition.key} size={28} />
                  <View style={styles.listBody}>
                    <Text style={[styles.rowName, c.shadow, { color: c.text }]} numberOfLines={1}>
                      {t(definition.nameKey)}
                    </Text>
                    {exerciseName ? (
                      <Text style={[styles.rowDetail, c.shadow, { color: c.muted }]} numberOfLines={1}>
                        {exerciseName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ) : null;
            })}
            {more(achievements.length - shownAchievements.length)}
          </View>
        )}

        {footer}
      </View>
    );
  };

  const renderStats = () => (
    <>
      {header}
      <View style={styles.bigStats}>
        <View style={styles.bigStat}>
          {label(t('recap.share.labels.time'))}
          <Text style={[styles.bigValue, c.shadow, { color: c.text }]}>
            {formatSessionLength(summary.durationSeconds)}
          </Text>
        </View>
        {showVolume && (
          <View style={styles.bigStat}>
            {label(t('recap.share.labels.volume'))}
            <Text style={[styles.bigValue, c.shadow, { color: c.text }]} numberOfLines={1} adjustsFontSizeToFit>
              {volume}
            </Text>
          </View>
        )}
        {summary.totalDistanceM > 0 && (
          <View style={styles.bigStat}>
            {label(t('recap.share.labels.distance'))}
            <Text style={[styles.bigValue, c.shadow, { color: c.text }]}>
              {formatDistanceWithUnit(summary.totalDistanceM, unitSystem)}
            </Text>
          </View>
        )}
        <View style={styles.bigStat}>
          {label(t('recap.share.labels.sets'))}
          <Text style={[styles.bigValue, c.shadow, { color: c.text }]}>{summary.setsCompleted}</Text>
        </View>
      </View>
      {footer}
    </>
  );

  const renderStatsRow = () => (
    <View style={[styles.statsRow, { borderColor: c.rule }]}>
      <View style={styles.statCell}>
        {label(t('recap.share.labels.time'))}
        <Text style={[styles.rowValue, c.shadow, { color: c.text }]}>{formatSessionLength(summary.durationSeconds)}</Text>
      </View>
      {showVolume ? (
        <View style={styles.statCell}>
          {label(t('recap.share.labels.volume'))}
          <Text style={[styles.rowValue, c.shadow, { color: c.text }]} numberOfLines={1} adjustsFontSizeToFit>
            {volume}
          </Text>
        </View>
      ) : (
        <View style={styles.statCell}>
          {label(t('recap.share.labels.distance'))}
          <Text style={[styles.rowValue, c.shadow, { color: c.text }]} numberOfLines={1} adjustsFontSizeToFit>
            {formatDistanceWithUnit(summary.totalDistanceM, unitSystem)}
          </Text>
        </View>
      )}
      <View style={styles.statCell}>
        {label(t('recap.share.labels.prs'))}
        <Text style={[styles.rowValue, c.shadow, { color: c.text }]}>{recap.prs.length}</Text>
      </View>
    </View>
  );

  const renderHighlights = () => {
    const comparison = showVolume ? getVolumeComparison(summary.totalVolumeKg) : null;
    const prs = recap.prs.slice(0, MAX_PRS);
    return (
      <>
        {header}
        {comparison && (
          <View style={styles.comparison}>
            <Text style={styles.comparisonIcon}>{comparison.comparative.icon}</Text>
            <Text style={[styles.comparisonValue, c.shadow, { color: c.text }]} numberOfLines={1} adjustsFontSizeToFit>
              {t('recap.share.comparison', {
                count: comparison.count,
                name: t(comparison.comparative.nameKey),
              })}
            </Text>
            <Text style={[styles.comparisonCaption, c.shadow, { color: c.muted }]}>
              {t('recap.share.comparisonCaption', { weight: volume })}
            </Text>
          </View>
        )}
        {prs.length > 0 ? (
          <View style={styles.list}>
            {label(t('recap.share.prsCount', { count: recap.prs.length }))}
            {prs.map((pr) => (
              <View key={`${pr.exerciseId}-${pr.type}`} style={styles.listRow}>
                <Text style={styles.trophy}>🏆</Text>
                <View style={styles.listBody}>
                  <Text style={[styles.listName, c.shadow, { color: c.text }]} numberOfLines={1}>
                    {pr.exerciseName}
                  </Text>
                  <Text style={[styles.listDetail, c.shadow, { color: c.muted }]} numberOfLines={1}>
                    {t(prLabelKey(pr))} · {formatPRDetail(pr, unitSystem)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          renderStatsRow()
        )}
        {footer}
      </>
    );
  };

  const exerciseDetail = (exercise: RecapExercise) => {
    const sets = t('recap.sets', { count: exercise.setsCompleted });
    if (exercise.bestWeightKg > 0) {
      const best = formatWeightWithUnit(exercise.bestWeightKg, unitSystem);
      return `${sets} · ${exercise.bestReps > 0 ? `${best} × ${exercise.bestReps}` : best}`;
    }
    if (exercise.totalDistanceM > 0) {
      return `${sets} · ${formatDistanceWithUnit(exercise.totalDistanceM, unitSystem, exercise.totalDistanceM < 1000 ? 'short' : 'long')}`;
    }
    if (exercise.totalDurationSeconds > 0) {
      return `${sets} · ${formatDuration(exercise.totalDurationSeconds)}`;
    }
    return exercise.bestReps > 0 ? `${sets} · × ${exercise.bestReps}` : sets;
  };

  const renderFull = () => {
    const shown = recap.exercises.slice(0, MAX_EXERCISES);
    const more = recap.exercises.length - shown.length;
    return (
      <>
        {header}
        {renderStatsRow()}
        {shown.length > 0 && (
          <View style={styles.list}>
            {label(t('recap.share.labels.exercises'))}
            {shown.map((exercise) => (
              <View key={exercise.exerciseId} style={styles.exerciseRow}>
                <Text style={[styles.listName, styles.exerciseName, c.shadow, { color: c.text }]} numberOfLines={1}>
                  {exercise.name}
                </Text>
                <Text style={[styles.listDetail, c.shadow, { color: c.muted }]} numberOfLines={1}>
                  {exerciseDetail(exercise)}
                </Text>
              </View>
            ))}
            {more > 0 && (
              <Text style={[styles.listDetail, c.shadow, { color: c.muted }]}>
                {t('recap.share.more', { count: more })}
              </Text>
            )}
          </View>
        )}
        {footer}
      </>
    );
  };

  return (
    <View ref={ref} collapsable={false} style={[styles.canvas, style]}>
      {layout === 'recap' && renderRecap()}
      {layout === 'stats' && renderStats()}
      {layout === 'highlights' && renderHighlights()}
      {layout === 'full' && renderFull()}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: SHARE_CARD_WIDTH,
    height: SHARE_CARD_HEIGHT,
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
    paddingVertical: CANVAS_PADDING_Y,
    justifyContent: 'center',
    gap: 28,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  bigStats: {
    gap: 18,
  },
  bigStat: {
    gap: 2,
  },
  bigValue: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  comparison: {
    alignItems: 'flex-start',
    gap: 2,
  },
  comparisonIcon: {
    fontSize: 64,
  },
  comparisonValue: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  comparisonCaption: {
    fontSize: 15,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 14,
    gap: 12,
  },
  statCell: {
    flex: 1,
    gap: 4,
  },
  rowValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  list: {
    gap: 10,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trophy: {
    fontSize: 22,
  },
  listBody: {
    flex: 1,
    gap: 1,
  },
  listName: {
    fontSize: 17,
    fontWeight: '700',
  },
  listDetail: {
    fontSize: 14,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  exerciseRow: {
    gap: 1,
  },
  exerciseName: {
    flexShrink: 1,
  },
  recapContent: {
    gap: 16,
  },
  section: {
    gap: 7,
  },
  rowIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  rowName: {
    fontSize: 15,
    fontWeight: '700',
  },
  rowDetail: {
    fontSize: 13,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 5,
  },
});
