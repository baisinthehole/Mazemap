// makes it possible to draw several popups, instead of just one
Maze.Map = Maze.Map.extend({
    openPopup: function(popup) {
        //        this.closePopup();  // just comment this
        this._popup = popup;

        return this.addLayer(popup).fire('popupopen', {
            popup: this._popup
        });
    }
});
var globalMergedCorridorsCoordinates = [];
// enum for all room types
var ROOM_TYPE = {"OFFICE": 1, "CORRIDOR": 2, "STAIRS": 3, "COMPUTER_LAB": 4, "MEETING_ROOM": 5, "LECTURE_HALL": 6, "STUDY_ROOM": 7, "NOT_AVAILABLE": 8, "TOILETS": 9, "STORAGE_ROOM": 10, "LAB": 11, "COPY_ROOM": 12, "TECHNICAL": 13, "WARDROBE": 14, "SHOWER": 15, "GROUP_ROOM": 16, "INSTITUTE": 17, "FRAT": 18, "DRAWING_ROOM": 19, "LIBRARY": 20, "TEACHING_ROOM": 21, "STORE": 22, "CANTEEN": 23, "SIT": 24, "BUS_STOP": 27, "PARKING_LOT": 28, "WORKSHOP": 29, "ROOM":91};

// thickness of stairs
var STAIR_WEIGHT = 0.2;

// thickness of rooms received from server
var SERVER_WEIGHT = 0.5;

// thickness of rooms received from local files
var LOCAL_WEIGHT = 0.5;

// distance between rooms, when determining neighbors
var VERY_IMPORTANCE_DISTANCE = 0.0000011523708237294147*4;

var DISTANCE_FOR_FINDING_PAIRS = 2;

// radial distance between points when removing duplicate points
var MINIMUM_DISTANCE = 0.000001;

// threshold for circumference of rooms
var CIRCUMFERENCE_THRESHOLD = 0.0005;

// raw data received from server
var RAW_RESPONSE;

// geoJSON parsed from the raw data
var GEO_JSON;

// all coordinates
var GLOBAL_ALL_COORDINATES = [];
for (var i = 0; i < 11; i++) {
    GLOBAL_ALL_COORDINATES.push([]);
}

var GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID = [];
for (var i = 0; i < 11; i++) {
    GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID.push([]);
}

var GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID = [];
for (var i = 0; i < 5; i++) {
    GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID.push([]);
}

// all room coordinates
var GLOBAL_ROOM_COORDINATES;

// all corridor coordinates
var GLOBAL_CORRIDOR_COORDINATES;

// three levels of merged room polygons
var mergedLarge = [];
var mergedMedium = [];
var mergedSmall = [];

// three levels of merged room name markers
var mergedTextSmall = [];
var mergedTextMedium = [];
var mergedTextLarge = [];

// merged corridor polygons
var globalMergedCorridorPolygons = [];

// simplified room coordinates that are never merged
var globalUnmergedRoomsSimplified = [];

// simplified room polygons that are never merged
var globalUnmergedPolygonsSimplified = [];

// orginal room coordinates that are never merged
var globalUnmergedRooms = [];

// original room polygons that are never merged
var globalUnmergedPolygons = [];

// room names that are never merged
var globalUnmergedNames = [];


// One array of coordinates for each type of polygon
var globalRoomCoordinates = [];

// all individual room ploygons
var globalRoomPolygons = [];

// stair polygons
var globalStairPolygons = [];

// outline polygons
var globalOutlinePolygons = [];

// door polygons
var globalDoorPolygons = [];

// corridor coordinates
var globalCorridorCoordinates = [];

// corridor polygons
var globalCorridorPolygons = [];

// only merged polygons
var globalMergedPolygons = [];

// all room name markers
var globalRoomNames = [];

// all coordinates of the room name markers
var globalRoomNameCoordinates = [];

// all room name strings
var globalNameList = [];

// all unmerged room name strings
var globalUnmergedNameList = [];

var GLOBAL_ROOM_NAMES = [globalNameList, globalUnmergedNameList];

// all polygons
var polygonList;

// indices in polygonList drawn without vectorGridSlicer
var withoutVectorGridSlicer = [1,2,3,4,5,6,9,10];

