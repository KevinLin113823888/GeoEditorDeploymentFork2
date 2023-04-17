import { React,useContext } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import GlobalStoreContext from '../store';
function Welcome() {

    const { store } = useContext(GlobalStoreContext);
    function handleGuest(){
        //store.changeScreen("community");
        store.setGuest(true,"community")
    }
    return (
        <div className="Welcome">
            
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <Box
                >
                <Typography
                    style={{ fontSize: "7rem", fontFamily: "October Tamil", color: "#0049ff", fontWeight: "bold", display: "inline" }}
                    component="span">
                    Geo
                </Typography>
                <Typography
                    style={{ fontSize: "7rem", fontFamily: "Satisfy", color: "#009800", fontWeight: "bold", display: "inline" }}
                    component="span">
                    Editor
                </Typography>
                </Box>
                <Box
                    style={{ fontSize: "2rem", fontFamily: "Satisfy", color: "#000000", fontWeight: "bold" }}
                >
                    
                    <div data-cy="message">Create, share, and explore community maps with an easy to use map editor</div>
                </Box>
                <Button data-cy="login-link" component={Link}to="/login" variant="contained" color="primary" sx={{ marginTop: '5%' }}>
                    Login
                </Button>
                <Button data-cy="register-link" component={Link} to="/register" variant="contained" color="primary" sx={{ marginTop: '2%' }}>
                    Register
                </Button>
                <Button component={Link} onClick={handleGuest} to="/community" variant="contained" color="primary" sx={{ marginTop: '2%' }}>
                    Continue as Guest
                </Button>
            </Box>

        </div>
    );
}

export default Welcome;