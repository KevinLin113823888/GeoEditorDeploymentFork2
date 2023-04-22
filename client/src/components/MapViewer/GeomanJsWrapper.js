import { useEffect, useRef, useState, useContext } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import './geomanButton.css';
import { CurrentModal, GlobalStoreContext } from '../../store/index'
import EditLegendTPS from '../../transactions/EditLegendTPS'
import TextboxTPS from '../../transactions/TextboxTPS'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CircleMarker } from 'react-leaflet';
function GeomanJsWrapper(props) {
    //with this we can actually customize all of the buttons
    //we can also add a custom merge button as well.
    const context = useLeafletContext();
    const isInitialRender = useRef(true);// in react, when refs are changed component dont re-render
    const { store, setStore } = useContext(GlobalStoreContext);
    const [update, setUpdate] = useState(1);
    const [added, setAdded] = useState(false);

    const isAddTextActive = useRef(false);

    const geoJsonTextbox = useRef([])




    const [textBoxList,setTextBoxList] = useState(store.currentMapData.graphicalData.textBoxList)

    const [newPolygonFeature, setNewPolygonFeature] = useState(
        {
            "type": "Feature",
            "properties": {
                "name": "My Polygon"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[]
                ]
            }
        }
    )

    useEffect (()=>{
        //called once to initialize the textboxs from geoJson
        const LL = context.layerContainer || context.map;
        const map = LL.pm.map
        const leafletContainer = LL
        if(geoJsonTextbox.current.length===0 && textBoxList.length===0)
        {
            console.log("called once ??")
            map.eachLayer(function (layer) {
                if(layer._latlng!==undefined)
                {
                    geoJsonTextbox.current.push(layer._latlng)
                    let name = layer._content
                    let coords = geoJsonTextbox.current[geoJsonTextbox.current.length-1]

                    let newTextBox = {
                        overlayText: name, coords: {
                            lat:coords.lat,
                            lng:coords.lng,
                        }
                    }
                    store.currentMapData.graphicalData.textBoxList.push(newTextBox)
                    layer.removeFrom(map)
                }
            });
        }
        // map.eachLayer(function (layer) {
        //     if(layer._url !== undefined){
        //         console.log("this is for layer")
        //         console.log(layer)
        //         layer.getContainer().style.setProperty("opacity", `50%`)
        //         console.log(layer.getContainer().style)
        //     }
        // })
            // setTextBoxList( store.currentMapData.graphicalData.textBoxList)
    },[])

    //lets make is so that this is stateful, and that this can be called more than once.

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

    useEffect (()=>{
        const LL = context.layerContainer || context.map;
        const map = LL.pm.map

        if(textBoxList===undefined){
            return
        }
        //needed to refresh
        map.eachLayer(function (layer) {
            if (layer.options.pane === "tooltipPane") layer.removeFrom(map);
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
    },[textBoxList])

    useEffect(() => {

        if (isInitialRender.current === false ) {// skip all future renders.
            return;
        }
        isInitialRender.current = false;// set it to false so subsequent changes of dependency arr will make useEffect to execute


        //only allow the first render
        const LL = context.layerContainer || context.map;
        const map = LL.pm.map
        const leafletContainer = LL

        map.on('zoomend', function () {
            let centerArr = []
            let center = map.getCenter()
            centerArr[0] = center.lat
            centerArr[1] = center.lng
            store.setZoomLevel(map.getZoom(), centerArr)
        });
        map.on('pm:drawstart', ({ workingLayer }) => {


            workingLayer.on('pm:vertexadded', (e) => {
                let newCoords = []
                newCoords[0] = e.latlng.lng
                newCoords[1] = e.latlng.lat
                let newRegion = newPolygonFeature
                newRegion.geometry.coordinates[0].push(newCoords)
                setNewPolygonFeature(newRegion)
                //store.setRegionProperties(newRegion)
                //setNewPolygonFeature(newPolygonFeature.geometry.coordinates[0].push(newCoords))
                //console.log(newPolygonFeature)

            });
        });
        map.on('pm:drawend', (e) => {
            let sameFirstandLastCoords = newPolygonFeature
            if (newPolygonFeature.geometry.coordinates[0].length > 0) {
                let firstCoord = newPolygonFeature.geometry.coordinates[0][0];
                sameFirstandLastCoords.geometry.coordinates[0].push(firstCoord)
                props.file.features.push(sameFirstandLastCoords)


                let centerArr = []
                let center = map.getCenter()
                centerArr[0] = center.lat
                centerArr[1] = center.lng


                props.updateViewer()
                props.updateEditor()
                store.setAddRegion(map.getZoom(), centerArr, "MAP_ADD_REGION_NAME")
            }

        });
        if (leafletContainer) {
            console.log("ADDING")
            setAdded(true);
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
                        store.changeModal(CurrentModal.SUBREGION_PICK_COLOR_WHEEL)
                    },
                },
            ]
            const changeBorderColorAction = [
                'cancel',
                {
                    text: 'change border color',
                    onClick: () => {
                        store.changeModal(CurrentModal.BORDER_PICK_COLOR_WHEEL)
                    },
                },
            ]
            const mergeButtonClick = () => {
                console.log("merge button toggle clicked")
                //on click we toggle to enable the selection of regions
                props.toggleSelectMode()
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


            const undoButtonClick = () => {
                if (store.jstps.hasTransactionToUndo())
                    store.jstps.undoTransaction()
            }

            const redoButtonClick = () => {
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
                console.log("handle background color called")
                store.currentMapData.graphicalData.backgroundColor = color
                let newMap = {...store.currentMapData}
                setStore({
                    ...store,
                    currentMapData: newMap
                })

                console.log(store.currentMapData)
            }
            const handleChangeBackgroundColorModal = () => {
                store.colorwheelHandler = handleChangeBackgroundColor
                store.changeModal("MAP_PICK_COLOR_WHEEL")
            }

            //each of the right geoman buttons, [their names, extra menu after click, function on initial click]
            //null means no popup actions
            const customButtonCollection = [
                ["merge", mergeButtonAction, mergeButtonClick],
                // ["addRegion", mergeButtonAction,            mergeButtonClick ], //i think this one is already done i guess
                ["addLegend", null, handleAddLegend],
                ["changeBackgroundColor", null, handleChangeBackgroundColorModal],
                ["changeRegionColor", changeRegionColorAction, colorButtonClick],
                ["changeBorderColor", changeBorderColorAction,colorButtonClick],
                ["addText", extendedMenuActionCancel, addTextButtonClick],
                ["editVertex", mergeButtonAction, mergeButtonClick],
                ["moveRegion", mergeButtonAction, mergeButtonClick],
                ["splitRegion", extendedMenuActionCancel, mergeButtonClick],
                ["deleteRegion", extendedMenuActionCancel, mergeButtonClick],
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
                drawPolygon: true,
                drawCircle: false,
                drawCircleMarker: false,

                rotateMode: false, //last 4 that are removed are below
                removalMode: false,
                cutPolygon: false,
                dragMode: false,
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