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

    }

    //check if the geojson contains graphicalData key and adds it if not
    initGeojsonGraphicalData (geoJsonObj) {
        //assign value only if undefined (does not exist)
        // console.log("called to init")
        geoJsonObj.graphicalData ??= {}
        geoJsonObj.graphicalData.backgroundColor ??= "#FFFFFF"
        geoJsonObj.graphicalData.textBoxList ??= []
        geoJsonObj.graphicalData.legend ??= []
    }
    //this is how we refresh and this should be in the index.js reducer
    //but i got lazy so its here instead
    refreshState (mapObj) {
        console.log("called to refresh i suppose")
        this.store.setCurrentMapData(mapObj)
        //we need to use this because we cant track use state dep on graphical data. textbostlist
        this.state([...mapObj.graphicalData.textBoxList])

    }

    doTransaction() {

        console.log("JSTPS ADD CALLED")
        let mapObj = this.mapObj
        this.initGeojsonGraphicalData(mapObj)

        let beforeTextBoxList = JSON.parse(JSON.stringify(mapObj.graphicalData.textBoxList))
        let textBoxlist = mapObj.graphicalData.textBoxList
        if(this.type === "add"){
            // let newTextBox = {
            //     overlayText:"HELLOTHERER",coords:{
            //         lat:this.textBoxCoord.lat,
            //         lng:this.textBoxCoord.lng}
            // }
            // textBoxlist.splice(0,0,newTextBox)
            this.diffDelta = {
                "0": [
                    {
                        "overlayText": "DEFAULT TEXT",
                        "coords": {
                            "lat": this.textBoxCoord.lat,
                            "lng": this.textBoxCoord.lng
                        }
                    }
                ],
                "_t": "a"
            }
        }
        // this.diffDelta = this.diff.diff(beforeTextBoxList,textBoxlist)
        // console.log("@@@@ this is our diff Delta")
        // console.log(this.diffDelta)
        this.diff.patch(mapObj.graphicalData.textBoxList,this.diffDelta)
        this.refreshState(mapObj)
    }

    undoTransaction() {
        let mapObj = this.mapObj
        if(this.type === "add"){
            this.diff.unpatch(mapObj.graphicalData,this.diffDelta)
        }

        this.refreshState(mapObj)
    }
}