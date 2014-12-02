var geierlein = require('../chrome/content/lib/geierlein/geierlein.js');

var taxNumberSamples = [
    "12345/12345",	// Baden Württemberg
    "123/123/12345",	// Bayern
    "12/123/12345",	// Berlin
    "123/123/12345",	// Brandenburg
    "12 123 12345",	// Bremen
    "12/123/12345",	// Hamburg
    "123 123 12345",	// Hessen
    "123/123/12345",	// Mecklenburg-Vorpommern
    "12/123/12345",	// Niedersachsen
    "123/1234/1234",	// NRW
    "12/123/12345",	// Rheinland-Pfalz
    "123/123/12345",	// Saarland
    "123/123/12345",	// Sachsen
    "123/123/12345",	// Sachsen-Anhalt
    "12 123 12345",	// Schleswig-Holstein
    "123/123/12345" ];	// Thüringen

var taxNumbersFormatted = [
    { encoded: "2893081508152", plain: "93815/08152"},		// Baden-Württemberg
    { encoded: "9181081508155", plain: "181/815/08155"},	// Bayern
    { encoded: "1121081508150", plain: "21/815/08150"},		// Berlin
    { encoded: "3048081508155", plain: "048/815/08155"},	// Brandenburg
    { encoded: "2475081508152", plain: "75 815 08152"},		// Bremen
    { encoded: "2202081508156", plain: "02/815/08156"},		// Hamburg
    { encoded: "2613081508153", plain: "013 815 08153"},	// Hessen
    { encoded: "4079081508151", plain: "079/815/08151"},	// Mecklenburg-Vorkommern
    { encoded: "2324081508151", plain: "24/815/08151"},		// Niedersachsen
    { encoded: "5133081508159", plain: "133/8150/8159"},	// NRW
    { encoded: "2799081508152", plain: "99/815/08152"},		// Rheinland-Pfalz
    { encoded: "1010081508182", plain: "010/815/08182"},	// Saarland
    { encoded: "3201012312340", plain: "201/123/12340"},	// Sachsen
    { encoded: "3101081508154", plain: "101/815/08154"},	// Sachsen-Anhalt
    { encoded: "2129081508158", plain: "29 815 08158"},		// Schleswig-Holstein
    { encoded: "4151081508156", plain: "151/815/08156"} ];	// Thüringen


exports.testTaxnumberGetSample = function(test) {
    for(var i = 0; i < 16; i ++) {
        test.equals(geierlein.taxnumber.getSample(i + 1), taxNumberSamples[i]);
    }
    test.done();
};

exports.testTaxnumberFormat = function(test) {
    for(var i = 0; i < 16; i ++) {
        test.equals(geierlein.taxnumber.format(i + 1, taxNumbersFormatted[i].plain),
            taxNumbersFormatted[i].encoded);
    }
    test.done();
};

