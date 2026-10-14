import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import Sortable, { type SortableGridRenderItem } from 'react-native-sortables';
import { Screen } from '@/components/Screen';
import { SwipeToDelete } from '@/components/SwipeToDelete';
import { useDialog } from '@/components/AppDialog';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { getRoutineGlyph } from '@/constants/routine-icons';
import { deleteRoutine, getRoutines, reorderRoutines } from '@/db/routines';
import type { RoutineWithCount } from '@/db/types';
import { useFocusQuery } from '@/hooks/use-focus-query';
import { useAppTheme } from '@/theme/app-theme-provider';

export default function RoutinesScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dialog = useDialog();
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();

  const { data, loaded, setData } = useFocusQuery((queryDb) => getRoutines(queryDb), [], {
    refetchOnFocus: true,
  });
  const routines = data ?? [];

  const confirmDelete = useCallback((routine: RoutineWithCount) => {
    dialog.alert({
      title: t('routines.deleteConfirmTitle'),
      message: t('routines.deleteConfirmMessage', { name: routine.name }),
      icon: 'trash-outline',
      tone: 'error',
      buttons: [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            void deleteRoutine(db, routine.id).then(() => {
              setData((current) => (current ?? []).filter((item) => item.id !== routine.id));
            });
          },
        },
      ],
    });
  }, [db, dialog, t, setData]);

  const handleDragEnd = useCallback((next: RoutineWithCount[]) => {
    setData(next);
    void reorderRoutines(
      db,
      next.map((routine) => routine.id)
    );
  }, [db, setData]);

  const renderItem = useCallback<SortableGridRenderItem<RoutineWithCount>>(
    ({ item }) => (
      // Hold anywhere to drag-reorder; a plain tap opens the routine; swipe
      // right to delete (SwipeToDelete only claims fast horizontal motion).
      <SwipeToDelete onDelete={() => confirmDelete(item)}>
        <Sortable.Touchable
          accessibilityRole="button"
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onTap={() => router.push(`/routine/${item.id}`)}
        >
          <View style={[styles.cardIcon, { backgroundColor: colors.primarySoft }]}>
            <MaterialCommunityIcons name={getRoutineGlyph(item.icon)} size={24} color={colors.primary} />
          </View>
          <View style={styles.cardBody}>
            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            {item.description ? (
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.description}
              </Text>
            ) : null}
            <Text style={[styles.cardMeta, { color: colors.primary }]}>
              {t('routines.exerciseCount', { count: item.exercise_count })}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Sortable.Touchable>
      </SwipeToDelete>
    ),
    [colors, confirmDelete, router, t]
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('tabs.routines')}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('routines.newRoutine')}
          hitSlop={8}
          onPress={() => router.push('/routine/new')}
          style={[styles.newButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="add" size={20} color={colors.onPrimary} />
          <Text style={[styles.newButtonLabel, { color: colors.onPrimary }]}>
            {t('routines.newRoutine')}
          </Text>
        </Pressable>
      </View>

      {loaded && routines.length === 0 ? (
        <View style={[styles.listContent, styles.listContentEmpty]}>
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
              <MaterialCommunityIcons name="anvil" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('routines.emptyTitle')}
            </Text>
            <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
              {t('routines.emptyHint')}
            </Text>
          </View>
        </View>
      ) : loaded ? (
        <Animated.ScrollView
          ref={scrollableRef}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          <Sortable.Grid
            columns={1}
            data={routines}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            rowGap={12}
            scrollableRef={scrollableRef}
            onDragEnd={({ data }) => handleDragEnd(data)}
          />
        </Animated.ScrollView>
      ) : null}

      <LoadingOverlay visible={!loaded} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  newButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cardDescription: {
    fontSize: 13,
  },
  cardMeta: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
});
