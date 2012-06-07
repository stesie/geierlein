var geierlein = require('../chrome/content/lib/geierlein/geierlein.js');

var taxNumberSamples = [
	"12345/12345",
	"123/123/12345",
	"12/123/12345",
	"123/123/12345",
	"12 123 12345",
	"12/123/12345",
	"123 123 12345",
	"123/123/12345",
	"12/123/12345",
	"123/1234/1234",
	"12/123/1234/1",
	"123/123/12345",
	"123/123/12345",
	"123/123/12345",
	"12 123 12345",
	"123/123/12345" ];

var taxNumbersFormatted = [
	{ encoded: "2893081508152", plain: "93815/08152"},
	{ encoded: "9181081508155", plain: "181/815/08155"},
	{ encoded: "1121081508150", plain: "21/815/08150"},
	{ encoded: "3048081508155", plain: "048/815/08155"},
	{ encoded: "2475081508152", plain: "75 815 08152"},
	{ encoded: "2202081508156", plain: "02/815/08156"},
	{ encoded: "2613081508153", plain: "013 815 08153"},
	{ encoded: "4079081508151", plain: "079/815/08151"},
	{ encoded: "2324081508151", plain: "24/815/08151"},
	{ encoded: "5133081508159", plain: "133/8150/8159"},
	{ encoded: "2722081508154", plain: "22/815/0815/4"},
	{ encoded: "1010081508182", plain: "010/815/08182"},
	{ encoded: "3201012312340", plain: "201/123/12340"},
	{ encoded: "3101081508154", plain: "101/815/08154"},
	{ encoded: "2129081508158", plain: "29 815 08158"},
	{ encoded: "4151081508156", plain: "151/815/08156"} ];


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

