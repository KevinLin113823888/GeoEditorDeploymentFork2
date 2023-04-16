
import React, { useState, useEffect, useRef,useContext } from 'react';


import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PropertyCard from './PropertyCard.js'
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import GlobalStoreContext from "../../store";
import EditPropertiesTPS from "../../transactions/EditPropertiesTPS"

function MapPropertySidebar() { //should not use props

    const { store } = useContext(GlobalStoreContext);

    const [propertyObj, setPropertyObj] = useState({})

    useEffect(() =>{
        console.log(store.currentFeatureIndex)
        console.log("changed");
        if(Object.keys(store.currentMapData).length===0)
            return
        setPropertyObj(store.currentMapData.features[store.currentFeatureIndex].properties)

    },[store.currentFeatureIndex]);


    const handleAddProperty = () => {
        console.log("asd")
        let mappedData = {
            store: store,
            type: "add",
            mapDataFeatureIndex: store.currentFeatureIndex,
        }
        let transaction = new EditPropertiesTPS(mappedData);
        store.jstps.addTransaction(transaction)

    }
    let propertiesSideBar = <div></div>
    if (store.currentFeatureIndex > 0) {
        propertiesSideBar = 
            <Box sx={{ width: "93%", height: "80vh", maxHeight: "80%", overflowY: "scroll", }} style={{ border: "1px solid black" }}>
                <Box sx={{ marginLeft: "3%" }}>
                    <Typography
                        style={{ fontSize: "2rem", fontFamily: "October Tamil", color: "#000000", fontWeight: "bold", display: "inline" }}
                        className="material-icons"
                        component="span">
                        Properties
                    </Typography>
                    <IconButton
                        onClick = {handleAddProperty}
                    >
                        < AddIcon style={{ fill: "#000000", fontSize: "2rem" }}

                        />
                    </IconButton>
                    {
                        Object.entries(propertyObj).map(([key, value]) =>
                            (<PropertyCard
                                mapDataFeatureIndex={store.currentFeatureIndex}
                                propertyValue={value}
                                propertyKey={key}
                                p = {propertyObj}
                                sp = {setPropertyObj}
                            />)
                    )}

                </Box>

            </Box>

       
    }

    return (
        <div>
        {
            propertiesSideBar
        }
        </div>
    )
}

export default MapPropertySidebar