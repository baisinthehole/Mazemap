// area threshold of holes in rooms that will be removed, to remove unnecessary details on lower zoom levels.
var AREA_THRESHOLD = 0.00000001;

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
            minZoom: 17,
            maxZoom: 25,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        mergedCorridors: {
            coordinates: allCoordinatesInFile[2],
            fillColor: mergedCorridorColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: null,
            maxZoom: null,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        simplifiedMergedCorrdidors: {
            coordinates: generalSimplify(allCoordinatesInFile[2], AREA_THRESHOLD, VERY_IMPORTANCE_DISTANCE),
            fillColor: mergedCorridorColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: null,
            maxZoom: null,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        simplifiedMergedLarge: {
            coordinates: generalSimplify(allCoordinatesInFile[3], AREA_THRESHOLD, VERY_IMPORTANCE_DISTANCE),
            fillColor: mergedRoomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: null,
            maxZoom: null,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        mergedLarge: {
            coordinates: allCoordinatesInFile[3],
            fillColor: mergedRoomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: null,
            maxZoom: null,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        mergedMedium: {
            coordinates: allCoordinatesInFile[4],
            fillColor: mergedRoomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: null,
            maxZoom: null,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        mergedSmall: {
            coordinates: allCoordinatesInFile[5],
            fillColor: mergedRoomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: null,
            maxZoom: null,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        rooms: {
            coordinates: allCoordinatesInFile[6],
            fillColor: roomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: 17,
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
            minZoom: null,
            maxZoom: null,
            vectorGridSlicer: false,
            type: "Polygon"
        },

        unmergedLarge: {
            coordinates: filterOutSmallRooms(allCoordinatesInFile[10]),
            fillColor: roomColor,
            color: roomOutlineColor,
            weight: 0.5,
            minZoom: null,
            maxZoom: null,
            vectorGridSlicer: false,
            type: "Polygon"
        }
    };
    return levels;
}

function createPolygonLayers(levels) {
    var layers = {};

    // console.log(MAP.getPane("topMAP"));
    // console.log(MAP.getPane("tilePane"));

    for (var i in levels) {
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
                        fillOpacity: 1,
                        rendererFactory: L.canvas.tile
                    }
                },
                pane: getPane(i)
            });
        }
        else {
            layers[i] = Maze.layerGroup();
            var polygons = fillAllPolygons(levels[i].coordinates, levels[i].color, levels[i].fillColor, "polygon");

            addCoordinatesThatAreNotPoints(layers[i], polygons[0]);
        }
    }
    return layers;
}

function getPane(key) {
    if (key == "doors" || key == "stairs") {
        return "topMAP";
    }
    return "tilePane";
}

function addCoordinatesThatAreNotPoints(group, polygons) {
    for (var i = 0; i < polygons.length; i++) {
        if (polygons[i]._latlngs[0].length > 2) {
            if (polygons[i]._latlngs[0].constructor === Array) {
                group.addLayer(polygons[i]);
            }
        }
    }
}

function createNameObjects() {
    var levels = {
        roomNames: {
            coordinates: allCoordinatesInFile[6],
            names: allNamesInFile[0],
            minZoom: 18,
            maxZoom: 25,
            margin: 0
        },

        unmergedNames: {
            coordinates: allCoordinatesInFile[10],
            names: allNamesInFile[1],
            minZoom: null,
            maxZoom: null,
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
            minZoom: null,
            maxZoom: null,
            margin: 0
        },

        mergedSmall: {
            coordinates: allCoordinatesInFile[5],
            names: allNamesInFile[4],
            minZoom: null,
            maxZoom: null,
            margin: 0
        },

        largeNames: {
            coordinates: getLargeRoomCoordinates(allCoordinatesInFile, allNamesInFile),
            names: getLargeRoomNames(allCoordinatesInFile, allNamesInFile),
            minZoom: null,
            maxZoom: null,
            margin: 5
        },

        veryLargeNames: {
            coordinates: getLargeRoomCoordinates(allCoordinatesInFile, allNamesInFile),
            names: getLargeRoomNames(allCoordinatesInFile, allNamesInFile),
            minZoom: null,
            maxZoom: null,
            margin: 20
        }
    };
    return levels;
}

