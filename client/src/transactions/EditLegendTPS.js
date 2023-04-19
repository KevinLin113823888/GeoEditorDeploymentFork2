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
        this.setStore({
                      ...this.store,
                      currentMapData: mapObj
                  })
    }

    doTransaction() {
        let mapObj = this.mapObj
        this.initGeojsonGraphicalData(mapObj)

        console.log("transac")
        if(this.type === "add"){
            console.log("add transact")
            // let before = JSON.parse(JSON.stringify(mapObj.graphicalData))
            // mapObj.graphicalData.legend.splice(0,0,{
            //     color: "#000000",
            //     legendText: "Default text",
            // })
            // this.oldIndex = 0


            this.diffObjDelta = {"legend":{"0":[{"color":"#000000","legendText":"Default text"}],"_t":"a"}}
            this.diff.patch(mapObj.graphicalData,this.diffObjDelta)

        }
        else if (this.type === "edit"){
            console.log("called to edit right here")
            mapObj.graphicalData.legend[this.oldIndex].legendText = this.newText
        }
        else if (this.type === "delete"){
            console.log("called to delete right here")

            let legendObj  = mapObj.graphicalData.legend[this.oldIndex]

            this.oldColor = legendObj.color
            this.oldText = legendObj.oldText

            mapObj.graphicalData.legend.splice(this.oldIndex,1)
        }
        else if (this.type === "color"){
            console.log("called to color right here")
            mapObj.graphicalData.legend[this.oldIndex].color = this.newColor

        }
        this.refreshState(mapObj)
    }

    undoTransaction() {
    let mapObj = this.mapObj
    if(this.type === "add"){
        // mapObj.graphicalData.legend.splice(this.oldIndex,1)
        this.diff.unpatch(mapObj.graphicalData,this.diffObjDelta)
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