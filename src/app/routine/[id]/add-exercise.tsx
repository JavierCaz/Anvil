import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ExerciseDetailModal } from '@/components/ExerciseDetailModal';
import { ExerciseThumbnail } from '@/components/ExerciseThumbnail';
import { Screen } from '@/components/Screen';
import { equipmentI18nKey, muscleI18nKey } from '@/constants/exercises';
import { getExerciseEquipment, getExerciseMuscles, getExercises } from '@/db/exercises';
import { addExerciseToRoutine } from '@/db/routines';
import type { Exercise } from '@/db/types';
import { useFocusQuery } from '@/hooks/use-focus-query';
import { useAppTheme } from '@/theme/app-theme-provider';
import { hairline, radius, shape, typography } from '@/theme/tokens';

export default function AddExerciseScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routineId = Number(id);

  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const musclesQuery = useFocusQuery((db) => getExerciseMuscles(db), [], {
    refetchOnFocus: false,
  });
  const equipmentQuery = useFocusQuery((db) => getExerciseEquipment(db), [], {
    refetchOnFocus: false,
  });
  const exercisesQuery = useFocusQuery(
    (db) => getExercises(db, { search, muscle, equipment }),
    [search, muscle, equipment],
    { refetchOnFocus: false }
  );
  const muscles = musclesQuery.data ?? [];
  const equipmentOptions = equipmentQuery.data ?? [];
  const exercises = exercisesQuery.data ?? [];
  const loading = !exercisesQuery.loaded;

  const handlePick = (exercise: Exercise) => {
    void addExerciseToRoutine(db, routineId, exercise.id).then(() => {
      router.back();
    });
  };

  const query = search.trim();

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: true, title: t('routines.addExercise.title') }} />

      {/* Fixed filter header: search + chips, divided from the scrolling list. */}
      <View style={[styles.filters, { borderBottomColor: colors.border }]}>
        <View style={styles.searchWrap}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t('routines.addExercise.searchPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              style={[styles.searchInput, { color: colors.text }]}
              autoCorrect={false}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        <FilterSection label={t('routines.addExercise.muscleGroup')}>
          <FilterChip
            label={t('routines.addExercise.allMuscles')}
            selected={muscle === null}
            onPress={() => setMuscle(null)}
          />
          {muscles.map((item) => {
            const key = muscleI18nKey(item);
            return (
              <FilterChip
                key={item}
                label={key ? t(key) : item}
                selected={muscle === item}
                onPress={() => setMuscle(item)}
              />
            );
          })}
        </FilterSection>

        <FilterSection label={t('routines.addExercise.equipment')}>
          <FilterChip
            label={t('routines.addExercise.allMuscles')}
            selected={equipment === null}
            onPress={() => setEquipment(null)}
          />
          {equipmentOptions.map((item) => {
            const key = equipmentI18nKey(item);
            return (
              <FilterChip
                key={item}
                label={key ? t(key) : item}
                selected={equipment === item}
                onPress={() => setEquipment(item)}
              />
            );
          })}
        </FilterSection>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={[shape.iconWell, styles.emptyIcon, { backgroundColor: colors.surfaceElevated }]}>
                <Ionicons name="search" size={30} color={colors.textSecondary} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {t('routines.addExercise.emptyTitle')}
              </Text>
              <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
                {t('routines.addExercise.emptyHint')}
              </Text>
              {query.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(`/exercise/new?name=${encodeURIComponent(query)}&routineId=${routineId}`)
                  }
                  style={({ pressed }) => [
                    styles.createButton,
                    {
                      borderColor: colors.primary,
                      backgroundColor: pressed ? colors.primarySoft : 'transparent',
                    },
                  ]}
                >
                  <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                  <Text style={[styles.createLabel, { color: colors.primary }]}>
                    {t('routines.addExercise.createCustom', { name: query })}
                  </Text>
                </Pressable>
              )}
            </View>
          }
          ListFooterComponent={
            <Text style={[styles.attribution, { color: colors.textSecondary }]}>
              {t('routines.addExercise.attribution')}
            </Text>
          }
          renderItem={({ item }) => {
            const muscleKey = muscleI18nKey(item.primary_muscle);
            const equipmentKey = equipmentI18nKey(item.equipment);
            return (
              <Pressable
                accessibilityRole="button"
                onPress={() => setSelectedExercise(item)}
                style={({ pressed }) => [
                  styles.row,
                  { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <ExerciseThumbnail slug={item.slug} size={52} borderRadius={radius.md} />
                <View style={styles.rowBody}>
                  <View style={styles.rowTitleLine}>
                    <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {item.source === 'custom' && (
                      <View style={[styles.badge, { borderColor: colors.border }]}>
                        <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                          {t('routines.detail.customBadge')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                    {muscleKey ? t(muscleKey) : ''}
                    {item.equipment ? ` · ${equipmentKey ? t(equipmentKey) : item.equipment}` : ''}
                  </Text>
                </View>
                {item.source === 'custom' && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('common.edit')}
                    hitSlop={8}
                    onPress={() => router.push(`/exercise/${item.id}/edit`)}
                  >
                    <Ionicons name="pencil" size={18} color={colors.textSecondary} />
                  </Pressable>
                )}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('routines.addExercise.addToRoutine', { name: item.name })}
                  hitSlop={8}
                  onPress={() => handlePick(item)}
                >
                  <View style={[styles.addWell, { backgroundColor: colors.primary }]}>
                    <Ionicons name="add" size={20} color={colors.onPrimary} />
                  </View>
                </Pressable>
              </Pressable>
            );
          }}
        />
      )}

      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </Screen>
  );
}

function FilterSection({ label, children }: { label: string; children: ReactNode }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.filterSection}>
      <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {children}
      </ScrollView>
    </View>
  );
}

function FilterChip({
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
  filters: {
    paddingBottom: 14,
    borderBottomWidth: hairline,
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.md,
    borderWidth: hairline,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  filterSection: {
    paddingTop: 14,
    gap: 8,
  },
  filterLabel: {
    ...typography.overline,
    paddingHorizontal: 20,
  },
  chips: {
    paddingHorizontal: 20,
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 10,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: radius.xl,
    marginBottom: 6,
  },
  emptyTitle: {
    ...typography.heading,
  },
  emptyHint: {
    ...typography.caption,
    textAlign: 'center',
  },
  createButton: {
    ...shape.secondaryButton,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: 10,
  },
  createLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  attribution: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 12,
    opacity: 0.8,
  },
  row: {
    ...shape.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowTitle: {
    ...typography.rowTitle,
    flexShrink: 1,
  },
  badge: {
    borderRadius: radius.pill,
    borderWidth: hairline,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  rowSubtitle: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  addWell: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