// contains all the data that are displayed on different zoom levels and updates display accordingly
function zoom() {

    // contains all kinds of polygons displayed on different levels
    polygonList = [globalOutlinePolygons, globalCorridorPolygons, globalMergedCorridorPolygons, mergedLarge, mergedMedium, mergedSmall, globalRoomPolygons, globalDoorPolygons, globalStairPolygons, globalUnmergedPolygonsSimplified, globalUnmergedPolygons];
    console.log(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID);
    console.log(polygonList);

    // contains all kinds of room names displayed on different levels
    var nameList = [globalRoomNames, globalUnmergedNames, mergedTextLarge, mergedTextMedium, mergedTextSmall];

    // contains all polygons that are currently displayed
    var nowDrawings = [];

    // contains all room names that are currently displayed
    var nowNames = [];

    // keeps information about which zoom levels different polygons will be displayed or not
    var drawings;

    // keeps information about which zoom levels different room names will be displayed or not
    var names;

    for (var i = 0; i < polygonList.length; i++) {
        nowDrawings.push(false);
    }
    for (var i = 0; i < nameList.length; i++) {
        nowNames.push(false);
    }
    // Zoom listener, is triggered on every change in zoom level
    MAP.on('zoomend', function () {
        console.log(MAP.getZoom());
        if (MAP.getZoom() < 16){
            drawings = [false, false, false, false, false, false, false, false, false, false, false];
            names = [false, false, false, false, false];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 17){
            drawings = [true, false, false, false, false, false, false, false, false, false, false];
            names = [false, false, false, false, false];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 18){
            drawings = [true, false, true, true, false, false, false, false, false, false, true];
            names = [false, false, false, false, false];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 19){
            drawings = [true, false, true, false, true, false, false, false, false, false, true];
            names = [false, false, false, false, false];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 20){
            drawings = [true, false, true, false, false, true, false, false, false, false, true];
            names = [false, true, false, false, true];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 21){
            drawings = [true, true, false, false, false, false, true, true, true, false, false];
            names = [true, false, false, false, false];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else {
            drawings = [true, true, false, false, false, false, true, true, true, false, false];
            names = [true, false, false, false, false];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
    });
}

// draws and removes polygons and room names when zooming
function superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList) {
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
    for (var i = 0; i < names.length; i++) {
        if (names[i] != nowNames[i]){
            if (!nowNames[i]){
                for (var j = 0; j < nameList[i].length; j++) {
                    MAP.addLayer(nameList[i][j]);
                }
            }
            else if (nowNames[i]){
                for (var j = 0; j < nameList[i].length; j++) {
                    MAP.removeLayer(nameList[i][j]);
                }
            }
            nowNames[i] = !nowNames[i];
        }
    }
    return [nowDrawings, nowNames];
}

/* JSON object from server */
function getJSONfromServer() {
    // Listen for the event.
    document.getElementById('mazemap-container').addEventListener('responseTextChange', function () { recievedJSONfromServer() }, false);

    // url for requesting the data
    getHttp("http://api.mazemap.com/api/pois/?campusid=1&floorid="+FLOOR_ID+"&srid=4326");
}

// This will be run when we know we have received the data from the server
function recievedJSONfromServer() {
    var geoJSON = JSON.parse(RAW_RESPONSE);

    for (var i = geoJSON.pois.length -1; i >= 0 ; i--) {
        var poiTypeRoom = false;
        for (var j = 0; j < geoJSON.pois[i].infos.length; j++) {
            if (geoJSON.pois[i].infos[j].poiTypeId == ROOM_TYPE.ROOM){
                poiTypeRoom = true;
            }
        }
        if (!poiTypeRoom){
            console.log("Trying to delete");
            geoJSON.pois.splice(i, 1);
        }
    }

    // edits JSON file
    geoJSON = alterJSONfile(geoJSON, FLOOR_ID, 1);
    console.log(geoJSON);

    GEO_JSON = geoJSON;
    fillCoordinateTypeServer(geoJSON, globalCorridorCoordinates, globalCorridorPolygons, ROOM_TYPE.CORRIDOR, roomOutlineColor, mergedCorridorColor, 1, "polygon");
    fillCoordinateTypeServer(geoJSON, globalRoomCoordinates, globalRoomPolygons, ROOM_TYPE.ROOM, roomOutlineColor, roomColor, 1, "line");
    GLOBAL_ROOM_COORDINATES = deepCopy(globalRoomCoordinates);
    GLOBAL_ALL_COORDINATES[6] = deepCopy(globalRoomCoordinates);
    GLOBAL_CORRIDOR_COORDINATES = deepCopy(globalCorridorCoordinates);
    GLOBAL_ALL_COORDINATES[1] = deepCopy(GLOBAL_CORRIDOR_COORDINATES);

    removedDuplicatePoints = removeDuplicatesFromAllRooms(globalRoomCoordinates);
    // var simplifiedRoomCoordinates = simplifyRoomsMadeBySomeDude(removedDuplicatePoints);

    // This function is defined in main.js
    createglobalMergedPolygons(geoJSON, removedDuplicatePoints);
    if (localStorage.getItem('everything'+FLOOR_ID) === null) {
        localStorage.setItem('everything'+FLOOR_ID, JSON.stringify(polygonList));
    }


}

  // Function for requesting JSON object from server
function getHttp(url) {
    // Create event for handling asynchronous responses from the server
    var event = new Event('responseTextChange');
    var info = new XMLHttpRequest();
    // Asynchronous HTTP request
    info.open( "GET", url, true );
    info.send();
    info.onreadystatechange = function(error) {
        if (info.readyState == 4 && info.status == 200) {
            console.log("successfully retrieved response from the server");
            RAW_RESPONSE = info.responseText;
            // Dispatch the event, which will make the rest of the program happen
            document.getElementById('mazemap-container').dispatchEvent(event);
        }
        else {
            //console.error("Error", error);
        }
    }
}


/* JSON object from local file */
function getLocalJSON(filename) {
    loadJSON(filename,
        function(data) { recievedLocalJSON(data); },
        function(xhr) { console.error(xhr); }
    );
}
function recievedLocalJSON(data) {
    var color = ['blue', 'gray', 'green', 'black'];
    // Fill the coordinate arrays for each type of polygon and draw to map
    for (var i = 0; i < data.features.length; i++) {
        // if (data.features[i].geometry.coordinates.length == 1){
            if (data.features[i].properties.campusId == 1){
                if (data.features[i].properties.layer == "outlines"){
                    switchLatLong(data.features[i].geometry.coordinates[0]);
                    GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[0].push(data.features[i].geometry.coordinates[0]);
                }
                else if (data.features[i].properties.layer == "stairs"){
                    switchLatLong(data.features[i].geometry.coordinates);
                    GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[8].push(data.features[i].geometry.coordinates);
                }
                else if (data.features[i].properties.layer == "doors"){
                    switchLatLong(data.features[i].geometry.coordinates);
                    GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[7].push(data.features[i].geometry.coordinates);
                }
            }
        // }
    }
    drawFromLocalStorage();
    zoom();
}

function renderGeoJSON(geoJSON, fillColor, color) {
	return L.vectorGrid.slicer(geoJSON, {
        maxZoom: 25,
        vectorTileLayerStyles: {
            sliced: {   
                "fillColor": fillColor,
                "color": color,
                "fill": true,
            }
        }
    });
}

function renderGeoJSONTop(geoJSON, fillColor, color) {
    return L.vectorGrid.slicer(geoJSON, {
        maxZoom: 25,
        vectorTileLayerStyles: {
            sliced: {   
                "fillColor": fillColor,
                "color": color,
                "fill": true,
            }
        },
        // render in a different pane with a higher z-index
        pane: "topMAP"
    });
}

function makeGeoJSON (coordinates, type) {
	for (var i = 0; i < coordinates.length; i++) {
        // coordinate is not a point
        if (coordinates[i][0].constructor === Array) {
    		if (coordinates[i][0][0].constructor === Array) {
    			for (var j = 0; j < coordinates[i].length; j++) {
    				switchLatLong(coordinates[i][j]);
    			}
    		}
    		else { // if (type != "LineString") {
    			switchLatLong(coordinates[i]);
    		}
        }
	}

	result = {type: "FeatureCollection", features: []};
	for (var i = 0; i < coordinates.length; i++) {
        if (coordinates[i][0].constructor === Array) {
    		if (coordinates[i][0][0].constructor === Array) {
    			result.features.push({"type": "Feature", "geometry": {"coordinates": [], "type": "MultiPolygon"}, "properties": {"layer": "hallways"}});
    			moveBiggestRoomFirst(coordinates[i]);
    			for (var j = 0; j < coordinates[i].length; j++) {
    				if (coordinates[i][j][0] != coordinates[i][j][coordinates[i].length - 1]) {
    					coordinates[i][j].push(coordinates[i][j][0]);
    				}
    			}
    		}
    		else {
    			result.features.push({"type": "Feature", "geometry": {"coordinates": [], "type": type}, "properties": {"layer": "hallways"}});
    			if (coordinates[i][0] != coordinates[i][coordinates.length - 1] && type == "Polygon") {
    				coordinates[i].push(coordinates[i][0]);
    			}
    		}
        }
        else {
                result.features.push({"type": "Feature", "geometry": {"coordinates": [], "type": type}, "properties": {"layer": "hallways"}});
        }

		result.features[i].geometry.coordinates.push(coordinates[i]);
	}
	return result;
}

function moveBiggestRoomFirst(coordinates) {
	var index = getBiggestRoom(coordinates);
	var temp = coordinates[0];
	coordinates[0] = coordinates[index];
	coordinates[index] = temp;
}

function switchLatLong(coordinates) {
    for (var i = 0; i < coordinates.length; i++) {
        var temp = coordinates[i][0];
        coordinates[i][0] = coordinates[i][1];
        coordinates[i][1] = temp;
    }
}

function fillStairCoordinates(data, coordinates, polygonList, coordinateType, color, lineOrPolygon) {
	for (var i = 0; i < data[coordinateType].features.length; i++) {
        for (var j = 0; j < data[coordinateType].features[i].geometry.coordinates.length; j++) {
        	coordinates.push(data[coordinateType].features[i].geometry.coordinates[j]);
        	for (var k = 0; k < coordinates[i].length; k++) {
	            temp = coordinates[coordinates.length - 1][k][0];
	            coordinates[coordinates.length - 1][k][0] = coordinates[coordinates.length - 1][k][1];
	            coordinates[coordinates.length - 1][k][1] = temp;
	        }
	    }
	}
	for (var i = 0; i < coordinates.length; i++) {
        if (lineOrPolygon == "line") {
            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: STAIR_WEIGHT}));
        }
        else {
            polygonList.push(Maze.polygon(coordinates[i], {color: color, weight: STAIR_WEIGHT}));
        }
    }
}

function fillCoordinateTypeServer(data, coordinates, polygonList, coordinateType, color, fillColor, fillOpacity, lineOrPolygon) {
    for (var i = 0; i < data.pois.length; i++) {
        // Add empty room coordinates with empty name if the room is a corridor
        if (checkPoiType(data.pois[i].infos, ROOM_TYPE.CORRIDOR) && coordinateType == ROOM_TYPE.ROOM){
            if (data.pois[i].geometry.coordinates[0].constructor === Array){
                coordinates.push([]);
            }
            else {
                coordinates.push(deepCopy(data.pois[i].geometry.coordinates));
                temp = coordinates[coordinates.length - 1][0];
                coordinates[coordinates.length - 1][0] = coordinates[coordinates.length - 1][1];
                coordinates[coordinates.length - 1][1] = temp;
            }
            makeRoomNames([0,0], "");
        }
        else{
            if (checkPoiType(data.pois[i].infos, coordinateType)) {
                if (data.pois[i].geometry.coordinates[0].constructor === Array){
                    coordinates.push(deepCopy(data.pois[i].geometry.coordinates[0]));
                    // if (coordinates[coordinates.length - 1][0][0] < 30){
                        for (k = 0; k < coordinates[coordinates.length - 1].length; k++) {
                            temp = coordinates[coordinates.length - 1][k][0];
                            coordinates[coordinates.length - 1][k][0] = coordinates[coordinates.length - 1][k][1];
                            coordinates[coordinates.length - 1][k][1] = temp;
                        }
                    // }
                }
                else {
                    coordinates.push(deepCopy(data.pois[i].geometry.coordinates));
                    temp = coordinates[coordinates.length - 1][0];
                    coordinates[coordinates.length - 1][0] = coordinates[coordinates.length - 1][1];
                    coordinates[coordinates.length - 1][1] = temp;
                }
                if (coordinateType == ROOM_TYPE.ROOM){
                    makeRoomNames(coordinates[coordinates.length-1], data.pois[i].title);
                }
            }
        }
    }
    for (var i = 0; i < coordinates.length; i++) {
        if (coordinates[i].length == 0){
            polygonList.push(Maze.polyline([[0,0]], {color: color, weight: 0}));
        }
        else if (lineOrPolygon == "line") {
            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: SERVER_WEIGHT}));
        }
        else {
            polygonList.push(Maze.polygon(coordinates[i], {color: color, fillColor: fillColor, weight: SERVER_WEIGHT, fillOpacity: fillOpacity}));
        }
    }
}

