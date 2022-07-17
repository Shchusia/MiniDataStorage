import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {getAccessToken, getAdmins} from "../../../store/reducers/globalReducer";
import {getHeaders} from "../../../utils/utils";
import {getListAdmins} from "../../../store/middlewares/admins";
import Typography from "@mui/material/Typography";
import DialogNewAdmin from "../../../components/DialogNewAdmin";
import TableAdmins from "../../../components/TableAdmins";


const ListAdmins = () => {
    const dispatcher: Function = useDispatch();
    const [t,] = useTranslation('translation');
    const at = useSelector(getAccessToken)
    React.useEffect(() => {
        dispatcher(getListAdmins(
            {headers: getHeaders(at as string)}
        ))
    }, [])
    const listAdmins = useSelector(getAdmins)
    console.log(listAdmins)

    return <React.Fragment>
        <Typography variant="h5" gutterBottom component="div">
            {t("List Admins")}
        </Typography>
        <DialogNewAdmin/>
        <TableAdmins admins={listAdmins}/>
    </React.Fragment>
}

export default ListAdmins