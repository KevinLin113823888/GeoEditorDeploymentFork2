
import {React} from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PropertyCard from './PropertyCard.js'
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';

function MapPropertySidebar(props) {


    let mapData = props.file
    let propertiesMap = {}
    let propertiesMapList = []
    if(mapData.features!==undefined)
    {
        propertiesMap = new Map(Object.entries(mapData.features[0].properties))

        propertiesMap.forEach((value, key) => propertiesMapList.push(key))
        propertiesMapList.length = 20
    }

    // const Demo = styled('div')(({ theme }) => ({
    //     // backgroundColor: theme.palette.background.paper,
    // }));


    return (
    <div >
            <Box sx={{width:"80%",height:"100vh",maxHeight:"80%",overflowY: "scroll",}} style={{ border:"1px solid black"}}>
                <Box sx={{marginLeft:"3%"}}>
            <Typography
                    style={{ fontSize: "2rem", fontFamily: "October Tamil", color: "#000000", fontWeight: "bold", display: "inline" }}
                   
                    component="span">
                    Properties
                </Typography>
                <IconButton >
                        < AddIcon style={{fill:"#000000",fontSize:"2rem"}}/>
                </IconButton>
            {propertiesMapList.map((propertyObj, index) => (
                    <PropertyCard
                        key={'map-property-' + (index)}
                        index={index}
                        propertyObj={propertyObj}
                        propertyMap= {propertiesMap}
                    />
                ))} 
                </Box> 
            {/* <ListItem
                secondaryAction={
                    <IconButton >
                        < AddIcon/>
                    </IconButton>

                }
                sx={{
                    width: 150,
                    
                }}
            >
                <ListItemText primary={`properties: `} />
            </ListItem>
                {

                    propertiesMapList.map((key) =>
                        <ListItem
                            sx={{
                                width: 300,
                            }}
                            key={key}
                            secondaryAction={
                                <IconButton aria-label="comment">
                                    < DeleteIcon/>
                                </IconButton>
                            }>

                            <ListItemText primary={`${key}: `} />
                            <ListItemText primary={`${propertiesMap.get(key)}: `} />

                        </ListItem>
                    )} */}
            </Box>

    </div>
)}

export default MapPropertySidebar