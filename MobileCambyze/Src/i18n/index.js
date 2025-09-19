import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import HomePageEn from './en/HomePage.json';
import HomePageFr from './fr/HomePage.json';
import testEn from './en/test.json';
import testFr from './fr/test.json';
import LoginRegisterEn from './en/LoginRegister.json';
import LoginRegisterFr from './fr/LoginRegister.json';
import AccountEn from  './en/Account.json';
import AccountFr from  './fr/Account.json';
import ForgotPswEn from './en/ForgetPsw.json';
import ForgotPswFr from './fr/ForgetPsw.json';
import ResetPswEn from './en/RessetPsw.json';
import ResetPswFr from './fr/RessetPsw.json';
import BankTransferEn from './en/BankTransfer.json';
import BankTransferFr from './fr/BankTransfer.json';
import HeaderEn from './en/Header.json';
import HeaderFr from './fr/Header.json';
import NavMenuEn from './en/NavMenu.json';
import NavMenuFr from './fr/NavMenu.json';

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
    ns: ['homePage', 'login', 'bankTransfer', 'account', 'forgotPsw', 'forgetPsw', 'test'],
    defaultNS: 'homePage',
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      en: {
        homePage: HomePageEn,
        test: testEn,
        loginRegister: LoginRegisterEn,
        account: AccountEn,
        forgotPsw: ForgotPswEn,
        resetPsw: ResetPswEn,
        bankTransfer: BankTransferEn,
        Header: HeaderEn,
        NavMenu: NavMenuEn,
      },
      fr: {
        homePage: HomePageFr,
        test: testFr,
        loginRegister: LoginRegisterFr,
        account: AccountFr,
        forgotPsw: ForgotPswFr,
        resetPsw: ResetPswFr,
        bankTransfer: BankTransferFr,
        Header: HeaderFr,
        NavMenu: NavMenuFr,
      },
    },
  });

export default i18n;