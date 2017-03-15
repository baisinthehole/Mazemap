var FILENAME = "gloes1.geojson";

// Create a map
// center = Maze.latLng(63.41, 10.41);
var MAP = Maze.map('mazemap-container', {
            campusloader: false,
            // center: center,
            zoom: 5,
            zoomSnap: 0,
            zoomDelta: 0.5,
            wheelPxPerZoomLevel: 100 });
MAP.setView([63.417421008760335,10.406426561608821], 15);

if (FLOOR_ID != false) {
    getJSONfromServer();
}
else {
    getLocalJSON(FILENAME);
}


function createglobalMergedPolygons(data, roomCoordinates){
    var neighbors;
    var indeces;

    alterJSONfile(data, FLOOR_ID);

    neighbors = getNeighbors(data, roomCoordinates);
    oldNeighbors = deepCopy(neighbors);

    oldNeighbors = makeNeighborsWhoAreNotNeighborsNeighbors(oldNeighbors);

    var oldRooms = deepCopy(roomCoordinates);

    [roomCoordinates, container] = mergeAllPolygons(neighbors, roomCoordinates);

    getUnmergedRooms(container, oldRooms);

    [roomCoordinates, container] = removeDuplicateRooms(roomCoordinates, container);

    globalMergedCorridorsCoordinates = mergeCorridors();
    console.log("globalMergedCorridorsCoordinates");
    console.log(deepCopy(globalMergedCorridorsCoordinates));
    GLOBAL_ALL_COORDINATES[1] = deepCopy(globalMergedCorridorsCoordinates);
    orderedRooms = findOrderOfRooms(oldNeighbors, container);

    dynamicMergedRooms = dynamicMergeAllRooms(orderedRooms);

    var zoomLevelsCoordinates = fillZoomLevels(dynamicMergedRooms, oldRooms);

    fillZoomLevelPolygons(zoomLevelsCoordinates);

    roomCoordinates = simplifyRoomsMadeBySomeDude(roomCoordinates);

    fillglobalMergedPolygons(roomCoordinates, globalMergedPolygons, container);

    var textZoomLevels = makeMergedNameStrings(dynamicMergedRooms, globalNameList);

    convertMergedTextIntoPOIs(textZoomLevels, zoomLevelsCoordinates);

    // Store coordinates in localStorage if it is not there alreaddy
    if (localStorage.getItem('allCoordinates'+FLOOR_ID) === null) {
        localStorage.setItem('allCoordinates'+FLOOR_ID, JSON.stringify(GLOBAL_ALL_COORDINATES));
    }
}

// Uncomment to clear localStorage
// localStorage.clear();
