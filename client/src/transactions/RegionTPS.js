import jsTPS_Transaction from "../common/jsTPS"

/* * @author McKilla Gorilla
 * @author ?
 */
import * as turf from '@turf/turf'

export default class RegionTPS extends jsTPS_Transaction {

    constructor(mappedData) {
        super();
        this.mappedData = mappedData
        this.store = this.mappedData.store
        this.setStore = this.mappedData.setStore
        this.state = mappedData.state
        this.index = mappedData.index
        this.updateView = mappedData.updateView
        this.update = mappedData.update
        this.type = mappedData.type
        this.newRegionName = mappedData.newRegionName
        this.newPolygon = mappedData.newPolygon

        this.diff =  require('jsondiffpatch')
        this.diffDelta = null;


        this.editingFeature = mappedData.editingFeature
        this.dx = mappedData.dx
        this.dy = mappedData.dy
    }
    refreshState () {

        // this.updateView()
        this.update()
    }

    doTransaction() {
        console.log("JSTPS for region changes")
        let features = this.store.currentMapData.features
        if(this.type === "add"){
            this.newPolygon.properties.name = this.newRegionName
            this.store.currentMapData.features.push(this.newPolygon)
        }
        else if(this.type === "dragRegion"){
            let firstCoord = this.editingFeature.geometry.coordinates //for single polygons.... god damn it
            if(this.editingFeature.geometry.type === "Polygon")
                firstCoord = [firstCoord]
            for(let i = 0; i<firstCoord.length;i++) {
                let multiPolygon = firstCoord[i]
                for(let j=0;j<multiPolygon.length;j++){
                    let polygon = multiPolygon[j]
                    for(let k=0;k<polygon.length;k++){
                        let vec2D= polygon[k]
                        vec2D[0]+=this.dx
                        vec2D[1]+=this.dy
                    }
                }
            }
            if(this.editingFeature.geometry.type === "Polygon")
                firstCoord = firstCoord[0]
            this.editingFeature.geometry.coordinates =firstCoord
        }
        this.refreshState()
    }

    undoTransaction() {
        console.log("undo")
        console.log(this.store.currentMapData.features)
        if(this.type === "add"){
            this.store.currentMapData.features.pop()
        }
        else if(this.type === "dragRegion"){
            let firstCoord = this.editingFeature.geometry.coordinates //for single polygons.... god damn it
            if(this.editingFeature.geometry.type === "Polygon")
                firstCoord = [firstCoord]
            for(let i = 0; i<firstCoord.length;i++) {
                let multiPolygon = firstCoord[i]
                for(let j=0;j<multiPolygon.length;j++){
                    let polygon = multiPolygon[j]
                    for(let k=0;k<polygon.length;k++){
                        let vec2D= polygon[k]
                        vec2D[0]-=this.dx
                        vec2D[1]-=this.dy
                    }
                }
            }
            if(this.editingFeature.geometry.type === "Polygon")
                firstCoord = firstCoord[0]
            this.editingFeature.geometry.coordinates =firstCoord
        }
        this.refreshState()
    }
}