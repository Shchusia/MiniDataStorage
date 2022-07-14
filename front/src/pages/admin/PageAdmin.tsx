import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getRefreshToken, isAuthAdmin} from "../../store/reducers/globalReducer";
import {refresh} from "../../store/middlewares/auth";
import HeaderPage from "./headers/HeaderPage";
import ContentPage from "./content/ContentPage";
import RoutesPage from "./routes/RoutesPage";
import Alerts from "../../components/Alerts";
import {getHeaders} from "../../utils/utils";


const PageAdmin = () => {
    const dispatcher = useDispatch()
    const isAuth = useSelector(isAuthAdmin)
    const rt = useSelector(getRefreshToken)
    console.log('isAuth',isAuth)
    React.useEffect(() => {
        if (isAuth === null) {
            //@ts-ignore
            dispatcher(refresh(
                {headers: getHeaders(rt as string)}
            ))
        }

    }, [])
    return <React.Fragment>
        <HeaderPage/>
        <Alerts/>
        <ContentPage/>
        <RoutesPage/>

    </React.Fragment>

}
export default PageAdmin