function findFarthestRooms(container) {
    var maxDistance = 0;
    var maxIndex1 = 0;
    var maxIndex2 = 0;
    for (var i = 0; i < container.length; i++) {
        for (var j = 0; j < container.length; j++) {
            if (container[i] != container[j]) {
                if (getDistanceBetweenTwoPoints(getPoint(globalRoomCoordinates[container[i]]), getPoint(globalRoomCoordinates[container[j]])) > maxDistance) {
                    maxDistance = getDistanceBetweenTwoPoints(getPoint(globalRoomCoordinates[container[i]]), getPoint(globalRoomCoordinates[container[j]]));
                    maxIndex1 = container[i];
                    maxIndex2 = container[j];
                }
            }
        }
    }
    return [maxIndex1, maxIndex2];
}

function fillPolygons(coordinates, polygonList, color, fillColor, lineOrPolygon, fillOpacity) {
    for (var i = 0; i < coordinates.length; i++) {
        if (lineOrPolygon == "line") {
            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: SERVER_WEIGHT}));
        }
        else {
            polygonList.push(Maze.polygon(coordinates[i], {color: color, fillColor: fillColor, fillOpacity: fillOpacity, weight: SERVER_WEIGHT}));
        }
        //console.log(polygonList[i]);
    }
}

function fillZoomlevelPolygons(coordinates, polygonList, nameList, color, fillColor, lineOrPolygon, fillOpacity) {
    var baseColor = fillColor;
    for (var i = 0; i < coordinates.length; i++) {
        if (!nameList[i].includes(' - ')) {
            fillColor = "white";
        }
        if (lineOrPolygon == "line") {
            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: SERVER_WEIGHT}));
        }
        else {
            polygonList.push(Maze.polygon(coordinates[i], {color: color, fillColor: fillColor, fillOpacity: fillOpacity, weight: SERVER_WEIGHT}));
        }
        fillColor = baseColor;
    }
}

  // Function for loading local JSON object
function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function getRoomCircumference(singleRoomCoordinates) {

    var circumference = 0;

    for (var i = 0; i < singleRoomCoordinates.length - 1; i++) {
        circumference += Math.abs(singleRoomCoordinates[i + 1][0] - singleRoomCoordinates[i][0]);
        circumference += Math.abs(singleRoomCoordinates[i + 1][1] - singleRoomCoordinates[i][1]);
    }

    return circumference;
}

function drawPolygons(polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        for (var j = 0; j < polygonList[i].length; j++) {
            if (polygonList[i][j]._latlngs.length > 1) {
                if (polygonList[i][j]._latlngs[0]) {
                    MAP.addLayer(polygonList[i][j]);
                }
            }
            else if (polygonList[i][j]._latlngs[0][0]) {
                MAP.addLayer(polygonList[i][j]);
            }
            else {
                console.log("Trying to draw a non-polygon");
                // console.log(polygonList[i]._latlngs);
            }
        }
    }
}

function removePolygons(polygonList) {
    // MAP.removeLayer(polygonList);
    for (var i = 0; i < polygonList.length; i++) {
        for (var j = 0; j < polygonList[i].length; j++) {
            MAP.removeLayer(polygonList[i][j]);
        }
    }
}

function drawVectorGridSlicedPolygons(polygonList) {
    polygonList.addTo(MAP);
}

function removeVectorGridSlicedPolygons(polygonList) {
    polygonList.removeFrom(MAP);
}

function drawVectorGridSlicedDoors(doors) {
    L.polyline(doors, {
        pane: "doorMAP"
    }).addTo(MAP);

    console.log(MAP.getPane("doorMAP"));
}

function removeVectorGridSlicedDoors(doors) {
    L.polyline(doors, {
        pane: "doorMAP"
    }).removeFrom(MAP);
}


function makeRoomNames(coordinates, title) {
    var myIcon;
    globalNameList.push(title);
    if (coordinates.length == 2) {
        myIcon = Maze.divIcon({
            className: "labelClass",
            iconSize: new Maze.Point(title.length * 6.5, 20),
            html: title
        });
        globalRoomNames.push(Maze.marker(coordinates, {icon: myIcon}));
    }
    else {
        if (coordinates.length > 0){
            point = getPoint(coordinates);
            myIcon = Maze.divIcon({
                className: "labelClass",
                iconSize: new Maze.Point(title.length * 6.5, 20),
                html: title
            });
            globalRoomNames.push(Maze.marker(point, {icon: myIcon}));
        }
    }
}

function makeLocalRoomNames(coordinates, title) {
    var myIcon;
    var nameMarker;
    if (coordinates.length == 2) {
        myIcon = Maze.divIcon({
            className: "labelClass",
            iconSize: new Maze.Point(title.length * 6.5, 20),
            html: title
        });
        nameMarker = (Maze.marker(coordinates, {icon: myIcon}));
    }
    else {
        if (coordinates.length > 0){
            point = getPoint(coordinates);
            myIcon = Maze.divIcon({
                className: "labelClass",
                iconSize: new Maze.Point(title.length * 6.5, 20),
                html: title
            });
            nameMarker = (Maze.marker(point, {icon: myIcon}));
        }
    }

    return nameMarker;
}


function getPoint(coordinates){
    if (coordinates[0][0].constructor === Array) {
        var index = getBiggestRoom(coordinates);
        coordinates = coordinates[index];
    }
    var minX = coordinates[0][0];
    var minY = coordinates[0][1];
    var maxX = coordinates[0][0];
    var maxY = coordinates[0][1];
    for (var i = 0; i < coordinates.length; i++) {
        if (coordinates[i][0] < minX){
            minX = coordinates[i][0];
        }
        else if (coordinates[i][0] > maxX){
            maxX = coordinates[i][0];
        }
        if (coordinates[i][1] < minY){
            minY = coordinates[i][1];
        }
        else if (coordinates[i][1] > maxY){
            maxY = coordinates[i][1];
        }
    }
    return [(minX+maxX)/2, (minY+maxY)/2];
}

function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
}

function getDistanceBetweenTwoPoints(point1, point2) {
	return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
}

function getMinDist(coord1, coord2){
    var minDist = 1234343231;
    var dist;
    for (var k = 0; k < coord1.length; k++) {
        for (var l = 0; l < coord2.length; l++) {
            dist = getDistPoints(coord1[k], coord2[l]);
            if (dist < minDist){
                minDist = dist;
            }
        }
    }
    return minDist;
}

function getNeighbors(data, simplified){
    var neighbors = [];
    var result;
    var indeces = [];
    for (var i = 0; i < simplified.length; i++) {
        var adjacent = [];
        for (var j = 0; j < simplified.length; j++) {
            if (i!=j){
                result = getDistPolyToPoly(simplified[i], simplified[j]);
                if (result[2] < VERY_IMPORTANCE_DISTANCE) {
                    if (poiTypeNotCorridor(data.pois[i].infos, data.pois[j].infos, i)){
                        adjacent.push(j);
                    }
                }
            }
        }
        neighbors.push(adjacent);
    }
    return neighbors;
}

