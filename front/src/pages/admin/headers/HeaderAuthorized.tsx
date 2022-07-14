import React from 'react';
import Header from "../../../components/Header";
import {Box, Grid} from "@mui/material";
import ThemeSwitch from "../../../components/ThemeSwitcher";
import Languages from "../../../components/Languages";
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../../store/middlewares/auth";
import {useNavigate} from "react-router";
import {routes} from "../../../configs/routes";
import {getAccessToken} from "../../../store/reducers/globalReducer";
import {getHeaders} from "../../../utils/utils";


const HeaderAuthorized = () => {
    const navigator = useNavigate()
    const [t, i18n] = useTranslation('translation');
    const dispatcher: Function = useDispatch();
    const at = useSelector(getAccessToken)

    const clickLogout = () => {
        dispatcher(logout(
            {headers:getHeaders(at as string)}
        ))
    }

    return (<Header>
            <Grid container justifyContent="flex-end">
                <Box sx={{display: {xs: 'none', md: 'flex'}}}
                    // component="form"
                    // onSubmit={toPrevClick}

                >
                    <Button size="small"
                            color="inherit"
                            onClick={() => {
                                navigator(routes.projects)
                            }}
                        // type="submit"
                    >
                        {t("Projects")}
                    </Button>
                    <Languages/>
                    <ThemeSwitch/>
                    <Button size="small"
                            color="inherit"
                            onClick={clickLogout}
                        // type="submit"
                    >
                        {t("Logout")}
                    </Button>
                </Box>
            </Grid>
        </Header>
    )
}

export default HeaderAuthorized