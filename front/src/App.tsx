import React from 'react';
import {baseSettingsTheme, ThemeContext} from "./contexts/ThemeContext";
import {ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from "@mui/material";
import {LanguageContext, baseSettingsLanguage} from "./contexts/LanguageContext";
import {Provider} from 'react-redux'
import store from "./store";
import {BrowserRouter as Router} from "react-router-dom";
import Page from "./pages/Page";


function App() {
    const [themeApp, updateTheme] = React.useState(baseSettingsTheme)

    return (<React.Fragment>
            <ThemeProvider theme={themeApp.getTheme(themeApp.isDarkTheme)}>
                <CssBaseline/>
                <Provider store={store}>
                    {/* @ts-ignore */}
                    <ThemeContext.Provider value={{themeApp, updateTheme}}>
                        {/* @ts-ignore */}
                        <LanguageContext.Provider value={baseSettingsLanguage}>
                            <Router>
                                <Page/>
                            </Router>
                        </LanguageContext.Provider>


                    </ThemeContext.Provider>
                </Provider>
            </ThemeProvider>
        </React.Fragment>
    );
}

export default App;
