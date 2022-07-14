import React from 'react';
import {useSelector} from "react-redux";
import {isAuthAdmin} from "../../../store/reducers/globalReducer";
import HeaderUnauthorized from "./HeaderUnauthorized";
import HeaderAuthorized from "./HeaderAuthorized";


const HeaderPage = () => {
    const isAuth = useSelector(isAuthAdmin)

    return <React.Fragment>
        {isAuth? <HeaderAuthorized/>:<HeaderUnauthorized/>}

    </React.Fragment>
}

export default HeaderPage;