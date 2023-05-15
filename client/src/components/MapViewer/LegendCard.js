import React, { useContext, useState,useEffect } from 'react'
import { GlobalStoreContext } from '../../store'
import Box from '@mui/material/Box';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Typography } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import SquareIcon from '@mui/icons-material/Square';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditLegendTPS from '../../transactions/EditLegendTPS'
import './mapEditor.css';

function LegendCard(props) {
    const { store, setStore} = useContext(GlobalStoreContext);

    const { index, legendObj } = props;
    const {color, legendText} = props.legendObj

    const [text,setText] = useState(legendText)
    function handleUserNameClick() {

        //store.showPublishedListsFilteredUsers(commentObj.user);
    }

    useEffect(()=>{
        setText(props.legendObj.legendText)
    },[props.legendObj.legendText])
    const handleChangeColor= (color)=>{
        let mappedData = {
            store: store,
            setStore: setStore,
            type: "color",
            oldColor: color,
            newColor: color,
            oldIndex: index,
        }
        store.jstps.addTransaction(new EditLegendTPS(mappedData))
        // props.updateViewer();
    }
    function handleChangeLegendColor() {

        store.colorwheelHandler = handleChangeColor
        store.changeModal("MAP_PICK_COLOR_WHEEL")
    }

    let colorString= legendObj.color;

    const handleChange = (event) => {
        setText(event.target.value)
    }

    const handleBlur = () => {
        //jstps transaction right here ig lol
        if(legendText === text)
            return //no transaction if on blur is the same text
        let mappedData = {
            store: store,
            setStore: setStore,
            type: "edit",
            oldText: legendText,
            newText: text,
            oldIndex: index,
        }
        store.jstps.addTransaction(new EditLegendTPS(mappedData))
        // props.updateViewer();
    }
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.target.blur()
        }
    }
      

    const handleDelete = () => {
        //jstps
        let mappedData = {
            store: store,
            setStore: setStore,
            type: "delete",
            oldText: text,
            oldColor: color,
            oldIndex: index,
        }
        store.jstps.addTransaction(new EditLegendTPS(mappedData))
        // props.updateViewer();
    }

    return (
        <Box style={{ height: "10vh" }} >

            <InputGroup className="mb-3">
                <input type="text" className="form-control" id="validationCustom01" value={text}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       required 
                       style={{borderRadius:"7px 7px 7px 7px",fontFamily:'Helvetica'}}
                       onKeyPress={handleKeyPress}
                       />
                {/*<BorderColorIcon className="material-icons" sx={{"&:hover": {fill: "rgba(255,240,10,0.8)"}} } style={{fontSize:"1.6rem"}}/>*/}
                <SquareIcon className="material-icons" onClick={handleChangeLegendColor} sx={{color:colorString,
                    marginTop: "2.5%",
                }}/>

                <DeleteIcon className="material-icons" sx={{
                    marginTop: "2.5%",
                    "&:hover": {fill: "rgba(255,240,10,0.8)"}}}
                    onClick = {handleDelete}
                />



            </InputGroup>


        </Box>
    );
}

export default LegendCard;