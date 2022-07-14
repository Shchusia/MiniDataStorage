
import React from 'react';
import Alert from '@mui/material/Alert';
import {Collapse, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AlertTitle from '@mui/material/AlertTitle';
import {useTranslation} from "react-i18next";
import {AlertType} from "../types/typeStores";

const AlertPage = (props: AlertType) => {
    const [t, ] = useTranslation('translation');

    const [open, setOpen] = React.useState(true);
    if (props?.ttl) {
        setTimeout(() => setOpen(false), props.ttl * 1000)
    }
    // const closeDialog = () => setOpen(false)
    return (
        <Collapse in={open}>
            <Alert
                severity={props.type}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit"/>
                    </IconButton>
                }
                sx={{mb: 2}}
            >
                {props?.title ? <AlertTitle>{t(props.title)}</AlertTitle>: <></>}
                {t(props.text)}
            </Alert>
        </Collapse>

    )
}

export default AlertPage