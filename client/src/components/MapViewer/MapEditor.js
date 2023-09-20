import React, { useState, useEffect, useRef,useContext } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, LayerGroup, FeatureGroup, useMapEvents, Marker, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapColorwheelModal from "./MapViewerModal/MapColorwheelModal";
import MapMergeChangeRegionNameModal from "./MapViewerModal/MapMergeChangeRegionNameModal";
import MapAddRegionModal from "./MapViewerModal/MapAddRegionModal";
import Legend from "./MapViewerModal/Legend";
import * as turf from '@turf/turf'
import GeomanJsWrapper from './GeomanJsWrapper'
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
import { useParams } from 'react-router-dom';

function MapEditor(props) {
  
    const [isPopup, setPopup] = useState(false);
    const [update, setUpdate] = useState(1);
    const [updateMapContainer, setUpdateMapContainer] = useState(1);


    const { store, setStore} = useContext(GlobalStoreContext);

    const [bgColor,setBgColor] = useState("#ff0000")

    const bgColorRef = useRef('#00ff00')
    const regionsSelectedRef = useRef([])
    const selectedLayerList = useRef([])
    let regionsClicked = [];
    const selectModeToggle = useRef(false)

    const currentRegion = useRef("");
    const { id } = useParams();

    let dragStartCoords = []
    const geoJsonMapData = store.currentMapData;

    const [clickedLayer,setClickedLayer] = useState(null);
    

    useEffect(() =>{
        store.centerScreen(true);
    }, [props.center]);
    
    useEffect(() =>{
        if(!props.sshot){
            return
        }
        props.setSshot(false);
        store.takeScreenShot(true);
    }, [props.sshot]);
   
    useEffect(() => {
        store.currentScreen = "yourmap"
    },[]);
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
                } else if (feature.geometry.type === "MultiPolygon") {
                    coord1NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1][ind2-1]
                    coord2NextToLatlng = geoJsonMapData.features[ind].geometry.coordinates[ind0][ind1][ind2]
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
                        sharedBorderFeature = feature1
                        flag=true
                    }
                }
            }
            })

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
        fillColor: feature.subRegionColor,
        fillOpacity: 0.7,
        color: feature.borderColor
    });
        let a = `<div style="color:gray;"> ${countryName}</div>`
        var tooltip = L.tooltip({
            content: a,
            permanent: true,
            direction:"center"
        })
        layer.bindTooltip(tooltip).openTooltip()

        let propString = countryName
        layer.bindPopup(propString);
        
        layer.options.fillOpacity = 0.4;


        layer.on('click', function (e) {
            
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


        layer.on('contextmenu', function (e) {
            setClickedLayer(e)
            store.changeModal("CHANGE_REGION_NAME_MODAL")
        })
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

    }


    let toggleSelectMode = (boolean) => {

        console.log("called to toggle selecte mode, and toggling select mode just means to clear all existing array data")

        //set the current region to not selected
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
        //revert all regions clicked back to its original
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

        console.log("there should be nothing here. at all ")
        regionsSelectedRef.current = [] //empty everything
        console.log(regionsSelectedRef)

        boolean = !selectModeToggle.current
        selectModeToggle.current = boolean


        setUpdate(update => update + 1);



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
            let poly = region.geometry.coordinates
            poly = region.geometry.type === "Polygon" ? turf.polygon(poly) : turf.multiPolygon(poly)
            emptyPoly = turf.union(emptyPoly, poly);
        }

        emptyPoly.properties.name = newName;
        emptyPoly.subRegionColor = regionsSelected[0].subRegionColor
        emptyPoly.borderColor = regionsSelected[0].borderColor

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

        let regionsSelected = regionsSelectedRef.current

        console.log("there should be nothing in here after ")
        regionsSelectedRef.current = [] //empty everything

        console.log(regionsSelectedRef)
        setUpdate(update => update + 1);

    }
    const handleCancelRegionSelection = () => {
        let regionsSelected = regionsSelectedRef.current
        regionsSelectedRef.current = [] //empty everything
        setUpdate(update => update + 1);

    }

    function handleUpdateContainer(){
        setUpdateMapContainer(update=>update+1)
    }


    useEffect(() => {
        store.updateEditor = handleUpdate
        store.updateMapContainer = handleUpdateContainer
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
                
            />
            {/*<SubregionColorModal handleChangeRegionColor={handleChangeRegionColor} handleCancelRegionSelection={handleCancelRegionSelection}/>*/}
            {/*<BorderColorModal handleChangeBorderColor={handleChangeBorderColor} handleCancelRegionSelection={handleCancelRegionSelection}/>*/}

            {geoJsonMapData.features ?
                <div class="leafletmapdiv">
                    <MapContainer
                        key={updateMapContainer}
                        id="mapitem"
                        style={{ height: "85vh",
                        backgroundColor: store.currentMapData.graphicalData.backgroundColor }}sx={{marginTop:"30vh"}} zoom={store.zoomLevel} center={store.centerCoords}
                        editable={true}
                    >
                        <Screenshoter mapCardId = {props.mapCardId}/>
                        
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
                                regionsSelected = {regionsSelectedRef}
                        />
                        <Legend
                            key={updateMapContainer}
                            data={store.currentMapData.graphicalData.legend}
                            updateEditor = {handleUpdate}
                            updateViewer = {props.updateViewer}/>
                    </MapContainer>
                </div>
                :
                <></>
            }
        </div>
    )
}

export default MapEditor;