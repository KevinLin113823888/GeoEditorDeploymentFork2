import { GlobalStoreContext } from '../store'
import React, { useContext, useEffect,useState } from 'react'

function Map() {
    const { store } = useContext(GlobalStoreContext);

    function postMap(event){
        let date = new Date()
        let title= "map1";
        let mapCard = {title:"map1",mapImages:"Image",
        classification:["hey","bob"],
        lastModifiedDate:date}
        let mapData = {type:"FeatureCollection",mapProperties:{color:"green"}}
    
        store.createMap(title,mapCard,mapData)
      }
    
    return(
      <div>
        <button onClick={postMap} type="submit" value="Create Map">Map</button>
      </div>
    )
}

export default Map;