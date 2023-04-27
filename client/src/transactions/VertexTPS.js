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


            this.polygon=mappedData.polygon
            this.index=mappedData.index
            this.editingFeature=mappedData.editingFeature
        this.new2DVec = mappedData.new2DVec

        this.diff =  require('jsondiffpatch')
        this.diffDelta = null;
    }
    refreshState () {

        // this.updateView()
        this.update()
        // this.setStore({
        //     ...this.store,
        //     currentMapData: this.store.currentMapData
        // })
    }

    doTransaction() {
        // console.log("JSTPS for vertex changes")
        //
        // console.log(this.polygon)
        // console.log(this.index)

        // let features = this.store.currentMapData.features
        let before = JSON.parse(JSON.stringify(this.polygon))

        console.log(before)
        if(this.type === "add"){
            //not only do we need to add, we also need to account for the previous few
            let prev = this.polygon[this.index-1]
            let next = this.polygon[this.index+1]
            // prev[0] = this.new2DVec[0]
            // next[1] = this.new2DVec[1]
            this.polygon.splice(this.index,0,this.new2DVec)

            console.log("this for add")
            console.log(prev)
            console.log(next)
            console.log(this.polygon[this.index])

            this.polygon = [
                [
                    -99.49218749999999,
                    -11.867350911459294
                ],
                [
                    24.960937499999996,
                    -11.867350911459294
                ],
                [
                    24.9609375,
                    20.632784250388028
                ],
                [
                    24.960937499999996,
                    47.517200697839414
                ],
                [
                    -6.152343750000001,
                    47.517200697839414
                ],
                [
                    -37.265624999999986,
                    47.517200697839414
                ],
                [
                    -68.37890624999997,
                    47.517200697839414
                ],
                [
                    -99.49218749999999,
                    47.517200697839414
                ],
                [
                    -99.49218749999999,
                    -11.867350911459294
                ]
            ]
            // this.polygon[this.index] = this.new2DVec
        }
        //
        // console.log(features)
        //
        // //this undo and redo actually works, its just that when we draw polygon, the polygon trails stays on the screen.
        // if(this.type === "add"){
        //     this.newPolygon.properties.name = this.newRegionName
        //     // this.store.currentMapData.features.push(newPolygon)
        //     let lastFeatureIndex = features.length
        //     this.diffDelta = {
        //         [lastFeatureIndex]: [this.newPolygon],
        //         "_t": "a"
        //     }
        // }
        // console.log("result of the constructed delta.")
        // console.log(JSON.stringify(this.diffDelta))
        //
        //
        let after = this.polygon
        // console.log("result of the actual delta.")
        this.diffDelta = this.diff.diff(before,after)
        // console.log(this.diffDelta)
        console.log("after do add")
        console.log(after)
        //
        // this.diff.patch(features,this.diffDelta)
        this.refreshState()
    }

    undoTransaction() {
        console.log("after undo add")
        let res = this.diff.unpatch(this.polygon,this.diffDelta)
        console.log(res)
        console.log(this.polygon)

        this.refreshState()
    }
}