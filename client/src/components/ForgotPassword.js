import {React, useState} from "react";
import { Link } from 'react-router-dom';

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
            Forgot Password?
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
            </div>
        </div>
    );
}

export default ForgotPassword;