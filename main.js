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

// console.log(areaMerge(2, [1.7207639757543802, 1.7427055354346521, 1.7428192222723737, 1.3365593076741789,
// 						  1.3642988960782532, 1.3698695511266124, 1.3363887774175964, 1.7425918485969305,
// 						  1.7427055354346521, 1.7426486920157913, 1.7425918485969305, 1.7427055354346521,
// 						  1.7351453607261647, 1.7427055354346521, 1.7428192222723737]));

// Uncomment the preferred JSON file

if (FLOOR_ID != false) {
    getJSONfromServer();
    zoom();
}
else {
    getLocalJSON(FILENAME);
}

function createglobalMergedPolygons(data, roomCoordinates){
    var neighbors;
    var indeces;

    neighbors = getNeighbors(data, roomCoordinates);
    oldNeighbors = deepCopy(neighbors);

    oldNeighbors = makeNeighborsWhoAreNotNeighborsNeighbors(oldNeighbors);

    var oldRooms = deepCopy(roomCoordinates);

    [roomCoordinates, container] = mergeAllPolygons(neighbors, roomCoordinates);

    getUnmergedRooms(container, oldRooms);

    [roomCoordinates, container] = removeDuplicateRooms(roomCoordinates, container);

    var orderedRooms = findOrderOfRooms(oldNeighbors, container);

    dynamicMergedRooms = dynamicMergeAllRooms(orderedRooms, GLOBAL_ROOM_COORDINATES);

    var zoomLevelsCoordinates = fillZoomLevels(dynamicMergedRooms, oldRooms);

    fillZoomLevelPolygons(zoomLevelsCoordinates);

    roomCoordinates = simplifyRoomsMadeBySomeDude(roomCoordinates);

    fillglobalMergedPolygons(roomCoordinates, globalMergedPolygons, container);

    var textZoomLevels = makeMergedNameStrings(dynamicMergedRooms, globalNameList);

    convertMergedTextIntoPOIs(textZoomLevels, zoomLevelsCoordinates);

    [globalMergedCorridorCoordinates, corridorContainer] = mergeCorridors();

	[globalMergedCorridorCoordinates, corridorContainer] = removeDuplicateRooms(globalMergedCorridorCoordinates, corridorContainer)
    GLOBAL_ALL_COORDINATES[1] = deepCopy(globalMergedCorridorsCoordinates);

    fillMergedCoordinates(globalMergedCorridorCoordinates);

    // var textZoomLevels = makeMergedNameStrings(dynamicMergedRooms, globalNameList);

    // convertMergedTextIntoPOIs(textZoomLevels, zoomLevelsCoordinates);

    // Store coordinates in localStorage if it is not there alreaddy
    if (localStorage.getItem('allCoordinates'+FLOOR_ID) === null) {
        localStorage.setItem('allCoordinates'+FLOOR_ID, JSON.stringify(GLOBAL_ALL_COORDINATES));
    }
}

// Uncomment to clear localStorage
// localStorage.clear();

