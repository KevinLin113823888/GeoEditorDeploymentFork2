
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
        console.log('setscreenshot screen', store.setScreenshot)

        if(!store.setScreenshot){
            return
        }
        store.takeScreenShot(false);
        store.setScreenshot = false;

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

            const type = "image/png";
            
            fetch(process.env.REACT_APP_API_URL + 'map/setMapImageById', {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: props.mapCardId,
                    image: blob,
                    type: type,
                }),
            })
            .then((res) => {
                res.json();
            }).then((data)=>{
                console.log(data);
            })
            .catch(err => console.log(err));

        }).catch(e => {
            console.error(e)
        })
        console.log("screenshot taken");
        }, 500);

    },[store.setScreenshot]);

    useEffect(() =>{
        console.log('center screen', store.setCenterScreen)
        if(!store.setCenterScreen){
            return
        }
        store.centerScreen(false);
        store.setCenterScreen = false;

        var bounds = new L.LatLngBounds();
        
        map.whenReady(() => {
            map.eachLayer(function(layer){
                console.log("aaa")
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
    },[store.setCenterScreen]);

    useEffect(() =>{
        // console.log('download png screen', store.downloadPng)

        if(!store.downloadPng){
            return
        }
        store.setDownloadPng(false);
        store.downloadPng = false;

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

    },[store.downloadPng]);    


    return (
        <></>
    )
}
export default Screenshoter;