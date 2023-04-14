
import { React, useContext } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PropertyCard from './PropertyCard.js'
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import GlobalStoreContext from "../../store";

function MapPropertySidebar(props) {

    const { store } = useContext(GlobalStoreContext);
    let mapData = props.file
    let propertiesMap = {}
    let propertiesMapList = []
    if (mapData.features !== undefined) {
        propertiesMap = new Map(Object.entries(mapData.features[store.currentFeatureIndex].properties))
        console.log("store", mapData.features[store.currentFeatureIndex].properties);
        propertiesMap.forEach((value, key) => propertiesMapList.push(key))
        propertiesMapList.length = 20
    }

    // const Demo = styled('div')(({ theme }) => ({
    //     // backgroundColor: theme.palette.background.paper,
    // }));
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
                    {propertiesMapList.map((propertyObj, index) => (
                        <PropertyCard
                            key={'map-property-' + (index)}
                            index={index}
                            propertyObj={propertyObj}
                            propertyMap={propertiesMap}
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