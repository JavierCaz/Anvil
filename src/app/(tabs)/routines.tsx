import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { useAppTheme } from '@/theme/app-theme-provider';

export default function RoutinesScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <Screen style={styles.centered}>
      <Ionicons name="barbell-outline" size={48} color={colors.textSecondary} />
      <Text style={[styles.title, { color: colors.text }]}>{t('tabs.routines')}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {t('common.comingSoon')}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
  },
});
