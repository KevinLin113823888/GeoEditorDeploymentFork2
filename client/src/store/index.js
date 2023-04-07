import { createContext, useContext, useState } from 'react'

import api from './store-request-api'

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_MODAL: "CHANGE_MODAL",
    SET_CURRENT_MAP:"SET_CURRENT_MAP",
    UPDATE_CURRENT_MAPDATA:"UPDATE_CURRENT_MAPDATA",
    CHANGE_SCREEN:"CHANGE_SCREEN",
    SET_GUEST_MODE:"SET_GUEST_MODE",
    SET_ADMIN_MODE:"SET_ADMIN_MODE",
    UPDATE_USER_MAP_CARDS:"UPDATE_USER_MAP_CARDS"
}

export const CurrentModal = {
    NONE:"NONE",
    DELETE_ACCOUNT:"DELETE_ACCOUNT",
    NEW_MAP_NAME:"NEW_MAP_NAME",
    COMMUNITY_PREVIEW_FORK: "COMMUNITY_PREVIEW_FORK",
    COMMUNITY_PREVIEW_DOWNLOAD: "COMMUNITY_PREVIEW_DOWNLOAD",
    COMMUNITY_PREVIEW_REPORT: "COMMUNITY_PREVIEW_REPORT",
    COMMUNITY_PREVIEW_BAN: "COMMUNITY_PREVIEW_BAN",
    MAP_MERGE_REGION_NAME: "MAP_MERGE_REGION_NAME",
    MAP_PICK_COLOR_WHEEL: "MAP_PICK_COLOR_WHEEL",
    MAP_EXPORT: "MAP_EXPORT",
    MAP_IMPORT: "MAP_IMPORT",
    MAP_CLASSIFICATION: "MAP_CLASSIFICATION",
    CREATE_NEW_MAP: "CREATE_NEW_MAP",
    COMMUNITY_PREVIEW_MODAL: "COMMUNITY_PREVIEW_MODAL"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        currentMap: {},
        currentMapData : {}, //the current map data we are editing
        currentScreen: "home" ,
        guestMode: false,
        adminMode: false,
        userMapCards: [{}],
    });
    
    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    // const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_MODAL: {
                return setStore({
                    currentModal : payload,
                    currentMap: store.currentMap,
                    currentMapData : store.currentMapData, //the current map data we are editing
                    currentScreen: store.currentScreen ,
                    guestMode: store.guestMode,
                    adminMode: store.adminMode,
                    userMapCards: store.userMapCards,
                });
            }
            case GlobalStoreActionType.NEW_MAP_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentMap: payload,
                    currentMapData : store.currentMapData, //the current map data we are editing
                    currentScreen: store.currentScreen ,
                    guestMode: store.guestMode,
                    adminMode: store.adminMode,
                    userMapCards: store.userMapCards,
                });
            }
            case GlobalStoreActionType.SET_CURRENT_MAP: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentMap:  payload,
                    currentMapData : store.currentMapData, //the current map data we are editing
                    currentScreen: store.currentScreen ,
                    guestMode: store.guestMode,
                    adminMode: store.adminMode,
                    userMapCards: store.userMapCards,
                });
            }
            case GlobalStoreActionType.UPDATE_CURRENT_MAPDATA: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentMap:  payload,
                    currentMapData : store.currentMapData, //the current map data we are editing
                    currentScreen: store.currentScreen ,
                    guestMode: store.guestMode,
                    adminMode: store.adminMode,
                    userMapCards: store.userMapCards,
                });
            }
            case GlobalStoreActionType.UPDATE_USER_MAP_CARDS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentMap:  payload,
                    currentMapData : store.currentMapData, //the current map data we are editing
                    currentScreen: store.currentScreen ,
                    guestMode: store.guestMode,
                    adminMode: store.adminMode,
                    userMapCards: payload,
                });
            }
            default:
                return store;
        }
    }

     // THIS FUNCTION CREATES A NEW LIST
    store.createMap = function (mapTitle,mapCardData,mapData) {
        async function asyncCreateMap(mapTitle,mapCardData,mapData){
       
        const response = await api.createMap(mapTitle,mapCardData,mapData);
        
        if (response.status === 201) {
            
            let newMap = response.data.map;
        
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_MAP,
                payload: newMap
            }
            );

        
            //history.push("/playlist/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
      }
      asyncCreateMap(mapTitle);
    }
    
    store.getUserMapCards = function (){

    }

    store.changeModal= function(modal){
        storeReducer({
            type: GlobalStoreActionType.CHANGE_MODAL,
            payload: modal
        }
        );
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };