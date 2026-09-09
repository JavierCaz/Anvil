import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import Sortable, { type SortableGridRenderItem } from 'react-native-sortables';
import { Screen } from '@/components/Screen';
import { SwipeToDelete } from '@/components/SwipeToDelete';
import { useDialog } from '@/components/AppDialog';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { deleteRoutine, getRoutines, reorderRoutines } from '@/db/routines';
import type { RoutineWithCount } from '@/db/types';
import { useAppTheme } from '@/theme/app-theme-provider';

export default function RoutinesScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dialog = useDialog();
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();

  const [routines, setRoutines] = useState<RoutineWithCount[]>([]);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoaded(false);
      void getRoutines(db).then((rows) => {
        if (active) {
          setRoutines(rows);
          setLoaded(true);
        }
      });
      return () => {
        active = false;
      };
    }, [db])
  );

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
              setRoutines((current) => current.filter((item) => item.id !== routine.id));
            });
          },
        },
      ],
    });
  }, [db, dialog, t]);

  const handleDragEnd = useCallback((data: RoutineWithCount[]) => {
    setRoutines(data);
    void reorderRoutines(
      db,
      data.map((routine) => routine.id)
    );
  }, [db]);

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
          <View style={styles.cardBody}>
            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            {item.description ? (
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.description}
              </Text>
            ) : null}
            <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
              {t('routines.exerciseCount', { count: item.exercise_count })}
            </Text>
          </View>
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
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={styles.newButtonLabel}>{t('routines.newRoutine')}</Text>
        </Pressable>
      </View>

      {loaded && routines.length === 0 ? (
        <View style={[styles.listContent, styles.listContentEmpty]}>
          <View style={styles.empty}>
            <Ionicons name="barbell-outline" size={48} color={colors.textSecondary} />
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
    fontSize: 24,
    fontWeight: '800',
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
    color: '#FFFFFF',
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
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 13,
  },
  cardMeta: {
    fontSize: 12,
    marginTop: 2,
  },
});
