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

// enum
var ROOM_TYPE = {"OFFICE": 1, "CORRIDOR": 2, "STAIRS": 3, "COMPUTER_LAB": 4, "MEETING_ROOM": 5, "LECTURE_HALL": 6, "STUDY_ROOM": 7, "NOT_AVAILABLE": 8, "TOILETS": 9, "STORAGE_ROOM": 10, "LAB": 11, "COPY_ROOM": 12, "TECHNICAL": 13, "WARDROBE": 14, "SHOWER": 15, "GROUP_ROOM": 16, "INSTITUTE": 17, "FRAT": 18, "DRAWING_ROOM": 19, "LIBRARY": 20, "TEACHING_ROOM": 21, "STORE": 22, "CANTEEN": 23, "SIT": 24, "BUS_STOP": 27, "PARKING_LOT": 28, "WORKSHOP": 29, "ROOM":91};

var FLOOR_ID = "159";
var FILENAME = "floor_4_35.json";

var STAIR_WEIGHT = 0.2;
var SERVER_WEIGHT = 1;
var LOCAL_WEIGHT = 0.5;

var VERY_IMPORTANCE_DISTANCE = 0.0000011523708237294147*5;
var MINIMUM_DISTANCE = 0.000001;

var THRESHOLD = 0.0005;


var RAW_RESPONSE;



var ZOOM_LEVELS_DRAWN = {"16": false, "17": false, "18": false, "19": false, "20": false, "corridors": false, "largeRoomNames": false, "smallRoomNames": false};

// Create a map
var MAP = Maze.map('mazemap-container', { campusloader: false });
// map.setView([10.406426561608821,63.417421008760335], 15);
MAP.setView([63.417421008760335,10.406426561608821], 15);

// One array of coordinates for each type of polygon
var globalRoomCoordinates = [];

var globalRoomPolygons = [];
var globalStairPolygons = [];
var globalOutlinePolygons = [];
var globalDoorPolygons = [];
var globalCorridorPolygons = [];
var globalMergedPolygons = [];

var globalRoomNames = [];
var globalRoomNameCoordinates = [];
var globalMergedRoomNameStrings = [];
var globalMergedRoomNameMarkers = [];

var globalNameList = [];


// Uncomment the preferred JSON file
getLocalJSON(FILENAME);
getJSONfromServer();

zoom();



function zoom() {
	// Zoom listener
	MAP.on('zoomend', function () {
	    console.log(MAP.getZoom());
	    if (!ZOOM_LEVELS_DRAWN["17"]) {
	        if (MAP.getZoom() >= 17) {
	            drawPolygons(globalOutlinePolygons);
	            ZOOM_LEVELS_DRAWN["17"] = true;
	        }
	    }
	    if (ZOOM_LEVELS_DRAWN["17"]) {
	        if (MAP.getZoom() < 17) {
	            removePolygons(globalOutlinePolygons);
	            ZOOM_LEVELS_DRAWN["17"] = false;
	        }
	    }
        if (ZOOM_LEVELS_DRAWN["18"]) {
            if (MAP.getZoom() < 18 || MAP.getZoom() >= 20) {
                removePolygons(globalMergedPolygons);
                ZOOM_LEVELS_DRAWN["18"] = false;
            }
        }
        if (ZOOM_LEVELS_DRAWN["largeRoomNames"]) {
            if (MAP.getZoom() != 19) {
                removeNamesBiggerThanThreshold(mergedRoomCoordinates, globalMergedPolygons);
                ZOOM_LEVELS_DRAWN["largeRoomNames"] = false;
            }
        }
        if (!ZOOM_LEVELS_DRAWN["corridors"]) {
            if (MAP.getZoom() >= 18) {
                drawPolygons(globalCorridorPolygons);
                ZOOM_LEVELS_DRAWN["corridors"] = true;
            }
        }
        if (ZOOM_LEVELS_DRAWN["corridors"]) {
            if (MAP.getZoom() < 18) {
                removePolygons(globalCorridorPolygons);
                ZOOM_LEVELS_DRAWN["corridors"] = false;
            }
        }
	    // if (!ZOOM_LEVELS_DRAWN["19"]) {
	    //     if (map.getZoom() >= 19) {
	    //     	console.log("bulba");
	    //         ZOOM_LEVELS_DRAWN["19"] = true;
	    //     }
	    // }
	    // if (ZOOM_LEVELS_DRAWN["19"]) {
	    //     if (map.getZoom() < 19) {
	    //         ZOOM_LEVELS_DRAWN["19"] = false;
	    //     }
	    // }
	    if (!ZOOM_LEVELS_DRAWN["20"]) {
	        if (MAP.getZoom() >= 20) {
                removePolygons(globalCorridorPolygons);
                drawPolygonsSmallerThanThreshold(globalRoomCoordinates, globalRoomPolygons);
                addAllNames(globalRoomCoordinates, globalRoomPolygons);
                drawPolygons(globalRoomPolygons);
                drawPolygons(globalDoorPolygons);
	            drawPolygons(globalStairPolygons);
                drawPolygons(globalCorridorPolygons);
	            ZOOM_LEVELS_DRAWN["20"] = true;
	        }
	    }
	    if (ZOOM_LEVELS_DRAWN["20"]) {
	        if (MAP.getZoom() < 20) {
	            removePolygonsSmallerThanThreshold(globalRoomCoordinates, globalRoomPolygons);
                removeAllNames(globalRoomCoordinates, globalRoomPolygons);
                removePolygons(globalRoomPolygons);
	            removePolygons(globalDoorPolygons);
	            removePolygons(globalStairPolygons);
	            ZOOM_LEVELS_DRAWN["20"] = false;
	        }
	    }
        if (!ZOOM_LEVELS_DRAWN["18"]) {
            if (MAP.getZoom() >= 18 && MAP.getZoom() < 20) {
                removePolygons(globalCorridorPolygons);
                drawPolygons(globalMergedPolygons);
                drawPolygons(globalCorridorPolygons);
                ZOOM_LEVELS_DRAWN["18"] = true;
            }
        }
        if (!ZOOM_LEVELS_DRAWN["largeRoomNames"]) {
            if (MAP.getZoom() == 19) {
                addNamesBiggerThanThreshold(mergedRoomCoordinates, globalMergedPolygons);
                ZOOM_LEVELS_DRAWN["largeRoomNames"] = true;
            }
        }
	});
}

function drawDirectedTestLine(samplePoints) {
	Maze.polyline(samplePoints).addTo(MAP);
}

function testDotProduct(samplePoints, samplePoint, whichPoint) {
	if (whichPoint == "first") {
		Maze.polyline([samplePoints[0], samplePoint]).addTo(MAP);
		Maze.marker(samplePoints[1]).addTo(MAP);
		Maze.marker(samplePoint).addTo(MAP);
		console.log(dotProd(makeLine(samplePoints[0], samplePoints[1]), makeLine(samplePoints[0], samplePoint)));
	}
	else {
		Maze.polyline([samplePoints[1], samplePoint]).addTo(MAP);
		Maze.marker(samplePoints[0]).addTo(MAP);
		Maze.marker(samplePoint).addTo(MAP);
		console.log(dotProd(makeLine(samplePoints[1], samplePoints[0]), makeLine(samplePoints[1], samplePoint)));
	}
}

/* JSON object from server */
function getJSONfromServer() {
    // Listen for the event.
    document.getElementById('mazemap-container').addEventListener('responseTextChange', function () { recievedJSONfromServer() }, false);

    getHttp("http://api.mazemap.com/api/pois/?campusid=1&floorid="+FLOOR_ID+"&srid=4326");
}

function removeDuplicatesFromAllRooms(roomCoordinates) {
	var simplifiedCoordinates = [];

	for (var i = 0; i < roomCoordinates.length; i++) {
		simplifiedCoordinates.push(removeDuplicatePoints(roomCoordinates, i));
	}
	return simplifiedCoordinates;
}

function simplifyRoomsMadeBySomeDude(roomCoordinates) {
	var simplifiedCoordinates = [];
	for (var i = 0; i < roomCoordinates.length; i++) {
		simplifiedCoordinates.push(simplify(roomCoordinates[i], 0.000004));
	}
	return simplifiedCoordinates;
}

function simplifyRooms(roomCoordinates) {
	var simplifiedCoordinates = [];

	for (var i = 0; i < roomCoordinates.length; i++) {
		simplifiedCoordinates.push(removePointsOneLongOneShort(roomCoordinates, i));
	}
	return simplifiedCoordinates;
}

