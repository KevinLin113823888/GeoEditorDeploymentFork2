import React, { useState, useEffect, useRef,useContext } from 'react';
// import { CurrentModal, GlobalStoreContext } from "../../../store/index";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import "./legend.css"

function Legend(props) {
    // const { store } = useContext(GlobalStoreContext);

    const map = useMap();

    useEffect(() => {
        const legend = L.control({ position: "bottomright" });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            div.innerHTML = 
                 '<h4>This is the legend</h4>' + 
                 '<b>Lorem ipsum dolor sit amet consectetur adipiscing</b>';
            return div;
        }

        legend.addTo(map);
    }, []);
    
}

export default Legend;