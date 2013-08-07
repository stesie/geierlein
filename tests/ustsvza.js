var geierlein = require('../chrome/content/lib/geierlein/geierlein.js');
var forge = require('../chrome/content/lib/forge/js/forge.js');
var fs = require('fs');

function getDummyDatenlieferant() {
    var dl = new geierlein.Datenlieferant();
    dl.name = 'Steuer Sklave';
    dl.strasse = 'Finstere Gasse 23';
    dl.plz = '12345';
    dl.ort = 'Sklavengrube';
    return dl;
}

function getDummyUStSvz() {
    var ustsvza = new geierlein.UStSvzA(getDummyDatenlieferant(), '2012', 'Umsatzsteuersondervorauszahlung');
    ustsvza.land = 2;
    ustsvza.steuernummer = '203/698/02950';
    ustsvza.kz38 = 1234;
    return ustsvza;
}

function getDummyDauerfrist() {
    var ustsvza = new geierlein.UStSvzA(getDummyDatenlieferant(), '2012', 'Dauerfristverlaengerung');
    ustsvza.land = 2;
    ustsvza.steuernummer = '203/698/02950';
    return ustsvza;
}

exports.testValidate = function(test) {
    var ustsvza = new geierlein.UStSvzA(getDummyDatenlieferant(), '2012', 'Umsatzsteuersondervorauszahlung');

    // We've provide a fully valid Datenlieferant instance, month & year,
    // therefore expect federal state, taxcode and total sum to be invalid.
    test.deepEqual(ustsvza.validate(), [ 'land', 'steuernummer', 'kz38' ]);

    ustsvza.land = 2;
    ustsvza.steuernummer = '203/698/02950';
    test.deepEqual(ustsvza.validate(), [ 'kz38' ]);

    ustsvza.kz38 = 1234;
    test.equals(ustsvza.validate(), true);

    ustsvza.kz38 = -1000;
    test.deepEqual(ustsvza.validate(), [ 'kz38' ]);

    ustsvza.kz38 = -42.23;
    test.deepEqual(ustsvza.validate(), [ 'kz38' ]);

    ustsvza.kz38 = 42.23;
    test.deepEqual(ustsvza.validate(), [ 'kz38' ]);

    ustsvza.kz38 = 0;
    test.equals(ustsvza.validate(), true);

    ustsvza.type = 'Dauerauftrag';
    test.deepEqual(ustsvza.validate(), [ 'type', 'kz38' ]);

    ustsvza.type = 'Dauerfristverlaengerung';
    test.deepEqual(ustsvza.validate(), [ 'kz38' ]);  // kz38 must not be set

    delete ustsvza.kz38;
    test.equals(ustsvza.validate(), true);

    test.done();
};

exports.testGetDatenteilXmlUStSvz = function(test) {
    var exp;
    var ustsvza = getDummyUStSvz();

    // the datenteil xml containts two fields (NutzdatenTicket and
    // Erstellungsdatum) which change from time to time, hence replace
    // them by dummy values using regular expressions, matching
    // good-looking content.
    function filter(xml) {
        xml = xml
            .replace(/\t/g, '')
            .replace(/<NutzdatenTicket>\d+<\/NutzdatenTicket>/,
                     '<NutzdatenTicket>123456789</NutzdatenTicket>')
            .replace(/<Erstellungsdatum>20\d{6}<\/Erstellungsdatum>/,
                     '<Erstellungsdatum>20120707</Erstellungsdatum>');
        return xml;
    }

    exp = fs.readFileSync(__dirname + '/_files/ustsvza_datenteil_test.xml', 'ascii')
        .replace(/\t/g, '');
    test.equal(filter(ustsvza.getDatenteilXml(true)), exp);

    exp = fs.readFileSync(__dirname + '/_files/ustsvza_datenteil_echt.xml', 'ascii')
        .replace(/\t/g, '');
    test.equal(filter(ustsvza.getDatenteilXml(false)), exp);
    test.done();
};

exports.testGetDatenteilXmlDauerfrist = function(test) {
    var exp;
    var ustsvza = getDummyDauerfrist();

    // the datenteil xml containts two fields (NutzdatenTicket and
    // Erstellungsdatum) which change from time to time, hence replace
    // them by dummy values using regular expressions, matching
    // good-looking content.
    function filter(xml) {
        xml = xml
            .replace(/\t/g, '')
            .replace(/<NutzdatenTicket>\d+<\/NutzdatenTicket>/,
                     '<NutzdatenTicket>123456789</NutzdatenTicket>')
            .replace(/<Erstellungsdatum>20\d{6}<\/Erstellungsdatum>/,
                     '<Erstellungsdatum>20120707</Erstellungsdatum>');
        return xml;
    }

    exp = fs.readFileSync(__dirname + '/_files/ustsvza_dauerfrist_datenteil_test.xml', 'ascii')
        .replace(/\t/g, '');
    test.equal(filter(ustsvza.getDatenteilXml(true)), exp);

    exp = fs.readFileSync(__dirname + '/_files/ustsvza_dauerfrist_datenteil_echt.xml', 'ascii')
        .replace(/\t/g, '');
    test.equal(filter(ustsvza.getDatenteilXml(false)), exp);
    test.done();
};
