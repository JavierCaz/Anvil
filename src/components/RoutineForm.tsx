import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState, type ReactNode } from 'react';
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
  const carouselRef = useRef<ScrollView>(null);
  // Index of the icon the form opened with, so editing starts with it in view.
  const initialIconIndex = ROUTINE_ICONS.findIndex((option) => option.key === initialIcon);
  // Carousel geometry, used to show an arrow on each side that still has hidden icons.
  const [scrollX, setScrollX] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const canScrollBack = scrollX > SCROLL_EDGE_TOLERANCE;
  const canScrollForward = viewportWidth > 0 && scrollX + viewportWidth < contentWidth - SCROLL_EDGE_TOLERANCE;

  /** Pages the carousel by roughly one screen of tiles, keeping one tile of overlap. */
  const pageCarousel = (direction: 1 | -1) => {
    const step = Math.max(TILE_STRIDE, viewportWidth - TILE_STRIDE);
    const maxX = Math.max(0, contentWidth - viewportWidth);
    carouselRef.current?.scrollTo({ x: Math.min(maxX, Math.max(0, scrollX + direction * step)), animated: true });
  };

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
            // New routines start typing right away; editing keeps the icon picker visible.
            autoFocus={initialName.length === 0}
            returnKeyType="done"
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={[typography.overline, { color: colors.textSecondary }]}>
          {t('routines.form.icon')}
        </Text>
        <View style={styles.iconCarousel}>
          <ScrollView
            ref={carouselRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={TILE_STRIDE}
            decelerationRate="fast"
            contentContainerStyle={styles.iconCarouselContent}
            scrollEventThrottle={32}
            onScroll={(event) => setScrollX(event.nativeEvent.contentOffset.x)}
            onContentSizeChange={(width) => setContentWidth(width)}
            onLayout={(event) => {
              setViewportWidth(event.nativeEvent.layout.width);
              if (initialIconIndex > 0) {
                carouselRef.current?.scrollTo({ x: initialIconIndex * TILE_STRIDE, animated: false });
              }
            }}
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
          </ScrollView>
          {canScrollBack && (
            <CarouselArrow side="left" label={t('routines.form.previousIcons')} onPress={() => pageCarousel(-1)} />
          )}
          {canScrollForward && (
            <CarouselArrow side="right" label={t('routines.form.moreIcons')} onPress={() => pageCarousel(1)} />
          )}
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

/** Round chevron button overlaid on a carousel edge that has more icons beyond it. */
function CarouselArrow({ side, label, onPress }: { side: 'left' | 'right'; label: string; onPress: () => void }) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.arrow,
        side === 'left' ? styles.arrowLeft : styles.arrowRight,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
          shadowColor: colors.text,
          opacity: pressed ? 0.7 : 0.95,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={side === 'left' ? 'chevron-left' : 'chevron-right'}
        size={22}
        color={colors.text}
      />
    </Pressable>
  );
}

const CONTENT_PADDING = 20;
const TILE_WIDTH = 76;
const TILE_GAP = 8;
const TILE_STRIDE = TILE_WIDTH + TILE_GAP;
/** Slack (px) before an edge counts as reached, absorbing sub-pixel scroll offsets. */
const SCROLL_EDGE_TOLERANCE = 4;
const ARROW_SIZE = 32;

const styles = StyleSheet.create({
  content: {
    padding: CONTENT_PADDING,
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
  // Bleeds to the screen edges so a partially visible tile hints at more icons.
  iconCarousel: {
    marginHorizontal: -CONTENT_PADDING,
  },
  iconCarouselContent: {
    paddingHorizontal: CONTENT_PADDING,
    gap: TILE_GAP,
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -ARROW_SIZE / 2,
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    borderRadius: ARROW_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  arrowLeft: {
    left: 8,
  },
  arrowRight: {
    right: 8,
  },
  iconTile: {
    width: TILE_WIDTH,
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
