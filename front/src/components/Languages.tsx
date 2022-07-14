import * as React from 'react';
import {useTranslation} from 'react-i18next';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {allowedLanguages} from "../utils/language_utils";
import {LanguageContext} from "../contexts/LanguageContext";

interface PropsButton {
    language: string
    changeLanguage: Function
}

const ButtonLanguage = (props: PropsButton) => {
    return <Button size="small" color="inherit" onClick={() => {
        props.changeLanguage(props.language);
    }}>
        {props.language}
    </Button>

}

const Languages = () => {
    const [_, i18n] = useTranslation('translation');
    const languageCont = React.useContext(LanguageContext);
    const clickChangeLanguage = (newLanguage: string) => {
        i18n.changeLanguage(newLanguage);
        languageCont.setLanguage(newLanguage)

    }

    return (
        <Stack direction="row" spacing={0}>
            {allowedLanguages.map((language, index) => <ButtonLanguage language={language}
                                                                       changeLanguage={clickChangeLanguage}
                                                                       key={`${language}_{index}`}/>)}
        </Stack>
    )
}

export default Languages