function simplifyRoomsAlternative(roomCoordinates) {
	var simplifiedCoordinates = [];

	for (var i = 0; i < roomCoordinates.length; i++) {
		simplifiedCoordinates.push(removePointsTwoShort(roomCoordinates, i));
	}
	return simplifiedCoordinates;
}

function drawPolygonFromOnlyCoordinates(coordinates, fillColor, outlineColor) {
	var simplifiedCoordinates = [];
	for (var i = 0; i < coordinates.length; i++) {
		simplifiedCoordinates.push(coordinates[i]);
	}
	MAP.addLayer(Maze.polygon(simplifiedCoordinates, {color: outlineColor, fillColor: fillColor}));
}

// This will contain the rest of the program, and will be run when we know we have received the JSON from the server
function recievedJSONfromServer() {
    var geoJSON = JSON.parse(RAW_RESPONSE);
    var color = "gray";
    var fillColor = "red";
    fillCoordinateTypeServer(geoJSON, [], globalCorridorPolygons, ROOM_TYPE.CORRIDOR, color, fillColor, 0.2, "polygon");
    fillCoordinateTypeServer(geoJSON, globalRoomCoordinates, globalRoomPolygons, ROOM_TYPE.ROOM, color, 'white', 1, "polygon");

    globalNameList = makeListOfNames(geoJSON);

    removedDuplicatePoints = removeDuplicatesFromAllRooms(globalRoomCoordinates);
    var simplifiedRoomCoordinates = simplifyRoomsMadeBySomeDude(removedDuplicatePoints);


    createglobalMergedPolygons(geoJSON, simplifiedRoomCoordinates);


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
    fillCoordinateTypeLocal(data, globalStairPolygons, 'stairsfull', 'black', "line");
    fillCoordinateTypeLocal(data, globalDoorPolygons, 'doors', color[2], "line");
    fillCoordinateTypeLocal(data, globalOutlinePolygons, 'outlines', color[3], "line");


    // Draw markers on all stair coordinates
    //drawMarkersForStairs(stairCoordinates);
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

function fillCoordinateTypeLocal(data, polygonList, coordinateType, color, lineOrPolygon) {
    var coordinates = [];
	// stairsfull is organized a little different from the others
	if (coordinateType == 'stairsfull') {
		fillStairCoordinates(data, coordinates, polygonList, coordinateType, color, lineOrPolygon);
	}
	// This applies for the rest of the type of coordinates
	else {
		for (var i = 0; i < data[coordinateType].features.length; i++) {
	        coordinates.push(data[coordinateType].features[i].geometry.coordinates[0]);
	        for (var j = 0; j < coordinates[i].length; j++) {
	            temp = coordinates[i][j][0];
	            coordinates[i][j][0] = coordinates[i][j][1];
	            coordinates[i][j][1] = temp;
	        }
	        if (lineOrPolygon == "line") {
	            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: LOCAL_WEIGHT}));
	        }
	        else {
	            polygonList.push(Maze.polygon(coordinates[i], {color: color, weight: LOCAL_WEIGHT}));
	        }
	    }
	}
}

function fillCoordinateTypeServer(data, coordinates, polygonList, coordinateType, color, fillColor, fillOpacity, lineOrPolygon) {
    for (var i = 0; i < data.pois.length; i++) {
        for (var j = 0; j < data.pois[i].infos.length; j++) {
            if (data.pois[i].infos[j].poiTypeId == coordinateType) {
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
                    makeRoomNames(coordinates[i], data.pois[i].title);
                }
            }
        }
    }
    for (var i = 0; i < coordinates.length; i++) {
        if (lineOrPolygon == "line") {
            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: SERVER_WEIGHT}));
        }
        else {
            polygonList.push(Maze.polygon(coordinates[i], {color: color, fillColor: fillColor, weight: SERVER_WEIGHT, fillOpacity: fillOpacity}));
        }
    }
}

function makeListOfNames(data) {
	globalNameList = [];
	for (var i = 0; i < data.pois.length; i++) {
		globalNameList.push(data.pois[i].title);
	}
	return globalNameList;
}

