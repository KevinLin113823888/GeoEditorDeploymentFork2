import {React, useState} from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [displayedCode, setDisplayedCode] = useState([false, ""]);
    const [recoveryCodeError, setRecoveryCodeError] = useState("");

    function postReqSendPasswordRecoveryCode() {
        if (email !== "") {
            fetch(process.env.REACT_APP_API_URL + 'user/sendPasswordRecoveryCode', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                if (data.status === "ERROR") {
                    setRecoveryCodeError(data.message);
                } else {
                    setRecoveryCodeError('');
                }
            })
            .catch(err => console.log(err));
        }
    }

    function putReqChangePassword(event) {
        let bug = false;
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const passwordRecoveryCode = formData.get('recoveryCode');
        const password = formData.get('password');
        if (password.length < 6) {
            setDisplayedCode([true, "Invalid password size"]);
            bug = true;
        }

        if (email !== "" && !bug) {
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
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                if(data.status==='OK'){
                    setDisplayedCode([false, "password sucessfully reset"]);
                } else {
                    setDisplayedCode([true, data.message]);
                }
            })
            .catch(err => console.log(err));
        }
    }

    function changeEmail(event) {
        setEmail(event.target.value);
    }

    let recErr = <></>;
    if (recoveryCodeError !== '') {
        recErr = <Alert severity="error">{recoveryCodeError}</Alert>
    }

    let passErr = <></>;
    if (displayedCode[1] !== '') {
        if (displayedCode[0] == false) {
            passErr = <Alert severity="success">{displayedCode[1]}</Alert>
        } else {
            passErr = <Alert severity="error">{displayedCode[1]}</Alert>
        }
    }

    return (
        <div className="ForgotPassword">
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingTop= "1%">
                <Typography component="h3" variant="h4" style={{fontWeight: 'bold'}}>
                  Reset your password
                </Typography>
                <Typography paddingTop='1%' component="h3" variant="h6" >
                  Enter your email address and we will send you a recovery code. 
                </Typography>
                <Box paddingTop= '2%'>
                    <TextField
                    id="email-field"
                    label="Email address"
                    placeholder="Email address"
                    onChange={changeEmail}
                    />
                </Box>
                <Box paddingTop= '1%'>
                    <Button variant="contained" color="primary" sx={{ marginTop: '2%', bgcolor: '#4F46E5', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#3c348a',color:"white" }  }} onClick={postReqSendPasswordRecoveryCode}>
                        Send Password Recovery Code
                    </Button>
                </Box>
                {recErr}
                <Box paddingTop= '3%'>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"    
                        paddingTop= "1%"
                    >
                        <Typography component="h3" variant="h4" style={{fontWeight: 'bold'}}>
                            Enter recovery code and New password
                        </Typography>
                        
                        <Typography paddingTop='1%' component="h3" variant="h6" >
                            Password will only change after entering valid recovery code.
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
                            label="New Password"
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
                        sx={{ mt: 2, mb: 1 , bgcolor: '#4F46E5', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#3c348a',color:"white" }}}
                    >
                        Confirm
                    </Button>
                    {passErr}
                </Box>
                
            </Box>
        </div>
    );
}

export default ForgotPassword;