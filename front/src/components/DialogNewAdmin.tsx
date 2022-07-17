import React from 'react'
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {useTranslation} from "react-i18next";
import Dialog from '@mui/material/Dialog';
import {Box, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {addAlert, getAccessToken} from "../store/reducers/globalReducer";
import EmailField from "./fields/EmailField";
import TextFieldCustom from "./fields/TextField";
import {EditCreateAdminData} from "../types/apiTypes";
import {TypeAlert} from "../types/typesSystem";
import {sha256} from "js-sha256";
import {createAdmin, editSelfAdmin} from "../store/middlewares/admins";
import {getHeaders} from "../utils/utils";


const DialogNewAdmin = () => {
    const [t,] = useTranslation('translation');
    const dispatcher: Function = useDispatch();
    const at = useSelector(getAccessToken)

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let isError = false;
        const dataRequest: EditCreateAdminData = {
            email: data.get("email") as string,
            name: data.get("adminName") as string,
        }
        if (data.get("passwordFirst") !== data.get("passwordSecond")) {
            dispatcher(addAlert({
                type: TypeAlert.WARNING,
                text: "Passwords do not match",
                title: "Input error",
                ttl: 5
            }))
            isError = true;
        } else {
            dataRequest.password = sha256(data.get("passwordFirst") as string)
        }
        if (!isError) {
            dispatcher(createAdmin({data: dataRequest, headers: getHeaders(at as string)}))
            handleClose()

        }

    }

    return <React.Fragment>

        <Button
            variant="contained"
            onClick={handleClickOpen}
            startIcon={<AddCircleOutlineIcon/>}
        >
            {t("Add")}
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
        >
            <Box component="form" onSubmit={submitHandler}>
                <DialogTitle>
                    {t("New admin")}
                </DialogTitle>

                <DialogContent>
                    <br/>
                    <EmailField/>
                    <TextFieldCustom id={"passwordFirst"} label={"Password"} fullWidth required minLength={5}/>
                    <TextFieldCustom id={"passwordSecond"} label={"Reenter password"} required fullWidth minLength={5}/>
                    <TextFieldCustom id={"adminName"} label={"Name"} fullWidth required/>


                </DialogContent>
                <DialogActions>
                    <Button id="cancelDialog" onClick={handleClose}>{t("Cancel")}</Button>
                    <Button type="submit">{t("Add")}</Button>
                </DialogActions>
            </Box>
        </Dialog>


    </React.Fragment>

}

export default DialogNewAdmin