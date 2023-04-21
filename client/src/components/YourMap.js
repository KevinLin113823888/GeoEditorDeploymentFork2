import { React, useState, useEffect, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';

import {TextField,InputAdornment} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import MapCard from './MapCard.js'



import MUIDeleteAccModal from './MUIDeleteAccModal'
import MUICopyMapModal from './MUICopyMapModal'
import CreateNewMapModal from './CreateNewMapModal'
import { CurrentModal, GlobalStoreContext } from '../store'

import MUIChangeMapNameModal from './MUIChangeMapNameModal'


function YourMap() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [mapCards, setMapCards] = useState([]);
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const { store } = useContext(GlobalStoreContext);
    const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };



    useEffect(() => {
        onLoad();
    }, []);

    function onLoad() {
        fetch(process.env.REACT_APP_API_URL + 'user/loggedIn', {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setUsername(data.username);
                if (data.mapcards === undefined) {
                    setMapCards([]);
                } else {
                    setMapCards(data.mapcards);
                }
            })
            .catch(err => console.log(err));
    }

    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleSortByDate = (event) => {
        //store.sortMapCardsByDate()
        setAnchorEl(null);

    };
    const handleSortByName = (event) => {
        //store.sortMapCardsByName()
        setAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuId = 'sort-menu';
    const sortMenu = <Menu
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

        <MenuItem onClick={handleSortByName}>Sort By Name</MenuItem>
        <MenuItem onClick={handleSortByDate}>Sort By Date</MenuItem>

    </Menu>


    function handleUpdateSearch(event) {
        console.log("searching...", event.target.value);
        setSearch(event.target.value);
    }

    function handleKeyPress(event) {
        if (search != "") {
            if (event.type === "keypress" && event.code === "Enter") {
                console.log("search for", search);
            }
            if (event.type === "click") {
                console.log("search for", search);
            }
        }
    }

    function openCreateModal(){
        store.changeModal(CurrentModal.CREATE_NEW_MAP)
    }

    function handleSort() {
        console.log("sorting that needs to be implemented");
    }

    return (
       
        <div className="YourMap" >
            <MUIDeleteAccModal />
            <CreateNewMapModal/>
            <MUIChangeMapNameModal 
                handleUpdate={onLoad}
            />
            <MUICopyMapModal
                handleUpdate={onLoad}
                />
            <div id="borderchange">
                <Box sx={{ marginTop: "1%" }}>
                    <Grid container rowSpacing={2} columnSpacing={4}>
                        <Grid item xs={3} md={4} >

                        </Grid>
                        <Grid item xs={8} md={6}>

                            <TextField type="text" id="outlined-basic" variant="outlined" onChange={
                                handleUpdateSearch} onKeyPress={handleKeyPress} placeholder="Search" 
                                style={{ marginTop: "0.1vw", background: "#F4F6F8", width: "60%",
                                }}
                                sx={{
                                    bgcolor: '#fff',
                                    borderRadius: '10px',
                                    border: '2px solid black',
                                    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                                    '& .MuiInputBase-input': {
                                      py: '1rem',
                                      pl: isFocused ? '0px' : '13px',
                                      transition: 'padding-left 0.2s ease-out'
                                    },
                                    '& .MuiInputAdornment-root': {
                                      position: 'absolute',
                                      left: '3px',
                                      transition: 'opacity 0.2s ease-out',
                                      opacity: isFocused ? 0 : 1,
                                    },
                                  }}
                                  onFocus={handleFocus}
                                  onBlur={handleBlur}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <SearchIcon style={{ fill: "grey" }} />
                                      </InputAdornment>
                                    ),
                                  }}
                                inputProps={{
                                    style: {
                                        height: "0vw"
                                    }
                                }} />
                            <IconButton type="submit" aria-label="sort" onClick={handleSortMenuOpen} >
                                <SortIcon style={{ fill: "black" }} />
                            </IconButton>
                        </Grid>
                        <Grid item xs={1} md={2}>
                           
                        </Grid>
                        <Grid item xs={4} md={2}>
                            <Typography id="newmap-modal-title" variant="h5"  sx={{ marginLeft: "5%" ,fontWeight: 'bold'}} style={{color: "#8c8a8a"}}>
                                My Maps
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={10}>

                        </Grid>
                        <Grid item  xs={3.7} md={1.4}>
                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" 
                            sx={{ width: "100%", backgroundColor: "#ededed", height: "30vh", marginLeft: "10%","&:hover": { backgroundColor: "grey",transform: 'translateY(-4px)',},borderRadius:'15px',}} onClick={openCreateModal} >
                                <ControlPointIcon style={{ fill: "black", fontSize: "5rem" }} />
                            </Box>
                        </Grid>
                        
                        { 
                            mapCards.map((map) => (
                                <Grid item xs={3.7} md={1.4} key = {map.id} >
                                <MapCard
                                    id = {map.id}
                                    key = {map.id}
                                    title={map.title}
                                    handleUpdate={onLoad}
                                />
                                </Grid>
                            ))
                        }

                    </Grid>
                </Box>



              

            </div>


            {/* <IconButton data-cy="createmap-button" onClick={openCreateModal}>
                <ControlPointIcon style={{ fill: "black" }} />
            </IconButton> */}

            {sortMenu}
        </div>
        
    )
}

export default YourMap;