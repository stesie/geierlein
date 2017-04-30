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
                'MIIETDCCAwCgAwIBAgIEO5rKADBBBgkqhkiG9w0BAQowNKAPMA0GCWCGSAFlAwQC\n' +
                'AQUAoRwwGgYJKoZIhvcNAQEIMA0GCWCGSAFlAwQCAQUAogMCASAwRDELMAkGA1UE\n' +
                'BhMCREUxDzANBgNVBAoTBkVsc3RlcjELMAkGA1UECxMCQ0ExFzAVBgNVBAMTDkVs\n' +
                'c3RlcktyeXB0b0NBMB4XDTE1MDMyNTEzMDMwNFoXDTIwMDkyNTEzMDMwNFowNDEL\n' +
                'MAkGA1UEBhMCREUxDzANBgNVBAoTBkVsc3RlcjEUMBIGA1UEAxMLRnJvbnRlbmRL\n' +
                'ZXkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC++P7lo9wZ6XOpGhUo\n' +
                '5WBwEROXrO0hp4qToUbNOB9lPKqOAkDGTFRcDL++4eydzYx3g/y/5NBWJLeefw7R\n' +
                'Vxxjrh2ODCswL/KZLYLn89KlLpWHd7PQlV9xN05GRUv794VghxUo2s0y0FNzyIWc\n' +
                'dZYNr4wbo41A/5dFQq1Nv/l4UJdDzNurSDz/1yX77tCF3PwFoa7RAYnp/SziPRiw\n' +
                'D/WGF53rjdydo28ZGaDSPLzXh+u91H7MzMUblfvf5ngA8XMAHvPDvw7wllg2UCk/\n' +
                'zEPPOxDUDCdqb6hkg7QHDjhn1sIPv88hDIP1wSc3uZPyNmEUDwmQkSGbypvddTKc\n' +
                'gXBLAgMBAAGjge0wgeowDgYDVR0PAQH/BAQDAgUgMAwGA1UdEwEB/wQCMAAwHQYD\n' +
                'VR0OBBYEFJX2qVD6AgF7W7TBh6SMhMe6lcY/MDgGA1UdHwQxMC8wLaAroCmGJ2h0\n' +
                'dHA6Ly9jcmwuZWxzdGVyLmRlL0Vsc3RlcktyeXB0b0NBLmNybDBxBgNVHSMEajBo\n' +
                'gBRVy4hMb7o37P9MFxbVcSdzyGHC3KFKpEgwRjELMAkGA1UEBhMCREUxDzANBgNV\n' +
                'BAoTBkVsc3RlcjEPMA0GA1UECxMGUm9vdENBMRUwEwYDVQQDEwxFbHN0ZXJSb290\n' +
                'Q0GCBDuay5kwQQYJKoZIhvcNAQEKMDSgDzANBglghkgBZQMEAgEFAKEcMBoGCSqG\n' +
                'SIb3DQEBCDANBglghkgBZQMEAgEFAKIDAgEgA4IBAQBDuEPIzq0uBt1Bx6v+9j7i\n' +
                'ACT6XFWkXTTmLWjAL3hPwTiSe5DMZrTbPAjSSJUxrtY0AQEFhdAE6yYYRgoNfJGI\n' +
                '6UNjVYshRkPVUJr0zTGXAtPVcWFkzAqGcMEmNyyVth0cfiWa3hUld4b194ivdO1o\n' +
                'epju3PHXjmbIKvk2DYeI3/4IoE5pPCbRax0A6ht+jdoyqRZcr7/QgmUQPUeqjMhn\n' +
                'v6G8aKT0GSkarXIwEC9fDSg9ElEYelLdZsjCcEQW+wOqJDLLxJCom7v7gsrxexLt\n' +
                'xa9kWSHVcmC+UVLqI/yQp2xI66KILFRSp9c4BXuO1V0Rbj64P/ZMQUDFE9Ef256h\n' +
                '-----END CERTIFICATE-----\n';

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
    p7.addRecipient(elsterCert, {
        algorithm: forge.pki.oids['RSAES-OAEP'],
        schemeOptions: {
            md: forge.md.sha256.create(),
            mgf: forge.mgf.mgf1.create(forge.md.sha256.create())
        }
    });
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
