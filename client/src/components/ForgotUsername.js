import {React, useState} from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';

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
      
      <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                
                paddingTop= "10%"
            >
                
                <Typography component="h3" variant="h5">
                  Retrive your username by entering your email below
                </Typography>
                <Box
                  paddingTop= '3%'
                  
                >
                  <TextField
                  id="email-field"
                  label="email"
                  placeholder="email"
                  onChange={changeEmail}
                />
                </Box>
                <Box
                  paddingTop= '3%'
                >
                <Button variant="contained" color="primary" sx={{ marginTop: '2%' }} onClick={postReq}>
                    Sent Username to Email
                </Button>
                </Box>
            </Box>




      {/* Forgot Username
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
      </div> */}
    </div>
  );
}

export default ForgotUsername;