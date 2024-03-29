import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import translation_en from './translations/en/translation.json'
import translation_ru from './translations/ru/translation.json'
// import errors_ru from './translations/ru/errors.json'
// import errors_en from './translations/en/errors.json'

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import {getLanguage} from "./utils/language_utils";

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: false,
        lng: getLanguage(),
        resources: {
            en: {
                translation: translation_en,
                // errors: errors_en
            },
            ru: {
                translation: translation_ru,
                // errors: errors_ru
            },

        },
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });


export default i18n;