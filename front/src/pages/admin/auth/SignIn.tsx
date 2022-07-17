import React from 'react';
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import EmailField from "../../../components/fields/EmailField";
import PasswordField from "../../../components/fields/PasswordField";
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {login} from "../../../store/middlewares/auth";
import {sha256} from "js-sha256";


const SignIn = () => {
    const [t] = useTranslation('translation');
    const dispatcher: Function = useDispatch();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        dispatcher(login({
            data: {
                email: data.get('email'),
                /* @ts-ignore */
                password: sha256(data.get('password')),
                // password: data.get('password'),
            },
            // headers: {
            //     Language: i18n.language
            // }
        }))
    };


    return (<React.Fragment>
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
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    {t("Sign In")}
                </Typography>
                <Box component="form"
                     onSubmit={handleSubmit}
                    // onSubmit{(event) =>{}}
                    //  noValidate
                     sx={{mt: 1, width: 1}}>
                    <EmailField/>
                    <PasswordField titleField={"password"} label={t("Password")}/>
                    {/*<FormControlLabel*/}
                    {/*    control={<Checkbox value="remember" color="primary"/>}*/}
                    {/*    label={t("Remember me")}*/}
                    {/*/>*/}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        {t("Sign In")}
                    </Button>
                    <Grid container spacing={10}>
                        {/*<Grid item xs>*/}
                        {/*    <Link href="#" variant="body2" onClick={() => {*/}
                        {/*        // navigator(routes.restore_password)*/}
                        {/*    }}>*/}
                        {/*        {t("Forgot password?")}*/}
                        {/*    </Link>*/}
                        {/*</Grid>*/}
                        {/*<Grid item>*/}
                        {/*    <Link href="#" variant="body2" onClick={() => {*/}
                        {/*        navigator(routes.sign_up)*/}
                        {/*    }}>*/}
                        {/*        {t("Don't have an account? Sign Up")}*/}
                        {/*    </Link>*/}
                        {/*</Grid>*/}

                    </Grid>

                </Box>
            </Box>
        </Container>
    </React.Fragment>)

}

export default SignIn