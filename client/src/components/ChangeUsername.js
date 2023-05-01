import {React, useState} from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

function ChangeUsername() {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('new username');

    if (email !== "" && password !== "" && username != "") {
      fetch(process.env.REACT_APP_API_URL + 'user/changeUsername', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
            { 
                email: email, 
                password: password, 
                newUsername: username,
            }),
      })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch(err => console.log(err));
    }
  }

  return (
    <div className="ForgotUsername">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingTop= "10%">
        <Typography component="h3" variant="h4" style={{fontWeight: 'bold'}}>
          Change your Username
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, fontSize: "1vw"}}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="Email Address"
                label="Email Address"
                id="email"
                autoComplete="new-email"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="Password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="New Username"
                label="New Username"
                type="new username"
                id="new username"
                autoComplete="new-username"
              />
            </Grid>
          </Grid>
          <Button
            data-cy="submit-button"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1, bgcolor: '#4F46E5', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#3c348a',color:"white" } }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default ChangeUsername;