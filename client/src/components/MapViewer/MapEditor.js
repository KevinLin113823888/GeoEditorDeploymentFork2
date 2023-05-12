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
import ColorTPS from "../../transactions/ColorTPS";
import MergeAndSplitTPS from "../../transactions/MergeAndSplitTPS";
import MapChangeNameModal from "./MapViewerModal/MapChangeNameModal";
import Toastify from 'toastify-js'

function MapEditor(props) {
  
    const [isPopup, setPopup] = useState(false);
    const [update, setUpdate] = useState(1);
    const { store, setStore} = useContext(GlobalStoreContext);

    const [bgColor,setBgColor] = useState("#ff0000")

    const bgColorRef = useRef('#00ff00')
    const regionsSelectedRef = useRef([])
    const selectedLayerList = useRef([])
    let regionsClicked = [];
    const selectModeToggle = useRef(false)

    const currentRegion = useRef("");

    let dragStartCoords = []
    const geoJsonMapData = store.currentMapData;

    const [clickedLayer,setClickedLayer] = useState(null);
    
    
    useEffect(() => {
        function handleBeforeUnload() {
            
            localStorage.setItem('store', JSON.stringify(store));
            localStorage.setItem('jsTPS', JSON.stringify(store.jstps));
        }
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [store]);
   
    function handleAddVertex(e) {

        let vertexEditFeature = e.target.feature
        
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
        let firstFeatureInd = -1;

        geoJsonMapData.features.forEach((feature, ind) => {
            if (feature.properties.name == featureName) {
                firstFeatureInd = ind;
                if (feature.geometry.type === "Polygon") {
                    coord1NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1-1]
                    coord2NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1]
                    // geoJsonMapData.features[ind].geometry.coordinates[ind0].splice(ind1, 0,addedLatlng)
                } else if (feature.geometry.type === "MultiPolygon") {
                    coord1NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1][ind2-1]
                    coord2NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1][ind2]
                    // geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1].splice(ind2, 0,addedLatlng)
                }
            }
        })
        let featureInd2=-1
        let prevCoord=[]

        try {
            let flag = false
        geoJsonMapData.features.forEach(feature => {
            let foundOneCoord = -1
            featureInd2++
            let sharedCoords = feature.geometry.coordinates
            if (feature == vertexEditFeature || firstFeatureInd==featureInd2) {
                return
            }
            if (feature.geometry.type === 'Polygon') {
                sharedCoords = [sharedCoords]
            }
            // Loop through each polygon in the multipolygon
            ind0 = -1
            ind1 = -1
            ind2 = -1
            sharedCoords.forEach(polygon => {
                ind0++;
                ind1 = -1;
                ind2 = -1;
                // Loop through each coordinate in the polygon
                polygon.forEach(coordinates => {
                    ind1++;
                    ind2 = -1;
                    coordinates.forEach(coordinate => {
                        ind2++;
                        if (coordinate[0] == coord2NextToLatlng[0] && coordinate[1] == coord2NextToLatlng[1] && foundOneCoord == true) {
                            // geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1].splice(ind2, 0, addedLatlng)
                            let sharedIndexPath = feature.geometry.type === 'Polygon' ?[ind1,ind2] : [ind0,ind1,ind2]
                            let transactionMappedData = {
                                type: "add",
                                store: store,
                                setStore: setStore,
                                updateView: store.updateViewer,
                                update:store.updateEditor,
                                indexPath : e.indexPath,
                                editingFeature: vertexEditFeature,
                                new2DVec: [e.latlng.lng,e.latlng.lat],
                                sharedBorderFeature: geoJsonMapData.features[featureInd2],
                                ind:featureInd2,
                                sharedIndexPath:sharedIndexPath,
                            }
                            store.jstps.addTransaction(new VertexTPS(transactionMappedData))
                            throw new Error("Break the loop.")
                        } else if (coordinate[0] == coord2NextToLatlng[0] && coordinate[1] == coord2NextToLatlng[1]) {
                            foundOneCoord = true
                        }
                        if (coordinate[0] == coord1NextToLatlng[0] && coordinate[1] == coord1NextToLatlng[1] && foundOneCoord == true) {
                            // geoJsonMapData.features[featureInd2].geometry.coordinates[ind0][ind1].splice(ind2, 0, addedLatlng)
                            let sharedIndexPath = feature.geometry.type === 'Polygon' ?[ind1,ind2] : [ind0,ind1,ind2]
                            let transactionMappedData = {
                                type: "add",
                                store: store,
                                setStore: setStore,
                                updateView: store.updateViewer,
                                update:store.updateEditor,
                                indexPath : e.indexPath,
                                editingFeature: vertexEditFeature,
                                new2DVec: [e.latlng.lng,e.latlng.lat],
                                sharedBorderFeature: geoJsonMapData.features[featureInd2],
                                ind:featureInd2,
                                sharedIndexPath:sharedIndexPath,
                            }
                            store.jstps.addTransaction(new VertexTPS(transactionMappedData))
                            throw new Error("Break the loop.")
                        } else if (coordinate[0] == coord1NextToLatlng[0] && coordinate[1] == coord1NextToLatlng[1]) {
                            foundOneCoord = true

                        }

                    });

                });
            });
        })
            console.log("normal add vertex")

            let transactionMappedData = {
                type: "add",
                store: store,
                setStore: setStore,
                updateView: store.updateViewer,
                update:store.updateEditor,
                indexPath : e.indexPath,
                editingFeature: vertexEditFeature,
                new2DVec: [e.latlng.lng,e.latlng.lat],
                sharedIndexPath:null,
            }
            store.jstps.addTransaction(new VertexTPS(transactionMappedData))
        }
    catch(error)
    {
    }

        setUpdate(update => update + 1);
        return


        // console.log("this is our vertex add.")
        // let vertexEditFeature = e.target.feature
        // let newVertex = [e.latlng.lng,e.latlng.lat]

        // let sharedBorderFeature = null
        // let sharedIndexPath = null
        // let sharedPoints = new Set()
        // store.currentMapData.features.filter(x => x!=vertexEditFeature).forEach(feature1 => {
        //     let res = turf.lineOverlap(feature1,vertexEditFeature)
        //     if(res.features.length>0){
        //             res.features[0].geometry.coordinates.forEach(x=>{
        //                 sharedPoints.add(x.toString())
        //             })
        //         sharedBorderFeature = feature1
        //     }
        // })
        // //time to find where is this new index located ig
        // if(sharedBorderFeature !== null){
        //     console.log("there contains a match ")
        //     console.log(sharedPoints)

        //     let i=e.indexPath
        //     let vertexSinglePoly = vertexEditFeature.geometry.coordinates[i[0]]
        //     let vertexMultiPoly =  vertexEditFeature.geometry.coordinates[i[0]][i[1]]
        //     let vertexIndex = i[i.length-1]
        //     let polygon = i.length===3?vertexMultiPoly:vertexSinglePoly
        //     let orgVertex = polygon[vertexIndex]



        //     let curr = polygon[vertexIndex]?.toString()
        //     let prev = polygon[vertexIndex-1]?.toString()

        //     console.log("this is the orgVertex poly bruh for curr")
        //     console.log(vertexIndex)
        //     console.log(orgVertex)
        //     console.log(curr)
        //     console.log(prev)

        //     let multiPolygon = sharedBorderFeature.geometry.coordinates
        //     if(sharedBorderFeature.geometry.type === "Polygon")
        //         multiPolygon = [multiPolygon]
        //     multiPolygon.forEach((singlePoly,i) => {
        //         singlePoly.forEach((islandPoly,j) => {
        //             islandPoly.every((vertex,k) => {
        //                 let vertexStr = vertex.toString()
        //                 let vertexStrNext = islandPoly[k+1]?.toString()

        //                 if((vertexStr === curr && prev === vertexStrNext) ||
        //                     (vertexStr === prev && curr === vertexStrNext) )
        //                 {
        //                     console.log("found someting idk")

        //                             sharedIndexPath=sharedBorderFeature.geometry.type === "Polygon"
        //                             ?[j,k] :[i,j,k+1]
        //                             return false
        //                 }
        //                 })
        //             })
        //         })
        // }
        // console.log("this is the shared index.")
        // console.log(sharedIndexPath)
        // let transactionMappedData = {
        //     type: "add",
        //     store: store,
        //     setStore: setStore,
        //     updateView: store.updateViewer,
        //     update:store.updateEditor,
        //     indexPath : e.indexPath,
        //     editingFeature: vertexEditFeature,
        //     new2DVec:newVertex,
        //     sharedBorderFeature: sharedBorderFeature,
        //     sharedIndexPath:sharedIndexPath,
        // }
        // store.jstps.addTransaction(new VertexTPS(transactionMappedData))
        // return;

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

        // store.currentFeatureIndex = -1
        store.setCurrentFeatureIndex(-1)
    }

    function handleRemoveVertex(e) {
        console.log("vertex removal")
        let vertexEditFeature = e.target.feature


        let geoFeaturesList = store.currentMapData.features
        let sharedBorderFeature = null
        let sharedIndexPath = null


        let i=e.indexPath
        let vertexSinglePoly = vertexEditFeature.geometry.coordinates[i[0]]
        let vertexMultiPoly =  vertexEditFeature.geometry.coordinates[i[0]][i[1]]
        let vertexIndex = i[i.length-1]
        let polygon = i.length===3?vertexMultiPoly:vertexSinglePoly
        let orgVertex = polygon[vertexIndex]

        console.log("this is the vert that we want to remo")
        console.log(orgVertex.toString())

        let flag = false
        geoFeaturesList.filter(x => x!=vertexEditFeature).forEach(feature1 => {
            if(flag){
                return
            }
            let reslap = turf.lineOverlap(feature1,vertexEditFeature, {tolerance: 2})

            if(reslap.features.length>0){
                let resCoords = reslap.features
                let str = (JSON.stringify(resCoords))
                if(~str.indexOf(orgVertex))
                {
                    console.log("this should be it")
                    sharedBorderFeature = feature1
                    flag=true
                }
            }
            else{
                let res = turf.intersect(feature1,vertexEditFeature)
                console.log("this is for the res")
                console.log(res)
                if(res?.geometry?.coordinates?.length>0){
                    let str = (JSON.stringify(res))
                    if(~str.indexOf(orgVertex))
                    {
                        console.log("this should be it")
                        sharedBorderFeature = feature1
                        flag=true
                    }
                }
            }
            })

        console.log("we we have any shared?")
        console.log(sharedBorderFeature)
        if(sharedBorderFeature!== null) {
            let sharedCoords = sharedBorderFeature.geometry.coordinates
            if (sharedBorderFeature.geometry.type === "Polygon") {
                sharedCoords = [sharedCoords]
            }


            for (let i = 0; i < sharedCoords.length; i++) {
                let poly = sharedCoords[i]
                for (let j = 0; j < poly.length; j++) {
                    let island = poly[j]
                    for (let k = 0; k < island.length; k++) {
                        let vertex = island[k].toString()
                        if(vertex === orgVertex.toString() ){
                            if(sharedBorderFeature.geometry.type === "Polygon"){
                                sharedIndexPath = [j,k]
                            }
                            else{
                                sharedIndexPath= [i,j,k]
                            }
                        }
                        }
                    }
                }
            }

        console.log("final res")
        console.log(sharedBorderFeature)
        console.log(sharedIndexPath)



        let transactionMappedData = {
            type: "delete",
            store: store,
            setStore: setStore,
            updateView: store.updateViewer,
            update:store.updateEditor,
            indexPath : e.indexPath,
            editingFeature: vertexEditFeature,
            sharedBorderFeature: sharedBorderFeature,
            sharedIndexPath: sharedIndexPath,
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
                            sharedBorderFeature = feature1
                            if(feature1.geometry.type === "Polygon"){
                                console.log("i thought it was a polygon")
                                sharedIndexPath = [j,k]
                            }
                        else
                            sharedIndexPath = [i,j,k]
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
        let a = `<div style="color:gray;
"> ${countryName}</div>`
        // a = countryName
        var tooltip = L.tooltip({
            content: a,
        permanent: true,
        direction:"center"})
        layer.bindTooltip(tooltip).openTooltip()
        // layer.bindTooltip(layer.feature.properties.name,
        //     { permanent: true, direction: 'center'}
        // ).openTooltip()

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

        //right click to change region, absolutely spaghetti

        //keywordto

        layer.on('contextmenu', function (e) {
            setClickedLayer(e)
            store.changeModal("CHANGE_REGION_NAME_MODAL")
        })
        layer.on({
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


    let toggleSelectMode = (boolean) => {
        if(boolean!==undefined){
            // currentRegion.current=!boolean
        }

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
            Toastify({
                text: "Please Select Two Regions Before Merging",
                gravity: "bottom",
                position: 'left',
                duration: 2000,
                style: {
                  background: '#0f3443'
                }
              }).showToast();
    
            return;
        }
        if (newName == null) { //if no name means cancel i suppose
            regionsSelectedRef.current = [] //empty everything
            return;
        }



        let allRegionArray = geoJsonMapData.features
        let emptyPoly = turf.multiPolygon([])

        let oldRegionIndex = []
        for (let i = 0; i < regionsSelected.length; i++) {
            let region = regionsSelected[i]
            for(let j=0;j<allRegionArray.length;j++){
                if(region==allRegionArray[j]){
                    console.log("found match in merge")
                    oldRegionIndex.push(j)
                }
            }
            // allRegionArray = allRegionArray.filter((x,i) => x.properties.name !== region.properties.name) //remove all with same name regions
            let poly = region.geometry.coordinates
            poly = region.geometry.type === "Polygon" ? turf.polygon(poly) : turf.multiPolygon(poly)
            emptyPoly = turf.union(emptyPoly, poly);
        }
        // emptyPoly.properties = regionsSelected[0].properties;
        emptyPoly.properties.name = newName;
        emptyPoly.subRegionColor = regionsSelected[0].subRegionColor
        emptyPoly.borderColor = regionsSelected[0].borderColor

        // geoJsonMapData.features = [...allRegionArray, emptyPoly] // add to the geoJsonMapData.feature

        oldRegionIndex.sort(function(a,b){ return b-a; });
        let transactionMappedData = {
            type: "merge",
            store: store,
            setStore: setStore,
            updateView: store.updateViewer,
            updateEditor:store.updateEditor,
            newRegion:emptyPoly,
            oldRegionIndex:oldRegionIndex
        }
        store.jstps.addTransaction(new MergeAndSplitTPS(transactionMappedData))

        regionsSelectedRef.current = [] //empty everything
        // setUpdate(update => update + 1);
    }

    const handleBorderOrRegionColorChange = (color,type) => {
        console.log("got color req of",color,type)

        let regionsSelected = regionsSelectedRef.current
        let featureIndex = []
        for (let i = 0; i < regionsSelected.length; i++) {
            for(let j=0;j<geoJsonMapData.features.length;j++){
                if(geoJsonMapData.features[j] == regionsSelected[i]){
                    featureIndex.push(j)
                    // geoJsonMapData.features[j].borderColor = color;
                }
            }
        }

        console.log("called with")
        console.log(featureIndex)
        regionsSelectedRef.current = []
        let transactionMappedData = {
            type: type,
            store: store,
            setStore: setStore,
            updateView: store.updateViewer,
            updateEditor:store.updateEditor,
            newColor: color,
            featureIndex: featureIndex,
        }
        store.jstps.addTransaction(new ColorTPS(transactionMappedData))
    }

    const handleCancelMergeSelection = () => {
        toggleSelectMode()
        toggleSelectMode()

        let regionsSelected = regionsSelectedRef.current
        regionsSelectedRef.current = [] //empty everything
        setUpdate(update => update + 1);

    }
    const handleCancelRegionSelection = () => {
        let regionsSelected = regionsSelectedRef.current
        regionsSelectedRef.current = [] //empty everything
        setUpdate(update => update + 1);

    }


    useEffect(() => {
        store.updateEditor = handleUpdate
    },[])


    const handleBackgroundColorChange = (color) => {
        let transactionMappedData = {
            type: "bg",
            store: store,
            setStore: setStore,
            updateView: store.updateViewer,
            updateEditor:store.updateEditor,
            oldColor: store.currentMapData.graphicalData.backgroundColor,
            newColor: color,
        }
        store.jstps.addTransaction(new ColorTPS(transactionMappedData))
    }
    let unselect = () =>{
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
    }

    return (
        <div>
            <MapColorwheelModal/>
            <MapMergeChangeRegionNameModal
                handleMerge={handleMerge}
                handleCancelMergeSelection = {handleCancelMergeSelection}
            />
            <MapChangeNameModal
                clickedLayer = {clickedLayer}

            />
            <MapAddRegionModal
                // handleAddRegion={handleAddRegion}
            />
            {/*<SubregionColorModal handleChangeRegionColor={handleChangeRegionColor} handleCancelRegionSelection={handleCancelRegionSelection}/>*/}
            {/*<BorderColorModal handleChangeBorderColor={handleChangeBorderColor} handleCancelRegionSelection={handleCancelRegionSelection}/>*/}

            {geoJsonMapData.features ?
                <div class="leafletmapdiv">
                    
                    
                    <MapContainer id="mapitem"

                style={{ height: "85vh",
                backgroundColor: store.currentMapData.graphicalData.backgroundColor }}sx={{marginTop:"30vh"}} zoom={store.zoomLevel} center={store.centerCoords}
                editable={true}
                >
                <Screenshoter
                    mapCardId = {props.mapCardId}
                    />
                
                        <TileLayer
                            attribution='&amp;copy <update href="http://osm.org/copyright">OpenStreetMap</update> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            opacity={.75}

                        />
                    <FeatureGroup>
                        <GeoJSON
                            key={update}
                            data={geoJsonMapData.features}
                            onEachFeature={onEachCountry}
                        />
                    </FeatureGroup>

                        <GeomanJsWrapper
                            handleBackgroundColorChange = {handleBackgroundColorChange}
                            handleBorderColor = {(c)=> {handleBorderOrRegionColorChange(c,"borderColor")}}
                            handleRegionColor = {(c)=> {handleBorderOrRegionColorChange(c,"subRegionColor")}}
                            toggleSelectMode={toggleSelectMode}
                            compress={props.handleCompress}
                            file = {geoJsonMapData}
                            updateEditor = {handleUpdate}
                            updateViewer = {props.updateViewer}
                            unselect = {unselect}
                            regionsSelected = {regionsSelectedRef.current}
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