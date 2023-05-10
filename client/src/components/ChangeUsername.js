import {React, useState} from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from '@mui/material/Alert';


function ChangeUsername() {
  const [error, setError] = useState("");

  function handleSubmit(event) {
    let bug = false;
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('newusername');
    if (username.length < 6) {
      setError("Invalid new username");
      bug = true;
    }

    if (email !== "" && password !== "" && bug === false) {
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
      .then((data) => {
        console.log(data);
        if (data.status === "ERROR") {
          setError(data.message);
        }
      })
      .catch(err => console.log(err));
    }
  }

  let err = <></>;
  if (error !== '') {
    err = <Alert severity="error">{error}</Alert>
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '1vw',
        }}
      >
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
                name="email"
                label="email"
                id="email"
                autoComplete="new-email"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="newusername"
                label="newusername"
                type="newusername"
                id="newusername"
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
          {err}
        </Box>
      </Box>
    </div>
    </Box>
    </Container>
  );
}

export default ChangeUsername;