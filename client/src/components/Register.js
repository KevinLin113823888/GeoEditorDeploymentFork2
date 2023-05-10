import {React, useState,useContext} from "react";
import {  useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { GlobalStoreContext } from '../store';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const { store } = useContext(GlobalStoreContext);

  function handleSubmit (event) {
    let bug = false;
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username =  formData.get('userName');
    const name =  formData.get('firstName');
    const email = formData.get('email');
    const password = formData.get('password');
    if (password.length < 6) {
      setError('Password: Please fill in a valid password');
      bug = true;
    }
    const verifypassword = formData.get('passwordVerify');
    if (password !== verifypassword) {
      setError('Password: Verify password does not match password');
      bug = true;
    }
    const server = process.env.REACT_APP_API_URL;

    if (!bug) {
      fetch(server + 'user/register', {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: name,
          username: username, 
          email: email,
          password: password
        }),
      })
      .then((res) => {
        if (res.status === 200) {
          console.log("REGISTERED, going to your maps");
          navigate('/map');
          store.changeScreen("yourmap")
        }
        return res.json();
      }) 
      .then((data) => {
        setError(data.message);
      }) 
    }
  };
  
  function changeName(event) {
    setName(event.target.value);
  }

  function changeUserName(event) {
    setUserName(event.target.value);
  }

  function changeEmail(event) {
    setEmail(event.target.value);
  }

  function changePassword(event) {
    setPassword(event.target.value);
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
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '1vw',
        }}
    >
        <Typography component="h3" variant="h4" style={{fontWeight: 'bold'}}>
            <div data-cy="register">Sign up</div>
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, fontSize:"1vw" }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField data-cy="username-input"
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
                    <TextField data-cy="email-input"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />
                </Grid>
                <Grid item xs={12} >
                    <TextField data-cy="name-input"
                        autoComplete="fname"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="Name"
                        
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <TextField data-cy="password-input"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField data-cy="passwordverify-input"
                        required
                        fullWidth
                        name="passwordVerify"
                        label="Password Verify"
                        type="password"
                        id="passwordVerify"
                        autoComplete="new-password"
                    />
                </Grid>
            </Grid>
            <Button data-cy="submit-button"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 1, bgcolor: '#4F46E5', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#3c348a',color:"white" }  }}
            >
                Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link href="/login/" variant="body2">
                        Already have an account? Sign in
                    </Link>
                </Grid>
            </Grid>
            {err}
        </Box>
    </Box>
  
    
</Container>
    
  );
}

export default Register