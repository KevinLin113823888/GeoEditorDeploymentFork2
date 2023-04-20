import { React, useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import MapCard from './MapCard.js'

import MUIDeleteAccModal from './MUIDeleteAccModal'
import MUICommunityPreviewModal from './MUICommunityPreviewModal'
import CreateNewMapModal from './CreateNewMapModal'
import { CurrentModal, GlobalStoreContext } from '../store'

import MUIChangeMapNameModal from './MUIChangeMapNameModal'


function Community() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const { store } = useContext(GlobalStoreContext);
    const [mapCards, setMapCards] = useState([]);


    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + 'community/getCommunity', {
            method: "GET",
            credentials: 'include',
            headers: {
            "Content-Type": "application/json",
            }
        })
        .then((res) => res.json())
        .then((data) => {
           console.log(data)
           if (data.mapcards === undefined) {
                setMapCards([]);
                console.log('none')
            } else {
                console.log(data.mapcards)
                setMapCards(data.mapcards);
                console.log(mapCards);
            }
        })
        .catch(err => console.log(err));
    }, []);

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

    function openPreview(){
        store.changeModal(CurrentModal.COMMUNITY_PREVIEW_MODAL);
    }

    return (
        <div className="Community">
            <MUIDeleteAccModal/>
            <MUICommunityPreviewModal/>
            <CreateNewMapModal/>
            <MUIChangeMapNameModal/>
            <div id="borderchange">
                <Box sx={{ marginTop: "1%" }}>
                    <Grid container rowSpacing={2} columnSpacing={4}>
                        <Grid item xs={4} >

                        </Grid>
                        <Grid item xs={6} >

                            <TextField type="text" id="outlined-basic" variant="outlined" onChange={
                                handleUpdateSearch} onKeyPress={handleKeyPress} height="2.2vw" placeholder="Search" style={{ marginTop: "0.1vw", background: "#ffffff", width: "60%" }}
                                inputProps={{
                                    style: {
                                        height: "0vw"
                                    }
                                }} />
                                 <IconButton type="submit" aria-label="search" onClick={handleKeyPress}>
                                <SearchIcon style={{ fill: "black" }} />
                            </IconButton>
                            <IconButton type="submit" aria-label="sort" onClick={handleSortMenuOpen} >
                                <SortIcon style={{ fill: "black" }} />
                            </IconButton>
                        </Grid>
                        <Grid item xs={2} >
                           
                        </Grid>
                        <Grid item xs={2}>
                            <Typography id="newmap-modal-title" variant="h6" component="h2" sx={{ marginLeft: "5%" }} style={{color: "#8c8a8a"}}>
                                Community
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>

                        </Grid>
                        
                        
                        { 
                            mapCards.map((map) => (
                                <Grid item xs={1.4} key = {map._id} >
                                <MapCard
                                    id = {map._id}
                                    key = {map._id}
                                    title={map.title}
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

export default Community;
