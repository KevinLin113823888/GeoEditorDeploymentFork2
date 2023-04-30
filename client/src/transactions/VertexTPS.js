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

        this.sharedIndexPath=  mappedData.sharedIndexPath
        this.sharedBorderFeature = mappedData.sharedBorderFeature
        this.sharedIndexLoc = mappedData.sharedIndex

        let i=this.indexPath
        let vertexSinglePoly = this.editingFeature.geometry.coordinates[i[0]]
        let vertexMultiPoly = this.editingFeature.geometry.coordinates[i[0]][i[1]]
        this.vertexIndex = i[i.length-1]
        this.polygon = i.length===3?vertexMultiPoly:vertexSinglePoly

        this.ind = mappedData.ind

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
            if(this.sharedIndexPath!==null && this.sharedBorderFeature!==null){
                let j = this.sharedIndexPath
                if(j.length === 3)
                {
                    this.sharedBorderFeature.geometry.coordinates[j[0]][j[1]].splice(j[2],0,this.new2DVec)
                }
                else{
                    this.sharedBorderFeature.geometry.coordinates[j[0]].splice(j[1],0,this.new2DVec)

                }
            }
        }
        else if(this.type === "drag"){
            if(this.sharedBorderFeature!== null){
                let j = this.sharedIndexPath
                if(this.sharedIndexPath.length === 3)
                    this.sharedBorderFeature.geometry.coordinates[j[0]][j[1]][j[2]] = this.new2DVec
                else
                    this.sharedBorderFeature.geometry.coordinates[j[0]][j[1]] = this.new2DVec
            }
            this.oldVertex = this.polygon[this.vertexIndex]
            this.newVertex = this.new2DVec
            this.polygon[this.vertexIndex] = this.newVertex
        }
        else if(this.type === "delete"){
            this.oldVertex = this.polygon[this.vertexIndex]
            this.polygon.splice(this.vertexIndex,1)
            if(this.sharedIndexPath!==null && this.sharedBorderFeature!==null){
                let j = this.sharedIndexPath
                if(j.length === 3)
                    this.oldSharedVertex = this.sharedBorderFeature.geometry.coordinates[j[0]][j[1]].splice(j[2],1)[0]
                else
                    this.oldSharedVertex = this.sharedBorderFeature.geometry.coordinates[j[0]].splice(j[1],1)[0]
            }
        }
        this.refreshState()
    }

    undoTransaction() {
        if(this.type === "add"){
            this.polygon.splice(this.vertexIndex,1)
            if(this.sharedBorderFeature!==null){
                let j = this.sharedIndexPath
                if(j.length === 3)
                    this.sharedBorderFeature.geometry.coordinates[j[0]][j[1]].splice(j[2],1)
                else
                    this.sharedBorderFeature.geometry.coordinates[j[0]].splice(j[1],1)
            }
        }
        else if(this.type === "drag"){
            if(this.sharedBorderFeature!== null){
                let j = this.sharedIndexPath
                if(this.sharedIndexPath.length === 3)
                    this.sharedBorderFeature.geometry.coordinates[j[0]][j[1]][j[2]] = this.oldVertex
                else
                    this.sharedBorderFeature.geometry.coordinates[j[0]][j[1]] = this.oldVertex
            }
            this.polygon[this.vertexIndex] = this.oldVertex
        }
        else if(this.type === "delete"){
            this.polygon.splice(this.vertexIndex,0,this.oldVertex)
            if(this.sharedIndexPath!==null && this.sharedBorderFeature!==null){
                let j = this.sharedIndexPath
                if(j.length === 3)
                    this.sharedBorderFeature.geometry.coordinates[j[0]][j[1]].splice(j[2],0,this.oldSharedVertex)
                else
                    this.sharedBorderFeature.geometry.coordinates[j[0]].splice(j[1],0,this.oldSharedVertex)
            }


        }
        // console.log("after undo")
        // console.log(this.polygon)

        this.refreshState()
    }
}