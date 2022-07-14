import React from 'react'
import {useSelector} from "react-redux";
import {getAlerts} from "../store/reducers/globalReducer";
import {Box} from "@mui/material";
import AlertPage from "./Alert";


const Alerts = () => {
    const alerts = useSelector(getAlerts);
    return (<Box sx={{width: '100%'}}>
        {alerts.map((alert_el, index) => (<AlertPage {...alert_el} key={`alert_el=${index}`}/>))}

    </Box>)
}
export default Alerts