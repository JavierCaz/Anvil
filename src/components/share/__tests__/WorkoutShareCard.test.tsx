import { render, screen } from '@testing-library/react-native';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { WorkoutShareCard } from '@/components/share/WorkoutShareCard';
import type { RecapExercise, WorkoutRecap } from '@/db/gamification';
import en from '@/i18n/locales/en.json';

// AnvilLogo imports the theme provider, which pulls in expo-router (untransformed
// ESM under Jest). The share card itself only uses the brand palette.
jest.mock('@/theme/app-theme-provider', () => ({
  useAppTheme: () => ({ scheme: 'dark', colors: jest.requireActual('@/theme/colors').darkColors }),
}));

// eslint-disable-next-line import/no-named-as-default-member
void i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

const exercise = (id: number, name: string): RecapExercise => ({
  exerciseId: id,
  name,
  setsCompleted: 3,
  bestWeightKg: 100,
  bestReps: 5,
  totalDistanceM: 0,
  totalDurationSeconds: 0,
});

const makeRecap = (overrides: Partial<WorkoutRecap> = {}): WorkoutRecap => ({
  routineName: 'Push Day',
  summary: {
    durationSeconds: 4320,
    totalVolumeKg: 8450,
    setsCompleted: 24,
    totalDistanceM: 0,
    timedSeconds: 0,
  },
  volumeDeltaPct: null,
  prs: [],
  milestonesUnlocked: [],
  nextMilestone: null,
  maxWeightKg: 100,
  consistency: { weeklyGoal: 0 } as WorkoutRecap['consistency'],
  achievementsUnlocked: [],
  finishedAt: '2026-08-01T10:40:00.000Z',
  exercises: [exercise(1, 'Bench Press')],
  ...overrides,
});

const renderCard = (layout: 'recap' | 'stats' | 'highlights' | 'full', recap = makeRecap()) =>
  render(<WorkoutShareCard recap={recap} layout={layout} tone="light" unitSystem="metric" />);

describe('WorkoutShareCard', () => {
  it('recap layout mirrors every section of the Workout Complete modal', async () => {
    await renderCard(
      'recap',
      makeRecap({
        volumeDeltaPct: 12,
        summary: { durationSeconds: 4320, totalVolumeKg: 8450, setsCompleted: 24, totalDistanceM: 5000, timedSeconds: 600 },
        prs: [
          {
            exerciseId: 1,
            exerciseName: 'Bench Press',
            type: 'weight',
            weight: 100,
            reps: 5,
            oneRM: null,
            durationSeconds: null,
            distanceM: null,
          },
        ],
        consistency: { weeklyDays: 3, weeklyGoal: 3, hitThisWeek: true, consistencyStreakWeeks: 2 },
        nextMilestone: {
          key: 'comparative_motorcycle',
          thresholdKg: 200,
          icon: '🏍️',
          nameKey: 'achievements.comparatives.motorcycle.name',
          descriptionKey: 'achievements.comparatives.motorcycle.description',
        },
      })
    );
    expect(screen.getByText('Workout Complete')).toBeTruthy();
    expect(screen.getByText('24')).toBeTruthy();
    expect(screen.getByText('8,450 kg')).toBeTruthy();
    expect(screen.getByText('+12%')).toBeTruthy();
    expect(screen.getByText('5 km')).toBeTruthy();
    expect(screen.getByText('10:00')).toBeTruthy();
    expect(screen.getByText('1 records forged')).toBeTruthy();
    expect(screen.getByText('New weight PR · 100 kg × 5')).toBeTruthy();
    expect(screen.getByText('Next milestone', { exact: false })).toBeTruthy();
    expect(screen.getByText('100 kg to go')).toBeTruthy();
    expect(screen.getByText('3/3 workouts this week', { exact: false })).toBeTruthy();
    expect(screen.getByText('2-week consistency streak')).toBeTruthy();
  });

  it('stats layout shows the headline numbers', async () => {
    await renderCard('stats');
    expect(screen.getByText('Push Day')).toBeTruthy();
    expect(screen.getByText('1h 12m')).toBeTruthy();
    expect(screen.getByText('8,450 kg')).toBeTruthy();
    expect(screen.getByText('24')).toBeTruthy();
  });

  it('highlights layout shows the volume comparison and PRs', async () => {
    await renderCard(
      'highlights',
      makeRecap({
        prs: [
          {
            exerciseId: 1,
            exerciseName: 'Bench Press',
            type: 'weight',
            weight: 100,
            reps: 5,
            oneRM: null,
            durationSeconds: null,
            distanceM: null,
          },
        ],
      })
    );
    expect(screen.getByText('🚗')).toBeTruthy();
    expect(screen.getByText('≈ 8.5 × Compact Car')).toBeTruthy();
    expect(screen.getByText('1 record forged')).toBeTruthy();
    expect(screen.getByText('New weight PR · 100 kg × 5')).toBeTruthy();
  });

  it('full layout lists up to five exercises and counts the rest', async () => {
    const exercises = Array.from({ length: 7 }, (_, index) => exercise(index + 1, `Exercise ${index + 1}`));
    await renderCard('full', makeRecap({ exercises }));
    expect(screen.getByText('Exercise 5')).toBeTruthy();
    expect(screen.queryByText('Exercise 6')).toBeNull();
    expect(screen.getByText('+2 more')).toBeTruthy();
    expect(screen.getAllByText('3 sets · 100 kg × 5')).toHaveLength(5);
  });

  it('hides volume for a pure cardio session', async () => {
    await renderCard(
      'stats',
      makeRecap({
        summary: { durationSeconds: 1800, totalVolumeKg: 0, setsCompleted: 1, totalDistanceM: 5000, timedSeconds: 1800 },
      })
    );
    expect(screen.queryByText('Volume')).toBeNull();
    expect(screen.getByText('5 km')).toBeTruthy();
  });
});
