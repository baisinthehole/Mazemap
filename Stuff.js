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
var RoomType = {"OFFICE": 1, "CORRIDOR": 2, "STAIRS": 3, "COMPUTER_LAB": 4, "MEETING_ROOM": 5, "LECTURE_HALL": 6, "STUDY_ROOM": 7, "NOT_AVAILABLE": 8, "TOILETS": 9, "STORAGE_ROOM": 10, "LAB": 11, "COPY_ROOM": 12, "TECHNICAL": 13, "WARDROBE": 14, "SHOWER": 15, "GROUP_ROOM": 16, "INSTITUTE": 17, "FRAT": 18, "DRAWING_ROOM": 19, "LIBRARY": 20, "TEACHING_ROOM": 21, "STORE": 22, "CANTEEN": 23, "SIT": 24, "BUS_STOP": 27, "PARKING_LOT": 28, "WORKSHOP": 29, "ROOM":91};

var corridorStyle = {"color": "gray", "fillColor": "red", "opacity": 1};
var stairWeight = 0.2;
var serverWeight = 1;
var localWeight = 0.5;
var drawn = false;

var veryImportantDistance = 0.0000011523708237294147*5;
var minimumDistance = 0.000001;

var threshold = 0.0005;

var samplePointsF468 = [[63.417384664953005, 10.406250513492122], [63.41739364337911, 10.406294312445722]];
var samplePointsF478 = [[63.417406805234194, 10.40651019029917], [63.41739724808647, 10.40651974733363]];
var samplePointsE431 = [[63.4174782787972, 10.405782380151525], [63.41749614672632, 10.405764493778864]];
var samplePointsE412 = [[63.4175660937696, 10.406341755013518], [63.417508542197204, 10.406399367422187]];
var samplePointsF474 = [[63.417412724012586, 10.406387465333047], [63.417425900220415, 10.406451773171284]];

var samplePointA447 = [63.41731907765723, 10.406050119273738];
var samplePointA443 = [63.4173210363056, 10.405903295624785];
var samplePointE410 = [63.417485920375306, 10.406102020193284];
var samplePointE419 = [63.4175266385428, 10.406006228436468];
var samplePointE412 = [63.417506589477995, 10.406399635491226];
var samplePointE412Again = [63.417497420625914, 10.406354906632803];

// initialize rawResponse and event for asynchronous response from server
// Create global variable for storing the geography JSON in
var rawResponse;

// Create event for handling asynchronous responses from the server
var event = new Event('responseTextChange');

var zoomLevelsDrawn = {"16": false, "17": false, "18": false, "19": false, "20": false, "corridors": false, "largeRoomNames": false, "smallRoomNames": false};

// Create a map
var map = Maze.map('mazemap-container', { campusloader: false });
// map.setView([10.406426561608821,63.417421008760335], 15);
map.setView([63.417421008760335,10.406426561608821], 15);

// One array of coordinates for each type of polygon
var roomCoordinates = [];
var simplifiedRoomCoordinates = [];
var stairCoordinates = [];
var outlineCoordinates = [];
var doorCoordinates = [];
var corridorCoordinates = [];
var mergedRoomCoordinates = [];
var unmergedRoomIndeces = [];

var roomPolygons = [];
var simplifiedRoomPolygons = [];
var stairPolygons = [];
var outlinePolygons = [];
var doorPolygons = [];
var corridorPolygons = [];
var mergedPolygons = [];

var roomNames = [];
var roomNameCoords = [];
var mergedRoomNameStrings = [];
var mergedRoomNameMarkers = [];

var nameList = [];

var neighbors;

// Uncomment the preferred JSON file
getLocalJSON('floor_4_35.json');
getJSONfromServer();

var myIcon;

