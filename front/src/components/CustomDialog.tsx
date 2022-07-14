import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {Box, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useTranslation} from "react-i18next";

interface PropsDialog {
    // btn settings
    textBtn: string
    variantBtn?: 'text' | 'outlined' | 'contained'
    endIcon?: React.ReactNode;
    startIcon?: React.ReactNode;

    //children
    children?: React.ReactNode,

    //dialog
    dialogTitle?: string
    dialogContentText?: string
    isAddCancel?: boolean
    dialogFooter?: React.ReactNode
    submitHandler?: Function
}

const CustomDialog = (props: PropsDialog) => {
    const [open, setOpen] = React.useState(false);
    const [t,] = useTranslation('translation');


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (<React.Fragment>
        <Button
            variant={props?.variantBtn}
            onClick={handleClickOpen}
            endIcon={props?.endIcon}
            startIcon={props?.startIcon}
        >
            {t(props.textBtn)}
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
        >
            {/*@ts-ignore*/}
            <Box component="form" onSubmit={props?.submitHandler}>
                {props?.dialogTitle ? (<DialogTitle>{t(props?.dialogTitle)}</DialogTitle>) : <></>}
                <DialogContent>
                    {props?.dialogContentText ? (
                        <DialogContentText>{t(props?.dialogContentText)}</DialogContentText>) : <></>}
                    {props.children}
                </DialogContent>

                <DialogActions>
                    {props?.isAddCancel ? (
                        <Button id="cancelDialog" onClick={handleClose}>{t("Cancel")}</Button>) : <></>}
                    {/* @ts-ignore */}
                    {props?.dialogFooter}
                </DialogActions>
            </Box>

        </Dialog>

    </React.Fragment>)
}

export default CustomDialog;