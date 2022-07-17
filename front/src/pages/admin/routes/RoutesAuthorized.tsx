import React from 'react';
import {Route, Routes} from "react-router-dom";
import {routes} from "../../../configs/routes";
import Projects from "../pages/Projects";
import NewProject from "../pages/NewProject";
import Project from "../pages/Project";
import ListAdmins from "../pages/ListAdmins";
import Settings from "../pages/Settings";
import {useDispatch, useSelector} from 'react-redux';
import {addAlert, getCurrentAdmin} from "../../../store/reducers/globalReducer";
import {defaultEmailAdmin} from "../../../configs/config";
import {TypeAlert} from "../../../types/typesSystem";
import {useNavigate} from "react-router";


const RoutesAuthorized = () => {
    const currentAdmin = useSelector(getCurrentAdmin)
    const dispatcher: Function = useDispatch();
    const navigator = useNavigate()

    React.useEffect(() => {
        if (currentAdmin?.adminEmail === defaultEmailAdmin) {
            navigator(routes.settings)

            dispatcher(addAlert({
                type: TypeAlert.WARNING,
                text: "DefaultEmailWarning",
                title: "Warning",

            }))
        }
    }, [])
    return (<Routes>
        <Route path={routes.home} element={<Projects/>}/>
        <Route path={routes.projects} element={<Projects/>}/>
        <Route path={routes.newProject} element={<NewProject/>}/>
        <Route path={routes.project + '/:id'} element={<Project/>}/>
        <Route path={routes.admins} element={<ListAdmins/>}/>
        <Route path={routes.settings} element={<Settings/>}/>

        <Route path='*' element={<Projects/>}/>
    </Routes>)
}

export default RoutesAuthorized