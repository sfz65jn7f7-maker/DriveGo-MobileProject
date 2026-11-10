import i18n from 'i18next';
import { I18nManager } from 'react-native';
import { initReactI18next } from 'react-i18next';
import ar from './ar.json';
import en from './en.json';
import fr from './fr.json';

export type Language = 'fr' | 'ar' | 'en';

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
];

void i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: 'fr', // langue principale ; remplacée par le choix mémorisé au démarrage
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
});

/** Applique la langue et active / désactive le RTL (arabe). */
export function applyLanguage(language: Language) {
  void i18n.changeLanguage(language);
  const rtl = language === 'ar';
  if (I18nManager.isRTL !== rtl) {
    I18nManager.allowRTL(rtl);
    I18nManager.forceRTL(rtl);
    // Un redémarrage de l'app est nécessaire pour appliquer pleinement le RTL.
  }
}

export default i18n;
