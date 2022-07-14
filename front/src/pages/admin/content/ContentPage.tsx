import React from 'react';
import {useSelector} from "react-redux";
import {isAuthAdmin} from "../../../store/reducers/globalReducer";
import ContentUnauthorized from "./ContentUnauthorized";
import ContentAuthorized from "./ContentAuthorized";


const ContentPage = () => {
    const isAuth = useSelector(isAuthAdmin)

    return <React.Fragment>
        {isAuth? <ContentAuthorized/>:<ContentUnauthorized/>}

    </React.Fragment>
}

export default ContentPage;