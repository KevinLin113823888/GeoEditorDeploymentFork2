import {React, useState} from "react";
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  function postReq() {
    if (username !== "" & password !== "") {
      fetch('http://localhost:9000/' + 'user/login', {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          username: username,
          password: password
        }),
      })
      .then((res) => {
        res.json();
        if (res.status === 200) {
          console.log("LOGGED IN, going to your maps");
          navigate('/map');
        }
      })
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
      <h1>Login Page</h1>
      Username:
      <input data-cy="username-input" onChange={changeUserName} type="text" />
      Password:
      <input data-cy="password-input" onChange={changePassword} type="text" />
      <button data-cy="submit-button" onClick={postReq} type="submit" value="Submit">Submit</button>
      <div>
        <nav>
          <Link data-cy="home-link" to="/">Home</Link>
          <Link data-cy="register-link" to="/register">Register</Link>
          <Link data-cy="forgotusername-link" to="/forgotUsername">Forgot Username</Link>
          <Link data-cy="forgotpassword-link" to="/forgotPassword">Forgot password?</Link>

        </nav>
      </div>
    </div>
  );
}

export default Login;