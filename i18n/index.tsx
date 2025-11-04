import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language } from '../types';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import te from '../locales/te.json';
import ta from '../locales/ta.json';

const translations = { en, hi, te, ta };
export const LANGUAGES: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
];

const LANGUAGE_STORAGE_KEY = 'soloSafeLanguage';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, options?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested keys from JSON, e.g., "login.title"
const getNestedTranslation = (obj: any, key: string): string | undefined => {
    return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Default to 'en' or whatever is stored, but don't show UI until App checks for first time
    const [language, setLanguageState] = useState<Language>(() => {
        const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
        return (storedLang && translations[storedLang]) ? storedLang : 'en';
    });

    const setLanguage = (lang: Language) => {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        setLanguageState(lang);
    };

    const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
        const langStrings = translations[language];
        let translation = getNestedTranslation(langStrings, key);

        if (translation && options) {
            Object.keys(options).forEach(optKey => {
                translation = translation!.replace(`{{${optKey}}}`, String(options[optKey]));
            });
        }
        
        return translation || key; // Fallback to key if not found
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
