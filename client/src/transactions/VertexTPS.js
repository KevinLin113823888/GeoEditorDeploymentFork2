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


            // this.polygon=mappedData.polygon
            this.index=mappedData.index
            this.editingFeature=mappedData.editingFeature
        this.new2DVec = mappedData.new2DVec

        this.indexPath = mappedData.indexPath

        this.diff =  require('jsondiffpatch')
        this.diffDelta = null;


        let i=this.indexPath
        let vertexSinglePoly = this.editingFeature.geometry.coordinates[i[0]]
        let vertexMultiPoly = this.editingFeature.geometry.coordinates[i[0]][i[1]]
        this.vertexIndex = i[i.length-1]
        this.polygon = i.length===3?vertexMultiPoly:vertexSinglePoly
    }
    refreshState () {

        let i=this.indexPath
        if(i.length===3)            //multi polygon
            this.editingFeature.geometry.coordinates[i[0]][i[1]] = this.polygon
        else            //single polygon
            this.editingFeature.geometry.coordinates[i[0]] = this.polygon
        // this.updateView()
        this.update()
    }

    doTransaction() {

        if(this.type === "add"){
            this.polygon.splice(this.vertexIndex,0,this.new2DVec)
        }
        else if(this.type === "drag"){
            this.oldVertex = this.polygon[this.vertexIndex]
            this.newVertex = this.new2DVec
            this.polygon[this.vertexIndex] = this.newVertex
        }
        else if(this.type === "delete"){
            this.oldVertex = this.polygon[this.vertexIndex]
            this.polygon.splice(this.vertexIndex,1)
        }
        // console.log("after do")
        // console.log(this.polygon)
        this.refreshState()
    }

    undoTransaction() {
        if(this.type === "add"){
            this.polygon.splice(this.vertexIndex,1)
        }
        else if(this.type === "drag"){
            this.polygon[this.vertexIndex] = this.oldVertex
        }
        else if(this.type === "delete"){
            this.polygon.splice(this.vertexIndex,0,this.oldVertex)
        }
        // console.log("after undo")
        // console.log(this.polygon)

        this.refreshState()
    }
}