import { useEffect, useRef, useState, useContext } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import './geomanButton.css';
import { CurrentModal, GlobalStoreContext } from '../../store/index'
import EditLegendTPS from '../../transactions/EditLegendTPS'
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

    let textOverlay = [{overlayText:"HELLOTHERER",coords:{lat:20,lng:100}},{overlayText:"YOLO DUED",coords:{lat:30,lng:80}}]

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
    // useEffect (()=> {
    //     setUpdate(update=>update+1)
    // },[props.file])

    useEffect(() => {
        // Create a marker with a tooltip

        
        if (isInitialRender.current) {// skip initial execution of useEffect
            isInitialRender.current = false;// set it to false so subsequent changes of dependency arr will make useEffect to execute
            return;
        }
        const LL = context.layerContainer || context.map;
        const map = LL.pm.map
        const leafletContainer = LL
        
        textOverlay.map(function(val){
            var toolTip = L.tooltip({
                permanent: true,
                direction:"none",
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
                    toolTip.setContent(input.value);
                });
                input.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                      // Update the tooltip content with the new value of the input element
                      toolTip.setContent(input.value);
                    }
                  });
                toolTip._container.innerHTML = '';
                toolTip._container.appendChild(input);
                input.focus();
            });
            el.addEventListener('contextmenu',function(event){
                event.stopPropagation();
                event.preventDefault();
                toolTip.removeEventListener("blur")
                toolTip.removeEventListener("dblclick")
                map.removeLayer(toolTip)
            })
            //var draggable = new L.Draggable(el);
            var draggable = new L.Draggable(el);
            draggable.enable();
            
            draggable.on("drag",function(e){
                var tooltipOffset = L.point(toolTip.options.offset);
                var tooltipOrigin = L.point(toolTip._container.getBoundingClientRect().width / 2, toolTip._container.getBoundingClientRect().height);
                var layerPoint = e.target._newPos.add(tooltipOrigin).subtract(tooltipOffset);
                var latlng = map.layerPointToLatLng(layerPoint);
                toolTip.setLatLng(latlng)                
                
            })
            // Add event listeners to the tooltip for drag events
            el.style.pointerEvents = 'auto';
        })
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
            // const addTextButtonAction = [
            //     'cancel',
            //     {
            //         // onClick: () => {
            //         //
            //         //     map.off("click")
            //         //
            //         // },
            //     }
            //
            // ]

            const mergeButtonClick = () => {
                console.log("merge button toggle clicked")
                //on click we toggle to enable the selection of regions
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
                    var toolTip = L.tooltip({
                        permanent: true,
                        direction:"none",
                        className:"leaflet-tooltip",
                        tooltipAnchor: [0, 0] 
                    }).setContent("This is a tooltip!").setLatLng(e.latlng)
                    toolTip.addTo(map)

                    var el = toolTip.getElement();
                    el.addEventListener('dblclick', function (e) {
                        e.stopPropagation();
                        var input = document.createElement('input');
                        input.type = 'text';
                        input.value = toolTip._content;
                        input.addEventListener('blur', function (event) {
                            // Replace the input element with the new tooltip content
                            toolTip.setContent(input.value);
                        });
                        input.addEventListener('keydown', function(event) {
                            if (event.key === 'Enter') {
                              // Update the tooltip content with the new value of the input element
                              toolTip.setContent(input.value);
                            }
                          });
                        toolTip._container.innerHTML = '';
                        toolTip._container.appendChild(input);
                        input.focus();
                    });
                    el.addEventListener('contextmenu',function(event){
                        event.preventDefault();
                        toolTip.removeEventListener("blur")
                        toolTip.removeEventListener("dblclick")
                        map.removeLayer(toolTip)
                    })
                    var draggable = new L.Draggable(el);
                    draggable.enable();
                    // Add event listeners to the tooltip for drag events
                    el.style.pointerEvents = 'auto';
                    draggable.on("drag",function(e){
                        var tooltipOffset = L.point(toolTip.options.offset);
                        var tooltipOrigin = L.point(toolTip._container.getBoundingClientRect().width / 2, toolTip._container.getBoundingClientRect().height);
                        var layerPoint = e.target._newPos.add(tooltipOrigin).subtract(tooltipOffset);
                        var latlng = map.layerPointToLatLng(layerPoint);
                        toolTip.setLatLng(latlng)                
                        
                    })
                    
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


            //each of the right geoman buttons, [their names, extra menu after click, function on initial click]
            //null means no popup actions
            const customButtonCollection = [
                ["merge", mergeButtonAction, mergeButtonClick],
                //TODO: jstps for this one
                // ["addRegion", mergeButtonAction,            mergeButtonClick ], //i think this one is already done i guess
                ["addLegend", null, handleAddLegend],
                ["changeBackgroundColor", mergeButtonAction, mergeButtonClick],
                ["changeRegionColor", mergeButtonAction, mergeButtonClick],
                ["changeBorderColor", mergeButtonAction, mergeButtonClick],
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