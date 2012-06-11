var geierlein = require('../chrome/content/lib/geierlein/geierlein.js');
var forge = require('../chrome/content/lib/forge/js/forge.js');
var gzipjs = require('../chrome/content/lib/gzip-js/lib/gzip.js');

exports.testGenerateKey = function(test) {
    var buf = geierlein.crypto.generateKey();

    /* generateKey should generate a new, random DES3 key, i.e. expect a
       forge buffer of 24 bytes. */
    test.equals(buf.getBytes().length, 24);
    test.done();
};

exports.testEncryptBlock = function(test) {
    var key = geierlein.crypto.generateKey();

    /* encrypt our secret message */
    var msg = 'who is best pony?';
    var p7b64 = geierlein.crypto.encryptBlock(msg, key);

    /* it's base64 encoded, therefore decode and parse asn.1 structure */
    var p7der = forge.util.decode64(p7b64);
    var p7asn1 = forge.asn1.fromDer(p7der);

    /* try to parse pkcs#7 structure */
    var p7 = forge.pkcs7.messageFromAsn1(p7asn1);
    test.equals(p7.type, forge.pki.oids.envelopedData);

    /* inject our key from above to skip RSA decryption, which is not
       possible since we don't know the Elster project's private key. */
    p7.encContent.key = key;
    p7.decrypt();

    /* gzip decode string */
    var gzippedData = [];
    while(!p7.content.isEmpty()) {
        gzippedData.push(p7.content.getByte());
    }

    test.equal(gzipjs.charArrayToString(gzipjs.unzip(gzippedData)), msg);
    test.done();
};

