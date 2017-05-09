function drawFromFile() {
    GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID = allCoordinatesInFile;
    GLOBAL_ALL_ROOM_NAMES_AS_ONE_FLOORID = allNamesInFile;
    addGlobalCoordinatesToZoom();
    addGlobalNamesToZoom();

    createPolygonsFromAllCoordinatesAsOneFloorId(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID);
}

// contains all the data that are displayed on different zoom levels and updates display accordingly
function zoom() {

    // contains all kinds of polygons displayed on different levels
    polygonList = [globalOutlinePolygons, globalCorridorPolygons, globalMergedCorridorPolygons, globalSimplifiedMergedCorridorCoordinates, mergedLarge, mergedMedium, mergedSmall, simplifiedMergedLarge, globalRoomPolygons, globalDoorPolygons, globalStairPolygons, globalUnmergedPolygonsSimplified, globalUnmergedPolygons, globalUnmergedLargePolygons];
    //console.log(GLOBAL_ALL_COORDINATES_AS_ONE_FLOORID);
    //console.log(polygonList);

    // contains all kinds of room names displayed on different levels
    var nameList = [globalRoomNamesGroup, globalUnmergedNamesGroup, mergedTextLargeGroup, mergedTextMediumGroup, mergedTextSmallGroup, globalLargeRoomNamesGroup, globalStairIcons, globalToiletIcons];

    // contains all polygons that are currently displayed
    var nowDrawings = [];

    // contains all room names that are currently displayed
    var nowNames = [];

    // keeps information about which zoom levels different polygons will be displayed or not
    var drawings;

    // keeps information about which zoom levels different room names will be displayed or not
    var names;

    var OUTLINE=true, CORRIDORS=true, MERGED_CORRIDORS=true, SIMPLIFIED_MERGED_CORRIDORS=true, MERGED_LARGE=true, MERGED_MEDIUM=true, MERGED_SMALL=true, SIMPLIFIED_LARGE=true, ROOMS=true, DOORS=true, STAIRS=true, UNMERGED_SIMPLIFIED=true, UNMERGED=true, UNMERGED_LARGE=true;

    var ROOM_NAMES=true, UNMERGED_NAMES=true, MERGED_LARGE_NAMES=true, MERGED_MEDIUM_NAMES=true, MERGED_SMALL_NAMES=true, LARGE_ROOM_NAMES=true, STAIR_ICONS=true, TOILET_ICONS=true;

    for (var i = 0; i < polygonList.length; i++) {
        nowDrawings.push(false);
    }
    for (var i = 0; i < nameList.length; i++) {
        nowNames.push(false);
    }


//     var allLayers = {
//         outline: Maze.polygon(...),
//         corridors: Maze.featuregroup()...,
//         rooms: Maze.layerGrop.collision(...)
//     }



//     var visibility = {
//         outline: true,
//         corridors: false,
//         ...
//     }    
// //allLayers.forEach(el=>{console.log(el, !!el._map)})

//     for (i in visibility) {
//         if (visibility[i])
//             allLayers[i].addTo(map);
//         else
//             allLayers[i].remove();
//     }



    // Zoom listener, is triggered on every change in zoom level
    MAP.on('zoomend', function () {
        console.time("everything");
        console.log(MAP.getZoom());
        if (MAP.getZoom() < 16){
            drawings = [!OUTLINE, !CORRIDORS, !MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 16.5){
            drawings = [!OUTLINE, !CORRIDORS, !MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 17){
            drawings = [OUTLINE, !CORRIDORS, !MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 17.5){
            drawings = [OUTLINE, !CORRIDORS, !MERGED_CORRIDORS, SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, UNMERGED_LARGE];
            names = [!ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 18){
            drawings = [OUTLINE, !CORRIDORS, !MERGED_CORRIDORS, SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, UNMERGED_LARGE];
            names = [!ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 18.5){
            drawings = [OUTLINE, !CORRIDORS, MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 19){
            drawings = [OUTLINE, !CORRIDORS, MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, UNMERGED_NAMES, !MERGED_LARGE_NAMES, MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 19.5){
            drawings = [OUTLINE, !CORRIDORS, MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, UNMERGED_NAMES, !MERGED_LARGE_NAMES, MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 20){
            drawings = [OUTLINE, !CORRIDORS, MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, MERGED_SMALL, !SIMPLIFIED_LARGE, !ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, UNMERGED, !UNMERGED_LARGE];
            names = [!ROOM_NAMES, UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 20.5){
            drawings = [OUTLINE, !CORRIDORS, MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, ROOMS, !DOORS, !STAIRS, !UNMERGED_SIMPLIFIED, UNMERGED, !UNMERGED_LARGE];
            names = [ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 21){
            drawings = [OUTLINE, !CORRIDORS, MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, ROOMS, !DOORS, STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 21.5){
            drawings = [OUTLINE, CORRIDORS, !MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, ROOMS, DOORS, STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else if (MAP.getZoom() < 22){
            drawings = [OUTLINE, CORRIDORS, !MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, ROOMS, DOORS, STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        else {
            drawings = [OUTLINE, CORRIDORS, !MERGED_CORRIDORS, !SIMPLIFIED_MERGED_CORRIDORS, !MERGED_LARGE, !MERGED_MEDIUM, !MERGED_SMALL, !SIMPLIFIED_LARGE, ROOMS, DOORS, STAIRS, !UNMERGED_SIMPLIFIED, !UNMERGED, !UNMERGED_LARGE];
            names = [ROOM_NAMES, !UNMERGED_NAMES, !MERGED_LARGE_NAMES, !MERGED_MEDIUM_NAMES, !MERGED_SMALL_NAMES, !LARGE_ROOM_NAMES, !STAIR_ICONS, !TOILET_ICONS];
            [nowDrawings, nowNames] = superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList);
        }
        console.timeEnd("everything");
    });
}

// draws and removes polygons and room names when zooming
function superZoom(drawings, names, nowDrawings, nowNames, polygonList, nameList) {

    console.time("everything");

    console.time("polygons");

    for (var i = 0; i < drawings.length; i++) {
        if (drawings[i] != nowDrawings[i]){
            if (!nowDrawings[i]){
                if (FLOOR_ID != false) {
                    drawPolygons([polygonList[i]]);
                }
                else if (contains(withoutVectorGridSlicer, i)) {
                    drawPolygons(polygonList[i]);
                }
                else {
                    drawVectorGridSlicedPolygons(polygonList[i]);
                }
            }
            else if (nowDrawings[i]){
                if (FLOOR_ID != false) {
                    removePolygons([polygonList[i]]);
                }
                else if (contains(withoutVectorGridSlicer, i)) {
                    removePolygons(polygonList[i]);
                }
                else {
                    removeVectorGridSlicedPolygons(polygonList[i]);
                }
            }
            nowDrawings[i] = !nowDrawings[i];
        }
    }

    console.timeEnd("polygons");

    console.time("names");
    for (var i = 0; i < names.length; i++) {
        if (names[i] != nowNames[i]){
            if (!nowNames[i]){
                nameList[i].addTo(MAP);
            }
            else if (nowNames[i]){
                nameList[i].removeFrom(MAP);
            }
            nowNames[i] = !nowNames[i];
        }
    }
    console.timeEnd("names");
    return [nowDrawings, nowNames];
}