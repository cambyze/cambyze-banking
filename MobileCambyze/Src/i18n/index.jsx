import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import HomePageEn from './en/HomePage.json';
import HomePageFr from './fr/HomePage.json';
import testEn from './en/test.json';
import testFr from './fr/test.json';
import LoginRegisterEn from './en/LoginRegister.json';
import LoginRegisterFr from './fr/LoginRegister.json';

const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (Array.isArray(locales)) {
    return locales[0]?.languageCode || 'en';
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    ns: ['homePage', 'login'], // Liste des namespaces
    defaultNS: 'homePage', // Namespace par défaut
    interpolation: {
      escapeValue: false, // React gère déjà l'échappement
    },
    resources: {
      en: {
        homePage: HomePageEn,
        test: testEn,
        loginRegister: LoginRegisterEn,
      },
      fr: {
        homePage: HomePageFr,
        test: testFr,
        loginRegister: LoginRegisterFr,
      },
    },
  });

export default i18n;

// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// // import LanguageDetector from 'i18next-browser-languagedetector';
// import * as RNLocalize from 'react-native-localize';


// import HomePageEn from './en/HomePage.json';
// import HomePageFr from './fr/HomePage.json';
// import LoginEn from './en/Login.json';
// import LoginFr from './fr/Login.json';

// const getDeviceLanguage = () => {
//   const locales = RNLocalize.getLocales();
//   if (Array.isArray(locales)) {
//     return locales[0]?.languageCode || 'en';
//   }
//   return 'en';
// };

// i18n
//   .use(initReactI18next)
//   .init({
//     compatibilityJSON: 'v3',
//     lng: getDeviceLanguage(),
//     fallbackLng: 'en',
//     //lng: getDeviceLanguage(),
//     ns: ['homepage', 'login'],       // <- liste des "namespaces"
//     defaultNS: 'homepage',
//     interpolation: {
//       escapeValue: false, // React already does escaping
//     },
//     resources: {
//       en: { translation: {
//             "homePage": HomePageEn,
//             "login": LoginEn,
//       }
//        },
//       fr: { translation: {
//         "homePage": HomePageFr, 
//         "login": LoginFr
//     }
//        },
//     },
//   });

// export default i18n;
