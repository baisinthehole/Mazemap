var drawn = false;

// initialize rawResponse and event for asynchronous response from server
// Create global variable for storing the geography JSON in
var rawResponse;

// Create event for handling asynchronous responses from the server
var event = new Event('responseTextChange');

// Create a map
var map = Maze.map('mazemap-container', { campusloader: false });
map.setView([63.41431498967308,10.406826528933491], 15);
// Maze.Instancer.getCampus(1).then( function (campus) {
//     map.fitBounds(campus.getBounds());
//     campus.addTo(map).setActive().then( function() {
//         map.setZLevel(1);
//         map.getZLevelControl().show();
//     });
// });

// Uncomment the preferred JSON file
// getLocalJSON('floor_4_35.json');
// getJSONfromServer();


map.on('zoomend', function () {
    if (map.getZoom() >= 17 && !drawn) {
        console.log('Zoom is greater than 17');
        getLocalJSON('floor_4_35.json');

    }
    if (map.getZoom() < 17 && drawn)
    {
        console.log('Zoom is less than 17');
        clearMap();
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
    drawn = true;
    loadJSON(filename,
        function(data) { recievedLocalJSON(data); },
        function(xhr) { console.error(xhr); }
    );
}
function recievedLocalJSON(data) {
    var color = ['blue', 'gray', 'green', 'black'];
    var temp;
    var index = 0;
    for (var property in data) {
        var coordinates = [];
        if (property !== 'zOrder') {
            for (i = 0; i < data[property].features.length; i++) {
                coordinates.push(data[property].features[i].geometry.coordinates[0]);
                for (j = 0; j < coordinates[i].length; j++) {
                    temp = coordinates[i][j][0];
                    coordinates[i][j][0] = coordinates[i][j][1];
                    coordinates[i][j][1] = temp;
                }
            Maze.polygon(coordinates[i], {color: color[index]}).addTo(map);
            }
          index += 1;
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

function clearMap() {
    drawn = false;
    for(i in map._layers) {
        if(map._layers[i]._path != undefined) {
            try {
                map.removeLayer(map._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
    }
}
