import {React, useState} from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  function postReq() {
    if (username !== "" & password !== "") {
      fetch('http://localhost:9000/user/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: username,
          password: password
        }),
      })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch(err => console.log(err));
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
          <Link to="/">Home</Link>
          <Link to="/register">Register</Link>
          <Link to="/ForgotUsername">Forgot Username</Link>
        </nav>
      </div>
    </div>
  );
}

export default Login;