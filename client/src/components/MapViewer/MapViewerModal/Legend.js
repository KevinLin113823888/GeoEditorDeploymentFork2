import React, { useState, useEffect, useRef,useContext } from 'react';
// import { CurrentModal, GlobalStoreContext } from "../../../store/index";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import "./legend.css"

function Legend(props) {
    // const { store } = useContext(GlobalStoreContext);

    const map = useMap();
    let legend = props.data;

    useEffect(() => {
        const legend = L.control({ position: "bottomright" });

        console.log("FUCKKKKKK", legend);

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            let labels = [];

            for (let i = 0; i < legend.length; i++) {
                labels.push('<i style="background:' + legend[i].color + '><i/> ' + legend[i].legendText);
            }

            div.innerHTML = labels.join("<br>");
            return div;
        }

        legend.addTo(map);
    }, []);
    
}

export default Legend;