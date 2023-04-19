import jsTPS_Transaction from "../common/jsTPS"

/* * @author McKilla Gorilla
 * @author ?
 */
export default class TextboxTPS extends jsTPS_Transaction {

    constructor(mappedData) {
        super();
        this.mappedData = mappedData
        this.store = this.mappedData.store
        this.setStore = this.mappedData.setStore
        this.type = this.mappedData.type
        this.mapObj =  this.mappedData.store.currentMapData

        this.newText = mappedData.newText
        this.oldText = mappedData.oldText

        this.textBoxCoord = mappedData.textBoxCoord
        this.diff =  require('jsondiffpatch')
        this.diffDelta = null;

        this.state = mappedData.state

        this.toolTip = mappedData.toolTip
        this.handleMapTextEdit = mappedData.handleMapTextEdit
    }

    //check if the geojson contains graphicalData key and adds it if not
    initGeojsonGraphicalData (geoJsonObj) {
        geoJsonObj.graphicalData ??= {}
        geoJsonObj.graphicalData.backgroundColor ??= "#FFFFFF"
        geoJsonObj.graphicalData.textBoxList ??= []
        geoJsonObj.graphicalData.legend ??= []
    }
    refreshState (mapObj) {
        console.log("called to refresh i suppose")
        console.log(mapObj)
        this.store.setCurrentMapData(mapObj)
        this.state([...mapObj.graphicalData.textBoxList])
    }

    doTransaction() {

        console.log("JSTPS ADD CALLED")
        let mapObj = this.mapObj
        this.initGeojsonGraphicalData(mapObj)

        let textBoxlist = mapObj.graphicalData.textBoxList
        if(this.type === "add"){
            let newTextBox = {
                overlayText:"HELLOTHERER",coords:{
                    lat:this.textBoxCoord.lat,
                    lng:this.textBoxCoord.lng}
            }
            textBoxlist.splice(0,0,newTextBox)
        }
        this.refreshState(mapObj)

        console.log("this after the changes for the map obj")
        console.log(mapObj.graphicalData.textBoxList)

    }

    undoTransaction() {
        let mapObj = this.mapObj
        console.log("this is for the map obj")
        // console.log(this.mapObj)

        console.log(mapObj.graphicalData.textBoxList)

        if(this.type === "add"){
            mapObj.graphicalData.textBoxList.splice(0,1)
            // this.changeMapFunc(toolTip,"delete")
        }

        // console.log(mapObj.graphicalData.textBoxList)
        this.refreshState(mapObj)
    }
}