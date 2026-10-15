import type { DetectedPR } from '@/db/gamification';
import type { UnitSystem } from '@/store/units';
import { formatDistanceWithUnit, formatPace } from '@/utils/distance';
import { formatDuration } from '@/utils/duration';
import { formatWeightWithUnit } from '@/utils/weight';

/**
 * Display helpers shared by the post-workout recap and its share image.
 */

/** Session length as `HH:MM` (the recap header's clock style). */
export function formatSessionClock(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return [hours, minutes].map((value) => String(value).padStart(2, '0')).join(':');
}

/** Session length as `1h 12m` / `45m` / `30s` (share-image style). */
export function formatSessionLength(totalSeconds: number): string {
  const total = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${total}s`;
}

/** i18n key for a PR's headline ("New weight PR", "Best pace", ...). */
export function prLabelKey(pr: DetectedPR): string {
  switch (pr.type) {
    case 'weight':
      return 'recap.newWeightPr';
    case 'oneRM':
      return 'recap.newOneRmPr';
    case 'distance':
      return 'recap.newDistancePr';
    case 'duration':
      return 'recap.newDurationPr';
    case 'pace':
      return 'recap.newPacePr';
  }
}

/** The record-setting set, e.g. "100 kg × 5", "5.2 km · 25:10 · 4:50 /km". */
export function formatPRDetail(pr: DetectedPR, unit: UnitSystem): string {
  if (pr.type === 'weight' || pr.type === 'oneRM') {
    // Loaded carries/holds log 0 reps — show just the load.
    return pr.reps > 0
      ? `${formatWeightWithUnit(pr.weight, unit)} × ${pr.reps}`
      : formatWeightWithUnit(pr.weight, unit);
  }
  const parts: string[] = [];
  if (pr.distanceM) {
    // Sub-kilometre efforts (carries, laps) read better in m / yd.
    parts.push(formatDistanceWithUnit(pr.distanceM, unit, pr.distanceM < 1000 ? 'short' : 'long'));
  }
  if (pr.durationSeconds) {
    parts.push(formatDuration(pr.durationSeconds));
  }
  if (pr.type === 'pace' && pr.durationSeconds && pr.distanceM) {
    const pace = formatPace(pr.durationSeconds, pr.distanceM, unit);
    if (pace) {
      parts.push(pace);
    }
  }
  return parts.join(' · ');
}
