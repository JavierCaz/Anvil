import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { EXERCISE_TYPE_I18N_KEYS, MUSCLE_I18N_KEYS } from '@/constants/exercises';
import { useAppTheme } from '@/theme/app-theme-provider';
import { shape, typography } from '@/theme/tokens';

interface ExerciseFormProps {
  initialName?: string;
  initialMuscleGroup?: string | null;
  initialEquipment?: string;
  initialExerciseType?: string | null;
  submitLabel: string;
  onSave: (input: {
    name: string;
    muscleGroup: string | null;
    equipment: string | null;
    exerciseType: string | null;
  }) => void;
}

const EXERCISE_TYPES = Object.entries(EXERCISE_TYPE_I18N_KEYS);

/** Shared form used by the create and edit custom-exercise screens. */
export function ExerciseForm({
  initialName = '',
  initialMuscleGroup = null,
  initialEquipment = '',
  initialExerciseType = 'weight_reps',
  submitLabel,
  onSave,
}: ExerciseFormProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const [name, setName] = useState(initialName);
  const [muscleGroup, setMuscleGroup] = useState<string | null>(initialMuscleGroup);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [exerciseType, setExerciseType] = useState<string | null>(initialExerciseType);

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    onSave({
      name,
      muscleGroup,
      equipment: equipment || null,
      exerciseType,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.fieldGroup}>
        <Text style={[typography.overline, { color: colors.textSecondary }]}>{t('common.name')}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('exercises.form.namePlaceholder')}
          placeholderTextColor={colors.textSecondary}
          style={[
            shape.input,
            { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          autoFocus
        />
      </View>

      <Text style={[typography.overline, styles.sectionLabel, { color: colors.textSecondary }]}>
        {t('exercises.form.muscleGroup')}
      </Text>
      <View style={styles.chipWrap}>
        {Object.entries(MUSCLE_I18N_KEYS).map(([value, key]) => (
          <Chip
            key={value}
            label={t(key)}
            selected={muscleGroup === value}
            onPress={() => setMuscleGroup(value === muscleGroup ? null : value)}
          />
        ))}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={[typography.overline, { color: colors.textSecondary }]}>
          {t('exercises.form.equipment')}
        </Text>
        <TextInput
          value={equipment}
          onChangeText={setEquipment}
          placeholder={t('exercises.form.equipmentPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          style={[
            shape.input,
            { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          autoCorrect={false}
        />
      </View>

      <Text style={[typography.overline, styles.sectionLabel, { color: colors.textSecondary }]}>
        {t('exercises.form.type')}
      </Text>
      <View style={styles.chipWrap}>
        {EXERCISE_TYPES.map(([value, key]) => (
          <Chip
            key={value}
            label={t(key)}
            selected={exerciseType === value}
            onPress={() => setExerciseType(value)}
          />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={submitLabel}
        disabled={!canSave}
        onPress={handleSave}
        style={({ pressed }) => [
          shape.primaryButton,
          styles.saveButton,
          {
            backgroundColor: canSave ? colors.primary : colors.surfaceElevated,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text style={[typography.button, { color: canSave ? colors.onPrimary : colors.textSecondary }]}>
          {submitLabel}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primarySoft : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.chipLabel,
          { color: selected ? colors.primary : colors.textSecondary },
          selected && styles.chipLabelSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  fieldGroup: {
    gap: 8,
  },
  sectionLabel: {
    marginTop: 10,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    ...shape.chip,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipLabelSelected: {
    fontWeight: '800',
  },
  saveButton: {
    marginTop: 16,
  },
});
