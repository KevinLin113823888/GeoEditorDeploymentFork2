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
    UPDATE_USER_MAP_CARDS:"UPDATE_USER_MAP_CARDS",
    SET_HOME: "SET_HOME",
    SET_REGION_PROPERTIES:"SET_REGION_PROPERTIES",
    UPDATE_FEATURE_INDEX:"UPDATE_FEATURE_INDEX",
    SET_ZOOM: "SET_ZOOM"
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
    MAP_ADD_REGION_NAME: "MAP_ADD_REGION_NAME",
    MAP_PICK_COLOR_WHEEL: "MAP_PICK_COLOR_WHEEL",
    MAP_EXPORT: "MAP_EXPORT",
    MAP_IMPORT: "MAP_IMPORT",
    MAP_CLASSIFICATION: "MAP_CLASSIFICATION",
    CREATE_NEW_MAP: "CREATE_NEW_MAP",
    COMMUNITY_PREVIEW_MODAL: "COMMUNITY_PREVIEW_MODAL",
    COPY_MAP: "COPY_MAP",
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
        currentRegionProp:{}, 
        currentFeatureIndex:0,
        zoomLevel:2,
        centerCoords:[20,100]
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
                    currentRegionProp: store.currentRegionProp, 
                    currentFeatureIndex: 0,
                    zoomLevel:store.zoomLevel,
                    centerCoords:store.centerCoords
                    
                });
            }
            case GlobalStoreActionType.CHANGE_SCREEN: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentMap: store.currentMap,
                    currentMapData : store.currentMapData, //the current map data we are editing
                    currentScreen: payload ,
                    guestMode: store.guestMode,
                    adminMode: store.adminMode,
                    userMapCards: store.userMapCards,
                    currentRegionProp: store.currentRegionProp, 
                    currentFeatureIndex: 0,
                    zoomLevel:store.zoomLevel,
                    centerCoords:store.centerCoords
                });
            }
            case GlobalStoreActionType.NEW_MAP_NAME: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentMap: payload,
                    currentMapData : store.currentMapData, //the current map data we are editing
                    currentScreen: store.currentScreen ,
                    guestMode: store.guestMode,
                    adminMode: store.adminMode,
                    userMapCards: store.userMapCards,
                    currentRegionProp: store.currentRegionProp, 
                    currentFeatureIndex: 0,
                    zoomLevel:store.zoomLevel,
                    centerCoords:store.centerCoords
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
                    currentRegionProp: store.currentRegionProp, 
                    currentFeatureIndex: 0,
                    zoomLevel:store.zoomLevel,
                    centerCoords:store.centerCoords
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
                    currentRegionProp: store.currentRegionProp, 
                    currentFeatureIndex: store.currentFeatureIndex,
                    zoomLevel:store.zoomLevel,
                    centerCoords:store.centerCoords
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
                    currentRegionProp: store.currentRegionProp, 
                    currentFeatureIndex: store.currentFeatureIndex,
                    zoomLevel:store.zoomLevel,
                    centerCoords:store.centerCoords
                });
            }
            case GlobalStoreActionType.SET_GUEST_MODE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentMap:  store.currentMap,
                    currentMapData : store.currentMapData, //the current map data we are editing
                    currentScreen: payload.screen ,
                    guestMode: payload.guest,
                    adminMode: store.adminMode,
                    userMapCards: store.userMapCards,
                    currentRegionProp: store.currentRegionProp, 
                    currentFeatureIndex: store.currentFeatureIndex,
                    zoomLevel:store.zoomLevel,
                    centerCoords:store.centerCoords
                });
            }
            case GlobalStoreActionType.SET_HOME: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentMap: store.currentMap,
                    currentMapData : store.currentMapData, //the current map data we are editing
                    currentScreen: "home" ,
                    guestMode: false,
                    adminMode: store.adminMode,
                    userMapCards: store.userMapCards,
                    currentRegionProp: store.currentRegionProp, 
                    currentFeatureIndex: store.currentFeatureIndex,
                    zoomLevel:store.zoomLevel,
                    centerCoords:store.centerCoords
                });
            }
            case GlobalStoreActionType.SET_REGION_PROPERTIES: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentMap:  store.currentMap,
                    currentMapData : store.currentMapData, //the current map data we are editing
                    currentScreen: store.currentScreen ,
                    guestMode: store.guestMode,
                    adminMode: store.adminMode,
                    userMapCards: store.userMapCards,
                    currentRegionProp: payload, 
                    currentFeatureIndex: store.currentFeatureIndex,
                    zoomLevel:store.zoomLevel,
                    centerCoords:store.centerCoords
                });
            }
            case GlobalStoreActionType.UPDATE_FEATURE_INDEX: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentMap:  store.currentMap,
                    currentMapData : store.currentMapData, //the current map data we are editing
                    currentScreen: store.currentScreen ,
                    guestMode: store.guestMode,
                    adminMode: store.adminMode,
                    userMapCards: store.userMapCards,
                    currentRegionProp: store.currentRegionProp, 
                    currentFeatureIndex: payload,
                    zoomLevel:store.zoomLevel,
                    centerCoords:store.centerCoords

                });
            }
            case GlobalStoreActionType.SET_ZOOM: {
                return setStore({
                    currentModal : CurrentModal.MAP_ADD_REGION_NAME,
                    currentMap:  store.currentMap,
                    currentMapData : store.currentMapData, //the current map data we are editing
                    currentScreen: store.currentScreen ,
                    guestMode: store.guestMode,
                    adminMode: store.adminMode,
                    userMapCards: store.userMapCards,
                    currentRegionProp: store.currentRegionProp, 
                    currentFeatureIndex: store.currentFeatureIndex,
                    zoomLevel:payload.zoom,
                    centerCoords:payload.center

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
    store.changeScreen= function(screen){
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SCREEN,
            payload: screen
        }
        );
    }
    store.setGuest= function(guest,screen){
        storeReducer({
            type: GlobalStoreActionType.SET_GUEST_MODE,
            payload: {guest:guest,
                      screen:screen
                    }
        }
        );
    }
    store.setHome=function(){
        storeReducer({
            type: GlobalStoreActionType.SET_HOME,
            payload: {
                    }
        }
        );
    }
    store.setRegionProperties=function(properties){
        storeReducer({
            type: GlobalStoreActionType.SET_REGION_PROPERTIES,
            payload: properties
        }
        );
    }
    store.setCurrentFeatureIndex=function(index){
        storeReducer({
            type: GlobalStoreActionType.UPDATE_FEATURE_INDEX,
            payload: index
        }
        );
    }
    store.setZoomLevel=function(zoom,center){
        storeReducer({
            type: GlobalStoreActionType.SET_ZOOM,
            payload: {
                zoom:zoom,
                center:center
            }
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