import React from 'react';
import EmailField, {emailRegexCompiled} from "../../../components/fields/EmailField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import TextFieldCustom from "../../../components/fields/TextField";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Container from '@mui/material/Container';
import {addAlert, getAccessToken} from "../../../store/reducers/globalReducer";
import {TypeAlert} from "../../../types/typesSystem";
import {getHeaders} from "../../../utils/utils";
import {createProject} from "../../../store/middlewares/projects";


const NewProject = () => {
    const [t] = useTranslation('translation');
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
                text: "Input incorrect email",
                title: "Input error",
                ttl: 5
            }))

        } else {

            // send request
            dispatcher(
                createProject(
                    {data: dataRequest,
                        headers: getHeaders(at as string)})
            )
        }
    }


    return <React.Fragment>
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
                <Typography variant="h3" gutterBottom component="div">
                    {t("New Project")}
                </Typography>
                <Box component="form"
                     onSubmit={handleSubmit}
                    // onSubmit{(event) =>{}}
                    //  noValidate
                     sx={{mt: 1, width: 1}}>
                    <TextFieldCustom id={"managerName"} label={"Manager Name"} required fullWidth/>
                    <EmailField/>
                    <TextFieldCustom id={"titleProject"} label={"Title Project"} required fullWidth/>
                    <TextFieldCustom id={"descriptionProject"} label={"Description Project"} isMultiline rows={4}
                                     required fullWidth/>


                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        {t("Create")}
                    </Button>
                </Box>

            </Box>
        </Container>

    </React.Fragment>

}

export default NewProject