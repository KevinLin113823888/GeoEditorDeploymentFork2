
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
        console.log("use effect for the store.currentfeature index ig")
        console.log(store.currentFeatureIndex)
        if(store.currentFeatureIndex===-1){
            setPropertyObj({})
            return
        }
        if(Object.keys(store.currentMapData).length===0)
            return
        if(store.currentFeatureIndex>=store.currentMapData.features.length)
            return
        setPropertyObj(store.currentMapData.features[store.currentFeatureIndex].properties)

        console.log("this is our propery obj bruh")
        console.log(propertyObj)

    },[store.currentFeatureIndex]);


    const handleAddProperty = () => {
        let mappedData = {
            store: store,
            type: "add",
            mapDataFeatureIndex: store.currentFeatureIndex,
            setPropertyObj: setPropertyObj,
        }
        let transaction = new EditPropertiesTPS(mappedData);
        store.jstps.addTransaction(transaction)
    }

    let propertiesSideBar = <div></div>
    if (true) {
        console.log("our propery is not empty therefore we should render it holy")
        propertiesSideBar = 
            <Box sx={{ width: "93%", height: "80vh", maxHeight: "80%", overflowY: "scroll",marginBottom:"5%" }} style={{ border: "1px solid black",backgroundColor:"#f5f5f5",borderRadius:"12px",}}>
                <Box sx={{ marginLeft: "3%" }}>
                    <Typography
                        style={{ fontSize: "2rem", fontFamily:'Helvetica', color: "#000000", fontWeight: "bold", display: "inline" }}
                        className="material-icons"
                        component="span"
                    >
                        Properties
                    </Typography>
                    <IconButton onClick = {handleAddProperty}>
                        < AddIcon style={{ fill: "#000000", fontSize: "2rem" }}/>
                    </IconButton>
                        {Object.entries(propertyObj).map(([key, value]) =>
                            (<PropertyCard
                                mapDataFeatureIndex={store.currentFeatureIndex}
                                propertyValue={value}
                                propertyKey={key}
                                p = {propertyObj}
                                setPropertyObj = {setPropertyObj}
                                // delete = {handleDelete}
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