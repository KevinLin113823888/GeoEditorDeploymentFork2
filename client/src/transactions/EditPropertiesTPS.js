import jsTPS_Transaction from "../common/jsTPS"

/* * @author McKilla Gorilla
 * @author ?
 */
export default class EditPropertiesTPS extends jsTPS_Transaction {

    constructor(mappedData) {
        //
        super();
        this.mappedData = mappedData
        this.store = this.mappedData.store
        this.type = this.mappedData.type
        this.oldPropertyValue = this.mappedData.oldPropertyValue
        this.newPropertyValue = this.mappedData.newPropertyValue
        this.propertyKey = this.mappedData.propertyKey
        this.mapDataFeatureIndex = this.mappedData.mapDataFeatureIndex
        this.editingMap =  this.mappedData.store.currentMapData.features[this.mapDataFeatureIndex]

        console.log(mappedData)
        this.state = mappedData.setPropertyObj
        console.log("as", this.state)

    }

    doTransaction() {
        console.log('redo is called')
        if(this.type==="edit"){
                this.editingMap.properties[this.propertyKey] = this.newPropertyValue
        }
        else if(this.type==="delete"){
            // also the delete gets sent to the back
            delete this.editingMap.properties[this.propertyKey]
        }
        else if(this.type==="add"){
            this.editingMap.properties["untitled property"]= "untitled"
        }

        //this is our bandaid fix to the state problem,
        // we pass in the state that we want to rerender and we rerender it everytime
        // this also causes us to make a copy of the property evertime
        this.state({...this.store.currentMapData.features[this.store.currentFeatureIndex].properties})

    }

    undoTransaction() {
        console.log("undo called")
        if(this.type==="edit"){
            this.editingMap.properties[this.propertyKey] = this.oldPropertyValue
        }
        else if(this.type==="delete"){
            this.editingMap.properties[this.propertyKey]= this.oldPropertyValue
        }
        else if(this.type==="add"){
            delete this.editingMap.properties["untitled property"]
        }
        this.state({...this.store.currentMapData.features[this.store.currentFeatureIndex].properties})

    }
}