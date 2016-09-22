// initialize rawResponse and event for asynchronous response from server
// Create global variable for storing the geography JSON in
var rawResponse;

// Create event for handling asynchronous responses from the server
var event = new Event('responseTextChange');

// Create a map
var map = Maze.map('mazemap-container', { campusloader: false });
map.setView([63.41431498967308,10.406826528933491], 15);

// Uncomment the preferred JSON file
getLocalJSON('floor_4_35.json');
// getJSONfromServer();


/* JSON object from server */
function getJSONfromServer() {
    // Listen for the event.
    document.getElementById('mazemap-container').addEventListener('responseTextChange', function () { recievedJSONfromServer() }, false);

    getHttp("http://api.mazemap.com/api/pois/?campusid=1&floorid=159&srid=4326");
}

// This will contain the rest of the program, and will be run when we know we have received the JSON from the server
function recievedJSONfromServer() {
    var geoJSON = JSON.parse(rawResponse);
    var temp;
    var color;
    var coordinates = [];
    console.log(geoJSON);
    for (i = 0; i < geoJSON.pois.length; i++) {
        color = 'blue';
        coordinates.push(geoJSON.pois[i].geometry.coordinates[0]);
        for (j = 0; j < coordinates[i].length; j++) {
            temp = coordinates[i][j][0];
            coordinates[i][j][0] = coordinates[i][j][1];
            coordinates[i][j][1] = temp;
        }
        // Draws different rooms in different colors
        for (var j = 0; j < geoJSON.pois[i].infos.length; j++) {
            // WC
            if (geoJSON.pois[i].infos[j].poiTypeId==9){
            color = 'red';
            }
            // corridors
            if (geoJSON.pois[i].infos[j].poiTypeId==2){
            color = 'green';
            }
        }
        Maze.polygon(coordinates[i], {color: color}).addTo(map);
    }
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
            console.error("Error", error);
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
    var temp;
    var index = 0;

    // One array of coordinates for each type of polygon
    var roomCoordinates = [];
    var stairCoordinates = [];
    var outlineCoordinates = [];
    var doorCoordinates = [];
    
    // Fill the coordinate arrays for each type of polygon and draw to map
    fillCoordinateType(data, stairCoordinates, 'stairs', color[0]);
    fillCoordinateType(data, roomCoordinates, 'rooms', color[1]);
    fillCoordinateType(data, doorCoordinates, 'doors', color[2]);
    fillCoordinateType(data, outlineCoordinates, 'outlines', color[3]);

    // Draw markers on all stair coordinates
    drawMarkersForStairs(stairCoordinates);
}

function fillCoordinateType(data, coordinates, coordinateType, color) {
    for (i = 0; i < data[coordinateType].features.length; i++) {
        coordinates.push(data[coordinateType].features[i].geometry.coordinates[0]);
        for (j = 0; j < coordinates[i].length; j++) {
            temp = coordinates[i][j][0];
            coordinates[i][j][0] = coordinates[i][j][1];
            coordinates[i][j][1] = temp;
        }
        Maze.polygon(coordinates[i], {color: color}).addTo(map);
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
