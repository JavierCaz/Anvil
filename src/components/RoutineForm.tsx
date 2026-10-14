import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getRoutineGlyph, ROUTINE_ICONS } from '@/constants/routine-icons';
import { useAppTheme } from '@/theme/app-theme-provider';
import { radius, shape, typography } from '@/theme/tokens';

interface RoutineFormProps {
  initialName?: string;
  initialDescription?: string;
  /** Preset icon key; null = none chosen yet. */
  initialIcon?: string | null;
  submitLabel: string;
  onSave: (name: string, description: string, icon: string | null) => void;
  /** Extra content below the save button (e.g. the edit screen's delete action). */
  footer?: ReactNode;
}

/** Shared name / description / icon form used by the create and edit routine screens. */
export function RoutineForm({
  initialName = '',
  initialDescription = '',
  initialIcon = null,
  submitLabel,
  onSave,
  footer,
}: RoutineFormProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [icon, setIcon] = useState<string | null>(initialIcon);
  const [gridWidth, setGridWidth] = useState(0);
  // Exactly four tiles per row, so a short last row keeps the same tile size.
  const tileWidth = gridWidth > 0 ? Math.floor((gridWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS) : 0;

  const canSave = name.trim().length > 0;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.fieldGroup}>
        <Text style={[typography.overline, { color: colors.textSecondary }]}>{t('common.name')}</Text>
        <View style={styles.nameRow}>
          <View style={[styles.preview, { backgroundColor: colors.primarySoft }]}>
            <MaterialCommunityIcons name={getRoutineGlyph(icon)} size={28} color={colors.primary} />
          </View>
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
            // New routines start typing right away; editing keeps the grid visible.
            autoFocus={initialName.length === 0}
            returnKeyType="done"
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={[typography.overline, { color: colors.textSecondary }]}>
          {t('routines.form.icon')}
        </Text>
        <View
          style={styles.iconGrid}
          onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
        >
          {ROUTINE_ICONS.map((option) => {
            const selected = option.key === icon;
            return (
              <Pressable
                key={option.key}
                accessibilityRole="button"
                accessibilityLabel={t(option.labelKey)}
                accessibilityState={{ selected }}
                onPress={() => setIcon(selected ? null : option.key)}
                style={({ pressed }) => [
                  styles.iconTile,
                  {
                    width: tileWidth || undefined,
                    backgroundColor: selected ? colors.primarySoft : colors.surface,
                    borderColor: selected ? colors.primary : colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={option.glyph}
                  size={24}
                  color={selected ? colors.primary : colors.text}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.iconLabel,
                    { color: selected ? colors.primary : colors.textSecondary },
                    selected && styles.iconLabelSelected,
                  ]}
                >
                  {t(option.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>
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
        onPress={() => onSave(name, description, icon)}
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
      {footer}
    </ScrollView>
  );
}

const GRID_COLUMNS = 4;
const GRID_GAP = 8;

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 18,
  },
  fieldGroup: {
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  preview: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  iconTile: {
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  iconLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconLabelSelected: {
    fontWeight: '800',
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
