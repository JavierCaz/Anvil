import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';
import { radius, shape, typography } from '@/theme/tokens';

interface RoutineFormProps {
  initialName?: string;
  initialDescription?: string;
  submitLabel: string;
  onSave: (name: string, description: string) => void;
}

/** Shared name/description form used by the create and edit routine screens. */
export function RoutineForm({
  initialName = '',
  initialDescription = '',
  submitLabel,
  onSave,
}: RoutineFormProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  const canSave = name.trim().length > 0;

  return (
    <View style={styles.content}>
      <View style={styles.fieldGroup}>
        <Text style={[typography.overline, { color: colors.textSecondary }]}>{t('common.name')}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('routines.form.namePlaceholder')}
          placeholderTextColor={colors.textSecondary}
          style={[
            shape.input,
            styles.nameInput,
            { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          autoFocus
          returnKeyType="done"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={[typography.overline, { color: colors.textSecondary }]}>
          {t('common.description')}
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder={t('routines.form.descriptionPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          style={[
            shape.input,
            styles.descriptionInput,
            { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          multiline
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={submitLabel}
        disabled={!canSave}
        onPress={() => onSave(name, description)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 18,
  },
  fieldGroup: {
    gap: 8,
  },
  nameInput: {
    fontSize: 17,
    fontWeight: '700',
  },
  descriptionInput: {
    minHeight: 88,
    textAlignVertical: 'top',
    borderRadius: radius.md,
  },
  saveButton: {
    marginTop: 6,
  },
});
