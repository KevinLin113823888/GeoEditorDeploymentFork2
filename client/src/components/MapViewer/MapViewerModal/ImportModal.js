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

function ImportModal(props) {
    const { store } = useContext(GlobalStoreContext);

    function handleDeleteUser(event) {
        store.changeModal("NONE");
    }
    function handleCloseModal(event) {
        store.changeModal("NONE");
    }

    return (
        <Modal open={store.currentModal === CurrentModal.MAP_IMPORT}
               onClick={handleCloseModal}
        >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    onClick={e => e.stopPropagation()}

                    sx={style}>
                    <IconButton type="submit" onClick={handleCloseModal} style={{ position: 'absolute', right: '0', top: '0' }} >
                        <CloseIcon style={{ fontSize: '2rem', fill: 'black' }} />
                    </IconButton>
                    <header className="dialog-header">
                        <Box style={{ marginBottom: "5%" }}>
                            <Typography variant="h6" component="h2" style={{ fontSize: "2.5rem" }}>
                                <strong>Import Map</strong>
                            </Typography>

                        </Box>
                    </header>
                    <Typography style={{fontSize:"1.0rem",
                            textAlign:"center"}}>
                            <strong>Import a geoJson map or shp/dbf map file combo</strong>
                        </Typography>


                        <Button
                            sx={{marginTop:'3%',
                                marginBottom: '3%'}}
                            variant="contained"
                            component="label"
                            >
                            Upload GeoJSON
                            <input
                                type="file"
                                hidden
                                accept=".json" onChange={props.handleGeoJson}
                            />
                        </Button>
                
                        <Grid container 
                                    // display="flex"
                                    // // flexDirection="column"
                                    // justifyContent="center"
                                    // alignItems="center" 
                                    >
                            <Grid item xs={6}
                                display="flex"
                                justifyContent="Right"
                                sx={{paddingRight:'2%'}}
                            >
                            <Button
                                // sx={{marginLeft:'3%'}}
                                variant="contained"
                                component="label"
                                >
                                Upload .shp file
                                <input
                                    type="file"
                                    hidden
                                    accept=".shp" onChange={e=>{props.handleShpDbfFile(e,"shp")}}
                                />
                            </Button>
                            </Grid>
                            <Grid item xs={6} 
                            display="flex"
                            justifyContent="Left"
                            sx={{paddingLeft:'2%'}}

                            >
                            <Button
                                // sx={{marginRight:'3%'}}
                                variant="contained"
                                component="label"
                                >
                                Upload .dbf file
                                <input
                                    type="file"
                                    hidden
                                    accept=".dbf" onChange={e=>{props.handleShpDbfFile(e,"dbf")}}
                                />
                            </Button>
                            </Grid>
                        </Grid>
                </Box>
            </Modal>
        /*
        <Modal open={store.currentModal === CurrentModal.MAP_IMPORT}
               onClick={handleCloseModal}
        >
            <Box sx={style}
                 onClick={e => e.stopPropagation()}
            >
                <Grid item xs >
                    <IconButton sx={{
                        float: 'right'
                    }}
                                onClick={handleCloseModal}>
                        < CloseIcon/>
                    </IconButton>
                </Grid>
                <header className="dialog-header">
                    <Box style={{backgroundColor:"#f1f1f1", color:"black",paddingTop:"1vh",paddingBottom:"1vh"}}>
                        <Typography style={{fontSize:"3.0rem",
                        textAlign:"center"
                        }}>
                            <strong>Import Map</strong>
                        </Typography>


                        <Typography style={{fontSize:"1.0rem",
                            textAlign:"center"}}>
                            <strong>Import a geoJson map or shp/dbf map file combo</strong>
                        </Typography>

                    </Box>
                </header>

                <Grid container spacing={2}>


                    <Grid item xs >
                        <Button
                            variant="contained"
                            onClick={Function}
                        >
                            Browse
                        </Button>
                    </Grid>

                    <Grid item xs >
                        <Button
                            variant="contained"
                            onClick={Function}
                            style={{
                            }}
                        >
                            Confirm File Upload
                        </Button>
                    </Grid>



                </Grid>



            </Box>
        </Modal>*/
    );
}
export default ImportModal;