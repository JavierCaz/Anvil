import { createInstance } from 'i18next';
import en from '../locales/en.json';
import es from '../locales/es.json';

async function translator(lng: 'en' | 'es') {
  const i18n = createInstance();
  await i18n.init({
    resources: { en: { translation: en }, es: { translation: es } },
    lng,
    interpolation: { escapeValue: false },
  });
  return i18n.t.bind(i18n);
}

describe('finish-early confirmation plurals', () => {
  it('uses singular / plural forms in English', async () => {
    const t = await translator('en');
    expect(t('workout.finishEarlyConfirmMessage', { count: 1 })).toBe(
      'You still have 1 unfinished set. Finish anyway?',
    );
    expect(t('workout.finishEarlyConfirmMessage', { count: 2 })).toBe(
      'You still have 2 unfinished sets. Finish anyway?',
    );
  });

  it('uses singular / plural forms in Spanish', async () => {
    const t = await translator('es');
    expect(t('workout.finishEarlyConfirmMessage', { count: 1 })).toBe(
      'Todavía tienes 1 serie sin completar. ¿Terminar de todos modos?',
    );
    expect(t('workout.finishEarlyConfirmMessage', { count: 2 })).toBe(
      'Todavía tienes 2 series sin completar. ¿Terminar de todos modos?',
    );
  });
});
