import React, {useState, useEffect, useRef} from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, LayerGroup, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { GeomanControls } from 'react-leaflet-geoman-v2';
// import { topojson } from 'topojson';
import { topology } from 'topojson-server';
import { merge as mergeRegion } from 'topojson-client';
import * as turf from '@turf/turf'
import {GeomanJsWrapper} from './GeomanJsWrapper'
import {empty} from "leaflet/src/dom/DomUtil";

function MapView(props) {
    const [isPopup, setPopup] = useState(false);
    const [update,setUpdate] = useState(1);

    const regionsSelectedRef = useRef([])
    let regionsClicked =[];
    const selectModeToggle = useRef(false)


    // if(props.file.features){
    //     console.log(props.file.features)
    // }

    const nameChange = (event) => {
        let layer = event.target;
        console.log(layer.feature.properties.name);
        let newName = prompt("Input new region name:", layer.feature.properties.name);
        if(!newName){
            return;
        }
        props.changeName(layer.feature.properties.name, newName);
        layer.bindPopup(newName)
        layer.bindTooltip(layer.feature.properties.name,
            {permanent: true, direction:"center",className: "label"}
        ).openTooltip();
        setUpdate(update+1);
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
            }


        });

        layer.on({
            dblclick: nameChange.bind(this)
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
        setUpdate(update+1) //absolutely crazy code but we need this to update the map
    }

    let toggleSelectMode = () => {
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
                    <button
                        onClick={handleMerge
                        }>
                        merge your last 2 clicked regions
                    </button>
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
                            {/*<GeomanControls*/}
                            {/*    options={{*/}
                            {/*        position: 'topleft',*/}
                            {/*        drawMarker: false,*/}
                            {/*        drawText: false,*/}
                            {/*        drawPolyline: false,*/}
                            {/*        drawRectangle: false,*/}
                            {/*        drawPolygon: false,*/}
                            {/*        drawCircle: false,*/}
                            {/*        drawCircleMarker:false*/}
                            {/*    }}*/}
                            {/*    globalOptions={{*/}
                            {/*        continueDrawing: true,*/}
                            {/*        editable: false,*/}
                            {/*        limitMarkersToCount: 20,*/}
                            {/*        removeVertexOn: "contextmenu", //right click on verticies to remove*/}
                            {/*        hideMiddleMarkers: true,*/}
                            {/*    }}*/}
                            {/*    onCreate={handleCreate}*/}
                            {/*    onChange={(e) => console.log('onChange', e)}*/}
                            {/*/>*/}

                        </FeatureGroup>

                        <TileLayer url="xxx" />

                        <LayerGroup>
                            <TileLayer
                                attribution='&amp;copy <update href="http://osm.org/copyright">OpenStreetMap</update> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <TileLayer url="http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png" />
                        </LayerGroup>

                        {/* <GeoJSON
                                    data={props.file.features}
                                    onEachFeature={onEachCountry}
                                /> */}

                    </MapContainer>


                    {/*<ReactLeafletEditable*/}
                    {/*    ref={editRef}*/}
                    {/*    map={map}*/}
                    {/*>*/}
                    {/*    <MapContainer style={{ height: "80vh" }} zoom={2} center={[20, 100]}*/}
                    {/*                  editable={true}>*/}
                    {/*        <GeoJSON*/}
                    {/*            data={props.file.features}*/}
                    {/*            onEachFeature={onEachCountry}*/}
                    {/*        />*/}
                    {/*    </MapContainer>*/}
                    {/*</ReactLeafletEditable>*/}



                </div>
                :
                <></>
            }
        </div>
    )
}

export default MapView;