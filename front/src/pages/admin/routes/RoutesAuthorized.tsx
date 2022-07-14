import React from 'react';
import {Route, Routes} from "react-router-dom";
import {routes} from "../../../configs/routes";
import Projects from "../pages/Projects";
import NewProject from "../pages/NewProject";
import Project from "../pages/Project";


const RoutesAuthorized = () => {
    return (<Routes>
        <Route path={routes.home} element={<Projects/>}/>
        <Route path={routes.projects} element={<Projects/>}/>
        <Route path={routes.newProject} element={<NewProject/>}/>
        <Route path={routes.project + '/:id'} element={<Project/>}/>

        <Route path='*' element={<Projects/>}/>
    </Routes>)
}

export default RoutesAuthorized