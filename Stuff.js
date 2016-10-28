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
var stairWeight = 1;
var serverWeight = 1;
var localWeight = 1;
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

var zoomLevelsDrawn = {"16": false, "17": false, "18": false, "19": false, "20": false};

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

var roomPolygons = [];
var simplifiedRoomPolygons = [];
var stairPolygons = [];
var outlinePolygons = [];
var doorPolygons = [];
var corridorPolygons = [];

var roomNames = [];
var roomNameCoords = [];

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
	    if (!zoomLevelsDrawn["18"]) {
	        if (map.getZoom() >= 18) {
	            drawPolygons(corridorPolygons);
	            zoomLevelsDrawn["18"] = true;
	        }
	    }
	    if (zoomLevelsDrawn["18"]) {
	        if (map.getZoom() < 18) {
	            removePolygons(corridorPolygons);
	            zoomLevelsDrawn["18"] = false;
	        }
	    }
	    if (!zoomLevelsDrawn["19"]) {
	        if (map.getZoom() >= 19) {
	        	console.log("bulba");
	            drawPolygonsBiggerThanThreshold(simplifiedRoomCoordinates, simplifiedRoomPolygons, threshold);
	            zoomLevelsDrawn["19"] = true;
	        }
	    }
	    if (zoomLevelsDrawn["19"]) {
	        if (map.getZoom() < 19) {
	            removePolygonsBiggerThanThreshold(simplifiedRoomCoordinates, simplifiedRoomPolygons, threshold);
	            zoomLevelsDrawn["19"] = false;
	        }
	    }
	    if (!zoomLevelsDrawn["20"]) {
	        if (map.getZoom() >= 20) {
	            drawPolygonsSmallerThanThreshold(simplifiedRoomCoordinates, simplifiedRoomPolygons, threshold);
	            drawPolygons(doorPolygons);
	            drawPolygons(stairPolygons);
	            zoomLevelsDrawn["20"] = true;
	        }
	    }
	    if (zoomLevelsDrawn["20"]) {
	        if (map.getZoom() < 20) {
	            removePolygonsSmallerThanThreshold(simplifiedRoomCoordinates, simplifiedRoomPolygons, threshold);
	            removePolygons(doorPolygons);
	            removePolygons(stairPolygons);
	            zoomLevelsDrawn["20"] = false;
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

function simplifyRooms(roomCoordinates) {
	var simplifiedCoordinates = [];

	for (var i = 0; i < roomCoordinates.length; i++) {
		simplifiedCoordinates.push(removeSmallEdges(roomCoordinates, i));
	}
	return simplifiedCoordinates;
}

function drawPolygonFromOnlyCoordinates(coordinates, fillColor, outlineColor) {
	var simplifiedCoordinates = [];
	for (var i = 0; i < coordinates.length; i++) {
		simplifiedCoordinates.push(coordinates[i]);
	}
	//console.log("simplified");
    //console.log(simplifiedCoordinates);
	map.addLayer(Maze.polygon(simplifiedCoordinates, {color: outlineColor, fillColor: fillColor}));
}

// This will contain the rest of the program, and will be run when we know we have received the JSON from the server
function recievedJSONfromServer() {
    var geoJSON = JSON.parse(rawResponse);
    var color = "gray";
    var fillColor = "red";
    fillCoordinateTypeServer(geoJSON, corridorCoordinates, corridorPolygons, RoomType.CORRIDOR, color, fillColor, "polygon");
    fillCoordinateTypeServer(geoJSON, roomCoordinates, roomPolygons, RoomType.ROOM, color, fillColor, "line");

    removedDuplicatePoints = removeDuplicatesFromAllRooms(roomCoordinates);

    simplifiedRoomCoordinates = simplifyRooms(removedDuplicatePoints);

    fillPolygons(simplifiedRoomCoordinates, simplifiedRoomPolygons, color, fillColor, "polygon");

    var result = getNeighbors(geoJSON, simplifiedRoomCoordinates);

    console.log(result[0]);

    createMergedPolygons(geoJSON, simplifiedRoomCoordinates);
    // var result = getNeighbors(geoJSON, simplifiedRoomCoordinates);
    // var neighbors = result[0];
    // var indeces = result[1];
    // var i = 35;
    // var j = 20;
    // // var mergedRoom = mergeTwoPolygons(simplifiedRoomCoordinates[i], simplifiedRoomCoordinates[j], indeces[i][getNeighborIndex(i, j, neighbors)], indeces[j][getNeighborIndex(j, i, neighbors)]);
    // var mergedRoom = mergeTwoPolygons(simplifiedRoomCoordinates[35], simplifiedRoomCoordinates[20], indeces[35][getNeighborIndex(35,20,neighbors)], indeces[20][getNeighborIndex(20,35,neighbors)]);
    // result0 = getDistPolyToPoly(simplifiedRoomCoordinates[27], mergedRoom);
    // result1 = getDistPolyToPoly(mergedRoom, simplifiedRoomCoordinates[27]);
    // var mergedRoom2 = mergeTwoPolygons(simplifiedRoomCoordinates[27], mergedRoom, [result0[0],result0[1]], [result1[0],result1[1]]);
    // Maze.polyline(mergedRoom,{color: "red"}).addTo(map);
    // Maze.polyline(mergedRoom2).addTo(map);

    //markClosestCorners(geoJSON, simplifiedRoomCoordinates);

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

    //console.log(data["stairs"].features[2].geometry.coordinates[0]);

    // Fill the coordinate arrays for each type of polygon and draw to map
    fillCoordinateTypeLocal(data, stairCoordinates, stairPolygons, 'stairsfull', color[0], "line");
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

function fillCoordinateTypeServer(data, coordinates, polygonList, coordinateType, color, fillColor, lineOrPolygon) {
    var temp;
    // console.log(data);
    //console.log(coordinateType);

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
                    coordinates.push(data.pois[i].geometry.coordinates);
                    temp = coordinates[coordinates.length - 1][0];
                    coordinates[coordinates.length - 1][0] = coordinates[coordinates.length - 1][1];
                    coordinates[coordinates.length - 1][1] = temp;
                }

                // if (coordinateType == RoomType.ROOM && coordinates[i].constructor === Array){
                if (coordinateType == RoomType.ROOM){
                    makeRoomNames(coordinates[i], i);
                }
            }
        }
    }
    for (var i = 0; i < coordinates.length; i++) {
        if (lineOrPolygon == "line") {
            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: serverWeight}));
        }
        else {
            polygonList.push(Maze.polygon(coordinates[i], {color: color, fillColor: fillColor, weight: serverWeight}));
        }
    }
}

