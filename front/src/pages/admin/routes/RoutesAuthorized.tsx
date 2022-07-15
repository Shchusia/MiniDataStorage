import React from 'react';
import {Route, Routes} from "react-router-dom";
import {routes} from "../../../configs/routes";
import Projects from "../pages/Projects";
import NewProject from "../pages/NewProject";
import Project from "../pages/Project";
import ListAdmins from "../pages/ListAdmins";
import Settings from "../pages/Settings";


const RoutesAuthorized = () => {
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