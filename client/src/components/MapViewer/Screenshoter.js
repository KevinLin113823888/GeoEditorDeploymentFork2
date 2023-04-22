
import {SimpleMapScreenshoter} from 'leaflet-simple-map-screenshoter';
import { useMap } from 'react-leaflet';
import * as L from "leaflet";
import React, { useState, useEffect, useRef,useContext } from 'react';
import { CurrentModal, GlobalStoreContext } from "../../store/index"
import { Buffer } from "buffer";
import FileSaver from 'file-saver';

function Screenshoter(props) {
    
    const { store } = useContext(GlobalStoreContext);
    const map = useMap();
    
    useEffect(() =>{
        console.log("hey")
        var screenshot = L.simpleMapScreenshoter().addTo(map);
        let format = 'blob'
        // let overridedPluginOptions = {
        //     mimeType: 'image/jpeg'
        // }

        var bounds = new L.LatLngBounds();
        // map.whenReady((map.eachLayer((layer) => {
        //     console.log(layer)
        //     }
        //     )));
        map.whenReady(() => {
            map.eachLayer(function(layer){
                setTimeout(function() {
                if(layer._layers){
                    
                    Object.keys(layer._layers).forEach(key =>{
                        bounds.extend(layer._layers[key]._bounds);
                    })
                }
                map.fitBounds(bounds);
            }, 1000);
            });
        });
      
        console.log(bounds)
        //map.fitBounds(bounds);  
        
        // if(bounds){
        //     console.log(bounds)
        //     map.fitBounds(bounds);
        // }

        screenshot.takeScreen(format).then(blob => {
            console.log("screenshot taken");
            console.log(blob);
            const blobString = convertBlobToString(blob);
            const type = blob.type;

        }).catch(e => {
            console.error(e)
        })
    },[store.setScreenshot]);

    async function convertBlobToString(blob){
        return await blob.text();
    }
         
    return (
        <></>
    )
}
export default Screenshoter;