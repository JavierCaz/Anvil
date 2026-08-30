import { getLocales } from 'expo-localization';
import Storage from 'expo-sqlite/kv-store';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

export const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_STORAGE_KEY = 'anvil.language';

function isAppLanguage(value: unknown): value is AppLanguage {
  return value === 'en' || value === 'es';
}

/**
 * Initial language resolution order:
 * 1. Persisted user choice (`anvil.language` in kv-store)
 * 2. Device locale (`expo-localization`)
 * 3. `en` fallback
 */
function detectInitialLanguage(): AppLanguage {
  const stored = Storage.getItemSync(LANGUAGE_STORAGE_KEY);
  if (isAppLanguage(stored)) return stored;

  const deviceLanguage = getLocales()[0]?.languageCode;
  if (isAppLanguage(deviceLanguage)) return deviceLanguage;

  return 'en';
}

// i18next's default export IS the singleton instance — chaining is the documented pattern.
// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: detectInitialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  // Required in React Native — `useTranslation()` without a Suspense boundary.
  react: { useSuspense: false },
});

export async function setAppLanguage(language: AppLanguage): Promise<void> {
  // eslint-disable-next-line import/no-named-as-default-member
  await i18n.changeLanguage(language);
  await Storage.setItem(LANGUAGE_STORAGE_KEY, language);
}

/**
 * Forget the persisted language choice and fall back to the default
 * resolution (device locale → `en`). Used when erasing all data.
 */
export async function resetAppLanguage(): Promise<void> {
  await Storage.removeItem(LANGUAGE_STORAGE_KEY);
  // eslint-disable-next-line import/no-named-as-default-member
  await i18n.changeLanguage(detectInitialLanguage());
}

export { i18n };
