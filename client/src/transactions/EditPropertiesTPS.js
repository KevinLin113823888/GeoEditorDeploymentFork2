import jsTPS_Transaction from "../common/jsTPS"

/* * @author McKilla Gorilla
 * @author ?
 */
export default class EditPropertiesTPS extends jsTPS_Transaction {

    constructor(mappedData) {
        super();
        this.mappedData = mappedData
        this.store = this.mappedData.store
        this.type = this.mappedData.type
        this.oldPropertyValue = this.mappedData.oldPropertyValue
        this.newPropertyValue = this.mappedData.newPropertyValue
        this.propertyKey = this.mappedData.propertyKey
        this.mapDataFeatureIndex = this.mappedData.mapDataFeatureIndex
        this.editingMap =  this.mappedData.store.currentMapData.features[this.mapDataFeatureIndex]
    }

    doTransaction() {
        console.log('redo is called')
        if(this.type==="edit"){
                this.editingMap.properties[this.propertyKey] = this.newPropertyValue
        }
    }

    undoTransaction() {
        console.log("undo called")
        if(this.type==="edit"){
            this.editingMap.properties[this.propertyKey] = this.oldPropertyValue
        }
    }
}