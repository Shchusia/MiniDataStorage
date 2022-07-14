import React from 'react';
import {getLanguage, allowedLanguages} from "../utils/language_utils";

export interface InterfaceLanguageContext {
    language: string
    setLanguage: Function
}

export const baseSettingsLanguage: InterfaceLanguageContext = {
    language: getLanguage(),
    setLanguage: (newLanguage:string) => {
        if (allowedLanguages.includes(newLanguage)){
            localStorage.setItem('language', newLanguage);
        }
    }
}

export const LanguageContext = React.createContext<InterfaceLanguageContext>(baseSettingsLanguage);