function makeMergedNames(container, globalNameList) {
	if (container.length == 1) {
		return globalNameList[container[0]];
	}

	maxDistance = 0;
	maxIndex1 = 0;
	maxIndex2 = 0;

	for (var i = 0; i < container.length; i++) {
		for (var j = 0; j < container.length; j++) {
			if (getDistanceBetweenTwoPoints(getPoint(globalRoomCoordinates[container[i]]), getPoint(globalRoomCoordinates[container[j]])) > maxDistance) {
				maxDistance = getDistanceBetweenTwoPoints(getPoint(globalRoomCoordinates[container[i]]), getPoint(globalRoomCoordinates[container[j]]));
				maxIndex1 = container[i];
				maxIndex2 = container[j];
			}
		}
	}
	firstName = globalNameList[maxIndex1];
	lastName = globalNameList[maxIndex2];
	if (firstName < lastName) {
		return firstName + " - " + lastName;
	}
	return lastName + " - " + firstName;
}

function fillPolygons(coordinates, polygonList, color, fillColor, lineOrPolygon) {
    for (var i = 0; i < coordinates.length; i++) {
        if (lineOrPolygon == "line") {
            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: SERVER_WEIGHT}));
        }
        else {
            polygonList.push(Maze.polygon(coordinates[i], {color: color, fillColor: fillColor, fillOpacity: 1, weight: SERVER_WEIGHT}));
        }
    }
}

function fillglobalMergedPolygons(coordinates, polygonList, container) {
    mergedRoomCoordinates = deepCopy(coordinates);
    for (var i = 0; i < coordinates.length; i++) {
        if (coordinates[i].length > 0){
            if (coordinates[i][0].constructor == Array){
                if (container[i].length == 1) {
                    polygonList.push(Maze.polygon(coordinates[i], {color: "black", fillColor: "white", fillOpacity: 1, weight: SERVER_WEIGHT}));
                }
                else {
                    polygonList.push(Maze.polygon(coordinates[i], {color: "black", fillColor: "#F1F1F1", fillOpacity: 1, weight: SERVER_WEIGHT}));
                }
            }
        }
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
        if (polygonList[i]._latlngs.length > 1) {
            if (polygonList[i]._latlngs[0]) {
                MAP.addLayer(polygonList[i]);
            }
        }
        else if (polygonList[i]._latlngs[0][0]) {
            MAP.addLayer(polygonList[i]);
        }
        else {
            console.log("Trying to draw a non-polygon");
            console.log(polygonList[i]._latlngs);
        }
    }
}

function removePolygons(polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        MAP.removeLayer(polygonList[i]);
    }
}

function drawPolygonsBiggerThanThreshold(roomCoordinates, polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) > THRESHOLD) {
            MAP.addLayer(polygonList[i]);
        }
    }
}

function addNamesBiggerThanThreshold(roomCoordinates, polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) > THRESHOLD) {
            MAP.addLayer(globalMergedRoomNameMarkers[i]);
        }
    }
}

function removePolygonsBiggerThanThreshold(roomCoordinates, polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) > THRESHOLD) {
            MAP.removeLayer(polygonList[i]);
        }
    }
}

function removeNamesBiggerThanThreshold(roomCoordinates, polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) > THRESHOLD) {
            MAP.removeLayer(globalMergedRoomNameMarkers[i]);
        }
    }
}

function drawPolygonsSmallerThanThreshold(roomCoordinates, polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) <= THRESHOLD) {
            MAP.addLayer(polygonList[i]);
        }
    }
}

function addNamesSmallerThanThreshold(roomCoordinates, polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) <= THRESHOLD) {
            MAP.addLayer(globalRoomNames[i]);
        }
        else if (getRoomCircumference(roomCoordinates[i]) >= THRESHOLD){
        }
        else {
            MAP.addLayer(globalRoomNames[i]);
        }
    }
}

function addAllNames(roomCoordinates, polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        MAP.addLayer(globalRoomNames[i]);
    }
}

function removePolygonsSmallerThanThreshold(roomCoordinates, polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) <= THRESHOLD) {
            MAP.removeLayer(polygonList[i]);
        }
    }
}

function removeNamesSmallerThanThreshold(roomCoordinates, polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) <= THRESHOLD) {
            MAP.removeLayer(globalRoomNames[i]);
        }
        else if (getRoomCircumference(roomCoordinates[i]) >= THRESHOLD){
        }
        else {
            MAP.removeLayer(globalRoomNames[i]);
        }
    }
}

function removeAllNames(roomCoordinates, polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        MAP.removeLayer(globalRoomNames[i]);
    }
}

