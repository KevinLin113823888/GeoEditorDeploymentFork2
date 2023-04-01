import {React, useState} from "react";
import axios from "axios";

function App() {
  const [state, setState] = useState("");

  function postReq() {
    axios.post('http://localhost:9000/register', {
      name: 'David',
      username: 'Wang', 
      email: "blah@gmail.com",
      password: "42069", 
      key: "aaa"
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div className="App">
      {/* <button onClick={getReq}>Default</button> */}
      {/* <div>{state}</div> */}
      <form>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <label>
          UserName:
          <input type="text" name="name" />
        </label>
        <label>
          Email:
          <input type="text" name="name" />
        </label>
        <label>
          Password:
          <input type="text" name="name" />
        </label>
        <input onClick={postReq} type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;