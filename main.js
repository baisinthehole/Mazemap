var FLOOR_ID = "76";
var FILENAME = "floor_4_35.json";

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

// Uncomment the preferred JSON file
getLocalJSON(FILENAME);
getJSONfromServer();

zoom();

function createglobalMergedPolygons(data, roomCoordinates){
    var neighbors;
    var indeces;

    alterJSONfile(data, FLOOR_ID);

    neighbors = getNeighbors(data, roomCoordinates);
    oldNeighbors = deepCopy(neighbors);

    oldNeighbors = makeNeighborsWhoAreNotNeighborsNeighbors(oldNeighbors);

    var oldRooms = deepCopy(roomCoordinates);

    // for (var i = 0; i < globalCorridorCoordinates.length; i++) {
    //     var point = getPoint(globalCorridorCoordinates[i]);
    //     console.log(point);
    //     console.log(point[0]);
    //     if (point[0]){
    //         Maze.popup().setLatLng(point).setContent(i.toString()).addTo(MAP);
    //     }
    // }

    var testIndex1 = 5;
    var testIndex2 = 1;
    var testIndex6 = 13;
    var testIndex3 = 16;
    var testIndex4 = 6;
    var testIndex5 = 20;

    globalCorridorCoordinates[testIndex1] = removeDuplicatePoints(globalCorridorCoordinates, testIndex1);
    globalCorridorCoordinates[testIndex2] = removeDuplicatePoints(globalCorridorCoordinates, testIndex2);
    globalCorridorCoordinates[testIndex3] = removeDuplicatePoints(globalCorridorCoordinates, testIndex3);
    globalCorridorCoordinates[testIndex4] = removeDuplicatePoints(globalCorridorCoordinates, testIndex4);
    globalCorridorCoordinates[testIndex5] = removeDuplicatePoints(globalCorridorCoordinates, testIndex5);
    globalCorridorCoordinates[testIndex6] = removeDuplicatePoints(globalCorridorCoordinates, testIndex6);

    var modified5 = addPointOnLine(globalCorridorCoordinates[16][1], globalCorridorCoordinates[5]);
    var modified6 = addPointOnLine(globalCorridorCoordinates[20][5], globalCorridorCoordinates[6]);
    var modified20 = addPointOnLine(globalCorridorCoordinates[13][15], globalCorridorCoordinates[20]);
    modified20 = addPointOnLine(globalCorridorCoordinates[13][16], modified20);

    var room1 = superMergeTwo(modified5, globalCorridorCoordinates[1]);
    room1 = superMergeTwo(globalCorridorCoordinates[13], room1);
    var room2 = superMergeTwo(globalCorridorCoordinates[16], modified6);
    room2 = superMergeTwo(room2, modified20);


    // drawPolygonFromOnlyCoordinates(room1, "white", "red");
    // drawPolygonFromOnlyCoordinates(room2, "white", "blue");
    // checkPointSequence(globalCorridorCoordinates[13]);
    // checkPointSequence(room2);

    pairs1 = findPairsOfPoints(room1, room2);
    pairs2 = findPairsOfPoints(room2, room1);
    console.log("pairs1");
    console.log(pairs1);
    console.log(pairs2);

    var connectedPoints = connectCirclePoints(room1, room2, pairs1, pairs2);

    console.log(connectedPoints);

    var testRoom = createCirclePolygons(pairs1, pairs2, room1, room2, connectedPoints);
    console.log(testRoom);
    drawPolygonFromOnlyCoordinates(testRoom[0], "white", "blue");
    drawPolygonFromOnlyCoordinates(testRoom[1], "white", "green");
    drawPolygonFromOnlyCoordinates(testRoom[2], "white", "red");
}

