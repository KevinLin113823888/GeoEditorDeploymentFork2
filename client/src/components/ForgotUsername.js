import {React, useState} from "react";
import { Link } from 'react-router-dom';

function ForgotUsername() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  function postReq() {
    if (email !== "") {
      fetch("http://localhost:9000/" + 'user/forgotUsername', {
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
      <div>
        <nav>
          <Link data-cy="home-link" to="/">Home</Link>
          <Link data-cy="login-link" to="/login">Login</Link>
        </nav>
      </div>
    </div>
  );
}

export default ForgotUsername;