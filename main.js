// This branch is for creating new versions of the files containing the coordinates and names
// First run with floorID set to the floors you want to update
// Then adjust the downloadAsFile function below to use the wanted files
// At last, run with floorID set to false

function downloadAsFile() {
    download(JSON.stringify(allCoordinatesInFile), "coordinates.txt", "text/plain");
    download(JSON.stringify(allNamesInFile), "names.txt", "text/plain");
}

console.log(allCoordinatesInFile);
console.log(allNamesInFile);
var FILENAME = "gloes1.geojson";
FLOOR_IDS = [300, 1672, 246, 351, 70, 349, 59, 168, 155, 197, 374, 326, 94, 241, 220, 81, 408, 380, 295, 352, 311, 148, 343, 142, 247, 141, 354, 85, 378, 65, 96, 178, 160, 236, 358, 234, 260, 355, 98, 100, 254, 200, 9, 353, 62]

// Create a map
// center = Maze.latLng(63.41, 10.41);
var MAP = Maze.map('mazemap-container', {
            campusloader: false,
            // center: center,
            zoom: 5,
            zoomSnap: 0,
            zoomDelta: 0.5,
            wheelPxPerZoomLevel: 100,
            markerZoomAnimation: false });
MAP.setView([63.417421008760335,10.406426561608821], 15);

MAP.createPane("topMAP");
MAP.getPane("topMAP").style.zIndex = 100;

MAP.createPane("iconMAP");
MAP.getPane("iconMAP").style.zIndex = 200;

// console.log(areaMerge(2, [1.7207639757543802, 1.7427055354346521, 1.7428192222723737, 1.3365593076741789,
// 						  1.3642988960782532, 1.3698695511266124, 1.3363887774175964, 1.7425918485969305,
// 						  1.7427055354346521, 1.7426486920157913, 1.7425918485969305, 1.7427055354346521,
// 						  1.7351453607261647, 1.7427055354346521, 1.7428192222723737]));

// Uncomment the preferred JSON file

if (FLOOR_ID != false) {
    console.log("Get data from server");
    getJSONfromServer();
}
else {
    console.log("Get data from localStorage");
    // getLocalJSON(FILENAME);
    drawFromFile();
    zoom();
}

function createglobalMergedPolygons(data, roomCoordinates){
    var neighbors;
    var indeces;

    console.log("oisdvniednv");

    neighbors = getNeighbors(data, roomCoordinates);
    oldNeighbors = deepCopy(neighbors);

    oldNeighbors = makeNeighborsWhoAreNotNeighborsNeighbors(oldNeighbors);

    var oldRooms = deepCopy(roomCoordinates);

    [roomCoordinates, container] = mergeAllPolygons(neighbors, roomCoordinates);

    getUnmergedRooms(container, oldRooms);

    [roomCoordinates, container] = removeDuplicateRooms(roomCoordinates, container);

    dynamicMergedRooms = createZoomLevelTree(container, oldNeighbors);

 //    var orderedRooms = findOrderOfRooms(oldNeighbors, container);

 //    dynamicMergedRooms = dynamicMergeAllRooms(orderedRooms, GLOBAL_ROOM_COORDINATES);

    var zoomLevelsCoordinates = fillZoomLevels(dynamicMergedRooms, oldRooms);

    fillZoomLevelPolygons(zoomLevelsCoordinates);

    roomCoordinates = simplifyRoomsMadeBySomeDude(roomCoordinates, VERY_IMPORTANCE_DISTANCE);

    var textZoomLevels = makeMergedNameStrings(dynamicMergedRooms, globalNameList);

    convertMergedTextIntoPOIs(textZoomLevels, zoomLevelsCoordinates);

    [globalMergedCorridorCoordinates, corridorContainer] = mergeCorridors();
	[globalMergedCorridorCoordinates, corridorContainer] = removeDuplicateRooms(globalMergedCorridorCoordinates, corridorContainer);
    GLOBAL_ALL_COORDINATES[2] = deepCopy(globalMergedCorridorCoordinates);

    fillMergedCoordinates(globalMergedCorridorCoordinates);

    // var textZoomLevels = makeMergedNameStrings(dynamicMergedRooms, globalNameList);

    // convertMergedTextIntoPOIs(textZoomLevels, zoomLevelsCoordinates);

 //    // Store coordinates in localStorage if it is not there already
    // if (localStorage.getItem('allCoordinates'+FLOOR_ID) === null) {
        localStorage.setItem('allCoordinates'+FLOOR_ID, JSON.stringify(GLOBAL_ALL_COORDINATES));
        storeMergedRoomNames(textZoomLevels);
    // }
}

// Uncomment to clear localStorage
// localStorage.clear();

