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
import MapLegendFooter from "../MapLegendFooter";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function MapClassificationModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleClassification() {
        store.changeModal("NONE");
    }
    function handleCloseModal() {
        store.changeModal("NONE");
    }

    return (
        <Modal
            open={store.currentModal == "MAP_CLASSIFICATION"}
            onClick={handleCloseModal}
        >
          
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"

                    sx={style}
                    onClick={e => e.stopPropagation()}>
                    <IconButton type="submit" onClick={handleCloseModal} style={{ position: 'absolute', right: '0', top: '0' }} >
                        <CloseIcon style={{ fontSize: '2rem', fill: 'black' }} />
                    </IconButton>
                    <header className="dialog-header">
                        <Box style={{ marginBottom: "1%" }}>
                            <Typography variant="h6" component="h2" style={{ fontSize: "2.5rem" }}>
                                <strong>Enter Map Classification</strong>
                            </Typography>

                        </Box>
                    </header>
                    <Box style={{ marginBottom: "3%", }}>
                            <Typography variant="h2" component="h2" style={{ fontSize: "1rem" }}>
                                <strong>Enter a short description of your map to help users find it!</strong>
                            </Typography>

                        </Box>
                    <Box sx={{ width: "100%", height: "100%", }}>
                        <TextField type='text' placeholder="Provide a classification for your map..." sx={{ width: '100%', height: '100%' }}
                            multiline
                            rows={7}
                            maxRows={Infinity}
                            display="inline" />
                    </Box>

                    <input type="button"
                        class="modal-confirm-button"
                        onClick={() => {
                            handleClassification();
                        }}
                        value='Submit' />

                </Box>
            </Modal>

    );
}
export default MapClassificationModal;