function createCustomMarkers(testNumber) {
    if (testNumber == 1) {
        var markers = {
            markerPair1: {
                startPoint: [63.41575401983687, 10.405654607395311],
                endPoint: [63.4154990152524, 10.407129380242633],
                startName: "B1-175",
                endName: "E1-143"
            }
        };
    }
    else {
        var markers = {
            markerPair2: {
                startPoint: [63.41535022985763, 10.404815733223304],
                endPoint: [63.416401875093, 10.40557838382981],
                startName: "A1-142",
                endName: "4.126"
            }
        };
    }
    return markers;
}

function getLargeRoomCoordinates(coordinates, names) {
    var roomCoordinates = coordinates[10].concat(coordinates[3]);
    var roomNames = names[1].concat(names[2]);

    var [largeCoordinates, largeNames] = getRoomNamesBasedOnThreshold(roomCoordinates, roomNames, AREA_THRESHOLD);

    return largeCoordinates;
}

function getLargeRoomNames(coordinates, names) {
    var roomCoordinates = coordinates[10].concat(coordinates[3]);
    var roomNames = names[1].concat(names[2]);

    var [largeCoordinates, largeNames] = getRoomNamesBasedOnThreshold(roomCoordinates, roomNames, AREA_THRESHOLD);

    return largeNames;
}

function createMarkerLayers(levels) {
    var layers = {};

    for (var i in levels) {
        layers[i] = Maze.LayerGroup.collision({
            margin: 0
        });
        var markers = makeAllRoomNames(levels[i].coordinates, levels[i].names, "11");
        for (var j = 0; j < markers.length; j++) {
            layers[i].addLayer(markers[j]);
        }
    }

    return layers;
}

function createCustomMarkerLayers(markers) {
    for (var i in markers) {
        var startMarker = Maze.marker(markers[i].startPoint);
        var startIcon = Maze.icon.glyph({prefix: '', cssClass:'sans-serif', glyph: 'A', glyphColor: "red"});

        var endMarker = Maze.marker(markers[i].endPoint);
        var endIcon = Maze.icon.glyph({prefix: '', cssClass:'sans-serif', glyph: 'B', glyphColor: "green"}); 

        startMarker.setIcon(startIcon);
        endMarker.setIcon(endIcon);

        startMarker.addTo(MAP);
        endMarker.addTo(MAP);       
    }
}

function newZoom() {
    var roomLevels = createRoomObjects();
    var roomLayers = createPolygonLayers(roomLevels);

    removeNamesThatAreTooDifferent();
    var nameLevels = createNameObjects();
    var nameLayers = createMarkerLayers(nameLevels);

    renderEverything(roomLevels, nameLevels, roomLayers, nameLayers);

    clickToShowCoordinates();

    createCustomMarkerLayers(createCustomMarkers(2));
}

// Set names like "Delta - 123" to ""
function removeNamesThatAreTooDifferent() {
    for (var i = 0; i < allNamesInFile.length; i++) {
        for (var j = 0; j < allNamesInFile[i].length; j++) {
            var index = allNamesInFile[i][j].indexOf(" - ");
            if (index != -1) {
                if (allNamesInFile[i][j].length - index > 6) {
                    allNamesInFile[i][j] = "";
                }
            }
        }
    }
}

