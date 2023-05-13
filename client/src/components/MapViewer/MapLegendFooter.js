import {useEffect, useRef, useState, useContext} from "react";

import * as React from 'react';
import GlobalStoreContext, {CurrentModal} from "../../store";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MapEditor from "./MapEditor";
import MapPropertySidebar from "./MapPropertySidebar";
import {ListItem, ListItemText} from "@mui/material";

import LegendCard from './LegendCard.js'
function MapLegendFooter(props) {
    const { store} = useContext(GlobalStoreContext);

    const [legend,setLegend] = useState([])
    useEffect(() => {
        // console.log("get whatever there is first.")
        let graphData = store.currentMapData.graphicalData
        if(graphData === undefined ){
            // console.log("well its undefined")
            return
        }


        // console.log("i guess its not now")
        // console.log("i can see things are getting stated")
        setLegend(graphData.legend)
        console.log("things are stated for the legend and the legend is getting updated")
        console.log(legend)
    },[store])
    // let legend = [
    //     {
    //         color:"#123456",
    //         legendText: "Sample one idk"
    //     }
    // ]

    return (
        <Grid container rowSpacing={0} columnSpacing={2} sx={{marginLeft:"2%"}}>
            {legend.map((legendObj, index) => (
                <Grid item xs={5} md={2.4} >
                    <LegendCard
                        // key={'map-legend-' + (index)}
                        index={index}
                        legendObj={legendObj}
                        updateViewer={props.updateViewer}
                    />
                </Grid>
            ))}  
        </Grid>
        )
}
export default MapLegendFooter;