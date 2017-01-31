var FLOOR_ID = "159";
var FILENAME = "floor_4_35.json";

// Create a map
// center = Maze.latLng(63.41, 10.41);
var MAP = Maze.map('mazemap-container', {
            campusloader: false,
            // center: center,
            zoom: 5,
            zoomSnap: 0.25,
            zoomDelta: 0.5,
            wheelPxPerZoomLevel: 1000 });
// map.setView([10.406426561608821,63.417421008760335], 15);
MAP.setView([63.417421008760335,10.406426561608821], 15);

// Uncomment the preferred JSON file
getLocalJSON(FILENAME);
getJSONfromServer();

zoom();

function createglobalMergedPolygons(data, roomCoordinates){
    var neighbors;
    var indeces;

    alterJSONfile(data, FLOOR_ID);

    //drawPolygonFromOnlyCoordinates(simpleMergeTwo(simpleMergeTwo(roomCoordinates[19], roomCoordinates[26]), roomCoordinates[31], true), "gray", "black");

    //checkPointSequence(simpleMergeTwo(roomCoordinates[19], roomCoordinates[26]));
    //drawPolygonFromOnlyCoordinates(roomCoordinates[0], "gray", "black");


    //drawPolygonFromOnlyCoordinates(roomCoordinates[0], "gray", "black");

    [neighbors, indeces] = getNeighbors(data, roomCoordinates);

    oldNeighbors = deepCopy(neighbors);

    oldNeighbors = makeNeighborsWhoAreNotNeighborsNeighbors(oldNeighbors);

    var oldRooms = deepCopy(roomCoordinates);

    [roomCoordinates, container, globalMergedRoomNameMarkers] = mergeAllPolygons(neighbors, indeces, roomCoordinates);

    getUnmergedRooms(container, oldRooms);

    [roomCoordinates, container] = removeDuplicateRooms(roomCoordinates, container, globalMergedRoomNameMarkers);


    orderedRooms = findOrderOfRooms(oldNeighbors, container);

    dynamicMergedRooms = dynamicMergeAllRooms(orderedRooms);

    var zoomLevelsCoordinates = fillZoomLevels(dynamicMergedRooms, oldRooms);
    fillZoomLevelPolygons(zoomLevelsCoordinates);

    roomCoordinates = simplifyRoomsMadeBySomeDude(roomCoordinates);

    fillglobalMergedPolygons(roomCoordinates, globalMergedPolygons, container);
}
