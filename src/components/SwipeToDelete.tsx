import { Ionicons } from '@expo/vector-icons';
import { useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable, {
  SwipeDirection,
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useAppTheme } from '@/theme/app-theme-provider';

/**
 * Swipe distance (px) that counts as a delete gesture. Small on purpose so a
 * slight rightward swipe triggers the confirmation instead of requiring the
 * row to travel halfway across the screen.
 */
const DELETE_SWIPE_THRESHOLD = 30;

interface SwipeToDeleteProps {
  /** Invoked as soon as the swipe crosses the threshold (parent shows a confirm dialog). */
  onDelete: () => void;
  children: ReactNode;
}

/**
 * Wraps a card in a swipe-right-to-delete gesture. A slight rightward swipe
 * reveals a red delete panel and fires `onDelete` immediately (before the
 * panel finishes animating open), then snaps the row back.
 */
export function SwipeToDelete({ onDelete, children }: SwipeToDeleteProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const ref = useRef<SwipeableMethods>(null);

  const handleWillOpen = (direction: SwipeDirection) => {
    if (direction === SwipeDirection.RIGHT) {
      ref.current?.close();
      onDelete();
    }
  };

  return (
    <ReanimatedSwipeable
      ref={ref}
      friction={1}
      leftThreshold={DELETE_SWIPE_THRESHOLD}
      rightThreshold={DELETE_SWIPE_THRESHOLD}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableWillOpen={handleWillOpen}
      containerStyle={styles.container}
      childrenContainerStyle={styles.children}
      renderLeftActions={() => (
        <View style={[styles.action, { backgroundColor: colors.error }]}>
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
          <Text style={styles.actionLabel}>{t('common.delete')}</Text>
        </View>
      )}
    >
      {children}
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  children: {
    backgroundColor: 'transparent',
  },
  action: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 4,
    paddingLeft: 16,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
