/**
 * Signer module for Geierlein.
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
var forge = {};

if(typeof(window) !== 'undefined') {
    geierlein = window.geierlein = window.geierlein || {};

    forge = window.forge;
}
// define node.js module
else if(typeof(module) !== 'undefined' && module.exports) {
    geierlein = {
        util: require('./util.js')
    };
    module.exports = geierlein.signer = {};

    forge = require('../forge/js/forge.js');
}

var signer = geierlein.signer = geierlein.signer || {};

/**
 * Create new Signer instance.
 */
geierlein.Signer = function() {
};

geierlein.Signer.prototype = {
    /**
     * Set signature key from PKCS#12 key store.
     *
     * @param {String} p12Der The PKCS#12 PFX in DER encoding.
     * @param {String} password The password, the PFX is encrypted with.
     */
    setKeyFromPkcs12Der: function(p12Der, password) {
        var p12Asn1 = forge.asn1.fromDer(p12Der);
        var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

        if(!p12.verify()) {
            throw {
                message: 'PKCS#12 PFX MAC is incorrect.'
            };
        }

        /* Find the signature key by its friendlyName. */
        var keyBag = p12.getBagsByFriendlyName('signaturekey',
            forge.pki.oids.pkcs8ShroudedKeyBag);
        if(keyBag.length !== 1) {
            throw {
                message: 'PKCS#12 PFX has not exactly one ' +
                    'bag named signaturekey.'
            };
        }
        keyBag = keyBag[0];

        /* The signature key keybag has a localKeyId attached,
           that matches the localKeyId of one of the certBags
           available.  Find that certBag now. */
        var certBag = p12.getBagsByLocalKeyId(keyBag.attributes.localKeyId[0],
            forge.pki.oids.certBag);
        if(certBag.length !== 1) {
            throw {
                message: 'PKCS#12 PFX has not exactly one certificate ' +
                    'bag with localKeyId matching signaturekey.',
                localKeyId: keyBag.attributes.localKeyId[0]
            };
        }
        certBag = certBag[0];

        /* Keep the loaded key & cert in the object instance for later use. */
        this.key = keyBag.key;
        this.cert = certBag.cert;
    },

    /**
     * Calculate the digital signature on the provided content.
     *
     * The result is not immediately returned, it's just stored into this
     * Signer instance for later retrieval via e.g. getSignatureXml function.
     *
     * @param {String} data The XML document (part) to sign.
     */
    sign: function(data) {
        /* calculate digest */
        data = forge.util.encodeUtf8(data);
        var md = forge.md.sha1.create();
        md.start();
        md.update(data);
        this.digestStr = forge.util.encode64(md.digest().getBytes());

        /* calculate signature */
        md.start();
        md.update(this.getSignedInfoXml());
        this.signatureStr = forge.util.encode64(this.key.sign(md));
    },

    /**
     * Get the <dsig:SignedInfo> element XML (as string).
     *
     * This is the data set is incorporated into the actual signature.
     * The sign function must be called before this one, in order to calculate
     * the digest that is included in this structure.
     *
     * @return {String} The <dsig:SignedInfo> element
     */
    getSignedInfoXml: function() {
        var sig = new geierlein.util.Xml();
        sig.writeStartDocument();
        sig.writeStartElement('dsig:SignedInfo');
            sig.writeAttributeString('xmlns:dsig', 'http://www.w3.org/2000/09/xmldsig#');
            sig.writeStartElement('dsig:CanonicalizationMethod');
                sig.writeAttributeString('Algorithm', 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315');
            sig.writeEndElement();

            sig.writeStartElement('dsig:SignatureMethod');
                sig.writeAttributeString('Algorithm', 'http://www.w3.org/2000/09/xmldsig#rsa-sha1');
            sig.writeEndElement();

            sig.writeStartElement('dsig:Reference');
                sig.writeAttributeString('URI', '');
                sig.writeStartElement('dsig:Transforms');
                    sig.writeStartElement('dsig:Transform');
                        sig.writeAttributeString('Algorithm', 'http://www.w3.org/TR/1999/REC-xpath-19991116');
                        sig.writeElementString('dsig:XPath', 'ancestor-or-self::Nutzdaten');
                    sig.writeEndElement();

                    sig.writeStartElement('dsig:Transform');
                        sig.writeAttributeString('Algorithm', 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315');
                    sig.writeEndElement();
                sig.writeEndElement();

                sig.writeStartElement('dsig:DigestMethod');
                    sig.writeAttributeString('Algorithm', 'http://www.w3.org/2000/09/xmldsig#sha1');
                sig.writeEndElement();

                sig.writeElementString('dsig:DigestValue', this.digestStr);
        return sig.flush(true);
    },

    getSignatureXml: function() {
        var cert = forge.asn1.toDer(forge.pki.certificateToAsn1(this.cert));
        cert = forge.util.encode64(cert.getBytes());

        var sig = new geierlein.util.Xml();
        sig.writeStartDocument();
        sig.writeStartElement('SigUser');
            sig.writeStartElement('Sig');
                sig.writeStartElement('dsig:Signature');
                    sig.writeAttributeString('xmlns:dsig', 'http://www.w3.org/2000/09/xmldsig#');
                    sig.writeAttributeString('Id', 'Sign1');

                    sig.writeXml(this.getSignedInfoXml());
                    sig.writeElementString('dsig:SignatureValue', this.signatureStr);

                    sig.writeStartElement('dsig:KeyInfo');
                        sig.writeStartElement('dsig:X509Data');
                            sig.writeElementString('dsig:X509Certificate', cert);

        return sig.flush(true);
    }
};

/* Define node.js module. */
if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = geierlein.Signer;
}
})();
