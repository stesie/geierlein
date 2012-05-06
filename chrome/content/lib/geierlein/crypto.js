/**
 * Crypto module for Geierlein.
 *
 * @author Stefan Siegl
 *
 * Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {

var geierlein = {};
var gzipjs = {};
var forge = {};

if(typeof(window) !== 'undefined') {
    geierlein = window.geierlein = window.geierlein || {};

    gzipjs = window.gzipjs;
    forge = window.forge;
}
// define node.js module
else if(typeof(module) !== 'undefined' && module.exports) {
    geierlein = {

    };
    module.exports = geierlein.crypto = {};

    gzipjs = require('../gzip-js/lib/gzip.js');
    forge = require('../forge/js/forge.js');
}

var crypto = geierlein.crypto = geierlein.crypto || {};

/**
 * The X.509 certificate with the Elster project's public key.
 *
 * The public key is used to encrypt the tax case.
 */
var elsterPem = '-----BEGIN CERTIFICATE-----\n' +
                'MIIDKjCCAhICAQAwDQYJKoZIhvcNAQEEBQAwWTELMAkGA1UEBhMCREUxDzANBgNV\n' +
                'BAoTBkVMU1RFUjEMMAoGA1UECxMDRUJBMQ8wDQYDVQQDEwZDb2RpbmcxGjAYBgNV\n' +
                'BAUTETIwMDMwOTMwMTQzMzIzeDAwMCIYDzIwMDMwMTAxMDAwMDAwWhgPMjAwOTEy\n' +
                'MzEyMzU5NTlaMFkxCzAJBgNVBAYTAkRFMQ8wDQYDVQQKEwZFTFNURVIxDDAKBgNV\n' +
                'BAsTA0VCQTEPMA0GA1UEAxMGQ29kaW5nMRowGAYDVQQFExEyMDAzMDkzMDE0MzMy\n' +
                'M3gwMDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAIKjQAK3+1WlW6Az\n' +
                'bp5C0UISN7+H7KFydsH3xvmvtVHV2XpAlQJxpMt3APH1NzSAmsz7FQlsVPYcTqgd\n' +
                'tzwd6s/2bINLm/owNXTjCNRjmf2NLI2cTe9Gq+ovcujFVxVLO1IYjEpj6K09KJc4\n' +
                'e9F+LTyJujaRg/W/cSY7aBwPhv/+1o49IoG7nXSwmpMp6CyRZwCVT26RbVAuTJ2R\n' +
                'fmDgSmcc5Tostd/gQGSwVcreElrrN2LJM2MP5xDzP5tTQGmB8tMFwEYa7otPuhjF\n' +
                'eV5ry3GSlgrFqUdt8JaZ03WQD2dbPZYbNGUvuzb4GebuEdnKCwRrOiGG6bUCx8Qk\n' +
                'xXy6sMsCAwEAATANBgkqhkiG9w0BAQQFAAOCAQEABu72l9QUIng2n08p5uzffJA2\n' +
                'Zx04ZfKWC+dBJB6an03ax8YqxUPm+e83D341NQtLlgJ4qKn9ShNZW85YoL/I02mU\n' +
                '/sj50O4NAX72RwzHe/rPi+sS5BU5p4fi8YL+xN00r8R+Mbqctg8QJXleMmvuS/JF\n' +
                'qB8F9m72Ud9kmZsV1Letl/qog0El4QHNnU9rSoI+MpchfDaoGvdqoVa+729SEBlc\n' +
                'agWaHE8RNF43+aaVZQScvuwQZBrTJq2kqKmPm4Kg7GYuIGMqrm2/g0ldRrm8KfI2\n' +
                'vxZIknBdmDknjnQHGMuLXmV3HKZTeN1F6I9BgmBXXqzTJu4gEDpY5n/h7mM+bA==\n' +
                '-----END CERTIFICATE-----';

/**
 * The Elster project's X.509 certificate as a Forge PKI instance.
 */
var elsterCert = forge.pki.certificateFromPem(elsterPem);

/**
 * Perform whole encoding process of one XML piece as required by Elster specs.
 *
 * This is, take the provided data, GZIP it, encrypt it with DES3-EDE & RSA,
 * encode the DER encoding of the resulting PKCS#7 enveloped document with
 * Base64 and return it.
 *
 * @param {string} data The data block to encode.
 * @param {object} key The key to use to encrypt the data (as a Forge buffer)
 * @return {string} Base64-encoded result.
 */
crypto.encryptBlock = function(data, key) {
    // gzip data
    var out = gzipjs.zip(data, { level: 9 });
    out = gzipjs.charArrayToString(out);
    out = forge.util.createBuffer(out);

    // encrypt data
    var p7 = forge.pkcs7.createEnvelopedData();
    p7.addRecipient(elsterCert);
    p7.content = out;
    p7.encrypt(key.copy(), forge.pki.oids['des-EDE3-CBC']);

    // convert to base64
    out = forge.asn1.toDer(p7.toAsn1());
    return forge.util.encode64(out.getBytes(), 0);
};

/**
 * Decrypt all the encoded parts of a response document from Elster the servers. 
 *
 * This function performs the full decoding process, i.e. it decrypts the
 * PKCS#7 encrypted data blocks and unzips them.
 *
 * @param {string} data The XML document.
 * @param {object} key A Forge buffer containing the decryption key.
 */
crypto.decryptDocument = function(data, key) {
    function decryptBlock(regex) {
        var pieces = data.split(regex);
        if(pieces.length !== 5) {
            return;
        }

        var encBlock = pieces[2].replace(/[\r\n]*/g, '');
        if(encBlock === '') {
            /* On error <DatenTeil> is in some cases returned empty. */
            return;
        }

        /* Base64-decode block, result is DER-encoded PKCS#7 encrypted data. */
        encBlock = forge.util.decode64(encBlock);

        /* Convert to Forge ASN.1 object. */
        encBlock = forge.asn1.fromDer(encBlock);

        /* Convert to Forge PKCS#7 object. */
        var p7 = forge.pkcs7.messageFromAsn1(encBlock);
        p7.decrypt(key.copy());

        /* Covert Forge buffer to gzipJS buffer (array of bytes). */
        var gzippedData = [];
        while(!p7.content.isEmpty()) {
            gzippedData.push(p7.content.getByte());
        }

        /* Gunzip and replace back into pieces. */
        pieces[2] = gzipjs.charArrayToString(gzipjs.unzip(gzippedData));

        /* Join pieces together again. */
        data = pieces.join('');
    }

    decryptBlock(/(<\/?DatenLieferant>)/);
    decryptBlock(/(<\/?DatenTeil>)/);
    return data;
};

/**
 * Generate a key suitable for encryptBlock function.
 * 
 * @return {object} A new random DES3 key as a Forge buffer.
 */
crypto.generateKey = function() {
    return forge.util.createBuffer(forge.random.getBytes(24));
};

})();
