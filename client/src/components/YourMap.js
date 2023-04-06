import {React, useState, useEffect} from "react";
import { Link, useNavigate } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

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

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    borderStyle: 'solid',
    marginLeft: 0,
    width: '50%',
    // [theme.breakpoints.up('sm')]: {
    //   marginLeft: theme.spacing(1),
    //   width: '40%',
    // },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
}));

function YourMap(){
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [mapCards, setMapCards] = useState([])
    const [mapNameModelOpen, setMapNameModelOpen] = useState(false)
    const [newMapName, setNewMapName] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("http://localhost:9000/" + 'user/loggedIn', {
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

    function handleUpdateSearch(event) {
        console.log("searching...", event.target.value);
        setSearch(event.target.value);
    }

    function handleKeyPress(event) {
        if(search != "") {
            if (event.type === "keypress" && event.code === "Enter") {
                console.log("search for", search);
            }
            if (event.type === "click") {
                console.log("search for", search);
            }
        }
    }

    function handleSort() {
        console.log("sorting that needs to be implemented");
    }

    function createNewMap(){
        console.log(newMapName)
        if (newMapName !== "") {
            fetch("http://159.203.180.161:9000//" + 'map/createMap', {
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
            <div id = "borderchange">  
                {/* <TextField type="text" id="outlined-basic"  variant="outlined" onChange={ 
                handleUpdateSearch} onKeyPress={handleKeyPress} height="2.2vw" placeholder="Search" style={{marginTop:"0.1vw",marginLeft:"5vw",background:"#ffffff",width:"45vw"}} 
                inputProps={{
                    style: {
                        height: "0vw"
                }}} />
                <IconButton type="submit" aria-label="search" onClick={handleKeyPress}>
                    <SearchIcon style={{ fill: "black" }} />
                </IconButton> */}

                <Search>
                    <SearchIconWrapper>
                        <IconButton type="submit" aria-label="search" onClick={handleKeyPress}>
                            <SearchIcon style={{ fill: "black" }} />
                        </IconButton> 
                    </SearchIconWrapper>
                    <StyledInputBase type="text" id="outlined-basic" placeholder="Search…" variant="outlined" onChange={ handleUpdateSearch} onKeyPress={handleKeyPress} height="2.2vw"/>
                </Search>

                <IconButton type="submit" aria-label="sort" onClick={handleSort} >
                    <SortIcon style={{ fill: "black"}} />
                </IconButton>
            </div>
            <h1>{username} Maps</h1>

            <IconButton data-cy="createmap-button" onClick={openCreateModal}>
                <AddCircleIcon style={{ fill: "black" }} />
            </IconButton>

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