import React, { useState, useEffect, useRef,useContext } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, LayerGroup, FeatureGroup, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapColorwheelModal from "./MapViewerModal/MapColorwheelModal";
import MapMergeChangeRegionNameModal from "./MapViewerModal/MapMergeChangeRegionNameModal";
import MapAddRegionModal from "./MapViewerModal/MapAddRegionModal";
import { GeomanControls } from 'react-leaflet-geoman-v2';
// import { topojson } from 'topojson';
import { topology } from 'topojson-server';
import { merge as mergeRegion } from 'topojson-client';
import * as turf from '@turf/turf'
import GeomanJsWrapper from './GeomanJsWrapper'
import { empty } from "leaflet/src/dom/DomUtil";
//import { useLeafletContext } from "@react-leaflet/core"; 
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import L from "leaflet";
import { CurrentModal, GlobalStoreContext } from "../../store/index"

function MapEditor(props) {
  
    const [isPopup, setPopup] = useState(false);
    const [update, setUpdate] = useState(1);
    const { store } = useContext(GlobalStoreContext);

    const regionsSelectedRef = useRef([])
    let regionsClicked = [];
    const selectModeToggle = useRef(false)

    const currentRegion = useRef("");

    const geoJsonMapData = store.currentMapData;
    //const context = useLeafletContext();
    console.log(geoJsonMapData);
    // useEffect(() =>{
    //     console.log("changed");
    //     setUpdate(update => update+1);
    // },[]);
    
    const nameChange = (event) => {
        let layer = event.target;

        let newName = prompt("Input new region name:", layer.feature.properties.name);
        if (!newName) {
            return;
        }
        props.changeName(layer.feature.properties.name, newName);
        layer.bindPopup(newName)
        layer.bindTooltip(layer.feature.properties.name,
            { permanent: true, direction: "center", className: "label" }
        ).openTooltip();
        //setUpdate(update+1);
        setUpdate(update => update + 1);
    }
    function arraysEqual(arr1, arr2) {
        // Check if the arrays have the same length
        if (arr1.length !== arr2.length) {
            return false;
        }

        // Loop through each element of the arrays and compare their values
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        // If all elements match, the arrays are equal
        return true;
    }
    function updateLatlngDrag(featureInd2,ind0,ind1,ind2,newlatlng){
        if(ind2==-1){
            geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1][0]=newlatlng[0]
            geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1][1]=newlatlng[1]
        }else{
            geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1][ind2][0]=newlatlng[0]
            geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1][ind2][1]=newlatlng[1]
        }
    }
   
    function handleAddVertex(e) {
        console.log(e)
        
        let indexPath = e.indexPath;
        let ind0 = indexPath[0]
        let ind1 = indexPath[1]
        let featureName = e.target.feature.properties.name
        let ind2 = -1;
        if (indexPath.length > 2) {
            ind2 = indexPath[2]
        }
        let addedLatlng = []
        let addedLatlngObj = e.latlng
        addedLatlng.push(e.latlng.lng)
        addedLatlng.push(e.latlng.lat)
        let coord1NextToLatlng = []
        let coord2NextToLatlng = []
        console.log(addedLatlng)
        geoJsonMapData.features.forEach((feature, ind) => {
            if (feature.properties.name == featureName) {
                if (feature.geometry.type === "Polygon") {
                    coord1NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1+1]
                    coord2NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1-1]
                    geoJsonMapData.features[ind].geometry.coordinates[ind0].splice(ind1, 0,addedLatlng)
                } else if (feature.geometry.type === "MultiPolygon") {
                    coord1NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1][ind2+1]
                    coord2NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1][ind2-1]
                    geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1].splice(ind2, 0,addedLatlng)
                }
            }
        })
        console.log(coord1NextToLatlng)
        console.log(coord2NextToLatlng)
        let featureInd2=-1
        let prevCoord=[]
        
        try {
        geoJsonMapData.features.forEach(feature => {
            let foundOneCoord=false
            featureInd2++
            // Check if the feature is a polygon or a multipolygon
            if(feature.properties.name!==featureName){
            if (feature.geometry.type === 'Polygon') {
                // Loop through each coordinate in the polygon
                ind0 = -1
                ind1 = -1
                ind2 = -1
                feature.geometry.coordinates.forEach(coordinates => {
                    ind0++;
                    ind1 = -1;
                    coordinates.forEach(coordinate => {
                        ind1++;
                            
                        if(coordinate[0]==coord2NextToLatlng[0] &&coordinate[1]==coord2NextToLatlng[1] &&foundOneCoord==true){
                            
                            geoJsonMapData.features[featureInd2].geometry.coordinates[ind0].splice(ind1, 0,addedLatlng)
                           
                            throw new Error("Break the loop.")
                        }else if(coordinate[0]==coord2NextToLatlng[0] &&coordinate[1]==coord2NextToLatlng[1]){
                            foundOneCoord=true
                            
                            
                        }
                        if(coordinate[0]==coord1NextToLatlng[0] &&coordinate[1]==coord1NextToLatlng[1] &&foundOneCoord==true){
                            
                            geoJsonMapData.features[featureInd2].geometry.coordinates[ind0].splice(ind1, 0,addedLatlng)
                            
                            throw new Error("Break the loop.")
                            
                        }else if(coordinate[0]==coord1NextToLatlng[0] &&coordinate[1]==coord1NextToLatlng[1]){
                            foundOneCoord=true
                           
                        }
                        prevCoord[0]= coordinate[0]
                        prevCoord[1]= coordinate[1]

                       
                       
                    });
                });
            } else if (feature.geometry.type === 'MultiPolygon') {
                // Loop through each polygon in the multipolygon
                ind0 = -1
                ind1 = -1
                ind2 = -1
                feature.geometry.coordinates.forEach(polygon => {
                    ind0++;
                    ind1 = -1;
                    ind2 = -1;
                    // Loop through each coordinate in the polygon

                    polygon.forEach(coordinates => {
                        ind1++;
                        ind2 = -1;

                        coordinates.forEach(coordinate => {
                            ind2++;
                            
                            if(coordinate[0]==coord2NextToLatlng[0] &&coordinate[1]==coord2NextToLatlng[1] &&foundOneCoord==true){
                                geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1].splice(ind2, 0,addedLatlng)
                                throw new Error("Break the loop.")
                            }else if(coordinate[0]==coord2NextToLatlng[0] &&coordinate[1]==coord2NextToLatlng[1]){
                                foundOneCoord=true
                                
                            }
                            if(coordinate[0]==coord1NextToLatlng[0] &&coordinate[1]==coord1NextToLatlng[1] &&foundOneCoord==true){
                                geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1].splice(ind2, 0,addedLatlng)
                                throw new Error("Break the loop.")
                            }else if(coordinate[0]==coord1NextToLatlng[0] &&coordinate[1]==coord1NextToLatlng[1]){
                                foundOneCoord=true
                               
                            }
                                               
                        });
                        
                    });
                });
            }
        }        
        });
    }catch(error){

    }
    
        setUpdate(update => update + 1);

    }
    function handleRemoveVertex(e) {
        
        let indexPath = e.indexPath;
        let ind0 = indexPath[0]
        let ind1 = indexPath[1]
        let featureName = e.target.feature.properties.name
        let ind2 = -1;
        if (indexPath.length > 2) {
            ind2 = indexPath[2]
        }
        console.log(indexPath)
        let removedLatlng=[]
        geoJsonMapData.features.forEach((feature, ind) => {
            if (feature.properties.name == featureName) {
                if (feature.geometry.type === "Polygon") {
                    removedLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1]
                    geoJsonMapData.features[ind].geometry.coordinates[ind0].splice(ind1, 1)
                } else if (feature.geometry.type === "MultiPolygon") {
                    console.log(ind)
                    removedLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1][ind2]
                    geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1].splice(ind2, 1)
                }
            }
        })
        let featureInd2=-1
        geoJsonMapData.features.forEach(feature => {
            featureInd2++
            // Check if the feature is a polygon or a multipolygon

            if (feature.geometry.type === 'Polygon') {
                // Loop through each coordinate in the polygon
                ind0 = -1
                ind1 = -1
                ind2 = -1
                feature.geometry.coordinates.forEach(coordinates => {
                    ind0++;
                    ind1 = -1;
                    coordinates.forEach(coordinate => {
                        ind1++;
                        if(coordinate[0]==removedLatlng[0] &&coordinate[1]==removedLatlng[1] ){
                            geoJsonMapData.features[featureInd2].geometry.coordinates[ind0].splice(ind1, 1)
                        }
                       
                    });
                });
            } else if (feature.geometry.type === 'MultiPolygon') {
                // Loop through each polygon in the multipolygon
                ind0 = -1
                ind1 = -1
                ind2 = -1
                feature.geometry.coordinates.forEach(polygon => {
                    ind0++;
                    ind1 = -1;
                    ind2 = -1;
                    // Loop through each coordinate in the polygon

                    polygon.forEach(coordinates => {
                        ind1++;
                        ind2 = -1;

                        coordinates.forEach(coordinate => {
                            ind2++;

                            if(coordinate[0]==removedLatlng[0] &&coordinate[1]==removedLatlng[1] ){
                                geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1].splice(ind2, 1)
                            }                            
                        });
                    });
                });
            }
            
        });
        setUpdate(update => update + 1);

    }

    const handleMarkerDragEnd = (e) => {
        
        
        console.log(e.target)
        const layer = e.target;
        const newlatlng=[];
        const indexPath = e.indexPath;
        
        const featureName = e.target.feature.properties.name;
        let index2 = -1;
        let index0 = indexPath[0]
        let index1 = indexPath[1]
        let latlng = [];

        let featureInd = -1
        let currentFeatures = geoJsonMapData.features;
        if (indexPath.length == 3) {
            index2 = indexPath[2]


            for (let i = 0; i < currentFeatures.length; i++) {
                let name = currentFeatures[i].properties.name;
                if (name == featureName) {
                    featureInd = i;

                    latlng = currentFeatures[i].geometry.coordinates[index0][index1][index2]
                    newlatlng[0]=e.target._latlngs[index0][index1][index2].lng
                    newlatlng[1]=e.target._latlngs[index0][index1][index2].lat
                    console.log(newlatlng)
                    break;
                }
            }
        } else if (indexPath.length == 2) {

            for (let i = 0; i < currentFeatures.length; i++) {
                let name = currentFeatures[i].properties.name;
                if (name == featureName) {
                    featureInd = i;

                    latlng = currentFeatures[i].geometry.coordinates[index0][index1]
                    newlatlng[0]=e.target._latlngs[index0][index1].lng
                    newlatlng[1]=e.target._latlngs[index0][index1].lat
                    break;
                }
            }
        }


        // Loop through each feature in the GeoJSON file
        let ind0 = -1
        let ind1 = -1
        let ind2 = -1
        let featureInd2 = -1
        let feature2coord =[]
        let savedFeatureInd=[]
        const BreakError = {};
        // try {
            currentFeatures.forEach(feature => {
                featureInd2++
                // Check if the feature is a polygon or a multipolygon

                if (feature.geometry.type === 'Polygon') {
                    // Loop through each coordinate in the polygon
                    ind0 = -1
                    ind1 = -1
                    ind2 = -1
                    feature.geometry.coordinates.forEach(coordinates => {
                        ind0++;
                        ind1 = -1;
                        coordinates.forEach(coordinate => {
                            ind1++;

                            // Check if the coordinate matches the given coordinate
                            if (arraysEqual(coordinate, latlng) && feature.properties.name !== featureName) {
                                console.log("Match found in feature: ", feature.properties.name);
                                //throw BreakError;
                                
                                if(!savedFeatureInd.includes(featureInd2)){
                                    console.log(featureInd2)
                                    updateLatlngDrag(featureInd2,ind0,ind1,ind2,newlatlng)
                                    savedFeatureInd.push(featureInd2)
                                }
                                    
                                ind0 = -1
                                ind1 = -1
                                ind2 = -1
                            }
                        });
                    });
                } else if (feature.geometry.type === 'MultiPolygon') {
                    // Loop through each polygon in the multipolygon
                    ind0 = -1
                    ind1 = -1
                    ind2 = -1
                    feature.geometry.coordinates.forEach(polygon => {
                        ind0++;
                        ind1 = -1;
                        ind2 = -1;
                        // Loop through each coordinate in the polygon

                        polygon.forEach(coordinates => {
                            ind1++;
                            ind2 = -1;

                            coordinates.forEach(coordinate => {
                                ind2++;

                                if (arraysEqual(coordinate, latlng) && feature.properties.name !== featureName) {
                                    console.log("Match found in feature: ", feature.properties.name);
                                    //throw BreakError;
                                    
                                
                                    if(!savedFeatureInd.includes(featureInd2)){
                                        console.log(featureInd2)
                                        updateLatlngDrag(featureInd2,ind0,ind1,ind2,newlatlng)
                                        savedFeatureInd.push(featureInd2)
                                    }
                                    
                                    ind0 = -1
                                    ind1 = -1
                                    ind2 = -1

                                }
                            });
                        });
                    });
                }


            });
        // } catch (err) {
        //     if (err !== BreakError) throw err;
        // }
   
        
        if(index2==-1){
            geoJsonMapData.features[featureInd].geometry.coordinates[index0][index1][0]=newlatlng[0]
            geoJsonMapData.features[featureInd].geometry.coordinates[index0][index1][1]=newlatlng[1]
        }else{
            geoJsonMapData.features[featureInd].geometry.coordinates[index0][index1][index2][0]=newlatlng[0]
            geoJsonMapData.features[featureInd].geometry.coordinates[index0][index1][index2][1]=newlatlng[1]
        }
        setUpdate(update => update + 1);
    };


    const handleLayerRemove = (e) => {
        const layer = e.layer;
        if (layer instanceof Marker) {
            // Do something with the removed marker
        }
    };

    const onEachCountry = (feature, layer) => {
        if (update == 1) {
            if (feature.properties.NAME_3) {
                feature.properties.name = feature.properties.NAME_3;
            }
            else if (feature.properties.NAME_2) {
                feature.properties.name = feature.properties.NAME_2;
            }
            else if (feature.properties.NAME_1) {
                feature.properties.name = feature.properties.NAME_1;
            }
            else if (feature.properties.NAME_0) {
                feature.properties.name = feature.properties.NAME_0;
            }
        }
        const countryName = feature.properties.name;



        layer.bindTooltip(layer.feature.properties.name,
            { permanent: true, direction: "center", className: "label" }
        ).openTooltip();

        
        let propString = countryName
        let propObj = feature.properties;
        // for(const property in propObj){
        //     console.log(`${property}: ${propObj[property]}`);
        //     propString += `${property}: ${propObj[property]}` +"<br>"
        // }
        layer.bindPopup(propString, {});
        layer.options.fillOpacity = 0.4;


        layer.on('click', function (e) {
            store.setRegionProperties({"hi":"hi","yo":"hey"})
            let featureName = e.target.feature.properties.name;
            geoJsonMapData.features.forEach((feature, index) => {
                if (feature.properties.name === featureName) {
                    store.setCurrentFeatureIndex(index);
                }
            });
            if (selectModeToggle.current) {

                let regions = regionsSelectedRef.current
                regionsClicked.push(e)


                // for(let i=0; i<regionsClicked.length; i++){
                //     if(e.target.feature.properties.name === regionsClicked[i].feature.properties.name){
                //         e.target.setStyle({
                //             // color: "blue",
                //             fillColor: "#3388ff",
                //             fillOpacity: 0.4,
                //         });
                //         regionsClicked.splice(i, 1);
                //         regions.splice(i, 1);
                //         return;
                //     }
                // }

                e.target.setStyle({
                    // color: "blue",
                    fillColor: "#284dd4",
                    fillOpacity: 0.7,
                });
                regions.push(e.target.feature);

                // if (regionsClicked.length > 2) {
                //     regionsClicked[0].setStyle({
                //         // color: "blue",
                //         fillColor: "#3388ff",
                //         fillOpacity: 0.4,
                //     });
                //
                //     regionsClicked.splice(0, 1);
                //     regions.splice(0,1);
                // }
            } else {
                if (currentRegion.current !== "") {
                    currentRegion.current.setStyle({
                        fillColor: "#3388ff",
                        fillOpacity: 0.4,
                    });
                }

                currentRegion.current = e.target;
                currentRegion.current.setStyle({
                    // color: "blue",
                    fillColor: "#284dd4",
                    fillOpacity: 0.7,
                });
            }


        });

        layer.on({
            dblclick: nameChange.bind(this)
        });
        layer.on('pm:vertexremoved', e => {
            console.log("vertexremoved")
            handleRemoveVertex(e)
        });
        layer.on('pm:vertexadded', e => {
            console.log("pm:vertexadded")
            handleAddVertex(e)
        });
        layer.on('pm:edit', e => {
            console.log("pm:edit")
            console.log(e.target)
        });
        layer.on('pm:markerdragstart', e => {
            console.log("pm:markerdragstart")


        });
        layer.on('pm:markerdragend', e => {
            console.log("pm:markerdragend")
            handleMarkerDragEnd(e);
        });
        layer.on('pm:markerclick', e => {
            console.log("pm:markerclick")
        });
        layer.on('pm:markerdragend', e => {
            //    console.log(e)
            //     //When done dragging an edit, it updates the geojson

        });
    }


    let toggleSelectMode = () => {

        if (currentRegion.current !== "") {
            currentRegion.current.setStyle({
                fillColor: "#3388ff",
                fillOpacity: 0.4,
            });
        }
        selectModeToggle.current = !selectModeToggle.current
        if (selectModeToggle.current === false) {

            for (let i = 0; i < regionsClicked.length; i++) {
                regionsClicked[i].target.setStyle({
                    fillColor: "#3388ff",
                    fillOpacity: 0.4,
                });
            }
            regionsClicked = []
        }
    };
    function handleUpdate(){
        setUpdate(update=>update+1)
    }


    const handleMerge = (newName) => {
        let regionsSelected = regionsSelectedRef.current

        if (regionsSelected.length < 2) {
            alert("please select 2 regions first");
            return;
        }
        // let newName = prompt("enter new region name:");
        if (newName == null) {
            return;
        }

        let allRegionArray = geoJsonMapData.features
        let emptyPoly = turf.multiPolygon([])

        for (let i = 0; i < regionsSelected.length; i++) {

            let region = regionsSelected[i]

            allRegionArray = allRegionArray.filter(x => x.properties.name !== region.properties.name) //remove all with same name regions
            let poly = region.geometry.coordinates

            poly = region.geometry.type === "Polygon" ?
                turf.polygon(poly)
                :
                turf.multiPolygon(poly)

            emptyPoly = turf.union(emptyPoly, poly);

        }

        emptyPoly.properties = regionsSelected[0].properties;
        emptyPoly.properties.name = newName;

        geoJsonMapData.features = [...allRegionArray, emptyPoly] // add to the geoJsonMapData.feature

        regionsSelectedRef.current = [] //empty everything
        //setUpdate(update+1) //absolutely crazy code but we need this to update the map
        setUpdate(update => update + 1);
    }
    const handleCancelMergeSelection = () => {
        let regionsSelected = regionsSelectedRef.current
        regionsSelectedRef.current = [] //empty everything
        setUpdate(update => update + 1);


    }
    const handleAddRegion=(name)=>{
        geoJsonMapData.features[geoJsonMapData.features.length-1].properties.name = name
        setUpdate(update=>update+1)
    }

    return (
        <div>
            <MapColorwheelModal/>
            <MapMergeChangeRegionNameModal
                handleMerge={handleMerge}
                handleCancelMergeSelection = {handleCancelMergeSelection}
            />
            <MapAddRegionModal
                handleAddRegion={handleAddRegion}
            />
            

            {geoJsonMapData.features ?
                <div>
                    
                    
                    <MapContainer
                style={{ height: "80vh" }}sx={{marginTop:"30vh"}} zoom={store.zoomLevel} center={store.centerCoords}
                editable={true}
            >
                
                <TileLayer url="xxx" />

                <LayerGroup>
                    <TileLayer
                        attribution='&amp;copy <update href="http://osm.org/copyright">OpenStreetMap</update> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <TileLayer url="http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png" />
                </LayerGroup>
                <GeomanJsWrapper
                        toggleSelectMode={toggleSelectMode}
                        compress={props.handleCompress}
                        file = {geoJsonMapData}
                        updateEditor = {handleUpdate}
                        updateViewer = {props.updateViewer}
                    />

                    <FeatureGroup>

                        <GeoJSON
                            key={update}
                            data={geoJsonMapData.features}
                            onEachFeature={onEachCountry}
                        />

                    </FeatureGroup>
            </MapContainer>
                    





                </div>
                :
                <></>
            }
        </div>
    )
}

export default MapEditor;