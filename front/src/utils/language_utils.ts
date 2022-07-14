export const allowedLanguages: string[] = [
    "ru", "en"
]
const defaultLanguage: string = "en"
const getSystemLanguage = (): string => {
    const systemLanguage = navigator.language
    if (allowedLanguages.includes(systemLanguage)) {
        localStorage.setItem('language', systemLanguage)

        return systemLanguage
    } else {
        localStorage.setItem('language', defaultLanguage)
        return defaultLanguage
    }

}
export const getLanguage = (): string => {

    const languageLocal: string | null = localStorage.getItem('language')
    if (allowedLanguages.includes(languageLocal as string)) {
        return languageLocal as string
    } else {
        return getSystemLanguage()

    }

}