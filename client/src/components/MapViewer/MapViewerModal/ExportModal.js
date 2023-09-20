import { useContext,useState } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import GlobalStoreContext, {CurrentModal} from "../../../store";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
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

function ExportModal(props) {
    const { store } = useContext(GlobalStoreContext);

    function handleCloseModal(event) {
        store.changeModal("NONE");
    }

    return (
        <Modal open={store.currentModal === CurrentModal.MAP_EXPORT}
               onClick={handleCloseModal}
        >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    onClick={e => e.stopPropagation()}

                    sx={style}>
                    <IconButton type="submit" onClick={handleCloseModal} style={{ position: 'absolute', right: '0', top: '0' }} >
                        <CloseIcon style={{ fontSize: '2rem', fill: 'black' }} />
                    </IconButton>
                    <header className="dialog-header">
                        <Box style={{ marginBottom: "10%" }}>
                            <Typography variant="h6" component="h2" style={{ fontSize: "2.5rem" }}>
                                <strong>Export Map</strong>
                            </Typography>

                        </Box>
                    </header>
                    <input type="button"
                        class="modal-confirm-button"
                        onClick={props.handleExportGeoJson}
                        value='GeoJSON' />
                    <input type="button"
                        class="modal-confirm-button"
                        onClick={props.handleExportShpDbf}
                        value='Shapefile/DBF zip' />
                    <input type="button"
                        class="modal-confirm-button"
                        onClick={props.handleExportPNG}
                        value='PNG' />
                </Box>
            </Modal>
    );
}
export default ExportModal;