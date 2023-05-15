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

        if(this.type === "remove"){
            console.log("removed called")
            let featureLst = this.store.currentMapData.features

            let deleteIndex = -1
            console.log("compare")
            for(let i=0;i<featureLst.length;i++){
                if(featureLst[i] == this.editingFeature){
                    deleteIndex = i
                    break;
                }
            }
            this.deleteIndex = deleteIndex
        }
    }
    refreshState () {

        // this.store.updateViewer()
        this.store.updateEditor()
        // this.updateView()
        // this.update()
    }

    doTransaction() {
        console.log("JSTPS for region changes")
        let features = this.store.currentMapData.features
        if(this.type === "add"){
            this.newPolygon.properties.name = this.newRegionName
            this.store.currentMapData.features.push(this.newPolygon)
            this.updateView()
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
        else if(this.type === "remove"){
            let featureLst = this.store.currentMapData.features

            this.deletedFeature = JSON.parse(JSON.stringify(featureLst[this.deleteIndex]))
            console.log("this is the one that got deleted ")
            console.log(this.deletedFeature)
            this.store.currentMapData.features.splice(this.deleteIndex,1)
            console.log("after")
            console.log(this.store.currentMapData.features)
        }
        this.refreshState()
    }

    undoTransaction() {
        console.log("undo")
        console.log(this.store.currentMapData.features)
        if(this.type === "add"){
            this.store.currentMapData.features.pop()
            this.updateView()
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
        else if(this.type === "remove"){
            this.store.currentMapData.features.splice(this.deleteIndex,0,this.deletedFeature)
        }
        this.refreshState()
    }
}