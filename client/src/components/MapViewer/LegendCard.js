import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../../store'
import Box from '@mui/material/Box';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Typography } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import SquareIcon from '@mui/icons-material/Square';
function LegendCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { index, legendObj } = props;

    function handleUserNameClick() {

        //store.showPublishedListsFilteredUsers(commentObj.user);
    }
    function handleChangeLegendColor(index) {
        store.changeModal("MAP_PICK_COLOR_WHEEL")
        return undefined;
    }

    let cardElement = <div></div>
    let colorString= legendObj.color;
    cardElement = <Box style={{ height: "10vh" }} >
        <BorderColorIcon className="material-icons" sx={{"&:hover": {fill: "rgba(255,240,10,0.8)"}} } style={{fontSize:"1.6rem"}}/>
         <DeleteIcon className="material-icons" sx={{"&:hover": {fill: "rgba(255,240,10,0.8)"}}}/>
       
            < SquareIcon className="material-icons" onClick={() => {
                handleChangeLegendColor()
            }}
                sx={{
                    color:legendObj.color
                }}
            />
      
            
        {legendObj.legendText}
        </Box>

    return (
        cardElement
    );
}

export default LegendCard;