function renderEverything(roomLevels, nameLevels, roomLayers, nameLayers) {

    var tempLayer = Maze.LayerGroup.collision();

    MAP.on('moveend', function() {
        tempLayer.remove();
        tempLayer = Maze.LayerGroup.collision();
        var zoom = MAP.getZoom();
        //console.log(zoom);
        for (var i in roomLevels) {
            if (zoom < roomLevels[i].maxZoom && zoom >= roomLevels[i].minZoom) {
                roomLayers[i].addTo(MAP);
            }
            else {
                roomLayers[i].remove();
            }
        }
        for (var i in nameLevels) {
            if (zoom < nameLevels[i].maxZoom && zoom >= nameLevels[i].minZoom) {
                getMarkersInViewPort(tempLayer, nameLayers[i]);
                // console.log(nameLayers[i]);
                tempLayer._margin = nameLevels[i].margin;
            }
        }
        tempLayer.addTo(MAP);
    });
}

function getMarkersInViewPort(tempLayer, nameLayer) {
    var bounds = MAP.getBounds();
    // console.log("nameLayer");
    // console.log(nameLayer);
    // nameLayer.eachLayer(function(marker) {
    //     console.log("qwertyuiop");
    //     if (bounds.contains(marker.getLatLng())) {
    //         console.log("apefe");
    //         tempLayer.addLayer(marker);
    //     }
    // });
    for (var i = 0; i < nameLayer._originalLayers.length; i++) {
        if (bounds.contains(nameLayer._originalLayers[i].getLatLng())) {
            // console.log("apefe");
            tempLayer.addLayer(nameLayer._originalLayers[i]);
        }
    }
}

function clickToShowCoordinates() {
    MAP.on("click", function(event) {
        console.log("Lat");
        console.log(event.latlng.lat);
        console.log("Long");
        console.log(event.latlng.lng);
    });
}

function drawFromFile() {
    GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID = allCoordinatesInFile;
    GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID = allNamesInFile;
    addGlobalCoordinatesToZoom();
    addGlobalNamesToZoom();

    createPolygonsFromAllCoordinatesAsOneFloorId(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID);

    zoom();
}

