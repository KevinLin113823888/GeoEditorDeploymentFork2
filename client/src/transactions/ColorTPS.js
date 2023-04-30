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

    }
    refreshState () {

        this.updateView()
        this.updateEditor()
    }

    doTransaction() {
        if(this.type === "bg"){
            this.store.currentMapData.graphicalData.backgroundColor = this.newColor
        }
        this.refreshState()
    }
    undoTransaction() {
        if(this.type === "bg"){
            this.store.currentMapData.graphicalData.backgroundColor = this.oldColor
        }
    }
}