import {React, useState} from "react";
import axios from "axios";

function ForgotUsername() {
  const [email, setEmail] = useState("");

  function postReq() {
    if (email !== "") {
      axios.post('http://localhost:9000/user/forgotUsername', {
        email: email, 
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
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
    </div>
  );
}

export default ForgotUsername;