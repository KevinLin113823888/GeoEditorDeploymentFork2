import { useContext, useState } from 'react'
import { CurrentModal, GlobalStoreContext } from "../store";
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import Grid from '@mui/material/Grid';

import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import DownloadIcon from '@mui/icons-material/Download';
import AltRouteIcon from '@mui/icons-material/AltRoute';

import CommentCard from './CommentCard.js'
import MapEditor from "./MapViewer/MapEditor";
import GeomanJsWrapper from "./MapViewer/GeomanJsWrapper";
import {FeatureGroup, GeoJSON, LayerGroup, MapContainer, TileLayer} from "react-leaflet";

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

const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function MUICommunityPreviewModal() {
    const navigate = useNavigate();
    const [forkModal, setForkModal] = useState(false);
    const [downloadModal, setDownloadModal] = useState(false);
    const [reportModal, setReportModal] = useState(false);


    const { store } = useContext(GlobalStoreContext);

    function handleCloseModal(event) {
        store.changeModal("NONE");
    }

    function handleFork() {

    }

    function handleDownload() {

    }

    function handleReport() {

    }

    function handleLike() {

    }

    function handleDislike() {

    }

    function handleFollow() {

    }

    function handleBlock() {

    }

    function closeForkModal() {
        setForkModal(false)
    }

    function openForkModal() {
        setForkModal(true)
    }

    function closeDownloadModal() {
        setDownloadModal(false)
    }

    function openDownloadModal() {
        setDownloadModal(true)
    }
    function closeReportModal() {
        setReportModal(false)
    }

    function openReportModal() {
        setReportModal(true)
    }

    let commentList=[{comment:"Wow, this is a great map. It is really such a fascinating map. I constantly dream about this map every night.",username:"Joe Dude1"},
    {comment:"Wow, this is a great map. It is really such a fascinating map. I constantly dream about this map every night.",username:"Joe Dude2"},
    {comment:"Wow, this is a great map. It is really such a fascinating map. I constantly dream about this map every night.",username:"Joe Dude3"},
    {comment:"Wow, this is a great map. It is really such a fascinating map. I constantly dream about this map every night.",username:"Joe Dude4"},
    {comment:"Wow, this is a great map. It is really such a fascinating map. I constantly dream about this map every night.",username:"Joe Dude5"},
    {comment:"Wow, this is a great map. It is really such a fascinating map. I constantly dream about this map every night.",username:"Joe Dude6"},
    {comment:"Wow, this is a great map. It is really such a fascinating map. I constantly dream about this map every night.",username:"Joe Dude7"},
    {comment:"Wow, this is a great map. It is really such a fascinating map. I constantly dream about this map every night.",username:"Joe Dude8"},
    ]
    return (

        <div>
            <Modal
                open={store.currentModal === "COMMUNITY_PREVIEW_MODAL"}
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
                            {/*<Box sx={{ width: "100%", backgroundColor: "red", marginRight: '2.5%', }}>*/}
                                <MapContainer
                                    style={{
                                        height: "50vh",
                                    }} zoom={2} center={[20, 100]}
                                    editable={false}
                                >
                                    <FeatureGroup>
                                        {/*{(props.file!== undefined)?*/}
                                        {/*    <GeoJSON*/}
                                        {/*        key={update}*/}
                                        {/*        data={props.file.features}*/}
                                        {/*    />*/}
                                        {/*    : <></>*/}
                                        {/*}*/}
                                    </FeatureGroup>
                                    <TileLayer url="xxx" />
                                    <LayerGroup>
                                        <TileLayer
                                            attribution='&amp;copy <update href="http://osm.org/copyright">OpenStreetMap</update> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <TileLayer url="http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png" />
                                    </LayerGroup>
                                </MapContainer>

                            {/*</Box>*/}
                            <Grid container style={{ paddingTop: "2%" }}>
                                <Grid item xs={10}>
                                    <Box >
                                        <Typography id="map-title" variant="h6" component="h2" style={{ fontSize: "2rem" }}>
                                            <strong>Africa</strong>
                                        </Typography>
                                    </Box>
                                    <AccountCircleIcon className="material-icons-community" style={{ fontSize: '1.7rem' }} sx={{ marginTop: '1%', marginRight: '1%' }} />
                                    <Typography id="owner" variant="h8" component="h4" style={{ fontSize: "1.7rem", display: 'inline' }} sx={{}}  >
                                        Bob Guy1
                                    </Typography>
                                    <Box sx={{ marginTop: '2%' }}>
                                        <input type="button"
                                            class="preview-button"
                                            onClick={() => {
                                                handleFollow();
                                            }}
                                            value='Follow' />
                                        <input type="button"
                                            class="preview-button"
                                            onClick={() => {
                                                handleBlock();
                                            }}
                                            style={{ marginLeft: '.5%' }}
                                            value='Block' />
                                    </Box>
                                </Grid>
                                <Grid item xs={2} >
                                    <Box>
                                        <IconButton type="submit" onClick={openForkModal} >
                                            <AltRouteIcon style={{ fontSize: '2rem', fill: 'black' }} />
                                        </IconButton>

                                        <IconButton type="submit" onClick={openDownloadModal} >
                                            <DownloadIcon style={{ fill: "black", fontSize: '2rem' }} />
                                        </IconButton>

                                        <IconButton type="submit" onClick={openReportModal} >
                                            <EmojiFlagsIcon style={{ fill: "red", fontSize: '1.7rem' }} />
                                        </IconButton>
                                    </Box>

                                    <Box>
                                        <IconButton type="submit" onClick={handleLike} >
                                            <ThumbUpIcon style={{ fontSize: '2rem', fill: 'black' }} />
                                        </IconButton>
                                        <IconButton type="submit" onClick={handleDislike} >
                                            <ThumbDownIcon style={{ fontSize: '2rem', fill: 'black' }} />
                                        </IconButton>
                                    </Box>

                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3} >
                            <TextField type='text' placeholder="Add a comment..." sx={{ width: '100%',marginLeft: "2.55%" }} />
                            <Box sx={{ width: "100%", backgroundColor: "#f7fafc", maxHeight: "33vw", marginLeft: "2.55%",overflowY: "scroll" }}>
                              
                                {commentList.map((commentObj, index) => (
                                    <CommentCard
                                        key={'map-comment-' + (index)}
                                        index={index}
                                        commentObj={commentObj}
                                    />
                                ))}
                            </Box>
                            
                        </Grid>


                    </Grid>
                </Box>

            </Modal>

            <Modal
                open={forkModal}
                onClose={closeForkModal}>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"

                    sx={style2}>
                    <header className="dialog-header">
                        <Box style={{ marginBottom: "10%" }}>
                            <Typography variant="h6" component="h2" style={{ fontSize: "2rem" }}>
                                <strong>Fork map to your maps?</strong>
                            </Typography>
                        </Box>
                    </header>
                    <Box>
                        <div class="modal-footer" id="confirm-cancel-container">
                            <input type="button"
                                class="modal-confirm-button"
                                onClick={() => {
                                    handleFork();
                                }}
                                value='Confirm' />
                            <input type="button"
                                class="modal-cancel-button"
                                onClick={() => {
                                    closeForkModal();
                                }}
                                value='Cancel' />
                        </div>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={downloadModal}
                onClose={closeDownloadModal}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"

                    sx={style2}>
                    <IconButton type="submit" onClick={closeDownloadModal} style={{ position: 'absolute', right: '0', top: '0' }} >
                        <CloseIcon style={{ fontSize: '2rem', fill: 'black' }} />
                    </IconButton>
                    <header className="dialog-header">
                        <Box style={{ marginBottom: "10%" }}>
                            <Typography variant="h6" component="h2" style={{ fontSize: "2.5rem" }}>
                                <strong>Download</strong>
                            </Typography>

                        </Box>
                    </header>
                    <input type="button"
                        class="modal-confirm-button"
                        // onClick={() => {
                        //     handleFork();}}
                        value='GeoJSON' />
                    <input type="button"
                        class="modal-confirm-button"
                        // onClick={() => {
                        //     handleFork();}}
                        value='Shapefile/DBF zip' />
                    <input type="button"
                        class="modal-confirm-button"
                        // onClick={() => {
                        //     handleFork();}}
                        value='Jpeg' />
                </Box>
            </Modal>

            <Modal
                open={reportModal}
                onClose={closeReportModal}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"

                    sx={style2}>
                    <IconButton type="submit" onClick={closeReportModal} style={{ position: 'absolute', right: '0', top: '0' }} >
                        <CloseIcon style={{ fontSize: '2rem', fill: 'black' }} />
                    </IconButton>
                    <header className="dialog-header">
                        <Box style={{ marginBottom: "10%" }}>
                            <Typography variant="h6" component="h2" style={{ fontSize: "2.5rem" }}>
                                <strong>Report User</strong>
                            </Typography>

                        </Box>
                    </header>
                    <Box sx={{ width: "100%", height: "100%", }}>
                        <TextField type='text' placeholder="Please provide a reason for report..." sx={{ width: '100%', height: '100%' }}
                            multiline
                            rows={5}
                            maxRows={Infinity} />
                    </Box>

                    <input type="button"
                        class="modal-confirm-button"
                        onClick={() => {
                            handleReport();
                        }}
                        value='Submit' />

                </Box>
            </Modal>

        </div>
    );
}
export default MUICommunityPreviewModal;