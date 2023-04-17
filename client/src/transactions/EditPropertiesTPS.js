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

        this.oldPropertyKeyIndex = -1;
        console.log(mappedData)
        this.state = mappedData.setPropertyObj


        this.oldKey = mappedData.oldKey
                console.log("as", this.state)

    }

    doTransaction() {
        console.log('redo is called')
        if(this.type==="edit"){
                this.oldPropertyValue = this.editingMap.properties[this.propertyKey]
                this.editingMap.properties[this.propertyKey] = this.newPropertyValue
        }
        else if(this.type==="delete"){

            // get the index of where the property is from.
            let propsObj = this.editingMap.properties
            let keyValues = Object.entries(propsObj); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]

            let objKeys = Object.keys(propsObj)
            this.oldPropertyKeyIndex=objKeys.indexOf(this.propertyKey)

            console.log(keyValues)
            console.log(this.oldPropertyKeyIndex)
            keyValues.splice(this.oldPropertyKeyIndex,1); // insert key value at the index you want like 1.
            this.editingMap.properties =   Object.fromEntries(keyValues)
        }
        else if(this.type==="add"){
            let propsObj = this.editingMap.properties
            let keyValues = Object.entries(propsObj); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
            keyValues.splice(0,0, ["newKey","newValue"]); // insert key value at the index you want like 1.
            this.editingMap.properties =   Object.fromEntries(keyValues)
            this.oldPropertyKeyIndex = 0;
        }

        else if (this.type === "keyEdit"){

            let propObj = this.editingMap.properties
            const newpropkey = this.propertyKey
            const oldpropkey = this.oldKey

            let newWordsObject = {};

            Object.keys(propObj).forEach(key => {
                if (key === oldpropkey) {
                    let newPair = { [newpropkey]: propObj[oldpropkey] };
                    newWordsObject = { ...newWordsObject, ...newPair }
                }
                else {
                    newWordsObject = { ...newWordsObject, [key]: propObj[key] }
                }
            });

            this.editingMap.properties = newWordsObject
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
            let propsObj = this.editingMap.properties
            let keyValues = Object.entries(propsObj); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
            keyValues.splice(this.oldPropertyKeyIndex,0, [this.propertyKey,this.oldPropertyValue]); // insert key value at the index you want like 1.
            this.editingMap.properties =   Object.fromEntries(keyValues)
        }
        else if(this.type==="add"){

            let propsObj = this.editingMap.properties
            let keyValues = Object.entries(propsObj); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
            keyValues.splice(this.oldPropertyKeyIndex,1); // insert key value at the index you want like 1.
            this.editingMap.properties =   Object.fromEntries(keyValues)
        }
        else if (this.type === "keyEdit"){
            let propObj = this.editingMap.properties
            const  oldpropkey= this.propertyKey
            const   newpropkey = this.oldKey

            let newWordsObject = {};

            Object.keys(propObj).forEach(key => {
                if (key === oldpropkey) {
                    let newPair = { [newpropkey]: propObj[oldpropkey] };
                    newWordsObject = { ...newWordsObject, ...newPair }
                }
                else {
                    newWordsObject = { ...newWordsObject, [key]: propObj[key] }
                }
            });

            this.editingMap.properties = newWordsObject
        }
        this.state({...this.store.currentMapData.features[this.store.currentFeatureIndex].properties})

    }
}