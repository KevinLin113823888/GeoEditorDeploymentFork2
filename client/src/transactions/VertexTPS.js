import jsTPS_Transaction from "../common/jsTPS"

/* * @author McKilla Gorilla
 * @author ?
 */
export default class VertexTPS extends jsTPS_Transaction {

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
    }
    refreshState () {

        this.updateView()
        this.update()
        // this.setStore({
        //     ...this.store,
        //     currentMapData: this.store.currentMapData
        // })
    }

    doTransaction() {
        console.log("JSTPS for vertex changes")
        let features = this.store.currentMapData.features
        let before = JSON.parse(JSON.stringify(features))

        console.log(features)

        //this undo and redo actually works, its just that when we draw polygon, the polygon trails stays on the screen.
        if(this.type === "add"){
            this.newPolygon.properties.name = this.newRegionName
            // this.store.currentMapData.features.push(newPolygon)
            let lastFeatureIndex = features.length
            this.diffDelta = {
                [lastFeatureIndex]: [this.newPolygon],
                "_t": "a"
            }
        }
        console.log("result of the constructed delta.")
        console.log(JSON.stringify(this.diffDelta))


        let after = features
        console.log("result of the actual delta.")
        console.log(JSON.stringify(this.diff.diff(before,after)))

        this.diff.patch(features,this.diffDelta)
        this.refreshState()
    }

    undoTransaction() {
        console.log("undo transaction")

        this.diff.unpatch(this.store.currentMapData.features,this.diffDelta)
        this.refreshState()
    }
}