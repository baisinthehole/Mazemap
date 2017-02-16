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

function drawPolygonFromOnlyCoordinates(coordinates, fillColor, outlineColor) {
    var simplifiedCoordinates = [];
    for (var i = 0; i < coordinates.length; i++) {
        simplifiedCoordinates.push(coordinates[i]);
    }
    MAP.addLayer(Maze.polygon(simplifiedCoordinates, {color: outlineColor, fillColor: fillColor}));
}

function checkPointSequence(coordinates) {
    for (var i = 0; i < coordinates.length; i++) {
        Maze.popup().setLatLng(coordinates[i]).setContent(i.toString()).addTo(MAP);
    }
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

function testCrossing(point1, point2, polygon) {
    for (var i = 0; i < polygon.length - 1; i++) {
        console.log(crosses(point1, point2, polygon[i], polygon[i + 1]));
        if (crosses(point1, point2, polygon[i], polygon[i + 1])) {
            Maze.polyline([point1, point2], {color: 'black', weight: 1}).addTo(MAP);
            Maze.marker(point2).addTo(MAP);

            Maze.polyline([polygon[i], polygon[i + 1]], {color: 'black', weight: 1}).addTo(MAP);
            Maze.marker(polygon[i + 1]).addTo(MAP);

            console.log(i);
            console.log(i + 1);
        }
    }
}

function testCircleMerge(room1, room2) {
    drawPolygonFromOnlyCoordinates(room1, "red", "blue");
    drawPolygonFromOnlyCoordinates(room2, "red", "blue");
}

function drawAllCorridors() {
    for (var i = 0; i < GLOBAL_CORRIDOR_COORDINATES.length; i++) {
        drawPolygonFromOnlyCoordinates(GLOBAL_CORRIDOR_COORDINATES[i], "red", "blue");
    }
}

function testCirclePoints(testPoints1, testPoints2, testConnectedIndexes) {
    console.log(createCirclePolygons(testPoints1, testPoints2, testConnectedIndexes));
}

function getCorridorIndices() {
    for (var i = 0; i < globalCorridorCoordinates.length; i++) {
        if (globalCorridorCoordinates[i].length > 2) {
            Maze.popup().setLatLng(getPoint(deepCopy(globalCorridorCoordinates[i]))).setContent(i.toString()).addTo(MAP);
        }
    }
}

function test77() {

    for (var i = globalCorridorCoordinates.length-1; i >= 0; i--) {
        if (globalCorridorCoordinates[i].length == 2){
            globalCorridorCoordinates.splice(i, 1);
        }
    }
    globalCorridorCoordinates = removeDuplicatesFromAllRooms(globalCorridorCoordinates);
    var neighborCorridors = getNeighborsCorridors(globalCorridorCoordinates);
    console.log(neighborCorridors);
    getCorridorIndices();

    globalCorridorCoordinates = addPointsOnAllCorridors(neighborCorridors);

    var mergedPolygon = superDuperMerge(globalCorridorCoordinates[0], globalCorridorCoordinates[2]);

    var mergedPolygon2 = superDuperMerge(mergedPolygon, globalCorridorCoordinates[5]);

    var mergedPolygon3 = superDuperMerge(globalCorridorCoordinates[1], mergedPolygon2);

    var mergedPolygon4 = superDuperMerge(mergedPolygon3, globalCorridorCoordinates[3]);

    var mergedPolygon5 = superDuperMerge(mergedPolygon4, globalCorridorCoordinates[4]);

    var mergedPolygon6 = superDuperMerge(mergedPolygon5, globalCorridorCoordinates[7]);

    drawPolygonFromOnlyCoordinates(mergedPolygon6, "red", "blue");
}
