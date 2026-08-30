import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
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
import { muscleI18nKey } from '@/constants/exercises';
import { getExerciseMuscles, getExercises } from '@/db/exercises';
import { addExerciseToRoutine } from '@/db/routines';
import type { Exercise } from '@/db/types';
import { useAppTheme } from '@/theme/app-theme-provider';

export default function AddExerciseScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routineId = Number(id);

  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState<string | null>(null);
  const [muscles, setMuscles] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    let active = true;
    void getExerciseMuscles(db).then((rows) => {
      if (active) {
        setMuscles(rows);
      }
    });
    return () => {
      active = false;
    };
  }, [db]);

  useEffect(() => {
    let active = true;
    void getExercises(db, { search, muscle }).then((rows) => {
      if (active) {
        setExercises(rows);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [db, search, muscle]);

  const handlePick = (exercise: Exercise) => {
    void addExerciseToRoutine(db, routineId, exercise.id).then(() => {
      router.back();
    });
  };

  const query = search.trim();

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: true, title: t('routines.addExercise.title') }} />

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

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
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
        </ScrollView>
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
              <Ionicons name="search-outline" size={44} color={colors.textSecondary} />
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
                    { borderColor: colors.primary, opacity: pressed ? 0.7 : 1 },
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
            return (
              <Pressable
                accessibilityRole="button"
                onPress={() => setSelectedExercise(item)}
                style={({ pressed }) => [
                  styles.row,
                  { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <ExerciseThumbnail slug={item.slug} />
                <View style={styles.rowBody}>
                  <View style={styles.rowTitleLine}>
                    <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {item.source === 'custom' && (
                      <View style={[styles.badge, { backgroundColor: colors.background }]}>
                        <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                          {t('routines.detail.customBadge')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                    {muscleKey ? t(muscleKey) : ''}
                    {item.equipment ? ` · ${item.equipment}` : ''}
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
                  <Ionicons name="add-circle" size={22} color={colors.primary} />
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
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      <Text
        style={[styles.chipLabel, { color: selected ? '#FFFFFF' : colors.textSecondary }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  chips: {
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 10,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyHint: {
    fontSize: 13,
    textAlign: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
  },
  createLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  attribution: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  rowSubtitle: {
    fontSize: 12,
  },
});
