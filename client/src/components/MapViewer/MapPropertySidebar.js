
import React, { useState, useEffect, useRef,useContext } from 'react';


import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PropertyCard from './PropertyCard.js'
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import GlobalStoreContext from "../../store";

function MapPropertySidebar(props) {

    const { store } = useContext(GlobalStoreContext);
    let mapData = props.file

    const [propertiesMap, setPropertiesMap] = useState(new Map());
    const [propertiesMapList,setPropertiesMapList] = useState([]);

    // function setPropertiesValue

    useEffect(() =>{
        console.log(store.currentFeatureIndex)
        console.log("changed");
        console.log(Object.keys(mapData).length)

        if(Object.keys(mapData).length===0)
        {
            // console.log("nothing in here")
            // setPropertiesMap(new Map([[1 , 2], [2 ,3 ] ,[4, 5]]));
            return
        }

        setPropertiesMap(new Map(Object.entries(mapData.features[store.currentFeatureIndex].properties)))
        let tempArr = []


        propertiesMap.forEach((value, key) => tempArr.push(key))
        setPropertiesMapList(tempArr)
        // propertiesMapList.length = 20

    },[store.currentFeatureIndex,mapData]);


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
                    <IconButton >
                        < AddIcon style={{ fill: "#000000", fontSize: "2rem" }} />
                    </IconButton>
                    {propertiesMapList.map((propertyKey, index) => (
                        <PropertyCard
                            key={'map-property-' + (index)}
                            index={index}
                            propertyValue={propertiesMap.get(propertyKey)}
                            propertyKey={propertyKey}
                            propertyMap = {propertiesMap}
                            propertiesMapList={propertiesMapList}
                        />
                    ))}
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