function makeRoomNames(coordinates, title) {
    var myIcon;
    if (coordinates.length == 2) {
        myIcon = Maze.divIcon({
            className: "labelClass",
            iconSize: new Maze.Point(30, 20),
            html: title
        });
        globalRoomNames.push(Maze.marker(coordinates, {icon: myIcon}));
    }
    else {
        point = getPoint(coordinates);
        myIcon = Maze.divIcon({
            className: "labelClass",
            iconSize: new Maze.Point(30, 20),
            html: title
        });
        globalRoomNames.push(Maze.marker(point, {icon: myIcon}));
    }
}

function makeMergedRoomNames(coordinates, title) {
	if (coordinates.length == 2) {
        myIcon = Maze.divIcon({
            className: "labelClass",
            iconSize: new Maze.Point(title.length * 6, 20),
            html: title
        });
        globalMergedRoomNameMarkers.push(Maze.marker(coordinates, {icon: myIcon}));
    }
    else {
        point = getPoint(coordinates);
        myIcon = Maze.divIcon({
            className: "labelClass",
            iconSize: new Maze.Point(title.length * 6, 20),
            html: title
        });
        globalMergedRoomNameMarkers.push(Maze.marker(point, {icon: myIcon}));
    }
}


function getPoint(coordinates){
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

function removeDuplicatePoints(coordinates, index) {
	if (coordinates[index].length <= 2) {
		return coordinates[index];
	}



	simplifiedCoordinates = [];

	for (var i = 0; i < coordinates[index].length - 1; i++) {
		if (getDistanceBetweenTwoPoints(coordinates[index][i], coordinates[index][i + 1]) > MINIMUM_DISTANCE) {
			simplifiedCoordinates.push(coordinates[index][i]);
		}
	}
	simplifiedCoordinates.push(coordinates[index][coordinates[index].length - 1]);

	return simplifiedCoordinates;
}

function removePointsOneLongOneShort(coordinates, index) {
	simplifiedCoordinates = [];

	if ((getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][0]) >= VERY_IMPORTANCE_DISTANCE
		&& getDistanceBetweenTwoPoints(coordinates[index][0], coordinates[index][1]) >= VERY_IMPORTANCE_DISTANCE)
		|| (getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][0]) < VERY_IMPORTANCE_DISTANCE
			&& getDistanceBetweenTwoPoints(coordinates[index][0], coordinates[index][1]) < VERY_IMPORTANCE_DISTANCE)) {
		simplifiedCoordinates.push(coordinates[index][0]);
	}
	for (var i = 1; i < coordinates[index].length - 1; i++) {
		if ((getDistanceBetweenTwoPoints(coordinates[index][i - 1], coordinates[index][i]) >= VERY_IMPORTANCE_DISTANCE
			&& getDistanceBetweenTwoPoints(coordinates[index][i], coordinates[index][i + 1]) >= VERY_IMPORTANCE_DISTANCE)
			|| (getDistanceBetweenTwoPoints(coordinates[index][i - 1], coordinates[index][i]) < VERY_IMPORTANCE_DISTANCE
				&& getDistanceBetweenTwoPoints(coordinates[index][i], coordinates[index][i + 1]) < VERY_IMPORTANCE_DISTANCE)) {
			simplifiedCoordinates.push(coordinates[index][i]);
		}
	}
	if ((getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][coordinates[index].length - 1]) >= VERY_IMPORTANCE_DISTANCE
		&& getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 1], coordinates[index][1]) >= VERY_IMPORTANCE_DISTANCE)
		|| (getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][coordinates[index].length - 1]) < VERY_IMPORTANCE_DISTANCE
			&& getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 1], coordinates[index][1]) < VERY_IMPORTANCE_DISTANCE)) {
		simplifiedCoordinates.push(coordinates[index][coordinates[index].length - 1]);
	}
    if (coordinates[index].length > 2) {
        if (simplifiedCoordinates[0][0] == simplifiedCoordinates[simplifiedCoordinates.length - 1][0]
            && simplifiedCoordinates[0][1] == simplifiedCoordinates[simplifiedCoordinates.length - 1][1]) {
                // do nothing
        }
        else {
            if (getDistanceBetweenTwoPoints(simplifiedCoordinates[0], simplifiedCoordinates[simplifiedCoordinates.length - 1]) < MINIMUM_DISTANCE) {
                simplifiedCoordinates.pop();
                simplifiedCoordinates.push(simplifiedCoordinates[0]);
            }
            else {
                simplifiedCoordinates.push(simplifiedCoordinates[0]);
            }
        }
    }
	return simplifiedCoordinates;
}

