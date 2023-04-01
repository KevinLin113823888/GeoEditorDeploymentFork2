import {React, useState} from "react";
import axios from "axios";

function ForgotUsername() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  function postReq() {
    if (email !== "") {
      fetch('http://localhost:9000/user/forgotUsername', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      })
      .then((res) => res.json())
      .then((data) => setUsername(data.username))
      .catch(err => console.log(err));
    }
  }

  function changeEmail(event) {
    setEmail(event.target.value);
  }

  return (
    <div className="ForgotUsername">
      Forgot Username
      Email:
      <input onChange={changeEmail} type="text" />
      <button onClick={postReq} type="submit" value="Submit">Submit</button>
      <div>
        Your Username: {username}
      </div>
    </div>
  );
}

export default ForgotUsername;