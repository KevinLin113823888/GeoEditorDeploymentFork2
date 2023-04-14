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
    const [keyid, setKeyid] = useState(0)
    // const [compressCount, setCompressCount] = useState(6);

    const { store } = useContext(GlobalStoreContext);
    const { id } = useParams();

    const names = [];
    let count = 0;
    let shpfile = null;
    let dbffile = null;



    useEffect(() => {
        naGeo();
    },[])

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
                        setKeyid(keyid => keyid+1)
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
                    // setCompressCount(6);
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
        // setCompressCount(6);
    }

    const naGeo = () => {
        // console.log("upload the stuff")
        // console.log(na)
        setGeoJson(na);
        setFileExist(true);
    }


    function handleCompress(){
        // if(compressCount ==0){
        //     return;
        // }
        // setCompressCount(compressCount-1);
        const tempGeoJson = GeoJson;
        const map = new Map();
        let removePattern = "Even"
        let featureInd2 =-1
        let ind0 = -1
        let ind1 = -1
        let ind2 = -1
        let featuresCopy=tempGeoJson.features

        featuresCopy.forEach(feature => {
            let prevMatchIndex = -1
            let prevMatch = ""
            let prevFeatureInd=-1
            const map2 = new Map();
            featureInd2++
            if (feature.geometry.type === 'Polygon') {
                ind0 = -1
                ind1 = -1
                ind2 = -1
                feature.geometry.coordinates.forEach(coordinates => {
                    ind0++;
                    ind1 = -1;

                    coordinates.forEach((coordinate, subInd) => {
                        ind1++;
                        if (!map.has(coordinate.toString())) {
                            map.set(coordinate.toString(), {position:"middle",featureInd:featureInd2});
                            if(prevMatchIndex==subInd-1){


                                if(map.has(prevMatch)){
                                    let foundfeatureInd=map.get(prevMatch).featureInd;
                                    map.set(prevMatch, {position:"last",featureInd:foundfeatureInd});


                                }
                            }
                        }else{
                            let foundfeatureInd=map.get(coordinate.toString()).featureInd;

                            if(!map2.has(foundfeatureInd.toString())){
                                map.set(coordinate.toString(), {position:"first",featureInd:foundfeatureInd});
                                map2.set(foundfeatureInd.toString(),1);

                            }
                            if(prevFeatureInd !==foundfeatureInd){
                                map.set(prevMatch, {position:"last",featureInd:foundfeatureInd});

                            }

                            prevMatch= coordinate.toString()
                            prevMatchIndex = subInd
                            prevFeatureInd = foundfeatureInd
                        }
                    });

                });
            } else if (feature.geometry.type === 'MultiPolygon') {
                ind0 = -1
                ind1 = -1
                ind2 = -1
                feature.geometry.coordinates.forEach(polygon => {
                    ind0++;
                    ind1 = -1;
                    ind2 = -1;
                    polygon.forEach(coordinates => {
                        ind1++;
                        ind2 = -1;

                        coordinates.forEach((coordinate, subInd) => {
                            ind2++;
                            if (!map.has(coordinate.toString())) {
                                map.set(coordinate.toString(), {position:"middle",featureInd:featureInd2});
                                if(prevMatchIndex==subInd-1){


                                    if(map.has(prevMatch)){
                                        let foundfeatureInd=map.get(prevMatch).featureInd;
                                        map.set(prevMatch, {position:"last",featureInd:foundfeatureInd});
                                    }
                                }
                            }else{
                                let foundfeatureInd=map.get(coordinate.toString()).featureInd;

                                if(!map2.has(foundfeatureInd.toString())){
                                    map.set(coordinate.toString(), {position:"first",featureInd:foundfeatureInd});
                                    map2.set(foundfeatureInd.toString(),1);
                                }
                                if(prevFeatureInd !==foundfeatureInd){
                                    map.set(prevMatch, {position:"last",featureInd:foundfeatureInd});

                                }

                                prevFeatureInd = foundfeatureInd
                                prevMatch= coordinate.toString()
                                prevMatchIndex = subInd
                            }
                        });
                    });
                });
            }

        });
        featureInd2 = -1
        const map3 = new Map();
        featuresCopy.forEach(feature => {
            featureInd2++
            if (feature.geometry.type === 'Polygon') {
                ind0 = -1
                ind1 = -1
                ind2 = -1
                feature.geometry.coordinates.forEach(coordinates => {
                    ind0++;
                    ind1 = -1;

                    coordinates.forEach((coordinate, subInd) => {
                        ind1++;

                        if (map3.has(coordinate.toString())) {

                            if (subInd % 2 === 0) {
                                removePattern = "Even"
                            } else {
                                removePattern = "Odd"

                            }
                        }

                        if (removePattern === "Even" && subInd % 2 === 0) {
                            if(map.get(coordinate.toString()).position !=="first" && map.get(coordinate.toString()).position !=="last")
                                tempGeoJson.features[featureInd2].geometry.coordinates[ind0][ind1]=[]
                            map3.set(coordinate.toString(), true);
                        } else if (removePattern === "Odd" && subInd % 2 !== 0) {
                            if(map.get(coordinate.toString()).position !=="first" && map.get(coordinate.toString()).position !=="last")
                                tempGeoJson.features[featureInd2].geometry.coordinates[ind0][ind1]=[]
                            map3.set(coordinate.toString(), true);
                        }
                    });

                });
            } else if (feature.geometry.type === 'MultiPolygon') {
                ind0 = -1
                ind1 = -1
                ind2 = -1
                feature.geometry.coordinates.forEach(polygon => {
                    ind0++;
                    ind1 = -1;
                    ind2 = -1;
                    polygon.forEach(coordinates => {
                        ind1++;
                        ind2 = -1;

                        coordinates.forEach((coordinate, subInd) => {
                            ind2++;
                            if (map3.has(coordinate.toString())) {
                                if (subInd % 2 === 0) {
                                    removePattern = "Even"
                                } else {
                                    removePattern = "Odd"
                                }
                            }
                            if (removePattern === "Even" && subInd % 2 === 0) {
                                map3.set(coordinate.toString(), true);
                                if(map.get(coordinate.toString()).position !=="first" && map.get(coordinate.toString()).position !=="last"){
                                    if(tempGeoJson.features[featureInd2].geometry.coordinates[ind0][ind1].length>5)
                                        tempGeoJson.features[featureInd2].geometry.coordinates[ind0][ind1][ind2]=[]
                                }
                            } else if (removePattern === "Odd" && subInd % 2 !== 0) {
                                map3.set(coordinate.toString(), true);
                                if(map.get(coordinate.toString()).position !=="first" && map.get(coordinate.toString()).position !=="last"){
                                    if(tempGeoJson.features[featureInd2].geometry.coordinates[ind0][ind1].length>5)
                                        tempGeoJson.features[featureInd2].geometry.coordinates[ind0][ind1][ind2]=[]
                                }
                            }
                        });

                    });
                });
            }

        });

        featureInd2 =-1
        ind0 = -1
        ind1 = -1
        ind2 = -1
        featuresCopy.forEach(feature => {
            featureInd2++
            if (feature.geometry.type === 'Polygon') {
                ind0 = -1
                ind1 = -1
                ind2 = -1
                feature.geometry.coordinates.forEach(coordinates => {
                    ind0++;
                    ind1 = -1;

                    tempGeoJson.features[featureInd2].geometry.coordinates[ind0]=coordinates.filter(a=>a.length!==0)

                    //tempGeoJson.features[featureInd2].geometry.coordinates=tempGeoJson.features[featureInd2].geometry.coordinates.filter(a=>a.length!==1)


                });
            } else if (feature.geometry.type === 'MultiPolygon') {
                ind0 = -1
                ind1 = -1
                ind2 = -1
                feature.geometry.coordinates.forEach(polygon => {
                    ind0++;
                    ind1 = -1;
                    ind2 = -1;
                    polygon.forEach(coordinates => {
                        ind1++;
                        ind2 = -1;

                        tempGeoJson.features[featureInd2].geometry.coordinates[ind0][ind1]=coordinates.filter(a=>a.length!==0)
                        console.log(tempGeoJson.features[featureInd2].geometry.coordinates[ind0][ind1].length)
                        console.log(tempGeoJson.features[featureInd2].geometry.coordinates)
                        //console.log(tempGeoJson.features[featureInd2].geometry.coordinates[ind0]=tempGeoJson.features[featureInd2].geometry.coordinates[ind0].filter(a=>a.length<1))
                        //console.log(tempGeoJson.features[featureInd2].geometry.coordinates=tempGeoJson.features[featureInd2].geometry.coordinates .filter(a=>a.length<1))
                        //tempGeoJson.features[featureInd2].geometry.coordinates[ind0]=polygon.filter(a=>a.length!==1)

                    });
                });
            }

        });

        setGeoJson(tempGeoJson);
        setKeyid(keyid => keyid+1)
    }

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

    function handleChangeMapName(e){
        fetch(process.env.REACT_APP_API_URL + 'map/changeMapNameById', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                newName: e.target.value
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
            })
            .catch(err => console.log(err));

    }


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
                            // onChange={
                            //     (event)=>{
                            //         console.log("searching...", event.target.value);
                            //         setMapChange(event.target.value)}}
                            onBlur={(event) => handleChangeMapName(event)}
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
                            <MapEditor file={GeoJson} changeName={changeRegionName} key={keyid} handleCompress={handleCompress} />
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