function fillPolygons(coordinates, polygonList, color, fillColor, lineOrPolygon) {
	for (var i = 0; i < coordinates.length; i++) {
        if (lineOrPolygon == "line") {
            polygonList.push(Maze.polyline(coordinates[i], {color: color, weight: serverWeight}));
        }
        else {
            polygonList.push(Maze.polygon(coordinates[i], {color: color, fillColor: fillColor, weight: serverWeight}));
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
            map.addLayer(polygonList[i]);
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
            map.addLayer(roomNames[i]);
        }
    }
}

function removePolygonsBiggerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) > threshold) {
            map.removeLayer(polygonList[i]);
            map.removeLayer(roomNames[i]);
        }
    }
}

function drawPolygonsSmallerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) < threshold) {
            map.addLayer(polygonList[i]);
            map.addLayer(roomNames[i]);
        }
    }
}

function removePolygonsSmallerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) < threshold) {
            map.removeLayer(polygonList[i]);
            map.removeLayer(roomNames[i]);
        }
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

	//console.log(coordinates);

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

function samePoiType(infos1, infos2, roomNumber){
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
        // return Math.sqrt(Math.pow(getDist(point,line[0]),2)-dotResult0*Math.pow(getDist(line[1],line[0]),2));
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
	//console.log(point);
    // return Math.abs((linepoint2[1]-linepoint1[1])*point[0]-(linepoint2[0]-linepoint1[0])*point[1]+linepoint2[0]*linepoint1[1]-linepoint2[1]*linepoint1[0])/Math.sqrt(Math.pow(linepoint2[1]-linepoint1[1],2)+Math.pow(linepoint2[0]-linepoint1[0],2));
    a = (linepoint2[1]-linepoint1[1])/(linepoint2[0]-linepoint1[0]);
    b = -1;
    c = linepoint1[1]-a*linepoint1[0];
    return Math.abs(a*point[0]+b*point[1]+c)/Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
}

