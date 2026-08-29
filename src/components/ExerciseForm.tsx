import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { EXERCISE_TYPE_I18N_KEYS, MUSCLE_I18N_KEYS } from '@/constants/exercises';
import { useAppTheme } from '@/theme/app-theme-provider';

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
      <View style={[styles.field, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{t('common.name')}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('exercises.form.namePlaceholder')}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }]}
          autoFocus
        />
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
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

      <View style={[styles.field, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {t('exercises.form.equipment')}
        </Text>
        <TextInput
          value={equipment}
          onChangeText={setEquipment}
          placeholder={t('exercises.form.equipmentPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }]}
          autoCorrect={false}
        />
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
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
          styles.saveButton,
          {
            backgroundColor: canSave ? colors.primary : colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text style={styles.saveLabel}>{submitLabel}</Text>
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
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      <Text style={[styles.chipLabel, { color: selected ? '#FFFFFF' : colors.textSecondary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 10,
  },
  field: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    fontSize: 16,
    paddingVertical: 6,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
