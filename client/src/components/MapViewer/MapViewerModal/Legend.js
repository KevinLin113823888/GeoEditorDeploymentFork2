import React, { useState, useEffect, useRef,useContext } from 'react';
// import { CurrentModal, GlobalStoreContext } from "../../../store/index";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import "./legend.css"

function Legend(props) {
    // const { store } = useContext(GlobalStoreContext);

    const map = useMap();
    let legends = props.data;
    console.log("LEGEND", legends);

    useEffect(() => {
        const legend = L.control({ position: "bottomleft" });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            let labels = [];

            for (let i = 0; i < legends.length; i++) {
                console.log("LEGGEND", legends[i]);
                labels.push('<span class="dot" style="background-color:' + legends[i].color + '"></span> ' + legends[i].legendText);
            }
            console.log("Labels", labels);

            div.innerHTML = labels.join("<br>");
            // div.innerHTML = "<div>HIIIIIIII</div>"
            return div;
        }

        legend.addTo(map);
    }, []);
    
}

export default Legend;