function zoom() {
	// Zoom listener
	map.on('zoomend', function () {
	    console.log(map.getZoom());
	    if (!zoomLevelsDrawn["17"]) {
	        if (map.getZoom() >= 17) {
	            drawPolygons(outlinePolygons);
	            zoomLevelsDrawn["17"] = true;
	        }
	    }
	    if (zoomLevelsDrawn["17"]) {
	        if (map.getZoom() < 17) {
	            removePolygons(outlinePolygons);
	            zoomLevelsDrawn["17"] = false;
	        }
	    }
        if (zoomLevelsDrawn["18"]) {
            if (map.getZoom() < 18 || map.getZoom() >= 20) {
                removePolygons(mergedPolygons);
                zoomLevelsDrawn["18"] = false;
            }
        }
        if (zoomLevelsDrawn["largeRoomNames"]) {
            if (map.getZoom() != 19) {
                removeNamesBiggerThanThreshold(mergedRoomCoordinates, mergedPolygons, threshold);
                zoomLevelsDrawn["largeRoomNames"] = false;
            }
        }
        if (!zoomLevelsDrawn["corridors"]) {
            if (map.getZoom() >= 18) {
                drawPolygons(corridorPolygons);
                zoomLevelsDrawn["corridors"] = true;
            }
        }
        if (zoomLevelsDrawn["corridors"]) {
            if (map.getZoom() < 18) {
                removePolygons(corridorPolygons);
                zoomLevelsDrawn["corridors"] = false;
            }
        }
	    // if (!zoomLevelsDrawn["19"]) {
	    //     if (map.getZoom() >= 19) {
	    //     	console.log("bulba");
	    //         zoomLevelsDrawn["19"] = true;
	    //     }
	    // }
	    // if (zoomLevelsDrawn["19"]) {
	    //     if (map.getZoom() < 19) {
	    //         zoomLevelsDrawn["19"] = false;
	    //     }
	    // }
	    if (!zoomLevelsDrawn["20"]) {
	        if (map.getZoom() >= 20) {
                removePolygons(corridorPolygons);
                drawPolygonsSmallerThanThreshold(roomCoordinates, roomPolygons, threshold);
                addAllNames(roomCoordinates, roomPolygons, threshold);
                drawPolygons(roomPolygons);
                drawPolygons(doorPolygons);
	            drawPolygons(stairPolygons);
                drawPolygons(corridorPolygons);
	            zoomLevelsDrawn["20"] = true;
	        }
	    }
	    if (zoomLevelsDrawn["20"]) {
	        if (map.getZoom() < 20) {
	            removePolygonsSmallerThanThreshold(roomCoordinates, roomPolygons, threshold);
                removeAllNames(roomCoordinates, roomPolygons, threshold);
                removePolygons(roomPolygons);
	            removePolygons(doorPolygons);
	            removePolygons(stairPolygons);
	            zoomLevelsDrawn["20"] = false;
	        }
	    }
        if (!zoomLevelsDrawn["18"]) {
            if (map.getZoom() >= 18 && map.getZoom() < 20) {
                removePolygons(corridorPolygons);
                drawPolygons(mergedPolygons);
                drawPolygons(corridorPolygons);
                zoomLevelsDrawn["18"] = true;
            }
        }
        if (!zoomLevelsDrawn["largeRoomNames"]) {
            if (map.getZoom() == 19) {
                addNamesBiggerThanThreshold(mergedRoomCoordinates, mergedPolygons, threshold);
                zoomLevelsDrawn["largeRoomNames"] = true;
            }
        }
	});
}

zoom();

function drawDirectedTestLine(samplePoints) {
	Maze.polyline(samplePoints).addTo(map);
}

function testDotProduct(samplePoints, samplePoint, whichPoint) {
	if (whichPoint == "first") {
		Maze.polyline([samplePoints[0], samplePoint]).addTo(map);
		L.marker(samplePoints[1]).addTo(map);
		L.marker(samplePoint).addTo(map);
		console.log(dotProd(makeLine(samplePoints[0], samplePoints[1]), makeLine(samplePoints[0], samplePoint)));
	}
	else {
		Maze.polyline([samplePoints[1], samplePoint]).addTo(map);
		L.marker(samplePoints[0]).addTo(map);
		L.marker(samplePoint).addTo(map);
		console.log(dotProd(makeLine(samplePoints[1], samplePoints[0]), makeLine(samplePoints[1], samplePoint)));
	}
}

