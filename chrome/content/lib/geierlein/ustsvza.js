/**
 * UStSvzA (sales tax prepayment) module for Geierlein.
 *
 * @author Stefan Siegl
 *
 * Copyright (c) 2013 Stefan Siegl <stesie@brokenpipe.de>
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
        util: require('./util.js'),
        validation: require('./validation.js')
    };
}

var rules = geierlein.validation.rules;

/**
 * Create new UStSvzA instance.
 *
 * @param datenlieferant A Datenlieferant instance to use.
 * @param jahr The year of the declaration.
 * @param type The type of declaration
 */
geierlein.UStSvzA = function(datenlieferant, jahr, type) {
    this.datenlieferant = datenlieferant || new geierlein.Datenlieferant();
    this.jahr = jahr;
    this.type = type;
};

geierlein.UStSvzA.prototype = new geierlein.Steuerfall();
geierlein.UStSvzA.prototype.constructor = geierlein.UStSvzA;


var validationRules = {
    land: [
        rules.required,
        rules.range(1, 16)
    ],

    jahr: [
        rules.required,
        rules.range(2010, 2015)
    ],

    type: [
        rules.required,
        function(val) {
            return this.type === 'Umsatzsteuersondervorauszahlung'
                || this.type === 'Dauerfristverlaengerung';
        }
    ],

    steuernummer: [rules.required, rules.taxNumber],

    kz10: [rules.option],
    kz26: [rules.option],
    kz29: [rules.option],
    kz38: [
        function(val) {
            if(this.type === 'Umsatzsteuersondervorauszahlung') {
                return val !== undefined && rules.unsignedInt(val);
            } else {
                return val === undefined;
            }
        }
    ]
};

function writeOption(val) {
    return val ? '1' : false;
}

function writeInt(val) {
    return (+val).toString();
}

var xmlWritingRules = {
    kz10: writeOption,
    kz26: writeOption,
    kz29: writeOption,
    kz38: writeInt
};

geierlein.util.extend(geierlein.UStSvzA.prototype, {
    validate: function(field) {
        var i = geierlein.validation.validate.call(this, validationRules, field);

        /* If field is not set, i.e. we should check the whole form, call
           validate on datenlieferant sub-model as well. */
        if(field === undefined) {
            var j = this.datenlieferant.validate();
            if(j !== true) {
                if(i === true) {
                    return j;
                }
                i = i.concat(j);
            }
        }
        return i;
    },

    /**
     * Get Elster XML representation of the Nutzdaten part.
     * 
     * @return XML representation of the Nutzdaten part as a string.
     */
    getNutzdatenXml: function(testcase) {
        var nutzdaten = new geierlein.util.Xml();
        var d = new Date();
        var erstellDatum = this.erstellungsdatum || d.getFullYear() +
            ('0' + (d.getMonth() + 1)).substr(-2) +
            ('0' + d.getDate()).substr(-2);

        nutzdaten.writeStartDocument();
        nutzdaten.writeStartElement('Nutzdaten');
            nutzdaten.writeStartElement('Anmeldungssteuern');
            nutzdaten.writeAttributeString('art', 'UStVA');
            nutzdaten.writeAttributeString('version', this.jahr + '01');

            nutzdaten.writeStartElement('DatenLieferant')
                nutzdaten.writeXml(this.datenlieferant.toXml());
            nutzdaten.writeEndElement();

            nutzdaten.writeElementString('Erstellungsdatum', erstellDatum);

            nutzdaten.writeStartElement('Steuerfall');
                nutzdaten.writeStartElement(this.type);
                    nutzdaten.writeElementString('Jahr', this.jahr);
                    nutzdaten.writeElementString('Steuernummer',
                        this.getFormattedTaxNumber());
                    nutzdaten.writeElementString('Kz09',
                        testcase ? '74931' : this.herstellerID);

                    for(var key in xmlWritingRules) {
                        var fmtValue = xmlWritingRules[key](this[key]);
                        if(fmtValue === false) {
                            continue;
                        }
                        nutzdaten.writeElementString('Kz' + key.substr(2),
                            fmtValue);
                    }

        return nutzdaten.flush(true);
    }
});

if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = geierlein.UStSvzA;
}

})();
