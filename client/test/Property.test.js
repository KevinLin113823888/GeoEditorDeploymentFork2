
const geo = require('./testGeoJson.json');
import jsTPS_Transaction from '../src/common/jsTPS';
import EditPropertiesTPS from '../src/transactions/EditPropertiesTPS'

import React, { useState as useStateMock } from 'react'



describe('Testing textbox jstsp', () => {
    function initGeojsonGraphicalData (geoJsonObj) {
        geoJsonObj.graphicalData ??= {}
        geoJsonObj.graphicalData.backgroundColor ??= "#FFFFFF"
        geoJsonObj.graphicalData.textBox ??= []
        geoJsonObj.graphicalData.legend ??= []
    }

    initGeojsonGraphicalData(geo)
    const tps  = new jsTPS_Transaction()
    const mockFunctions = jest.fn()

    const mapDataFeatureIndex = 0
    const store = {
        currentMapData: geo,
        setCurrentMapData: mockFunctions,
        currentFeatureIndex: mapDataFeatureIndex
    }
    const propertySize  = store.currentMapData.features[mapDataFeatureIndex].properties
    test("add", () => {
        let mappedData = {
            store: store,
            setStore: mockFunctions,
            state:mockFunctions,
            setPropertyObj:mockFunctions,
            type: "add",
            mapDataFeatureIndex: mapDataFeatureIndex,
        }
        tps.addTransaction(new EditPropertiesTPS(mappedData))
        expect(store.currentMapData.features[mapDataFeatureIndex].properties === propertySize+1)
    })
    test("add undo", () => {
        console.log(store)
        tps.undoTransaction()
        expect(store.currentMapData.features[mapDataFeatureIndex].properties === propertySize)

    })

    test("add redo", () => {
        console.log(store)
        tps.doTransaction()
        expect(store.currentMapData.features[mapDataFeatureIndex].properties === propertySize+1)

    })

    test("edit", () => {
        let mappedData = {
            store: store,
            setStore: mockFunctions,
            state:mockFunctions,
            setPropertyObj:mockFunctions,
            type: "edit",
            propertyKey: "newKey",
            newPropertyValue: "another",
            mapDataFeatureIndex: mapDataFeatureIndex,
        }
        tps.addTransaction(new EditPropertiesTPS(mappedData))
        expect(store.currentMapData.features[mapDataFeatureIndex].properties["newKey"]==="another")
    })
    test("edit undo", () => {
        console.log(store)
        tps.undoTransaction()
        expect(store.currentMapData.features[mapDataFeatureIndex].properties["newKey"]==="newValue")
    })

    test("edit redo", () => {
        console.log(store)
        tps.doTransaction()
        expect(store.currentMapData.features[mapDataFeatureIndex].properties["newKey"]==="another")
    })

    test("delete", () => {
        let mappedData = {
            store: store,
            setStore: mockFunctions,
            state:mockFunctions,
            setPropertyObj:mockFunctions,
            type: "delete",
            propertyKey: "newKey",
            newPropertyValue: "another",
            mapDataFeatureIndex: mapDataFeatureIndex,
            oldPropertyKeyIndex: 0,
        }
        tps.addTransaction(new EditPropertiesTPS(mappedData))
        expect(store.currentMapData.features[mapDataFeatureIndex].properties["newKey"]!=="another")
    })
    test("delete undo", () => {
        console.log(store)
        tps.undoTransaction()
        expect(store.currentMapData.features[mapDataFeatureIndex].properties["newKey"]==="another")
    })

    test("delete redo", () => {
        console.log(store)
        tps.doTransaction()
        expect(store.currentMapData.features[mapDataFeatureIndex].properties["newKey"]!=="another")
    })
    test("key", () => {
        let mappedData = {
            store: store,
            setStore: mockFunctions,
            state:mockFunctions,
            setPropertyObj:mockFunctions,
            type: "keyEdit",
            propertyKey: "anotherKey",
            newPropertyValue: "another",
            mapDataFeatureIndex: mapDataFeatureIndex,
            oldPropertyKeyIndex: 0,
        }
        tps.addTransaction(new EditPropertiesTPS(mappedData))
        expect(store.currentMapData.features[mapDataFeatureIndex].properties["anotherKey"]==="another")
    })
    test("delete undo", () => {
        console.log(store)
        tps.undoTransaction()
        expect(store.currentMapData.features[mapDataFeatureIndex].properties["anotherKey"]===undefined)
    })
    test("delete redo", () => {
        console.log(store)
        tps.doTransaction()
        expect(store.currentMapData.features[mapDataFeatureIndex].properties["anotherKey"]==="another")
    })

    // let mockNewText = "some test"
    // test("edit", () => {
    //     let mappedData = {
    //         store: store,
    //         setStore: mockFunctions,
    //         state:mockFunctions,
    //         type: "edit",
    //         newText:mockNewText,
    //         oldIndex:0,
    //     }
    //     tps.addTransaction(new EditPropertiesTPS(mappedData))
    //     //idek care what is in there, just something in there
    //     expect(store.currentMapData.graphicalData.legend[0].legendText===mockNewText)
    // })
    // test("edit undo", () => {
    //     tps.undoTransaction()
    //     expect(store.currentMapData.graphicalData.legend[0].legendText!==mockNewText)
    // })
    // test("edit redo", () => {
    //     tps.doTransaction()
    //     expect(store.currentMapData.graphicalData.legend[0].legendText===mockNewText)
    // })
    // //
    // let mockColor = "#123456"
    // test("move", () => {
    //     let mappedData = {
    //         store: store,
    //         setStore: mockFunctions,
    //         state:mockFunctions,
    //         type: "move",
    //         newColor: mockColor,
    //         oldIndex:0,
    //     }
    //     tps.addTransaction(new EditPropertiesTPS(mappedData))
    //     expect(store.currentMapData.graphicalData.legend[0].coords===mockColor)
    // })
    // test("move undo", () => {
    //     tps.undoTransaction()
    //     expect(store.currentMapData.graphicalData.legend[0].coords!==mockColor)
    // })
    // test("move redo", () => {
    //     tps.doTransaction()
    //     expect(store.currentMapData.graphicalData.legend[0].coords===mockColor)
    // })
    //
    // test("delete", () => {
    //     let mappedData = {
    //         store: store,
    //         setStore: mockFunctions,
    //         state:mockFunctions,
    //         type: "delete",
    //         oldIndex:0,
    //     }
    //     tps.addTransaction(new EditPropertiesTPS(mappedData))
    //     expect(store.currentMapData.graphicalData.legend.length === 0)
    //
    // })
    // test("delete undo", () => {
    //     console.log(store)
    //     tps.undoTransaction()
    //     expect(store.currentMapData.graphicalData.legend.length === 1)
    // })
    //
    // test("delete redo", () => {
    //     console.log(store)
    //     tps.doTransaction()
    //     expect(store.currentMapData.graphicalData.legend.length === 0)
    // })
});




