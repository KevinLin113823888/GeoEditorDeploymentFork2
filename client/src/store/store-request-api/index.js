import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

export const createMap = (title,newMapCardData,mapData) => {
    return api.post(`/map/`, {
        // SPECIFY THE PAYLOAD
        title:title,
        mapCardData: newMapCardData,
        mapData: mapData
    })
}
export const updateMapById = (id,updatedMap, updatedMapData, updatedMapCard) => {
    return api.post(`/map/${id}`, {
        // SPECIFY THE PAYLOAD
        updatedMap:updatedMap,
        updatedMapData: updatedMapData,
        updatedMapCard: updatedMapCard
    })
}
const apis = {
    createMap,
    updateMapById
}

export default apis
