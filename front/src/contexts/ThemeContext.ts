import React from 'react';
import {createTheme} from '@mui/material/styles';
import {isTrue} from '../utils/utils'


const baseTheme = createTheme({
    typography: {
        fontFamily: "'Work Sans', sans-serif",
        fontSize: 14,
        /* @ts-ignore */
        fontFamilySecondary: "'Roboto Condensed', sans-serif"
    }
})

const darkTheme = createTheme({
    ...baseTheme,
    palette: {
        mode: "dark",
    }
})
const lightTheme = createTheme({
    ...baseTheme,
    palette: {
        mode: "light",
    }
})

export interface InterfaceThemeContext {
    isDarkTheme: boolean
    updateSettingsTheme: Function
    getTheme: Function
}
export const baseSettingsTheme = {
    isDarkTheme: isTrue(localStorage.getItem('isDarkTheme')),
    updateSettingsTheme: (isDarkCurrentTheme: boolean) => {
        localStorage.setItem('isDarkTheme', isDarkCurrentTheme.toString());
    },
    getTheme: (isDarkCurrentTheme: boolean) => {
        return isDarkCurrentTheme ? darkTheme : lightTheme;
    }
}
export const ThemeContext = React.createContext<InterfaceThemeContext>(baseSettingsTheme);
