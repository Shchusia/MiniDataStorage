import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {getAccessToken, getRefreshToken} from "../../../store/reducers/globalReducer";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {useNavigate} from "react-router";
import {routes} from "../../../configs/routes";
import {getHeaders} from "../../../utils/utils";
import TableProjects from "../../../components/TableProjects";
import {BaseRequest} from "../../../types/apiTypes";
import {projects} from "../../../store/apiFunctions/projectMiddleware";

const Projects = () => {
    const dispatcher: Function = useDispatch();
    const navigator = useNavigate()

    const [t,] = useTranslation('translation');
    // const listProjects = useSelector(getProjects)
    const at = useSelector(getAccessToken)
    const rt = useSelector(getRefreshToken)
    React.useEffect(() => {

        dispatcher(projects(
            {
                data: {headers: getHeaders(at as string)},
                accessToken: at as string,
                refreshToken: rt as string
            }
    ))

    }, [])


    return <React.Fragment>
        <Typography variant="h3" gutterBottom component="div">
            {t("Projects")}
        </Typography>
        <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon/>}
            onClick={() => {
                navigator(routes.newProject)
            }}
        >
            {t("New")}
        </Button>
        <TableProjects/>


    </React.Fragment>
}

export default Projects;
