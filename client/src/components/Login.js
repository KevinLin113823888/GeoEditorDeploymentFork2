import { React, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { GlobalStoreContext } from '../store'

function Login() {
  const navigate = useNavigate();
  const { store } = useContext(GlobalStoreContext);


  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('userName');
    const password = formData.get('password');

      const server =       process.env.REACT_APP_API_SERVER


      if (username !== "" & password !== "") {
      fetch(server + 'user/login', {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      })
        .then((res) => {
          res.json();
          if (res.status === 200) {
            console.log("LOGGED IN, going to your maps");
            navigate('/map');
            store.changeScreen("yourmap")
          }
        })
        .catch(err => console.log(err));
    }
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

        <Typography component="h3" variant="h5">
          Login
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, fontSize: "1vw"}}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="userName"
                label="User Name"
                id="userName"
                autoComplete="uname"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
          >
            Login
          </Button>
          <Grid container>
                            <Grid item xs>
                                <Link href="/forgotPassword/" variant="body2">
                                    Forgot Password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/forgotUsername/" variant="body2">
                                    {"Forgot Username?"}
                                </Link>
                            </Grid>
                        </Grid>
        </Box>
      </Box>


    </Container>



  );
}

export default Login;