function getNeighborsCorridors(corridorCoordinates){
    var neighbors = [];
    var result;
    var indeces = [];
    for (var i = 0; i < corridorCoordinates.length; i++) {
        var adjacent = [];
        for (var j = 0; j < corridorCoordinates.length; j++) {
            if (i!=j){
                // result = getDistPolyToPoly(corridorCoordinates[i], corridorCoordinates[j]);
                // // dived by 100 to only get rooms that are almost on top of each other
                // if (result[2] < VERY_IMPORTANCE_DISTANCE/100) {
                //     adjacent.push(j);
                // }
                result = getSecondClosestPoints(corridorCoordinates[i], corridorCoordinates[j]);
                if (result[2] < VERY_IMPORTANCE_DISTANCE) {
                    adjacent.push(j);
                }
                else if (getMinDistPolyToPoly(corridorCoordinates[i], corridorCoordinates[j]) < VERY_IMPORTANCE_DISTANCE) {
                    if (isOnePointNeighbor(corridorCoordinates[i], corridorCoordinates[j])) {
                        adjacent.push(j);
                    }
                }
            }
        }
        neighbors.push(adjacent);
    }
    return neighbors;
}

function isOnePointNeighbor(polygon1, polygon2){
    // get closest points
    indexes = getClosestPointForEachPolygon(polygon1, polygon2);
    var index1 = indexes[0];
    var index2 = indexes[1];
    // create lines
    var line11 = [polygon1[index1], polygon1[mod(index1+1, polygon1.length-1)]];
    var line12 = [polygon1[mod(index1-1, polygon1.length-1)], polygon1[index1]];
    var line21 = [polygon2[index2], polygon2[mod(index2+1, polygon2.length-1)]];
    var line22 = [polygon2[mod(index2-1, polygon2.length-1)], polygon2[index2]];
    // use dot product to see if shortest line form point to line is orthogonal
    var isOrth1 = isShortestLineFromPointToLineOrthogonal(polygon1[index1], line21);
    var isOrth2 = isShortestLineFromPointToLineOrthogonal(polygon1[index1], line22);
    var isOrth3 = isShortestLineFromPointToLineOrthogonal(polygon2[index2], line11);
    var isOrth4 = isShortestLineFromPointToLineOrthogonal(polygon2[index2], line12);
    return  ((isOrth1 || isOrth2) || (isOrth3 || isOrth4));
}

function isShortestLineFromPointToLineOrthogonal(point, line){
    dotResult0 = dotProd(makeLine(line[0],line[1]), makeLine(line[0],point));
    dotResult1 = dotProd(makeLine(line[1],line[0]), makeLine(line[1],point));
    if (dotResult0 > 0 && dotResult1 > 0){
        return true;
    }
    return false;
}

function getLinesOnEachSideOfIndex(polygon1, index1){
    var line1 = makeLine(polygon1[index], polygon1[mod(index+1, polygon1.length-1)]);
    var line2 = makeLine(polygon1[mod(index-1, polygon1.length-1)], polygon1[index]);
    return [line1, line2];
}

function getClosestPointForEachPolygon(polygon1, polygon2){
    var minDist = Infinity;
    var dist;
    for (var i = 0; i < polygon1.length; i++) {
        dist = getMinDistToPoly(polygon1[i], polygon2);
        if (dist < minDist){
            minDist = dist;
            index1 = i;
        }
    }
    minDist = Infinity;
    for (i = 0; i < polygon2.length; i++) {
        dist = getMinDistToPoly(polygon2[i], polygon1);
        if (dist < minDist){
            minDist = dist;
            index2 = i;
        }
    }
    return [index1, index2];
}

function getClosestPointInPolygonToPoint(point, polygon) {
    var minDist = Infinity;
    var index;
    var dist;
    for (var i = 0; i < polygon.length; i++) {
        dist = getDistPoints(point, polygon[i]);
        if (dist < minDist) {
            minDist = dist;
            index = i;
        }
    }
    return index;
}

function samePoiTypeByPriority(infos1, infos2, roomNumber){
    var priority1 = 1000;
    var priority2 = 1000;
    var type1;
    var type2;
    for (var i = 0; i < infos1.length; i++) {
        if (infos1[i].priority < priority1){
            priority1 = infos1[i].priority;
            type1 = infos1[i].poiTypeId;
        }
    }
    for (var i = 0; i < infos2.length; i++) {
        if (infos2[i].priority < priority2){
            priority2 = infos2[i].priority;
            type2 = infos2[i].poiTypeId;
        }
    }
    return type1==type2;
}

function samePoiType(infos1, infos2, roomNumber){
    var type1 = 10000;
    var type2 = 10000;
    for (var i = 0; i < infos1.length; i++) {
        if (infos1[i].poiTypeId < type1){
            type1 = infos1[i].poiTypeId;
        }
    }
    for (var i = 0; i < infos2.length; i++) {
        if (infos2[i].poiTypeId < type2){
            type2 = infos2[i].poiTypeId;
        }
    }
    return type1==type2;
}

function samePoiTypeNotCorridors(infos1, infos2, roomNumber){
    var type1 = 10000;
    var type2 = 10000;
    for (var i = 0; i < infos1.length; i++) {
        if (infos1[i].poiTypeId < type1){
            type1 = infos1[i].poiTypeId;
        }
        if (infos1[i].poiTypeId == ROOM_TYPE.CORRIDOR){
            return false;
        }
    }
    for (var i = 0; i < infos2.length; i++) {
        if (infos2[i].poiTypeId < type2){
            type2 = infos2[i].poiTypeId;
        }
        if (infos2[i].poiTypeId == ROOM_TYPE.CORRIDOR){
            return false;
        }
    }
    return type1==type2;
}

function poiTypeOffice(infos1, infos2, roomNumber){
    var type1 = 10000;
    var type2 = 10000;
    var nrOffice = 0;
    for (var i = 0; i < infos1.length; i++) {
        if (infos1[i].poiTypeId < type1){
            type1 = infos1[i].poiTypeId;
        }
        if (infos1[i].poiTypeId == ROOM_TYPE.OFFICE){
            nrOffice++;
        }
    }
    for (var i = 0; i < infos2.length; i++) {
        if (infos2[i].poiTypeId < type2){
            type2 = infos2[i].poiTypeId;
        }
        if (infos2[i].poiTypeId == ROOM_TYPE.OFFICE){
            nrOffice++;
        }
    }
    return nrOffice>=2;
}

function poiTypeNotCorridor(infos1, infos2) {
    if (checkPoiType(infos1, ROOM_TYPE.CORRIDOR) || checkPoiType(infos2, ROOM_TYPE.CORRIDOR)) {
        return false;
    }
    return true;
}

function checkPoiType(infos, poiType){
    var same = false;
    for (var i = 0; i < infos.length; i++) {
        if (infos[i].poiTypeId == poiType){
            same = true;
        }
    }
    return same;
}

function getMinDistPolyToPoly(polygon1, polygon2){
    var minDist = Infinity;
    var dist;
    for (var i = 0; i < polygon1.length-1; i++) {
        dist = getMinDistToPoly(polygon1[i], polygon2);
        if (dist < minDist){
            minDist = dist;
        }
    }
    return minDist;
}

function getDistPolyToPoly(polygon1, polygon2){
    var minDist = 12345465321;
    var secondMinDist = 12345465321;
    var result;
    var index1;
    var index2;
    for (var i = 0; i < polygon1.length-1; i++) {
        dist = getMinDistToPoly(polygon1[i], polygon2);
        if (dist < minDist){
            secondMinDist = minDist;
            index2 = index1;
            minDist = dist;
            index1 = i;
        }
        else if (dist < secondMinDist){
            secondMinDist = dist;
            index2 = i;
        }
    }
    return [index1, index2, secondMinDist];
}


function getSecondClosestPoints(polygon1, polygon2){
    var minDist = Infinity;
    var result;
    var index1;
    var index2;
    for (var i = 0; i < polygon1.length-1; i++) {
        dist = getMinDistToPoly(polygon1[i], polygon2);
        if (dist < minDist){
            minDist = dist;
            index1 = i;
        }
    }
    minDist = Infinity;
    for (i = 0; i < polygon1.length-1; i++) {
        dist = getMinDistToPoly(polygon1[i], polygon2);
        if (dist < minDist && getDistPoints(polygon1[i], polygon1[index1]) > VERY_IMPORTANCE_DISTANCE){
            minDist = dist;
            index2 = i;
        }
    }
    return [index1, index2, minDist];
}

