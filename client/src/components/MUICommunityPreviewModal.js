import { React, useState, useEffect, useContext } from "react";

import { CurrentModal, GlobalStoreContext } from "../store";
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
import CommunityScreenshot from './CommunityScreenshot';
import { useMap } from 'react-leaflet';
import * as L from "leaflet";

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
    const { store } = useContext(GlobalStoreContext);
    const [forkModal, setForkModal] = useState(false);
    const [downloadModal, setDownloadModal] = useState(false);
    const [reportModal, setReportModal] = useState(false);
    const [geoJson, setGeoJson] = useState(null);
    const [title, setTitle] = useState("untitled");
    const [owner, setOwner] = useState("owner");
    const [forkName, setForkName] = useState(title);
    const [reportInfo, setReportInfo] = useState("");
    const [previewId, setPreviewId] = useState("");
    const [following, setFollowing] = useState("Follow");
    const [blocked, setBlocked] = useState("Block");
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState("black");
    const [likeLength, setLikeLength] = useState(0);
    const [dislikes, setDislikes] = useState("black");
    const [dislikeLength, setdisLikeLength] = useState(0);
    const [update, setUpdate] = useState(1);
    const [graphical,setGraphical]= useState({})
    useEffect(() => {
        console.log("OPENED")
        console.log(store.currentPreviewId)
        if(store.currentModal == 'COMMUNITY_PREVIEW_MODAL'){
            setLikes("black");
            setDislikes("black");
            setLikeLength(0);
            setdisLikeLength(0);
            setComments([]);

            fetch(process.env.REACT_APP_API_URL + 'community/getCommunityPreviewById', {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: store.currentPreviewId
                }),
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.id)
                let feat = JSON.parse(data.feature);
                if(feat.length === 0){return;}
                setTitle(data.title);
                setPreviewId(data.id);
                setOwner(data.ownerName);
                setGeoJson({type: data.type, features: feat});
                setComments(data.comments)
                if (data.like) {setLikes("red");}
                if (data.dislike) {setDislikes("red");}
                setLikeLength(data.likeAmount);
                setdisLikeLength(data.dislikeAmount);
                setFollowing(data.follow);
                setBlocked(data.block)
                setGraphical(data.graphicalData)
                
            })
            .catch(err => console.log(err));
        }
    }, [store.currentModal]);




    function handleCloseModal(event) {
        store.changeModal("NONE");
    }

    function handleFork() {
        closeForkModal();
        fetch(process.env.REACT_APP_API_URL + 'community/forkCommunityMap', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: previewId,
                newName: forkName
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
        })
        .catch(err => console.log(err));
    }

    function handleDownloadGeoJson() {
        closeDownloadModal()
        var json = JSON.stringify(geoJson);

        var a = document.createElement("a")
        a.href = URL.createObjectURL(
            new Blob([json], {type:"application/json"})
        )
        a.download = "geoJson.geo.json"
        a.click()
    }

    function handleDownloadPNG(){
        closeDownloadModal()
        store.setCommunityPng(true);
    }

    function handleReport() {
        closeReportModal();
        console.log("report", reportInfo);
        fetch(process.env.REACT_APP_API_URL + 'community/reportCommunityMap', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: previewId,
                reportMessage: reportInfo
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
        })
        .catch(err => console.log(err));
    }

    function handleLike() {
        fetch(process.env.REACT_APP_API_URL + 'community/likeCommunityMap', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: previewId
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("data for liking", data);
            if (data.status === "LIKED") {
                setLikes("red");
                setDislikes("black");
            } else {
                setLikes("black");
            }
            setLikeLength(data.likeLength);
            setdisLikeLength(data.dislikeLength);
        })
        .catch(err => console.log(err));
    }

    function handleDislike() {
        console.log(previewId)
        fetch(process.env.REACT_APP_API_URL + 'community/dislikeCommunityMap', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: previewId
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("data for disliking", JSON.parse(JSON.stringify(data)));
            if (data.status === "DISLIKED") {
                setDislikes("red");
                setLikes("black");
            } else {
                console.log("UNDISLIKED")
                setDislikes("black");
            }
            setLikeLength(data.likeLength);
            setdisLikeLength(data.dislikeLength);
        })
        .catch(err => console.log(err));
    }

    function handleFollow() {
        fetch(process.env.REACT_APP_API_URL + 'community/followCommunityMap', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: previewId
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("status of follow", data.status);
            setFollowing(data.status);
        })
        .catch(err => console.log(err));
    }

    function handleBlock() {
        console.log("previewID", previewId);
        fetch(process.env.REACT_APP_API_URL + 'community/blockCommunityMap', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: previewId
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("status of block", data.status);
            setBlocked(data.status);
        })
        .catch(err => console.log(err));
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

    function handleComment(e) {
        if (e.key === 'Enter') {
            let comment = e.target.value
            if (comment.length > 1) {
                fetch(process.env.REACT_APP_API_URL + 'community/addComment', {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: previewId,
                        comment: comment,
                    }),
                })
                .then((res) => res.json())
                .then((data) => {
                    if(data.status === 'OK'){
                        console.log(data)
                        setComments(a => {
                            return [{
                                comment:comment,
                                username:data.username,
                            },...a]
                        });
                    }
                })
                .catch(err => console.log(err));
            }
            setUpdate(update=>update+1);
        }
    }

    function onEachFeature(feature, layer){
        const featureName = feature.properties.admin;
        // console.log("why");
        // layer.bindPopup(featureName);
        layer.bindTooltip(featureName,
            {permanent: true, direction: 'center'}).openTooltip();
        
        
            if(!feature.subRegionColor){
                feature.subRegionColor = "#3388ff"
            }
            if(!feature.borderColor){
                feature.borderColor="#0328fc"
            }
           layer.setStyle({
            // color: "blue",
            fillColor: feature.subRegionColor,
            fillOpacity: 0.7,
            color: feature.borderColor
        });
    }

    let disable = false;
    let fillColor1="black"
    let fillColor2="red"
    if(store.guestMode==true){
        disable=true;
        fillColor1 = "grey"
        fillColor2 = "grey"
    }
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
                            
                            <CommunityScreenshot data={graphical}/>
                            

                                    <FeatureGroup>
                                        {(geoJson !== null)?
                                            <GeoJSON data={geoJson} onEachFeature={onEachFeature} />
                                         : <></>}
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
                                            <strong>{title}</strong>
                                        </Typography>
                                    </Box>
                                    <AccountCircleIcon className="material-icons-community" style={{ fontSize: '1.7rem' }} sx={{ marginTop: '1%', marginRight: '1%' }} />
                                    <Typography id="owner" variant="h8" component="h4" style={{ fontSize: "1.7rem", display: 'inline' }} sx={{}}  >
                                        {owner}
                                    </Typography>
                                    <Box sx={{ marginTop: '2%' }}>
                                        <input type="button"
                                            className="preview-button"
                                            onClick={() => {
                                                handleFollow();
                                            }}
                                            disabled= {disable}
                                            value={following}
                                        />
                                        <input type="button"
                                            className="preview-button"
                                            onClick={() => {
                                                handleBlock();
                                            }}
                                            style={{ marginLeft: '.5%' }}
                                            disabled= {disable}
                                            value={blocked} />
                                    </Box>
                                </Grid>
                                <Grid item xs={2} >
                                    <Box>
                                        <IconButton type="submit" disabled= {disable} onClick={openForkModal} >
                                            <AltRouteIcon style={{ fontSize: '2rem', fill: fillColor1 }} />
                                        </IconButton>

                                        <IconButton type="submit" disabled= {disable} onClick={openDownloadModal} >
                                            <DownloadIcon style={{ fill: fillColor1, fontSize: '2rem' }} />
                                        </IconButton>

                                        <IconButton type="submit" disabled= {disable} onClick={openReportModal} >
                                            <EmojiFlagsIcon style={{ fill: fillColor2, fontSize: '1.7rem' }} />
                                        </IconButton>
                                    </Box>

                                    <Box>
                                        <IconButton type="submit" disabled= {disable} onClick={handleLike} >
                                            <ThumbUpIcon style={{ fontSize: '2rem', fill: likes }} />
                                        </IconButton>
                                        <Typography className="material-icons-community" style={{ color:fillColor1,fontSize: '2rem',fontWeight:"bold"}} sx={{display:"inline"}}>
                                        {likeLength}
                                        </Typography>
                                        <IconButton type="submit" disabled= {disable} onClick={handleDislike} >
                                            <ThumbDownIcon style={{ fontSize: '2rem', fill: dislikes }} />
                                        </IconButton>
                                        <Typography className="material-icons-community" style={{ color:fillColor1,fontSize: '2rem',fontWeight:"bold"}} sx={{display:"inline"}}>
                                        {dislikeLength}
                                        </Typography>
                                    </Box>
                                    {/* <Grid container >
                                    <Box style={{backgroundColor:"white"}} sx={{height:'.5rem',width:"48%",border:".1rem solid black"}} ></Box>
                                    <Box style={{backgroundColor:"black"}} sx={{height:'.5rem',width:"48%",border:".1rem solid black"}} ></Box>
                                   
                                    </Grid> */}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3} >
                            <TextField type='text' placeholder="Add a comment..."
                                       onKeyDown={handleComment}
                                       disabled= {disable}
                                       sx={{ width: '100%',marginLeft: "2.55%" }} />
                            <Box sx={{ width: "100%", backgroundColor: "#f7fafc", maxHeight: "33vw", marginLeft: "2.55%",overflowY: "scroll" }}>
                                {comments.map((commentObj, index) => (
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
                                <strong>Enter new map name to fork to your maps</strong>
                            </Typography>
                        </Box>
                    </header>

                    <TextField type="text" id="outlined-basic"  variant="outlined" 
                    onChange={e => {setForkName(e.target.value)}} height="2.2vw" placeholder="Enter Name" style={{background:"#ffffff",width:"50%"}} 
                    inputProps={{
                        style: {
                          fontSize:"1rem",
                          height: "0vw"
                        }}} />

                    <Box>
                    <input type="button" 
                                className="modal-confirm-button" 
                                onClick={() => {
                                    handleFork();}}
                                value='Confirm' />
                    <input type="button" 
                            className="modal-cancel-button" 
                            onClick={() => {
                                closeForkModal();}}
                            value='Cancel' />
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
                        className="modal-confirm-button"
                        onClick={() => {
                            handleDownloadGeoJson();}}
                        value='GeoJSON' />
                    <input type="button"
                        className="modal-confirm-button"
                        // onClick={() => {
                        //     handleFork();}}
                        value='Shapefile/DBF zip' />
                    <input type="button"
                        className="modal-confirm-button"
                        onClick={() => {
                            handleDownloadPNG();}}
                        value='PNG' />
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
                        <TextField type='text' placeholder="Please provide a reason for report..."  onChange={e => {setReportInfo(e.target.value)}}  sx={{ width: '100%', height: '100%' }}
                            multiline
                            rows={5}
                            maxRows={Infinity} />
                    </Box>

                    <input type="button"
                        className="modal-confirm-button"
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