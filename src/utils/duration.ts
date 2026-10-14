/** Longest duration a single set can record: 23:59:59. */
export const MAX_SET_DURATION_SECONDS = 24 * 3600 - 1;

/** Seconds as `m:ss`, or `h:mm:ss` from one hour up. */
export function formatDuration(totalSeconds: number): string {
  const total = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const ss = String(seconds).padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${ss}`;
  }
  return `${minutes}:${ss}`;
}

/** Split seconds into whole minutes (unbounded) + remaining seconds. */
export function splitDuration(totalSeconds: number): { min: number; sec: number } {
  const total = Math.max(0, Math.round(totalSeconds));
  return { min: Math.floor(total / 60), sec: total % 60 };
}

/** Join minutes + seconds into total seconds, clamped to a valid set duration. */
export function joinDuration(min: number, sec: number): number {
  const minutes = Number.isFinite(min) ? Math.max(0, Math.floor(min)) : 0;
  const seconds = Number.isFinite(sec) ? Math.max(0, Math.floor(sec)) : 0;
  return clampDuration(minutes * 60 + seconds);
}

/** Clamp to `[0, MAX_SET_DURATION_SECONDS]` whole seconds. */
export function clampDuration(totalSeconds: number): number {
  if (!Number.isFinite(totalSeconds)) {
    return 0;
  }
  return Math.min(MAX_SET_DURATION_SECONDS, Math.max(0, Math.round(totalSeconds)));
}
