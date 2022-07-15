import React from 'react'
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import TextFieldCustom from "../../../components/fields/TextField";
import EmailField from "../../../components/fields/EmailField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import {addAlert, getAccessToken, getCurrentAdmin} from "../../../store/reducers/globalReducer";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {logout} from "../../../store/middlewares/auth";
import {Typography} from "@mui/material";
import {getHeaders} from "../../../utils/utils";
import {EditCreateAdminData} from "../../../types/apiTypes";
import {TypeAlert} from "../../../types/typesSystem";
import {sha256} from "js-sha256";
import {editSelfAdmin} from "../../../store/middlewares/admins";


const Settings = () => {
    const [t,] = useTranslation('translation');
    const dispatcher: Function = useDispatch();
    const navigator = useNavigate()
    const currentAdmin = useSelector(getCurrentAdmin)
    const at = useSelector(getAccessToken)


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let isError = false;
        const dataRequest: EditCreateAdminData = {
            email: data.get("email") as string,
            name: data.get("adminName") as string,
        }
        console.log(data.get("passwordFirst") === '')
        if (data.get("passwordFirst") !== '' || data.get("passwordSecond") !== '') {
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
        }
        if (!isError) {
            dispatcher(editSelfAdmin({data: dataRequest, headers: getHeaders(at as string)}))
            // console.log(dataRequest)
        }

    }

    if (currentAdmin === null) {
        dispatcher(logout(
            {headers: getHeaders(at as string)}
        ))
    }

    return (<Container component="main" maxWidth="xs">
        <CssBaseline/>
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography>You</Typography>
        </Box>
        <Box component="form"
             onSubmit={handleSubmit}
            // onSubmit{(event) =>{}}
            //  noValidate
             sx={{mt: 1, width: 1}}>
            <EmailField defaultEmail={currentAdmin?.adminEmail}/>
            <TextFieldCustom id={"passwordFirst"} label={"Password"} fullWidth minLength={5}/>
            <TextFieldCustom id={"passwordSecond"} label={"Reenter password"} fullWidth minLength={5}/>
            <TextFieldCustom id={"adminName"} label={"Name"} fullWidth value={currentAdmin?.adminName}/>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
                color="success"
            >
                {t("Save")}
            </Button>
        </Box>
    </Container>)
}

export default Settings