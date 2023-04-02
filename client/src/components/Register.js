import {React, useState} from "react";
import { Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function postReq() {
    if (name !== "" & username !== "" & email !== "" & password !== "") {
      console.log(name, username, email, password);
      fetch('http://localhost:9000/' + 'user/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: name,
          username: username, 
          email: email,
          password: password
        }),
      })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch(err => console.log(err));
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
      <h1>Register Page</h1>
      Name:
      <input data-cy="name-input" onChange={changeName} type="text" />
      Username:
      <input data-cy="username-input" onChange={changeUserName} type="text" />
      Email:
      <input data-cy="email-input" onChange={changeEmail} type="text" />
      Password:
      <input data-cy="password-input" onChange={changePassword} type="text" />
      <button data-cy="submit-button" onClick={postReq} type="submit" value="Submit">Submit</button>
      <div>
        <nav>
          <Link data-cy="home-link" to="/">Home</Link>
        </nav>
      </div>
    </div>
  );
}

export default Register