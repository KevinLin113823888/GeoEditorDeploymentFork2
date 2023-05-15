import jsTPS_Transaction from "../common/jsTPS"

/* * @author McKilla Gorilla
 * @author ?
 */
export default class ColorTPS extends jsTPS_Transaction {

    constructor(mappedData) {
        super();
        this.mappedData = mappedData
        this.store = this.mappedData.store
        this.setStore = this.mappedData.setStore
        this.state = mappedData.state
        this.updateView = mappedData.updateView
        this.updateEditor = mappedData.updateEditor
        this.type = mappedData.type
            this.oldColor=  mappedData.oldColor
            this.newColor=  mappedData.newColor
        this.featureIndex = mappedData.featureIndex

    }
    refreshState () {
        this.store.updateEditor()
    }

    doTransaction() {
        if(this.type === "bg"){
            this.store.currentMapData.graphicalData.backgroundColor = this.newColor
            this.store.updateMapContainer()
        }
        else if(this.type === "subRegionColor" || this.type === "borderColor"){
            for(let i=0;i<this.featureIndex.length;i++){
                this.store.currentMapData.features[
                    this.featureIndex[i]
                    ][this.type] = this.newColor
            }
        }
        this.refreshState()
    }
    undoTransaction() {
        if(this.type === "bg"){
            this.store.currentMapData.graphicalData.backgroundColor = this.oldColor
            this.store.updateMapContainer()
        }
        else if(this.type === "subRegionColor" || this.type === "borderColor"){
            for(let i=0;i<this.featureIndex.length;i++){
                this.store.currentMapData.features[
                    this.featureIndex[i]
                    ][this.type] = this.oldColor
            }
        }
        this.refreshState()
    }
}