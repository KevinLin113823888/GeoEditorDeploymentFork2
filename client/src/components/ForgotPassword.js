import {React, useState} from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [displayedCode, setDisplayedCode] = useState("");

    function postReqSendPasswordRecoveryCode() {
        if (email !== "") {
            fetch(process.env.REACT_APP_API_URL + 'user/sendPasswordRecoveryCode', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            })
            .then((res) => res.json())
            .catch(err => console.log(err));
        }
    }

    function putReqChangePassword(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const passwordRecoveryCode = formData.get('recoveryCode');
        const password = formData.get('password');

        if (email !== "") {
            fetch(process.env.REACT_APP_API_URL + 'user/changePassword', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    passwordRecoveryCode: passwordRecoveryCode,
                    password: password
                }),
            })
            .then((res) =>
                res.json())
            .then((data) => {
                if(data.status==='OK'){
                    setDisplayedCode("password sucessfully reset")
                }
            })
            .catch(err => console.log(err));
        }
    }

    function changeEmail(event) {
        setEmail(event.target.value);
    }

    return (
        <div className="ForgotPassword">
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingTop= "1%">
                <Typography component="h3" variant="h5">
                  Reset your password by entering your email below
                </Typography>
                <Box paddingTop= '3%'>
                    <TextField
                    id="email-field"
                    label="email"
                    placeholder="email"
                    onChange={changeEmail}
                    />
                </Box>
                <Box paddingTop= '3%'>
                    <Button variant="contained" color="primary" sx={{ marginTop: '2%' }} onClick={postReqSendPasswordRecoveryCode}>
                        Send Password Recovery Code
                    </Button>
                </Box>
                <Box paddingTop= '3%'>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"    
                        paddingTop= "1%"
                    >
                        <Typography component="h3" variant="h5">
                            Enter recovery code and new password
                        </Typography>
                        
                        <Typography component="h3" variant="h5">
                            Password will only change after entering valid recovery code
                        </Typography>
                    </Box>
                </Box>
                <Box component="form" noValidate onSubmit={putReqChangePassword} sx={{ mt: 2, fontSize: "1vw"}}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        name="recoveryCode"
                        label="recoveryCode"
                        id="recoveryCode"
                        autoComplete="new-recoveryCode"
                        autoFocus
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                    />
                    </Grid>
                </Grid>
                <Button
                    data-cy="submit-button"
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 1 }}
                >
                    Confirm
                </Button>
                </Box>
                <Typography component="h3" variant="h5" color="#FF0000">
                    {displayedCode}
                </Typography>
            </Box>
        </div>
    );
}

export default ForgotPassword;