import {React, useState} from "react";
import axios from "axios";

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
    </div>
  );
}

export default Login;