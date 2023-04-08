import { useContext,useState } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import GlobalStoreContext, {CurrentModal} from "../../../store";
import Grid from "@mui/material/Grid";
import MapEditor from "../MapEditor";
import MapPropertySidebar from "../MapPropertySidebar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';
import MapLegendFooter from "../MapLegendFooter";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: '#f1f1f1',
    border: '.16vw solid #000',
    boxShadow: 24,
    p: 2,
};

function MapClassificationModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleDeleteUser(event) {
        store.changeModal("NONE");
    }
    function handleCloseModal(event) {
        store.changeModal("NONE");
    }

    return (
        <Modal open={store.currentModal === CurrentModal.MAP_CLASSIFICATION}
               onClick={handleCloseModal}
        >

            <Box sx={style}
                 onClick={e => e.stopPropagation()}>





                <Grid container spacing={2}>
                    <Box style={{backgroundColor:"#f1f1f1", color:"black",paddingTop:"1vh",paddingBottom:"1vh",paddingLeft:"5%"}}>
                        <header className="dialog-header">

                            <Typography style={{
                                fontSize:"1.4rem",
                            }}>
                                <h3
                                    style={{
                                        color: 'black'
                                    }}

                                >Enter a brief description of your Map</h3>
                            </Typography>
                        </header>
                    </Box>

                    <IconButton sx={{
                        float: 'right'
                    }}
                                onClick={handleCloseModal}>
                        < CloseIcon/>
                    </IconButton>


                </Grid>



                <TextField
                    onBlur={(e) =>{
                        console.log(e)
                    }}
                    variant="filled"
                    InputProps={{
                        disableUnderline: true
                    }}
                />


                <Grid container spacing={2}>

                    <Grid item xs >
                        <Button
                            variant="contained"
                            onClick={Function}
                        >
                            Confirm
                        </Button>
                    </Grid>



                </Grid>



            </Box>
        </Modal>
    );
}
export default MapClassificationModal;