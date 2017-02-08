var FLOOR_ID = "56";
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

    [roomCoordinates, container] = mergeAllPolygons(neighbors, roomCoordinates);

    getUnmergedRooms(container, oldRooms);

    [roomCoordinates, container] = removeDuplicateRooms(roomCoordinates, container);

    globalMergedCorridorsCoordinates = mergeCorridors();

    orderedRooms = findOrderOfRooms(oldNeighbors, container);

    dynamicMergedRooms = dynamicMergeAllRooms(orderedRooms);

    var zoomLevelsCoordinates = fillZoomLevels(dynamicMergedRooms, oldRooms);
    fillZoomLevelPolygons(zoomLevelsCoordinates);

    roomCoordinates = simplifyRoomsMadeBySomeDude(roomCoordinates);

    fillglobalMergedPolygons(roomCoordinates, globalMergedPolygons, container);

    var textZoomLevels = makeMergedNameStrings(dynamicMergedRooms, globalNameList);

    convertMergedTextIntoPOIs(textZoomLevels, zoomLevelsCoordinates);

    // console.log(globalCorridorCoordinates);
    // console.log(getNeighborsCorridors(globalCorridorCoordinates));
    // var colors = ["red", "blue", "yellow", "green", "black", "orange"];
    // for (var i = 0; i < globalCorridorCoordinates.length; i++) {
    //     if (globalCorridorCoordinates[i].length != 2){
    //         Maze.popup().setLatLng(getPoint(globalCorridorCoordinates[i])).setContent(i.toString()).addTo(MAP);
    //         // Maze.marker(getPoint(globalCorridorCoordinates[i]), {html: i}).addTo(MAP);
    //     }
    // }

    // var a = [0, 0];
    // var b = [5, 0];
    // var c = [-2, 2];
    // cs = [[-2, 2],[2,2],[7,2],[7,-2],[2,-2],[-2,-2]];
    // for (var i = 0; i < cs.length; i++) {
    //     c = cs[i];
    //     var AB = makeLine(a,b);
    //     var BA = makeLine(b,a);
    //     var AC = makeLine(a,c);
    //     var BC = makeLine(b,c);
    //     console.log(i);
    //     console.log(mergeablePoint(AB, AC));
    //     console.log(mergeablePoint(BC, BA));
    // }
    //

    // var point1 = [63.41826,10.40165];
    // Maze.popup().setLatLng(point1).setContent("Start point").addTo(MAP);
    // var polygon1 = globalCorridorCoordinates[0];
    // drawPolygonFromOnlyCoordinates(polygon1, "white", "blue");
    // createPointShortestDistance(point1, polygon1);
var arr = [];
arr[0] = [0,0];
arr[1] = [1,1];
arr[2] = [2,2];
arr[3] = [4,4];
arr[4] = [5,5];

console.log(deepCopy(arr));
arr.splice(0, 0, [3,3]);
console.log(arr);
}
