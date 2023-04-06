import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {React} from "react";
import MapEditor from "./MapEditor";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import styled from "@emotion/styled";
import {Add, List} from "@mui/icons-material";
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";

function MapPropertySidebar(props) {


    let mapData = props.file
    let propertiesMap = {}
    let propertiesMapList = []
    if(mapData.features!==undefined)
    {
        propertiesMap = new Map(Object.entries(mapData.features[0].properties))

        propertiesMap.forEach((value, key) => propertiesMapList.push(key))
        propertiesMapList.length = 10
    }

    // const Demo = styled('div')(({ theme }) => ({
    //     // backgroundColor: theme.palette.background.paper,
    // }));


    return (
    <div >


        <Grid item xs={12}
        >

            <ListItem
                secondaryAction={
                    <IconButton aria-label="comment">
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
                                color: 'black',
                                border: 'solid'

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
                    )}
        </Grid>

    </div>
)}

export default MapPropertySidebar