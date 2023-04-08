import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../../store'
import Box from '@mui/material/Box';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';

function PropertyCard(props) {
    const { store } = useContext(GlobalStoreContext);
   
    const {index,propertyObj,propertyMap} = props;

    function handleUserNameClick(){
        
        //store.showPublishedListsFilteredUsers(commentObj.user);
    }

    let cardElement = <div></div>
    
    cardElement=<Box style={{fontSize:"1.3rem"}}>
        {propertyObj}: {propertyMap.get(propertyObj)}
        <Box >
        <BorderColorIcon sx={{"&:hover": {fill: "rgba(255,240,10,0.8)"}} } style={{fontSize:"1.6rem"}}/> <DeleteIcon sx={{"&:hover": {fill: "rgba(255,240,10,0.8)"}}}
        style={{fontSize:"1.6rem"}}/>
        </Box>
        
    </Box>
    
    return (
        cardElement
    );
}

export default PropertyCard;