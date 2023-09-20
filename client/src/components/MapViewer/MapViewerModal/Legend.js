import React, { useState, useEffect, useRef,useContext } from 'react';
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import "./legend.css"

function Legend(props) {

    const map = useMap();
    let legends = props.data;

    useEffect(() => {
        const legend = L.control({ position: "bottomright" });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            let labels = [];

            for (let i = 0; i < legends.length; i++) {
                labels.push('<span class="dot" style="background-color:' + legends[i].color + '"></span> ' + legends[i].legendText);
            }
            console.log("Labels", labels);

            div.innerHTML = labels.join("<br>");
            return div;
        }

        legend.addTo(map);
    }, []);
    
}

export default Legend;