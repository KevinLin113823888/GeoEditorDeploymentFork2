
const geo = require('./testGeoJson.json');
import jsTPS_Transaction from '../src/common/jsTPS';
import EditLegendTPS from '../src/transactions/EditLegendTPS'

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
    const store = {
        currentMapData: geo,
        setCurrentMapData: mockFunctions
    }
    test("add", () => {
        let mappedData = {
            store: store,
            setStore: mockFunctions,
            state:mockFunctions,
            type: "add",
        }
        tps.addTransaction(new EditLegendTPS(mappedData))
        //idek care what is in there, just something in there
        expect(store.currentMapData.graphicalData.legend.length === 1)
    })
    test("add undo", () => {
        console.log(store)
        tps.undoTransaction()
        expect(store.currentMapData.graphicalData.legend.length === 0)
    })

    test("add redo", () => {
        console.log(store)
        tps.doTransaction()
        expect(store.currentMapData.graphicalData.legend.length === 1)
    })

    let mockNewText = "some test"
    test("edit", () => {
        let mappedData = {
            store: store,
            setStore: mockFunctions,
            state:mockFunctions,
            type: "edit",
            newText:mockNewText,
            oldIndex:0,
        }
        tps.addTransaction(new EditLegendTPS(mappedData))
        //idek care what is in there, just something in there
        expect(store.currentMapData.graphicalData.legend[0].legendText===mockNewText)
    })
    test("edit undo", () => {
        tps.undoTransaction()
        expect(store.currentMapData.graphicalData.legend[0].legendText!==mockNewText)
    })
    test("edit redo", () => {
        tps.doTransaction()
        expect(store.currentMapData.graphicalData.legend[0].legendText===mockNewText)
    })
    //
    let mockColor = "#123456"
    test("move", () => {
        let mappedData = {
            store: store,
            setStore: mockFunctions,
            state:mockFunctions,
            type: "move",
            newColor: mockColor,
            oldIndex:0,
        }
        tps.addTransaction(new EditLegendTPS(mappedData))
        expect(store.currentMapData.graphicalData.legend[0].coords===mockColor)
    })
    test("move undo", () => {
        tps.undoTransaction()
        expect(store.currentMapData.graphicalData.legend[0].coords!==mockColor)
    })
    test("move redo", () => {
        tps.doTransaction()
        expect(store.currentMapData.graphicalData.legend[0].coords===mockColor)
    })

    test("delete", () => {
        let mappedData = {
            store: store,
            setStore: mockFunctions,
            state:mockFunctions,
            type: "delete",
            oldIndex:0,
        }
        tps.addTransaction(new EditLegendTPS(mappedData))
        expect(store.currentMapData.graphicalData.legend.length === 0)

    })
    test("delete undo", () => {
        console.log(store)
        tps.undoTransaction()
        expect(store.currentMapData.graphicalData.legend.length === 1)
    })

    test("delete redo", () => {
        console.log(store)
        tps.doTransaction()
        expect(store.currentMapData.graphicalData.legend.length === 0)
    })
});




