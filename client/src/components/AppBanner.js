import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalStoreContext } from '../store';

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PeopleIcon from '@mui/icons-material/People';
import MapIcon from '@mui/icons-material/Map';
import Grid from '@mui/material/Grid';
import PublicIcon from '@mui/icons-material/Public';

export default function AppBanner() {
    const navigate = useNavigate();
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleSetScreenCommunity = () => {
        
        store.changeScreen("community")
    };
    const handleSetScreenYourMap = () => {
        navigate("/map");
        store.changeScreen("yourmap")
    };
    const handleSetScreenYourMapClose = () => {
        navigate("/map");
        setAnchorEl(null);
        store.changeScreen("yourmap")
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleDeleteAccount = () => {
        setAnchorEl(null);
        store.changeModal("DELETE_ACCOUNT")
    };
    const handleMenuCloseForgotPassword = () => {
        setAnchorEl(null);
        navigate("/forgotPassword/");
    }
    const handleMenuCloseChangeUserName=()=>{
        navigate("/changeUsername/");
        setAnchorEl(null);
    }
    
    const handleLogout = () => {
        handleMenuClose();
    }
    const handleHome = () => {
    }
    const handleSignOut=()=>{
        fetch(process.env.REACT_APP_API_URL + 'user/logout', {
            method: "delete",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
        });
        navigate("/");
        handleMenuClose();
        store.setHome()
    }
    const goHome = () => {
        store.setHome()
        navigate("/");
    }

    const menuId = 'primary-search-account-menu';
    const menuStyle= {marginBottom:"10px",border:"1px solid black",borderRadius:"10px",bgcolor:"#F0EFEF",'&:hover': { bgcolor: 'grey',color:"white" }};
    const introMenu = <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
            sx: {
              paddingLeft:2,
              paddingRight:2,
              paddingTop:1, // adds padding of 2 to the Paper component
              bgcolor:"#f0f8ff",
              border:"1px solid black",
              borderRadius:"10px"
            },
          }}
        
    >

        <MenuItem onClick={handleSetScreenYourMapClose} sx={menuStyle}><Link to='/map' style={{color:"black",padding:"10px",textDecoration: 'none'}}    >View My Maps</Link></MenuItem>
        <MenuItem onClick={handleMenuCloseChangeUserName} sx={menuStyle}><Link to='/changeUsername/' style={{color:"black",padding:"10px",textDecoration: 'none'}} >Change Username</Link></MenuItem>
        <MenuItem onClick={handleMenuCloseForgotPassword} sx={menuStyle}><Link to='/forgotPassword/' style={{color:"black",padding:"10px",textDecoration: 'none'}}>Change Password</Link></MenuItem>
        <MenuItem onClick={handleDeleteAccount} sx={menuStyle}><Link to='#'style={{color:"black",padding:"10px",textDecoration: 'none'}}>Delete Account</Link></MenuItem>
        <MenuItem onClick={handleSignOut} sx={menuStyle}><Link to='/' style={{color:"black",padding:"10px",textDecoration: 'none'}}>Sign Out</Link></MenuItem>
    </Menu>

    let editToolbar = "";
    let menu = introMenu;

    
    function getAccountMenu() {
        if(store.currentScreen!=="home" && store.guestMode==false){
        return (<Grid container justifyContent="flex-end" style={{ gap: 10 }}>
            <IconButton
                onClick={handleSetScreenYourMap}
                component={Link}
                to="/map"
                sx={{
                    border: "solid #f0f8ff",
                    color: "black",
                    backgroundColor:"#d1d9e4",
                    '&:hover': {
                      backgroundColor: "#c4ccd4",
                      transition: "background-color 0.3s ease-in-out",
                    }
                  }}
                
            >
                <MapIcon />
                
            </IconButton>
            <IconButton
                onClick={handleSetScreenCommunity}
                component={Link}
                to="/community"
                sx={{
                    border: "solid #f0f8ff",
                    color: "black",
                    backgroundColor:"#d1d9e4",
                    '&:hover': {
                      backgroundColor: "#c4ccd4",
                      transition: "background-color 0.3s ease-in-out",
                    }
                  }}
            >
                <PeopleIcon />
            </IconButton>
            <IconButton
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                sx={{
                    border: "solid #f0f8ff",
                    color: "black",
                    backgroundColor:"#d1d9e4",
                    '&:hover': {
                      backgroundColor: "#c4ccd4",
                      transition: "background-color 0.3s ease-in-out",
                    }
                  }}
            >
                <AccountCircle />
            </IconButton>


        </Grid>)
        }
    }
    function handleGlobeClick(){
        const globeIcon = document.getElementById('globe-icon');
        if (globeIcon.classList.contains("spin-fast")) {
            globeIcon.classList.remove("spin-fast");
        }else if(globeIcon.classList.contains("spin-medium")){
            globeIcon.classList.remove("spin-medium");
            globeIcon.classList.add("spin-fast");
        }else if(globeIcon.classList.contains("spin-slow")){
            globeIcon.classList.remove("spin-slow");
            globeIcon.classList.add("spin-medium");
        }else{
            globeIcon.classList.add("spin-slow");
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ background: "#f0f8ff", margin: '0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} elevation={0}>
                <Toolbar variant="regular">
                    <div onClick={goHome} data-cy="home-link" style={{cursor: 'pointer'}} >
                        <Typography
                            style={{ fontSize: "2.5rem", fontFamily: "October Tamil", color: "#3b82f6", fontWeight: "bold", display: "inline" }}

                            component="span">
                            Geo
                        </Typography>
                        <Typography
                            style={{ fontSize: "2.5rem", fontFamily: "Satisfy", color: "#10b981", fontWeight: "bold", display: "inline" }}
                            component="span">
                            Editor
                        </Typography>
                    </div>
                    <PublicIcon id="globe-icon" className = "globe-icon" style={{ fontSize: "2rem", color: "#009800" }} sx={{"&:hover": {  transform: 'rotate(15deg)'} }} onClick={handleGlobeClick} />
                    {
                        getAccountMenu()
                    }
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}