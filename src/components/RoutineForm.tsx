import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '@/theme/app-theme-provider';

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
      <View style={[styles.field, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{t('common.name')}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('routines.form.namePlaceholder')}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }]}
          autoFocus
          returnKeyType="done"
        />
      </View>

      <View style={[styles.field, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {t('common.description')}
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder={t('routines.form.descriptionPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }]}
          multiline
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={submitLabel}
        disabled={!canSave}
        onPress={() => onSave(name, description)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 12,
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
  saveButton: {
    marginTop: 8,
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