/* JSON object from server */
function getJSONfromServer() {
    // Listen for the event.
    document.getElementById('mazemap-container').addEventListener('responseTextChange', function () { recievedJSONfromServer() }, false);

    getHttp("http://api.mazemap.com/api/pois/?campusid=1&floorid=159&srid=4326");
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
		simplifiedCoordinates.push(removeSmallEdges(roomCoordinates, i));
	}
	return simplifiedCoordinates;
}

function simplifyRoomsAlternative(roomCoordinates) {
	var simplifiedCoordinates = [];

	for (var i = 0; i < roomCoordinates.length; i++) {
		simplifiedCoordinates.push(removeSmallEdgesAlternative(roomCoordinates, i));
	}
	return simplifiedCoordinates;
}

function drawPolygonFromOnlyCoordinates(coordinates, fillColor, outlineColor) {
	var simplifiedCoordinates = [];
	for (var i = 0; i < coordinates.length; i++) {
		simplifiedCoordinates.push(coordinates[i]);
	}
	map.addLayer(Maze.polygon(simplifiedCoordinates, {color: outlineColor, fillColor: fillColor}));
}

// This will contain the rest of the program, and will be run when we know we have received the JSON from the server
function recievedJSONfromServer() {
    var geoJSON = JSON.parse(rawResponse);
    var color = "gray";
    var fillColor = "red";
    fillCoordinateTypeServer(geoJSON, corridorCoordinates, corridorPolygons, RoomType.CORRIDOR, color, fillColor, 0.2, "polygon");
    fillCoordinateTypeServer(geoJSON, roomCoordinates, roomPolygons, RoomType.ROOM, color, 'white', 1, "polygon");

    nameList = makeListOfNames(geoJSON);

    removedDuplicatePoints = removeDuplicatesFromAllRooms(roomCoordinates);
    simplifiedRoomCoordinates = simplifyRoomsMadeBySomeDude(removedDuplicatePoints);

    //checkPointSequence(tesPoints);

    //checkPointSequence(simplifiedRoomCoordinates[5]);

    // markClosestCorners(geoJSON, simplifiedRoomCoordinates);

    fillPolygons(simplifiedRoomCoordinates, simplifiedRoomPolygons, color, 'white', "polygon");

    //drawPolygons(simplifiedRoomPolygons);

    //var result = getNeighbors(geoJSON, simplifiedRoomCoordinates);


    // checkPointSequence(roomCoordinates[48]);
    // checkPointSequence(removedDuplicatePoints[54]);

    createMergedPolygons(geoJSON, simplifiedRoomCoordinates);


}

  // Function for requesting JSON object from server
function getHttp(url) {
    var info = new XMLHttpRequest();
    // Asynchronous HTTP request
    info.open( "GET", url, true );
    info.send();
    info.onreadystatechange = function(error) {
        if (info.readyState == 4 && info.status == 200) {
            console.log("successfully retrieved response from the server");
            rawResponse = info.responseText;
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
    fillCoordinateTypeLocal(data, stairCoordinates, stairPolygons, 'stairsfull', 'black', "line");
    // fillCoordinateTypeLocal(data, roomCoordinates, roomPolygons, 'rooms', color[1], "line");
    fillCoordinateTypeLocal(data, doorCoordinates, doorPolygons, 'doors', color[2], "line");
    fillCoordinateTypeLocal(data, outlineCoordinates, outlinePolygons, 'outlines', color[3], "line");


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
	            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: stairWeight}));
	        }
	        else {
	            polygonList.push(Maze.polygon(coordinates[i], {color: color, weight: stairWeight}));
	        }
	    }
}

function fillCoordinateTypeLocal(data, coordinates, polygonList, coordinateType, color, lineOrPolygon) {
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
	            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: localWeight}));
	        }
	        else {
	            polygonList.push(Maze.polygon(coordinates[i], {color: color, weight: localWeight}));
	        }
	    }
	}
}

