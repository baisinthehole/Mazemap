console.log(rooms354);
console.log(names354);
console.log(corridors354);

var json354 = JSON.parse('{ "pois" : []}');
for (var i = 0; i < rooms354.length; i++) {
    rooms354[i] = switchLatLongRoom(rooms354[i]);
    var geometry = '{ "coordinates":' + JSON.stringify(rooms354[i]) + ', "type": "Polygon"}' ;
    var objStr = '{ "campusId":"1", "floorId":"354", "geometry":' + geometry + ',"infos":[], "title":"'+names354[i]+'"}';
    var obj = JSON.parse(objStr);
    obj.infos.push({poiTypeId: 91});
    json354.pois.push(obj);
}
for (var i = 0; i < corridors354.length; i++) {
    corridors354[i] = switchLatLongRoom(corridors354[i]);
    var geometry = '{ "coordinates":' + JSON.stringify(corridors354[i]) + ', "type": "Polygon"}' ;
    var objStr = '{ "campusId":"1", "floorId":"354", "geometry":' + geometry + ',"infos":[], "title":""}';
    var obj = JSON.parse(objStr);
    obj.infos.push({poiTypeId: 2});
    obj.infos.push({poiTypeId: 91});
    json354.pois.push(obj);
}
console.log(json354);
