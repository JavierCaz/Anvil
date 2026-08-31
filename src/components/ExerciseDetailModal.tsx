import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { DetailModal } from '@/components/DetailModal';
import { ExerciseThumbnail } from '@/components/ExerciseThumbnail';
import { exerciseTypeI18nKey, muscleI18nKey } from '@/constants/exercises';
import type { Exercise } from '@/db/types';
import { useAppTheme } from '@/theme/app-theme-provider';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
}

/** Translates a catalog muscle value; falls back to the raw value. */
function muscleLabel(muscle: string | null, t: (key: string) => string): string | null {
  const key = muscleI18nKey(muscle);
  return muscle ? (key ? t(key) : muscle) : null;
}

/** Detail card for an exercise, shown as a modal when the user taps a row. */
export function ExerciseDetailModal({ exercise, onClose }: ExerciseDetailModalProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const primaryMuscle = muscleLabel(exercise.primary_muscle ?? exercise.muscle_group, t);
  const typeKey = exerciseTypeI18nKey(exercise.exercise_type);
  const typeLabel = typeKey ? t(typeKey) : exercise.exercise_type;

  let secondaryMuscles: string[] = [];
  if (exercise.secondary_muscles) {
    try {
      const parsed: unknown = JSON.parse(exercise.secondary_muscles);
      if (Array.isArray(parsed)) {
        secondaryMuscles = parsed.filter((m): m is string => typeof m === 'string');
      }
    } catch {
      secondaryMuscles = [];
    }
  }
  const secondaryLabel = secondaryMuscles
    .map((m) => muscleLabel(m, t) ?? m)
    .filter((m): m is string => Boolean(m))
    .join(', ');

  return (
    <DetailModal onClose={onClose}>
      {/* Visual */}
      <View style={[styles.visualWrap, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <ExerciseThumbnail slug={exercise.slug} size={190} borderRadius={14} />
      </View>

      {/* Name + badges */}
      <View style={styles.badgeRow}>
        {primaryMuscle && (
          <View style={[styles.badge, { backgroundColor: colors.background }]}>
            <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>{primaryMuscle}</Text>
          </View>
        )}
        {exercise.source === 'custom' && (
          <View style={[styles.badge, { backgroundColor: colors.background }]}>
            <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>
              {t('routines.detail.customBadge')}
            </Text>
          </View>
        )}
      </View>

      {/* Details */}
      <View style={styles.details}>
        {typeLabel && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              {t('exercises.detail.type')}
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{typeLabel}</Text>
          </View>
        )}
        {exercise.equipment ? (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              {t('exercises.detail.equipment')}
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{exercise.equipment}</Text>
          </View>
        ) : null}
        {secondaryLabel && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              {t('exercises.detail.secondaryMuscles')}
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{secondaryLabel}</Text>
          </View>
        )}
      </View>
    </DetailModal>
  );
}

const styles = StyleSheet.create({
  visualWrap: {
    width: 190,
    height: 190,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 14,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  details: {
    alignSelf: 'stretch',
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
});
