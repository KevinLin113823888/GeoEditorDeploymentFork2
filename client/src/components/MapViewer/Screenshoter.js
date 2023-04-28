
import {SimpleMapScreenshoter} from 'leaflet-simple-map-screenshoter';
import { useMap } from 'react-leaflet';
import * as L from "leaflet";
import React, { useState, useEffect, useRef,useContext } from 'react';
import { CurrentModal, GlobalStoreContext } from "../../store/index"
import { Buffer } from "buffer";
// import FileSaver from 'file-saver';

function Screenshoter(props) {
    
    const { store } = useContext(GlobalStoreContext);

    const map = useMap();

    useEffect(() =>{
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
        //map.fitBounds(bounds);  
        
        // if(bounds){
        //     console.log(bounds)
        //     map.fitBounds(bounds);
        // }

        setTimeout(() =>{

        screenshot.takeScreen(format).then(blob => {
            // console.log("hello, this is screenshot");
            // const type = blob.type;
            const type = "image/png";
            // console.log(type)
            
            // const reader = new FileReader();
            // reader.readAsDataURL(blob);
            // reader.onloadend = () => {
            //     const base64String = reader.result;
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
            // }

        }).catch(e => {
            console.error(e)
        })
        console.log("screenshot taken");
        }, 500);

    },[store.setScreenshot]);

         
    return (
        <></>
    )
}
export default Screenshoter;