
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
        var screenshot = L.simpleMapScreenshoter().addTo(map);
        let format = 'blob'
        // let overridedPluginOptions = {
        //     mimeType: 'image/jpeg'
        // }

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

        screenshot.takeScreen(format).then(blob => {
            console.log(blob);
            // const blobString = convertBlobToString(blob);
            const type = blob.type;

            // var a = document.createElement("a")
            // a.href = URL.createObjectURL(blob)
            // a.download = "screenshot.png"
            // a.click()

            const reader = new FileReader();
            // const base64String = "wd";
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64String = reader.result;
                fetch(process.env.REACT_APP_API_URL + 'map/setMapImageById', {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: props.mapCardId,
                        image: base64String,
                        type: type,
                    }),
                })
                .then((res) => {
                    res.json();
                }).then((data)=>{
                    console.log(data);
                })
                .catch(err => console.log(err));
            }
            // console.log(base64String, type)

            // fetch(process.env.REACT_APP_API_URL + 'map/setMapImageById', {
            //     method: "POST",
            //     credentials: 'include',
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({
            //         id: props.mapCardId,
            //         image: base64String,
            //         type: type,
            //     }),
            // })
            // .then((res) => {
            //     res.json();
            // }).then((data)=>{
            //     console.log(data);
            // })
            // .catch(err => console.log(err));
        }).catch(e => {
            console.error(e)
        })
        console.log("screenshot taken");

    },[store.setScreenshot]);

    async function convertBlobToString(blob){
        return await blob.text();
    }
         
    return (
        <></>
    )
}
export default Screenshoter;