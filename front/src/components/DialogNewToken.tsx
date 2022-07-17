import React from 'react'
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {useTranslation} from "react-i18next";
import Dialog from '@mui/material/Dialog';
import {Box, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useDispatch, useSelector} from "react-redux";
import {getAccessToken, getRefreshToken} from "../store/reducers/globalReducer";
import {getHeaders} from "../utils/utils";
import {createToken} from "../store/apiFunctions/tokenMiddleware";


export interface PropsDialogNewToken {
    projectId: number,
    isWrite?: boolean
}

const DialogNewToken = (props: PropsDialogNewToken) => {
    const [t,] = useTranslation('translation');
    const dispatcher: Function = useDispatch();
    const at = useSelector(getAccessToken)
    const rt = useSelector(getRefreshToken)

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
        const dataRequest = {
            "projectId": props.projectId,
            "expired": data.get("DatetimeExpired"),
            "isWrite": props?.isWrite ? true : false
        }
        dispatcher(createToken({data:{data: dataRequest,
            headers: getHeaders(at as string)},
            accessToken: at as string,
            refreshToken: rt as string
        }))
    }

    return <React.Fragment>

        <Button
            variant="contained"
            onClick={handleClickOpen}
            startIcon={<AddCircleOutlineIcon/>}
        >
            {t("New")}
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
        >
            <Box component="form" onSubmit={submitHandler}>
                <DialogTitle>
                    {t(`${props.isWrite ? "New Write Token" : "New Read Token"}`)}
                </DialogTitle>

                <DialogContent>
                    <br/>
                    <TextField
                        id="DatetimeExpired"
                        name="DatetimeExpired"
                        label={t("Expired DateTime")}
                        type="datetime-local"
                        // defaultValue="2017-05-24T10:30"
                        sx={{width: 250}}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button id="cancelDialog" onClick={handleClose}>{t("Cancel")}</Button>
                    <Button type="submit">{t("Add")}</Button>
                </DialogActions>
            </Box>
        </Dialog>


    </React.Fragment>

}

export default DialogNewToken