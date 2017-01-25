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
        simplifiedCoordinates.push(simplify(roomCoordinates[i], VERY_IMPORTANCE_DISTANCE));
    }
    return simplifiedCoordinates;
}

function simplifyRooms(roomCoordinates) {
    var simplifiedCoordinates = [];

    for (var i = 0; i < roomCoordinates.length; i++) {
        simplifiedCoordinates.push(removePointsOneLongOneShort(roomCoordinates, i));
    }
    return simplifiedCoordinates;
}

function simplifyRoomsAlternative(roomCoordinates) {
    var simplifiedCoordinates = [];

    for (var i = 0; i < roomCoordinates.length; i++) {
        simplifiedCoordinates.push(removePointsTwoShort(roomCoordinates, i));
    }
    return simplifiedCoordinates;
}

function removeDuplicatePoints(coordinates, index) {
    if (coordinates[index].length <= 2) {
        return coordinates[index];
    }



    simplifiedCoordinates = [];

    for (var i = 0; i < coordinates[index].length - 1; i++) {
        if (getDistanceBetweenTwoPoints(coordinates[index][i], coordinates[index][i + 1]) > MINIMUM_DISTANCE) {
            simplifiedCoordinates.push(coordinates[index][i]);
        }
    }
    simplifiedCoordinates.push(coordinates[index][coordinates[index].length - 1]);

    return simplifiedCoordinates;
}

function removePointsOneLongOneShort(coordinates, index) {
    simplifiedCoordinates = [];

    if ((getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][0]) >= VERY_IMPORTANCE_DISTANCE
        && getDistanceBetweenTwoPoints(coordinates[index][0], coordinates[index][1]) >= VERY_IMPORTANCE_DISTANCE)
        || (getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][0]) < VERY_IMPORTANCE_DISTANCE
            && getDistanceBetweenTwoPoints(coordinates[index][0], coordinates[index][1]) < VERY_IMPORTANCE_DISTANCE)) {
        simplifiedCoordinates.push(coordinates[index][0]);
    }
    for (var i = 1; i < coordinates[index].length - 1; i++) {
        if ((getDistanceBetweenTwoPoints(coordinates[index][i - 1], coordinates[index][i]) >= VERY_IMPORTANCE_DISTANCE
            && getDistanceBetweenTwoPoints(coordinates[index][i], coordinates[index][i + 1]) >= VERY_IMPORTANCE_DISTANCE)
            || (getDistanceBetweenTwoPoints(coordinates[index][i - 1], coordinates[index][i]) < VERY_IMPORTANCE_DISTANCE
                && getDistanceBetweenTwoPoints(coordinates[index][i], coordinates[index][i + 1]) < VERY_IMPORTANCE_DISTANCE)) {
            simplifiedCoordinates.push(coordinates[index][i]);
        }
    }
    if ((getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][coordinates[index].length - 1]) >= VERY_IMPORTANCE_DISTANCE
        && getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 1], coordinates[index][1]) >= VERY_IMPORTANCE_DISTANCE)
        || (getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][coordinates[index].length - 1]) < VERY_IMPORTANCE_DISTANCE
            && getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 1], coordinates[index][1]) < VERY_IMPORTANCE_DISTANCE)) {
        simplifiedCoordinates.push(coordinates[index][coordinates[index].length - 1]);
    }
    if (coordinates[index].length > 2) {
        if (simplifiedCoordinates[0][0] == simplifiedCoordinates[simplifiedCoordinates.length - 1][0]
            && simplifiedCoordinates[0][1] == simplifiedCoordinates[simplifiedCoordinates.length - 1][1]) {
                // do nothing
        }
        else {
            if (getDistanceBetweenTwoPoints(simplifiedCoordinates[0], simplifiedCoordinates[simplifiedCoordinates.length - 1]) < MINIMUM_DISTANCE) {
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

function removePointsTwoShort(coordinates, index) {
    simplifiedCoordinates = [];

    if ((getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][0]) < VERY_IMPORTANCE_DISTANCE
        && getDistanceBetweenTwoPoints(coordinates[index][0], coordinates[index][1]) < VERY_IMPORTANCE_DISTANCE)) {
            // do nothing
    }
    else {
        simplifiedCoordinates.push(coordinates[index][0]);
    }
    for (var i = 1; i < coordinates[index].length - 1; i++) {
        if ((getDistanceBetweenTwoPoints(coordinates[index][i - 1], coordinates[index][i]) < VERY_IMPORTANCE_DISTANCE
            && getDistanceBetweenTwoPoints(coordinates[index][i], coordinates[index][i + 1]) < VERY_IMPORTANCE_DISTANCE)) {
                // do nothing
        }
        else {
            simplifiedCoordinates.push(coordinates[index][i]);
        }
    }
    if ((getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 2], coordinates[index][coordinates[index].length - 1]) < VERY_IMPORTANCE_DISTANCE
        && getDistanceBetweenTwoPoints(coordinates[index][coordinates[index].length - 1], coordinates[index][1]) < VERY_IMPORTANCE_DISTANCE)) {

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
            if (getDistanceBetweenTwoPoints(simplifiedCoordinates[0], simplifiedCoordinates[simplifiedCoordinates.length - 1]) < MINIMUM_DISTANCE) {
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
