// merge two polygons together, when they only have two points close to each other
function mergeTwoPolygons(polygon1, polygon2, indeces1, indeces2, point1 = undefined, point2 = undefined){
    if (polygon1 != polygon2){
        if (indeces1 != null && indeces2 != null){
            indeces1.sort(sorter);
            indeces2.sort(sorter);
            var shiftedPolygon1 = polygon1.slice(0, polygon1.length);
            for (var i = 0; i < indeces1[0]; i++) {
                shiftedPolygon1.push(shiftedPolygon1.shift());
            }
            var shiftedPolygon2 = polygon2.slice(0, polygon2.length);
            for (var i = 0; i < indeces2[0]; i++) {
                shiftedPolygon2.push(shiftedPolygon2.shift());
            }
            var partPolygon1 = getPartFarthestAway(shiftedPolygon1, indeces1[1]-indeces1[0], polygon2);
            var partPolygon2 = getPartFarthestAway(shiftedPolygon2, indeces2[1]-indeces2[0], polygon1);
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
                var shiftedPolygon2 = polygon2.slice(0, polygon2.length);
                for (var i = 0; i < resultIndeces[1]+1; i++) {
                    shiftedPolygon2.push(shiftedPolygon2.shift());
                }
                shiftedPolygon2.pop();

                var shiftedPolygon1 = polygon1.slice(0, polygon1.length);
                for (var i = 0; i < indeces1[0]; i++) {
                    shiftedPolygon1.push(shiftedPolygon1.shift());
                }
                var partPolygon1 = getPartFarthestAway(shiftedPolygon1, indeces1[1]-indeces1[0], polygon2);
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

// get the longest sequence of edges in a polygon
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

// get the longest sequence of edges in a polygon, without removing any points
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

function getPartFarthestAway(polygon, index, polygon2){
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
    if (getLongestDistToPart(part1, polygon2) > getLongestDistToPart(part2, polygon2)){
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

// the main function that merges all polygons together on a floor
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
                    // mergedPolygon = superMergeTwo(roomCoordinates[i], roomCoordinates[j]);
                    mergedPolygon = superDuperMerge(roomCoordinates[i], roomCoordinates[j]);




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

                    // console.log("To be merged");
                    // console.log(i);
                    // console.log(j);
                    // if (i == 13 && j == 27){
                    // // if (false){
                    //     drawPolygonFromOnlyCoordinates(roomCoordinates[i], "white", "red");
                    //     drawPolygonFromOnlyCoordinates(roomCoordinates[j], "white", "blue");
                    //     // checkPointSequence(deepCopy(roomCoordinates[j]));
                    //     mergedPolygon = superDuperMerge(roomCoordinates[i], roomCoordinates[j], true);
                    //     // drawPolygonFromOnlyCoordinates(mergedPolygon, "white", "green");
                    // }
                    // else {
                        mergedPolygon = superDuperMerge(roomCoordinates[i], roomCoordinates[j]);
                    // }




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

// finds indices close o the rooms, so they can be merged using mergeTwoPolygons
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
    if (connectedIndexes.length) {
        if (connectedIndexes.length > 2) {
            console.log("This should be fixed");
        }
        if (test){
            console.log("Make better mergingPoints");
            // displayConnectedIndexes(connectedIndexes, room1, room2);
        }
        if (connectedIndexes[0] != undefined) {
            var mergingPoints1 = [connectedIndexes[0][0], connectedIndexes[1][0]];
            var mergingPoints2 = [connectedIndexes[0][1], connectedIndexes[1][1]];
        }
        else {
            var pointsCloseEnough1 = getClosePoints(room1, room2);
            var pointsCloseEnough2 = getClosePoints(room2, room1);
            var mergingPoints1 = getMergingPoints(pointsCloseEnough1, room1, room2);
            var mergingPoints2 = getMergingPoints(pointsCloseEnough2, room2, room1);
        }
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
    if (mergingPoints2[0] != undefined) {
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
// removes point that results in sharp angles between edges
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

// get all points in room1 that are close to room2
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

// find points in room1 that are close to room2 and remove redundant points, so that we get nice pairs of points
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

// based on pair points, connect them together in a double list, so we know which point in room1 is connected to which point in room2
function connectCirclePoints(room1, room2, pointIndexes1, pointIndexes2) {
    minDistance = 12345678;
    minIndex = 0;
    indexesConnected = [];


    var currentAngle;
    var currentDistance;
    var index;

    // array to handle special case in floor 274
    var usedIndexes = [];

    if (pointIndexes1.length > pointIndexes2.length) {
        // indexesConnected = connectWithClosest(pointIndexes1, pointIndexes2, room1, room2);
        for (var i = 0; i < pointIndexes2.length; i++) {
            var minDist = 12345654;
            for (var j = 0; j < pointIndexes1.length; j++) {
                var dist = getDistPoints(room2[pointIndexes2[i]], room1[pointIndexes1[j]]);
                if (dist < minDist && !contains(usedIndexes, j)){
                    minDist = dist;
                    index = j;
                }
            }
            // indexesConnected.push([pointIndexes1[index], pointIndexes2[i]]);
            usedIndexes.push(index);
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
            // indexesConnected.push([notUsedIndexes1[i], index]);
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
            // indexesConnected.push([pointIndexes1[i], pointIndexes2[index]]);
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
            // indexesConnected.push([index, notUsedIndexes2[i]]);
        }
    }
    var usedIndexes2 = [];
    var index1;
    var index2;
    pointIndexes1 = sortPairs(pointIndexes1, room1.length);
    pointIndexes2 = sortPairs(pointIndexes2, room2.length);
    for (var i = 0; i < pointIndexes1.length; i+=2) {
        var minDist = 12345654;
        for (var j = 0; j < pointIndexes2.length; j++) {
            var dist = getDistPoints(room1[pointIndexes1[i]], room2[pointIndexes2[j]]);
            if (dist < minDist && !contains(usedIndexes2, j)){
                minDist = dist;
                index = j;
            }
        }
        if (mod(index, 2) == 1) {
            index1 = index-1;
            index2 = index;
        }
        else {
            index1 = index;
            index2 = index+1;
        }
        usedIndexes2.push(index1);
        usedIndexes2.push(index2);
        indexesConnected.push([pointIndexes1[i], pointIndexes2[index2]]);
        indexesConnected.push([pointIndexes1[i+1], pointIndexes2[index1]]);
    }
    return indexesConnected;
}

function sortPairs(pairs, length) {
    var startIndex = pairs[0];
    for (var i = 0; i < pairs.length; i++) {
        pairs[i] = mod(pairs[i] - startIndex, length);
    }
    pairs.sort(sorter);
    for (var i = 0; i < pairs.length; i++) {
        pairs[i] = mod(pairs[i] + startIndex, length);
    }
    return pairs;
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

// handles merge where rooms that consist of several polygons are handled (rooms with holes in them)
function superDuperMerge(room1, room2, test = false) {
    var result;
    var addedPoints;
    var pairs1;
    var pairs2;
    var connectedPoints;
    if (room1[0][0].constructor === Array && room2[0][0].constructor === Array){
        rotateRooms(room1, room2, 0);
        var closestRoomIndex1 = getClosestRoom(room1, room2);
        var closestRoomIndex2 = getClosestRoom(room2, room1);
        addedPoints = addPointsForTwoPolygon(room1[closestRoomIndex1], room2[closestRoomIndex2]);
        room1[closestRoomIndex1] = addedPoints[0];
        room2[closestRoomIndex2] = addedPoints[1];
        [pairs1, pairs2] = findBothPairOfPoints(room1[closestRoomIndex1], room2[closestRoomIndex2]);
        // pairs1 = findPairsOfPoints(room1[closestRoomIndex1], room2[closestRoomIndex2]);
        // pairs2 = findPairsOfPoints(room2[closestRoomIndex2], room1[closestRoomIndex1]);
        connectedPoints = connectCirclePoints(room1[closestRoomIndex1], room2[closestRoomIndex2], pairs1, pairs2);
        if (test) {
            console.log("Room1 contains holes");
            console.log(deepCopy(pairs1));
            console.log(deepCopy(pairs2));
            console.log(isClockwise(room1[closestRoomIndex1]));
            console.log(deepCopy(connectedPoints));
            displayConnectedIndexes(connectedPoints, room1[closestRoomIndex1], room2);
        }
        if (connectedPoints.length > 2){
            result = createCirclePolygons(pairs1, pairs2, room1[closestRoomIndex1], room2[closestRoomIndex2], connectedPoints);
        }
        else {
            result = [superMergeTwo(room1[closestRoomIndex1], room2[closestRoomIndex2], connectedPoints)];
        }
        for (var i = 0; i < room1.length; i++) {
            if (i != closestRoomIndex1) {
                result.push(room1[i]);
            }
        }
        for (var i = 0; i < room2.length; i++) {
            if (i != closestRoomIndex2) {
                result.push(room2[i]);
            }
        }
        return result;
    }
    else if (room1[0][0].constructor === Array){
        rotateRooms(room1, room2, 1)
        var closestRoomIndex = getClosestRoom(room1, room2);
        addedPoints = addPointsForTwoPolygon(room1[closestRoomIndex], room2);
        room1[closestRoomIndex] = addedPoints[0];
        room2 = addedPoints[1];
        [pairs1, pairs2] = findBothPairOfPoints(room1[closestRoomIndex], room2);
        // pairs1 = findPairsOfPoints(room1[closestRoomIndex], room2);
        // pairs2 = findPairsOfPoints(room2, room1[closestRoomIndex]);
        connectedPoints = connectCirclePoints(room1[closestRoomIndex], room2, pairs1, pairs2);
        if (test) {
            console.log("Room1 contains holes");
            console.log(deepCopy(pairs1));
            console.log(deepCopy(pairs2));
            console.log(isClockwise(room1[closestRoomIndex]));
            console.log(deepCopy(connectedPoints));
            displayConnectedIndexes(connectedPoints, room1[closestRoomIndex], room2);
        }
        if (connectedPoints.length > 2){
            result = createCirclePolygons(pairs1, pairs2, room1[closestRoomIndex], room2, connectedPoints);
        }
        else {
            result = [superMergeTwo(room1[closestRoomIndex], room2, connectedPoints)];
        }
        for (var i = 0; i < room1.length; i++) {
            if (i != closestRoomIndex) {
                result.push(room1[i]);
            }
        }
        if(test){
            console.log(result[0]);
            console.log(result[1]);
            drawPolygonFromOnlyCoordinates(result[1], "white", "green");
            drawPolygonFromOnlyCoordinates(result[2], "white", "yellow");
        }
        return result;
    }
    else if (room2[0][0].constructor === Array){
        rotateRooms(room1, room2, 2);
        var closestRoomIndex = getClosestRoom(room2, room1);
        addedPoints = addPointsForTwoPolygon(room1, room2[closestRoomIndex]);
        room1 = addedPoints[0];
        room2[closestRoomIndex] = addedPoints[1];
        [pairs1, pairs2] = findBothPairOfPoints(room1, room2[closestRoomIndex]);
        // pairs1 = findPairsOfPoints(room1, room2[closestRoomIndex]);
        // pairs2 = findPairsOfPoints(room2[closestRoomIndex], room1);
        connectedPoints = connectCirclePoints(room1, room2[closestRoomIndex], pairs1, pairs2);
        if (test) {
            console.log("Room2 contains holes");
            console.log(deepCopy(pairs1));
            console.log(deepCopy(pairs2));
            console.log(deepCopy(connectedPoints));
            console.log(closestRoomIndex);
            drawPolygonFromOnlyCoordinates(room2[getBiggestRoom(room2)], "white", "green");
            displayConnectedIndexes(connectedPoints, room1, room2[closestRoomIndex]);
        }
        if (connectedPoints.length > 2){
            result = createCirclePolygons(pairs1, pairs2, room1, room2[closestRoomIndex], connectedPoints);
        }
        else {
            result = [superMergeTwo(room1, room2[closestRoomIndex], connectedPoints)];
        }
        for (var i = 0; i < room2.length; i++) {
            if (i != closestRoomIndex) {
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
    [pairs1, pairs2] = findBothPairOfPoints(room1, room2);
    // pairs1 = findPairsOfPoints(room1, room2);
    // pairs2 = findPairsOfPoints(room2, room1);
    if (test) {
        console.log("No room contains holes");
        console.log(deepCopy(pairs1));
        console.log(deepCopy(pairs2));
    }
    connectedPoints = connectCirclePoints(room1, room2, pairs1, pairs2);
    if (test) {
        console.log(deepCopy(connectedPoints));
        displayConnectedIndexes(connectedPoints, room1, room2);
    }
    if (connectedPoints.length > 2) {
        result = createCirclePolygons(pairs1, pairs2, room1, room2, connectedPoints);
        return result;
    }
    else {
        result = superMergeTwo(room1, room2, connectedPoints);
        return result;
    }
}

function findBothPairOfPoints(polygon1, polygon2) {
    var pairs1 = findPairsOfPoints(polygon1, polygon2);
    var pairs2 = findPairsOfPoints(polygon2, polygon1);
    if (mod(pairs1[1]-pairs1[0]+1, polygon1.length) == polygon1.length - 1 && pairs1[0] == 0){
        addPointWhenAllPointsAreClose(polygon1, polygon2);
        pairs1 = [];
        for (var i = pairs2.length-1; i >= 0 ; i--) {
            pairs1.push(getClosestPointInPolygonToPoint(polygon2[pairs2[i]], polygon1));
        }
    }
    else if (mod(pairs2[1]-pairs2[0]+1, polygon2.length) == polygon2.length - 1 && pairs2[0] == 0){
        addPointWhenAllPointsAreClose(polygon2, polygon1);
        pairs2 = [];
        for (var i = pairs1.length-1; i >= 0 ; i--) {
            // console.log(getClosestPointInPolygonToPoint(polygon1[pairs1[i]], polygon2));
            pairs2.push(getClosestPointInPolygonToPoint(polygon1[pairs1[i]], polygon2));
            // Maze.popup().setLatLng(polygon2[pairs2[i]]).setContent("Closest points").addTo(MAP);
        }
    }
    return [pairs1, pairs2];
}

function addPointWhenAllPointsAreClose(room1, room2) {
    var maxDist = 0;
    var dist;
    var point;
    var pointFarthestAway;
    var index;
    for (var i = room1.length - 2; i >= 0; i--) {
        point = getPointInMiddleOfLine(room1[i], room1[i+1]);
        dist = getMinDistToPoly(point, room2);
        if (dist > maxDist) {
            maxDist = dist;
            pointFarthestAway = deepCopy(point);
            index = i;
        }
    }
    room1.splice(index+1, 0, pointFarthestAway);
}

function rotateRooms(room1, room2, caseNr) {
    var biggestRoomIndex1;
    var biggestRoomIndex2;
    var closestRoomIndex1;
    var closestRoomIndex2;
    if (caseNr == 0) {
        biggestRoomIndex1 = getBiggestRoom(room1);
        closestRoomIndex1 = getClosestRoom(room1, room2);
        if (biggestRoomIndex1 == closestRoomIndex1) {
            room1[closestRoomIndex1] = makeClockWise(room1[closestRoomIndex1]);
        }
        else {
            console.log("Rotate rooms");
            console.log(caseNr);
            room1[closestRoomIndex1] = makeCounterClockWise(room1[closestRoomIndex1]);
        }
        biggestRoomIndex2 = getBiggestRoom(room2);
        closestRoomIndex2 = getClosestRoom(room2, room1);
        if (biggestRoomIndex2 == closestRoomIndex2) {
            room2[closestRoomIndex2] = makeClockWise(room2[closestRoomIndex2]);
        }
        else {
            console.log("Rotate rooms");
            console.log(caseNr);
            room2[closestRoomIndex2] = makeCounterClockWise(room2[closestRoomIndex2]);
        }
    }
    else if (caseNr == 1) {
        room2 = makeClockWise(room2);
        biggestRoomIndex1 = getBiggestRoom(room1);
        closestRoomIndex1 = getClosestRoom(room1, room2);
        if (biggestRoomIndex1 == closestRoomIndex1) {
            room1[closestRoomIndex1] = makeClockWise(room1[closestRoomIndex1]);
        }
        else {
            console.log("Rotate rooms");
            console.log(caseNr);
            room1[closestRoomIndex1] = makeCounterClockWise(room1[closestRoomIndex1]);
        }
    }
    else if (caseNr == 2) {
        room1 = makeClockWise(room1);
        biggestRoomIndex2 = getBiggestRoom(room2);
        closestRoomIndex2 = getClosestRoom(room2, room1);

        if (biggestRoomIndex2 == closestRoomIndex2) {
            room2[closestRoomIndex2] = makeClockWise(room2[closestRoomIndex2]);
        }
        else {
            room2[closestRoomIndex2] = makeCounterClockWise(room2[closestRoomIndex2]);
        }
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

function makeCounterClockWise(poly) {
    if (isClockwise(poly)){
        return poly.reverse();
    }
    else {
        return poly;
    }
}

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

// is meant for rooms that consist of several polygons (rooms with holes in them), and finds the largest room (the outer part)
function getBiggestRoom(room1) {
    var index = -1;
    var outsideRoom;
    for (var i = 0; i < room1.length; i++) {
        outsideRoom = true;
        for (var j = 0; j < room1.length; j++) {
            if (i != j) {
                // made two inside tests to decrease chances of getting points that are on the lines of both polygons
                if (inside(room1[i][0], room1[j]) || inside(room1[i][Math.floor(room1[i].length / 2)], room1[j])){
                    outsideRoom = false;
                }
            }
        }
        if (outsideRoom && index != -1) {
            drawPolygonFromOnlyCoordinates(room1[i], "white", "red");
            drawPolygonFromOnlyCoordinates(room1[index], "white", "blue");
            console.log("This should not happen");
        }
        if (outsideRoom) {
            index = i;
        }
    }
    return index;
}
// function getBiggestRoom(room1) {
//     var biggestCircumference = 0;
//     var index;
//     for (var i = 0; i < room1.length; i++) {
//         if (getRoomCircumference(room1[i]) > biggestCircumference){
//             biggestCircumference = getRoomCircumference(room1[i]);
//             index = i;
//         }
//     }
//     return index;
// }

function getClosestRoom(room1, room2) {
    var shortestDist = Infinity;
    var dist;
    var index;
    for (var i = 0; i < room1.length; i++) {
        dist = getMinDistToPoly(room2[0], room1[i]);
        if (dist < shortestDist){
            shortestDist = dist;
            index = i;
        }
    }
    return index;
}

// merges two polygons, when they result in a polygon with one or several holes in it
function createCirclePolygons(points1, points2, polygon1, polygon2, connectedIndexes) {
    var resultRooms = [];
    var resultRoom = [];
    var index = connectedIndexes[0][0];
    var roomNr = 0;
    var increasing = true;
    var counter = 0;
    var broken = false;
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
                // return resultRoom;
                resultRoom = [];
                index = points1[0];
                roomNr = 0;
            }
        }
        if (roomNr == 0){
            resultRoom.push(polygon1[index]);
            if (contains(points1, index)){
                var outerIndex = getOuterIndex(index, roomNr, connectedIndexes);
                points = findIncreasingAndDecreasingPoints(outerIndex, 0, polygon1, connectedIndexes);
                var testpoints2 = findIncreasingAndDecreasingPoints(outerIndex, 1, polygon2, connectedIndexes);
                // increasing = isIncreasing(connectedIndexes[outerIndex][roomNr], points[0], points[1], polygon1);
                // console.log("Test");
                // console.log(roomNr);
                // console.log(connectedIndexes[outerIndex]);
                increasing = checkIncreasingIsSmallEnough(roomNr, connectedIndexes[outerIndex], deepCopy(points), deepCopy(testpoints2), polygon1, polygon2);
                // console.log(increasing);
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
                var testpoints2 = findIncreasingAndDecreasingPoints(outerIndex, 0, polygon1, connectedIndexes);
                points = findIncreasingAndDecreasingPoints(outerIndex, 1, polygon2, connectedIndexes);
                // increasing = isIncreasing(connectedIndexes[outerIndex][roomNr], points[0], points[1], polygon2);
                // console.log("Test");
                // console.log(roomNr);
                // console.log(connectedIndexes[outerIndex]);
                increasing = !checkIncreasingIsSmallEnough(roomNr, connectedIndexes[outerIndex], testpoints2, deepCopy(points), polygon1, polygon2);
                // console.log(increasing);
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

// returns index of element that has "index" as its first element
function getOuterIndex(index, roomNr, connectedIndexes){
    for (var i = 0; i < connectedIndexes.length; i++) {
        if (connectedIndexes[i][roomNr] == index){
            return i;
        }
    }
}

// returns index of point in the other room, based on the index of the connecting point in the first room
function getOtherConnectedPoint(index, roomNr, connectedIndexes){
    for (var i = 0; i < connectedIndexes.length; i++) {
        if (connectedIndexes[i][roomNr] == index){
            return connectedIndexes[i][mod(roomNr+1, 2)];
        }
    }
}

// finds two other connect pairs that are closest to the indexes given
function findIncreasingAndDecreasingPoints(outerIndex, innerIndex, polygon1, connectedIndexes) {

    var connectPoint = connectedIndexes[outerIndex][innerIndex];

    var points = [];

    var lowerIndex = connectPoint + 1;
    var higherIndex = connectPoint - 1;
    var outerIndexLower;
    var outerIndexHigher;
    for (var i = 0; i < connectedIndexes.length; i++) {
        if (mod(connectedIndexes[i][innerIndex] + polygon1.length - connectPoint, polygon1.length) > mod(lowerIndex + polygon1.length - connectPoint, polygon1.length)){
            lowerIndex = connectedIndexes[i][innerIndex];
            outerIndexLower = i;
        }
        if (mod(connectedIndexes[i][innerIndex] - connectPoint -1, polygon1.length) < mod(higherIndex - connectPoint -1, polygon1.length)){
            higherIndex = connectedIndexes[i][innerIndex];
            outerIndexHigher = i;
        }
    }
    return [connectedIndexes[outerIndexHigher][innerIndex], connectedIndexes[outerIndexLower][innerIndex]];
}

// determines if the currentIndex in createCirclePoints should increase or decrease
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
    var test1 = checkIfDistancesIsSmallEnough(startIndexes[0], points1[0], polygon1, polygon2);
    var test2 = checkIfDistancesIsSmallEnough2(startIndexes[1], points2[1], polygon2, polygon1);
    // console.log(test1);
    // console.log(test2);
    return (test1 && test2);
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
    for (var i = 1; i < mod(startIndex-endIndex,polygon1.length); i++) {
        if (getMinDistToPoly(polygon1[mod(startIndex-i,polygon1.length)], polygon2) > VERY_IMPORTANCE_DISTANCE) {
            return false;
        }
    }
    return true;
}

// find two points in room1 close to room2, such that the distance between those two points is as long as possible,
// and all points in between are also close to room2
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

// determine if a point in room1 is close or not to a point in room2
function pointTooFarAway(indeces, room1, room2) {
    for (var i = indeces[0]+1; i < indeces[1]; i++) {
        if (haversineDistance(room1[mod(i, room1.length)], room2) > VERY_IMPORTANCE_DISTANCE*5){
            return true;
        }
    }
    return false;
}

// sorting function that handles proper sorting, and not based on digits
function sorter(a, b) {
    if (a < b) return -1;  // any negative number works
    if (a > b) return 1;   // any positive number works
    return 0; // equal values MUST yield zero
}

// order rooms that belong together in a group, such that their indices are ordered according to their position in the group
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

function createDifferentMergingLevelsArea(orderedRooms, rooms) {
    var mergingLevels = [[orderedRooms]];

    if (orderedRooms.length < 2) {
        return mergingLevels;
    }


    var areaLists = [[[]]];
    for (var i = 0; i < orderedRooms.length; i++) {
        areaLists[0][0].push(getArea(rooms[orderedRooms[i]]));
    }

    var minArea = 0.000000008;

    var currentArea = computeTotalAreaOfAreaList(areaLists[0][0]);

    var currentInternalStartIndex = 0;
    var currentInternalEndIndex = 0;

    var currentIndex = 0;

    var splitAreas;

    while (currentArea > minArea) {
        mergingLevels.push([]);
        areaLists.push([]);

        for (var i = 0; i < mergingLevels[currentIndex].length; i++) {

            if (areaLists[currentIndex][i].length > 1) {
                splitAreas = areaMerge(2, areaLists[currentIndex][i]);

                // split in 3, because areas are too uneven when split in two
                if (computeTotalAreaOfAreaList(splitAreas[0]) / computeTotalAreaOfAreaList(splitAreas[1]) > 1.5 ||
                    computeTotalAreaOfAreaList(splitAreas[1]) / computeTotalAreaOfAreaList(splitAreas[0]) > 1.5) {
                    
                    splitAreas = areaMerge(3, areaLists[currentIndex][i]);

                    currentInternalStartIndex = currentInternalEndIndex;
                    currentInternalEndIndex += splitAreas[0].length;

                    mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));
                    areaLists[currentIndex + 1].push(splitAreas[0]);

                    currentInternalStartIndex = currentInternalEndIndex;
                    currentInternalEndIndex += splitAreas[1].length;

                    mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));
                    areaLists[currentIndex + 1].push(splitAreas[1]);

                    currentInternalStartIndex = currentInternalEndIndex;
                    currentInternalEndIndex += splitAreas[2].length;

                    mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));
                    areaLists[currentIndex + 1].push(splitAreas[2]);

                    if (Math.max(computeTotalAreaOfAreaList(splitAreas[0]), computeTotalAreaOfAreaList(splitAreas[1]), computeTotalAreaOfAreaList(splitAreas[2])) < currentArea) {
                        currentArea = Math.max(computeTotalAreaOfAreaList(splitAreas[0]), computeTotalAreaOfAreaList(splitAreas[1]), computeTotalAreaOfAreaList(splitAreas[2]));
                    }
                }

                // split in 2
                else {
                    currentInternalStartIndex = currentInternalEndIndex;
                    currentInternalEndIndex += splitAreas[0].length;

                    mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));
                    areaLists[currentIndex + 1].push(splitAreas[0]);

                    currentInternalStartIndex = currentInternalEndIndex;
                    currentInternalEndIndex += splitAreas[1].length;

                    mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));
                    areaLists[currentIndex + 1].push(splitAreas[1]);

                    if (Math.max(computeTotalAreaOfAreaList(splitAreas[0]), computeTotalAreaOfAreaList(splitAreas[1])) < currentArea) {
                        currentArea = Math.max(computeTotalAreaOfAreaList(splitAreas[0]), computeTotalAreaOfAreaList(splitAreas[1]));
                    }
                }
            }
        }
        if (currentInternalEndIndex == orderedRooms.length) {
            currentInternalStartIndex = 0;
            currentInternalEndIndex = 0;
        }

        currentIndex++;

    }

    //console.log(mergingLevels);
    return mergingLevels;
}

// create different merging levels, so that merged rooms can be split into smaller merged rooms
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
// Makes sure that if a room is neighbor to another room, that room will also be neighbor to the first room
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

// create different merging levels for all merged groups
function dynamicMergeAllRooms(allOrderedRooms, rooms) {
    for (var i = 0; i < allOrderedRooms.length; i++) {
        allOrderedRooms[i] = createDifferentMergingLevelsArea(allOrderedRooms[i], rooms);
    }
    return allOrderedRooms;
}


function mergeZoomLevel(index, rooms){
    if (index.length < 2){
        return rooms[index[0]];
    }
    var resultRoom = superDuperMerge(rooms[index[0]], rooms[index[1]]);
    if (resultRoom==-1){
        resultRoom = superDuperMerge(rooms[index[1]], rooms[index[0]]);
    }
    var tempResultRoom;
    for (var i = 2; i < index.length; i++) {
        tempResultRoom = superDuperMerge(resultRoom, rooms[index[i]]);
        if (tempResultRoom == -1){
            resultRoom = superDuperMerge(rooms[index[i]],resultRoom);
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
    fillPolygons(coordinates[0], mergedLarge, "gray", "yellow", "polygon", 0.2);
    fillPolygons(coordinates[1], mergedMedium, "gray", "yellow", "polygon", 0.2);
    fillPolygons(coordinates[2], mergedSmall, "gray", "yellow", "polygon", 0.2);
}

function fillMergedCoordinates(coordinates) {
    fillPolygons(coordinates, globalMergedCorridorPolygons, "gray", "red", "polygon", 0.2);
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
    fillPolygons(globalUnmergedRoomsSimplified, globalUnmergedPolygonsSimplified, "gray", "white", "line", 1);
    fillPolygons(globalUnmergedRooms, globalUnmergedPolygons, "gray", "white", "line", 1);

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
    return [mergedCorridors, corridorContainer];
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
    var shiftedPolygon1 = polygon1.slice(0, polygon1.length);
    for (var i = 0; i < indeces1[0]; i++) {
        shiftedPolygon1.push(shiftedPolygon1.shift());
    }
    var shiftedPolygon2 = polygon2.slice(0, polygon2.length);
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
