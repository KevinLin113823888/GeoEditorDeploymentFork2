import {React, useState} from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';


function ForgotUsername() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState('');

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
      .then((data) => {
        if (data.status === "ERROR"){
          setError(data.message);
        }
      })
      .catch(err => console.log(err));
    }
  }

  function changeEmail(event) {
    setEmail(event.target.value);
  }

  let err = <></>;
  if (error !== '') {
    err = <Alert severity="error">{error}</Alert>
  }

  return (
    <div className="ForgotUsername">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingTop= "10%">
        <Typography component="h3" variant="h4" style={{fontWeight: 'bold'}}>
          Retreive your Username
        </Typography>
        <Typography paddingTop='1%' component="h3" variant="h6" >
          Enter your email address and 
        </Typography>
        <Typography  component="h3" variant="h6" >
          we will mail you your username
        </Typography>
        <Box paddingTop= '2%'>
          <TextField
          id="email-field"
          label="Email address"
          placeholder="Email address"
          onChange={changeEmail}
          />
        </Box>
        <Box
          paddingTop= '1%'
        >
        <Button variant="contained" color="primary" sx={{ marginTop: '2%', bgcolor: '#4F46E5', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#3c348a',color:"white" } }} onClick={postReq}>
            Send Username to Email
        </Button>
        </Box>
        {err}
      </Box>
    </div>
  );
}

export default ForgotUsername;