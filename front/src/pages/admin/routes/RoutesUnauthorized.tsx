import React from 'react';
import {Route, Routes} from "react-router-dom";
import {routes} from "../../../configs/routes";
import SignIn from "../auth/SignIn";



const RoutesUnauthorized = () => {
    return (<Routes>
        <Route path={routes.home} element={<SignIn/>}/>
        <Route path={routes.login} element={<SignIn/>}/>
        <Route path='*' element={<SignIn/>} />
    </Routes>)

}

export default RoutesUnauthorized