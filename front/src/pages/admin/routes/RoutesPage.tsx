import React from 'react';
import {useSelector} from "react-redux";
import {isAuthAdmin} from "../../../store/reducers/globalReducer";
import RoutesUnauthorized from "./RoutesUnauthorized";
import RoutesAuthorized from "./RoutesAuthorized";


const RoutesPage = () => {
    const isAuth = useSelector(isAuthAdmin)

    return <React.Fragment>
        {isAuth? <RoutesAuthorized/>:<RoutesUnauthorized/>}

    </React.Fragment>
}

export default RoutesPage;