import React, {useState, useEffect, useRef, useContext} from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, LayerGroup, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// import { topojson } from 'topojson';
import * as turf from '@turf/turf'
import GeomanJsWrapper from "./GeomanJsWrapper";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { CurrentModal, GlobalStoreContext } from "../../store/index"

function MapEditor(props) {
    const [isPopup, setPopup] = useState(false);
    const [update,setUpdate] = useState(1);

    const { store } = useContext(GlobalStoreContext);

    const regionsSelectedRef = useRef([])
    let regionsClicked =[];
    const selectModeToggle = useRef(false)

    const currentRegion = useRef("");
    console.log(currentRegion.current);
    console.log(props.file)
    const nameChange = (event) => {

        store.changeModal(CurrentModal.MAP_MERGE_REGION_NAME)

        // let layer = event.target;
        // console.log(layer.feature.properties.name);
        // let newName = prompt("Input new region name:", layer.feature.properties.name);
        // if(!newName){
        //     return;
        // }
        // props.changeName(layer.feature.properties.name, newName);
        // layer.bindPopup(newName)
        // layer.bindTooltip(layer.feature.properties.name,
        //     {permanent: true, direction:"center",className: "label"}
        // ).openTooltip();
        // //setUpdate(update+1);
        // setUpdate(update => update + 1);
    }
    const convertToCoords = (latlng)=>{

    }
    const onEachCountry = (feature, layer) => {
        const countryName = "";
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



        layer.bindTooltip(layer.feature.properties.name,
            {permanent: true, direction:"center",className: "label"}
        ).openTooltip();

        let propString = ""
        let propObj = feature.properties;
        // for(const property in propObj){
        //     console.log(`${property}: ${propObj[property]}`);
        //     propString += `${property}: ${propObj[property]}` +"<br>"
        // }
        layer.bindPopup(propString,{});
        layer.options.fillOpacity = 0.4;


        layer.on('click', function (e) {
            console.log(e.target);
            console.log(e);
            if(selectModeToggle.current)
            {

                let regions = regionsSelectedRef.current
                regionsClicked.push(e)
                console.log(regionsClicked)

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
            }else{
                if(currentRegion.current!==""){
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
        layer.on('pm:edit', e => {

            let region = e.layer.feature;
            if(e.layer._latlngs.length==1){
                let polyCoords = [[]];

                let latlng = e.layer._latlngs[0];
                let first = [latlng[0].lng, latlng[0].lat];
                for (let i = 0; i < latlng.length; i++) {
                    polyCoords[0].push([latlng[i].lng, latlng[i].lat]);
                }
                if([latlng[latlng.length-1].lng, latlng[latlng.length-1].lat] !==first){
                    polyCoords[0].push(first);
                }
                let region = e.layer.feature;
                region.geometry.coordinates = polyCoords;

            } else {

                let polyCoords = [];
                for (let j = 0; j < e.layer._latlngs.length; j++) {
                    polyCoords.push([[]]);
                    let latlng = e.layer._latlngs[j][0];
                    for (let i = 0; i < latlng.length; i++) {
                        polyCoords[j][0].push([latlng[i].lng, latlng[i].lat]);
                    }
                }
                let region = e.layer.feature;
                region.geometry.coordinates = polyCoords;
            }
            let allRegionArray = props.file.features;
            allRegionArray = allRegionArray.filter(x => x.properties.name !== e.layer.feature.properties.name) //remove all with same name regions
            props.file.features = [...allRegionArray,region]
            setUpdate(update => update + 1);
        });
    }


    const handleMerge =(e) => {
        let regionsSelected = regionsSelectedRef.current

        if(regionsSelected.length<2){
            alert("please select 2 regions first");
            return;
        }
        let newName = prompt("enter new region name:");
        if(newName == null){
            return;
        }

        let allRegionArray = props.file.features
        let emptyPoly = turf.multiPolygon([])

        for(let i=0;i<regionsSelected.length;i++){

            let region = regionsSelected[i]

            allRegionArray = allRegionArray.filter( x => x.properties.name !== region.properties.name) //remove all with same name regions
            let poly = region.geometry.coordinates

            poly = region.geometry.type === "Polygon"?
                turf.polygon(poly)
                :
                turf.multiPolygon(poly)

            emptyPoly= turf.union(emptyPoly, poly);
            console.log("union result")
            console.log(emptyPoly)
        }

        emptyPoly.properties =regionsSelected[0].properties;
        emptyPoly.properties.name = newName;

        props.file.features = [...allRegionArray,emptyPoly] // add to the props.file.feature

        regionsSelectedRef.current = [] //empty everything
        //setUpdate(update+1) //absolutely crazy code but we need this to update the map
        setUpdate(update => update + 1);
    }

    let toggleSelectMode = () => {

        if(currentRegion.current!==""){
            currentRegion.current.setStyle({
                fillColor: "#3388ff",
                fillOpacity: 0.4,
            });
        }
        selectModeToggle.current = !selectModeToggle.current
        if(selectModeToggle.current === false){
            console.log(regionsClicked)
            for(let i=0;i<regionsClicked.length;i++){
                regionsClicked[i].target.setStyle({
                    fillColor: "#3388ff",
                    fillOpacity: 0.4,
                });
            }
            regionsClicked = []
        }
    };

    return (
        <div>
            {props.file.features ?
                <div>
                    {/*<button*/}
                    {/*    onClick={handleMerge*/}
                    {/*    }>*/}
                    {/*    merge your last 2 clicked regions*/}
                    {/*</button>*/}
                    <MapContainer
                        style={{ height: "80vh" }} zoom={2} center={[20, 100]}
                        editable={true}
                    >
                        <GeomanJsWrapper
                            merge={handleMerge}
                            toggleSelectMode={toggleSelectMode}
                        />

                        <FeatureGroup>

                            <GeoJSON
                                key={update}
                                data={props.file.features}
                                onEachFeature={onEachCountry}
                            />

                        </FeatureGroup>

                        <TileLayer url="xxx" />

                        <LayerGroup>
                            <TileLayer
                                attribution='&amp;copy <update href="http://osm.org/copyright">OpenStreetMap</update> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <TileLayer url="http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png" />
                        </LayerGroup>
                    </MapContainer>


                </div>
                :
                <></>
            }
        </div>
    )
}

export default MapEditor;
//
// import {React, useState, useEffect} from "react";
// import { useLocation } from 'react-router-dom';
//
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
// import Input from '@mui/material/Input';
//
//
// function Mapeditor(){
//     const {state} = useLocation();
//     console.log(state)
//
//     // useEffect(() => {
//     //     fetch('http://199.19.72.130:9000/' + 'map/loggedIn', {
//     //         method: "GET",
//     //         credentials: 'include',
//     //         headers: {
//     //         "Content-Type": "application/json",
//     //         }
//     //     })
//     //     .then((res) => res.json())
//     //     .then((data) => {
//     //         setUsername(data.username);
//     //         if (data.ownedMapCards === undefined) {
//     //             setMapCards([]);
//     //         }
//     //     })
//     //     .catch(err => console.log(err));
//     // }, []);
//
//
//
//     return(
//         <div className="Mapeditor">
//             editor yay, id = { state.mapId }
//         </div>
//     )
// }
//
// export default Mapeditor;