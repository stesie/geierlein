var geierlein = require('../chrome/content/lib/geierlein/geierlein.js');
var fs = require('fs');

function getDummyDatenlieferant() {
    var dl = new geierlein.Datenlieferant();
    dl.name = 'Steuer Sklave';
    dl.strasse = 'Finstere Gasse 23';
    dl.plz = '12345';
    dl.ort = 'Sklavengrube';
    return dl;
}

function getDummyTaxcase() {
    var ustva = new geierlein.UStVA(getDummyDatenlieferant(), '2012', '01');
    ustva.land = 2;
    ustva.steuernummer = '203/698/02950';
    ustva.kz83 = 0;
    return ustva;
}

exports.testValidate = function(test) {
    var ustva = new geierlein.UStVA(getDummyDatenlieferant(), '2012', '01');

    // We've provide a fully valid Datenlieferant instance, month & year,
    // therefore expect federal state, taxcode and total sum to be invalid.
    test.deepEqual(ustva.validate(), [ 'land', 'steuernummer', 'kz83' ]);

    ustva.land = 2;
    ustva.steuernummer = '203/698/02950';
    test.deepEqual(ustva.validate(), [ 'kz83' ]);

    // We've not set any of the other fields, therefore the total is zero.
    ustva.kz83 = 0;
    test.equals(ustva.validate(), true);

    // We tolerate rounding differences < 1 Euro
    ustva.kz83 = 0.99;
    test.equals(ustva.validate(), true);

    ustva.kz83 = -0.99;
    test.equals(ustva.validate(), true);

    ustva.kz83 = 1;
    test.deepEqual(ustva.validate(), [ 'kz83' ]);

    ustva.kz83 = -1;
    test.deepEqual(ustva.validate(), [ 'kz83' ]);

    test.done();
};

exports.testCalculateKz83 = function(test) {
    var i;
    var ustva = new geierlein.UStVA(getDummyDatenlieferant(), 2012, 1);

    // initially the tax form sum should be zero
    var expected = 0;
    test.equals(ustva.calculateKz83(), expected);

    var ignoreFields = [
        // the flag fields must not be summed into Kz83
        'kz10', 'kz22', 'kz29', 'kz26',

        // inner-european, tax free
        'kz41', 'kz44', 'kz49', 'kz43', 'kz48', 'kz91',

        // bases for tax
        'kz35', 'kz76', 'kz95', 'kz94', 'kz46', 'kz52', 'kz73', 'kz78', 'kz84',

        // tax free & not taxable
        'kz77', 'kz42', 'kz68', 'kz60', 'kz21', 'kz45'
    ];

    for(i = 0; i < ignoreFields.length; i++) {
        ustva[ignoreFields[i]] = 10000;

        // ... none of the listed fields should have an effect on Kz83.
        test.equals(ustva.calculateKz83(), expected);
    }


    var vat19Fields = [ 'kz81', 'kz89' ];
    for(i = 0; i < vat19Fields.length; i++) {
        ustva[vat19Fields[i]] = 10000;

        // ... every field should add 19% of 10000 to the sum
        expected += 1900;
        test.equals(ustva.calculateKz83(), expected);
    }

    var vat7Fields = [ 'kz86', 'kz93' ];
    for(i = 0; i < vat7Fields.length; i++) {
        ustva[vat7Fields[i]] = 10000;

        // ... every field should add 7% of 10000 to the sum
        expected += 700;
        test.equals(ustva.calculateKz83(), expected);
    }

    var directFields = [ 'kz36', 'kz80', 'kz98', 'kz96', 'kz47', 'kz53',
        'kz74', 'kz79', 'kz85', 'kz65', 'kz69'
    ];
    for(i = 0; i < directFields.length; i++) {
        ustva[directFields[i]] = 1000;

        // ... every field should immediately add to the total
        expected += 1000;
        test.equals(ustva.calculateKz83(), expected);
    }

    var negativeFields = [ 'kz66', 'kz61', 'kz62', 'kz67', 'kz63', 'kz64',
        'kz59', 'kz39'
    ];
    for(i = 0; i < negativeFields.length; i++) {
        ustva[negativeFields[i]] = 2000;

        // ... every field should immediately subtract from the total
        expected += -2000;
        test.equals(ustva.calculateKz83(), expected);
    }

    test.done();
};

exports.testGetDatenteilXml = function(test) {
    var exp;
    var ustva = getDummyTaxcase();

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

    exp = fs.readFileSync(__dirname + '/_files/ustva_datenteil_test.xml', 'ascii')
        .replace(/\t/g, '');
    test.equal(filter(ustva.getDatenteilXml(true)), exp);

    exp = fs.readFileSync(__dirname + '/_files/ustva_datenteil_echt.xml', 'ascii')
        .replace(/\t/g, '');
    test.equal(filter(ustva.getDatenteilXml(false)), exp);
    test.done();
};
