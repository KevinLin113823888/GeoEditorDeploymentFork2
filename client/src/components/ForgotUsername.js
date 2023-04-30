import {React, useState} from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';

function ForgotUsername() {
  const [email, setEmail] = useState("");

  function postReq() {
    if (email !== "") {
      fetch(process.env.REACT_APP_API_URL + 'user/forgotUsername', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      })
      .then((res) => res.json())
      .catch(err => console.log(err));
    }
  }

  function changeEmail(event) {
    setEmail(event.target.value);
  }

  return (
    <div className="ForgotUsername">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingTop= "10%">
        <Typography component="h3" variant="h5">
          Retrive your username by entering your email below
        </Typography>
        <Box paddingTop= '3%'>
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
            Send Username to Email
        </Button>
        </Box>
      </Box>
    </div>
  );
}

export default ForgotUsername;