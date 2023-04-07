import { useContext,useState } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import GlobalStoreContext, {CurrentModal} from "../../../store";
import Grid from "@mui/material/Grid";
import MapEditor from "../MapEditor";
import MapPropertySidebar from "../MapPropertySidebar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';
import { HexColorPicker } from "react-colorful";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: '#f1f1f1',
    border: '.16vw solid #000',
    boxShadow: 24,
    p: 2,
};

function MapColorwheelModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleDeleteUser(event) {
        store.changeModal("NONE");
    }
    function handleCloseModal(event) {
        store.changeModal("NONE");
    }

    const [color, setColor] = useState("#aabbcc");


    return (
        <Modal open={store.currentModal === CurrentModal.MAP_PICK_COLOR_WHEEL}
               onClick={handleCloseModal}
        >
            <Box sx={style}
                 onClick={e => e.stopPropagation()}
            >
                <Grid item xs >
                    <IconButton sx={{
                        float: 'right'
                    }}
                                onClick={handleCloseModal}>
                        < CloseIcon/>
                    </IconButton>
                </Grid>
                <header className="dialog-header">
                    <Box style={{backgroundColor:"#f1f1f1", color:"green",paddingTop:"1vh",paddingBottom:"1vh",paddingLeft:"20%"}}>
                        <Typography style={{fontSize:"1.4rem"}}>
                            <strong>Choose a new Color</strong>
                        </Typography>
                    </Box>
                </header>

                <Grid container spacing={2}>


                    <Grid item xs >
                        <HexColorPicker color={color} onChange={setColor} />;

                        <Button
                            variant="contained"
                            onClick={Function}
                        >
                            Confirm
                        </Button>
                    </Grid>



                </Grid>



            </Box>
        </Modal>
    );
}
export default MapColorwheelModal;