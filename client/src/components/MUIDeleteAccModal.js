import { useContext,useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: '#f1f1f1',
    border: '.16vw solid #000',
    boxShadow: 24,
    p: 2,
};

function MUIDeleteAccModal() {
    const { store } = useContext(GlobalStoreContext);
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleDeleteUser(event) {
        store.changeModal("NONE");
        fetch(process.env.REACT_APP_API_URL + 'user/deleteUser', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: password
            }),
        })
        .then((res) => res.json())
        .then((data) => {
           console.log(data)
           store.setHome()
           navigate("/");
        })
        .catch(err => console.log(err));

        
    }
    function handleCloseModal(event) {
        store.changeModal("NONE");
    }
    function handleSetPassword(event) {

        setPassword(event.target.value);
    }
   
    return (
        <Modal
            open={store.currentModal == "DELETE_ACCOUNT"}
            onClick={handleCloseModal}

        >
            <Box sx={style}
                 onClick={e => e.stopPropagation()}

            >

    
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">

        <Box style={{backgroundColor:"#f1f1f1", color:"#ff0000",paddingTop:"1vh",paddingBottom:"1vh"}}>
    <Typography style={{fontSize:"1.4rem"}}>
            <strong>Delete Account?</strong>
    </Typography>
        </Box>
    <Typography style={{fontSize:"1rem"}}>
    <strong> Are you sure you want to delete the your account? This action can not be reversed. Enter your password to confirm.</strong>
    </Typography>
   
   
    <TextField type="text" id="outlined-basic"  variant="outlined" onChange={ 
                    handleSetPassword} height="2.2vw" placeholder="Enter Password" style={{marginTop:"10%",background:"#ffffff",width:"90%"}} 
                    inputProps={{
                        style: {
                          fontSize:"1rem",
                          height: "0vw"
                        }}} />
                        
    <Box>
    <input type="button" 
                 id="delete-account-confirm-button" 
                 class="modal-confirm-button" 
                 onClick={() => {
                     handleDeleteUser();}}
                 value='Confirm' />
     <input type="button" 
              class="modal-cancel-button" 
              style= {{"background-color": "lightgrey"}}
              onClick={() => {
                 handleCloseModal();}}
                 value='Cancel' />
    </Box>
    </Box>
    
                
            </Box>
        </Modal>
    );
}
export default MUIDeleteAccModal;