import { createContext, useContext, useState } from 'react'

import api from './store-request-api'
import jsTPS from '../common/jsTPS'
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
    SET_ZOOM: "SET_ZOOM",
    SET_ADD_REGION: "SET_ADD_REGION",
    SET_PREVIEW_ID: "SET_PREVIEW_ID",
    SET_CURRENT_MAPCARD_ID: "SET_CURRENT_MAPCARD_ID",
    SET_SCREENSHOT: "SET_SCREENSHOT",
    SET_CENTER_SCREEN: "SET_CENTER_SCREEN",
    DOWNLOAD_PNG: "DOWNLOAD_PNG",
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
    SUBREGION_PICK_COLOR_WHEEL: "SUBREGION_PICK_COLOR_WHEEL",
    BORDER_PICK_COLOR_WHEEL: "BORDER_PICK_COLOR_WHEEL"
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
        centerCoords:[20,100],
        jstps:  new jsTPS(),
        colorwheelHandler: null, //this is what function to call after submitting color modal
        polygonData: null,
        updateEditor: null,
        updateViewer: null,

        currentPreviewId: null,
        currentMapCardId: null,
        setScreenshot: false,
        setCenterScreen: false,
        downloadPng: false,
    });

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    // const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_MODAL: {
                return setStore({
                    ...store,
                    currentModal : payload,
                });
            }
            case GlobalStoreActionType.CHANGE_SCREEN: {
                return setStore({
                    ...store,
                    currentMapData : {},
                    currentModal: CurrentModal.NONE,
                    currentScreen: payload ,
                    currentFeatureIndex: 0,
                });
            }
            case GlobalStoreActionType.NEW_MAP_NAME: {
                return setStore({
                    ...store,
                    
                    currentModal: CurrentModal.NONE,
                    currentMap: payload,
                    currentFeatureIndex: 0,
                });
            }
            case GlobalStoreActionType.SET_CURRENT_MAP: {
                return setStore({
                    ...store,
                    currentModal : CurrentModal.NONE,
                    currentMap:  payload,
                    currentFeatureIndex: 0,

                });
            }
            case GlobalStoreActionType.UPDATE_CURRENT_MAPDATA: {
                return setStore({
                    ...store,

                    currentModal : CurrentModal.NONE,
                    currentMapData:  payload.data,
                    setScreenshot: payload.takeScreenShot,
                    currentFeatureIndex:0,

                });
            }
            case GlobalStoreActionType.UPDATE_USER_MAP_CARDS: {
                return setStore({
                    ...store,

                    currentModal : CurrentModal.NONE,
                    currentMap:  payload,
                    userMapCards: payload,

                });
            }
            case GlobalStoreActionType.SET_GUEST_MODE: {
                return setStore({
                    ...store,
                    currentMapData : {},
                    currentModal : CurrentModal.NONE,
                    currentScreen: payload.screen ,
                    guestMode: payload.guest,

                });
            }
            case GlobalStoreActionType.SET_HOME: {
                return setStore({
                    ...store,
                    currentMapData : {},
                    currentModal: CurrentModal.NONE,
                    currentScreen: "home" ,
                    guestMode: false,

                });
            }
            case GlobalStoreActionType.SET_REGION_PROPERTIES: {
                return setStore({
                    ...store,
                    currentModal : CurrentModal.NONE,
                    currentRegionProp: payload,

                });
            }
            case GlobalStoreActionType.UPDATE_FEATURE_INDEX: {
                return setStore({
                    ...store,
                    currentModal : CurrentModal.NONE,
                    currentFeatureIndex: payload,


                });
            }
            case GlobalStoreActionType.SET_ZOOM: {
                return setStore({
                    ...store,
                    currentModal : CurrentModal.NONE,
                    zoomLevel:payload.zoom,
                    centerCoords:payload.center
                });
            }
            case GlobalStoreActionType.SET_ADD_REGION: {
                return setStore({
                    ...store,
                    currentModal: payload.modal,
                    zoomLevel: payload.zoom,
                    centerCoords: payload.center
                });
            }
            case GlobalStoreActionType.SET_PREVIEW_ID: {
                return setStore({
                    ...store,
                    currentPreviewId: payload.id,
                    currentModal: payload.modal
                });
            }
            case GlobalStoreActionType.SET_CURRENT_MAPCARD_ID: {
                return setStore({
                    ...store,
                    currentMapCardId: payload.id,
                    currentModal: payload.modal
                });
            }
            case GlobalStoreActionType.SET_SCREENSHOT: {
                return setStore({
                    ...store,
                    setScreenshot: payload.screenshot,
                    currentFeatureIndex:0,
                    currentModal: "NONE"
                });
            }
            case GlobalStoreActionType.SET_CENTER_SCREEN: {
                return setStore({
                    ...store,
                    setCenterScreen : payload.centerScreen,
                    currentModal: "NONE"
                });
            }
            case GlobalStoreActionType.DOWNLOAD_PNG: {
                return setStore({
                    ...store,
                    downloadPng : payload.downloadPng,
                    currentModal: "NONE"
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

    // store.getCurrentMapId = function (){

    // }

    store.changeModal= function(modal){
        storeReducer({
                type: GlobalStoreActionType.CHANGE_MODAL,
                payload: modal
            }
        );
    }
    store.setCurrentMapData= function(geoJsonMap, takeScreenShot=false){
        console.log("reducer called with")
        console.log(geoJsonMap)
        storeReducer({
                type: GlobalStoreActionType.UPDATE_CURRENT_MAPDATA,
                payload: {
                    data: geoJsonMap,
                    takeScreenShot : takeScreenShot,
                },

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
    store.setAddRegion=function(zoom,center,modal){
        storeReducer({
                type: GlobalStoreActionType.SET_ADD_REGION,
                payload: {
                    zoom:zoom,
                    center:center,
                    modal:modal
                }
            }
        );
    }
    store.setPreviewId=function(id, modal){
        storeReducer({
                type: GlobalStoreActionType.SET_PREVIEW_ID,
                payload: {
                    id: id,
                    modal: modal
                }
            }
        );
    }
    store.setCurrentMapCardId=function(id, modal){
        storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_MAPCARD_ID,
                payload: {
                    id: id,
                    modal: modal
                }
            }
        );
    }
    store.takeScreenShot=function(screenshot){
        storeReducer({
            type: GlobalStoreActionType.SET_SCREENSHOT,
            payload: {
                screenshot: screenshot
            }
        });
    }
    store.centerScreen=function(centerScreen){
        storeReducer({
            type: GlobalStoreActionType.SET_CENTER_SCREEN,
            payload: {
                centerScreen: centerScreen
            }
        });
    }
    store.setDownloadPng=function(downloadPng){
        storeReducer({
            type: GlobalStoreActionType.DOWNLOAD_PNG,
            payload: {
                downloadPng: downloadPng
            }
        });
    }
    return (
        <GlobalStoreContext.Provider value={{
            store,setStore
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };