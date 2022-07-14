import React from "react";
import {AppBar, Box, Toolbar} from "@mui/material";


interface PropsHeader {
    children: React.ReactNode
}

const Header = (props: PropsHeader) => {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
            position="static"
            color="primary"
            // elevation={0}
             sx={{background: (theme) => `${theme.palette.background}`}}
        >
            <Toolbar >
                {props.children}
            </Toolbar>
        </AppBar>
        </Box>
    )

}
export default Header;