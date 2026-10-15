import type { DetectedPR } from '@/db/gamification';
import { formatPRDetail, formatSessionClock, formatSessionLength, prLabelKey } from '@/utils/recap-format';

const pr = (overrides: Partial<DetectedPR>): DetectedPR => ({
  exerciseId: 1,
  exerciseName: 'Bench Press',
  type: 'weight',
  weight: 100,
  reps: 5,
  oneRM: null,
  durationSeconds: null,
  distanceM: null,
  ...overrides,
});

describe('formatSessionClock', () => {
  it('formats as HH:MM', () => {
    expect(formatSessionClock(0)).toBe('00:00');
    expect(formatSessionClock(4320)).toBe('01:12');
  });
});

describe('formatSessionLength', () => {
  it('uses the largest useful units', () => {
    expect(formatSessionLength(4320)).toBe('1h 12m');
    expect(formatSessionLength(3605)).toBe('1h 00m');
    expect(formatSessionLength(2700)).toBe('45m');
    expect(formatSessionLength(30)).toBe('30s');
  });
});

describe('PR formatting', () => {
  it('maps each PR type to its label key', () => {
    expect(prLabelKey(pr({ type: 'oneRM' }))).toBe('recap.newOneRmPr');
    expect(prLabelKey(pr({ type: 'pace' }))).toBe('recap.newPacePr');
  });

  it('formats lifting and cardio records', () => {
    expect(formatPRDetail(pr({}), 'metric')).toBe('100 kg × 5');
    expect(formatPRDetail(pr({ reps: 0 }), 'metric')).toBe('100 kg');
    expect(
      formatPRDetail(pr({ type: 'pace', weight: 0, reps: 0, distanceM: 5000, durationSeconds: 1500 }), 'metric')
    ).toBe('5 km · 25:00 · 5:00 /km');
  });
});
