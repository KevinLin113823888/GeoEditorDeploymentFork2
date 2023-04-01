import {React, useState} from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function postReq() {
    if (name !== "" & username !== "" & email !== "" & password !== "") {
      console.log(name, username, email, password);
      axios.post('http://localhost:9000/user/register', {
        name: name,
        username: username, 
        email: email,
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

  function changeName(event) {
    setName(event.target.value);
  }

  function changeUserName(event) {
    setUserName(event.target.value);
  }

  function changeEmail(event) {
    setEmail(event.target.value);
  }

  function changePassword(event) {
    setPassword(event.target.value);
  }

  return (
    <div className="Register">
      Register Page
      Name:
      <input onChange={changeName} type="text" />
      UserName:
      <input onChange={changeUserName} type="text" />
      Email:
      <input onChange={changeEmail} type="text" />
      Password:
      <input onChange={changePassword} type="text" />
      <button onClick={postReq} type="submit" value="Submit">Submit</button>
    </div>
  );
}

export default Register