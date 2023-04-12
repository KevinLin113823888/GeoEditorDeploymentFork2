import Button from '@mui/material/Button';
import MapEditor from './MapEditor';
import * as shapefile from "shapefile";
import na from './na.json'
import React, {useContext, useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MapPropertySidebar from "./MapPropertySidebar";
import {CurrentModal, GlobalStoreContext, GlobalStoreContextProvider} from "../../store";
import ExportModal from "./MapViewerModal/ExportModal";
import MapClassificationModal from "./MapViewerModal/MapClassificationModal";
import MapColorwheelModal from "./MapViewerModal/MapColorwheelModal";
import MapMergeChangeRegionNameModal from "./MapViewerModal/MapMergeChangeRegionNameModal";
import {FormControl, InputAdornment} from "@mui/material";
import {Input} from "@mui/icons-material";
import ImportModal from "./MapViewerModal/ImportModal";
import MapLegendFooter from "./MapLegendFooter";
import {useParams} from 'react-router-dom';
import Box from "@mui/material/Box";

function MapViewerScreen(){

    const [fileExist, setFileExist] = useState(false);
    const [GeoJson, setGeoJson] = useState({});
    const [state, setState] = useState(true);
    const [data, setData] = useState([]);
    const [mapName,setMapChange] = useState("Untitled");

    const { store } = useContext(GlobalStoreContext);
    const { id } = useParams();

    const names = [];
    let count = 0;
    let shpfile = null;
    let dbffile = null;


    const handleSubmit = () => {
        setGeoJson({});
        console.log("shapefile.open")
        // console.log(shpfile)
        // console.log(dbffile)

        let geoJson = {
            type:"FeatureCollection",
            features: []
        }
        shapefile
            .open(
                shpfile,
                dbffile
            ).then(function (e){
            e.read().then(
                function next(result){
                    if(result.value) {
                        // console.log(result.value);
                        geoJson.features.push(result.value)
                    }
                    if(!result.done){
                        e.read().then(next)
                    }
                    else{
                        setGeoJson(geoJson)
                        setFileExist(true);
                    }
                })
        })
    }

    const changeRegionName = (oldName, newName) =>{
        // console.log("newold", oldName, newName);
        let temp = GeoJson;
        temp.features.forEach((i) => {
            if (i.properties.name === oldName) {
                i.properties.name = newName;
                setGeoJson(temp);
            }
        })
        // console.log("features", GeoJson.features);
        setState(!state);
    }

    const upload = () => {
        // console.log("upload the stuff")
        // console.log(na)
        setGeoJson(na);
        setFileExist(true);
    }

    const Buttons = (Function,Text) => {
        const wrappedButton =

            <Grid item xs >
                <Button
                    style={{
                        width: "100%",
                        backgroundColor: "#3c7dc3",

                    }}
                    variant="contained"
                    onClick={Function}
                >
                    {Text}
                </Button>
            </Grid>

        return wrappedButton
    }

    const handleShpDbfFile = (e,type) => {
        {
            console.log("reading: "+ type);
            const reader = new FileReader();
            reader.readAsArrayBuffer(e.target.files[0]);
            reader.onload = async e => {
                if(type==="dbf")
                    dbffile = reader.result
                if(type==="shp")
                    shpfile = reader.result
                if(dbffile && shpfile){
                    console.log("done")
                    store.changeModal("NONE");
                    handleSubmit()
                }
            }
        }
    }

    const handleGeoJson = (e) => {
        const reader = new FileReader();
        setGeoJson({});
        reader.readAsText(e.target.files[0]);
        reader.onload = e => {
            setGeoJson(JSON.parse(e.target.result));
        }
        setFileExist(true);
        store.changeModal("NONE");
    }

    const handleCompress = () => {}
    const handleImport = () => {store.changeModal(CurrentModal.MAP_IMPORT)}
    const handleExport = () => {store.changeModal(CurrentModal.MAP_EXPORT)}
    const handleSave = () =>   {}
    const handlePublish = () => {
        fetch(process.env.REACT_APP_API_URL + 'map/publishMapById', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id
            }),
        })
        .then((res) => res.json())
        .then((data) => {
           console.log(data)
        })
        .catch(err => console.log(err));

    }
    const handleMapClassification = () => {store.changeModal(CurrentModal.MAP_CLASSIFICATION)}




    return (
        <div className="App">

            <ImportModal
                handleGeoJson={handleGeoJson}
                handleShpDbfFile={handleShpDbfFile}
                handleSubmit={handleSubmit}
                />
            <ExportModal/>
            <MapClassificationModal/>
            <MapColorwheelModal/>
            <MapMergeChangeRegionNameModal/>

            {/* <div>
               Shapefile:
               <input type="file" accept="geo.json" onChange={handleSelectFile}/>
            </div>
            <div>
               Dbf:
               <input type="file" accept="geo.json" onChange={handleSelectFile2}/>
            </div>
            <div> <input type="submit" value="submit" onClick={handleSubmit} /></div> */}

            <Grid container spacing={2}>
                <Grid item xs={6}
                >

                    <Box
                        sx={{
                            paddingLeft: "2%",
                            paddingTop: "1%",
                            maxWidth: '100%'}}>
                        <TextField
                            sx={{
                                fontSize: 100
                            }}
                            defaultValue={mapName}
                            hiddenLabel
                            variant="standard"


                            InputProps={{
                                style: {fontSize: 40,
                                    font: "Satisfy",
                                    fontWeight: "bold",
                                fontFamily: "Satisfy"
                                },
                                disableUnderline: true
                            }}
                            onChange={
                                (event)=>{
                                    console.log("searching...", event.target.value);
                                    setMapChange(event.target.value)}}
                            fullWidth  />
                    </Box>

                </Grid>

                <Box item xs={6} sx={{
                    paddingTop: "2%"
                }}>
                <Grid container spacing={2} >
                        {Buttons(handleCompress, "Compress")}
                        {Buttons(handleImport, "Import")}
                        {Buttons(handleExport, "Export")}
                        {Buttons(handlePublish, "Publish")}
                        {Buttons(handleMapClassification, "Classification")}
                        {Buttons(handleSave, "Save")}
                    </Grid>
                </Box>

                <Grid container spacing={2} item xs={9.5}>

                    <Grid item xs={12}>
                        <Box
                            sx={{
                                paddingLeft: "1.5%"
                            }}>
                            <MapEditor file={GeoJson} changeName={changeRegionName} />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <MapLegendFooter file={GeoJson}/>
                    </Grid>


                </Grid>
                <Grid item xs={2.5}>
                    <MapPropertySidebar file={GeoJson}/>
                </Grid>

                <Grid item xs={8}>
                </Grid>
            </Grid>


            <Grid container spacing={2}>

            </Grid>



        </div>
    );
}

export default MapViewerScreen;