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
            fetch("http://localhost:9000/" + 'map/createMap', {
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
                        throw new Error('map not created');
                    }
                    return res.json();
                }).then((data) => {
                    console.log(data);
                    navigate('/map/' + data.mapId, { state: { mapId: data.mapId } });
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
                aria-labelledby="newmap-modal-title"
                aria-describedby="newmap-modal-description"
            >
                <Box 
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"

                    sx={style}>
                <header className="dialog-header">
                    <Box style={{marginBottom:"10%"}}>
                    <Typography id="newmap-modal-title" variant="h6" component="h2" >
                        <strong>Enter new Map name</strong>
                    </Typography>
                    </Box>
                </header>
                    <TextField placeholder="Map name" onChange={changeMapName} />
                    <Box>
                    <div class="modal-footer" id="confirm-cancel-container">
                        <input type="button" 
                                    id="createmap-confirm-button" 
                                    class="modal-confirm-button" 
                                    onClick={() => {
                                        createNewMap();}}
                                    value='Confirm' />
                        <input type="button" 
                                class="modal-cancel-button" 
                                onClick={() => {
                                    handleCloseModal();}}
                                    value='Cancel' />
                    </div>
                </Box>
            </Box>
            </Modal>
    );
}
export default CreateNewMapModal;