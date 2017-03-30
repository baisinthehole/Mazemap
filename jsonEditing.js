function alterJSONfile(JSON, ID) {
    // if (ID == "56") {
    //     for (var i = 0; i < JSON.pois[110].infos.length; i++) {
    //         if (JSON.pois[110].infos[i].poiTypeId == 1) {
    //             JSON.pois[110].infos[i].poiTypeId = 18;
    //         }
    //     }
    // }
    // if (ID == "76") {
    //     for (var i = 0; i < JSON.pois[213].infos.length; i++) {
    //         if (JSON.pois[213].infos[i].poiTypeId == 238) {
    //             JSON.pois[213].infos[i].poiTypeId = 2;
    //         }
    //     }
    // }
    // if (ID == "81") { // Stripa
    //     JSON.pois[1].infos.push({poiTypeId: 2});
    //     JSON.pois[8].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[21].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[25].infos.push({poiTypeId: 2});
    //     JSON.pois[26].infos.push({poiTypeId: 2});
    // }
    // if (ID == "94") { // IT-syd
    //     JSON.pois[0].infos.push({poiTypeId: 2});
    //     JSON.pois[1].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[12].infos.push({poiTypeId: 2});
    //     JSON.pois[14].infos.push({poiTypeId: 2});
    //     JSON.pois[18].infos.push({poiTypeId: 2}); // Trapp
    // }
    // if (ID == "96") { // Kjemiblokk
    //     JSON.pois[6].infos.push({poiTypeId: 2});
    //     JSON.pois[7].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[14].infos.push({poiTypeId: 2}); // Gang/Trapp
    //     JSON.pois[20].infos.push({poiTypeId: 2});
    //     JSON.pois[26].infos.push({poiTypeId: 2});
    // }
    // if (ID == "141") { // Kjemiblokk
    //     JSON.pois[4].infos.push({poiTypeId: 2}); // Maybe this is fixed by dividing with 100 in getNeighborsCorridors
    //     JSON.pois[17].infos.push({poiTypeId: 2});
    // }
    // if (ID == "148") { // Kjemiblokk
    //     JSON.pois[14].infos.push({poiTypeId: 2}); // Gang/Trapp
    //     JSON.pois[16].infos.push({poiTypeId: 2}); // Gang/Trapp
    //     JSON.pois[22].infos.push({poiTypeId: 2});
    //     JSON.pois[25].infos.push({poiTypeId: 2});
    // }
    // if (ID == "220") { // Gamle fysikk
    //     JSON.pois[2].infos.push({poiTypeId: 2});
    //     JSON.pois[8].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[21].infos.push({poiTypeId: 2});
    //     JSON.pois[30].infos.push({poiTypeId: 2});
    //     JSON.pois[44].infos.push({poiTypeId: 2});
    // }
    // if (ID == "241") { // Stripa
    //     // JSON.pois[9].infos.push({poiTypeId: 2}); // Maybe corridor
    //     JSON.pois[22].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[33].infos.push({poiTypeId: 2});
    //     JSON.pois[34].infos.push({poiTypeId: 2});
    //     JSON.pois[41].infos.push({poiTypeId: 2}); // Trapp
    //     // JSON.pois[47].infos.push({poiTypeId: 2}); // Maybe corridor
    // }
    // if (ID == "260") { // Kjemiblokk
    //     JSON.pois[6].infos.push({poiTypeId: 2});
    //     JSON.pois[8].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[16].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[29].infos.push({poiTypeId: 2}); // Gang/Trapp
    // }
    // if (ID == "300") { // Realfagsbygget
    //     JSON.pois[3].infos.push({poiTypeId: 2});
    //     JSON.pois[22].infos.push({poiTypeId: 2});
    //     JSON.pois[41].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[44].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[59].infos.push({poiTypeId: 2});
    //     JSON.pois[63].infos.push({poiTypeId: 2}); // Maybe this is fixed by removeTooClosePointsFromResultingPoints
    //     JSON.pois[61].infos.push({poiTypeId: 2}); // Mergelig tegnet trapp
    //     JSON.pois[62].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[100].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[104].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[125].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[130].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[132].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[137].infos.push({poiTypeId: 2});
    //     JSON.pois[143].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[149].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[154].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[155].infos.push({poiTypeId: 2});
    //     JSON.pois[165].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[166].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[184].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[211].infos.push({poiTypeId: 2}); // Trapp
    // }
    // if (ID == "311") { // Stripa
    //     JSON.pois[0].infos.push({poiTypeId: 2});
    //     JSON.pois[1].infos.push({poiTypeId: 2});
    //     JSON.pois[4].infos.push({poiTypeId: 2});
    //     JSON.pois[15].infos.push({poiTypeId: 2});
    //     JSON.pois[28].infos.push({poiTypeId: 2});
    // }
    // if (ID == "326") { // IT-vest
    //     JSON.pois[1].infos.push({poiTypeId: 2});
    //     JSON.pois[2].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[7].infos.push({poiTypeId: 2});
    //     JSON.pois[27].infos.push({poiTypeId: 2}); // Trapp
    // }
    // if (ID == "354") { // Kjemiblokk
    //     JSON.pois[1].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[2].infos.push({poiTypeId: 2});
    //     JSON.pois[23].infos.push({poiTypeId: 2});
    //     JSON.pois[31].infos.push({poiTypeId: 2}); // Gang/Trapp
    // }
    // if (ID == "358") { // Kjemiblokk
    //     JSON.pois[1].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[21].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[22].infos.push({poiTypeId: 2});
    //     JSON.pois[35].infos.push({poiTypeId: 2});
    //     JSON.pois[39].infos.push({poiTypeId: 2}); // Gang/Trapp
    // }
    // if (ID == "380") { // Kjemiblokk
    //     JSON.pois[1].infos.push({poiTypeId: 2});
    //     JSON.pois[25].infos.push({poiTypeId: 2}); // Trapp
    //     JSON.pois[28].infos.push({poiTypeId: 2}); // Gang/Trapp
    // }
    return JSON;
}
