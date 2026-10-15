import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { getBodyComparativeFor, getNextBodyComparative } from '@/constants/body-comparatives';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import {
  changeSinceFirstKg,
  formatBodyWeightWithUnit,
  trendDirection,
  type BodyWeightEntry,
} from '@/utils/body-weight';

interface BodyComparisonLineProps {
  entries: readonly BodyWeightEntry[];
}

/**
 * Fun comparison of the change since the first weigh-in ("You've lost a 🎳
 * bowling ball"), plus the next object on the ladder. Hidden while the
 * change is within the stable band.
 */
export function BodyComparisonLine({ entries }: BodyComparisonLineProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const unit = useUnitsStore((state) => state.unitSystem);

  const changeKg = changeSinceFirstKg(entries);
  const direction = trendDirection(changeKg);
  if (direction === 'stable') return null;

  const reached = getBodyComparativeFor(changeKg);
  const next = getNextBodyComparative(changeKg);
  const amount = Math.abs(changeKg);

  const headline = reached
    ? t(direction === 'down' ? 'bodyWeight.comparison.lost' : 'bodyWeight.comparison.gained', {
        icon: reached.icon,
        object: t(reached.objectKey),
        weight: formatBodyWeightWithUnit(amount, unit),
      })
    : next
      ? t('bodyWeight.comparison.almost', { icon: next.icon, object: t(next.objectKey) })
      : null;

  return (
    <View style={styles.container}>
      {headline && <Text style={[styles.headline, { color: colors.text }]}>{headline}</Text>}
      {reached && next && (
        <Text style={[styles.next, { color: colors.textSecondary }]}>
          {t('bodyWeight.comparison.next', {
            icon: next.icon,
            object: t(next.objectKey),
            weight: formatBodyWeightWithUnit(next.thresholdKg - amount, unit),
          })}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  headline: {
    fontSize: 14,
    fontWeight: '700',
  },
  next: {
    fontSize: 12,
  },
});
