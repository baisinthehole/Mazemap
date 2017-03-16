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
    if (ID == "81") { // Stripa
        JSON.pois[1].infos.push({poiTypeId: 2});
        JSON.pois[6].infos.push({poiTypeId: 2});
        JSON.pois[25].infos.push({poiTypeId: 2});
        JSON.pois[26].infos.push({poiTypeId: 2});
    }
    if (ID == "94") { // IT-syd
        JSON.pois[12].infos.push({poiTypeId: 2});
        JSON.pois[14].infos.push({poiTypeId: 2});
    }
    if (ID == "96") { // Kjemiblokk
        JSON.pois[6].infos.push({poiTypeId: 2});
        JSON.pois[20].infos.push({poiTypeId: 2});
    }
    if (ID == "141") { // Kjemiblokk
        // JSON.pois[4].infos.push({poiTypeId: 2});
        JSON.pois[17].infos.push({poiTypeId: 2});
    }
    if (ID == "148") { // Kjemiblokk
        JSON.pois[4].infos.push({poiTypeId: 2});
        JSON.pois[22].infos.push({poiTypeId: 2});
    }
    if (ID == "220") { // Gamle fysikk
        JSON.pois[2].infos.push({poiTypeId: 2});
    }
    if (ID == "260") { // Kjemiblokk
        JSON.pois[0].infos.push({poiTypeId: 2});
        JSON.pois[7].infos.push({poiTypeId: 2});
        JSON.pois[8].infos.push({poiTypeId: 2});
        JSON.pois[11].infos.push({poiTypeId: 2});
        JSON.pois[16].infos.push({poiTypeId: 2});
        JSON.pois[18].infos.push({poiTypeId: 2});
        JSON.pois[20].infos.push({poiTypeId: 2});
        JSON.pois[22].infos.push({poiTypeId: 2});
        JSON.pois[28].infos.push({poiTypeId: 2});
        JSON.pois[29].infos.push({poiTypeId: 2});
    }
    if (ID == "300") { // Realfagsbygget
        JSON.pois[3].infos.push({poiTypeId: 2});
        JSON.pois[22].infos.push({poiTypeId: 2});
        JSON.pois[59].infos.push({poiTypeId: 2});
        JSON.pois[137].infos.push({poiTypeId: 2});
        JSON.pois[155].infos.push({poiTypeId: 2});
    }
    if (ID == "311") { // Stripa
        JSON.pois[0].infos.push({poiTypeId: 2});
        JSON.pois[1].infos.push({poiTypeId: 2});
        JSON.pois[15].infos.push({poiTypeId: 2});
        JSON.pois[28].infos.push({poiTypeId: 2});
    }
    if (ID == "326") { // IT-vest
        JSON.pois[7].infos.push({poiTypeId: 2});
    }
    if (ID == "354") { // Kjemiblokk
        JSON.pois[2].infos.push({poiTypeId: 2});
        JSON.pois[23].infos.push({poiTypeId: 2});
    }
    if (ID == "358") { // Kjemiblokk
        JSON.pois[35].infos.push({poiTypeId: 2});
    }
    if (ID == "380") { // Kjemiblokk
        JSON.pois[1].infos.push({poiTypeId: 2});
    }
    return JSON;
}
