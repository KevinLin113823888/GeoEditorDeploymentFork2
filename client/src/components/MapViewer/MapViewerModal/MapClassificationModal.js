import { useContext,useState } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import GlobalStoreContext, {CurrentModal} from "../../../store";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
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

function MapClassificationModal(props) {
    const { store } = useContext(GlobalStoreContext);
    const [classif, saveClassif] = useState('')
    function handleClassification(e) {
        store.changeModal("NONE");
        fetch(process.env.REACT_APP_API_URL + 'map/mapClassificationById', {
            method: "post",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: props.id, 
                classifications: classif,
            })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("new name", data);
        })
        .catch(err => console.log(err));
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
                            <strong>Please provide a comma separated sentence for a list of classifications of your map to help users find it!
                                    (ex: [North America, US] will give the tags US and North America)</strong>
                        </Typography>

                    </Box>
                <Box sx={{ width: "100%", height: "100%", }}>
                    <TextField type='text' placeholder="Enter your classifications" onChange={(e) => {saveClassif(e.target.value)}}sx={{ width: '100%', height: '100%' }}
                        multiline
                        rows={7}
                        maxRows={Infinity}
                        display="inline" />
                </Box>

                <input type="button"
                    class="modal-confirm-button"
                    onClick={(e) => {
                        handleClassification(e);
                    }}
                    value='Submit' />

            </Box>
        </Modal>

    );
}
export default MapClassificationModal;