/**
 * XML-writer module for Geierlein.
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
if(typeof(window) !== 'undefined') {
    geierlein = window.geierlein = window.geierlein || {};
}
else if(typeof(module) !== 'undefined' && module.exports) {
    geierlein = {
        crypto: require('./crypto.js'),
        taxnumber: require('./taxnumber.js'),
        util: require('./util.js')
    };
}

var schemaUri = 'http://www.elster.de/2002/XMLSchema';

/**
 * Create new Steuerfall instance.
 */
geierlein.Steuerfall = function() {
};

geierlein.Steuerfall.prototype = {
    herstellerID: '00616',

    getTaxNumberSample: function() {
        return geierlein.taxnumber.getSample(this.land);
    },

    /**
     * Get tax number in formatted (12-digit) notation.
     *
     * @return The formatted tax number as a string.
     */
    getFormattedTaxNumber: function() {
        return geierlein.taxnumber.format(this.land, this.steuernummer);
    },


    /**
     * Get XML representation of this taxcase.
     *
     * A callback function can be passed to this function, which needs to
     * perform the encryption as required by the specification.  Leave
     * undefined to get an unencrypted representation.
     * 
     * @param testcase Whether to declare the taxcase as a testcase.
     * @param signer Optional signer context to put signature on XML,
     *   pass undefined to skip signing.
     * @param encCb Callback function to encrypt data as necessary.
     * @result XML representation of the taxcase as a string.
     */
    toXml: function(testcase, signer, encCb) {
        if(this.validate() !== true) {
            return false;
        }

        if(encCb === undefined) {
            encCb = function(data) {
                return data;
            };
        }
        
        var datenteil = encCb(this.getDatenteilXml(testcase, signer));

        var xml = new geierlein.util.Xml('ISO-8859-1', '1.0');
        xml.writeStartDocument();
        xml.writeStartElement('Elster');
        xml.writeAttributeString('xmlns', schemaUri);
        xml.writeAttributeString('xmlns:elster', schemaUri);
            xml.writeStartElement('TransferHeader');
            xml.writeAttributeString('version', 8);
                xml.writeElementString('Verfahren', 'ElsterAnmeldung');
                xml.writeElementString('DatenArt', this.datenart);
                xml.writeElementString('Vorgang',
                    signer === undefined ? 'send-NoSig' : 'send-Sig');
                
                if(testcase) {
                    xml.writeElementString('Testmerker', '700000004');
                    xml.writeElementString('HerstellerID', '74931');
                } else {
                    xml.writeElementString('Testmerker', '000000000');
                    xml.writeElementString('HerstellerID', this.herstellerID);
                }
                
                xml.writeStartElement('DatenLieferant');
                    xml.writeXml(encCb(xml.escape(this.datenlieferant.toString())));
                xml.writeEndElement();

                xml.writeStartElement('Datei');
                    xml.writeElementString('Verschluesselung', 'PKCS#7v1.5');
                    xml.writeElementString('Kompression', 'GZIP');
                    xml.writeElementString('DatenGroesse',
                        datenteil.length.toString());
                    xml.writeElementString('TransportSchluessel', '');
                xml.writeEndElement();  // Datei
                xml.writeElementString('VersionClient', '0.4.0');
            xml.writeEndElement();  // TransferHeader
        
            xml.writeStartElement('DatenTeil');
                xml.writeXml(datenteil);
    
        return xml.flush();
    },
    
    /**
     * Get encrypted representation in Elster-XML format.
     * 
     * @param testcase Whether to declare the taxcase as a testcase.
     * @param signer Optional signer context to put signature on XML,
     *   pass undefined to skip signing.
     * @param sendCb Callback function handling data exchange with
     *   Elster server.  Arguments, the data to send (encrypted) and
     *   another callback function to pass the (encrypted) result to.
     * @param resultCb Callback function to pass the decrypted results to.  The
     *   result is passed as first (and only) argument.
     * @result XML representation of the taxcase as a string.
     */
    toEncryptedXml: function(testcase, signer, sendCb, resultCb) {
        var key = geierlein.crypto.generateKey();
        var encData = this.toXml(testcase, signer, function(data) {
            return geierlein.crypto.encryptBlock(data, key);
        });

        if(encData && sendCb !== undefined) {
            sendCb(encData, function(resData) {
                if(resData === false) {
                    return resultCb(false);
                }
                resultCb(geierlein.crypto.decryptDocument(resData, key));
            });
        }

        return encData;
    },

    /**
     * Get Elster XML representation of the DatenTeil part.
     *
     * @param testcase Whether to declare the taxcase as a testcase.
     * @param signer Optional signer context to put signature on XML,
     *   pass undefined to skip signing.
     * @return XML representation of the DatenTeil part as a string.
     */
    getDatenteilXml: function(testcase, signer) {
        var datenteil = new geierlein.util.Xml();
        var stnr = this.getFormattedTaxNumber();
        var nutzdaten = this.getNutzdatenXml(testcase);

        datenteil.writeStartDocument();
        datenteil.writeStartElement('Nutzdatenblock');
            datenteil.writeStartElement('NutzdatenHeader');
            datenteil.writeAttributeString('version', 10);
                datenteil.writeElementString('NutzdatenTicket',
                    Math.floor(Math.random() * 9999999).toString());
                datenteil.writeStartElement('Empfaenger');
                datenteil.writeAttributeString('id', 'F');
                    datenteil.writeString(stnr.substr(0, 4));
                datenteil.writeEndElement();

                if(signer !== undefined) {
                    signer.sign(nutzdaten);
                    datenteil.writeXml(signer.getSignatureXml());
                }

                datenteil.writeStartElement('Hersteller');
                    datenteil.writeElementString('ProduktName', 'Geierlein');
                    datenteil.writeElementString('ProduktVersion', '0.4.0');
                datenteil.writeEndElement();

                datenteil.writeStartElement('DatenLieferant')
                    datenteil.writeString(this.datenlieferant.toString());
                datenteil.writeEndElement();
            datenteil.writeEndElement();    // NutzdatenHeader

            datenteil.writeXml(nutzdaten);
        return datenteil.flush(true);
    }
};


/* Define node.js module. */
if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = geierlein.Steuerfall;
}
})();
