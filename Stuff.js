// enum
var RoomType = {"OFFICE": 1, "CORRIDOR": 2, "STAIRS": 3, "COMPUTER_LAB": 4, "MEETING_ROOM": 5, "LECTURE_HALL": 6, "STUDY_ROOM": 7, "NOT_AVAILABLE": 8, "TOILETS": 9, "STORAGE_ROOM": 10, "LAB": 11, "COPY_ROOM": 12, "TECHNICAL": 13, "WARDROBE": 14, "SHOWER": 15, "GROUP_ROOM": 16, "INSTITUTE": 17, "FRAT": 18, "DRAWING_ROOM": 19, "LIBRARY": 20, "TEACHING_ROOM": 21, "STORE": 22, "CANTEEN": 23, "SIT": 24, "BUS_STOP": 27, "PARKING_LOT": 28, "WORKSHOP": 29};

// initialize rawResponse and event for asynchronous response from server
// Create global variable for storing the geography JSON in
var rawResponse;

// Create event for handling asynchronous responses from the server
var event = new Event('responseTextChange');

// Create a map
var map = Maze.map('mazemap-container', { campusloader: false });
map.setView([63.41431498967308,10.406826528933491], 15);

// One array of coordinates for each type of polygon
var roomCoordinates = [];
var stairCoordinates = [];
var outlineCoordinates = [];
var doorCoordinates = [];
var corridorCoordinates = [];

// Uncomment the preferred JSON file
getLocalJSON('floor_4_35.json');
getJSONfromServer();


/* JSON object from server */
function getJSONfromServer() {
    // Listen for the event.
    document.getElementById('mazemap-container').addEventListener('responseTextChange', function () { recievedJSONfromServer() }, false);

    getHttp("http://api.mazemap.com/api/pois/?campusid=1&floorid=159&srid=4326");
}

// This will contain the rest of the program, and will be run when we know we have received the JSON from the server
function recievedJSONfromServer() {
    var geoJSON = JSON.parse(rawResponse);
    var color = "red";
    fillCoordinateTypeServer(geoJSON, corridorCoordinates, RoomType.CORRIDOR, color, "polygon");
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
    fillCoordinateTypeLocal(data, stairCoordinates, 'stairs', color[0], "line");
    fillCoordinateTypeLocal(data, roomCoordinates, 'rooms', color[1], "line");
    fillCoordinateTypeLocal(data, doorCoordinates, 'doors', color[2], "line");
    fillCoordinateTypeLocal(data, outlineCoordinates, 'outlines', color[3], "line");


    // Draw markers on all stair coordinates
    //drawMarkersForStairs(stairCoordinates);
}

function fillCoordinateTypeLocal(data, coordinates, coordinateType, color, lineOrPolygon) {
    for (i = 0; i < data[coordinateType].features.length; i++) {
        coordinates.push(data[coordinateType].features[i].geometry.coordinates[0]);
        for (j = 0; j < coordinates[i].length; j++) {
            temp = coordinates[i][j][0];
            coordinates[i][j][0] = coordinates[i][j][1];
            coordinates[i][j][1] = temp;
        }
        if (lineOrPolygon == "line") {
            Maze.polyline(coordinates[i], {color: color}).addTo(map);
        }
        else {
            Maze.polygon(coordinates[i], {color: color}).addTo(map);
        }
    }
    console.log(coordinates);
}

function fillCoordinateTypeServer(data, coordinates, coordinateType, color, lineOrPolygon) {
    var temp;
    for (i = 0; i < data.pois.length; i++) {
        for (var j = 0; j < data.pois[i].infos.length; j++) {
            if (data.pois[i].infos[j].poiTypeId == coordinateType){
                coordinates.push(data.pois[i].geometry.coordinates[0]);

                console.log(coordinates);

                for (k = 0; k < coordinates[coordinates.length - 1].length; k++) {
                    temp = coordinates[coordinates.length - 1][k][0];
                    coordinates[coordinates.length - 1][k][0] = coordinates[coordinates.length - 1][k][1];
                    coordinates[coordinates.length - 1][k][1] = temp;
                }
            }
        }
    }
    for (i = 0; i < coordinates.length; i++) {
        if (lineOrPolygon == "line") {
            Maze.polyline(coordinates[i], {color: color}).addTo(map);
        }
        else {
            Maze.polygon(coordinates[i], {color: color}).addTo(map);
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
