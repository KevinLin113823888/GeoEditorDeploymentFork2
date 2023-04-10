import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { GlobalStoreContext } from '../store'



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
        store.changeScreen("yourmap")
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleDeleteAccount = () => {
        setAnchorEl(null);
        store.changeModal("DELETE_ACCOUNT")
    };
    const handleMenuCloseGuest = () => {
        setAnchorEl(null);
    }

    const handleLogout = () => {
        handleMenuClose();
    }
    const handleHome = () => {
    }
    const handleSignOut=()=>{
        navigate("/");
        handleMenuClose();
        store.setHome()
    }
    const goHome = () => {
        store.setHome()
        navigate("/");
    }

    const menuId = 'primary-search-account-menu';
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
        sx={{p:2}}
    >

        <MenuItem onClick={handleMenuClose} sx={{p:1}}><Link to='/map' style={{color:"black"}}   >View My Maps</Link></MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{p:1}}><Link to='/forgotUsername/' style={{color:"black"}}>Change Username</Link></MenuItem>
        <MenuItem onClick={handleMenuCloseGuest} sx={{p:1}}><Link to='/forgotPassword/' style={{color:"black"}}>Change Password</Link></MenuItem>
        <MenuItem onClick={handleDeleteAccount} sx={{p:1}}><Link to='#'style={{color:"black"}}>Delete Account</Link></MenuItem>
        <MenuItem onClick={handleSignOut} sx={{p:1}}><Link to='/' style={{color:"black"}}>Sign Out</Link></MenuItem>
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
                style={{ border: "solid #000000", color: "black" }}
            >
                <MapIcon />
            </IconButton>
            <IconButton
                onClick={handleSetScreenCommunity}
                component={Link}
                to="/community"
                style={{ border: "solid #000000", color: "black" }}
            >
                <PeopleIcon />
            </IconButton>
            <IconButton
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                style={{ border: "solid #000000", color: "black" }}
            >
                <AccountCircle />
            </IconButton>


        </Grid>)
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ background: "#C6DCE5", margin: '0' }} elevation={0}>
                <Toolbar variant="regular">
                    <div onClick={goHome}>
                        <Typography
                            style={{ fontSize: "2.5rem", fontFamily: "October Tamil", color: "#5282f2", fontWeight: "bold", display: "inline" }}

                            component="span">
                            Geo
                        </Typography>
                        <Typography
                            style={{ fontSize: "2.5rem", fontFamily: "Satisfy", color: "#65bc3f", fontWeight: "bold", display: "inline" }}
                            component="span">
                            Editor
                        </Typography>
                    </div>
                    <PublicIcon style={{ fontSize: "2rem", color: "#009800" }} />
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