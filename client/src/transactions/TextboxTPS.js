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
        this.index = mappedData.index
    }

    //check if the geojson contains graphicalData key and adds it if not
    // initGeojsonGraphicalData (geoJsonObj) {
    //     geoJsonObj.graphicalData ??= {}
    //     geoJsonObj.graphicalData.backgroundColor ??= "#FFFFFF"
    //     geoJsonObj.graphicalData.textBoxList ??= []
    //     geoJsonObj.graphicalData.legend ??= []
    // }
    refreshState (mapObj) {
        console.log("called to refresh i suppose")
        console.log(mapObj)
        this.store.setCurrentMapData(mapObj)
        this.state([...mapObj.graphicalData.textBoxList])
    }

    doTransaction() {

        console.log("JSTPS ADD CALLED")
        let textBoxlist = this.mapObj.graphicalData.textBoxList
        let before = JSON.parse(JSON.stringify(textBoxlist))

        if(this.type === "add"){
            let newTextBox = {
                overlayText:"TextBox",coords:{
                    lat:this.textBoxCoord.lat,
                    lng:this.textBoxCoord.lng}
            }
            textBoxlist.push(newTextBox)
        }
        else if(this.type === "edit"){
            let tb = textBoxlist[this.index]
            tb.overlayText = this.newText
        }
        else if(this.type === "move"){
            let tb = textBoxlist[this.index]
            tb.coords = this.textBoxCoord
        }
        else if(this.type === "delete"){
            textBoxlist.splice(this.index,1)
        }

        let after = textBoxlist
        this.diffDelta = this.diff.diff(before,after)
        this.refreshState(this.mapObj)
    }

    undoTransaction() {
        this.diff.unpatch(this.mapObj.graphicalData.textBoxList,this.diffDelta)
        // console.log("after applying mapObj delta")
        // console.log(mapObj.graphicalData.textBoxList)

        this.refreshState(this.mapObj)
    }
}