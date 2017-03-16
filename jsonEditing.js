function alterJSONfile(JSON, ID) {
    if (ID == "56") {
        for (var i = 0; i < JSON.pois[110].infos.length; i++) {
            if (JSON.pois[110].infos[i].poiTypeId == 1) {
                JSON.pois[110].infos[i].poiTypeId = 18;
            }
        }
    }
    if (ID == "76") {
        for (var i = 0; i < JSON.pois[213].infos.length; i++) {
            if (JSON.pois[213].infos[i].poiTypeId == 238) {
                JSON.pois[213].infos[i].poiTypeId = 2;
            }
        }
    }
    if (ID == "300") {
        JSON.pois[22].infos.push({poiTypeId: 2});
        JSON.pois[59].infos.push({poiTypeId: 2});
        JSON.pois[137].infos.push({poiTypeId: 2});
        JSON.pois[155].infos.push({poiTypeId: 2});
    }
    return JSON;
}