function getMinDistToPoly(point1, polygon1){
    var minDist = 12345465432;
    var dist;
    for (var i = 0; i < polygon1.length-1; i++) {
        dist = getMinDistToLine(point1,[polygon1[i],polygon1[i+1]]);
        if (dist<minDist){
            minDist = dist;
        }
    }
    return minDist;
}

function getMinDistToPolyPoints(point1, polygon1){
    var minDist = 12345465432;
    var dist;
    for (var i = 0; i < polygon1.length-1; i++) {
        dist = getDistPoints(point1,polygon1[i]);
        if (dist<minDist){
            minDist = dist;
        }
    }
    return minDist;
}

function getClosestLineInPoly(point1, polygon1){
    var minDist = 12345465432;
    var dist;
    var line;
    for (var i = 0; i < polygon1.length-1; i++) {
        dist = getMinDistToLine(point1,[polygon1[i],polygon1[i+1]]);
        if (dist<minDist){
            minDist = dist;
            line = [polygon1[i], polygon1[i+1]];
        }
    }
    return line;
}

function getClosestLineIndex(point1, polygon1){
    var minDist = 12345465432;
    var dist;
    var index;
    for (var i = 0; i < polygon1.length-1; i++) {
        dist = getMinDistToLine(point1,[polygon1[i],polygon1[i+1]]);
        if (dist<minDist){
            minDist = dist;
            index = i;
        }
    }
    return index;
}

function getMinDistToLine(point, line){
    dotResult0 = dotProd(makeLine(line[0],line[1]), makeLine(line[0],point));
    // dotResult0 /= (getDist(point,line[0])*getDist(line[1],line[0]));
    dotResult1 = dotProd(makeLine(line[1],line[0]), makeLine(line[1],point));
    // dotResult1 /= (getDist(point,line[1])*getDist(line[1],line[0]));
    if (dotResult0 > 0 && dotResult1 > 0){
        return distPointToLine(point,line[0],line[1]);
    }
    else if (dotResult0 < 0 && dotResult1 >= 0) {
        return getDist(point, line[0]);
    }
    else if (dotResult0 >= 0 && dotResult1 < 0) {
        return getDist(point, line[1]);
    }
    else {
    	return 1337;
    }
}

function makeLine(point1,point2){
    return [point2[0]-point1[0], point2[1]-point1[1]];
}

function getDist(point1, point2){
    return Math.sqrt(Math.pow(point2[0]-point1[0],2)+Math.pow(point2[1]-point1[1],2));
}

function getDistPoints(point1, point2){
    return Math.sqrt(Math.pow((point1[0]-point2[0]),2)+Math.pow((point1[1]-point2[1]),2));
}

function dotProd(line1,line2){
    var sum = 0;
    for (var i = 0; i < line1.length; i++) {
        sum += line1[i] * line2[i];
    }
    return sum;
}

function crossProd(line1,line2){
    return line1[0]*line2[1]-line1[1]*line2[0];
}

function distPointToLine(point,linepoint1,linepoint2){
    a = (linepoint2[1]-linepoint1[1])/(linepoint2[0]-linepoint1[0]);
    b = -1;
    c = linepoint1[1]-a*linepoint1[0];
    return Math.abs(a*point[0]+b*point[1]+c)/Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
}

function getPointOnLineClosestToPoint(point,linepoint1,linepoint2){
    var dotResult0 = dotProd(makeLine(linepoint1,linepoint2), makeLine(linepoint1,point));
    var dotResult1 = dotProd(makeLine(linepoint2,linepoint1), makeLine(linepoint2,point));
    if (dotResult0 < 0 && dotResult1 >= 0) {
        return linepoint1;
    }
    else if (dotResult0 >= 0 && dotResult1 < 0) {
        return linepoint2;
    }
    else if (dotResult0 >= 0 && dotResult1 >= 0) {
        var k = ((linepoint2[1]-linepoint1[1]) * (point[0]-linepoint1[0]) - (linepoint2[0]-linepoint1[0]) * (point[1]-linepoint1[1])) / (Math.pow((linepoint2[1]-linepoint1[1]),2) + Math.pow((linepoint2[0]-linepoint1[0]),2));
        var x4 = point[0] - k * 1 * (linepoint2[1]-linepoint1[1]);
        var y4 = point[1] + k * 1 * (linepoint2[0]-linepoint1[0]);
        return [x4, y4];
    }
    else {
        console.log("This should not happen");
    }
}


function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function getClosestCorner(polygon1, polygon2, indeces1){
    var minDist = 12343556432;
    var index1 = 0;
    var index2 = 0;
    for (var i = 0; i < polygon2.length; i++) {
        for (var j = 0; j < indeces1.length; j++) {
            dist = getDistPoints(polygon2[i],polygon1[indeces1[j]]);
            if (dist < minDist) {
                minDist = dist;
                index1 = indeces1[(j+1)%2];
                index2 = i;
            }
        }
    }
    return [index1, index2];
}

function oneCloseCorner(polygon1, polygon2){
    for (var i = 0; i < polygon1.length; i++) {
        for (var j = 0; j < polygon2.length; j++) {
            if (getDistPoints(polygon1[i],polygon2[j]) < VERY_IMPORTANCE_DISTANCE){
                return true;
            }
        }
    }
    return false;
}

var findOne = function (haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};

function removeDuplicateRooms(roomCoordinates, container){
    var resultRooms = [];
    var resultContainer = [];
    for (var i = 0; i < roomCoordinates.length; i++) {
        if (roomCoordinates.indexOf(roomCoordinates[i]) == i){
            resultRooms.push(roomCoordinates[i]);
            resultContainer.push(container[i]);
        }
    }
    return [resultRooms, resultContainer];
}

function getArea(polygon){
    var sum = 0;
    for (var i = 0; i < polygon.length-1; i++) {
        sum+=polygon[i][0]*polygon[i+1][1]-polygon[i+1][0]*polygon[i][1];
    }
    sum+=polygon[polygon.length-1][0]*polygon[0][1]-polygon[0][0]*polygon[polygon.length-1][1];
    return Math.abs(sum)/2;
}

function computeAreaOfRooms(rooms, indices) {

    var totalArea = 0;

    for (var i of indices) {
        totalArea += getArea(rooms[i]);
    }

    return totalArea;
}

function computeTotalAreaOfAreaList(areaList) {
    var totalArea = 0;
    for (var i = 0; i < areaList.length; i++) {
        totalArea += areaList[i];
    }
    return totalArea;
}

function mergeablePoint(AB, AC){
    if (dotProd(AB, AC) <= 0 && crossProd(AB, AC) > 0){
            return true;
    }
    return false;
}

function crosses(a,b,c,d){
    // Tests if the segment a-b intersects with the segment c-d.
    // Ex: crosses({x:0,y:0},{x:1,y:1},{x:1,y:0},{x:0,y:1}) === true
    // Credit: Beta at http://stackoverflow.com/questions/7069420/check-if-two-line-segments-are-colliding-only-check-if-they-are-intersecting-n
    // Implementation by Viclib (viclib.com).
    var aSide = (d[1] - c[1]) * (a[0] - c[0]) - (d[0] - c[0]) * (a[1] - c[1]) > 0;
    var bSide = (d[1] - c[1]) * (b[0] - c[0]) - (d[0] - c[0]) * (b[1] - c[1]) > 0;
    var cSide = (b[1] - a[1]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[1] - a[1]) > 0;
    var dSide = (b[1] - a[1]) * (d[0] - a[0]) - (b[0] - a[0]) * (d[1] - a[1]) > 0;
    return aSide !== bSide && cSide !== dSide;
}

