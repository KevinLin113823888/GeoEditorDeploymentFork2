import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { alignProperty } from '@mui/material/styles/cssUtils';

function CommentCard(props) {
    const { store } = useContext(GlobalStoreContext);
   
    const {index,commentObj} = props;

    function handleUserNameClick(){
        
        //store.showPublishedListsFilteredUsers(commentObj.user);
    }

    let cardElement = <div></div>
    
    cardElement=<Box style={{fontSize:"1.3rem"}} sx={{marginTop:"1rem",marginRight:"1rem"}}>
        <Box sx={{wordWrap:"break-word"}}>
        <AccountCircleIcon className = "material-icons" style={{ fontSize: '1.7rem' }}/>
        <Box sx={{display:"inline"}}>{commentObj.username}</Box>
        <Box style={{marginLeft:"1.7rem"}}>
            {commentObj.comment}
        </Box>
        </Box>
        
    </Box>
    
    return (
        cardElement
    );
}

export default CommentCard;