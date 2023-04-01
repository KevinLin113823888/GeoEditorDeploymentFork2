import {React, useState} from "react";
import axios from "axios";
import { Routes, Route, Link } from 'react-router-dom';
import Register from './Register';
import ForgotUsername from './ForgotUsername';

function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  function postReq() {
    if (username !== "" & password !== "") {
      axios.post('http://localhost:9000/user/login', {
        username: username, 
        password: password, 
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  function changeUserName(event) {
    setUserName(event.target.value);
  }

  function changePassword(event) {
    setPassword(event.target.value);
  }

  return (
    <div className="Login">
      Login Page
      UserName:
      <input onChange={changeUserName} type="text" />
      Password:
      <input onChange={changePassword} type="text" />
      <button onClick={postReq} type="submit" value="Submit">Submit</button>
      <div>
        <nav>
          <Link to="/register">Register</Link>
          <Link to="/ForgotPassword">Forgot Password</Link>
        </nav>
        <Routes>
          <Route path="/ForgotUsername" exact element={<ForgotUsername/>} />
        </Routes>
      </div>
    </div>
  );
}

export default Login;