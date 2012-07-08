var geierlein = require('../chrome/content/lib/geierlein/geierlein.js');
var fs = require('fs');

var pfx = fs.readFileSync(__dirname + '/_files/test-softpse_rsapss.pfx', 'binary');

exports.testSetKeyFromPkcs12Der = function(test) {
    var signer = new geierlein.Signer();
    signer.setKeyFromPkcs12Der(pfx, '123456');
    test.done();
};

exports.getSignedInfoXml = function(test) {
    var data = fs.readFileSync(__dirname + '/_files/signer_data.xml', 'ascii');
    var signer = new geierlein.Signer();

    signer.setKeyFromPkcs12Der(pfx, '123456');
    signer.sign(data);

    var exp = fs.readFileSync(__dirname + '/_files/signer_signedinfo.xml', 'ascii');
    test.equal(signer.getSignedInfoXml(), exp);
    test.done();
};

exports.testSign = function(test) {
    var data = fs.readFileSync(__dirname + '/_files/signer_data.xml', 'ascii');
    var signer = new geierlein.Signer();

    signer.setKeyFromPkcs12Der(pfx, '123456');
    signer.sign(data);

    /* compare base64-encoded SHA1 sum */
    test.equal(signer.digestStr, 'CQlSQf/DJmWLmS8RzH/JyvC9Afg=');

    /* compare base64-encoded signature */
    test.equal(signer.signatureStr, 'anOYT+nOxYFaYOwwuwEA5/kd2CIbnTp01lN67MsUWEuPibAaLkDdtfHmKQYO7OghhxMpPg3qWCjAUO54BnhfptVHEvfFbb+Jg8/zUz+e8bsa6E/6hH1TvYUGE2dG4aNB6wPMRBp/A0VkzD7V0/QjFfdPl1P/vnSGNCJRcGJesrQQrQC068y3ppvpx/saKN91jeTxojXG14PCdmi7n/p0eCRqqExgGgwCUT8DsG5fpgzOnMwmVYq1RwIjD/ChF/Bl1nUwHNGU0XuOgFEqwxIzXbxx/0yunxvDMGfuf5CWdd7/xNTqe9w5O2jROraAta5e1TpYvZdeuOr8IW+Vsnb3kQ=='); 

    test.done();
};
