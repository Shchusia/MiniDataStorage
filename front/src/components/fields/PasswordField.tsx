import React, {useState} from 'react';
import {Grid, IconButton, TextField} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useTranslation} from "react-i18next";

interface PropsPasswordField {
    titleField: string
    label: string
}


const PasswordField = (props: PropsPasswordField) => {
    const [t_error,] = useTranslation('errors',);
    const [errorText, setError] = useState<string>('')

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const resetError = () => {
        setError("")
    }
    const validatePasswordField = (e: any) => {
        const currentPassword = e.target.value
        if (currentPassword.length < 5) {
            //ToDo:make correct regex
            // if (!e.target.value.match(passwordRegexCompiled)) {
            setError(t_error("invalid_password"))
        } else {
            setError("")
        }
    }


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <Grid container direction="row" alignItems="center" justifyContent="center">
            <Grid item xs>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name={props.titleField}
                    label={props.label}
                    type={showPassword ? 'text' : 'password'}
                    id={props.titleField}
                    autoComplete="current-password"
                    error={errorText !== ''}
                    helperText={errorText}
                    onBlur={validatePasswordField}
                    onFocus={resetError}
                    inputProps={{
                        // pattern: regexPassword,
                        minLength: 5
                    }}
                />
            </Grid>
            <Grid item alignItems="center" justifyContent="center">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                >
                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                </IconButton>
            </Grid>
        </Grid>)
}

export default PasswordField