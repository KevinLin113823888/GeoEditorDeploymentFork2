import React, { useContext, useState,useEffect } from 'react'
import { GlobalStoreContext } from '../../store'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import { Typography } from '@mui/material';

function PropertyCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [change,setChange]=useState("");
    const [editMode,setEditMode]=useState(true);

    const {index,propertyKey,propertyValue} = props;

    const [gpropertyValue,spropertyValue] = useState(props.propertyValue);

    useEffect (()=> {
        spropertyValue(props.propertyValue)
    },[props.propertyValue])
    function handleChange(event){
        spropertyValue(event.target.value)
        setChange(event.target.value)
    }
    function handleClick(){
   
        setEditMode(!editMode);
        
        
    }
    function handleDelete(){

    }
    
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if(!editMode)
                setEditMode(true);
        }
    }
    let cardElement = <div>
        
         <IconButton onClick={handleClick}>
                  <BorderColorIcon />
        </IconButton>
    </div>

    cardElement=<Box style={{fontSize:"1.3rem"}}>
        <Typography className="textfield" display="inline">{propertyValue}  </Typography>

    <TextField
        name="email"
        value={gpropertyValue}
        margin="normal"
        onChange={handleChange}
        disabled={editMode}
        display="inline"
        size="small"
        style={{}}
        variant="standard"
        sx={{maxWidth:"11rem","& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",disableUnderline: true
            },}}
        onKeyPress={handleKeyPress}
        //   InputProps={{ disableUnderline: true }}
    />
        <Box >
        <BorderColorIcon onClick={handleClick} sx={{"&:hover": {fill: "rgba(255,240,10,0.8)"}} } style={{fontSize:"1.6rem"}}/> <DeleteIcon onClick={handleDelete} sx={{"&:hover": {fill: "rgba(255,240,10,0.8)"}}}
        style={{fontSize:"1.6rem"}}/>
        </Box>
        
    </Box>
    
    return (
        cardElement
    );
}

export default PropertyCard;