function checkPointSequence(coordinates, index) {
	for (var i = 0; i < coordinates[index].length; i++) {
		L.popup().setLatLng(coordinates[index][i]).setContent(i.toString()).addTo(map);
	}
}

function mergeTwoPolygons(polygon1, polygon2, indeces1, indeces2){
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
    var partPolygon1 = getLongestPart(shiftedPolygon1, Math.abs(indeces1[1]-indeces1[0]));
    var partPolygon2 = getLongestPart(shiftedPolygon2, Math.abs(indeces2[1]-indeces2[0]));
    var mergedPolygon = partPolygon1.concat(partPolygon2,[partPolygon1[0]]);
    return mergedPolygon;
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



    var room1 = 10;
    var room2 = 24;

    for (var i = 0; i < simplifiedRoomCoordinates.length; i++) {
    	for (var j = 0; j < simplifiedRoomCoordinates.length; j++) {
    		if (contains(neighbors[i], j)) {
    			if (indeces[i][getNeighborIndex(i, j, neighbors)] != null && indeces[j][getNeighborIndex(j, i, neighbors)] != null) {
                    result0 = getDistPolyToPoly(roomCoordinates[i], roomCoordinates[j]);
                    result1 = getDistPolyToPoly(roomCoordinates[j], roomCoordinates[i]);
                    var mergedPolygon = mergeTwoPolygons(roomCoordinates[i], roomCoordinates[j], [result0[0],result0[1]], [result1[0],result1[1]]);

	    			if (i == 6 && j == 20) {
	    				console.log(deepCopy(neighbors)[20]);
	    				console.log(deepCopy(neighbors)[6]);
	    			}
                    console.log("Before");
                    console.log(deepCopy(neighbors[i]));
	    			neighbors[i].splice(neighbors[i].indexOf(j), 1);
                    console.log(deepCopy(neighbors[i]));
	    			neighbors[j].splice(neighbors[j].indexOf(i), 1);


	    			roomCoordinates[i] = mergedPolygon;
	    			roomCoordinates[j] = mergedPolygon;



    				for (var k = 0; k < neighbors[i].length; k++) {
	    				if (!contains(neighbors[j], neighbors[i][k]) && neighbors[i][k] != j) {
	    					neighbors[j].push(neighbors[i][k]);
	    				}
	    			}
	    			for (var k = 0; k < neighbors[j].length; k++) {
	    				if (!contains(neighbors[i], neighbors[j][k]) && neighbors[j][k] != i) {
	    					neighbors[i].push(neighbors[j][k]);
	    				}
	    			}

	    			if (i == 6 && j == 20) {
	    				console.log(deepCopy(neighbors)[20]);
	    				console.log(deepCopy(neighbors)[6]);
	    			}
    			}
    		}
    	}
    }

    for (var i = 0; i < roomCoordinates.length; i++) {
    	Maze.polyline(roomCoordinates[i]).addTo(map);
    }


    //Maze.polyline(roomCoordinates[13]).addTo(map);
    //console.log(neighbors[15]);
    //var mergedPolygon = mergeTwoPolygons(roomCoordinates[room1], roomCoordinates[room2], indeces[room1][getNeighborIndex(room1, room2, neighbors)], indeces[room2][getNeighborIndex(room2, room1, neighbors)]);
    //Maze.polyline(mergedPolygon).addTo(map);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
