import { useEffect, useRef, useState, useContext,React} from "react";
import { useLeafletContext } from "@react-leaflet/core";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import './geomanButton.css';
import { CurrentModal, GlobalStoreContext } from '../../store/index'
import EditLegendTPS from '../../transactions/EditLegendTPS'
import TextboxTPS from '../../transactions/TextboxTPS'
import RegionTPS from '../../transactions/RegionTPS'
import Toastify from 'toastify-js'



import * as turf from '@turf/turf';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CircleMarker,useMap } from 'react-leaflet';
import MergeAndSplitTPS from "../../transactions/MergeAndSplitTPS";
function GeomanJsWrapper(props) {
    //with this we can actually customize all of the buttons
    //we can also add a custom merge button as well.
    const context = useLeafletContext();
    const isInitialRender = useRef(true);// in react, when refs are changed component dont re-render
    const { store, setStore } = useContext(GlobalStoreContext);
    const [update, setUpdate] = useState(1);

    const isAddNewRegionPolygon = useRef(false);

    const isAddTextActive = useRef(false);

    const geoJsonTextbox = useRef(new Set())
    const shapeRef = useRef(null);
    const lineLatlngsRef = useRef([]);
    const splitClickedRef = useRef(false);

    const geoJsonMapData = store.currentMapData;
    const map2 = useMap()



    const [textBoxList,setTextBoxList] = useState(store.currentMapData.graphicalData.textBoxList)
    const [feature,setFeatures] = useState(store.currentMapData.features)


    const originalNewPolygon =         {
        "type": "Feature",
        "properties": {
            "name": "My Polygon"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[]]
        }
    }
    const [newPolygonFeature, setNewPolygonFeature] = useState(JSON.parse(JSON.stringify(originalNewPolygon)))

    const constructedNewPolyRegion = useRef(JSON.parse(JSON.stringify(originalNewPolygon)));

    //called once to initialize the textboxs from geoJson
    useEffect (()=>{
        const LL = context.layerContainer || context.map;
        const map = LL.pm.map
        const leafletContainer = LL

        //this part adds the tooltip into the graphical data, lets not do that ig

        // if(geoJsonTextbox.current.size===0 && textBoxList.length===0)
        // {
            console.log("called once ??")
            map.eachLayer(function (layer) {
                if(layer._latlng!==undefined)
                    geoJsonTextbox.current.add(layer)
            });
        // }

    },[context])

    const handleTooltipEditJSTPS = (oldText,newText,index) => {
        let mappedData = {
            store: store,
            setStore: setStore,
            type: "edit",
            // textBoxCoord: e.latlng,
            oldText: oldText,
            newText: newText,
            state:setTextBoxList,
            index:index
        }
        console.log("jstps for edit text")
        store.jstps.addTransaction(new TextboxTPS(mappedData))
    }
    const handleTooltipMoveJSTPS = (index,textBoxCoord) => {
        let mappedData = {
            store: store,
            setStore: setStore,
            type: "move",
            textBoxCoord: textBoxCoord,
            state:setTextBoxList,
            index:index
        }
        console.log("jstps for move text")
        store.jstps.addTransaction(new TextboxTPS(mappedData))
    }
    const handleTooltipDeleteJSTPS = (index) => {
        let mappedData = {
            store: store,
            setStore: setStore,
            type: "delete",
            state:setTextBoxList,
            index:index
        }
        console.log("jstps for delete text")
        store.jstps.addTransaction(new TextboxTPS(mappedData))
    }
    //lets make is so that this is stateful, and that this can be called more than once.
    useEffect (()=>{
        console.log("called to refresh all of the textbox tootips")
        const LL = context.layerContainer || context.map;
        const map = LL.pm.map
        if(textBoxList===undefined){
            return
        }
        //needed to refresh
        map.eachLayer(function (layer) {
            // console.log(layer,geoJsonTextbox.current)
            if (layer.options.needsRefresh === true){
                layer.removeFrom(map);
            }
            // if (layer.options.pane === "tooltipPane"){
            //     if(!geoJsonTextbox.current.has(layer))
            //         layer.removeFrom(map);
            // }
        });
        // store.updateEditor()
        textBoxList.map(function(val,index){
            var toolTip = L.tooltip({
                permanent: true,
                direction:"center",
                className:"leaflet-tooltip",
                needsRefresh:true,
            }).setContent(val.overlayText).setLatLng(val.coords)
            toolTip.addTo(map)

            console.log("values of tooltip")
            console.log(toolTip)

            var el = toolTip.getElement();
            el.addEventListener('dblclick', function (e) {
                e.stopPropagation();
                var input = document.createElement('input');
                input.type = 'text';
                input.value = toolTip._content;
                input.addEventListener('blur', function (event) {
                    // Replace the input element with the new tooltip content
                    //calling the jstps for edit
                    handleTooltipEditJSTPS(val,input.value,index)
                    // toolTip.setContent(input.value);
                });
                input.addEventListener('keydown', function(event) {
                    try{
                        if (event.key === 'Enter') {
                            // Update the tooltip content with the new value of the input element
                            handleTooltipEditJSTPS(val,input.value,index)
                            // toolTip.setContent(input.value);
                        }}
                    catch(e){
                    }
                });
                toolTip._container.innerHTML = '';
                toolTip._container.appendChild(input);
                input.focus();
            });
            el.addEventListener('contextmenu',function(event){
                event.preventDefault();
                handleTooltipDeleteJSTPS(index)
                // event.stopPropagation();
                 
                // toolTip.removeEventListener("blur")
                // toolTip.removeEventListener("dblclick")
                // map.removeLayer(toolTip)
            })
            var draggable = new L.Draggable(el);
            draggable.enable();

            draggable.on("drag",function(e){
                var tooltipOffset = L.point(toolTip.options.offset);
                var tooltipOrigin = L.point(toolTip._container.getBoundingClientRect().width / 2, toolTip._container.getBoundingClientRect().height);
                var layerPoint = e.target._newPos.add(tooltipOrigin).subtract(tooltipOffset);
                var latlng = map.layerPointToLatLng(layerPoint);
                // toolTip.setLatLng(latlng)
                // idk if we should include this as a jstps because this gives a lot of transactions
                handleTooltipMoveJSTPS(index,latlng)
            })
            // Add event listeners to the tooltip for drag events
            el.style.pointerEvents = 'auto';
        })
        console.log("someone called for the refresh the state of all of the textboxes")
    },[textBoxList,store.currentMapData,store])

    //this will be the one to intialize the buttons, these are called once and are not stateful
    useEffect(() => {
        if (isInitialRender.current === false )// skip all future renders.
            return;
        isInitialRender.current = false;// set it to false so subsequent changes of dependency arr will make useEffect to execute


        //only allow the first render
        const LL = context.layerContainer || context.map;
        const map = LL.pm.map
        const leafletContainer = LL
        let newLineLayer;

        // map.on('zoomend', function () {
        //     let centerArr = []
        //     let center = map.getCenter()
        //     centerArr[0] = center.lat
        //     centerArr[1] = center.lng
        //     store.setZoomLevel(map.getZoom(), centerArr)
        // });
        map.on('click',(e)=>{
            props.unselect()
            store.setCurrentFeatureIndex(-1);

        })
        map.on('pm:create', (e) => {
            
            if (e.layer instanceof L.Polygon) {
                shapeRef.current = "Polygon"
                console.log('A polygon was drawn');
            } else if (e.layer instanceof L.Polyline) {
                console.log('A line was drawn');
                newLineLayer = e.layer;
                shapeRef.current = "Line"
                console.log(e)

            }
        });
        map.on('pm:drawstart', ({ workingLayer }) => {
            
            LL.pm.Draw['PolygonCopy'].setOptions({
                snapDistance: 20
            });
            
            let numVertices = 0;
            workingLayer.on('pm:vertexadded', (e) => {
                let newCoords = [e.latlng.lng,e.latlng.lat]

                if (splitClickedRef.current == true) {
                    console.log("A")
                    numVertices++;
                    lineLatlngsRef.current.push(newCoords)
                    if (numVertices >= 2) {
                        map.pm.disableDraw('Line');
                        splitClickedRef.current = false
                    }

                }else{
                    constructedNewPolyRegion.current.geometry.coordinates[0].push(newCoords)
                }
            });
            // workingLayer.removeFrom(map)
        });
        map.on('pm:drawend', ({ workingLayer }) => {

            if(isAddNewRegionPolygon.current){
                // console.log("dont want this")
                // console.log(constructedNewPolyRegion.current.geometry.coordinates?.[0])
                if(constructedNewPolyRegion.current.geometry.coordinates?.[0].length<=1){
                    // console.log("no")
                    return
                }
            }

            if(shapeRef.current=="Polygon"){
                console.log(constructedNewPolyRegion.current)
                if(constructedNewPolyRegion.current.geometry.coordinates[0].length>=3 ){


                    let newPoly = constructedNewPolyRegion.current
                    if (newPoly.geometry.coordinates[0].length > 0) {
                        let firstCoord = newPoly.geometry.coordinates[0][0];
                        newPoly.geometry.coordinates[0].push(firstCoord)

                        //to make stateful.
                        store.polygonData = JSON.parse(JSON.stringify(newPoly))
                        // props.file.features.push(sameFirstandLastCoords)
                        let center = map.getCenter()
                        store.setAddRegion(map.getZoom(), [center.lat,center.lng], "MAP_ADD_REGION_NAME")
                    }
                }
                //clear what we have right now.
                constructedNewPolyRegion.current = JSON.parse(JSON.stringify(originalNewPolygon))
            }else{
                console.log(constructedNewPolyRegion.current)

                splitRegion()
            }
        });
        function removeToolTip(name){

            // map.eachLayer((layer) => {
            //     console.log(layer)
            //     if (layer._tooltip) {
            //       let tooltip = layer._tooltip;

            //       if (tooltip._content === name) {
            //         console.log("PA")
            //         layer.unbindTooltip();

            //       }
            //     }
            // });
            // geoJsonMapData.graphicalData.textBoxList = geoJsonMapData.graphicalData.textBoxList.filter(textOverlay => textOverlay.overlayText !==name);
            // console.log( geoJsonMapData.graphicalData)
        }

        function splitRegion(){
            let polygons = []
            geoJsonMapData.features.forEach(feature => {
                if (feature.geometry.type === "Polygon") {
                    if (feature.geometry.coordinates[0].length > 3) {
                        polygons.push(turf.polygon(feature.geometry.coordinates));
                    }
                } else if (feature.geometry.type === "MultiPolygon") {
                    polygons.push(turf.multiPolygon(feature.geometry.coordinates));
                }
            });
            console.log(polygons)
            // Check if the new polyline intersects with any polygons
            if(lineLatlngsRef.current.length <= 1 ){
                return
            }
            let newPolyline = turf.lineString(lineLatlngsRef.current);
            console.log(newPolyline)


            for (let i = 0; i < polygons.length; i++) {

                //if(polygons[i].geometry.type=="Polygon"){
                const intersectionPoints = turf.lineIntersect(newPolyline, polygons[i]);

                if (intersectionPoints.features.length > 1) {


                    let newPolyline = turf.lineString(lineLatlngsRef.current);
                    console.log('New polyline intersects with polygon', i);
                    let offsetLine = turf.lineOffset(newPolyline, 0.00001, { units: 'kilometers' });
                    let thickLineCorners = turf.featureCollection([newPolyline, offsetLine]);
                    let thickLinePolygon = turf.convex(turf.explode(thickLineCorners));
                    let clipped = turf.difference(polygons[i], thickLinePolygon);

                    let name2 = geoJsonMapData.features[i].properties.name
                    if(polygons[i].geometry.type=="Polygon"){

                        console.log("what is this part of the if")
                        let num = 1;


                        let listOfNewSplitRegionsToAdd = []
                        clipped.geometry.coordinates.forEach((coordinate)=>{
                            let newPolygon = turf.polygon(coordinate)
                            newPolygon.subRegionColor = geoJsonMapData.features[i].subRegionColor
                            if(num==1)newPolygon.properties = geoJsonMapData.features[i].properties
                            newPolygon.properties.name = (name2)+(num++)
                            listOfNewSplitRegionsToAdd.push(newPolygon)
                        })



                            console.log("res of the clips for single poly")
                            console.log(clipped)
                            console.log(listOfNewSplitRegionsToAdd)
                            let transactionMappedData = {
                                type: "split",
                                store: store,
                                setStore: setStore,
                                updateView: store.updateViewer,
                                updateEditor:store.updateEditor,
                                oldIndex: i,
                                listOfNewSplitRegionsToAdd:listOfNewSplitRegionsToAdd,
                            }
                            store.jstps.addTransaction(new MergeAndSplitTPS(transactionMappedData))
                        break;
                    }
                    else{

                        console.log("the part for the multi polys")
                        let num = 1;


                        let listOfNewSplitRegionsToAdd = []
                        clipped.geometry.coordinates.forEach((coordinate)=>{
                            let newPolygon = turf.polygon(coordinate)

                            newPolygon.subRegionColor = geoJsonMapData.features[i].subRegionColor
                            if(num==1)newPolygon.properties = geoJsonMapData.features[i].properties
                            newPolygon.properties.name = (name2)+(num++)
                            listOfNewSplitRegionsToAdd.push(newPolygon)
                        })
                        //multi..?

                        let newPoly = clipped.geometry.coordinates //this one contains the new split region
                        let existingPoly = geoJsonMapData.features[i].geometry.coordinates

                        let turfNew = turf.multiPolygon(newPoly)
                        let turfExist = turf.multiPolygon(existingPoly)



                        var polygon2 = turf.polygon([[
                            [0,0],
                            [0,0],
                            [0,0],
                            [0,0],
                        ]]);
                        turfExist = turf.difference(turfExist,polygon2 );

                        console.log("turf modified")
                        console.log(turfNew)
                        console.log(turfExist)
                        let existingStrSet = new Map()

                        newPoly = turfNew.geometry.coordinates //this one contains the new split region
                        existingPoly = turfExist.geometry.coordinates




                        for(let i=0;i<existingPoly.length;i++){
                            existingStrSet.set(existingPoly[i].toString(),i)
                        }


                        let uniqueNews = []
                        let notUniqueNews = []

                        for(let i=0;i<newPoly.length;i++){
                            let newPolyI = newPoly[i].toString()
                            if(!existingStrSet.has(newPolyI)){
                                uniqueNews.push(newPoly[i])
                            }
                            else{
                                notUniqueNews.push(newPoly[i])
                                // existingStrSet.set(newPolyI,-1)
                            }
                        }
                        console.log("so these are not the same")
                        console.log(uniqueNews)
                        console.log(notUniqueNews)

                        notUniqueNews.push(uniqueNews.pop())



                        let uniqueName = JSON.parse(JSON.stringify(geoJsonMapData.features[i].properties.name)).toString()
                        let uniqueName2 = JSON.parse(JSON.stringify(geoJsonMapData.features[i].properties.name)).toString()



                        let nu = JSON.parse(JSON.stringify(turf.multiPolygon((notUniqueNews))))
                        nu.subRegionColor = JSON.parse(JSON.stringify((geoJsonMapData.features[i].subRegionColor)))
                        nu.properties = JSON.parse(JSON.stringify((geoJsonMapData.features[i].properties)))
                        nu.properties.name = uniqueName+"first"


                        let u = turf.multiPolygon(JSON.parse(JSON.stringify(uniqueNews)))
                        u.subRegionColor = JSON.parse(JSON.stringify((geoJsonMapData.features[i].subRegionColor)))
                        u.properties = JSON.parse(JSON.stringify((geoJsonMapData.features[i].properties)))
                        u.properties.name = uniqueName2+"second"

                        console.log("res of the other these two")
                        console.log(JSON.parse(JSON.stringify(u.properties.name)))
                        console.log(JSON.parse(JSON.stringify(nu.properties.name)))


                        console.log("res of the clips for multi poly poly")
                        listOfNewSplitRegionsToAdd = [nu,u]
                        console.log(listOfNewSplitRegionsToAdd)

                        let transactionMappedData = {
                            type: "split",
                            store: store,
                            setStore: setStore,
                            updateView: store.updateViewer,
                            updateEditor:store.updateEditor,
                            oldIndex: i,
                            listOfNewSplitRegionsToAdd:listOfNewSplitRegionsToAdd,
                        }
                        store.jstps.addTransaction(new MergeAndSplitTPS(transactionMappedData))
                        break;
                    }
                }
            }
        //all of these updates are done in the jstps
            lineLatlngsRef.current = []
        }
        if (leafletContainer) {
            console.log("ADDING")
            const mergeButtonAction = [
                'cancel',
                {
                    text: 'merge selected region',
                    onClick: () => {
                        console.log("merging button confirmation")

                        console.log(props.regionsSelected.current)
                        if(props.regionsSelected.current.length>1){
                        store.changeModal(CurrentModal.MAP_MERGE_REGION_NAME)
                        }else{
                            Toastify({
                                text: "Please Select Two Regions Before Merging",
                                gravity: "bottom",
                                position: 'left',
                                duration: 2000,
                                style: {
                                  background: '#0f3443'
                                }
                              }).showToast();
                        }
                    },
                },
            ]
            const changeRegionColorAction = [
                'cancel',
                {
                    text: 'change selected region color',
                    onClick: () => {
                        if(props.regionsSelected.current.length>0){
                            store.colorwheelHandler = props.handleRegionColor
                            store.changeModal("MAP_PICK_COLOR_WHEEL")
                        }else{
                            Toastify({
                                text: "Please Select Regions to Change Color",
                                gravity: "bottom",
                                position: 'left',
                                duration: 2000,
                                style: {
                                  background: '#0f3443'
                                }
                              }).showToast();
                        }
                    },
                },
            ]
            const changeBorderColorAction = [
                'cancel',
                {
                    text: 'change border color',
                    onClick: () => {
                        if(props.regionsSelected.current.length>0){
                        store.colorwheelHandler = props.handleBorderColor
                        store.changeModal("MAP_PICK_COLOR_WHEEL")
                        }else{
                            Toastify({
                                text: "Please Select Regions to Change Color",
                                gravity: "bottom",
                                position: 'left',
                                duration: 2000,
                                style: {
                                  background: '#0f3443'
                                }
                              }).showToast();
                        }
                    },
                },
            ]
            const mergeButtonClick = (e) => {
                console.log(e)
                if(e===undefined){
                    console.log("huh")
                    props.toggleSelectMode()
                    // props.handleCancelMergeSelection()
                    // console.log("res of the after button click")
                    // console.log(props.regionsSelected)
                    return
                }
                console.log("merge button toggle clicked")
                //on click we toggle to enable the selection of regions
                props.toggleSelectMode()
            }
            const splitButtonClick = (e) => {

                console.log("split button clicked")
                console.log("result of the split clicked ref")
                console.log(lineLatlngsRef.current.length)
                console.log(splitClickedRef.current)
                console.log(e)
                console.trace()

                if(e===undefined){
                    // splitClickedRef.current = false
                    // map.pm.disableDraw('Line');
                    return
                }
                if(lineLatlngsRef.current.length <= 1 &&  splitClickedRef.current === true){

                    console.log("fall into the if statement")
                    splitClickedRef.current = false
                    map.pm.disableDraw('Line');
                    return
                }
                splitClickedRef.current = true
                map.pm.enableDraw('Line', {
                    snappable: true,
                    snapDistance: 20,
                    finishOn: 'dblclick',
                    tooltips: true,
                    cursorMarker: true
                });
            }
            const colorButtonClick=()=>{
                props.toggleSelectMode()
            }


            const addTextButtonClick = (event) => {
                console.log("BUTTON")
                if(event===undefined || isAddTextActive.current ){
                    isAddTextActive.current = false
                    map.off("click")
                    return
                }
                isAddTextActive.current = true

                map.on("click", function (e) {
                    // var toolTip = L.tooltip({
                    //     permanent: true,
                    //     direction:"none",
                    //     className:"leaflet-tooltip",
                    //     tooltipAnchor: [0, 0]
                    // }).setContent("This is a tooltip!").setLatLng(e.latlng)
                    // toolTip.addTo(map)

                    let mappedData = {
                        store: store,
                        setStore: setStore,
                        type: "add",
                        textBoxCoord: e.latlng,
                        state:setTextBoxList,
                    }
                    store.jstps.addTransaction(new TextboxTPS(mappedData))
                })
            }

            const extendedMenuActionCancel = [
                'cancel',
            ]
            const extendedMenuSplitActionCancel=['cancel',

            ]

            const undoButtonClick = (e) => {
                if(e === undefined){
                    return
                }
                if (store.jstps.hasTransactionToUndo())
                    store.jstps.undoTransaction()
            }

            const redoButtonClick = (e) => {
                if(e === undefined){
                    return
                }
                if (store.jstps.hasTransactionToRedo())
                    store.jstps.doTransaction()
            }

            const handleAddLegend = (event) => {
                console.log("undo")
                console.log(event)
                if(event===undefined){ //this is when click away happens
                    return
                }

                let mappedData = {
                    store: store,
                    type: "add",
                    state: null,
                    setStore: setStore,
                }
                store.jstps.addTransaction(new EditLegendTPS(mappedData))
                // props.updateViewer()
            }

            const handleChangeBackgroundColor = (color) => {

                props.handleBackgroundColorChange(color)
            }
            const handleChangeBackgroundColorModal = (e) => {
                if(e===undefined)
                    return // cancel
                store.colorwheelHandler = props.handleBackgroundColorChange
                store.changeModal("MAP_PICK_COLOR_WHEEL")
            }


            const addNewPolygonRegionClick = (event) => {

                console.log("add new poly is clicked ")
                if(event===undefined){
                    console.log("event is undefined, its a not so good action hmm")
                    isAddNewRegionPolygon.current = false
                }
                isAddNewRegionPolygon.current = true
            }
            map.pm.Toolbar.copyDrawControl('Polygon', {
                onClick: addNewPolygonRegionClick,
                name: 'PolygonCopy',
                block: 'edit',
                title: 'Add New Region',
                actions: extendedMenuActionCancel,
            });

            //each of the right geoman buttons, [their names, extra menu after click, function on initial click]
            //null means no popup actions
            const customButtonCollection = [
                ["merge", mergeButtonAction, mergeButtonClick, "Merge"],
                ["addLegend", null, handleAddLegend, "Add Legend"],
                ["changeBackgroundColor", null, handleChangeBackgroundColorModal, "Change Background Color"],
                ["changeRegionColor", changeRegionColorAction, colorButtonClick, "Change Region Color"],
                ["changeBorderColor", changeBorderColorAction,colorButtonClick, "Change Border Color"],
                ["addText", extendedMenuActionCancel, addTextButtonClick, "Add New Textbox"],
                ["splitRegion", null, splitButtonClick, "Split Region"],
                ["undo", null, undoButtonClick, "Undo"],
                ["redo", null, redoButtonClick, "Redo"],
            ]

            for (let index in customButtonCollection) {
                const [name, action, onClickHandler, title] = customButtonCollection[index]

                map.pm.Toolbar.createCustomControl({
                    className: name,
                    name: name,
                    title: title,
                    block: 'edit',
                    actions: action,
                    onClick: onClickHandler
                });
            }




            LL.pm.addControls({
                position: 'topleft',
                drawMarker: false,
                drawText: false,
                drawPolyline: false,
                drawRectangle: false,
                drawPolygon: false,
                drawCircle: false,
                drawCircleMarker: false,

                rotateMode: false, //last 4 that are removed are below
                removalMode: true,
                cutPolygon: false,
                dragMode: true,
                editMode: true
            });
            LL.pm.setGlobalOptions({
                continueDrawing: true,
                editable: false,
                limitMarkersToCount: 50,
                snapDistance: 2,
                removeVertexOn: "contextmenu" //right click on verticies to remove
            });

            console.log("mount ")

            
        }

    }, [context]);
};

export default GeomanJsWrapper;