// contains all the data that are displayed on different zoom levels and updates display accordingly
function zoom() {

    // contains all kinds of polygons displayed on different levels
    polygonList = [globalOutlinePolygons, globalCorridorPolygons, globalMergedCorridorPolygons, globalSimplifiedMergedCorridorCoordinates, mergedLarge, mergedMedium, mergedSmall, simplifiedMergedLarge, globalRoomPolygons, globalDoorPolygons, globalStairPolygons, globalUnmergedPolygonsSimplified, globalUnmergedPolygons, globalUnmergedLargePolygons];
    //console.log(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID);
    //console.log(polygonList);

    // contains all kinds of room names displayed on different levels
    var nameList = [globalRoomNamesGroup, globalUnmergedNamesGroup, mergedTextLargeGroup, mergedTextMediumGroup, mergedTextSmallGroup, globalLargeRoomNamesGroup, globalStairIcons, globalToiletIcons];

    // contains all polygons that are currently displayed
    var nowDrawings = [];

    // contains all room names that are currently displayed
    var nowNames = [];

    // keeps information about which zoom levels different polygons will be displayed or not
    var drawings;

    // keeps information about which zoom levels different room names will be displayed or not
    var names;

    var OUTLINE=true, CORRIDORS=true, MERGED_CORRIDORS=true, SIMPLIFIED_MERGED_CORRIDORS=true, MERGED_LARGE=true, MERGED_MEDIUM=true, MERGED_SMALL=true, SIMPLIFIED_LARGE=true, ROOMS=true, DOORS=true, STAIRS=true, UNMERGED_SIMPLIFIED=true, UNMERGED=true, UNMERGED_LARGE=true;

    var ROOM_NAMES=true, UNMERGED_NAMES=true, MERGED_LARGE_NAMES=true, MERGED_MEDIUM_NAMES=true, MERGED_SMALL_NAMES=true, LARGE_ROOM_NAMES=true, STAIR_ICONS=true, TOILET_ICONS=true;

    for (var i = 0; i < polygonList.length; i++) {
        nowDrawings.push(false);
    }
    for (var i = 0; i < nameList.length; i++) {
        nowNames.push(false);
    }


//     var allLayers = {
//         outline: Maze.polygon(...),
//         corridors: Maze.featuregroup()...,
//         rooms: Maze.layerGrop.collision(...)
//     }



//     var visibility = {
//         outline: true,
//         corridors: false,
//         ...
//     }
// //allLayers.forEach(el=>{console.log(el, !!el._map)})

//     for (i in visibility) {
//         if (visibility[i])
//             allLayers[i].addTo(map);
//         else
//             allLayers[i].remove();
//     }



    // Zoom listener, is triggered on every change in zoom level
    MAP.on('zoomend', function () {
        console.time("everything");
        console.log(MAP.getZoom());
        if (MAP.getZoom() < 16){
            drawings = [!OUTLINE, !CORRIDORS, !MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 16.5){
            drawings = [!OUTLINE, !CORRIDORS, !MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 17){
            drawings = [OUTLINE, !CORRIDORS, !MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 17.5){
            drawings = [OUTLINE, !CORRIDORS, !MERGED_CORRIDORS, SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, UNMERGED_LARGE];
            names = [!ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 18){
            drawings = [OUTLINE, !CORRIDORS, !MERGED_CORRIDORS, SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, UNMERGED_LARGE];
            names = [!ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 18.5){
            drawings = [OUTLINE, !CORRIDORS, MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 19){
            drawings = [OUTLINE, !CORRIDORS, MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, UNMERGED_NAMES, !MERGED_LARGE_NAMES, MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 19.5){
            drawings = [OUTLINE, !CORRIDORS, MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, UNMERGED_NAMES, !MERGED_LARGE_NAMES, MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 20){
            drawings = [OUTLINE, !CORRIDORS, MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 20.5){
            drawings = [OUTLINE, !CORRIDORS, MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, UNMERGED, !UNMERGED_LARGE];
            names = [ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 21){
            drawings = [OUTLINE, !CORRIDORS, MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, ROOMS, !DOORS, STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 21.5){
            drawings = [OUTLINE, CORRIDORS, !MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, ROOMS, DOORS, STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 22){
            drawings = [OUTLINE, CORRIDORS, !MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, ROOMS, DOORS, STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else {
            drawings = [OUTLINE, CORRIDORS, !MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, ROOMS, DOORS, STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        console.timeEnd("everything");
    });
}

// draws and removes polygons and room names when zooming
function superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList) {

    console.time("everything");

    console.time("polygons");

    for (var i = 0; i < drawings.length; i++) {
        if (drawings[i] != nowDrawings[i]){
            if (!nowDrawings[i]){
                if (FLOOR_ID != false) {
                    drawPolygons([polygonList[i]]);
                }
                else if (contains(withoutVectorGridSlicer, i)) {
                    drawPolygons(polygonList[i]);
                }
                else {
                    drawVectorGridSlicedPolygons(polygonList[i]);
                }
            }
            else if (nowDrawings[i]){
                if (FLOOR_ID != false) {
                    removePolygons([polygonList[i]]);
                }
                else if (contains(withoutVectorGridSlicer, i)) {
                    removePolygons(polygonList[i]);
                }
                else {
                    removeVectorGridSlicedPolygons(polygonList[i]);
                }
            }
            nowDrawings[i] = !nowDrawings[i];
        }
    }

    console.timeEnd("polygons");

    console.time("names");
    for (var i = 0; i < names.length; i++) {
        if (names[i] != nowNames[i]){
            if (!nowNames[i]){
                nameList[i].addTo(MAP);
            }
            else if (nowNames[i]){
                nameList[i].removeFrom(MAP);
            }
            nowNames[i] = !nowNames[i];
        }
    }
    console.timeEnd("names");
    return [nowDrawings, nowNames];
}
