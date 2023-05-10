
import {SimpleMapScreenshoter} from 'leaflet-simple-map-screenshoter';
import { useMap } from 'react-leaflet';
import * as L from "leaflet";
import React, { useState, useEffect, useRef,useContext } from 'react';
import { GlobalStoreContext } from "../store/index"
import { Buffer } from "buffer";
import FileSaver from 'file-saver';

function CommunityScreenshot(props) {
    
    const { store } = useContext(GlobalStoreContext);

    const map = useMap();

    useEffect(() =>{
        console.log('center screen', store.communityPng)

        if(!store.communityPng){
            return
        }
        store.setCommunityPng(false);
        store.communityPng = false;

        let pluginOptions = {
            cropImageByInnerWH: true, // crop blank opacity from image borders
            hidden: true, // hide screen icon
            mimeType: 'image/png', // used if format == image,
            onPixelDataFail: async function({ node, plugin, error, mapPane, domtoimageOptions }) {
                return plugin._getPixelDataOfNormalMap(domtoimageOptions)
            }
         }

        var screenshot = L.simpleMapScreenshoter(pluginOptions).addTo(map);
        let format = 'image'

        var bounds = new L.LatLngBounds();
        
        map.whenReady(() => {
            map.eachLayer(function(layer){
                setTimeout(function() {
                if(layer._layers){
                    Object.keys(layer._layers).forEach(key =>{
                        bounds.extend(layer._layers[key]._bounds);
                    })
                }
                try{
                    map.fitBounds(bounds);
                }catch(e){
                    console.log(e)
                }
            }, 0);
            });
        });
      
        console.log(bounds)

        setTimeout(() =>{
        screenshot.takeScreen(format).then(blob => {
            FileSaver.saveAs(blob, 'map.png')
        }).catch(e => {
            console.error(e)
        })
        console.log("png download");
        }, 500);

    },[store.communityPng]);    


    return (
        <></>
    )
}
export default CommunityScreenshot;