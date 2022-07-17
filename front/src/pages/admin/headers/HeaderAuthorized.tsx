import React from 'react';
import {AppBar, Grid} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../../store/middlewares/auth";
import {useNavigate} from "react-router";
import {getAccessToken} from "../../../store/reducers/globalReducer";
import {getHeaders} from "../../../utils/utils";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';

import Container from '@mui/material/Container';
import Languages from "../../../components/Languages";
import ThemeSwitch from "../../../components/ThemeSwitcher";
import {routes} from "../../../configs/routes";

interface DataLink {
    title: string
    linkTo: string
}

const HeaderAuthorized = () => {
    const navigator = useNavigate()
    const [t, i18n] = useTranslation('translation');
    const dispatcher: Function = useDispatch();
    const at = useSelector(getAccessToken)

    const clickLogout = () => {
        handleCloseNavMenu()
        dispatcher(logout(
            {headers: getHeaders(at as string)}
        ))
    }
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const dataLink: DataLink[] = [
        {
            title: t("Projects"),
            linkTo: routes.projects
        }
    ]


    return (
        // <Header>
        //         <Grid container justifyContent="flex-end">
        //             <Box sx={{display: {xs: 'none', md: 'flex'}}}
        //                 // component="form"
        //                 // onSubmit={toPrevClick}
        //
        //             >
        //                 <Button size="small"
        //                         color="inherit"
        //                         onClick={() => {
        //                             navigator(routes.projects)
        //                         }}
        //                     // type="submit"
        //                 >
        //                     {t("Projects")}
        //                 </Button>
        //                 <Languages/>
        //                 <ThemeSwitch/>
        //                 <Button size="small"
        //                         color="inherit"
        //                         onClick={clickLogout}
        //                     // type="submit"
        //                 >
        //                     {t("Logout")}
        //                 </Button>
        //             </Box>
        //         </Grid>
        //     </Header>

        <AppBar
            // position="absolute"
            // // position="fixed"
            // style={{background: 'transparent', boxShadow: 'none',}}
            // sx={{
            //     width: "100%",
            //     mx: "auto"
            // }}
            position="static"
            color="primary"
            // elevation={0}
            sx={{background: (theme) => `${theme.palette.background}`}}
        >
            <Container maxWidth="xl">
                <Toolbar>

                    {/*<Box sx={{flexGrow:10}}/>*/}
                    <Box display="flex"
                        // justifyContent="flex-end"
                         sx={{flexGrow: 2, display: {xs: 'flex', md: 'none'}}}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            disableScrollLock={true}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            // sx={{
                            //     display: {xs: 'block', md: 'none'},
                            // }}
                        >

                            {/*{dataLink.map((page, index) => (*/}
                            {/*    <MenuItem*/}
                            {/*        key={`${index}_page_${page.title}`}*/}
                            {/*        onClick={handleCloseNavMenu}>*/}
                            {/*        <Link href={page.linkTo} underline="none"*/}
                            {/*              sx={{color: '#000000'}}>*/}
                            {/*            {page.title}*/}
                            {/*        </Link>*/}
                            {/*    </MenuItem>*/}
                            {/*))}*/}


                            <MenuItem
                                onClick={() => {
                                    handleCloseNavMenu()
                                    navigator(routes.projects)
                                }}>
                                {t("Projects")}
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleCloseNavMenu()
                                    navigator(routes.admins)

                                }}>
                                {t("Admins")}
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleCloseNavMenu()

                                    navigator(routes.settings)
                                }}>
                                {t("Settings")}
                            </MenuItem>
                            <MenuItem
                                onClick={clickLogout}>
                                {t("Logout")}
                            </MenuItem>
                        </Menu>
                        {/*<Box display="flex"*/}
                        {/*     justifyContent="flex-end">*/}
                        {/*@ts-ignore*/}
                        <Grid container justifyContent="flex-end">
                            <Languages/>
                            <ThemeSwitch/>
                        </Grid>
                        {/*</Box>*/}


                    </Box>
                    <Box display="flex" justifyContent="flex-end"
                         sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {/*<img id="logo-pos" src={"/icons/logo_main.svg"} alt="logo" onClick={() => setNewClick(countClick + 1)}/>*/}

                        {/*{dataLink.map((page, index) => <Link key={`${page.title}_${index}`} href={page.linkTo}*/}
                        {/*                                     underline="none"*/}
                        {/*                                     sx={{color: '#ffffff'}}>*/}
                        {/*    <Button sx={{color: 'white'}}>{t(page.title)}</Button>*/}
                        {/*</Link>)}*/}

                        <Button size="small"
                                color="inherit"
                                onClick={() => {
                                    navigator(routes.projects)
                                }}
                        >
                            {t("Projects")}
                        </Button>
                        <Button size="small"
                                color="inherit"
                                onClick={() => {
                                    navigator(routes.admins)
                                }}
                        >
                            {t("Admins")}
                        </Button>
                        <Button size="small"
                                color="inherit"
                                onClick={() => {
                                    navigator(routes.settings)
                                }}
                        >
                            {t("Settings")}
                        </Button>
                        <Languages/>
                        <ThemeSwitch/>
                        <Button size="small"
                                color="inherit"
                                onClick={clickLogout}
                        >
                            {t("Logout")}
                        </Button>


                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )

}

export default HeaderAuthorized