function fillCoordinateTypeServer(data, coordinates, polygonList, coordinateType, color, fillColor, fillOpacity, lineOrPolygon) {
    var temp;

    for (var i = 0; i < data.pois.length; i++) {
        for (var j = 0; j < data.pois[i].infos.length; j++) {
            if (data.pois[i].infos[j].poiTypeId == coordinateType){
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

                // if (coordinateType == RoomType.ROOM && coordinates[i].constructor === Array){
                if (coordinateType == RoomType.ROOM){
                    makeRoomNames(coordinates[i], data.pois[i].title);
                }
            }
        }
    }
    for (var i = 0; i < coordinates.length; i++) {
        if (lineOrPolygon == "line") {
            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: serverWeight}));
        }
        else {
            polygonList.push(Maze.polygon(coordinates[i], {color: color, fillColor: fillColor, weight: serverWeight, fillOpacity: fillOpacity}));
        }
    }
}

function makeListOfNames(data) {
	nameList = [];
	for (var i = 0; i < data.pois.length; i++) {
		nameList.push(data.pois[i].title);
	}
	return nameList;
}

function makeMergedNames(container, nameList) {
	if (container.length == 1) {
		return nameList[container[0]];
	}

	maxDistance = 0;
	maxIndex1 = 0;
	maxIndex2 = 0;

	for (var i = 0; i < container.length; i++) {
		for (var j = 0; j < container.length; j++) {
			if (getDistanceBetweenTwoPoints(getPoint(roomCoordinates[container[i]]), getPoint(roomCoordinates[container[j]])) > maxDistance) {
				maxDistance = getDistanceBetweenTwoPoints(getPoint(roomCoordinates[container[i]]), getPoint(roomCoordinates[container[j]]));
				maxIndex1 = container[i];
				maxIndex2 = container[j];
			}
		}
	}
	firstName = nameList[maxIndex1];
	lastName = nameList[maxIndex2];
	if (firstName < lastName) {
		return firstName + " - " + lastName;
	}
	return lastName + " - " + firstName;
}

function fillPolygons(coordinates, polygonList, color, fillColor, lineOrPolygon) {
    for (var i = 0; i < coordinates.length; i++) {
        if (lineOrPolygon == "line") {
            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: serverWeight}));
        }
        else {
            polygonList.push(Maze.polygon(coordinates[i], {color: color, fillColor: fillColor, fillOpacity: 1, weight: serverWeight}));
        }
    }
}

function fillMergedPolygons(coordinates, polygonList, container) {
    mergedRoomCoordinates = deepCopy(coordinates);
    for (var i = 0; i < coordinates.length; i++) {
        if (coordinates[i].length > 0){
            if (coordinates[i][0].constructor == Array){
                if (container[i].length == 1) {
                    polygonList.push(Maze.polygon(coordinates[i], {color: "black", fillColor: "white", fillOpacity: 1, weight: serverWeight}));
                }
                else {
                    polygonList.push(Maze.polygon(coordinates[i], {color: "black", fillColor: "#F1F1F1", fillOpacity: 1, weight: serverWeight}));
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
                map.addLayer(polygonList[i]);
            }
        }
        else if (polygonList[i]._latlngs[0][0]) {
            map.addLayer(polygonList[i]);
        }
        else {
            console.log("Trying to draw a non-polygon");
            console.log(polygonList[i]._latlngs);
        }
    }
}

function removePolygons(polygonList) {
    for (var i = 0; i < polygonList.length; i++) {
        map.removeLayer(polygonList[i]);
    }
}

function drawPolygonsBiggerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) > threshold) {
            map.addLayer(polygonList[i]);
        }
    }
}

function addNamesBiggerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) > threshold) {
            map.addLayer(mergedRoomNameMarkers[i]);
        }
    }
}

function removePolygonsBiggerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) > threshold) {
            map.removeLayer(polygonList[i]);
        }
    }
}

function removeNamesBiggerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) > threshold) {
            map.removeLayer(mergedRoomNameMarkers[i]);
        }
    }
}

function drawPolygonsSmallerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) <= threshold) {
            map.addLayer(polygonList[i]);
        }
    }
}

function addNamesSmallerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) <= threshold) {
            map.addLayer(roomNames[i]);
        }
        else if (getRoomCircumference(roomCoordinates[i]) >= threshold){
        }
        else {
            map.addLayer(roomNames[i]);
        }
    }
}

function addAllNames(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        map.addLayer(roomNames[i]);
    }
}

function removePolygonsSmallerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) <= threshold) {
            map.removeLayer(polygonList[i]);
        }
    }
}

function removeNamesSmallerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) <= threshold) {
            map.removeLayer(roomNames[i]);
        }
        else if (getRoomCircumference(roomCoordinates[i]) >= threshold){
        }
        else {
            map.removeLayer(roomNames[i]);
        }
    }
}

function removeAllNames(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        map.removeLayer(roomNames[i]);
    }
}

function makeRoomNames(coordinates, title) {
    if (coordinates.length == 2) {
        myIcon = Maze.divIcon({
            className: "labelClass",
            iconSize: new Maze.Point(30, 20),
            html: title
        });
        roomNames.push(Maze.marker(coordinates, {icon: myIcon}));
    }
    else {
        point = getPoint(coordinates);
        myIcon = Maze.divIcon({
            className: "labelClass",
            iconSize: new Maze.Point(30, 20),
            html: title
        });
        roomNames.push(Maze.marker(point, {icon: myIcon}));
    }
}

function makeMergedRoomNames(coordinates, title) {
	if (coordinates.length == 2) {
        myIcon = Maze.divIcon({
            className: "labelClass",
            iconSize: new Maze.Point(title.length * 6, 20),
            html: title
        });
        mergedRoomNameMarkers.push(Maze.marker(coordinates, {icon: myIcon}));
    }
    else {
        point = getPoint(coordinates);
        myIcon = Maze.divIcon({
            className: "labelClass",
            iconSize: new Maze.Point(title.length * 6, 20),
            html: title
        });
        mergedRoomNameMarkers.push(Maze.marker(point, {icon: myIcon}));
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
		if (getDistanceBetweenTwoPoints(coordinates[index][i], coordinates[index][i + 1]) > minimumDistance) {
			simplifiedCoordinates.push(coordinates[index][i]);
		}
	}
	simplifiedCoordinates.push(coordinates[index][coordinates[index].length - 1]);

	return simplifiedCoordinates;
}

