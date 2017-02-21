function alterJSONfile(JSON, ID) {
    if (ID == "56") {
        for (var i = 0; i < JSON.pois[110].infos.length; i++) {
            if (JSON.pois[110].infos[i].poiTypeId == 1) {
                JSON.pois[110].infos[i].poiTypeId = 91;
            }
        }
    }
}
