import jsTPS_Transaction from "../common/jsTPS"

/* * @author McKilla Gorilla
 * @author ?
 */
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

        this.updateView()
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
            console.log("drag region called")
            console.log(this.editingFeature)
            let poly = this.editingFeature
            //TODO: we just basically have to update the coordinates by the dx and dy by adding them for every single one
            // for(let i=0;i<)
        }
        this.refreshState()
    }

    undoTransaction() {
        console.log("undo")
        console.log(this.store.currentMapData.features)
        if(this.type === "add"){
            this.store.currentMapData.features.pop()
        }
        this.refreshState()
    }
}