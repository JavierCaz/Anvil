import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDialog } from '@/components/AppDialog';
import { useToast } from '@/components/ToastProvider';
import { useBodyWeightActions } from '@/hooks/use-body-weight-actions';
import { useUnitsStore } from '@/store/units';
import { useAppTheme } from '@/theme/app-theme-provider';
import { radius, shape } from '@/theme/tokens';
import {
  BODY_WEIGHT_MAX_KG,
  BODY_WEIGHT_MIN_KG,
  BODY_WEIGHT_SANITY_JUMP_KG,
  formatBodyWeight,
  formatBodyWeightWithUnit,
  isValidBodyWeightKg,
  parseWeightInput,
  todayKey,
  type BodyWeightEntry,
} from '@/utils/body-weight';
import { displayToKg, weightUnitLabel } from '@/utils/weight';

interface BodyWeightLogFieldProps {
  /** All weigh-ins, oldest first (used for today's value and the sanity check). */
  entries: readonly BodyWeightEntry[];
  /** Called after a successful save so the parent can reload its data. */
  onSaved: () => void;
}

/**
 * Inline "log today's weight" field: type in the display unit, save. Saving
 * again on the same day replaces today's value — that's how typos are fixed.
 */
export function BodyWeightLogField({ entries, onSaved }: BodyWeightLogFieldProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dialog = useDialog();
  const toast = useToast();
  const unit = useUnitsStore((state) => state.unitSystem);
  const { logToday } = useBodyWeightActions();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const today = todayKey();
  const latest = entries[entries.length - 1] ?? null;
  const todayEntry = latest?.day === today ? latest : null;
  // Compare against the last weigh-in before today, not today's own value.
  const previous = [...entries].reverse().find((entry) => entry.day !== today) ?? null;
  const unitLabel = weightUnitLabel(unit);

  const commit = async (weightKg: number) => {
    setSaving(true);
    try {
      await logToday(weightKg);
      setText('');
      Keyboard.dismiss();
      toast.show({
        icon: '⚖️',
        title: t('bodyWeight.saved', { weight: formatBodyWeightWithUnit(weightKg, unit) }),
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const save = () => {
    const value = parseWeightInput(text);
    // Convert unrounded so a value typed in lb shows back exactly.
    const weightKg = value === null ? NaN : displayToKg(value, unit);
    if (!isValidBodyWeightKg(weightKg)) {
      dialog.alert({
        title: t('bodyWeight.invalidTitle'),
        message: t('bodyWeight.invalidMessage', {
          min: formatBodyWeight(BODY_WEIGHT_MIN_KG, unit),
          max: formatBodyWeight(BODY_WEIGHT_MAX_KG, unit),
          unit: unitLabel,
        }),
        icon: 'alert-circle',
        tone: 'error',
      });
      return;
    }
    if (previous && Math.abs(weightKg - previous.weightKg) > BODY_WEIGHT_SANITY_JUMP_KG) {
      dialog.alert({
        title: t('bodyWeight.confirmTitle'),
        message: t('bodyWeight.confirmMessage', {
          weight: formatBodyWeightWithUnit(weightKg, unit),
          previous: formatBodyWeightWithUnit(previous.weightKg, unit),
        }),
        icon: 'help-circle',
        tone: 'warning',
        buttons: [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.save'), onPress: () => void commit(weightKg) },
        ],
      });
      return;
    }
    void commit(weightKg);
  };

  const canSave = text.trim() !== '' && !saving;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View
          style={[styles.inputField, { borderColor: colors.border, backgroundColor: colors.background }]}
        >
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            {t('bodyWeight.todayLabel', { unit: unitLabel })}
          </Text>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={latest ? formatBodyWeight(latest.weightKg, unit) : '0.0'}
            placeholderTextColor={colors.textSecondary}
            keyboardType="decimal-pad"
            returnKeyType="done"
            onSubmitEditing={canSave ? save : undefined}
            accessibilityLabel={t('bodyWeight.todayLabel', { unit: unitLabel })}
            style={[styles.inputValue, { color: colors.text }]}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('bodyWeight.log')}
          disabled={!canSave}
          onPress={save}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: colors.primary,
              opacity: !canSave ? 0.45 : pressed ? 0.8 : 1,
            },
          ]}
        >
          <Ionicons name="add" size={18} color={colors.onPrimary} />
          <Text style={[styles.saveLabel, { color: colors.onPrimary }]}>{t('bodyWeight.log')}</Text>
        </Pressable>
      </View>
      {todayEntry && (
        <Text style={[styles.caption, { color: colors.textSecondary }]}>
          {t('bodyWeight.loggedToday', { weight: formatBodyWeightWithUnit(todayEntry.weightKg, unit) })}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  inputField: {
    ...shape.input,
    flex: 1,
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  inputValue: {
    fontSize: 18,
    fontWeight: '800',
    paddingVertical: 2,
    fontVariant: ['tabular-nums'],
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 18,
    borderRadius: radius.md,
  },
  saveLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  caption: {
    fontSize: 12,
  },
});
