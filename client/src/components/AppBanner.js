import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'

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

export default function AppBanner() {
   
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleMenuCloseGuest=()=>{
        setAnchorEl(null);
    }

    const handleLogout = () => {
        handleMenuClose();
  
    }
    const handleHome = () => {
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
>
    
    <MenuItem onClick={handleMenuClose}><Link to='#'>View My Maps</Link></MenuItem>
    <MenuItem onClick={handleMenuClose}><Link to='/forgotUsername/'>Change Username</Link></MenuItem>
    <MenuItem onClick={handleMenuCloseGuest}><Link to='/forgotPassword/'>Change Password</Link></MenuItem>
    <MenuItem onClick={handleMenuCloseGuest}><Link to='#'>Delete Account</Link></MenuItem>
    <MenuItem onClick={handleMenuCloseGuest}><Link to='/'>Sign Out</Link></MenuItem>
</Menu>
    
    let editToolbar = "";
    let menu = introMenu;

    
    
    
    function getAccountMenu() {
            return <IconButton
            sx={{left:"84%"}}
            size="medium"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            style={{border:".16vw solid #000000",color:"black"}}
        >
            <AccountCircle />
        </IconButton>;
    }
    
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{background: '#C6DCE5'}} >
                <Toolbar variant = "regular">
                    
                <Typography
                    style={{ fontSize: "2rem", fontFamily: "October Tamil", color: "#0049ff", fontWeight: "bold", display: "inline" }}
                    
                    component="span">
                    Geo
                </Typography>
                <Typography
                    style={{ fontSize: "2rem", fontFamily: "Satisfy", color: "#009800", fontWeight: "bold", display: "inline" }}
                    component="span">
                    Editor
                </Typography>
                <IconButton
                    component={Link}
                    to="/map"
                    sx={{left:"80%"}}
                    size="medium"
                    edge="end"
                    style={{border:".16vw solid #000000",color:"black"}}
                >
                    <MapIcon />
                </IconButton>
                <IconButton
                    component={Link}
                    to="/community"
                    sx={{left:"82%"}}
                    size="medium"
                    edge="end"
                    style={{border:".16vw solid #000000",color:"black"}}
                >
                    <PeopleIcon />
                </IconButton>
                        
                            { getAccountMenu() }
      
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}