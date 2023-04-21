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
    const { id, title} = props;

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

        console.log(id, title);
        store.setPreviewId(id, "COMMUNITY_PREVIEW_MODAL");
        // store.changeModal("COMMUNITY_PREVIEW_MODAL");
        
    }
    function handleDuplicateMap(event) {
        console.log("duplicating map of ", id);
        event.stopPropagation();
        event.preventDefault();
        store.changeModal("COPY_MAP");

        // store.changeModal("NEW_MAP_NAME");
        
    }
    function handleEditMapName(event) {
        console.log("editing map name of ", id);
        // store.changeModal("NEW_MAP_NAME");
        store.setCurrentMapCardId(id, "NEW_MAP_NAME")
        
    }
    

    let cardElement = 
        
        <Box sx={{ marginLeft: "10%",
            borderRadius:'15px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
            width:"100%",
            border: '2px solid transparent',
            '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: '#4F46E5',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
            border: '3px solid #34D399',
            },}}>
            <Box onClick = {handleClick} sx={{ width: "100%",
                backgroundImage:`url(${background})`,
                height: "20vh", borderRadius:'15px 15px 0px 0px', border:"0px"}}/>
            <Box sx={{ width: "100%",
                backgroundColor: "#F0F4F8",
                height: "10vh", borderRadius:'0px 0px 15px 15px', border:"0px"}}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"> 
                <Box style={{fontWeight:"bold"}}>{title}</Box>
                <Box sx={{marginTop:"3%"}}>
                    <FileCopyIcon onClick = {handleDuplicateMap} sx={{"&:hover": { fill: "yellow"}}}/>
                    <BorderColorIcon onClick = {handleEditMapName} sx={{"&:hover": { fill: "yellow"}}}/>
                    <DeleteIcon onClick = {handleRemoveMap}sx={{"&:hover": { fill: "yellow"}}}/>
                </Box>
            </Box>
            </Box>
        </Box>
        
   
    if(store.currentScreen=="community"){
        cardElement=
        
        <Box sx={{ marginLeft: "10%",
        borderRadius:'15px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
        width:"100%",
        border: '2px solid transparent',
        '&:hover': {
        transform: 'translateY(-4px)',
        borderColor: '#4F46E5',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
        border: '3px solid #34D399',
        },}}>
            <Box onClick = {handleClickCommunity} sx={{ width: "100%",
                backgroundImage:`url(${background})`,
                height: "20vh", borderRadius:'15px 15px 0px 0px', border:"0px"}}/>
            <Box sx={{ width: "100%",
                backgroundColor: "#F0F4F8",
                height: "10vh", borderRadius:'0px 0px 15px 15px', border:"0px"}}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"> 
                <Box sx={{fontWeight: "bold"}}>{title}</Box>
                
                </Box>
            </Box>
        </Box>
       
    }
    return (
        cardElement
    );
}

export default MapCard;