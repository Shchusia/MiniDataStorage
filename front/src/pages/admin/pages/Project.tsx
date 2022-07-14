import React from 'react'
import {useParams} from "react-router";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import Tokens from "../../../components/Tokens";
import {useDispatch, useSelector} from "react-redux";
import {addAlert, getAccessToken, getFullProject} from "../../../store/reducers/globalReducer";
import {
    createProject,
    deleteProject,
    editProject,
    getProject,
    restoreProject
} from "../../../store/middlewares/projects";
import {getHeaders} from "../../../utils/utils";
import CssBaseline from "@mui/material/CssBaseline";
import Container from '@mui/material/Container';
import Box from "@mui/material/Box";
import TextFieldCustom from "../../../components/fields/TextField";
import EmailField, {emailRegexCompiled} from "../../../components/fields/EmailField";
import Button from "@mui/material/Button";
import {TypeAlert} from "../../../types/typesSystem";


const Project = () => {
    const {id} = useParams()
    const [t] = useTranslation('translation');
    const project = useSelector(getFullProject(Number(id)))
    const dispatcher: Function = useDispatch();
    const at = useSelector(getAccessToken)
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const dataRequest = {
            projectManager: data.get("managerName"),
            projectManagerEmail: data.get("email") as string,
            projectTitle: data.get("titleProject"),
            projectDescription: data.get("descriptionProject"),
        }
        if (!dataRequest.projectManagerEmail.match(emailRegexCompiled)) {
            dispatcher(addAlert({
                type: TypeAlert.WARNING,
                text: "Input Correct email",
                title: "Input error",
                ttl: 5
            }))

        } else {

            // send request
            dispatcher(
                editProject(
                    {data: dataRequest,
                        headers: getHeaders(at as string),
                        optional:{projectId: id}})
            )
        }
    }
    const clickDeleteRestore = () => {
        if(project) {
            if (project.isDeleted) {
                dispatcher(restoreProject({headers: getHeaders(at as string), optional: {projectId: project.projectId}}))
            } else {
                dispatcher(deleteProject({
                    headers: getHeaders(at as string),
                    optional: {projectId: project.projectId}
                }))
            }
        }
    }

    React.useEffect(() => {
        if (project === undefined) {
            dispatcher(getProject({data: {projectId: id}, headers: getHeaders(at as string)}))
        }
    }, [])
    console.log(project)

    return <React.Fragment>
        <Typography variant="h5" gutterBottom component="div">
            {t("Project")} {id}
        </Typography>
        {project === null ? (
            <Typography variant="h5" gutterBottom component="div">
                {t("Project not found")} {id}
            </Typography>
        ) : (
            <React.Fragment>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                    </Box>
                    <Box component="form"
                         onSubmit={handleSubmit}
                        // onSubmit{(event) =>{}}
                        //  noValidate
                         sx={{mt: 1, width: 1}}>
                        <TextFieldCustom id={"managerName"} label={"Manager Name"} required fullWidth value={project?.projectManager}/>
                        <EmailField defaultEmail={project?.projectManagerEmail}/>
                        <TextFieldCustom id={"titleProject"} label={"Title Project"} required fullWidth value={project?.projectTitle}/>
                        <TextFieldCustom id={"descriptionProject"} label={"Description Project"} isMultiline rows={4} value={project?.projectDescription}
                                         required fullWidth/>
                        <TextFieldCustom id={"created"} label={"Created"} isDisabled fullWidth value={project?.created.toString()}/>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            onClick={clickDeleteRestore}
                            color={project?.isDeleted ? "warning" : "error"}
                        >
                            {project?.isDeleted === true ? t("Restore"): t("Delete")}
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            color="success"
                        >
                            {t("Save")}
                        </Button>
                    </Box>
                </Container>

                <Tokens projectId={Number(id)}/>
            </React.Fragment>
        )}


    </React.Fragment>

}

export default Project