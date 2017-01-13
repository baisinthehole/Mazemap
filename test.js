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