function removePointsTwoShort(coordinates, index) {
	simplifiedCoordinates = [];

	if ((getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][0]) < VERY_IMPORTANCE_DISTANCE
		&& getDistanceBetweenTwoPoints(coordinates[index][0], coordinates[index][1]) < VERY_IMPORTANCE_DISTANCE)) {
			// do nothing
	}
	else {
		simplifiedCoordinates.push(coordinates[index][0]);
	}
	for (var i = 1; i < coordinates[index].length - 1; i++) {
		if ((getDistanceBetweenTwoPoints(coordinates[index][i - 1], coordinates[index][i]) < VERY_IMPORTANCE_DISTANCE
			&& getDistanceBetweenTwoPoints(coordinates[index][i], coordinates[index][i + 1]) < VERY_IMPORTANCE_DISTANCE)) {
				// do nothing
		}
		else {
			simplifiedCoordinates.push(coordinates[index][i]);
		}
	}
	if ((getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][coordinates[index].length - 1]) < VERY_IMPORTANCE_DISTANCE
		&& getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 1], coordinates[index][1]) < VERY_IMPORTANCE_DISTANCE)) {

	}
	else {
		simplifiedCoordinates.push(coordinates[index][coordinates[index].length - 1]);
	}

    if (coordinates[index].length > 2) {
        if (simplifiedCoordinates[0][0] == simplifiedCoordinates[simplifiedCoordinates.length - 1][0]
            && simplifiedCoordinates[0][1] == simplifiedCoordinates[simplifiedCoordinates.length - 1][1]) {
                // do nothing
        }
        else {
            if (getDistanceBetweenTwoPoints(simplifiedCoordinates[0], simplifiedCoordinates[simplifiedCoordinates.length - 1]) < MINIMUM_DISTANCE) {
                simplifiedCoordinates.pop();
                simplifiedCoordinates.push(simplifiedCoordinates[0]);
            }
            else {
                simplifiedCoordinates.push(simplifiedCoordinates[0]);
            }
        }
    }
	return simplifiedCoordinates;
}

