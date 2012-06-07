var geierlein = require('../chrome/content/lib/geierlein/geierlein.js');

function createObject(extras) {
    var dl = new geierlein.Datenlieferant();
    dl.name = 'Steuer Sklave';
    dl.strasse = 'Finstere Gasse 23';
    dl.plz = '12345';
    dl.ort = 'Sklavengrube';

    if(extras === true) {
        dl.telefon = '089/1234567';
        dl.email = 'foo@bar.de';
    }
    return dl;
}

exports.testValidateOK = function(test) {
    var dl = createObject();
    test.equals(dl.validate(), true);
    test.done();
};

exports.testValidateSingleFail = function(test) {
    var fields = [ 'name', 'strasse', 'plz', 'ort' ];
    for(var i = 0; i < fields.length; i ++) {
        var dl = createObject();
        delete dl[fields[i]];
        test.deepEqual(dl.validate(), [ fields[i] ]);
    }
    test.done();
};

exports.testToString = function(test) {
    var dl = createObject();
    test.equals(dl.toString(), 'Steuer Sklave, Finstere Gasse 23, Sklavengrube, 12345');

    dl = createObject(true);
    test.equals(dl.toString(), 'Steuer Sklave, Finstere Gasse 23, Sklavengrube, 12345, 089/1234567, foo@bar.de');

    test.done();
};

exports.testToXml = function(test) {
    var dl = createObject();
    test.equals(dl.toXml(), '<Name>Steuer Sklave</Name><Strasse>Finstere Gasse 23</Strasse><PLZ>12345</PLZ><Ort>Sklavengrube</Ort>');

    dl = createObject(true);
    test.equals(dl.toXml(), '<Name>Steuer Sklave</Name><Strasse>Finstere Gasse 23</Strasse><PLZ>12345</PLZ><Ort>Sklavengrube</Ort><Telefon>089/1234567</Telefon><Email>foo@bar.de</Email>');

    test.done();
};
