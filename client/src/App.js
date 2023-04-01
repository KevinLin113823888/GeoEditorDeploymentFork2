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
      <form>
        <label>
          Name:
          <input onChange={changeName} type="text" />
        </label>
        <label>
          UserName:
          <input onChange={changeUserName} type="text" />
        </label>
        <label>
          Email:
          <input onChange={changeEmail} type="text" />
        </label>
        <label>
          Password:
          <input onChange={changePassword} type="text" />
        </label>
        <input onClick={postReq} type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;