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

    /**
     * Get XML representation of this taxcase.
     *
     * A callback function can be passed to this function, which needs to
     * perform the encryption as required by the specification.  Leave
     * undefined to get an unencrypted representation.
     * 
     * @param testcase Whether to declare the taxcase as a testcase.
     * @param encCb Callback function to encrypt data as necessary.
     * @result XML representation of the taxcase as a string.
     */
    toXml: function(testcase, encCb) {
        if(encCb === undefined) {
            encCb = function(data) {
                return data;
            };
        }
        
        var datenteil = encCb(this.getDatenteilXml(testcase));

        var xml = new geierlein.util.Xml('ISO-8859-1', '1.0');
        xml.writeStartDocument();
        xml.writeStartElement('Elster');
        xml.writeAttributeString('xmlns', schemaUri);
        xml.writeAttributeString('xmlns:elster', schemaUri);
            xml.writeStartElement('TransferHeader');
            xml.writeAttributeString('version', 8);
                xml.writeElementString('Verfahren', 'ElsterAnmeldung');
                xml.writeElementString('DatenArt', this.datenart);
                xml.writeElementString('Vorgang', 'send-NoSig');
                
                if(testcase) {
                    xml.writeElementString('Testmerker', '700000004');
                    xml.writeElementString('HerstellerID', '74931');
                } else {
                    xml.writeElementString('Testmerker', '000000000');
                    xml.writeElementString('HerstellerID', this.herstellerID);
                }
                
                xml.writeElementString('DatenLieferant',
                    encCb(this.datenlieferant.toString()));
                xml.writeStartElement('Datei');
                    xml.writeElementString('Verschluesselung', 'PKCS#7v1.5');
                    xml.writeElementString('Kompression', 'GZIP');
                    xml.writeElementString('DatenGroesse',
                        datenteil.length.toString());
                    xml.writeElementString('TransportSchluessel', '');
                xml.writeEndElement();  // Datei
                xml.writeElementString('VersionClient', '0.01');
            xml.writeEndElement();  // TransferHeader
        
            xml.writeElementString('DatenTeil', datenteil);
    
        return xml.flush();
    },
    
    /**
     * Get encrypted representation in Elster-XML format.
     * 
     * @param testcase Whether to declare the taxcase as a testcase.
     * @result XML representation of the taxcase as a string.
     */
    toEncryptedXml: function(testcase) {
        var key = geierlein.crypto.generateKey();
        return this.toXml(testcase, function(data) {
            return geierlein.crypto.encryptBlock(data, key);
        });
    }
};


/* Define node.js module. */
if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = geierlein.Steuerfall;
}
})();
