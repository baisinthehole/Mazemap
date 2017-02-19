function mergeTwoPolygons(polygon1, polygon2, indeces1, indeces2, point1 = undefined, point2 = undefined){
    if (polygon1 != polygon2){
        if (indeces1 != null && indeces2 != null){
            indeces1.sort(sorter);
            indeces2.sort(sorter);
            var shiftedPolygon1 = polygon1.slice(0, polygon1.length-1);
            for (var i = 0; i < indeces1[0]; i++) {
                shiftedPolygon1.push(shiftedPolygon1.shift());
            }
            var shiftedPolygon2 = polygon2.slice(0, polygon2.length-1);
            for (var i = 0; i < indeces2[0]; i++) {
                shiftedPolygon2.push(shiftedPolygon2.shift());
            }
            var partPolygon1 = getPartFarthestAway(shiftedPolygon1, indeces1[1]-indeces1[0]);
            var partPolygon2 = getPartFarthestAway(shiftedPolygon2, indeces2[1]-indeces2[0]);
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
                indeces1.sort(sorter);
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
                var partPolygon1 = getPartFarthestAway(shiftedPolygon1, indeces1[1]-indeces1[0]);
                var mergedPolygon;
                mergedPolygon = partPolygon1.concat(shiftedPolygon2,[partPolygon1[0]]);
                return mergedPolygon;
            }
            else {
                mergedPolygon = mergeWithRoomWithoutCloseCorners(polygon1, polygon2, indeces1, point1, point2);
                return mergedPolygon;
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


function getPartFarthestAway(polygon, index){
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
    if (getLongestDistToPart(part1, polygon) > getLongestDistToPart(part2, polygon)){
        return part1;
    }
    else {
        return part2;
    }
}

function getLongestDistToPart(part, polygon) {
    var longest = 0;
    for (var i = 0; i < part.length; i++) {
        if (longest < getMinDistToPoly(part[i], polygon)){
            longest = getMinDistToPoly(part[i], polygon);
        }
    }
    return longest;
}

function mergeAllPolygons(neighbors, roomCoordinates){
    var container = [];

    for (var i = 0; i < roomCoordinates.length; i++) {
        container.push([i]);
    }

    for (var i = 0; i < roomCoordinates.length; i++) {
        for (var j = 0; j < roomCoordinates.length; j++) {
            if (contains(neighbors[i], j)) {
                if (!findOne(container[i], container[j])) {


                    // var mergedPolygon = simpleMergeTwo(roomCoordinates[i], roomCoordinates[j]);
                    mergedPolygon = superMergeTwo(roomCoordinates[i], roomCoordinates[j]);
                    // mergedPolygon = superDuperMerge(roomCoordinates[i], roomCoordinates[j]);




                    if (mergedPolygon != -1) {
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
    return [roomCoordinates, container];
}

function mergeAllCorridors(neighbors, roomCoordinates){
    var container = [];

    for (var i = 0; i < roomCoordinates.length; i++) {
        container.push([i]);
    }

    var colors = ["blue", "red"];
    for (var i = 0; i < roomCoordinates.length; i++) {
        for (var j = 0; j < roomCoordinates.length; j++) {
            if (contains(neighbors[i], j)) {
                if (!findOne(container[i], container[j])) {


                    // var mergedPolygon = simpleMergeTwo(roomCoordinates[i], roomCoordinates[j]);
                    // mergedPolygon = superMergeTwo(roomCoordinates[i], roomCoordinates[j]);

                    // console.log("indices!");
                    // console.log(i);
                    // console.log(j);
                    // console.log("To be merged");
                    // console.log(i);
                    // console.log(j);
                    // if (i == 1 && j == 6){
                    if (false){
                        drawPolygonFromOnlyCoordinates(roomCoordinates[i], "white", "red");
                        drawPolygonFromOnlyCoordinates(roomCoordinates[j], "white", "blue");
                        // checkPointSequence(deepCopy(roomCoordinates[j]));
                        mergedPolygon = superDuperMerge(roomCoordinates[i], roomCoordinates[j], true);
                    }
                    else {
                        mergedPolygon = superDuperMerge(roomCoordinates[i], roomCoordinates[j]);
                    }




                    if (mergedPolygon != -1) {
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
    return [roomCoordinates, container];
}

function simpleMergeTwo(room1, room2, test=false){
    result0 = getDistPolyToPoly(room1, room2);
    result1 = getDistPolyToPoly(room2, room1);
    if (result1[2] < VERY_IMPORTANCE_DISTANCE && result0[2] < VERY_IMPORTANCE_DISTANCE) {
        if (test){
            console.log("result1[2] is less than very importance distance");
            console.log(result0);
            console.log(result1);
        }
        var mergedPolygon = mergeTwoPolygons(room1, room2, [result0[0],result0[1]], [result1[0],result1[1]]);
    }
    else if (result1[2] >= VERY_IMPORTANCE_DISTANCE && result0[2] < VERY_IMPORTANCE_DISTANCE){
        if (test){
            console.log("result1[2] is undefined");
            console.log(result0);
            console.log(result1);
        }
        var mergedPolygon = mergeTwoPolygons(room1, room2, [result0[0],result0[1]], undefined);
    }
    else if (result1[2] < VERY_IMPORTANCE_DISTANCE && result0[2] >= VERY_IMPORTANCE_DISTANCE){
        if (test){
            console.log("result0[2] is undefined");
        }
        var mergedPolygon = -1;
    }
    else {
        var mergedPolygon = -1;
    }
    return mergedPolygon;
}

function superMergeTwo(room1, room2, connectedIndexes = false, test=false){
    if (connectedIndexes) {
        if (connectedIndexes.length > 2) {
            console.log("This should be fixed");
        }
        if (test){
            console.log("Make better mergingPoints");
            displayConnectedIndexes(connectedIndexes, room1, room2);
        }
        var mergingPoints1 = [connectedIndexes[0][0], connectedIndexes[1][0]];
        var mergingPoints2 = [connectedIndexes[0][1], connectedIndexes[1][1]];
    }
    else {
        var pointsCloseEnough1 = getClosePoints(room1, room2);
        var pointsCloseEnough2 = getClosePoints(room2, room1);
        var mergingPoints1 = getMergingPoints(pointsCloseEnough1, room1, room2);
        var mergingPoints2 = getMergingPoints(pointsCloseEnough2, room2, room1);
    }

    var mergedPolygon;

    if (test){
        console.log("Merging points");
        console.log(deepCopy(mergingPoints1));
        console.log(deepCopy(mergingPoints2));
    }
    if (mergingPoints2[0]) {
        mergedPolygon = mergeTwoPolygons(room1, room2, mergingPoints1, mergingPoints2);
    }
    else {
        var point1;
        var point2;
        if (getMinDistToPolyPoints(room1[mergingPoints1[0]], room2) > VERY_IMPORTANCE_DISTANCE*3){
            point1 = createPointShortestDistance(room1[mergingPoints1[0]], room2);
        }
        if (getMinDistToPolyPoints(room1[mergingPoints1[1]], room2) > VERY_IMPORTANCE_DISTANCE*3){
            point2 = createPointShortestDistance(room1[mergingPoints1[1]], room2);
        }
        mergedPolygon = mergeTwoPolygons(room1, room2, mergingPoints1, undefined, point1, point2);
    }
    mergedPolygon = removeSharpPoint(mergedPolygon);
    return mergedPolygon;
}

// This should be optimized by only checking merged points
function removeSharpPoint(polygon){
    var deltaAngle = Math.PI/12;
    for (var i = polygon.length-3; i >= 0; i--) {
        var angle = getAngle(makeLine(polygon[i+1], polygon[i]), makeLine(polygon[i+1], polygon[i+2]));
        if (angle < deltaAngle || angle > 2*Math.PI - deltaAngle){
            polygon.splice(i+1, 1);
        }
    }
    return polygon;
}

function getClosePoints(room1, room2, test=false) {
    var closePoints = [];
    for (var i = 0; i < room1.length; i++) {
        if (getMinDistToPoly(room1[i], room2) < VERY_IMPORTANCE_DISTANCE){
            closePoints.push(i);
        }
    }

    if (test) {
        for (var i = 0; i < closePoints.length; i++) {
            Maze.popup().setLatLng(room1[closePoints[i]]).setContent("close " + i.toString()).addTo(MAP);
        }
    }

    return closePoints;
}

function findPairsOfPoints(polygon1, polygon2, test=false, testPoints=[], testRoomLength=0) {
    var room1 = deepCopy(polygon1);
    var room2 = deepCopy(polygon2);

    room1.splice(-1,1);
    room2.splice(-1,1);
    var points;
    var length;

    if (test) {
        points = testPoints;
        length = testRoomLength;
    }
    else {
        points = getClosePoints(room1, room2);
        length = room1.length;
    }


    var resultingPoints = [];
    var timesShifted = 0;


    if (points[0] == 0 && points[points.length - 1] == length - 1) {

        var currentValue = 0;

        while (currentValue == points[0]) {
            points.push(points.shift());

            currentValue++;

            timesShifted++;
        }
    }

    var originalIndex = 0;
    var currentIndex = 0;
    var nextIndex = 1

    for (var i = 0; i < points.length - timesShifted - 1; i++) {
        if (points[currentIndex] != points[nextIndex] - 1) {
            if (originalIndex != currentIndex) {
                resultingPoints.push(points[originalIndex]);
                resultingPoints.push(points[currentIndex]);

            }
            originalIndex = nextIndex;
        }
        currentIndex++;
        nextIndex++;
    }
    if (points[originalIndex] != points[points.length - 1]) {
        resultingPoints.push(points[originalIndex]);
        resultingPoints.push(points[points.length - 1]);
    }

    return resultingPoints;
}

function getFurthest(pointIndexes, room){
    var maxDist = 0;
    var dist;
    var index1;
    var index2;
    for (var i = 0; i < pointIndexes.length-1; i++) {
        for (var j = i+1; j < pointIndexes.length; j++) {
            dist = getDistPoints(pointIndexes[i], pointIndexes[j]);
            if (dist > maxDist){
                index1 = i;
                index2 = j;
            }
        }
    }
    return [i, j];
}

function removeMiddlePoints(pointIndexes) {
    return [pointIndexes[0], pointIndexes[pointIndexes.length-1]];
}

function connectWithClosest(pointIndexes1, pointIndexes2, room1, room2){
    var indexesConnected = [];
    var minDist;
    for (var i = 0; i < pointIndexes1.length; i++) {
        minDist = 12345234;
        for (var j = 0; j < room2.length; j++) {
            var dist = getDistPoints(room1[pointIndexes1[i]], room2[j]);
                if (dist < minDist){
                    minDist = dist;
                    index = j;
                }
            }
            indexesConnected.push([pointIndexes1[i], index]);
    }
    return indexesConnected;
}

function connectCirclePoints(room1, room2, pointIndexes1, pointIndexes2) {
    minDistance = 12345678;
    minIndex = 0;
    indexesConnected = [];


    var currentAngle;
    var currentDistance;
    var index;
    if (pointIndexes1.length > pointIndexes2.length) {
        // indexesConnected = connectWithClosest(pointIndexes1, pointIndexes2, room1, room2);
        for (var i = 0; i < pointIndexes2.length; i++) {
            var minDist = 12345654;
            for (var j = 0; j < pointIndexes1.length; j++) {
                var dist = getDistPoints(room2[pointIndexes2[i]], room1[pointIndexes1[j]]);
                if (dist < minDist){
                    minDist = dist;
                    index = j;
                }
            }
            indexesConnected.push([pointIndexes1[index], pointIndexes2[i]]);
        }
        var notUsedIndexes1 = removeClosestPoint(deepCopy(pointIndexes1), pointIndexes2, room1, room2);
        for (var i = 0; i < notUsedIndexes1.length; i++) {
            var minDist = 12345654;
            for (var j = 0; j < room2.length; j++) {
                var dist = getDistPoints(room1[notUsedIndexes1[i]], room2[j]);
                if (dist < minDist && !contains(pointIndexes2, j)){
                    minDist = dist;
                    index = j;
                }
            }
            pointIndexes2.push(index);
            indexesConnected.push([notUsedIndexes1[i], index]);
        }
    }
    else if (pointIndexes1.length < pointIndexes2.length) {
        for (var i = 0; i < pointIndexes1.length; i++) {
            var minDist = 12345654;
            for (var j = 0; j < pointIndexes2.length; j++) {
                var dist = getDistPoints(room1[pointIndexes1[i]], room2[pointIndexes2[j]]);
                if (dist < minDist){
                    minDist = dist;
                    index = j;
                }
            }
            indexesConnected.push([pointIndexes1[i], pointIndexes2[index]]);
        }
        var notUsedIndexes2 = removeClosestPoint(deepCopy(pointIndexes2), pointIndexes1, room2, room1);
        for (var i = 0; i < notUsedIndexes2.length; i++) {
            var minDist = 12345654;
            for (var j = 0; j < room1.length; j++) {
                var dist = getDistPoints(room2[notUsedIndexes2[i]], room1[j]);
                if (dist < minDist && !contains(pointIndexes1, j)){
                    minDist = dist;
                    index = j;
                }
            }
            pointIndexes1.push(index);
            indexesConnected.push([index, notUsedIndexes2[i]]);
        }
    }
    else {
        var usedIndexes2 = [];
        for (var i = 0; i < pointIndexes1.length; i++) {
            var minDist = 12345654;
            for (var j = 0; j < pointIndexes2.length; j++) {
                var dist = getDistPoints(room1[pointIndexes1[i]], room2[pointIndexes2[j]]);
                if (dist < minDist && !contains(usedIndexes2, j)){
                    minDist = dist;
                    index = j;
                }
            }
            usedIndexes2.push(index);
            indexesConnected.push([pointIndexes1[i], pointIndexes2[index]]);
        }
    }
    return indexesConnected;
}

function removeClosestPoint(indeces1, indeces2, room1, room2){
    var minIndex;
    for (var i = 0; i < indeces2.length; i++) {
        var minDist = 12345453423;
        for (var j = 0; j < indeces1.length; j++) {
            dist = getDistPoints(room2[indeces2[i]], room1[indeces1[j]]);
            if (dist < minDist){
                minDist = dist;
                minIndex = j;
            }
        }
        indeces1.splice(minIndex,1);
    }
    return indeces1;
}

function removeOtherPoint(indeces1, indeces2, room1, room2){
    var minIndex;
    var result = [];
    for (var i = 0; i < indeces2.length; i++) {
        var minDist = 12345453423;
        for (var j = 0; j < indeces1.length; j++) {
            dist = getDistPoints(room2[indeces2[i]], room1[indeces1[j]]);
            if (dist < minDist){
                minDist = dist;
                minIndex = j;
            }
        }
        result.push(indeces1[minIndex]);
        indeces1.splice(minIndex,1);
    }
    return result;
}

function superDuperMerge(room1, room2, test = false) {
    var result;
    var addedPoints;
    var pairs1;
    var pairs2;
    var connectedPoints;
    if (room1[0][0].constructor === Array && room2[0][0].constructor === Array){
        console.log("To be fixed");
    }
    else if (room1[0][0].constructor === Array){
        var biggestRoomIndex = getBiggestRoom(room1);
        room1[biggestRoomIndex] = makeClockWise(room1[biggestRoomIndex]);
        room2 = makeClockWise(room2);
        // if (!isClockwiseTest(room1[biggestRoomIndex])){
        //     checkPointSequence(room1[biggestRoomIndex]);
        // }
        addedPoints = addPointsForTwoPolygon(room1[biggestRoomIndex], room2);
        room1[biggestRoomIndex] = addedPoints[0];
        room2 = addedPoints[1];
        pairs1 = findPairsOfPoints(room1[biggestRoomIndex], room2);
        pairs2 = findPairsOfPoints(room2, room1[biggestRoomIndex]);
        connectedPoints = connectCirclePoints(room1[biggestRoomIndex], room2, pairs1, pairs2);
        if (test) {
            console.log("Room1 contains holes");
            console.log(deepCopy(pairs1));
            console.log(deepCopy(pairs2));
            console.log(isClockwise(room1[biggestRoomIndex]));
            console.log(deepCopy(connectedPoints));
            drawPolygonFromOnlyCoordinates(deepCopy(room2), "white", "green");
            displayConnectedIndexes(connectedPoints, room1[biggestRoomIndex], room2);
        }
        if (connectedPoints.length > 2){
            result = createCirclePolygons(pairs1, pairs2, room1[biggestRoomIndex], room2, connectedPoints);
        }
        else {
            result = [superMergeTwo(room1[biggestRoomIndex], room2, connectedPoints, true)];
        }
        for (var i = 0; i < room1.length; i++) {
            if (i != biggestRoomIndex) {
                result.push(room1[i]);
            }
        }
        return result;
    }
    else if (room2[0][0].constructor === Array){
        var biggestRoomIndex = getBiggestRoom(room2);
        room1 = makeClockWise(room1);
        room2[biggestRoomIndex] = makeClockWise(room2[biggestRoomIndex]);
        addedPoints = addPointsForTwoPolygon(room1, room2[biggestRoomIndex]);
        room1 = addedPoints[0];
        room2[biggestRoomIndex] = addedPoints[1];
        pairs1 = findPairsOfPoints(room1, room2[biggestRoomIndex]);
        pairs2 = findPairsOfPoints(room2[biggestRoomIndex], room1);
        connectedPoints = connectCirclePoints(room1, room2[biggestRoomIndex], pairs1, pairs2);
        if (test) {
            console.log("Room2 contains holes");
            console.log(deepCopy(pairs1));
            console.log(deepCopy(pairs2));
            console.log(deepCopy(connectedPoints));
            displayConnectedIndexes(connectedPoints, room1, room2[biggestRoomIndex]);
        }
        if (connectedPoints.length > 2){
            result = createCirclePolygons(pairs1, pairs2, room1, room2[biggestRoomIndex], connectedPoints);
        }
        else {
            result = [superMergeTwo(room1, room2[biggestRoomIndex], connectedPoints, true)];
        }
        for (var i = 0; i < room2.length; i++) {
            if (i != biggestRoomIndex) {
                result.push(room2[i]);
            }
        }
        return result;
    }
    room1 = makeClockWise(room1);
    room2 = makeClockWise(room2);
    addedPoints = addPointsForTwoPolygon(room1, room2);
    room1 = addedPoints[0];
    room2 = addedPoints[1];
    pairs1 = findPairsOfPoints(room1, room2);
    pairs2 = findPairsOfPoints(room2, room1);
    connectedPoints = connectCirclePoints(room1, room2, pairs1, pairs2);
    if (test) {
        console.log("No room contains holes");
        console.log(deepCopy(pairs1));
        console.log(deepCopy(pairs2));
        console.log(deepCopy(connectedPoints));
        displayConnectedIndexes(connectedPoints, room1, room2);
    }
    if (connectedPoints.length > 2) {
        result = createCirclePolygons(pairs1, pairs2, room1, room2, connectedPoints);
        return result;
    }
    else {
        result = superMergeTwo(room1, room2);
        return result;
    }
}

function makeClockWise(poly) {
    if (isClockwise(poly)){
        return poly;
    }
    else {
        return poly.reverse();
    }
}

// function isClockwise(poly) {
//     var sum = 0
//     for (var i=0; i<poly.length-1; i++) {
//         var cur = poly[i],
//             next = poly[i+1]
//         sum += (next[1] - cur[1]) * (next[0] + cur[0])
//     }
//     return sum > 0
// }

function isClockwise(poly) {
    var sum = 0
    var cur;
    var next;
    for (var i=0; i<poly.length-1; i++) {
        cur = poly[i];
        next = poly[i+1];
        sum += (cur[1] * next[0]) - (cur[0] * next[1]);
    }
    cur = poly[poly.length-1];
    next = poly[0];
    sum += (cur[1] * next[0]) - (cur[0] * next[1]);
    return sum < 0;
}

function getBiggestRoom(room1) {
    var biggestCircumference = 0;
    var index;
    for (var i = 0; i < room1.length; i++) {
        if (getRoomCircumference(room1[i]) > biggestCircumference){
            biggestCircumference = getRoomCircumference(room1[i]);
            index = i;
        }
    }
    return index;
}

function createCirclePolygons(points1, points2, polygon1, polygon2, connectedIndexes) {
    var resultRooms = [];
    var resultRoom = [];
    var index = connectedIndexes[0][0];
    var roomNr = 0;
    var increasing = true;
    var counter = 0;
    var broken = false;
    // if (points1[0] == 0 && polygon1[1] == 1){
    //     console.log("Do stuff!");
    //     drawPolygonFromOnlyCoordinates(polygon1, "white", "red");
    //     drawPolygonFromOnlyCoordinates(polygon2, "white", "blue");
    //     for (var i = 0; i < points1.length; i++) {
    //         Maze.popup().setLatLng(polygon1[points1[i]]).setContent(points1[i].toString()).addTo(MAP);
    //     }
    //     for (i = 0; i < points2.length; i++) {
    //         Maze.popup().setLatLng(polygon2[points2[i]]).setContent(points2[i].toString()).addTo(MAP);
    //     }
    // }
    while (points1.length > 0 || resultRoom[0] != polygon1[index]) {
        counter++;
        if (counter > 9990) {
            console.log(index);
        }
        if (counter == 10000) {
            Maze.popup().setLatLng(resultRoom[0]).setContent("Start point!").addTo(MAP);
            broken = true;
            break;
        }
        // If a result room is complete
        if (resultRoom.length > 1 && roomNr == 0){
            if (resultRoom[0] == polygon1[index]){
                resultRooms.push(resultRoom);
                // console.log("End");
                // console.log(deepCopy(points1));
                // console.log(deepCopy(points2));
                // console.log(deepCopy(connectedIndexes));
                // return resultRooms;
                resultRoom = [];
                index = points1[0];
                roomNr = 0;
            }
        }
        if (roomNr == 0){
            resultRoom.push(polygon1[index]);
            if (contains(points1, index)){
                var outerIndex = getOuterIndex(index, roomNr, connectedIndexes);
                points = findIncreasingAndDecreasingPoints(outerIndex, roomNr, polygon1, polygon2, connectedIndexes);
                var testpoints2 = findIncreasingAndDecreasingPoints(outerIndex, 1, polygon1, polygon2, connectedIndexes);
                increasing = isIncreasing(connectedIndexes[outerIndex][roomNr], points[0], points[1], polygon1);
                increasing = checkIncreasingIsSmallEnough(roomNr, connectedIndexes[outerIndex], deepCopy(points), testpoints2, polygon1, polygon2);
                points1.splice(points1.indexOf(index), 1);
                index = getOtherConnectedPoint(index, roomNr, connectedIndexes);
                points2.splice(points2.indexOf(index), 1);
                roomNr = 1;
            }
            else {
                if (increasing){
                    index = mod(index+1, polygon1.length);
                }
                else {
                    index = mod(index-1, polygon1.length);
                }
            }
        }
        else {
            resultRoom.push(polygon2[index]);
            if (contains(points2, index)){
                var outerIndex = getOuterIndex(index, roomNr, connectedIndexes);
                points = findIncreasingAndDecreasingPoints(outerIndex, roomNr, polygon1, polygon2, connectedIndexes);
                var testpoints2 = findIncreasingAndDecreasingPoints(outerIndex, 0, polygon1, polygon2, connectedIndexes);
                increasing = isIncreasing(connectedIndexes[outerIndex][roomNr], points[0], points[1], polygon2);
                increasing = !checkIncreasingIsSmallEnough(roomNr, connectedIndexes[outerIndex], testpoints2, deepCopy(points), polygon1, polygon2);
                points2.splice(points2.indexOf(index), 1);
                index = getOtherConnectedPoint(index, roomNr, connectedIndexes);
                points1.splice(points1.indexOf(index), 1);
                roomNr = 0;
            }
            else {
                if (increasing){
                    index = mod(index+1, polygon2.length);
                }
                else {
                    index = mod(index-1, polygon2.length);
                }
            }
        }
    }
    if (broken){
        drawPolygonFromOnlyCoordinates(polygon1, "white", "blue");
        drawPolygonFromOnlyCoordinates(polygon2, "white", "red");
        checkPointSequence(polygon2);
        console.log("broken");
        console.log(points1);
        console.log(points2);
        console.log(connectedIndexes);
        console.log(polygon1);
        console.log(polygon2);
        console.log(resultRoom);
    }
    resultRooms.push(resultRoom);
    return resultRooms;
}

function getOuterIndex(index, roomNr, connectedIndexes){
    for (var i = 0; i < connectedIndexes.length; i++) {
        if (connectedIndexes[i][roomNr] == index){
            return i;
        }
    }
}

function getOtherConnectedPoint(index, roomNr, connectedIndexes){
    for (var i = 0; i < connectedIndexes.length; i++) {
        if (connectedIndexes[i][roomNr] == index){
            return connectedIndexes[i][mod(roomNr+1, 2)];
        }
    }
}

function findIncreasingAndDecreasingPoints(outerIndex, innerIndex, polygon1, polygon2, connectedIndexes) {

	var oppositeIndex = mod(innerIndex - 1, 2);
	var connectPoint = connectedIndexes[outerIndex][oppositeIndex];

	var points = [];

    var lowerIndex = connectPoint + 1;
    var higherIndex = connectPoint - 1;
    var outerIndexLower;
    var outerIndexHigher;
	for (var i = 0; i < connectedIndexes.length; i++) {
        if (mod(connectedIndexes[i][oppositeIndex] + polygon2.length - connectPoint, polygon2.length) > mod(lowerIndex + polygon2.length - connectPoint, polygon2.length)){
            lowerIndex = connectedIndexes[i][oppositeIndex];
            outerIndexLower = i;
        }
        if (mod(connectedIndexes[i][oppositeIndex] - connectPoint -1, polygon2.length) < mod(higherIndex - connectPoint -1, polygon2.length)){
            higherIndex = connectedIndexes[i][oppositeIndex];
            outerIndexHigher = i;
        }
	}
    return [connectedIndexes[outerIndexLower][innerIndex], connectedIndexes[outerIndexHigher][innerIndex]];
}

function isIncreasing(startIndex, endIndex1, endIndex2, polygon) {
    var currentIndex = startIndex;
    var previousIndex = startIndex;
    var currentDistance = 0;

    var resultDistances = [[],[]];

    while (currentIndex != endIndex1) {
        currentIndex = mod((currentIndex + 1), polygon.length);

        currentDistance += getDistPoints(polygon[previousIndex], polygon[currentIndex]);

        previousIndex = mod((previousIndex + 1), polygon.length);
    }

    resultDistances[0].push(currentDistance);

    currentIndex = startIndex;
    previousIndex = startIndex;
    currentDistance = 0;

    while (currentIndex != endIndex1) {
        currentIndex = mod((currentIndex - 1), polygon.length);

        currentDistance += getDistPoints(polygon[previousIndex], polygon[currentIndex]);

        previousIndex = mod((previousIndex - 1), polygon.length);
    }
    resultDistances[0].push(currentDistance);

    currentIndex = startIndex;
    previousIndex = startIndex;
    currentDistance = 0;

    while (currentIndex != endIndex2) {
        currentIndex = mod((currentIndex + 1), polygon.length);

        currentDistance += getDistPoints(polygon[previousIndex], polygon[currentIndex]);

        previousIndex = mod((previousIndex + 1), polygon.length);
    }
    resultDistances[1].push(currentDistance);

    currentIndex = startIndex;
    previousIndex = startIndex;
    currentDistance = 0;

    while (currentIndex != endIndex2) {
        currentIndex = mod((currentIndex - 1), polygon.length);

        currentDistance += getDistPoints(polygon[previousIndex], polygon[currentIndex]);

        previousIndex = mod((previousIndex - 1), polygon.length);
    }
    resultDistances[1].push(currentDistance);

    var min1 = Math.min(resultDistances[0][0], resultDistances[0][1]);
    var min2 = Math.min(resultDistances[1][0], resultDistances[1][1]);

    if (min1 < min2) {
        return true;
    }
    return false;
}

function checkIncreasingIsSmallEnough(roomNr, startIndexes, points1, points2, polygon1, polygon2) {
    // room0 increasing
    // room 1 decreasing

    return (checkIfDistancesIsSmallEnough(startIndexes[0], points1[0], polygon1, polygon2) && checkIfDistancesIsSmallEnough2(startIndexes[1], points2[1], polygon2, polygon1));
}

function checkIfDistancesIsSmallEnough(startIndex, endIndex, polygon1, polygon2) {
    for (var i = 0; i < mod(endIndex-startIndex,polygon1.length); i++) {
        if (getMinDistToPoly(polygon1[mod(startIndex+i,polygon1.length)], polygon2) > VERY_IMPORTANCE_DISTANCE) {
            return false;
        }
    }
    return true;
}

function checkIfDistancesIsSmallEnough2(startIndex, endIndex, polygon1, polygon2) {
    for (var i = 0; i < mod(startIndex-endIndex,polygon1.length); i++) {
        if (getMinDistToPoly(polygon1[mod(startIndex-i,polygon1.length)], polygon2) > VERY_IMPORTANCE_DISTANCE) {
            return false;
        }
    }
    return true;
}


function getMergingPoints(pointsCloseEnough, room1, room2){
    var longestDist = 0;
    var dist;
    var index1;
    var index2;
    for (var i = 0; i < pointsCloseEnough.length - 1; i++) {
        for (var j = i; j < pointsCloseEnough.length; j++) {
            dist = haversineDistance(room1[pointsCloseEnough[i]], room1[pointsCloseEnough[j]]);
            if (dist > longestDist){
                if (!pointTooFarAway([pointsCloseEnough[i], pointsCloseEnough[j]], room1, room2)){
                    longestDist = dist;
                    index1 = pointsCloseEnough[i];
                    index2 = pointsCloseEnough[j];
                }
            }
        }
    }
    return [index1, index2];
}

function pointTooFarAway(indeces, room1, room2) {
    for (var i = indeces[0]+1; i < indeces[1]; i++) {
        if (haversineDistance(room1[i%room1.length], room2) > VERY_IMPORTANCE_DISTANCE*5){
            return true;
        }
    }
    return false;
}

function sorter(a, b) {
    if (a < b) return -1;  // any negative number works
    if (a > b) return 1;   // any positive number works
    return 0; // equal values MUST yield zero
}

function findOrderOfRooms(oldNeighbors, container) {
	var orderedRooms = [];

	var usedIndices = [];

	var currentIndex = 0;

	for (var i = 0; i < container.length; i++) {
		orderedRooms.push([]);
		usedIndices.push([]);

		[maxIndex1, maxIndex2] = findFarthestRooms(container[i]);

		if (oldNeighbors[maxIndex1].length > 1) {

			orderedRooms[i].push(maxIndex2);

			usedIndices[i].push(maxIndex2);

			currentIndex = maxIndex2;
		}
		else {

			orderedRooms[i].push(maxIndex1);

			usedIndices[i].push(maxIndex1);

			currentIndex = maxIndex1;
		}
		for (var j = 0; j < container[i].length; j++) {
			if (contains(oldNeighbors[currentIndex], container[i][j])) {
				if (!contains(usedIndices[i], container[i][j])) {



					orderedRooms[i].push(container[i][j]);

					usedIndices[i].push(container[i][j]);

					currentIndex = container[i][j];

					j = -1;
				}
			}
		}

	}
	return orderedRooms;
}

function createDifferentMergingLevels(orderedRooms) {
	var mergingLevels = [[orderedRooms]];

	var amount = orderedRooms.length;

	var currentIndex = 0;

	var currentInternalStartIndex = 0;

	var currentInternalEndIndex = 0;

    var maxNrOfRooms = 3;

	while (amount > maxNrOfRooms) {

		mergingLevels.push([]);



		for (var i = 0; i < mergingLevels[currentIndex].length; i++) {
			if (isOdd(mergingLevels[currentIndex][i].length)) {

				amount = Math.ceil(mergingLevels[currentIndex][i].length / 2);

                if (mergingLevels[currentIndex][i].length != maxNrOfRooms) {
                    currentInternalEndIndex = currentInternalStartIndex + amount - 1;

                    mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));

                    currentInternalStartIndex = currentInternalEndIndex;
                    currentInternalEndIndex = currentInternalStartIndex + amount;

                    mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));
                    currentInternalStartIndex = currentInternalEndIndex;
                }
                else {
                    currentInternalEndIndex = currentInternalStartIndex+2*amount-1;
                    mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));
                    currentInternalStartIndex = currentInternalEndIndex;
                }
			}
			else {
				amount = mergingLevels[currentIndex][i].length / 2;

				currentInternalEndIndex = currentInternalStartIndex + amount;

				mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));

				currentInternalStartIndex = currentInternalEndIndex;
				currentInternalEndIndex = currentInternalStartIndex + amount;

				mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));
				currentInternalStartIndex = currentInternalEndIndex;
			}
		}

		currentIndex++;

		currentInternalStartIndex = 0;
	}

	return mergingLevels;
}

function isOdd(number) {
	return number % 2 != 0;
}

// Only use this function on a copied version of neighbors and not the neighbors used for merging!
function makeNeighborsWhoAreNotNeighborsNeighbors(neighbors) {
	for (var i = 0; i < neighbors.length; i++) {
		for (var j = 0; j < neighbors[i].length; j++) {
			if (!contains(neighbors[neighbors[i][j]], i)) {
				neighbors[neighbors[i][j]].push(i);
			}
		}
	}
	return neighbors;
}

function dynamicMergeAllRooms(allOrderedRooms) {
    for (var i = 0; i < allOrderedRooms.length; i++) {
        allOrderedRooms[i] = createDifferentMergingLevels(allOrderedRooms[i]);
    }
    return allOrderedRooms;
}

function mergeAllPolygonsDynamic(allOrderedRooms, roomCoordinates) {
    for (var i = 0; i < allOrderedRooms.length; i++) {

        if (allOrderedRooms[i].length > 1) {
            for (var j = 0; j < allOrderedRooms[i].length; j++) {

            }
        }

        for (var j = 0; j < allOrderedRooms[i].length; j++) {

        }
    }
}


function mergeZoomLevel(index, rooms){
    if (index.length < 2){
        return rooms[index[0]];
    }
    var resultRoom = simpleMergeTwo(rooms[index[0]], rooms[index[1]]);
    if (resultRoom==-1){
        resultRoom = simpleMergeTwo(rooms[index[1]], rooms[index[0]]);
    }
    var tempResultRoom;
    for (var i = 2; i < index.length; i++) {
        tempResultRoom = simpleMergeTwo(resultRoom, rooms[index[i]]);
        if (tempResultRoom == -1){
            resultRoom = simpleMergeTwo(rooms[index[i]],resultRoom);
        }
        else {
            resultRoom = tempResultRoom;
        }
    }
    return resultRoom;
}

function fillZoomLevels(dynamicMergedRooms, oldRooms){
    var globalZoomLevels = [[],[],[]];
    var index;
    var lastPolygon;

    for (var i = 0; i < dynamicMergedRooms.length; i++) {
        if (dynamicMergedRooms[i][0][0].length > 1){
            for (var j = 0; j < 3; j++) {
                index = dynamicMergedRooms[i].length-1-j;
                if (index >= 0){
                    for (var k = 0; k < dynamicMergedRooms[i][index].length; k++) {
                        lastPolygon = mergeZoomLevel(dynamicMergedRooms[i][index][k], oldRooms);
                        globalZoomLevels[2-j].push(deepCopy(lastPolygon));
                    }
                }
                else {
                    globalZoomLevels[2-j].push(lastPolygon);
                }
            }
        }
    }
    return globalZoomLevels;
}

function fillZoomLevelPolygons(coordinates){
    fillPolygons(coordinates[0], mergedLarge, "gray", "lemonchiffon", "polygon");
    fillPolygons(coordinates[1], mergedMedium, "gray", "lemonchiffon", "polygon");
    fillPolygons(coordinates[2], mergedSmall, "gray", "lemonchiffon", "polygon");
}

function getUnmergedRooms(container, coordinates) {
    for (var i = 0; i < container.length; i++) {
        if (container[i].length == 1) {
            if (GLOBAL_ROOM_COORDINATES[i].length > 0){
                globalUnmergedRoomsSimplified.push(coordinates[i]);
                globalUnmergedRooms.push(GLOBAL_ROOM_COORDINATES[i]);
                globalUnmergedNames.push(makeLocalRoomNames(GLOBAL_ROOM_COORDINATES[i], GEO_JSON.pois[i].title));
            }
        }
    }
    fillPolygons(globalUnmergedRoomsSimplified, globalUnmergedPolygonsSimplified, "gray", "white", "line");
    fillPolygons(globalUnmergedRooms, globalUnmergedPolygons, "gray", "white", "line");

}

function makeMergedNameStrings(mergedRooms, nameList) {
    var textZoomLevels = [[],[],[]];
    var index;
    var lastText;

    for (var i = 0; i < dynamicMergedRooms.length; i++) {
        if (dynamicMergedRooms[i][0][0].length > 1){
            for (var j = 0; j < 3; j++) {
                index = dynamicMergedRooms[i].length-1-j;
                if (index >= 0){
                    for (var k = 0; k < dynamicMergedRooms[i][index].length; k++) {
                        if (nameList[dynamicMergedRooms[i][index][k][0]] < nameList[dynamicMergedRooms[i][index][k][dynamicMergedRooms[i][index][k].length - 1]]) {
                            lastText = nameList[dynamicMergedRooms[i][index][k][0]] + " - " + getDiffRoomNames(nameList[dynamicMergedRooms[i][index][k][0]], nameList[dynamicMergedRooms[i][index][k][dynamicMergedRooms[i][index][k].length - 1]]);
                        }
                        else {
                            lastText = nameList[dynamicMergedRooms[i][index][k][dynamicMergedRooms[i][index][k].length - 1]] + " - " + getDiffRoomNames(nameList[dynamicMergedRooms[i][index][k][dynamicMergedRooms[i][index][k].length - 1]], nameList[dynamicMergedRooms[i][index][k][0]]);
                        }
                        textZoomLevels[2-j].push(lastText);
                    }
                }
                else {
                    textZoomLevels[2-j].push(lastText);
                }
            }
        }
    }
    return textZoomLevels;
}

function getDiffRoomNames(roomName1, roomName2){
    for (var i = 0; i < roomName1.length; i++) {
        if (roomName1.charAt(i) !== roomName2.charAt(i) || i == roomName2.length-2) {
            if (i == roomName2.length-2 && isNaN(roomName2.charAt(roomName2.length-1))){
                return roomName2.slice(-3);
            }
            return roomName2.slice(i);
        }
    }
}

function convertMergedTextIntoPOIs(textZoomLevels, zoomLevelsCoordinates) {
    for (var i = 0; i < textZoomLevels.length; i++) {
        for (var j = 0; j < textZoomLevels[i].length; j++) {
            point = getPoint(zoomLevelsCoordinates[i][j]);
            myIcon = Maze.divIcon({
                className: "labelClass",
                iconSize: new Maze.Point(textZoomLevels[i][j].length * 6.5, 20),
                html: textZoomLevels[i][j]
            });
            if (i == 0) {
                mergedTextLarge.push(Maze.marker(point, {icon: myIcon}));
            }
            else if (i == 1) {
                mergedTextMedium.push(Maze.marker(point, {icon: myIcon}));
            }
            else {
                mergedTextSmall.push(Maze.marker(point, {icon: myIcon}));
            }
        }
    }
}

function mergeCorridors(){

    for (var i = globalCorridorCoordinates.length-1; i >= 0; i--) {
        if (globalCorridorCoordinates[i].length == 2){
            globalCorridorCoordinates.splice(i, 1);
        }
    }
    // globalCorridorCoordinates = removeDuplicatesFromAllRooms(globalCorridorCoordinates);
    var neighborCorridors = getNeighborsCorridors(globalCorridorCoordinates);
    // console.log(neighborCorridors);
    // getCorridorIndices();
    [mergedCorridors, corridorContainer] = mergeAllCorridors(neighborCorridors, globalCorridorCoordinates);
    for (var i = 0; i < mergedCorridors.length; i++) {
        drawPolygonFromOnlyCoordinates(mergedCorridors[i], "white", "blue");
    }
    return mergedCorridors;
}

function mergeWithRoomWithoutCloseCorners(polygon1, polygon2, indeces1, point1, point2){
    var a = polygon1[indeces1[0]];
    var b = polygon1[indeces1[1]];
    var line1 = makeLine(a, b);
    var line2 = makeLine(b, a);
    var leastDistance1 = 1234546;
    var leastDistance2 = 1234546;
    var leastIndex1;
    var leastIndex2;
    var dist;
    // polygon2 = addPointOnLine(polygon1[indeces1[0]], polygon2);

    // Move points if it inside the polygon it should merge with
    if (a, inside(a, polygon2)){
        a = moveOutside(a, polygon2);
    }
    if (b, inside(b, polygon2)){
        b = moveOutside(b, polygon2);
    }

    for (var i = 0; i < polygon2.length-1; i++) {
        // Switch point a and b if the polygon is on the other side than expected
        // This is not tested and will therefore probably not work correctly!!!!!!!!!!!!!!!!!!
        if (findOutsideOfPolygon(a, b, polygon2)){
            console.log("Switching point a and point b");
            var temp = deepCopy(a);
            a = deepCopy(b);
            b = deepCopy(temp);
            line1 = makeLine(a, b);
            line2 = makeLine(b, a);
        }
        if (!crossesPolygon(a,polygon2[i],polygon2) && mergingAngle(line1, makeLine(a, polygon2[i]))){
            dist = haversineDistance(a,polygon2[i]);
            if (dist < leastDistance1){
                leastDistance1 = dist;
                leastIndex1 = i;
            }
        }
    }
    for (var i = 0; i < polygon2.length-1; i++) {
        if (!crossesPolygon(b,polygon2[i],polygon2) && mergingAngle(makeLine(b, polygon2[i]), line2)){
            dist = haversineDistance(b,polygon2[i]);
            if (dist < leastDistance2){
                leastDistance2 = dist;
                leastIndex2 = i;
            }
        }
    }

    var indeces2 = [leastIndex1, leastIndex2];
    indeces1.sort(sorter);
    indeces2.sort(sorter);
    var shiftedPolygon1 = polygon1.slice(0, polygon1.length-1);
    for (var i = 0; i < indeces1[0]; i++) {
        shiftedPolygon1.push(shiftedPolygon1.shift());
    }
    var shiftedPolygon2 = polygon2.slice(0, polygon2.length-1);
    for (var i = 0; i < indeces2[0]; i++) {
        shiftedPolygon2.push(shiftedPolygon2.shift());
    }
    var partPolygon1 = getLongestPartWithoutRemoval(shiftedPolygon1, indeces1[1]-indeces1[0]);
    var partPolygon2 = getLongestPartWithoutRemoval(shiftedPolygon2, indeces2[1]-indeces2[0]);
    // if (point1) {
    //     if (getDistPoints(point1, partPolygon1[0]) < getDistPoints(point1, partPolygon1[partPolygon1.length-1])){
    //         partPolygon1 = [point1].concat(partPolygon1);
    //     }
    //     else{
    //         partPolygon1 = partPolygon1.concat([point1]);
    //     }
    // }
    // if (point2) {
    //     if (getDistPoints(point2, partPolygon1[0]) < getDistPoints(point2, partPolygon1[partPolygon1.length-1])){
    //         partPolygon1 = [point2].concat(partPolygon1);
    //     }
    //     else{
    //         partPolygon1 = partPolygon1.concat([point2]);
    //     }
    // }
    var mergedPolygon = partPolygon1.concat(partPolygon2,[partPolygon1[0]]);
    return mergedPolygon;
}

function createPointShortestDistance(point, polygon){
    if (polygon.length > 0){
        var linePoints = getClosestLineInPoly(point, polygon);
        var closestPoint = getPointOnLineClosestToPoint(point, linePoints[0], linePoints[1]);
        return closestPoint;
    }
}

function addPointOnLine(point, polygon){
    // if (getMinDistToPolyPoints(point, polygon) > VERY_IMPORTANCE_DISTANCE){
        var closestPoint = createPointShortestDistance(point, polygon);
        var index = getClosestLineIndex(point, polygon);
        polygon.splice(index+1, 0, closestPoint);
        //Maze.popup().setLatLng(closestPoint).setContent("Added").addTo(MAP);
    // }
    return polygon;
}

function addPointsForTwoPolygon(room1, room2) {
    // room1 = removeDuplicatePoints([room1], 0);
    // room2 = removeDuplicatePoints([room2], 0);
    var initialLength1 = room1.length;
    var initialLength2 = room2.length;
    var added = false;
    var closestPoints1 = getClosePoints(room1, room2);
    for (var i = 0; i < closestPoints1.length; i++) {
        room2 = addPointOnLine(room1[closestPoints1[i]], room2);
    }
    var closestPoints2 = getClosePoints(room2, room1);
    for (i = 0; i < closestPoints2.length; i++) {
        room1 = addPointOnLine(room2[closestPoints2[i]], room1);
    }
    if (room1.length > initialLength1 || room2.length > initialLength2) {
        added = true;
    }
    return [room1, room2, added];
}

function experimentWithIncreasing(startIndex, endIndex1, endIndex2, connectedIndexes, polygon1, polygon2) {

	var currentIndex = startIndex;

	var endIndex1IsValid = false;

	var endIndex2IsValid = false;

	var isIncreasing = isIncreasingOriginal(startIndex, endIndex1, endIndex2, polygon1);

	while (currentIndex != endIndex1) {
		if (currentIndex != startIndex) {

			if (getMinDistToPolyPoints(polygon1[currentIndex], polygon2) > VERY_IMPORTANCE_DISTANCE) {
				endIndex1IsValid = true;
				break;
			}
		}
		currentIndex += mod(currentIndex + 1, polygon1.length);
	}
	if (!endIndex1IsValid) {

		for (var i = 0; i < connectedIndexes.length; i++) {
			if (connectedIndexes[i][0] == startIndex) {
				startIndex = connectedIndexes[i][1];
			}
			if (connectedIndexes[i][0] == endIndex1) {
				endIndex1 = connectedIndexes[i][1];
			}
		}

		currentIndex = startIndex;

		while (currentIndex != endIndex1) {
			if (currentIndex != startIndex) {
				if (getMinDistToPolyPoints(polygon2[currentIndex], polygon1) > VERY_IMPORTANCE_DISTANCE) {
					endIndex1IsValid = true;
					break;
				}
			}
			currentIndex += mod(currentIndex + 1, polygon2.length);
		}
	}

	while (currentIndex != endIndex1) {
		if (currentIndex != startIndex) {
			if (getMinDistToPolyPoints(polygon1[currentIndex], polygon2) > VERY_IMPORTANCE_DISTANCE) {
				endIndex2IsValid = true;
				break;
			}
		}
		currentIndex += mod(currentIndex - 1, polygon1.length);
	}
	if (!endIndex2IsValid) {

		for (var i = 0; i < connectedIndexes.length; i++) {
			if (connectedIndexes[i][0] == startIndex) {
				startIndex = connectedIndexes[i][1];
			}
			if (connectedIndexes[i][0] == endIndex1) {
				endIndex1 = connectedIndexes[i][1];
			}
		}

		currentIndex = startIndex;

		while (currentIndex != endIndex1) {
			if (currentIndex != startIndex) {
				if (getMinDistToPolyPoints(polygon2[currentIndex], polygon1) > VERY_IMPORTANCE_DISTANCE) {
					endIndex2IsValid = true;
					break;
				}
			}
			currentIndex += mod(currentIndex - 1, polygon2.length);
		}
	}
	if (isIncreasing && endIndex1IsValid) {
		return true;
	}
	return false;
}

function addPointsOnAllCorridors(corridorNeighbors) {
	for (var i = 0; i < globalCorridorCoordinates.length; i++) {
		if (corridorNeighbors[i].length > 0) {
			for (var j = 0; j < corridorNeighbors[i].length; j++) {
				result = addPointsForTwoPolygon(globalCorridorCoordinates[i], globalCorridorCoordinates[corridorNeighbors[i][j]]);

				globalCorridorCoordinates[i] = deepCopy(result[0]);
				globalCorridorCoordinates[corridorNeighbors[i][j]] = deepCopy(result[1]);

			}
		}
	}
	return globalCorridorCoordinates;
}
