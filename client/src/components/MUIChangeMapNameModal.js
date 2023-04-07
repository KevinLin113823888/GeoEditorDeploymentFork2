import { useContext,useState } from 'react'
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
    width: 400,
    bgcolor: '#f1f1f1',
    border: '.16vw solid #000',
    boxShadow: 24,
    p: 2,
};

function MUIChangeMapNameModal() {
    const { store } = useContext(GlobalStoreContext);
    const [search, setSearch] = useState("");

    function handleChangeMapName(event) {
        store.changeModal("NONE");
        
        //Deletes the map from the database
        //store.deleteMap();
        
    }
    function handleCloseModal(event) {
        store.changeModal("NONE");
    }
    function handleUpdateSearch(event) {

        setSearch(event.target.value);
    }
   
    return (
        <Modal
            open={store.currentModal == "NEW_MAP_NAME"}
            onClick={handleCloseModal}
        >
            <Box sx={style}
                 onClick={e => e.stopPropagation()}

            >
    
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center" style={{backgroundColor:"#f1f1f1", color:"#000000"}}>    
        
    <Typography style={{fontSize:"2rem"}} sx={{marginBottom:"5%"}}>
            <strong>Change Map Name</strong>
    </Typography>
    <TextField type="text" id="outlined-basic"  variant="outlined" onChange={ 
                    handleUpdateSearch} height="2.2vw" placeholder="Enter Name" style={{background:"#ffffff",width:"50%"}} 
                    inputProps={{
                        style: {
                          fontSize:"1rem",
                          height: "0vw"
                        }}} />
        <Box>
    <input type="button" 
                 class="modal-confirm-button" 
                 onClick={() => {
                     handleChangeMapName();}}
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
export default MUIChangeMapNameModal;