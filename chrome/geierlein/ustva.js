/**
 * UStVA (monthly value added tax declaration) module for Geierlein.
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
        Datenlieferant: require('./datenlieferant.js'),
        Steuerfall: require('./steuerfall.js'),
        util: require('./util.js')
    };
}

/**
 * Create new UStVA instance.
 * 
 * @param jahr The year of the declaration.
 * @param monat The month (1-12) or quarter specification (41-44) 
 * @param datenlieferant A Datenlieferant instance to use.
 */
geierlein.UStVA = function(jahr, monat, datenlieferant) {
    this.datenlieferant = datenlieferant || new geierlein.Datenlieferant();
    this.jahr = jahr;
    this.monat = monat;
};

geierlein.UStVA.prototype = new geierlein.Steuerfall();
geierlein.UStVA.prototype.constructor = geierlein.UStVA;

geierlein.util.extend(geierlein.UStVA.prototype, {
    datenart: 'UStVA',

    validate: function() {
        console.log('Validate called on UStVA for ' + this.year);        
    },

    /**
     * Get Elster XML representation of the DatenTeil part.
     * 
     * @return XML representation of the DatenTeil part as a string.
     */
    getDatenteilXml: function() {
        var datenteil = new geierlein.util.Xml(),
            dl = this.datenlieferant;

        datenteil.writeStartDocument();
        datenteil.writeStartElement('Nutzdatenblock');
            datenteil.writeStartElement('NutzdatenHeader');
            datenteil.writeAttributeString('version', 10);
                datenteil.writeElementString('NutzdatenTicket', '7805201');
                datenteil.writeStartElement('Empfaenger');
                datenteil.writeAttributeString('id', 'F');
                    datenteil.writeString('9203');
                datenteil.writeEndElement();
                datenteil.writeStartElement('Hersteller');
                    datenteil.writeElementString('ProduktName', 'Geierlein');
                    datenteil.writeElementString('ProduktVersion', '0.01');
                datenteil.writeEndElement();
                datenteil.writeElementString('DatenLieferant', 
                    this.datenlieferant.toXml());
            datenteil.writeEndElement();    // NutzdatenHeader
        
            datenteil.writeStartElement('Nutzdaten');
                datenteil.writeStartElement('Anmeldungssteuern');
                datenteil.writeAttributeString('art', 'UStVA');
                datenteil.writeAttributeString('version', '201201');
        
                datenteil.writeStartElement('DatenLieferant');
                    datenteil.writeElementString('Name', dl.name);
                    datenteil.writeElementString('Strasse', dl.strasse);
                    datenteil.writeElementString('PLZ', dl.plz);
                    datenteil.writeElementString('Ort', dl.ort);
                    datenteil.writeElementString('Telefon', 
                        dl.vorwahl + '/' + dl.anschluss);
                datenteil.writeEndElement();
        
                datenteil.writeElementString('Erstellungsdatum', '20111120');
        
                datenteil.writeStartElement('Steuerfall');
                    datenteil.writeStartElement('Umsatzsteuervoranmeldung');
                        datenteil.writeElementString('Jahr', '2012');
                        datenteil.writeElementString('Zeitraum', '01');
                        datenteil.writeElementString('Steuernummer', '9203069802950');
                        datenteil.writeElementString('Kz09', '74931');
                        datenteil.writeElementString('Kz66', '90.00');
                        datenteil.writeElementString('Kz83', '100.00');
                        datenteil.writeElementString('Kz81', '1000');

        return datenteil.flush(true);
    }
});

if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = geierlein.UStVA;
}

})();
