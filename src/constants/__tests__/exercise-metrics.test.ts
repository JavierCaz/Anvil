import {
  clampIncline,
  distanceScale,
  distanceStep,
  durationStepSeconds,
  getDefaultSetTarget,
  getExerciseMetrics,
  inclineByDefault,
  isDistanceType,
  isFreeWeightEquipment,
  isTimedType,
  supportsIncline,
} from '@/constants/exercise-metrics';

describe('getExerciseMetrics', () => {
  it('logs weight × reps for rep-based types', () => {
    for (const type of ['weight_reps', 'bodyweight_reps', 'assisted_bodyweight']) {
      expect(getExerciseMetrics(type)).toEqual({
        weight: true,
        reps: true,
        duration: false,
        distance: false,
        load: false,
      });
    }
  });

  it('falls back to weight × reps for null / unknown types', () => {
    expect(getExerciseMetrics(null).reps).toBe(true);
    expect(getExerciseMetrics(undefined).weight).toBe(true);
    expect(getExerciseMetrics('something_else').reps).toBe(true);
  });

  it('logs time only for holds', () => {
    expect(getExerciseMetrics('duration')).toEqual({
      weight: false,
      reps: false,
      duration: true,
      distance: false,
      load: true,
    });
    expect(isTimedType('duration')).toBe(true);
    expect(isDistanceType('duration')).toBe(false);
  });

  it('logs distance + time for cardio', () => {
    expect(getExerciseMetrics('distance_duration')).toEqual({
      weight: false,
      reps: false,
      duration: true,
      distance: true,
      load: true,
    });
    expect(isTimedType('distance_duration')).toBe(true);
    expect(isDistanceType('distance_duration')).toBe(true);
  });
});

describe('getDefaultSetTarget', () => {
  it('keeps 3 × 10 with 90 s rest for rep-based exercises', () => {
    expect(getDefaultSetTarget('weight_reps')).toEqual({
      sets: 3,
      reps: 10,
      restSeconds: 90,
      durationSeconds: null,
      distanceM: null,
    });
  });

  it('plans a single 30-minute set for cardio', () => {
    expect(getDefaultSetTarget('distance_duration')).toMatchObject({
      sets: 1,
      restSeconds: 0,
      durationSeconds: 1800,
      distanceM: null,
    });
  });

  it('plans 3 × 30 s holds', () => {
    expect(getDefaultSetTarget('duration')).toMatchObject({
      sets: 3,
      restSeconds: 60,
      durationSeconds: 30,
    });
  });
});

describe('steps', () => {
  it('uses minute steps for cardio and 15 s steps for holds', () => {
    expect(durationStepSeconds('distance_duration')).toBe(60);
    expect(durationStepSeconds('duration')).toBe(15);
  });

  it('uses unit-appropriate distance steps', () => {
    expect(distanceStep('metric')).toBe(0.5);
    expect(distanceStep('imperial')).toBe(0.25);
  });
});

describe('isFreeWeightEquipment', () => {
  it('matches load-bearing equipment case-insensitively', () => {
    expect(isFreeWeightEquipment('Dumbbell')).toBe(true);
    expect(isFreeWeightEquipment('kettlebell')).toBe(true);
    expect(isFreeWeightEquipment('  BARBELL ')).toBe(true);
  });

  it('rejects bodyweight, cardio and unknown equipment', () => {
    expect(isFreeWeightEquipment('Bodyweight')).toBe(false);
    expect(isFreeWeightEquipment('Cardio')).toBe(false);
    expect(isFreeWeightEquipment('Pull-up Bar')).toBe(false);
    expect(isFreeWeightEquipment(null)).toBe(false);
    expect(isFreeWeightEquipment('')).toBe(false);
  });
});

describe('distanceScale', () => {
  it('measures carries and swimming in meters', () => {
    expect(distanceScale('distance_duration', 'farmer-carry', 'Dumbbell')).toBe('short');
    expect(distanceScale('distance_duration', 'swimming', 'Cardio')).toBe('short');
    // Custom carry with free-text equipment.
    expect(distanceScale('distance_duration', null, 'kettlebell')).toBe('short');
  });

  it('measures runs and rides in km / mi', () => {
    expect(distanceScale('distance_duration', 'running', 'Cardio')).toBe('long');
    expect(distanceScale('distance_duration', null, null)).toBe('long');
  });

  it('is irrelevant (long) for non-distance types', () => {
    expect(distanceScale('weight_reps', 'farmer-carry', 'Dumbbell')).toBe('long');
  });

  it('steps 10 m / 10 yd on the short scale', () => {
    expect(distanceStep('metric', 'short')).toBe(10);
    expect(distanceStep('imperial', 'short')).toBe(10);
    expect(distanceStep('metric', 'long')).toBe(0.5);
  });
});

describe('treadmill incline', () => {
  it('is available for treadmill-capable cardio', () => {
    expect(supportsIncline('distance_duration', 'running')).toBe(true);
    expect(supportsIncline('distance_duration', 'walking')).toBe(true);
    expect(supportsIncline('distance_duration', 'treadmill-incline-walk')).toBe(true);
    expect(supportsIncline('duration', 'elliptical')).toBe(true);
  });

  it('is not offered where incline makes no sense', () => {
    expect(supportsIncline('distance_duration', 'swimming')).toBe(false);
    expect(supportsIncline('distance_duration', 'rowing')).toBe(false);
    expect(supportsIncline('distance_duration', 'farmer-carry')).toBe(false);
    expect(supportsIncline('duration', 'plank')).toBe(false);
    expect(supportsIncline('weight_reps', 'running')).toBe(false);
  });

  it('is available for custom distance exercises (no slug)', () => {
    expect(supportsIncline('distance_duration', null)).toBe(true);
    expect(supportsIncline('duration', null)).toBe(false);
  });

  it('shows by default only for incline-focused exercises', () => {
    expect(inclineByDefault('treadmill-incline-walk')).toBe(true);
    expect(inclineByDefault('running')).toBe(false);
    expect(inclineByDefault(null)).toBe(false);
  });

  it('clamps to 0–40 % at 0.1 % precision', () => {
    expect(clampIncline(4.56)).toBe(4.6);
    expect(clampIncline(-2)).toBe(0);
    expect(clampIncline(55)).toBe(40);
    expect(clampIncline(Number.NaN)).toBe(0);
  });
});
