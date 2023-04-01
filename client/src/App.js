import {React, useState} from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("a");
  const [username, setUserName] = useState("a");
  const [email, setEmail] = useState("a");
  const [password, setPassword] = useState("a");

  function postReq() {
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

  function changeName(event) {
    setName(event.target.value);
    console.log(name);
  }

  function changeUserName(event) {
    setUserName(event.target.value);
    console.log(username);
  }

  function changeEmail(event) {
    setEmail(event.target.value);
    console.log(email);
  }

  function changePassword(event) {
    setPassword(event.target.value);
    console.log(password);
  }

  return (
    <div className="App">
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

export default App;