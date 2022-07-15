import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {getAccessToken} from "../../../store/reducers/globalReducer";
import {projects} from "../../../store/middlewares/projects";
import {getHeaders} from "../../../utils/utils";


const ListAdmins = () => {
    const dispatcher: Function = useDispatch();
    const [t,] = useTranslation('translation');
    const at = useSelector(getAccessToken)
     React.useEffect(() => {
        // if (Object.keys(listProjects).length === 0) {
            dispatcher(projects(
                {headers: getHeaders(at as string)}
            ))
        // }
    }, [])


    return <React.Fragment>
        ListAdmins
    </React.Fragment>
}

export default ListAdmins