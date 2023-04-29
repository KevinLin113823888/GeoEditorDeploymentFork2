import React, { useState, useEffect, useRef,useContext } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, LayerGroup, FeatureGroup, useMapEvents, Marker, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapColorwheelModal from "./MapViewerModal/MapColorwheelModal";
import SubregionColorModal from "./MapViewerModal/SubregionColorModal";
import BorderColorModal from "./MapViewerModal/BorderColorModal";
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
import './mapEditor.css';

import Screenshoter from './Screenshoter';
import RegionTPS from "../../transactions/RegionTPS";
import VertexTPS from "../../transactions/VertexTPS";

function MapEditor(props) {
  
    const [isPopup, setPopup] = useState(false);
    const [update, setUpdate] = useState(1);
    const { store, setStore} = useContext(GlobalStoreContext);
    // const tileRef = useRef();

    const regionsSelectedRef = useRef([])
    const selectedLayerList = useRef([])
    let regionsClicked = [];
    const selectModeToggle = useRef(false)

    const currentRegion = useRef("");

    let dragStartCoords = []
    const geoJsonMapData = store.currentMapData;
    //
    // function arraysEqual(arr1, arr2) {
    //     // Check if the arrays have the same length
    //     if (arr1.length !== arr2.length) {
    //         return false;
    //     }
    //     // Loop through each element of the arrays and compare their values
    //     for (let i = 0; i < arr1.length; i++) {
    //         if (arr1[i] !== arr2[i]) {
    //             return false;
    //         }
    //     }
    //     // If all elements match, the arrays are equal
    //     return true;
    // }
    // function updateLatlngDrag(featureInd2,ind0,ind1,ind2,newlatlng){
    //     if(ind2==-1){
    //         geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1][0]=newlatlng[0]
    //         geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1][1]=newlatlng[1]
    //     }else{
    //         geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1][ind2][0]=newlatlng[0]
    //         geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1][ind2][1]=newlatlng[1]
    //     }
    // }
   
    function handleAddVertex(e) {
        console.log("this is our vertex add.")
        console.log(e)
        let vertexEditFeature = e.target.feature
        let newVertex = [e.latlng.lng,e.latlng.lat]

        let transactionMappedData = {
            type: "add",
            store: store,
            setStore: setStore,
            updateView: store.updateViewer,
            update:store.updateEditor,
            indexPath : e.indexPath,
            editingFeature: vertexEditFeature,
            new2DVec:newVertex,
        }
        store.jstps.addTransaction(new VertexTPS(transactionMappedData))
        return;
    //
    //     let indexPath = e.indexPath;
    //
    //     let ind0 = indexPath[0]
    //     let ind1 = indexPath[1]
    //
    //     let featureName = e.target.feature.properties.name
    //     let ind2 = -1;
    //     if (indexPath.length > 2) {
    //         ind2 = indexPath[2]
    //     }
    //     let addedLatlng = []
    //     let addedLatlngObj = e.latlng
    //     addedLatlng.push(e.latlng.lng)
    //     addedLatlng.push(e.latlng.lat)
    //     let coord1NextToLatlng = []
    //     let coord2NextToLatlng = []
    //     geoJsonMapData.features.forEach((feature, ind) => {
    //         if (feature.properties.name == featureName) {
    //             if (feature.geometry.type === "Polygon") {
    //                 coord1NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1+1]
    //                 coord2NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1-1]
    //                 geoJsonMapData.features[ind].geometry.coordinates[ind0].splice(ind1, 0,addedLatlng)
    //             } else if (feature.geometry.type === "MultiPolygon") {
    //                 coord1NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1][ind2+1]
    //                 coord2NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1][ind2-1]
    //                 geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1].splice(ind2, 0,addedLatlng)
    //             }
    //         }
    //     })
    //
    //     let featureInd2=-1
    //     let prevCoord=[]
    //
    //     try {
    //     geoJsonMapData.features.forEach(feature => {
    //         let foundOneCoord=false
    //         featureInd2++
    //         // Check if the feature is a polygon or a multipolygon
    //         if(feature.properties.name!==featureName){
    //         if (feature.geometry.type === 'Polygon') {
    //             // Loop through each coordinate in the polygon
    //             ind0 = -1
    //             ind1 = -1
    //             ind2 = -1
    //             feature.geometry.coordinates.forEach(coordinates => {
    //                 ind0++;
    //                 ind1 = -1;
    //                 coordinates.forEach(coordinate => {
    //                     ind1++;
    //
    //                     if(coordinate[0]==coord2NextToLatlng[0] &&coordinate[1]==coord2NextToLatlng[1] &&foundOneCoord==true){
    //
    //                         geoJsonMapData.features[featureInd2].geometry.coordinates[ind0].splice(ind1, 0,addedLatlng)
    //
    //                         throw new Error("Break the loop.")
    //                     }else if(coordinate[0]==coord2NextToLatlng[0] &&coordinate[1]==coord2NextToLatlng[1]){
    //                         foundOneCoord=true
    //
    //
    //                     }
    //                     if(coordinate[0]==coord1NextToLatlng[0] &&coordinate[1]==coord1NextToLatlng[1] &&foundOneCoord==true){
    //
    //                         geoJsonMapData.features[featureInd2].geometry.coordinates[ind0].splice(ind1, 0,addedLatlng)
    //
    //                         throw new Error("Break the loop.")
    //
    //                     }else if(coordinate[0]==coord1NextToLatlng[0] &&coordinate[1]==coord1NextToLatlng[1]){
    //                         foundOneCoord=true
    //
    //                     }
    //                     prevCoord[0]= coordinate[0]
    //                     prevCoord[1]= coordinate[1]
    //
    //
    //
    //                 });
    //             });
    //         } else if (feature.geometry.type === 'MultiPolygon') {
    //             // Loop through each polygon in the multipolygon
    //             ind0 = -1
    //             ind1 = -1
    //             ind2 = -1
    //             feature.geometry.coordinates.forEach(polygon => {
    //                 ind0++;
    //                 ind1 = -1;
    //                 ind2 = -1;
    //                 // Loop through each coordinate in the polygon
    //
    //                 polygon.forEach(coordinates => {
    //                     ind1++;
    //                     ind2 = -1;
    //
    //                     coordinates.forEach(coordinate => {
    //                         ind2++;
    //
    //                         if(coordinate[0]==coord2NextToLatlng[0] &&coordinate[1]==coord2NextToLatlng[1] &&foundOneCoord==true){
    //                             geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1].splice(ind2, 0,addedLatlng)
    //                             throw new Error("Break the loop.")
    //                         }else if(coordinate[0]==coord2NextToLatlng[0] &&coordinate[1]==coord2NextToLatlng[1]){
    //                             foundOneCoord=true
    //
    //                         }
    //                         if(coordinate[0]==coord1NextToLatlng[0] &&coordinate[1]==coord1NextToLatlng[1] &&foundOneCoord==true){
    //                             geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1].splice(ind2, 0,addedLatlng)
    //                             throw new Error("Break the loop.")
    //                         }else if(coordinate[0]==coord1NextToLatlng[0] &&coordinate[1]==coord1NextToLatlng[1]){
    //                             foundOneCoord=true
    //
    //                         }
    //
    //                     });
    //
    //                 });
    //             });
    //         }
    //     }
    //     });
    // }catch(error){
    //
    // }
    //     setUpdate(update => update + 1);
    }

    function handleRemoveRegion(e) {
        let editingFeature =  e.target.feature

        let transactionMappedData = {
            type: "remove",
            store: store,
            setStore: setStore,
            updateView: store.updateViewer,
            update:store.updateEditor,
            editingFeature: editingFeature,
        }
        store.jstps.addTransaction(new RegionTPS(transactionMappedData))
    }

    function handleRemoveVertex(e) {
        console.log("vertex removal")
        let vertexEditFeature = e.target.feature
        let transactionMappedData = {
            type: "delete",
            store: store,
            setStore: setStore,
            updateView: store.updateViewer,
            update:store.updateEditor,
            indexPath : e.indexPath,
            editingFeature: vertexEditFeature,
        }
        store.jstps.addTransaction(new VertexTPS(transactionMappedData))
        return;
        //
        // let indexPath = e.indexPath;
        // let ind0 = indexPath[0]
        // let ind1 = indexPath[1]
        // let featureName = e.target.feature.properties.name
        // let ind2 = -1;
        // if (indexPath.length > 2) {
        //     ind2 = indexPath[2]
        // }
        //
        // let removedLatlng=[]
        // geoJsonMapData.features.forEach((feature, ind) => {
        //     if (feature.properties.name == featureName) {
        //         if (feature.geometry.type === "Polygon") {
        //             removedLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1]
        //             geoJsonMapData.features[ind].geometry.coordinates[ind0].splice(ind1, 1)
        //         } else if (feature.geometry.type === "MultiPolygon") {
        //             removedLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1][ind2]
        //             geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1].splice(ind2, 1)
        //         }
        //     }
        // })
        // let featureInd2=-1
        // geoJsonMapData.features.forEach(feature => {
        //     featureInd2++
        //     // Check if the feature is a polygon or a multipolygon
        //
        //     if (feature.geometry.type === 'Polygon') {
        //         // Loop through each coordinate in the polygon
        //         ind0 = -1
        //         ind1 = -1
        //         ind2 = -1
        //         feature.geometry.coordinates.forEach(coordinates => {
        //             ind0++;
        //             ind1 = -1;
        //             coordinates.forEach(coordinate => {
        //                 ind1++;
        //                 if(coordinate[0]==removedLatlng[0] &&coordinate[1]==removedLatlng[1] ){
        //                     geoJsonMapData.features[featureInd2].geometry.coordinates[ind0].splice(ind1, 1)
        //                 }
        //
        //             });
        //         });
        //     } else if (feature.geometry.type === 'MultiPolygon') {
        //         // Loop through each polygon in the multipolygon
        //         ind0 = -1
        //         ind1 = -1
        //         ind2 = -1
        //         feature.geometry.coordinates.forEach(polygon => {
        //             ind0++;
        //             ind1 = -1;
        //             ind2 = -1;
        //             // Loop through each coordinate in the polygon
        //
        //             polygon.forEach(coordinates => {
        //                 ind1++;
        //                 ind2 = -1;
        //
        //                 coordinates.forEach(coordinate => {
        //                     ind2++;
        //
        //                     if(coordinate[0]==removedLatlng[0] &&coordinate[1]==removedLatlng[1] ){
        //                         geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1].splice(ind2, 1)
        //                     }
        //                 });
        //             });
        //         });
        //     }
        //
        // });
        // setUpdate(update => update + 1);

    }

    const handleDraggedRegion = (e) =>{
        console.log("handle dragon region")

        let dragEndCoords = e.layer._latlngs[0]
        console.log(dragStartCoords)
        console.log(dragEndCoords)

        if(e.target.feature.geometry.type === "MultiPolygon"){
            dragEndCoords = dragEndCoords[0]
            dragStartCoords=dragStartCoords[0]
        }

        let dx = dragEndCoords[0].lng-dragStartCoords[0].lng
        let dy = dragEndCoords[0].lat-dragStartCoords[0].lat



        let vertexEditFeature = e.target.feature

        console.log("dragg")
        console.log(dx,dy)
        let transactionMappedData = {
            type: "dragRegion",
            store: store,
            setStore: setStore,
            updateView: store.updateViewer,
            update:store.updateEditor,
            editingFeature: vertexEditFeature,
            dx:dx,
            dy:dy
        }
        store.jstps.addTransaction(new RegionTPS(transactionMappedData))
        return;

    }
    const handleMarkerDragEnd = (e) => {


        console.log("marker drag ")
        let geoFeaturesList = store.currentMapData.features
        let currentFeature = e.layer.feature
        let sharedBorderFeature = null



        let i=e.indexPath
        let vertexSinglePoly = currentFeature.geometry.coordinates[i[0]]
        let vertexMultiPoly = currentFeature.geometry.coordinates[i[0]][i[1]]
        let polygon = i.length===3?vertexMultiPoly:vertexSinglePoly
        let oldVertex = polygon[i[i.length-1]]

        console.log("vertex that we need to find is the same")
        console.log(oldVertex)

        let oldVertexStr = oldVertex.toString()
        let sharedIndexPath = []
        geoFeaturesList.filter(x => x!=currentFeature).forEach(feature1 => {
            let multiPolygon = feature1.geometry.coordinates
            if(feature1.geometry.type === "Polygon")
                multiPolygon = [multiPolygon]
            multiPolygon.forEach((singlePoly,i) => {
                singlePoly.forEach((islandPoly,j) => {
                    islandPoly.forEach((vertex,k) => {
                        if(vertex.toString() === oldVertexStr){
                            console.log("match found")
                            if(feature1.geometry.type === "Polygon"){
                                sharedIndexPath = [j,k]
                            }
                            sharedIndexPath = [i,j,k]
                            sharedBorderFeature = feature1
                        }
                    })
                })
            })
        })
        console.log("this is the shared feature")
        console.log(sharedBorderFeature)


        let vertexEditFeature = e.target.feature
        let newVertex = [e.markerEvent.target._latlng.lng, e.markerEvent.target._latlng.lat]
        let transactionMappedData = {
            type: "drag",
            store: store,
            setStore: setStore,
            updateView: store.updateViewer,
            update:store.updateEditor,
            indexPath : e.indexPath,
            editingFeature: vertexEditFeature,
            new2DVec:newVertex,
            sharedIndexPath: sharedIndexPath,
            sharedBorderFeature: sharedBorderFeature
        }
        store.jstps.addTransaction(new VertexTPS(transactionMappedData))
        return;
        //
        // console.log(e.target)
        // const layer = e.target;
        // const newlatlng=[];
        // const indexPath = e.indexPath;
        //
        // const featureName = e.target.feature.properties.name;
        // let index2 = -1;
        // let index0 = indexPath[0]
        // let index1 = indexPath[1]
        // let latlng = [];
        //
        // let featureInd = -1
        // let currentFeatures = geoJsonMapData.features;
        // if (indexPath.length == 3) {
        //     index2 = indexPath[2]
        //     for (let i = 0; i < currentFeatures.length; i++) {
        //         let name = currentFeatures[i].properties.name;
        //         if (name == featureName) {
        //             featureInd = i;
        //
        //             latlng = currentFeatures[i].geometry.coordinates[index0][index1][index2]
        //             newlatlng[0]=e.target._latlngs[index0][index1][index2].lng
        //             newlatlng[1]=e.target._latlngs[index0][index1][index2].lat
        //             console.log(newlatlng)
        //             break;
        //         }
        //     }
        // } else if (indexPath.length == 2) {
        //
        //     for (let i = 0; i < currentFeatures.length; i++) {
        //         let name = currentFeatures[i].properties.name;
        //         if (name == featureName) {
        //             featureInd = i;
        //
        //             latlng = currentFeatures[i].geometry.coordinates[index0][index1]
        //             newlatlng[0]=e.target._latlngs[index0][index1].lng
        //             newlatlng[1]=e.target._latlngs[index0][index1].lat
        //             break;
        //         }
        //     }
        // }
        //

        // Loop through each feature in the GeoJSON file

        // setUpdate(update => update + 1);
    };


    function hexToRgb(hex) {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return `${r}, ${g}, ${b}`;
      }

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
    
        if(!feature.subRegionColor){
            feature.subRegionColor = "#3388ff"
        }
        if(!feature.borderColor){
            feature.borderColor="#0328fc"
        }
       layer.setStyle({
        // color: "blue",
        fillColor: feature.subRegionColor,
        fillOpacity: 0.7,
        color: feature.borderColor
    });
        layer.bindTooltip(layer.feature.properties.name,
            { permanent: true, direction: 'center'}
        ).openTooltip()

        

//     // create popup contents
    // var customPopup = "<b>My office</b><br/><img src='http://netdna.webdesignerdepot.com/uploads/2014/05/workspace_06_previo.jpg' alt='maptime logo gif' width='150px'/>";

    // // specify popup options 
    var customOptions =
    {
    'maxWidth': '400',
    'width': '200',
    'className' : 'popupCustom'
    }    

        let propString = countryName
        layer.bindPopup(propString);
        layer.options.fillOpacity = 0.4;


        layer.on('click', function (e) {
            store.setRegionProperties({"hi":"hi","yo":"hey"})
            console.log("on layer click i guess")
            console.log(e)
            let featureName = e.target.feature.properties.name;
            geoJsonMapData.features.forEach((feature, index) => {
                if (feature.properties.name === featureName) {
                    store.setCurrentFeatureIndex(index);
                }
            });

            if (selectModeToggle.current) {
                console.log("SUP",regionsClicked)
                let selectedLayerList = regionsSelectedRef.current
                regionsClicked.push(e)
                e.target.setStyle({
                    fillColor: `rgba(${hexToRgb(feature.subRegionColor)}, 0.95)`,
                    fillOpacity: 0.7,
                });
                selectedLayerList.push(e.target.feature);
            } else {
                if (currentRegion.current !== "") {
                    let color = "#3388ff"
                   if(currentRegion.current.feature.subRegionColor){
                    color=currentRegion.current.feature.subRegionColor
                   }
                    currentRegion.current.setStyle({
                        fillColor: color,
                        fillOpacity: 0.4,
                    });
                }
                currentRegion.current = e.target;
                currentRegion.current.setStyle({
                    fillColor: `rgba(${hexToRgb(feature.subRegionColor)}, 0.95)`,
                    fillOpacity: 0.7,
                });
            }


        });

        // layer.on({
        //     dblclick: nameChange.bind(this)
        // });
        layer.on('pm:vertexremoved', e => {
            console.log("vertexremoved")
            handleRemoveVertex(e)
        });
        layer.on('pm:vertexadded', e => {
            console.log("pm:vertexadded")
            handleAddVertex(e)
        });
        layer.on('pm:edit', e => {
            console.log("this is the layer")
            // console.log(layer)
            console.log("pm:edit")
            // console.log(e.target)
        });
        layer.on('pm:markerdragstart', e => {
            console.log("pm:markerdragstart")
        });
        layer.on('pm:markerdragend', e => {
            console.log("pm:markerdragend")
            handleMarkerDragEnd(e);
        });

        layer.on('pm:dragstart', e => {
            console.log("pm:dragstart")
            // console.log(e)
            dragStartCoords = e.layer._latlngs[0]
            // console.log(dragStartCoords)
        });
        layer.on('pm:dragend', e => {
            console.log("pm:dragend")
            // console.log(e)


            // let dragEndCoords = e.layer._latlngs[0]
            // console.log(dragStartCoords)
            // console.log(dragEndCoords)

            handleDraggedRegion(e)
        });


        layer.on('pm:remove', e=> {
            console.log("pm remove")
            console.log(e)
            handleRemoveRegion(e)
        })

        // layer.on('pm:drag', e => {
        //     console.log("pm:bruh")
        //     console.log(e)
        //     // handleDraggedRegion(e)
        // });
    }


    let toggleSelectMode = () => {

        
        if (currentRegion.current !== "") {
            let color = "#3388ff"
            
            if(currentRegion.current.feature.subRegionColor){
                console.log(currentRegion.current)
                color = currentRegion.current.feature.subRegionColor
            }
            currentRegion.current.setStyle({
                fillColor: color,
                fillOpacity: 0.4,
            });
        }
        selectModeToggle.current = !selectModeToggle.current
        console.log(regionsClicked)
            
            for (let i = 0; i < regionsClicked.length; i++) {
                
                let color = "#3388ff"
                if(regionsClicked[i].target.feature.subRegionColor){
                    
                    color =regionsClicked[i].target.feature.subRegionColor
                }
                regionsClicked[i].target.setStyle({
                    fillColor: color,
                    fillOpacity: 0.4,
                });
            }
            regionsClicked = []
        
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
        emptyPoly.subRegionColor = regionsSelected[0].subRegionColor
        emptyPoly.borderColor = regionsSelected[0].borderColor

        geoJsonMapData.features = [...allRegionArray, emptyPoly] // add to the geoJsonMapData.feature

        regionsSelectedRef.current = [] //empty everything
        //setUpdate(update+1) //absolutely crazy code but we need this to update the map
        setUpdate(update => update + 1);
    }

    const handleChangeRegionColor = (color) => {
       
        let regionsSelected = regionsSelectedRef.current
        for (let i = 0; i < regionsSelected.length; i++) {
            // regionsSelected[i].subRegionColor = color
            for(let j=0;j<geoJsonMapData.features.length;j++){
                if(geoJsonMapData.features[j].properties.name == regionsSelected[i].properties.name ){
                    geoJsonMapData.features[j].subRegionColor = color
                }
            }

        }
        regionsSelectedRef.current = []
        

        setUpdate(update => update + 1);
    }
    const handleChangeBorderColor = (color) => {

        let regionsSelected = regionsSelectedRef.current

        for (let i = 0; i < regionsSelected.length; i++) {
            
            for(let j=0;j<geoJsonMapData.features.length;j++){
                if(geoJsonMapData.features[j].properties.name == regionsSelected[i].properties.name ){
                    geoJsonMapData.features[j].borderColor = color  ;
                 
                }
            }

        }
        regionsSelectedRef.current = []

        setUpdate(update => update + 1);
    }


    const handleCancelMergeSelection = () => {
        let regionsSelected = regionsSelectedRef.current
        regionsSelectedRef.current = [] //empty everything
        setUpdate(update => update + 1);

    }
    const handleCancelRegionSelection = () => {
        let regionsSelected = regionsSelectedRef.current
        regionsSelectedRef.current = [] //empty everything
        setUpdate(update => update + 1);

    }


    // useEffect(() => { //why isnt this permanent>
    //     if(tileRef.current === undefined)
    //         return
    //         console.log("this for the background map colors")
    //         console.log(tileRef.current.getContainer().style)
    //         tileRef.current
    //             .getContainer()
    //             .style.setProperty("opacity", `50%`);
    // }, [tileRef.current,store.currentMapData.graphicalData]);

    //initalize the handle update stuff.
    useEffect(() => {
        store.updateEditor = handleUpdate
    },[])


    return (
        <div>
            <MapColorwheelModal/>
            <MapMergeChangeRegionNameModal
                handleMerge={handleMerge}
                handleCancelMergeSelection = {handleCancelMergeSelection}
            />
            <MapAddRegionModal
                // handleAddRegion={handleAddRegion}
            />
            <SubregionColorModal handleChangeRegionColor={handleChangeRegionColor} handleCancelRegionSelection={handleCancelRegionSelection}/>
            <BorderColorModal handleChangeBorderColor={handleChangeBorderColor} handleCancelRegionSelection={handleCancelRegionSelection}/>

            {geoJsonMapData.features ?
                <div>
                    
                    
                    <MapContainer id="mapitem"
                style={{ height: "80vh" }}sx={{marginTop:"30vh"}} zoom={store.zoomLevel} center={store.centerCoords}
                editable={true}
                >
                <Screenshoter
                    mapCardId = {props.mapCardId}
                    />
                
                <TileLayer url="xxx" />

                <LayerGroup>
                    <TileLayer
                        attribution='&amp;copy <update href="http://osm.org/copyright">OpenStreetMap</update> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <TileLayer url="http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png" />
                </LayerGroup>

                        <TileLayer
                            // ref={tileRef}
                            attribution='&amp;copy <update href="http://osm.org/copyright">OpenStreetMap</update> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    <FeatureGroup>
                        <GeoJSON
                            key={update}
                            data={geoJsonMapData.features}
                            onEachFeature={onEachCountry}
                        />
                    </FeatureGroup>

                        <GeomanJsWrapper
                            toggleSelectMode={toggleSelectMode}
                            compress={props.handleCompress}
                            file = {geoJsonMapData}
                            // updateEditor = {handleUpdate}
                            updateViewer = {props.updateViewer}
                        />
            </MapContainer>
                </div>
                :
                <></>
            }
        </div>
    )
}

export default MapEditor;