import React, { useContext, useState,useEffect } from 'react'
import { GlobalStoreContext } from '../../store'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import { Typography } from '@mui/material';
import EditPropertiesTPS from "../../transactions/EditPropertiesTPS"

function PropertyCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const [editMode,setEditMode]=useState(true);

    const {mapDataFeatureIndex,propertyKey,propertyValue} = props;

    const [getPropertyValue,setPropertyValue] = useState(propertyValue);


    useEffect (()=> {
        console.log("use effect is called")
        setPropertyValue(propertyValue)
    },[propertyValue,mapDataFeatureIndex])

    function handleChange(event){
        let mappedData = {
            store: store,
            type: "edit",
            oldPropertyValue: getPropertyValue,
            newPropertyValue: event.target.value,
            propertyKey: propertyKey,
            mapDataFeatureIndex: mapDataFeatureIndex,
            setPropertyObj: props.setPropertyObj
        }

        let transaction = new EditPropertiesTPS(mappedData);
        store.jstps.addTransaction(transaction)
        setPropertyValue(event.target.value)


    }

    function handleClick(){
        console.log(propertyKey)
        setEditMode(!editMode);
    }

    function handleDelete(){

        let mappedData = {
            store: store,
            type: "delete",
            oldPropertyValue: getPropertyValue,
            propertyKey: propertyKey,
            mapDataFeatureIndex: mapDataFeatureIndex,
            setPropertyObj: props.setPropertyObj
        }
        let transaction = new EditPropertiesTPS(mappedData);
        // props.sp(this.store.currentMapData.features[mapDataFeatureIndex].properties)
        store.jstps.addTransaction(transaction)



    }
    
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if(!editMode)
                setEditMode(true);
        }
    }

    return (
        <Box style={{fontSize:"1.3rem"}}>

            <Typography className="textfield" display="inline">{propertyKey}  </Typography>

            <TextField
                name="email"
                value={getPropertyValue}
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
    );
}

export default PropertyCard;