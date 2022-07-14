import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import TextField from "@mui/material/TextField";
import {isDisabled} from "@testing-library/user-event/dist/utils";


export interface InterfaceTextField {
    id: string,
    label: string
    name?: string
    // must be return true if valid else false
    validateFunction?: Function
    warningMessage?: string
    isMultiline?: boolean
    rows?: number
    required?: boolean
    fullWidth?: boolean
    value?: string
    isDisabled?:boolean
}

const TextFieldCustom = (props: InterfaceTextField) => {
    const [t,] = useTranslation('translation');
    const [t_error,] = useTranslation('errors',);
    const [errorText, setError] = useState<string>('')
    const [value, setValue] = useState<string>(props.value === undefined ? '': props.value)


    const resetError = () => {
        setError("")
    }
    const validateField = (e: any) => {
        if (props?.validateFunction) {
            if (!props.validateFunction(e.target.value)) {
                if (props?.warningMessage) {
                    setError(t_error(props.warningMessage))
                } else {
                    setError(t_error("Invalid field"))
                }
            } else {
                setError("")

            }
        } else {
            setError("")
        }
    }
    const changeValue = (e:any) => {
        setValue(e.target.value )
    }
    return <TextField
        margin="normal"
        required={props.required}
        fullWidth={props.fullWidth}
        id={props.id}
        label={t(props.label)}
        name={props?.name ? props.name : props.id}
        onBlur={validateField}
        onFocus={resetError}
        /* @ts-ignore */
        error={errorText !== ''}
        helperText={errorText}
        multiline={props?.isMultiline}
        rows={props.rows}
        autoFocus={false}
        value={value}
        disabled={props?.isDisabled}
        onChange={changeValue}

    />
}

export default TextFieldCustom