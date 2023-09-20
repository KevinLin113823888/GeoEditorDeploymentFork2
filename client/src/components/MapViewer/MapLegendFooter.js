import {useEffect, useRef, useState, useContext} from "react";

import * as React from 'react';
import GlobalStoreContext, {CurrentModal} from "../../store";
import Grid from "@mui/material/Grid";

import LegendCard from './LegendCard.js'
function MapLegendFooter(props) {
    const { store} = useContext(GlobalStoreContext);

    const [legend,setLegend] = useState([])
    useEffect(() => {
        let graphData = store.currentMapData.graphicalData
        if(graphData === undefined ){
            return
        }

        setLegend(graphData.legend)
    },[store])


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