import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import TextField from "@mui/material/TextField";
import {regexEmail} from "../../configs/regex";

export const emailRegexCompiled = new RegExp(regexEmail)

export interface EmailProps {
    defaultEmail?: string
}

const EmailField = (props: EmailProps) => {
    const [t,] = useTranslation('translation');
    const [value, setValue] = useState<string>(props.defaultEmail === undefined ? "" : props.defaultEmail)
    const [t_error,] = useTranslation('errors',);
    const [errorText, setError] = useState<string>('')


    const resetError = () => {
        setError("")
    }
    const validateEmail = (e: any) => {
        if (!e.target.value.match(emailRegexCompiled)) {
            setError(t_error("invalid_email"))
        } else {
            setError("")
        }
    }
    const changeValue = (e: any) => {
        setValue(e.target.value)
    }
    return <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label={t("Email Address")}
        name="email"
        autoComplete="email"
        onBlur={validateEmail}
        onFocus={resetError}
        /* @ts-ignore */
        error={errorText !== ''}
        helperText={errorText}
        value={value}
        autoFocus={false}
        onChange={changeValue}
    />
}

export default EmailField