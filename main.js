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

// console.log(areaMerge(2, [1.7207639757543802, 1.7427055354346521, 1.7428192222723737, 1.3365593076741789, 
// 						  1.3642988960782532, 1.3698695511266124, 1.3363887774175964, 1.7425918485969305, 
// 						  1.7427055354346521, 1.7426486920157913, 1.7425918485969305, 1.7427055354346521, 
// 						  1.7351453607261647, 1.7427055354346521, 1.7428192222723737]));

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

    [roomCoordinates, container] = mergeAllPolygons(neighbors, roomCoordinates);

    getUnmergedRooms(container, oldRooms);

    [roomCoordinates, container] = removeDuplicateRooms(roomCoordinates, container);

    // test18();
    //test77();
    // getCorridorIndices();
    // test8();
    //test38();
    //test91();
    // // Uncomment to store the corridors for the floor
    // if (localStorage.getItem('corridors'+FLOOR_ID) === null) {
    // // if (true){
    //     // Merge corridors from scratch
    //     var test = mergeCorridors();
    //     localStorage.setItem('corridors'+FLOOR_ID, JSON.stringify(test));
    // }
    // else {
    //     console.log("Found in local storage");
    //     // Retrieve the object from storage
    //     for (var i = 0; i < FLOOR_IDS.length; i++) {
    //         if (localStorage.getItem('corridors'+FLOOR_IDS[i]) !== null) {
    //             globalMergedCorridorsCoordinates.push(JSON.parse(localStorage.getItem('corridors'+FLOOR_IDS[i])));
    //         }
    //     }
    // }
    // console.log(globalMergedCorridorsCoordinates);
    // for (var j = 0; j < globalMergedCorridorsCoordinates.length; j++) {
    //     for (var i = 0; i < globalMergedCorridorsCoordinates[j].length; i++) {
    //         drawPolygonFromOnlyCoordinates(globalMergedCorridorsCoordinates[j][i], "white", "blue");
    //     }
    // }

    var orderedRooms = findOrderOfRooms(oldNeighbors, container);

    dynamicMergedRooms = dynamicMergeAllRooms(orderedRooms, GLOBAL_ROOM_COORDINATES);

    //console.log(deepCopy(dynamicMergedRooms));

    var zoomLevelsCoordinates = fillZoomLevels(dynamicMergedRooms, oldRooms);

    fillZoomLevelPolygons(zoomLevelsCoordinates);

    roomCoordinates = simplifyRoomsMadeBySomeDude(roomCoordinates);

    fillglobalMergedPolygons(roomCoordinates, globalMergedPolygons, container);

    var textZoomLevels = makeMergedNameStrings(dynamicMergedRooms, globalNameList);

    convertMergedTextIntoPOIs(textZoomLevels, zoomLevelsCoordinates);

    // var room1 = GLOBAL_CORRIDOR_COORDINATES[18];
    // var room2 = GLOBAL_CORRIDOR_COORDINATES[1];
    // addedPoints = addPointsForTwoPolygon(room1, room2);
    // room1 = addedPoints[0];
    // room2 = addedPoints[1];
    // pairs1 = findPairsOfPoints(room1, room2);
    // pairs2 = findPairsOfPoints(room2, room1);
    // connectedPoints = connectCirclePoints(room1, room2, pairs1, pairs2);
    // console.log("Output");
    // console.log(deepCopy(pairs1));
    // console.log(deepCopy(pairs2));
    // console.log(deepCopy(connectedPoints));
    // // checkPointSequence(room2);
    // if (connectedPoints.length > 2) {
    //     result = createCirclePolygons(pairs1, pairs2, room1, room2, connectedPoints);
    //     console.log(result);
    //     drawPolygonFromOnlyCoordinates(result, "white", "red");
    // }
    // else {
    //     result = superMergeTwo(room1, room2);
    //     drawPolygonFromOnlyCoordinates(result, "white", "red");
    // }

    // var room1 = globalCorridorCoordinates[0];
    // var room2 = globalCorridorCoordinates[8];
    // // drawPolygonFromOnlyCoordinates(room1, "white", "red");
    // // drawPolygonFromOnlyCoordinates(room2, "white", "blue");
    // var mergedPolygon = superDuperMerge(room1, room2);
    // drawPolygonFromOnlyCoordinates(mergedPolygon, "white", "green");

}

