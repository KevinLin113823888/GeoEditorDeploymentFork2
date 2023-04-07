import { useContext,useState } from 'react'
import {CurrentModal, GlobalStoreContext} from "../store";
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import Grid from '@mui/material/Grid';

import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import DownloadIcon from '@mui/icons-material/Download';
import AltRouteIcon from '@mui/icons-material/AltRoute';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    height: '75%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function MUICommunityPreviewModal() {
    const navigate = useNavigate();

    const { store } = useContext(GlobalStoreContext);

    function handleCloseModal(event) {
        store.changeModal("NONE");
    }

    function handleFork(){

    }

    function handleDownload(){

    }

    function handleFlag(){

    }

    function handleLike(){

    }

    function handleDislike(){

    }

    return (
        <Modal
            open={store.currentModal == "COMMUNITY_PREVIEW_MODAL"}
            open={true}
            onClose={handleCloseModal}
        >
        <Box 
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"

            sx={style}>
            <Grid container >
                        <Grid item xs={4} >
                            <Box sx={{ width: "100%", backgroundColor: "#ededed", height: "30vh", marginLeft: "10%"}}>
                                
                                </Box>
                        </Grid>

            <Grid item xs={4} >
                <Box style={{marginBottom:"10%"}}>
                    <Typography id="map-title" variant="h6" component="h2" style={{fontSize:"1rem"}}>
                        <strong>Africa</strong>
                    </Typography>
                </Box>
                <div>im a modal</div>
                <Grid >

                    <IconButton type="submit" onClick={handleFork} >
                        <AltRouteIcon style={{ fill: "black" }} />
                    </IconButton>
                    
                    <IconButton type="submit" onClick={handleDownload} >
                        <DownloadIcon style={{ fill: "black" }} />
                    </IconButton>
                    
                    <IconButton type="submit" onClick={handleFlag} >
                        <EmojiFlagsIcon style={{ fill: "red" }} />
                    </IconButton>


            </Grid>
                </Grid>

            </Grid>
            </Box>

        </Modal>
    );
}
export default MUICommunityPreviewModal;