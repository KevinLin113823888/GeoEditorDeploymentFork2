import { useContext,useState } from 'react'
import * as React from 'react';
import GlobalStoreContext, {CurrentModal} from "../../store";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MapEditor from "./MapEditor";
import MapPropertySidebar from "./MapPropertySidebar";
import {ListItem, ListItemText} from "@mui/material";

import LegendCard from './LegendCard.js'
function MapLegendFooter(props) {
    const { store } = useContext(GlobalStoreContext);

    let legend = [
        {
            color:"#123456",
            legendText: "Sample one idk"
        },
        {
            color:"#123453",
            legendText: "Sample two idk"
        },
        {
            color:"#123456",
            legendText: "Sample three idk"
        },
        {
            color:"#123453",
            legendText: "Sample four idk"
        },
        {
            color:"#000000",
            legendText: "Sample five idk"
        },
        {
            color:"#ffffff",
            legendText: "Sample six idk bruh what the hec is going on smh"
        },

    ]

    
    {/* <Grid container spacing={2}>
            
            {
                legend.map((key,index) =>
                    <ListItem
                        sx={{
                            width: 300,
                            color: 'black',
                            border: 'solid'

                        }}
                        key={key}
                        secondaryAction={
                            <IconButton aria-label="comment">
                                < DeleteIcon/>
                            </IconButton>
                        }>



                        <ListItemText primary={
                            <IconButton aria-label="comment"
                                onClick={()=>{
                                    handleChangeLegendColor(index)
                                }}
                            >
                                < SquareIcon
                                    sx={{
                                        color: `${key.color}`
                                    }}
                                />
                            </IconButton>
                        } />
                        <ListItemText secondary={`${key.legendText}: `} />

                    </ListItem>)
            }
        </Grid> */}


    return (
        <Grid container rowSpacing={0} columnSpacing={2} sx={{marginLeft:"2%"}}>
                {legend.map((legendObj, index) => (
                    <Grid item xs={2.4} >
                    <LegendCard
                        key={'map-legend-' + (index)}
                        index={index}
                        legendObj={legendObj}
                    />
                    </Grid>
                ))} 
                
                        
                
                
        </Grid>

    
        )
}
export default MapLegendFooter;