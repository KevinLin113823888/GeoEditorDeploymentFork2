import { useContext,useState } from 'react'
import * as React from 'react';
import GlobalStoreContext, {CurrentModal} from "../../store";
import Grid from "@mui/material/Grid";
import MapEditor from "./MapEditor";
import MapPropertySidebar from "./MapPropertySidebar";
import {ListItem, ListItemText} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import SquareIcon from '@mui/icons-material/Square';
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
        }
    ]

    function handleChangeLegendColor(index) {
        store.changeModal(CurrentModal.MAP_PICK_COLOR_WHEEL)
        return undefined;
    }

    return (
    <>

        <Grid container spacing={2}>
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
        </Grid>


    </>
        )
}
export default MapLegendFooter;