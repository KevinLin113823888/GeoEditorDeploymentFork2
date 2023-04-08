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
    height: '87%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pl: 3,
    pr: 3,
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

    function handleFollow(){

    }

    function handleBlock(){

    }

    return (
        <Modal
            open={store.currentModal == "COMMUNITY_PREVIEW_MODAL"}
            // open={true}
            onClose={handleCloseModal}
        >
        <Box 
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"

            sx={style}>
            <Grid container >
                <Grid item xs={9} >
                    <Box sx={{ width: "100%", backgroundColor: "red", height: "55vh", marginRight:'2.5%',}}>
                            </Box>
                        <Grid container style={{paddingTop:"2%"}}>
                            <Grid item xs={10}>
                            <Box >
                                <Typography id="map-title" variant="h6" component="h2" style={{fontSize:"2rem"}}>
                                    <strong>Africa</strong>
                                </Typography>
                            </Box>
                            <AccountCircleIcon style={{fontSize:'1.7rem' }}  sx={{marginTop:'1%', marginRight:'1%'}} />
                            <Typography id="owner" variant="h8" component="h4" style={{fontSize:"1.7rem", display:'inline'}} sx={{}}  >
                                    Bob Guy1
                            </Typography>
                            <Box sx={{marginTop:'2%'}}>
                                <input type="button" 
                                        class="preview-button" 
                                        onClick={() => {
                                            handleFollow();}}
                                        value='Follow' />
                                <input type="button" 
                                        class="preview-button" 
                                        onClick={() => {
                                            handleBlock();}}
                                        style={{marginLeft:'.5%'}}
                                        value='Block' />
                            </Box>
                            </Grid>
                            <Grid item xs={2} >
                                <Box>
                                    <IconButton type="submit" onClick={handleFork} >
                                        <AltRouteIcon style={{fontSize:'2rem', fill:'black' }} />
                                    </IconButton>
                                    
                                    <IconButton type="submit" onClick={handleDownload} >
                                        <DownloadIcon style={{ fill: "black", fontSize:'2rem' }} />
                                    </IconButton>
                                    
                                    <IconButton type="submit" onClick={handleFlag} >
                                        <EmojiFlagsIcon style={{ fill: "red", fontSize:'1.7rem' }} />
                                    </IconButton>
                                </Box>

                                <Box>
                                    <IconButton type="submit" onClick={handleLike} >
                                        <ThumbUpIcon style={{fontSize:'2rem', fill:'black' }} />
                                    </IconButton>
                                    <IconButton type="submit" onClick={handleDislike} >
                                        <ThumbDownIcon style={{fontSize:'2rem', fill:'black' }} />
                                    </IconButton>
                                </Box>

                            </Grid>
                        </Grid>
                        </Grid>
                        <Grid item xs={3} >
                            <Box sx={{ width: "100%", backgroundColor: "#f7fafc", height: "100%", marginLeft: "2.55%",}}>
                                <TextField type='text' placeholder="Add a comment..." sx={{width:'100%'}} />
                            </Box>
                        </Grid>
            

            </Grid>
            </Box>

        </Modal>
    );
}
export default MUICommunityPreviewModal;