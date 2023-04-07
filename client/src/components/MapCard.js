import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
function MapCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { map, index } = props;

    function handleRemoveMap(event) {
        event.stopPropagation();

        store.showRemoveMapModal(index, map);
    }
    function handleClick(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    function handleDuplicateMap(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    function handleEditMap(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    

    let cardElement = <Box sx={{"&:hover": {backgroundColor: "rgba(255,240,10,0.8)",}}}>
        <Box onClick={handleClick} sx={{ marginLeft: "10%",width:"100%"}}>
        <Box sx={{ width: "100%", backgroundColor: "lightgreen", height: "20vh"}}  >

        </Box>
        <Box sx={{ width: "100%", backgroundColor: "#ededed", height: "10vh"}}>
            <Box display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"> <Box style={{fontWeight: "medium"}}>{map.title}</Box>
                <Box sx={{marginTop:"3%",}}><FileCopyIcon onclick = {handleDuplicateMap} sx={{"&:hover": { fill: "yellow"}}}/>
                <BorderColorIcon onclick = {handleEditMap} sx={{"&:hover": { fill: "yellow"}}}/><DeleteIcon onclick = {handleRemoveMap}sx={{"&:hover": { fill: "yellow"}}}/></Box>
                
            </Box>
           
        </Box>
    </Box>
    </Box>
    return (
        cardElement
    );
}

export default MapCard;