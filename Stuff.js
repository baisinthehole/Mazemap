// enum
var RoomType = {"OFFICE": 1, "CORRIDOR": 2, "STAIRS": 3, "COMPUTER_LAB": 4, "MEETING_ROOM": 5, "LECTURE_HALL": 6, "STUDY_ROOM": 7, "NOT_AVAILABLE": 8, "TOILETS": 9, "STORAGE_ROOM": 10, "LAB": 11, "COPY_ROOM": 12, "TECHNICAL": 13, "WARDROBE": 14, "SHOWER": 15, "GROUP_ROOM": 16, "INSTITUTE": 17, "FRAT": 18, "DRAWING_ROOM": 19, "LIBRARY": 20, "TEACHING_ROOM": 21, "STORE": 22, "CANTEEN": 23, "SIT": 24, "BUS_STOP": 27, "PARKING_LOT": 28, "WORKSHOP": 29};

var corridorStyle = {"color": "gray", "fillColor": "red", "opacity": 1};

var drawn = false;

var threshold = 0.0005;

// initialize rawResponse and event for asynchronous response from server
// Create global variable for storing the geography JSON in
var rawResponse;

// Create event for handling asynchronous responses from the server
var event = new Event('responseTextChange');

var zoomLevelsDrawn = {"16": false, "17": false, "18": false, "19": false, "20": false};

// Create a map
var map = Maze.map('mazemap-container', { campusloader: false });
map.setView([63.41431498967308,10.406826528933491], 15);

// One array of coordinates for each type of polygon
var roomCoordinates = [];
var stairCoordinates = [];
var outlineCoordinates = [];
var doorCoordinates = [];
var corridorCoordinates = [];

var roomPolygons = [];
var stairPolygons = [];
var outlinePolygons = [];
var doorPolygons = [];
var corridorPolygons = [];

// Uncomment the preferred JSON file
getLocalJSON('floor_4_35.json');
getJSONfromServer();

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
            drawPolygonsBiggerThanThreshold(roomCoordinates, roomPolygons, threshold);
            zoomLevelsDrawn["19"] = true;
        }
    }
    if (zoomLevelsDrawn["19"]) {
        if (map.getZoom() < 19) {
            removePolygonsBiggerThanThreshold(roomCoordinates, roomPolygons, threshold);
            zoomLevelsDrawn["19"] = false;
        }
    }
    if (!zoomLevelsDrawn["20"]) {
        if (map.getZoom() >= 20) {
            drawPolygonsSmallerThanThreshold(roomCoordinates, roomPolygons, threshold);
            drawPolygons(doorPolygons);
            drawPolygons(stairPolygons);
            zoomLevelsDrawn["20"] = true;
        }
    }
    if (zoomLevelsDrawn["20"]) {
        if (map.getZoom() < 20) {
            removePolygonsSmallerThanThreshold(roomCoordinates, roomPolygons, threshold);
            removePolygons(doorPolygons);
            removePolygons(stairPolygons);
            zoomLevelsDrawn["20"] = false;
        }
    }
});


/* JSON object from server */
function getJSONfromServer() {
    // Listen for the event.
    document.getElementById('mazemap-container').addEventListener('responseTextChange', function () { recievedJSONfromServer() }, false);

    getHttp("http://api.mazemap.com/api/pois/?campusid=1&floorid=159&srid=4326");
}

// This will contain the rest of the program, and will be run when we know we have received the JSON from the server
function recievedJSONfromServer() {
    var geoJSON = JSON.parse(rawResponse);
    var color = "gray";
    var fillColor = "red";
    fillCoordinateTypeServer(geoJSON, corridorCoordinates, corridorPolygons, RoomType.CORRIDOR, color, fillColor, "polygon");
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
    fillCoordinateTypeLocal(data, roomCoordinates, roomPolygons, 'rooms', color[1], "line");
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
	            polygonList.push(Maze.polyline(coordinates[i], {color: color}));
	        }
	        else {
	            polygonList.push(Maze.polygon(coordinates[i], {color: color}));
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
	            polygonList.push(Maze.polyline(coordinates[i], {color: color}));
	        }
	        else {
	            polygonList.push(Maze.polygon(coordinates[i], {color: color}));
	        }
	    }
	}
    
}

function fillCoordinateTypeServer(data, coordinates, polygonList, coordinateType, color, fillColor, lineOrPolygon) {
    var temp;
    for (var i = 0; i < data.pois.length; i++) {
        for (var j = 0; j < data.pois[i].infos.length; j++) {
            if (data.pois[i].infos[j].poiTypeId == coordinateType){
                coordinates.push(data.pois[i].geometry.coordinates[0]);


                for (k = 0; k < coordinates[coordinates.length - 1].length; k++) {
                    temp = coordinates[coordinates.length - 1][k][0];
                    coordinates[coordinates.length - 1][k][0] = coordinates[coordinates.length - 1][k][1];
                    coordinates[coordinates.length - 1][k][1] = temp;
                }
            }
        }
    }
    for (var i = 0; i < coordinates.length; i++) {
        if (lineOrPolygon == "line") {
            polygonList.push(Maze.polyline(coordinates[i], {color: color}));
        }
        else {
            polygonList.push(Maze.polygon(coordinates[i], {color: color, fillColor: fillColor}));
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

function drawMarkersForStairs(stairCoordinates) {
    for (var i = 0; i < stairCoordinates.length; i++) {
        for (var j = 0; j < stairCoordinates[i].length; j++) {
            L.marker(stairCoordinates[i][j]).addTo(map);
        }
    }
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
        map.addLayer(polygonList[i]);
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

function removePolygonsBiggerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) > threshold) {
            map.removeLayer(polygonList[i]);
        }
    }
}

function drawPolygonsSmallerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) < threshold) {
            map.addLayer(polygonList[i]);
        }
    }
}

function removePolygonsSmallerThanThreshold(roomCoordinates, polygonList, threshold) {
    for (var i = 0; i < polygonList.length; i++) {
        if (getRoomCircumference(roomCoordinates[i]) < threshold) {
            map.removeLayer(polygonList[i]);
        }
    }
}
