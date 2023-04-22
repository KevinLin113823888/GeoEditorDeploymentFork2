import React, { useContext, useState,useEffect } from 'react'
import { GlobalStoreContext } from '../../store'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import { Typography } from '@mui/material';
import EditPropertiesTPS from "../../transactions/EditPropertiesTPS"

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './mapEditor.css';


function PropertyCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const [editMode,setEditMode]=useState(true);

    const {mapDataFeatureIndex,propertyKey,propertyValue} = props;

    const [getPropertyValue,setPropertyValue] = useState(propertyValue);

    const [getPropertyKey,setPropertyKey] = useState(propertyKey);




    useEffect (()=> {
        console.log("use effect is called")
        setPropertyValue(propertyValue)
        setPropertyKey(propertyKey)
    },[propertyValue,propertyKey])

    function handleChangePropertyValue(event){
        setPropertyValue(event.target.value)
    }

    function handleChangePropertyKey(event){
        setPropertyKey(event.target.value)
    }


    // function handleClick(){
    //     console.log(propertyKey)
    //     setEditMode(!editMode);
    // }

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
        store.jstps.addTransaction(transaction)

    }
    
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            handlePropertyValueBlur()
            handlePropertyKeyBlur()
            // if(!editMode)
            //     setEditMode(true);
        }
    }

    const handlePropertyValueBlur = () => {
        if(getPropertyValue ===propertyKey )
            return
        let mappedData = {
            store: store,
            type: "edit",
            newPropertyValue: getPropertyValue,
            propertyKey: propertyKey,
            mapDataFeatureIndex: mapDataFeatureIndex,
            setPropertyObj: props.setPropertyObj
        }

        let transaction = new EditPropertiesTPS(mappedData);
        store.jstps.addTransaction(transaction)
    }

    const handlePropertyKeyBlur = () => {
        if(propertyKey === getPropertyKey)
            return //dont do anything if same
        console.log("i guess this is key blur somehow")
        let mappedData = {
            store: store,
            type: "keyEdit",
            oldKey: propertyKey,
            propertyKey: getPropertyKey,
            mapDataFeatureIndex: mapDataFeatureIndex,
            setPropertyObj: props.setPropertyObj
        }

        let transaction = new EditPropertiesTPS(mappedData);
        store.jstps.addTransaction(transaction)
    }
    return (
        <Box style={{fontSize:"1.3rem"}}>

            {/*<Typography className="textfield" display="inline">{propertyKey}  </Typography>*/}


            <InputGroup className="mb-3">
                <input type="text" className="form-control" id="validationCustom01" value={getPropertyKey}
                       onChange={handleChangePropertyKey}
                       onBlur={handlePropertyKeyBlur}
                       style={{fontFamily:'Helvetica'}}
                       required />
                <input type="text" className="form-control" id="validationCustom01" value={getPropertyValue}
                       onChange={handleChangePropertyValue}
                       onBlur={handlePropertyValueBlur}
                       style={{borderRadius:"0px 6px 6px 0px",fontFamily:'Helvetica'}}

                       required />  
                <DeleteIcon className= "material-icons2" onClick={handleDelete} sx={{"&:hover": {fill: "rgba(255,240,10,0.8)"}}} style={{fontSize:"1.6rem",marginTop:"5px"}}/>

            </InputGroup>


            {/*<TextField*/}
            {/*    name="email"*/}
            {/*    value={getPropertyValue}*/}
            {/*    margin="normal"*/}
            {/*    onChange={handleChange}*/}
            {/*    disabled={editMode}*/}
            {/*    display="inline"*/}
            {/*    size="small"*/}
            {/*    style={{}}*/}
            {/*    variant="standard"*/}
            {/*    sx={{maxWidth:"11rem","& .MuiInputBase-input.Mui-disabled": {*/}
            {/*            WebkitTextFillColor: "#000000",disableUnderline: true*/}
            {/*        },}}*/}
            {/*    onKeyPress={handleKeyPress}*/}
            {/*    //   InputProps={{ disableUnderline: true }}*/}
            {/*/>*/}
            {/*<Box >*/}
            {/*    <BorderColorIcon onClick={handleClick} sx={{"&:hover": {fill: "rgba(255,240,10,0.8)"}} } style={{fontSize:"1.6rem"}}/>*/}
            {/*    <DeleteIcon onClick={handleDelete} sx={{"&:hover": {fill: "rgba(255,240,10,0.8)"}}} style={{fontSize:"1.6rem"}}/>*/}
            {/*</Box>*/}

        </Box>
    );
}

export default PropertyCard;