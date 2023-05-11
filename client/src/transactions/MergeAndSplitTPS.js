import jsTPS_Transaction from "../common/jsTPS"

/* * @author McKilla Gorilla
 * @author ?
 */
export default class MergeAndSplitTPS extends jsTPS_Transaction {

    constructor(mappedData) {
        super();
        this.mappedData = mappedData
        this.store = this.mappedData.store
        this.setStore = this.mappedData.setStore
        this.state = mappedData.state
        this.updateView = mappedData.updateView
        this.updateEditor = mappedData.updateEditor
        this.type = mappedData.type

            this.newRegion = mappedData.newRegion
            this.oldRegionIndex = mappedData.oldRegionIndex
        this.oldRegionList = []

        this.newName = mappedData.newName
        this.oldName = mappedData.oldName
    }

    refreshState () {
        console.log("called to update called")
        this.updateEditor()
    }

    doTransaction() {
        if(this.type === "merge") {
            console.log(this.oldRegionIndex)
            console.log(this.store.currentMapData.features)
            console.log(this.newRegion)

            for(let i=0;i<this.oldRegionIndex.length;i++){
                let index = this.oldRegionIndex[i]
                this.oldRegionList.push(JSON.parse(JSON.stringify(this.store.currentMapData.features[index])))
                this.store.currentMapData.features.splice(index,1)
            }
            this.store.currentMapData.features.splice(0,0,this.newRegion)
        }
        else if(this.type === "rename"){
            this.newRegion.properties.name = this.newName
        }
        this.refreshState()
    }

    undoTransaction() {

        if(this.type === "merge") {
            console.log("undo")
            this.store.currentMapData.features.splice(0,1)
            for(let i=this.oldRegionIndex.length-1;i>=0;i--){
                let index = this.oldRegionIndex[i]
                let oldRegion = this.oldRegionList[i]
                this.store.currentMapData.features.splice(index,0,oldRegion)
            }
        }
        else if(this.type === "rename"){
            this.newRegion.properties.name = this.oldName
        }
        this.refreshState()
    }
}