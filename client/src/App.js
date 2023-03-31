import {React, useState} from "react";
import Axios from "axios";

function App() {
  const [state, setState] = useState("");

  function getReq() {
    Axios({
      method: "GET",
      url: "http://localhost:9000/",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      console.log(res.data.message);
      setState(res.data.message);
    });
  }

  return (
    <div className="App">
      <button onClick={getReq}>Default</button>
      <div>{state}</div>
    </div>
  );
}

export default App;