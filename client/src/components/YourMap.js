import {React, useState, useEffect} from "react";
import { Link, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
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
  

function YourMap(){
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [mapCards, setMapCards] = useState([])
    const [mapNameModelOpen, setMapNameModelOpen] = useState(false)

    const [newMapName, setNewMapName] = useState("");

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + 'user/loggedIn', {
            method: "GET",
            credentials: 'include',
            headers: {
            "Content-Type": "application/json",
            }
        })
        .then((res) => res.json())
        .then((data) => {
            setUsername(data.username);
            if (data.ownedMapCards === undefined) {
                setMapCards([]);
            }
        })
        .catch(err => console.log(err));
    }, []);


    function changeMapName(event){
        setNewMapName(event.target.value);
    }

    function createNewMap(){
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
                else{
                    throw new Error('map not created');
                }
                return res.json();
            }).then((data) => {
                console.log(data);
                navigate('/editor', { state: { mapId: data.mapId } });
            })
            .catch(err => console.log(err));
        }
    }

    const openCreateModal = () => setMapNameModelOpen(true);
    const closeCreateModal = () => setMapNameModelOpen(false);

    return(
        <div className="YourMap">
            <h1>{username} Maps</h1>
            <button data-cy="createmap-button" onClick={openCreateModal}>Create New Map</button>
            {mapCards 
            ?
            <div>You currently have no maps</div>
            :
            <div>Here are your maps</div>
            }

            <Modal
                open={mapNameModelOpen}
                onClose={closeCreateModal}
                aria-labelledby="newmap-modal-title"
                aria-describedby="newmap-modal-description"
            >
                <Box sx={style}>
                    <Typography id="newmap-modal-title" variant="h6" component="h2">
                        Enter new Map name
                    </Typography>
                    <Input placeholder="Map name" onChange={changeMapName} />
                    <Button variant="contained" onClick={createNewMap} >Create Map</Button>
                </Box>
            </Modal>

        </div>
    )
}

export default YourMap;