function crosses2(a,b,c,d){
    // Tests if the segment a-b intersects with the segment c-d.
    // Ex: crosses({x:0,y:0},{x:1,y:1},{x:1,y:0},{x:0,y:1}) === true
    // Credit: Beta at http://stackoverflow.com/questions/7069420/check-if-two-line-segments-are-colliding-only-check-if-they-are-intersecting-n
    // Implementation by Viclib (viclib.com).
    var aSide = (d[1] - c[1]) * (a[0] - c[0]) - (d[0] - c[0]) * (a[1] - c[1]) >= 0;
    var bSide = (d[1] - c[1]) * (b[0] - c[0]) - (d[0] - c[0]) * (b[1] - c[1]) >= 0;
    var cSide = (b[1] - a[1]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[1] - a[1]) >= 0;
    var dSide = (b[1] - a[1]) * (d[0] - a[0]) - (b[0] - a[0]) * (d[1] - a[1]) >= 0;
    return aSide !== bSide && cSide !== dSide;
}

function crossesPolygon(a,b, polygon){
    for (var i = 0; i < polygon.length-1; i++) {
        if (crosses(a,b,polygon[i],polygon[i+1]) && crosses2(a,b,polygon[i],polygon[i+1])){
            return true;
        }
    }
    return false;
}

function squared (x) { return x * x }
function toRad (x) { return x * Math.PI / 180.0 }
function toDeg (x) { return x *180.0 / Math.PI }

function haversineDistance (a, b) {

  // radius of the earth
  var R = 6378137;

  var aLat = a[0];
  var bLat = b[0];
  var aLng = a[1];
  var bLng = b[1];

  var dLat = toRad(bLat - aLat);
  var dLon = toRad(bLng - aLng);

  var f = squared(Math.sin(dLat / 2.0)) + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * squared(Math.sin(dLon / 2.0));
  var c = 2 * Math.atan2(Math.sqrt(f), Math.sqrt(1 - f));

  return R * c;
}

function haversineAngle (a, b) {

    // radius of the earth
    var R = 6378137;

    var aLat = a[0];
    var bLat = b[0];
    var aLng = a[1];
    var bLng = b[1];

    var dLat = toRad(bLat - aLat);
    // dLon is difference in longitude
    var dLon = toRad(bLng - aLng);

    var y = Math.sin(dLon) * Math.cos(bLat);
    var x = Math.cos(aLat)*Math.sin(bLat) - Math.sin(aLat)*Math.cos(bLat)*Math.cos(dLon);
    var brng = toDeg(Math.atan2(y, x));
    return brng;
}

function getAngle(AB, AC){
    var angle = Math.atan2(AB[1], AB[0]) - Math.atan2(AC[1], AC[0]);
    if (angle < 0){
        angle += 2*Math.PI;
    }
    return angle;
}

function mergingAngle(AB, AC){
    var angle = getAngle(AB, AC);
    if (angle >= Math.PI/3 && angle <= 10/9*Math.PI){
        return true;
    }
    return false;
}

function getHaversineAngle(a, b, c){
    return haversineAngle(a, b)-haversineAngle(a, c);
}