function getAdjacentRooms(data){
    var neighbors = [];
    for (var i = 0; i < data.pois.length; i++) {
        var adjacent = [];

        minType = 1000;
        minTypeIndexI = 0;
        for (var k = 0; k < data.pois[i].infos.length; k++) {
        	if (minType > data.pois[i].infos[k].poiTypeId) {
        		minType = data.pois[i].infos[k].poiTypeId;
        		minTypeIndexI = k;
        	}
        }

        for (var j = 0; j < data.pois.length; j++) {
            if (i != j) {
                dist = getMinDist(data.pois[i].geometry.coordinates[0], data.pois[j].geometry.coordinates[0]);

                minType = 1000;
                minTypeIndexJ = 0;
            	for (var l = 0; l < data.pois[j].infos.length; l++) {
            		if (minType > data.pois[j].infos[l].poiTypeId) {
            			minType = data.pois[j].infos[l].poiTypeId;
						minTypeIndexJ = l;
            		}
            	}
        		if (dist < 0.0000011523708237294147*5 && data.pois[i].infos.length >= minTypeIndexI + 1 && data.pois[j].infos.length >= minTypeIndexJ + 1) {
        			if (data.pois[i].infos[minTypeIndexI].poiTypeId == data.pois[j].infos[minTypeIndexJ].poiTypeId) {
            			adjacent.push(j);
            		}
            	}
            }
        }
        neighbors.push(adjacent);
    }
    return neighbors;
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
    var index = [];
    for (var i = 0; i < simplified.length; i++) {
        var adjacent = [];
        index = [];
        for (var j = 0; j < simplified.length; j++) {
            if (i!=j){
                result = getDistPolyToPoly(simplified[i], simplified[j]);
                if (result[2] < 0.0000011523708237294147*5) {
                    if (samePoiType(data.pois[i].infos, data.pois[j].infos, i)){
                        adjacent.push(j);
                        index.push([result[0],result[1]]);
                    }
                }
            }
        }
        neighbors.push(adjacent);
        indeces.push(index);
    }
    return [neighbors, indeces];
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

function distPointToLine(point,linepoint1,linepoint2){
    a = (linepoint2[1]-linepoint1[1])/(linepoint2[0]-linepoint1[0]);
    b = -1;
    c = linepoint1[1]-a*linepoint1[0];
    return Math.abs(a*point[0]+b*point[1]+c)/Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
}

function checkPointSequence(coordinates) {
	for (var i = 0; i < coordinates.length; i++) {
		Maze.popup().setLatLng(coordinates[i]).setContent(i.toString()).addTo(MAP);
	}
}

function mergeTwoPolygons(polygon1, polygon2, indeces1, indeces2){
    if (polygon1 != polygon2){
        if (indeces1 != null && indeces2 != null){
            indeces1.sort();
            indeces2.sort();
            var shiftedPolygon1 = polygon1.slice(0, polygon1.length-1);
            for (var i = 0; i < indeces1[0]; i++) {
                shiftedPolygon1.push(shiftedPolygon1.shift());
            }
            var shiftedPolygon2 = polygon2.slice(0, polygon2.length-1);
            for (var i = 0; i < indeces2[0]; i++) {
                shiftedPolygon2.push(shiftedPolygon2.shift());
            }
            var partPolygon1 = getLongestPart(shiftedPolygon1, indeces1[1]-indeces1[0]);
            var partPolygon2 = getLongestPart(shiftedPolygon2, indeces2[1]-indeces2[0]);
            var mergedPolygon = partPolygon1.concat(partPolygon2,[partPolygon1[0]]);
            return mergedPolygon;
        }
        else if (indeces1 == null){
            console.log("Error: This should not happend");
            return -1;
        }
        else if (indeces2 == null){
            console.log("indeces2 = null");
            if (oneCloseCorner(polygon1, polygon2)){
                indeces1.sort();
                var resultIndeces = getClosestCorner(polygon1, polygon2, indeces1);
                var shiftedPolygon2 = polygon2.slice(0, polygon2.length-1);
                for (var i = 0; i < resultIndeces[1]+1; i++) {
                    shiftedPolygon2.push(shiftedPolygon2.shift());
                }
                shiftedPolygon2.pop();

                var shiftedPolygon1 = polygon1.slice(0, polygon1.length-1);
                for (var i = 0; i < indeces1[0]; i++) {
                    shiftedPolygon1.push(shiftedPolygon1.shift());
                }
                var partPolygon1 = getLongestPartWithoutRemoval(shiftedPolygon1, indeces1[1]-indeces1[0]);
                var mergedPolygon;
                mergedPolygon = partPolygon1.concat(shiftedPolygon2,[partPolygon1[0]]);
                return mergedPolygon;
            }
            else {
                console.log("Did not merge room:");
                return -1
            }
        }
        else {
            console.log("Error: This should not happend");
            return -1;
        }
    }
    else {
        return -1;
    }
}

function getLongestPart(polygon, index){
    if (index > 1){
        var part1 = polygon.slice(1,index);
    }
    else {
        return polygon.slice(index+1,polygon.length);
    }
    if (index >= polygon.length){
        return part1;
    }
    var part2 = polygon.slice(index+1,polygon.length);
    if (getRoomCircumference(part1) > getRoomCircumference(part2)){
        return part1;
    }
    else {
        return part2;
    }
}

function getLongestPartWithoutRemoval(polygon, index){
    if (index > 1){
        var part1 = polygon.slice(0,index+1);
    }
    else {
        return polygon.slice(index,polygon.length).concat([polygon[0]]);
    }
    if (index >= polygon.length){
        return part1;
    }
    var part2 = polygon.slice(index,polygon.length).concat([polygon[0]]);
    if (getRoomCircumference(part1) > getRoomCircumference(part2)){
        return part1;
    }
    else {
        return part2;
    }
}

function getNeighborIndex(room1, room2, neighbors){
    for (var i = 0; i < neighbors[room1].length; i++) {
        if (neighbors[room1][i] == room2){
            return i;
        }
    }
    return -1;
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function createglobalMergedPolygons(data, roomCoordinates){
    var neighbors;
    var indeces;
    [neighbors, indeces] = getNeighbors(data, roomCoordinates);

    [roomCoordinates, container, globalMergedRoomNameMarkers] = mergeAllPolygons(neighbors, indeces, roomCoordinates);

    [roomCoordinates, container] = removeDuplicateRooms(roomCoordinates, container, globalMergedRoomNameMarkers);

    roomCoordinates = simplifyRoomsMadeBySomeDude(roomCoordinates);

    fillglobalMergedPolygons(roomCoordinates, globalMergedPolygons, container);
}

function mergeAllPolygons(neighbors, indeces, roomCoordinates){
    var container = [];

    for (var i = 0; i < roomCoordinates.length; i++) {
        container.push([i]);
    }

    for (var i = 0; i < roomCoordinates.length; i++) {
        for (var j = 0; j < roomCoordinates.length; j++) {
            if (contains(neighbors[i], j)) {
                if (!findOne(container[i], container[j])){

                    result0 = getDistPolyToPoly(roomCoordinates[i], roomCoordinates[j]);
                    result1 = getDistPolyToPoly(roomCoordinates[j], roomCoordinates[i]);
                    if (result1[2] < VERY_IMPORTANCE_DISTANCE) {
                        var mergedPolygon = mergeTwoPolygons(roomCoordinates[i], roomCoordinates[j], [result0[0],result0[1]], [result1[0],result1[1]]);
                    }
                    else {
                        var mergedPolygon = mergeTwoPolygons(roomCoordinates[i], roomCoordinates[j], [result0[0],result0[1]], undefined);
                    }
                    if (mergedPolygon != -1){
                        if (neighbors[i].indexOf(j) != -1) {
                            neighbors[i].splice(neighbors[i].indexOf(j), 1);
                        }
                        if (neighbors[j].indexOf(i) != -1) {
                            neighbors[j].splice(neighbors[j].indexOf(i), 1);
                        }

                        for (var k = 0; k < container[j].length; k++) {
                            if (!contains(container[i], container[j][k])) {
                                container[i].push(container[j][k]);
                            }
                        }

                        for (var k = 0; k < neighbors[j].length; k++) {
                            if (!contains(neighbors[i], neighbors[j][k]) && !contains(container[i], neighbors[j][k]) && neighbors[j][k] != i) {
                                neighbors[i].push(neighbors[j][k]);
                            }
                        }

                        for (var k = 0; k < container[i].length; k++) {
                            neighbors[container[i][k]] = neighbors[i];
                            container[container[i][k]] = container[i];
                            roomCoordinates[container[i][k]] = mergedPolygon;
                        }
                    }
                }
            }
        }
    }
    for (var i = 0; i < container.length; i++) {
        globalMergedRoomNameStrings.push(makeMergedNames(container[i], globalNameList));
    }

    for (var i = 0; i < roomCoordinates.length; i++) {
        makeMergedRoomNames(roomCoordinates[i], globalMergedRoomNameStrings[i]);
    }
    return [roomCoordinates, container, globalMergedRoomNameMarkers];
}

function markClosestCorners(data, simplifiedRoomCoordinates){
    var result = getNeighbors(data, simplifiedRoomCoordinates);
    var neighbors = result[0];
    var indeces = result[1];
    for (var i = 0; i < neighbors.length; i++) {
        for (var j = 0; j < neighbors[i].length; j++) {
            Maze.polyline([getPoint(simplifiedRoomCoordinates[i]),simplifiedRoomCoordinates[i][indeces[i][j][0]]], {color: 'blue', weight: STAIR_WEIGHT}).addTo(MAP);
            Maze.polyline([getPoint(simplifiedRoomCoordinates[i]),simplifiedRoomCoordinates[i][indeces[i][j][1]]], {color: 'green', weight: STAIR_WEIGHT}).addTo(MAP);
        }
    }
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

function removeDuplicateRooms(roomCoordinates, container, nameMarkers){
    var resultRooms = [];
    var resultContainer = [];
    var resultNameMarkers = [];
    for (var i = 0; i < roomCoordinates.length; i++) {
        if (roomCoordinates.indexOf(roomCoordinates[i]) == i){
            resultRooms.push(roomCoordinates[i]);
            resultContainer.push(container[i]);
            resultNameMarkers.push(nameMarkers[i]);
        }
    }
    globalMergedRoomNameMarkers = resultNameMarkers;
    return [resultRooms, resultContainer];
}
