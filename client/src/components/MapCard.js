import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'
import background from "./cardPic.png";

function MapCard(props) {
    const navigate = useNavigate();
    const { store } = useContext(GlobalStoreContext);
    const { id, map, index } = props;

    function handleRemoveMap(event) {
        console.log("removing map of ", id);
        event.stopPropagation();
        // store.showRemoveMapModal(index, map);
        fetch(process.env.REACT_APP_API_URL + 'map/deleteMapById', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id
            }),
        })
        .then((res) => res.json())
        .then((data) => {

        })
        .catch(err => console.log(err));
    }
    function handleClick(event) {
        console.log("clicking map of ", id);
        event.stopPropagation();
        event.preventDefault();
        // GO TO MAP EDITOR SCREEN
        store.changeScreen("mapEditor")
        navigate("/map/" + id);
    }
    function handleClickCommunity(event) {
        event.stopPropagation();
        event.preventDefault();
        store.changeModal("COMMUNITY_PREVIEW_MODAL");
        
    }
    function handleDuplicateMap(event) {
        console.log("duplicating map of ", id);
        event.stopPropagation();
        event.preventDefault();
        
    }
    function handleEditMap(event) {
        console.log("editing map of ", id);
        
        store.changeModal("NEW_MAP_NAME");
    }
    

    let cardElement = 
    <Box sx={{"&:hover": {backgroundColor: "rgba(255,240,10,0.8)",}}}>
        <Box sx={{ marginLeft: "10%",width:"100%"}}>
            <Box onClick = {handleClick} sx={{ width: "100%",
                backgroundImage:`url(${background})`,
                height: "20vh"}}/>
            <Box sx={{ width: "100%",
                backgroundColor: "lightGreen",
                height: "10vh"}}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"> 
                <Box style={{fontWeight: "500"}}>{map.title}</Box>
                <Box sx={{marginTop:"3%",}}>
                    <FileCopyIcon onClick = {handleDuplicateMap} sx={{"&:hover": { fill: "yellow"}}}/>
                    <BorderColorIcon onClick = {handleEditMap} sx={{"&:hover": { fill: "yellow"}}}/>
                    <DeleteIcon onClick = {handleRemoveMap}sx={{"&:hover": { fill: "yellow"}}}/>
                </Box>
            </Box>
            </Box>
        </Box>
    </Box>
    if(store.currentScreen=="community"){
        cardElement=
        <Box sx={{"&:hover": {backgroundColor: "rgba(255,240,10,0.8)",}}}>
        <Box sx={{ marginLeft: "10%",width:"100%"}}>
            <Box onClick = {handleClickCommunity} sx={{ width: "100%",
                backgroundImage:`url(${background})`,
                height: "20vh"}}/>
            <Box sx={{ width: "100%",
                backgroundColor: "lightGreen",
                height: "10vh"}}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"> 
                <Box style={{fontWeight: "500"}}>{map.title}</Box>
                
                </Box>
            </Box>
        </Box>
        </Box>
    }
    return (
        cardElement
    );
}

export default MapCard;