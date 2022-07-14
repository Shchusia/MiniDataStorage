import React from 'react';
import Header from "../../../components/Header";
import {Box, Grid} from "@mui/material";
import ThemeSwitch from "../../../components/ThemeSwitcher";
import Languages from "../../../components/Languages";


const HeaderUnauthorized = () => {
    // const navigator = useNavigate()
    // const [t, i18n] = useTranslation('translation');


    return (<Header>
            <Grid container justifyContent="flex-end">
                <Box sx={{display: {xs: 'none', md: 'flex'}}}
                    // component="form"
                    // onSubmit={toPrevClick}

                >
                    <Languages/>
                    <ThemeSwitch/>
                    {/*<Button size="small"*/}
                    {/*        color="inherit"*/}
                    {/*        type="submit"*/}
                    {/*>*/}
                    {/*    {t(titleButton)}*/}
                    {/*</Button>*/}
                </Box>
            </Grid>
        </Header>
    )
}

export default HeaderUnauthorized