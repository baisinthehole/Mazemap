// area threshold of holes in rooms that will be removed, to remove unnecessary details on lower zoom levels.
var AREA_THRESHOLD = 0.00000001;

// object for keeping all information about polygon layers in one place
function createRoomObjects() {
    var levels = {
        outlines: {
            coordinates: allCoordinatesInFile[0],
            fillColor: buildingBackgroundColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: 16.5,
            maxZoom: 25,
            vectorGridSlicer: true,
            type: "Polygon"
        },

        corridors: {
            coordinates: allCoordinatesInFile[1],
            fillColor: mergedCorridorColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: 21,
            maxZoom: 25,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        mergedCorridors: {
            coordinates: allCoordinatesInFile[2],
            fillColor: mergedCorridorColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: 18,
            maxZoom: 21,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        simplifiedMergedCorrdidors: {
            coordinates: generalSimplify(allCoordinatesInFile[2], AREA_THRESHOLD, VERY_IMPORTANCE_DISTANCE),
            fillColor: mergedCorridorColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: 17,
            maxZoom: 18,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        simplifiedMergedLarge: {
            coordinates: generalSimplify(allCoordinatesInFile[3], AREA_THRESHOLD, VERY_IMPORTANCE_DISTANCE),
            fillColor: mergedRoomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: 17,
            maxZoom: 18,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        mergedLarge: {
            coordinates: allCoordinatesInFile[3],
            fillColor: mergedRoomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: 18,
            maxZoom: 18.5,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        mergedMedium: {
            coordinates: allCoordinatesInFile[4],
            fillColor: mergedRoomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: 18.5,
            maxZoom: 19.5,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        mergedSmall: {
            coordinates: allCoordinatesInFile[5],
            fillColor: mergedRoomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: 19.5,
            maxZoom: 20,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        rooms: {
            coordinates: allCoordinatesInFile[6],
            fillColor: roomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: 20,
            maxZoom: 25,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        doors: {
            coordinates: allCoordinatesInFile[7],
            fillColor: roomColor,
            color: doorColor,
            weight: 0.5,
            minZoom: 21,
            maxZoom: 25,
            vectorGridSlicer: true,
            type: "MultiLineString"
        },

        stairs: {
            coordinates: allCoordinatesInFile[8],
            fillColor: roomColor,
            color: stairColor,
            weight: 0.5,
            minZoom: 20.5,
            maxZoom: 25,
            vectorGridSlicer: true,
            type: "MultiLineString"
        },

        unmergedRooms: {
            coordinates: allCoordinatesInFile[10],
            fillColor: roomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: 18,
            maxZoom: 20.5,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        unmergedLarge: {
            coordinates: allCoordinatesInFile[10],
            fillColor: roomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: 17,
            maxZoom: 18,
            vectorGridSlicer: false,
            type: "Polygon"
        }
    };
    return levels;
}

// converts the polygon layer information into actual leaflet layers, so these can be used for rendering
function createPolygonLayers(levels) {
    var layers = {};

    for (var i in levels) {
        // creates a vectorgrid slicer layer
        if (levels[i].vectorGridSlicer) {
            layers[i] = L.vectorGrid.slicer(makeGeoJSON(levels[i].coordinates, levels[i].type), {
                maxZoom: levels[i].maxZoom,
                minZoom: levels[i].minZoom,
                vectorTileLayerStyles: {
                    sliced: {
                        fillColor: levels[i].fillColor,
                        color: levels[i].color,
                        fill: true,
                        weight: levels[i].weight,
                        fillOpacity: 1
                    }
                },
                pane: getPane(i)
            });
        }
        // creates a layergroup layer
        else {
            layers[i] = Maze.layerGroup();
            var polygons = fillAllPolygons(levels[i].coordinates, levels[i].color, levels[i].fillColor, "polygon");

            addCoordinatesThatAreNotPoints(layers[i], polygons[0]);
        }
    }
    return layers;
}
// is used to make sure doors and stairs are put in a different pane with a higher z-index than the default pane
function getPane(key) {
    if (key == "doors" || key == "stairs") {
        return "topMAP";
    }
    return "tilePane";
}

// makes sure that only polygons that are not points are added to the layergroup, since leaflet throws errors when trying to render points
function addCoordinatesThatAreNotPoints(group, polygons) {
    for (var i = 0; i < polygons.length; i++) {
        if (polygons[i]._latlngs[0].length > 2) {
            if (polygons[i]._latlngs[0].constructor === Array) {
                group.addLayer(polygons[i]);
            }
        }
    }
}

// stores all information about room names in an object for easy access
function createNameObjects() {
    var levels = {
        roomNames: {
            coordinates: allCoordinatesInFile[6],
            names: allNamesInFile[0],
            minZoom: 20,
            maxZoom: 25,
            margin: 0
        },

        unmergedNames: {
            coordinates: allCoordinatesInFile[10],
            names: allNamesInFile[1],
            minZoom: 18.5,
            maxZoom: 20,
            margin: 0
        },

        mergedLarge: {
            coordinates: allCoordinatesInFile[3],
            names: allNamesInFile[2],
            minZoom: null,
            maxZoom: null,
            margin: 0
        },

        mergedMedium: {
            coordinates: allCoordinatesInFile[4],
            names: allNamesInFile[3],
            minZoom: 18.5,
            maxZoom: 19.5,
            margin: 0
        },

        mergedSmall: {
            coordinates: allCoordinatesInFile[5],
            names: allNamesInFile[4],
            minZoom: 19.5,
            maxZoom: 20,
            margin: 0
        },

        largeNames: {
            coordinates: getLargeRoomCoordinates(allCoordinatesInFile, allNamesInFile),
            names: getLargeRoomNames(allCoordinatesInFile, allNamesInFile),
            minZoom: 18,
            maxZoom: 18.5,
            margin: 5
        },

        veryLargeNames: {
            coordinates: getLargeRoomCoordinates(allCoordinatesInFile, allNamesInFile),
            names: getLargeRoomNames(allCoordinatesInFile, allNamesInFile),
            minZoom: 17,
            maxZoom: 18,
            margin: 20
        }
    };
    return levels;
}

// helper function for finding rooms that are bigger than a threshold. Is used for layers where only large rooms should be visible
function getLargeRoomCoordinates(coordinates, names) {
    var roomCoordinates = coordinates[10].concat(coordinates[3]);
    var roomNames = names[1].concat(names[2]);

    var [largeCoordinates, largeNames] = getRoomNamesBasedOnThreshold(roomCoordinates, roomNames, AREA_THRESHOLD);

    return largeCoordinates;
}

// helper function for finding names of rooms that are bigger than a threshold. Is used for layers where only names of large rooms should be visible
function getLargeRoomNames(coordinates, names) {
    var roomCoordinates = coordinates[10].concat(coordinates[3]);
    var roomNames = names[1].concat(names[2]);

    var [largeCoordinates, largeNames] = getRoomNamesBasedOnThreshold(roomCoordinates, roomNames, AREA_THRESHOLD);

    return largeNames;
}

// converts marker information into leaflet layers for simple adding and removing to map
function createMarkerLayers(levels) {
    var layers = {};

    for (var i in levels) {
        // collision layer is used because it prevents rendering overlapping markers
        layers[i] = Maze.LayerGroup.collision({
            margin: levels[i].margin
        });
        var markers = makeAllRoomNames(levels[i].coordinates, levels[i].names, "11");
        for (var j = 0; j < markers.length; j++) {
            layers[i].addLayer(markers[j]);
        }
    }

    return layers;
}

// main function for initializing polygon and name info, and converting it to leaflet layers
function newZoom() {
    var roomLevels = createRoomObjects();
    var roomLayers = createPolygonLayers(roomLevels);

    var nameLevels = createNameObjects();
    var nameLayers = createMarkerLayers(nameLevels);

    renderEverything(roomLevels, nameLevels, roomLayers, nameLayers);
}

// render function that keeps handler functions for zooming and moving on the map
function renderEverything(roomLevels, nameLevels, roomLayers, nameLayers) {

    var tempLayer = Maze.LayerGroup.collision();

    MAP.on('movestart', function() {
        console.log("START!");
        console.time("everything");
        console.time("movement");
    });

    MAP.on('moveend', function() {
        console.timeEnd("movement");
        console.time("polygons");
        tempLayer.remove();
        tempLayer = Maze.LayerGroup.collision();
        var zoom = MAP.getZoom();
        console.log(zoom);

        // add or remove polygon layers according to zoom levels
        for (var i in roomLevels) {
            if (zoom < roomLevels[i].maxZoom && zoom >= roomLevels[i].minZoom) {
                roomLayers[i].addTo(MAP);
            }
            else {
                roomLayers[i].remove();
            }
        }
        console.timeEnd("polygons");
        console.time("names");

        // add or remove name layers according to zoom
        for (var i in nameLevels) {
            if (zoom < nameLevels[i].maxZoom && zoom >= nameLevels[i].minZoom) {
                // makes sure to only add names that are in viewport to layer, to avoid unnecessary rendering of markers outside the screen
                getMarkersInViewPort(tempLayer, nameLayers[i]);
                tempLayer._margin = nameLevels[i].margin;
            }
        }
        tempLayer.addTo(MAP);
        console.timeEnd("names");
        console.timeEnd("everything");
        console.log("END!");
    });
}

// makes sure to only add names that are in viewport to layer, to avoid unnecessary rendering of markers outside the screen
function getMarkersInViewPort(tempLayer, nameLayer) {
    var bounds = MAP.getBounds();
    for (var i = 0; i < nameLayer._originalLayers.length; i++) {
        if (bounds.contains(nameLayer._originalLayers[i].getLatLng())) {
            // console.log("apefe");
            tempLayer.addLayer(nameLayer._originalLayers[i]);
        }
    }
}
