import { useEffect, useRef, useState, useContext,React} from "react";
import { useLeafletContext } from "@react-leaflet/core";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import './geomanButton.css';
import { CurrentModal, GlobalStoreContext } from '../../store/index'
import EditLegendTPS from '../../transactions/EditLegendTPS'
import TextboxTPS from '../../transactions/TextboxTPS'
import RegionTPS from '../../transactions/RegionTPS'



import * as turf from '@turf/turf';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CircleMarker,useMap } from 'react-leaflet';
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

        if(geoJsonTextbox.current.size===0 && textBoxList.length===0)
        {
            console.log("called once ??")
            map.eachLayer(function (layer) {
                if(layer._latlng!==undefined)
                    geoJsonTextbox.current.add(layer)
            });
        }

    },[])

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
            // console.log("initial set of layers")
            // console.log(layer,geoJsonTextbox.current)
            if (layer.options.pane === "tooltipPane"){
                if(!geoJsonTextbox.current.has(layer))
                    layer.removeFrom(map);
            }
        });
        textBoxList.map(function(val,index){
            var toolTip = L.tooltip({
                permanent: true,
                direction:"center",
                className:"leaflet-tooltip"
            }).setContent(val.overlayText).setLatLng(val.coords)
            toolTip.addTo(map)

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
                handleTooltipDeleteJSTPS(index)
                // event.stopPropagation();
                // event.preventDefault();
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
    },[textBoxList,store.currentMapData])

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

            if(constructedNewPolyRegion.current.geometry.coordinates.length<=1 ){
                return
            }

            if(shapeRef.current=="Polygon"){
               
            let newPoly = constructedNewPolyRegion.current
            if (newPoly.geometry.coordinates[0].length > 0) {
                let firstCoord = newPoly.geometry.coordinates[0][0];
                newPoly.geometry.coordinates[0].push(firstCoord)

                //to make stateful.
                store.polygonData = newPoly
                // props.file.features.push(sameFirstandLastCoords)
                let center = map.getCenter()
                store.setAddRegion(map.getZoom(), [center.lat,center.lng], "MAP_ADD_REGION_NAME")
            }
            //clear what we have right now.
            constructedNewPolyRegion.current = JSON.parse(JSON.stringify(originalNewPolygon))
            }else{
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
                            let num = 1;
                            
                            clipped.geometry.coordinates.forEach((coordinate)=>{
                                let newPolygon = turf.polygon(coordinate)
                                
                                newPolygon.subRegionColor = geoJsonMapData.features[i].subRegionColor
                                if(num==1)newPolygon.properties = geoJsonMapData.features[i].properties
                                newPolygon.properties.name = (name2)+(num++)
                               
                                geoJsonMapData.features.push(newPolygon)
                              
                            })
                        }else{
                           clipped.subRegionColor = geoJsonMapData.features[i].subRegionColor
                           
                            clipped.properties = geoJsonMapData.features[i].properties
                            geoJsonMapData.features.push(clipped)
                        }
                        removeToolTip(geoJsonMapData.features[i].properties.name)
                        geoJsonMapData.features[i]=""
                    }
                    
                    //}
                }
                const features = geoJsonMapData.features.filter(function(feature) {
                    return feature !== "";
                });
                    geoJsonMapData.features=features;
                    console.log(geoJsonMapData)
                props.updateEditor()
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
                        store.changeModal(CurrentModal.MAP_MERGE_REGION_NAME)
                    },
                },
            ]
            const changeRegionColorAction = [
                'cancel',
                {
                    text: 'change selected region color',
                    onClick: () => {
                        store.colorwheelHandler = props.handleRegionColor
                        store.changeModal("MAP_PICK_COLOR_WHEEL")
                    },
                },
            ]
            const changeBorderColorAction = [
                'cancel',
                {
                    text: 'change border color',
                    onClick: () => {
                        store.colorwheelHandler = props.handleBorderColor
                        store.changeModal("MAP_PICK_COLOR_WHEEL")
                    },
                },
            ]
            const mergeButtonClick = () => {
                console.log("merge button toggle clicked")
                //on click we toggle to enable the selection of regions
                props.toggleSelectMode()
            }
            const splitButtonClick = (e) => {
                if(e===undefined){
                    splitClickedRef.current = false
                    map.pm.disableDraw('Line');
                    return }
                console.log("split button clicked")
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
                title: 'add new region',
                actions: extendedMenuActionCancel,
            });

            //each of the right geoman buttons, [their names, extra menu after click, function on initial click]
            //null means no popup actions
            const customButtonCollection = [
                ["merge", mergeButtonAction, mergeButtonClick],
                // ["addRegion" ], //these ones are baked in
                ["addLegend", null, handleAddLegend],
                ["changeBackgroundColor", null, handleChangeBackgroundColorModal],
                ["changeRegionColor", changeRegionColorAction, colorButtonClick],
                ["changeBorderColor", changeBorderColorAction,colorButtonClick],
                ["addText", extendedMenuActionCancel, addTextButtonClick],
                // ["editVertex", mergeButtonAction, mergeButtonClick], //baked
                // ["moveRegion", mergeButtonAction, mergeButtonClick], //baked
                ["splitRegion", null, splitButtonClick],
                // ["deleteRegion", extendedMenuActionCancel, mergeButtonClick], //baked
                ["undo", null, undoButtonClick],
                ["redo", null, redoButtonClick],
            ]

            for (let index in customButtonCollection) {
                const [name, action, onClickHandler] = customButtonCollection[index]

                map.pm.Toolbar.createCustomControl({
                    className: name,
                    name: name,
                    title: name,
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
                removeVertexOn: "contextmenu" //right click on verticies to remove
            });
           
            console.log("mount ")


        }

    }, [context]);
};

export default GeomanJsWrapper;