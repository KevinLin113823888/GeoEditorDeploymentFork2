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
import Toastify from 'toastify-js'

const style = {
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

function CreateNewMapModal() {
    const navigate = useNavigate();

    const { store } = useContext(GlobalStoreContext);

    const [newMapName, setNewMapName] = useState("");

    function changeMapName(event) {
        setNewMapName(event.target.value);
    }

    function createNewMap() {
        console.log(newMapName)
        if (newMapName !== "") {
            fetch(process.env.REACT_APP_API_URL + 'map/createMap', {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: newMapName
                }),
            })
            .then((res) => {
                if (res.status === 200) {
                    console.log("new map created");
                }
                else {
                    Toastify({
                        text: "You already have a map with this name",
                        gravity: "bottom",
                        position: 'left',
                        duration: 2000,
                        style: {
                          background: '#0f3443'
                        }
                      }).showToast();
                    throw new Error('map not created');
                }
                return res.json();
            }).then((data) => {
                console.log("data in response", data);
                navigate('/map/' + data.mapCardId, { state: { mapId: data.mapCardId, title:newMapName } });
            })
            .catch(err => console.log(err));
        }
    }

    function handleCloseModal(event) {
        store.changeModal("NONE");
    }

    return (
        <Modal
                open={store.currentModal == "CREATE_NEW_MAP"}
                onClose={handleCloseModal}
            >
                <Box sx={style}
                 onClick={e => e.stopPropagation()}>
    
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center" style={{color:"#000000"}}>    
                    
                <Typography style={{fontSize:"2rem"}} sx={{marginBottom:"5%"}}>
                        <strong>Enter new Map name</strong>
                </Typography>
                    <TextField type="text" id="outlined-basic"  variant="outlined" onChange={ 
                        changeMapName} height="2.2vw" placeholder="Enter Name" style={{background:"#ffffff",width:"50%"}} 
                        inputProps={{
                            style: {
                            fontSize:"1rem",
                            height: "0vw"
                    },
                    maxLength:18}} />
            <Box>
                <input type="button" 
                            class="modal-confirm-button" 
                            onClick={() => {
                                createNewMap();}}
                            value='Confirm' />
                <input type="button" 
                        class="modal-cancel-button" 
                        onClick={() => {
                            handleCloseModal();}}
                        value='Cancel' />
            </Box>
        </Box>
    </Box>
    </Modal>
    );
}
export default CreateNewMapModal;

