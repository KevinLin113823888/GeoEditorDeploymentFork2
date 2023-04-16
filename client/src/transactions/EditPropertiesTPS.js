import jsTPS_Transaction from "../common/jsTPS"

/* * @author McKilla Gorilla
 * @author ?
 */
export default class EditPropertiesTPS extends jsTPS_Transaction {

    constructor(initStore, type, newPropertyValue,mapDataFeatureIndex) {
        super();
        this.store = initStore;
        this.type = type
        // this.index = initIndex;
        // this.song = initSong;
    }

    doTransaction() {
        console.log('redo is called')
        if(this.type==="edit"){
            // this.store.currentMapData
        }
        // this.store.createSong(this.index, this.song);
    }

    undoTransaction() {
        console.log("undo called")
        // this.store.removeSong(this.index);
    }
}