import {React, useState, useEffect} from "react";
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
  

function Mapeditor(){
    const {state} = useLocation();
    console.log(state)
    
    // useEffect(() => {
    //     fetch('http://199.19.72.130:9000/' + 'map/loggedIn', {
    //         method: "GET",
    //         credentials: 'include',
    //         headers: {
    //         "Content-Type": "application/json",
    //         }
    //     })
    //     .then((res) => res.json())
    //     .then((data) => {
    //         setUsername(data.username);
    //         if (data.ownedMapCards === undefined) {
    //             setMapCards([]);
    //         }
    //     })
    //     .catch(err => console.log(err));
    // }, []);


    
    return(
        <div className="Mapeditor">
            editor yay, id = { state.mapId }
        </div>
    )
}

export default Mapeditor;