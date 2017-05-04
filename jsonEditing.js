function alterJSONfile(JSON, ID) {

    var list300 = ["30143", "38059", "38058", "30141", "36491", "36487", "38060", "38596", "39865", "36522", "32765", "32766", "36488", "36489", "36490", "34084", "37300", "35789", "37306", "37120", "37328", "39805", "32580", "34099"];

    var list96 = ["32363", "38755", "38756", "31279", "39214"];

    var list141 = ["39189", "36849"];

    var list148 = ["31809", "37137", "37888", "31456"];

    var list260 = ["37477", "37472", "37820", "31761"];

    var list354 = ["38420", "38971", "39402", "36509"];

    var list358 = ["51985", "32263", "32634", "37957", "33676", "37998"];

    var list380 = ["31933", "31554", "38671"];

    if (ID == "56") { // Realfagsbygget
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list300, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "76") { // Realfagsbygget
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list76, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "81") { // Stripa
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list81, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "94") { // IT-syd
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list94, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "96") { // Kjemiblokk
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list96, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "141") { // Kjemiblokk
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list141, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "148") { // Kjemiblokk
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list148, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "220") { // Gamle Fysikk
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list220, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "241") { // Stripa
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list241, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "260") { // Kjemiblokk
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list260, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "300") { // Realfagsbygget
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list300, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "311") { // Stripa
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list311, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "326") { // IT-vest
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list326, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "354") { // Kjemiblokk
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list354, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "358") { // Kjemiblokk
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list358, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    if (ID == "380") { // Kjemiblokk
        for (var i = 0; i < JSON.pois.length; i++) {
            if (contains(list380, JSON.pois[i].identifierId)) {
                JSON.pois[i].infos.push({poiTypeId: 2});
            }
        }
    }
    return JSON;
}