function removeSmallEdges(coordinates, index) {
	simplifiedCoordinates = [];

	if ((getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][0]) >= veryImportantDistance
		&& getDistanceBetweenTwoPoints(coordinates[index][0], coordinates[index][1]) >= veryImportantDistance)
		|| (getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][0]) < veryImportantDistance
			&& getDistanceBetweenTwoPoints(coordinates[index][0], coordinates[index][1]) < veryImportantDistance)) {
		simplifiedCoordinates.push(coordinates[index][0]);
	}
	for (var i = 1; i < coordinates[index].length - 1; i++) {
		if ((getDistanceBetweenTwoPoints(coordinates[index][i - 1], coordinates[index][i]) >= veryImportantDistance
			&& getDistanceBetweenTwoPoints(coordinates[index][i], coordinates[index][i + 1]) >= veryImportantDistance)
			|| (getDistanceBetweenTwoPoints(coordinates[index][i - 1], coordinates[index][i]) < veryImportantDistance
				&& getDistanceBetweenTwoPoints(coordinates[index][i], coordinates[index][i + 1]) < veryImportantDistance)) {
			simplifiedCoordinates.push(coordinates[index][i]);
		}
	}
	if ((getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][coordinates[index].length - 1]) >= veryImportantDistance
		&& getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 1], coordinates[index][1]) >= veryImportantDistance)
		|| (getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][coordinates[index].length - 1]) < veryImportantDistance
			&& getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 1], coordinates[index][1]) < veryImportantDistance)) {
		simplifiedCoordinates.push(coordinates[index][coordinates[index].length - 1]);
	}
    if (coordinates[index].length > 2) {
        if (simplifiedCoordinates[0][0] == simplifiedCoordinates[simplifiedCoordinates.length - 1][0]
            && simplifiedCoordinates[0][1] == simplifiedCoordinates[simplifiedCoordinates.length - 1][1]) {
                // do nothing
        }
        else {
            if (getDistanceBetweenTwoPoints(simplifiedCoordinates[0], simplifiedCoordinates[simplifiedCoordinates.length - 1]) < minimumDistance) {
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

function removeSmallEdgesAlternative(coordinates, index) {
	simplifiedCoordinates = [];

	if ((getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][0]) < veryImportantDistance
		&& getDistanceBetweenTwoPoints(coordinates[index][0], coordinates[index][1]) < veryImportantDistance)) {
			// do nothing
	}
	else {
		simplifiedCoordinates.push(coordinates[index][0]);
	}
	for (var i = 1; i < coordinates[index].length - 1; i++) {
		if ((getDistanceBetweenTwoPoints(coordinates[index][i - 1], coordinates[index][i]) < veryImportantDistance
			&& getDistanceBetweenTwoPoints(coordinates[index][i], coordinates[index][i + 1]) < veryImportantDistance)) {
				// do nothing
		}
		else {
			simplifiedCoordinates.push(coordinates[index][i]);
		}
	}
	if ((getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][coordinates[index].length - 1]) < veryImportantDistance
		&& getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 1], coordinates[index][1]) < veryImportantDistance)) {

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
            if (getDistanceBetweenTwoPoints(simplifiedCoordinates[0], simplifiedCoordinates[simplifiedCoordinates.length - 1]) < minimumDistance) {
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
		L.popup().setLatLng(coordinates[i]).setContent(i.toString()).addTo(map);
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

function createMergedPolygons(data, roomCoordinates){
    var result = getNeighbors(data, roomCoordinates);

    var neighbors2 = result[0];
    var indeces = result[1];

    neighbors = deepCopy(neighbors2);

    container = [];

    for (var i = 0; i < roomCoordinates.length; i++) {
    	container.push([i]);
    }


    //for (var i = 0; i < roomCoordinates.length; i++) {
    //	for (var j = 0; j < roomCoordinates.length; j++) {
    for (var i = 0; i < roomCoordinates.length; i++) {
    	for (var j = 0; j < roomCoordinates.length; j++) {
    		if (contains(neighbors[i], j)) {
                if (!findOne(container[i], container[j])){

                    result0 = getDistPolyToPoly(roomCoordinates[i], roomCoordinates[j]);
                    result1 = getDistPolyToPoly(roomCoordinates[j], roomCoordinates[i]);
                    if (result1[2] < veryImportantDistance) {
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
    	mergedRoomNameStrings.push(makeMergedNames(container[i], nameList));
    }

    for (var i = 0; i < roomCoordinates.length; i++) {
    	makeMergedRoomNames(roomCoordinates[i], mergedRoomNameStrings[i]);
    }


    //Maze.polyline(roomCoordinates[13]).addTo(map);
    //var mergedPolygon = mergeTwoPolygons(roomCoordinates[room1], roomCoordinates[room2], indeces[room1][getNeighborIndex(room1, room2, neighbors)], indeces[room2][getNeighborIndex(room2, room1, neighbors)]);
    //Maze.polyline(mergedPolygon).addTo(map);
    [roomCoordinates, container] = removeDuplicateRooms(roomCoordinates, container, mergedRoomNameMarkers);
    // var roomCoordinates = simplifyRoomsMadeBySomeDude(roomCoordinates);
    roomCoordinates = simplifyRoomsMadeBySomeDude(roomCoordinates);
    fillMergedPolygons(roomCoordinates, mergedPolygons, container);

    return [roomCoordinates, container];

}

function markClosestCorners(data, simplifiedRoomCoordinates){
    var result = getNeighbors(data, simplifiedRoomCoordinates);
    var neighbors = result[0];
    var indeces = result[1];
    for (var i = 0; i < neighbors.length; i++) {
        for (var j = 0; j < neighbors[i].length; j++) {
            Maze.polyline([getPoint(simplifiedRoomCoordinates[i]),simplifiedRoomCoordinates[i][indeces[i][j][0]]], {color: 'blue', weight: stairWeight}).addTo(map);
            Maze.polyline([getPoint(simplifiedRoomCoordinates[i]),simplifiedRoomCoordinates[i][indeces[i][j][1]]], {color: 'green', weight: stairWeight}).addTo(map);
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
            if (getDistPoints(polygon1[i],polygon2[j]) < veryImportantDistance){
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
    mergedRoomNameMarkers = resultNameMarkers;
    return [resultRooms, resultContainer];
}