function getBearing(lat1,lng1,lat2,lng2) {
    var dLon = (lng2-lng1);
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var brng = toDeg(Math.atan2(y, x));
    return 360 - ((brng + 360) % 360);
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

function moveOutside(point, vs){
    var origPoint = deepCopy(point);
    var delta = VERY_IMPORTANCE_DISTANCE/10;
    var direction = [1, 1, -1, -1];
    for (var i = 0; i < 4; i++) {
        point = deepCopy(origPoint);
        point[i%2] += direction[i]*delta;
        if (!inside(point, vs)){
            return point;
        }
    }
    return origPoint;
}

function findOutsideOfPolygon(a, b, polygon){
    var dx = b[0] - a[0];
    var dy = b[1] - b[0];
    var normalizer  = Math.max(dx, dy);
    var normalVector = [-dy, dx];
    var middlePoint = [(a[0]+b[0])/2, (a[1]+b[1])/2];
    var testPoint = [middlePoint[0]+normalVector[0]*VERY_IMPORTANCE_DISTANCE/normalizer, middlePoint[1]+normalVector[1]*VERY_IMPORTANCE_DISTANCE]/normalizer;
    return inside(testPoint, polygon);
}

var makeHole = function(poly1, poly2){
  poly1._holes = poly1._holes || [];
    poly1._holes.push(poly2.getLatLngs());
  return poly1;
};
var cookieCut= function(){
  var layers = drawLayer.getLayers();
  if (layers.length > 1){
    var newPoly = makeHole(layers[0], layers[1]);
    newPoly.redraw();
  }
};

function mod(n, m){
    return ((n % m) + m) % m;
}

function getPointInMiddleOfLine(point1, point2){
    return [(point1[0]+point2[0])/2,(point1[1]+point2[1])/2];
}

// http://stackoverflow.com/questions/2166335/what-algorithm-to-use-to-segment-a-sequence-of-numbers-into-n-subsets-to-minimi
function areaMerge(numSplit, areaList) {
    var sum = 0;

    var f = [];
    var g = [];

    for (var i = 0; i < areaList.length + 1; i++) {
        f.push([]);
        g.push([]);
        for (var j = 0; j < numSplit + 1; j++) {
            f[i].push(0);
            g[i].push(0);
        }
    }

    for (var i = 1; i < areaList.length + 1; i++) {
        sum += areaList[i-1];
        f[i][1] = sum * sum;
        g[i][1] = 0;
    }

    for (var i = 2; i < numSplit + 1; i++) {
        f[0][i] = 0;
        g[0][i] = 0;
        for (var j = 1; j < areaList.length + 1; j++) {
            sum = 0;
            f[j][i] = f[j][i-1];
            g[j][i] = j;
            for (var k = j-1; k >= 0; k--) {
                sum += areaList[k];
                if (f[j][i] > f[k][i-1] + (sum * sum)) {
                    f[j][i] = f[k][i-1] + (sum * sum);
                    g[j][i] = k;
                }
            }
        }
    }

    var result = [];
    var i = areaList.length;
    var j = numSplit;
    var k;
    var tempArray;

    while (j) {
        k = g[i][j];
        tempArray = areaList.slice(k, i);
        result.push(tempArray);
        i = k;
        j--;
    }
    result.reverse();
    return result;

}

function drawFromLocalStorage() {
    // Get coordinates and room names from localStorage
    var localStorageCoordinates = [];
    var localStorageRoomNames = [];
    for (var i = 0; i < FLOOR_IDS.length; i++) {
        if (localStorage.getItem('allCoordinates'+FLOOR_IDS[i]) !== null) {
            localStorageCoordinates.push(JSON.parse(localStorage.getItem('allCoordinates'+FLOOR_IDS[i])));
        }
        if (localStorage.getItem('allNames'+FLOOR_IDS[i]) !== null) {
            localStorageRoomNames.push(JSON.parse(localStorage.getItem('allNames'+FLOOR_IDS[i])));
        }
    }
    setAsOneFloorId(localStorageCoordinates, GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID);
    setAsOneFloorId(localStorageRoomNames, GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID);
    removeEmptyRoomsOrNames(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[6], GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID[0]);
    mergeCorridorsForMultipleFloors();

    addGlobalCoordinatesToZoom();
    addGlobalNamesToZoom();
    // layer.addTo(MAP);
    // globalMergedCorridorPolygons = deepCopy(layer);
    // globalMergedCorridorPolygons.addTo(MAP);
    createPolygonsFromAllCoordinatesAsOneFloorId(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID);
}

function removeEmptyRoomsOrNames(coordinates, names) {
    for (var i = coordinates.length - 1; i >= 0; i--) {
        if (coordinates[i].length == 0 || names[i].length == 0) {
            coordinates.splice(i, 1);
            names.splice(i, 1);
        }
    }
}

function addGlobalCoordinatesToZoom() {
    globalOutlinePolygons = makeGeoJSONPolygon(0, roomColor, roomOutlineColor, "Polygon");
    // globalCorridorPolygons = makeGeoJSONPolygon(1, "red", "gray", "Polygon");
    // globalMergedCorridorPolygons = makeGeoJSONPolygon(2, "red", "gray", "Polygon");
    // mergedLarge = makeGeoJSONPolygon(3, "yellow", "gray", "Polygon");
    // mergedMedium = makeGeoJSONPolygon(4, "yellow", "gray", "Polygon");
    // mergedSmall = makeGeoJSONPolygon(5, "yellow", "gray", "Polygon");
    // globalRoomPolygons = makeGeoJSONPolygon(6, "white", "gray", "Polygon");
    globalDoorPolygons = makeGeoJSONTop(7, roomColor, doorColor, "MultiLineString");
    globalStairPolygons = makeGeoJSONTop(8, roomColor, stairColor, "MultiLineString");
    // globalUnmergedPolygonsSimplified = makeGeoJSONPolygon(9, "white", "gray", "Polygon");
    // globalUnmergedPolygons = makeGeoJSONPolygon(10, "white", "gray", "Polygon");
}

function addGlobalNamesToZoom() {
    globalRoomNames = makeAllRoomNames(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[6], GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID[0]);
    globalUnmergedNames = makeAllRoomNames(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[10], GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID[1]);
    mergedTextLarge = makeAllRoomNames(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[3], GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID[2]);
    mergedTextMedium = makeAllRoomNames(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[4], GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID[3]);
    mergedTextSmall = makeAllRoomNames(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[5], GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID[4]);
}

function makeGeoJSONPolygon(index, fillColor, color, type) {
    var geoJSON = makeGeoJSON(deepCopy(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[index]), type);
    return renderGeoJSON(geoJSON, fillColor, color);
}

function makeGeoJSONTop(index, fillColor, color, type) {
    var geoJSON = makeGeoJSON(deepCopy(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[index]), type);
    return renderGeoJSONTop(geoJSON, fillColor, color);
}

function makeAllRoomNames(coordinates, names) {
    var nameMarkers = [];
    for (var i = coordinates.length - 1; i >= 0; i--) {
        // check if coordinate is point
        if (coordinates[i][0].constructor !== Array) {
            nameMarkers.push(makeLocalRoomNames((coordinates[i]), names[i]));
        }
        // check if coordinate consist of one room
        else if (coordinates[i][0][0].constructor !== Array) {
            nameMarkers.push(makeLocalRoomNames((coordinates[i]), names[i]));
        }
        // check if coordinate contains holes
        else {
            nameMarkers.push(makeLocalRoomNames(coordinates[i][getBiggestRoom(coordinates[i])], names[i]));
        }
    }
    return nameMarkers;
}

function mergeCorridorsForMultipleFloors() {
    globalCorridorCoordinates = deepCopy(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[1]);
    [globalMergedCorridorCoordinates, corridorContainer] = mergeCorridors();
    [globalMergedCorridorCoordinates, corridorContainer] = removeDuplicateRooms(globalMergedCorridorCoordinates, corridorContainer);
    GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[2] = deepCopy(globalMergedCorridorCoordinates);
    // fillMergedCoordinates(globalMergedCorridorCoordinates);
}

function setCoordinatesAsOneFloorId(localStorageCoordinates) {
    for (var i = 0; i < localStorageCoordinates.length; i++) {
        for (var j = 0; j < localStorageCoordinates[i].length; j++) {
            for (var k = 0; k < localStorageCoordinates[i][j].length; k++) {
                if (localStorageCoordinates[i][j][k].length > 0) {
                    GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID[j].push(localStorageCoordinates[i][j][k]);
                }
            }
        }
    }
}


function setAsOneFloorId(localStorage, globalArray) {
    for (var i = 0; i < localStorage.length; i++) {
        for (var j = 0; j < localStorage[i].length; j++) {
            for (var k = 0; k < localStorage[i][j].length; k++) {
                // if (localStorage[i][j][k].length > 0) {
                    globalArray[j].push(localStorage[i][j][k]);
                // }
            }
        }
    }
}



function createPolygonsFromAllCoordinatesAsOneFloorId(coordinates) {
    // globalOutlinePolygons = fillAllPolygons(coordinates[0],"black", "white", "polygon");
    globalCorridorPolygons = fillAllPolygons(coordinates[1], roomOutlineColor, mergedCorridorColor, "polygon");
    globalMergedCorridorPolygons = fillAllPolygons(coordinates[2], roomOutlineColor, mergedCorridorColor,"polygon");
    mergedLarge = fillAllZoomlevelPolygons(coordinates[3], GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID[2], roomOutlineColor, mergedRoomColor, "polygon");
    mergedMedium = fillAllZoomlevelPolygons(coordinates[4], GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID[3], roomOutlineColor, mergedRoomColor, "polygon");
    mergedSmall = fillAllZoomlevelPolygons(coordinates[5], GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID[4], roomOutlineColor, mergedRoomColor, "polygon");
    globalRoomPolygons = fillAllPolygons(coordinates[6], roomOutlineColor, roomColor, "line");
    // globalDoorPolygons = fillAllPolygons(coordinates[7], "gray", "white", "line");
    // globalStairPolygons = fillAllPolygons(coordinates[8], "gray", "white", "line");
    globalUnmergedPolygonsSimplified = fillAllPolygons(coordinates[9], roomOutlineColor, roomColor, "line");
    globalUnmergedPolygons = fillAllPolygons(coordinates[10], roomOutlineColor, roomColor, "line");
}

function fillAllPolygons(coordinates, color, fillColor, lineOrPolygon) {
    var polygons = [];
    fillPolygons(coordinates, polygons, color, fillColor, lineOrPolygon, 1);
    return [polygons];
}


function fillAllZoomlevelPolygons(coordinates, nameList, color, fillColor, lineOrPolygon) {
    var polygons = [];
    fillZoomlevelPolygons(coordinates, polygons, nameList, color, fillColor, lineOrPolygon, 1);
    return [polygons];
}

function angleFromCoordinate(lat1, long1, lat2, long2) {

	var lat1 = lat1 * Math.PI / 180;
	var long1 = long1 * Math.PI / 180;
	var lat2 = lat2 * Math.PI / 180;
	var long2 = long2 * Math.PI / 180;

    var dLon = (long2 - long1);

    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    var brng = Math.atan2(y, x);

    brng = brng * (180 / Math.PI);
    brng = (brng + 360) % 360;
    brng = 360 - brng; // count degrees counter-clockwise - remove to make clockwise

    return brng;
}

function storeMergedRoomNames(textZoomLevels) {
    for (var i = 0; i < textZoomLevels.length; i++) {
        GLOBAL_ROOM_NAMES.push(textZoomLevels[i]);
    }
    localStorage.setItem('allNames'+FLOOR_ID, JSON.stringify(GLOBAL_ROOM_NAMES));
}

function Node(index, parent) {
    this.area = getArea(GLOBAL_ROOM_COORDINATES[index]);
    this.index = index;
    this.parent = parent;
    this.children = [];
}

function findRoomWithLeastNeighbors(rooms, oldNeighbors) {
    var leastNeighbors = Infinity;
    var roomWithLeastNeighbors;
    for (var i = 0; i < rooms.length; i++) {
        if (oldNeighbors[rooms[i]].length < leastNeighbors) {
            leastNeighbors = oldNeighbors[rooms[i]].length;
            roomWithLeastNeighbors = rooms[i];
        }
    }
    return roomWithLeastNeighbors;
}

function createTree(rooms, oldNeighbors) {
    var startIndex = findRoomWithLeastNeighbors(rooms, oldNeighbors);
    var node = new Node(startIndex, null);
    var rootNode = node;
    var roomsInTree = [startIndex];
    var toBeVisited = [node];
    while (rooms.length > 0) {
        // set node to next unvisited node
        node = toBeVisited.splice(0, 1)[0];
        rooms.splice(rooms.indexOf(node.index), 1);
        for (var i = 0; i < oldNeighbors[node.index].length; i++) {
            if (!contains(roomsInTree, oldNeighbors[node.index][i])) {
                var child = new Node(oldNeighbors[node.index][i], node);
                node.children.push(child);
                toBeVisited.push(child);
                roomsInTree.push(oldNeighbors[node.index][i]);
            }
        }
    }
    return rootNode;
}

// add total area of subtree to a root node
function getAreaNode(node) {
    node.area = getArea(GLOBAL_ROOM_COORDINATES[node.index]);
    for (var i = 0; i < node.children.length; i++) {
        node.area += getAreaNode(node.children[i]);
    }
    return node.area;
}

// return split node of first part if tree is divided in k parts
function getNodesClosestFractialArea(node, k) {
    var targetArea = node.area*(1-(1/k));
    var toBeVisited = [];
    while (true) {
        for (var i = 0; i < node.children.length; i++) {
            toBeVisited.push(node.children[i]);
        }
        if (node.area < targetArea || node.children.length == 0) {
            var done = true;
            for (var i = 0; i < toBeVisited.length; i++) {
                if (toBeVisited[i].area >= targetArea) {
                    done = false;
                }
            }
            if (done) {
                node = node.parent;
                break;
            }
        }
        node = toBeVisited.splice(-1, 1)[0];
    }
    return getSplitNode(node, targetArea);
}

// get node with closest area to target area
function getSplitNode(node, targetArea) {
    var splitNode = node;
    closestArea = Math.abs(node.area - targetArea);
    for (var i = 0; i < node.children.length; i++) {
        if (Math.abs(node.children[i].area - targetArea) < closestArea) {
            splitNode = node.children[i];
            closestArea = Math.abs(node.children[i].area - targetArea);
        }
    }
    return splitNode;
}

// split tree into two trees with splitnode as new root
function splitTree(splitNodes) {
    for (var i = 1; i < splitNodes.length; i++) {
        splitNodes[i].parent.children.splice(splitNodes[i].parent.children.indexOf(splitNodes[i]), 1);
        splitNodes[i].parent = null;
    }
}

function splitIntoKTrees(rootNode, k) {
    var splitNodes = [rootNode];
    while (k > 1) {
        var splitNode = getNodesClosestFractialArea(rootNode, k);
        // splitTree(rootNode, splitNode);
        splitNodes.push(splitNode);
        rootNode = splitNode;
        k -= 1;
    }
    return splitNodes;
}

function getSubTreeArea(splitNodes) {
    var areas = [];
    for (var i = 0; i < splitNodes.length-1; i++) {
        areas.push(splitNodes[i].area-splitNodes[i+1].area);
    }
    areas.push(splitNodes[splitNodes.length-1].area);
    return areas;
}

function isEven(areas, totalArea) {
    var even = true;
    var amount = areas.length;
    var targetArea = totalArea/amount;
    for (var i = 0; i < amount; i++) {
        if (Math.abs(areas[i] - targetArea)/totalArea > 0.1) {
            even = false;
        }
    }
    return even;
}

function choose2split(areas2, areas3, totalArea){
    var greatesDifferent2 = 0;
    var greatesDifferent3 = 0;
    for (var i = 0; i < areas2.length; i++) {
        if (Math.abs(areas2[i]-totalArea/2) > greatesDifferent2) {
            greatesDifferent2 = Math.abs(areas2[i]-totalArea/2);
        }
    }
    for (i = 0; i < areas3.length; i++) {
        if (Math.abs(areas3[i]-totalArea/3) > greatesDifferent3) {
            greatesDifferent3 = Math.abs(areas3[i]-totalArea/3);
        }
    }
    return greatesDifferent2 < greatesDifferent3;
}

function getIndicesInGroup(rootNode) {
    var indices = [];
    var node;
    toBeVisited = [rootNode];
    while (toBeVisited.length > 0) {
        node = toBeVisited.splice(0, 1)[0];
        indices.push(node.index);
        for (var i = 0; i < node.children.length; i++) {
            toBeVisited.push(node.children[i]);
        }
    }
    return indices;
}

function getRootsOfSubtree(rootNode) {
    var split2 = splitIntoKTrees(rootNode, 2);
    var areas2 = getSubTreeArea(split2);
    var split3 = splitIntoKTrees(rootNode, 3);
    var areas3 = getSubTreeArea(split3);
    var split;
    if (choose2split(areas2, areas3, rootNode.area)) {
        split = split2;
    }
    else {
        split = split3;
    }
    return split;
}

function roomTooBig(container, areaThreshold) {
    area = 0;
    for (var i = 0; i < container.length; i++) {
        area += getArea(GLOBAL_ROOM_COORDINATES[container[i]]);
    }
    return (area > areaThreshold);
}

// function splitGroup(container, oldNeighbors, areaThresholds) {
//     zoomLevel = [];
//     if (container.length > 1) {
//         var rootNode = createTree(deepCopy(container), oldNeighbors);
//         getAreaNode(rootNode);
//         zoomLevel.push([getIndicesInGroup(rootNode)]);
//         var split = getRootsOfSubtree(rootNode);
//         splitTree(split);
//         var zoomLevelGroup = [];
//         for (j = 0; j < split.length; j++) {
//             zoomLevelGroup.push(getIndicesInGroup(split[j]));
//         }
//         zoomLevel.push(zoomLevelGroup);
//     }
//     else {
//         zoomLevel.push([[]]);
//     }
//     console.log(zoomLevel);
//     return zoomLevel;
// }

// split a group of room into different zoom levels
function splitGroup(container, oldNeighbors, areaThresholds) {
    var zoomLevel = [];
    // check if group consists of more than one room
    if (container.length > 1) {
        var containers = [deepCopy(container)];
        var rootNode = createTree(deepCopy(container), oldNeighbors);
        getAreaNode(rootNode);
        areaThresholds = [rootNode.area/(container.length / 10), rootNode.area/(1.1 + container.length / 10), rootNode.area/(2 + container.length / 10)];
        var rootNodes = [rootNode];
        for (var i = 0; i < areaThresholds.length; i++) {
            var zoomLevelGroup = [];
            var finalRootNodes = [];
            while (containers.length > 0) {
                container = containers.shift();
                rootNode = rootNodes.shift();
                getAreaNode(rootNode);
                if (roomTooBig(container, areaThresholds[i]) && container.length > 1) {
                    var split = getRootsOfSubtree(rootNode);
                    splitTree(split);
                    for (j = 0; j < split.length; j++) {
                        containers.push(getIndicesInGroup(split[j]));
                        rootNodes.push(split[j]);
                    }
                }
                else {
                    zoomLevelGroup.push(getIndicesInGroup(rootNode));
                    finalRootNodes.push(rootNode);
                }
            }
            for (var j = 0; j < zoomLevelGroup.length; j++) {
                containers.push(zoomLevelGroup[j]);
                rootNodes.push(finalRootNodes[j]);
            }
            zoomLevel.push(zoomLevelGroup);
        }
    }
    else {
        zoomLevel.push([[]]);
    }
    return zoomLevel;
}

// function splitGroup(container, oldNeighbors, areaThresholds) {
//     var zoomLevel = [];

//     var minArea = 0.00000004;

//     // check if group consists of more than one room
//     if (container.length > 1) {
//         var containers = [deepCopy(container)];
//         var rootNode = createTree(deepCopy(container), oldNeighbors);
//         currentArea = getAreaNode(rootNode);
//         var rootNodes = [rootNode];

//         var zoomLevel = [getIndicesInGroup(rootNode)];

//         while (currentArea > minArea) {


//         	while (rootNodes.length > 0) {
//                 var zoomLevelGroup = [];

//         		rootNode = rootNodes.shift();
//         		if (rootNode.children.length > 0) {
// 	        		//console.log(eval(uneval(rootNode)));
// 		        	var split = getRootsOfSubtree(rootNode);
// 		            splitTree(split);

// 		            var minArea = Infinity;
// 		            for (var i = 0; i < split.length; i++) {
// 		            	tempArea = getAreaNode(split[i]);
// 		            	if (tempArea < minArea) {
// 		            		minArea = tempArea;
// 		            	}
// 		            	zoomLevelGroup.push(getIndicesInGroup(split[i]));
// 		            	rootNodes.push(split[i]);
// 		            }

// 		            currentArea = minArea;
// 		        }
// 		        else {
// 		        	zoomLevelGroup = [rootNode.index];
// 		        	currentArea = rootNode.area;
// 		        }
//                 console.log(zoomLevelGroup);
//                 zoomLevel.push(zoomLevelGroup);
// 	        }
//         }
//     }
//     else {
//         zoomLevel.push([[]]);
//     }
//     console.log(zoomLevel);
//     return zoomLevel;
// }

function createZoomLevelTree(container, oldNeighbors) {
    var zoomLevels = [];
    for (var i = 0; i < container.length; i++) {
        var zoomLevel = splitGroup(container[i], oldNeighbors, [0.0000005, 0.000000089, 0.00000003]);
        zoomLevels.push(zoomLevel);
    }
    return zoomLevels;
}
