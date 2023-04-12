import {React, useState} from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';


function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [passwordRecoveryCode, setPasswordRecoveryCode] = useState("");
    const [displayedCode, setDisplayedCode] = useState("");

    const [password, setPassword] = useState("");


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
                .then((data) => {
                    setDisplayedCode(data.passwordRecoveryCode)
                })
                .catch(err => console.log(err));
        }
    }

    function putReqChangePassword() {
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
    function changeCode(event) {
        setPasswordRecoveryCode(event.target.value);
    }
    function changePassword(event) {
        setPassword(event.target.value);
    }
    return (
        <div className="ForgotPassword">

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"    
                paddingTop= "1%"
            >
                
                <Typography component="h3" variant="h5">
                  Reset your password by entering your email below
                </Typography>
                <Box
                  paddingTop= '3%'
                >
                  <TextField
                  id="email-field"
                  label="email"
                  placeholder="email"
                  onChange={changeEmail}
                />
                </Box>
                <Box
                  paddingTop= '3%'
                >
                <Button variant="contained" color="primary" sx={{ marginTop: '2%' }} onClick={postReqSendPasswordRecoveryCode}>
                    Sent Password recovery code
                </Button>
                </Box>
                <Box
                  paddingTop= '3%'
                >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"    
                    paddingTop= "1%"
                >
                <Typography component="h3" variant="h5">
                    Your passwordRecoveryCode :  {displayedCode}
                </Typography>
                <Typography component="h3" variant="h5">
                    Enter recovery code and new password
                </Typography>
                
                <Typography component="h3" variant="h5">
                    Password will only change after entering valid recovery code
                </Typography>
            </Box>
                </Box>

                <Box
                  paddingTop= '3%'
                >
                  <TextField
                  id="recovery-code"
                  label="Enter recovery code"
                  placeholder="recovery code"
                  onChange={changeCode}
                />
                </Box>
                
                <Box
                  paddingTop= '3%'
                >
                  <TextField
                  id="new-password"
                  label="Enter new password"
                  placeholder="new password"
                  onChange={changePassword}
                />
                </Box>

                <Box
                  paddingTop= '3%'
                >
                <Button variant="contained" color="primary" sx={{ marginTop: '2%' }} onClick={putReqChangePassword}>
                    Sent Password recovery code
                </Button>
                </Box>

            </Box>



            {/* Forgot Password
            Email:
            <input onChange={changeEmail} type="text" />
            <button onClick={postReqSendPasswordRecoveryCode} type="submit" value="Submit">Submit email</button>
            <div>
                Your passwordRecoveryCode :  {displayedCode}
            </div>
            enter code
            <input onChange={changeCode} type="text" />
            enter password
            <input onChange={changePassword} type="text" />
            <button onClick={putReqChangePassword} type="submit" value="Submit">Submit code and password</button>
            <div>
                <nav>
                    <Link data-cy="home-link" to="/">Home</Link>
                    <Link data-cy="login-link" to="/login">Login</Link>
                </nav>
            </div> */}




        </div>
    );
}

export default ForgotPassword;