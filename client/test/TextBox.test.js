
const geo = require('./testGeoJson.json');
// const {jsTPS} = require("../common/jsTPS")
import jsTPS_Transaction from '../src/common/jsTPS';
import TextboxTPS from '../src/transactions/TextboxTPS'

import React, { useState as useStateMock } from 'react'



describe('Testing textbox jstsp', () => {
    function initGeojsonGraphicalData (geoJsonObj) {
        geoJsonObj.graphicalData ??= {}
        geoJsonObj.graphicalData.backgroundColor ??= "#FFFFFF"
        geoJsonObj.graphicalData.textBoxList ??= []
        geoJsonObj.graphicalData.legend ??= []
    }

    initGeojsonGraphicalData(geo)
    const tps  = new jsTPS_Transaction()
    const mockFunctions = jest.fn()
    const store = {
        currentMapData: geo,
        setCurrentMapData: mockFunctions
    }
    test("add", () => {
        let mappedData = {
            store: store,
            setStore: mockFunctions,
            type: "add",
            textBoxCoord: {
                lat:0,
                lng:0
            },
            state:mockFunctions,
        }
        tps.addTransaction(new TextboxTPS(mappedData))
        //idek care what is in there, just something in there
        expect(store.currentMapData.graphicalData.textBoxList.length === 1)
    })
    test("add undo", () => {
        console.log(store)
        tps.undoTransaction()
        expect(store.currentMapData.graphicalData.textBoxList.length === 0)
    })

    test("add redo", () => {
        console.log(store)
        tps.doTransaction()
        expect(store.currentMapData.graphicalData.textBoxList.length === 1)
    })

    let mockNewText = "some test"
    test("edit", () => {
        let mappedData = {
            store: store,
            setStore: mockFunctions,
            state:mockFunctions,
            type: "edit",
            textBoxCoord: {
                lat:1,
                lng:1
            },
            newText:mockNewText,
            index:0,
        }
        tps.addTransaction(new TextboxTPS(mappedData))
        //idek care what is in there, just something in there
        expect(store.currentMapData.graphicalData.textBoxList[0].overlayText===mockNewText)
    })
    test("edit undo", () => {
        tps.undoTransaction()
        expect(store.currentMapData.graphicalData.textBoxList[0].overlayText!==mockNewText)
    })
    test("edit redo", () => {
        tps.doTransaction()
        expect(store.currentMapData.graphicalData.textBoxList[0].overlayText===mockNewText)
    })

    let mockCoords = {
        lat:1,
        lng:1
    }
    test("move", () => {
        let mappedData = {
            store: store,
            setStore: mockFunctions,
            state:mockFunctions,
            type: "move",
            textBoxCoord: mockCoords,
            index:0,
        }
        tps.addTransaction(new TextboxTPS(mappedData))
        expect(store.currentMapData.graphicalData.textBoxList[0].coords===mockCoords)
    })
    test("move undo", () => {
        tps.undoTransaction()
        expect(store.currentMapData.graphicalData.textBoxList[0].coords!==mockCoords)
    })
    test("move redo", () => {
        tps.doTransaction()
        expect(store.currentMapData.graphicalData.textBoxList[0].coords===mockCoords)
    })
    test("delete", () => {
        let mappedData = {
            store: store,
            setStore: mockFunctions,
            state:mockFunctions,
            type: "delete",
            index:0,
        }
        tps.addTransaction(new TextboxTPS(mappedData))
        expect(store.currentMapData.graphicalData.textBoxList.length === 0)

    })
    test("delete undo", () => {
        console.log(store)
        tps.undoTransaction()
        expect(store.currentMapData.graphicalData.textBoxList.length === 1)
    })

    test("delete redo", () => {
        console.log(store)
        tps.doTransaction()
        expect(store.currentMapData.graphicalData.textBoxList.length === 0)
    })
});




