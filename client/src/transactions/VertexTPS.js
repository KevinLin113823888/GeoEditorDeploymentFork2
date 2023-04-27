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

        //what we are doing is we take the polygon we are working with and storing it back onto the geojson file
        if(i.length===3)            //multi polygon
            this.editingFeature.geometry.coordinates[i[0]][i[1]] = this.polygon
        else            //single polygon
            this.editingFeature.geometry.coordinates[i[0]] = this.polygon
        // this.updateView()
        this.update()
    }

    doTransaction() {

        let polygon = this.polygon
        let vertexIndex = this.vertexIndex

        let before = JSON.parse(JSON.stringify(polygon))
        if(this.type === "add"){
            // let coords = [[-99.49218749999999,-11.867350911459294],[100.960937499999996,-11.867350911459294],[24.9609375,20.632784250388028],[24.960937499999996,47.517200697839414],[-6.152343750000001,47.517200697839414],[-37.265624999999986,47.517200697839414],[-68.37890624999997,47.517200697839414],[-99.49218749999999,47.517200697839414],[-99.49218749999999,-11.867350911459294]]
            polygon.splice(vertexIndex,0,this.new2DVec)
        }

        this.diffDelta = this.diff.diff(before,polygon)
        this.refreshState()
    }

    undoTransaction() {
        this.diff.unpatch( this.polygon,this.diffDelta)
        this.refreshState()
    }
}