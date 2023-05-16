import jsTPS_Transaction from "../common/jsTPS"

/* * @author McKilla Gorilla
 * @author ?
 */
export default class EditLegendTPS extends jsTPS_Transaction {

    constructor(mappedData) {
        //
        super();
        this.mappedData = mappedData
        this.store = this.mappedData.store
        this.setStore = this.mappedData.setStore
        this.type = this.mappedData.type
        this.mapObj =  this.mappedData.store.currentMapData
        this.oldIndex = mappedData.oldIndex

        this.newText = mappedData.newText
        this.oldText = mappedData.oldText

        this.oldColor = mappedData.oldColor
        this.newColor = mappedData.newColor
        this.diff =  require('jsondiffpatch')
    }

    //check if the geojson contains graphicalData key and adds it if not
    initGeojsonGraphicalData (geoJsonObj) {
        //assign value only if undefined (does not exist)
        // console.log("called to init")
        geoJsonObj.graphicalData ??= {}
        geoJsonObj.graphicalData.backgroundColor ??= "#FFFFFF"
        geoJsonObj.graphicalData.textBox ??= []
        geoJsonObj.graphicalData.legend ??= []
    }
    //this is how we refresh and this should be in the index.js reducer
    //but i got lazy so its here instead
    refreshState (mapObj) {
        console.log("called to refresh i suppose")
        this.store.setCurrentMapData(mapObj)
        this.store.updateMapContainer()
        }

    doTransaction() {
        let mapObj = this.mapObj
        console.log("what do transaction is this?", this.type)

        if(this.type === "add"){
            mapObj.graphicalData.legend.splice(0,0,{
                color: "#000000",
                legendText: "Default text",
            })
            this.oldIndex = 0
        }
        else if (this.type === "edit"){
            mapObj.graphicalData.legend[this.oldIndex].legendText = this.newText
        }
        else if (this.type === "delete"){
            let legendObj  = mapObj.graphicalData.legend[this.oldIndex]

            // this.oldColor = legendObj.color
            // this.oldText = legendObj.oldText

            mapObj.graphicalData.legend.splice(this.oldIndex,1)
        }
        else if (this.type === "color"){
            console.log(this.newColor)
            // console.log(this.oldColor)
            this.oldColor = mapObj.graphicalData.legend[this.oldIndex].color
            mapObj.graphicalData.legend[this.oldIndex].color = this.newColor
        }


        this.refreshState(mapObj)
    }

    undoTransaction() {
    let mapObj = this.mapObj

        console.log("what undo transaction is this?", this.type)

        if(this.type === "add"){
        mapObj.graphicalData.legend.splice(this.oldIndex,1)
        }
    else if (this.type === "edit"){
        mapObj.graphicalData.legend[this.oldIndex].legendText  = this.oldText
    }
    else if (this.type === "delete"){
        mapObj.graphicalData.legend.splice(this.oldIndex,0,{
            color: this.oldColor,
            legendText: this.oldText,
        })
    }
    else if (this.type === "color"){
        mapObj.graphicalData.legend[this.oldIndex].color = this.oldColor
    }
    this.refreshState(mapObj)
    }
}