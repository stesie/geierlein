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
 * @param datenlieferant A Datenlieferant instance to use.
 * @param jahr The year of the declaration.
 * @param monat The month (1-12) or quarter specification (41-44) 
 */
geierlein.UStVA = function(datenlieferant, jahr, monat) {
    this.datenlieferant = datenlieferant || new geierlein.Datenlieferant();
    this.jahr = jahr;
    this.monat = monat;
};

geierlein.UStVA.prototype = new geierlein.Steuerfall();
geierlein.UStVA.prototype.constructor = geierlein.UStVA;


var taxNumberRules = [
    [5, 5],         // Baden Württemberg
    [3, 3, 5],      // Bayern
    [2, 3, 5],      // Berlin
    [3, 3, 5],      // Brandenburg
    [2, 3, 5],      // Bremen
    [2, 3, 5],      // Hamburg
    [3, 3, 5],      // Hessen
    [3, 3, 5],      // Mecklenburg-Vorpommern
    [2, 3, 5],      // Niedersachsen
    [3, 4, 4],      // Nordrhein-Westfalen
    [2, 3, 4, 1],   // Rheinland-Pfalz
    [3, 3, 5],      // Saarland
    [3, 3, 5],      // Sachsen
    [3, 3, 5],      // Sachsen-Anhalt
    [2, 3, 5],      // Schleswig-Holstein
    [3, 3, 5]       // Thüringen
];

var taxNumberPrefixes = [ false, "9", "11", "3", "24", "22", "26", "4", "23",
    "5", "27", "1", "3", "3", "21", "4" ];

function ruleRequired(val) {
    return val !== undefined;
}

function ruleRange(min, max) {
    return function(val) {
        if(val === undefined) {
            return true;  // ruleRange accepts undefined as valid!
        }

        val = parseInt(val, 10);
        return val >= min && val <= max;
    };
}

function ruleOption(val) {
    return val === undefined || parseInt(val, 10) === 1;
}

function ruleSignedInt(val) {
    return val === undefined || parseInt(val, 10) === +val;
}

function ruleUnsignedInt(val) {
    return val === undefined || (ruleSignedInt(val) && parseInt(val, 10) >= 0);
}

function ruleSignedMonetary(val) {
    return val === undefined || (+val == parseFloat(val).toFixed(2));
}

function ruleUnsignedMonetary(val) {
    return val === undefined || (+val >= 0 && +val == parseFloat(val).toFixed(2));
}

function ruleLessThan(otherKz) {
    return function(val) {
        if(val === undefined) {
            return true;
        }
        if(this[otherKz] === undefined) {
            return false;
        }
        return parseFloat(val) < parseFloat(this[otherKz]);
    };
}

var validationRules = {
    land: [
        ruleRequired,
        ruleRange(1, 16)
    ],

    jahr: [
        ruleRequired,
        ruleRange(2010, 2012)
    ],

    monat: [
        ruleRequired,
        function(val) {
            return ruleRange(1, 12)(val) || ruleRange(41, 44)(val);
        }
    ],

    steuernummer: [],

    kz10: [ruleOption],
    kz21: [ruleSignedInt],
    kz22: [ruleOption],
    kz26: [ruleOption],
    kz29: [ruleOption],
    kz35: [ruleSignedInt],
    kz36: [ruleSignedMonetary, ruleLessThan('kz35')],
    kz39: [ruleUnsignedMonetary],
    kz41: [ruleSignedInt],
    kz42: [ruleSignedInt],
    kz43: [ruleSignedInt],
    kz44: [ruleSignedInt],
    kz45: [ruleSignedInt],
    kz46: [ruleSignedInt],
    kz47: [ruleSignedMonetary, ruleLessThan('kz46')],
    kz48: [ruleSignedInt],
    kz49: [ruleSignedInt],
    kz52: [ruleSignedInt],
    kz53: [ruleSignedMonetary, ruleLessThan('kz52')],
    kz59: [ruleSignedMonetary],
    kz60: [ruleSignedInt],
    kz61: [ruleSignedMonetary],
    kz62: [ruleSignedMonetary],
    kz63: [ruleSignedMonetary],
    kz64: [ruleSignedMonetary],
    kz65: [ruleSignedMonetary],
    kz66: [ruleSignedMonetary],
    kz67: [ruleSignedMonetary],
    kz68: [ruleSignedInt],
    kz69: [ruleSignedMonetary],
    kz73: [ruleSignedInt],
    kz74: [ruleSignedMonetary, ruleLessThan('kz73')],
    kz76: [ruleSignedInt],
    kz77: [ruleSignedInt],
    kz78: [ruleSignedInt],
    kz79: [ruleSignedMonetary, ruleLessThan('kz78')],
    kz80: [ruleSignedMonetary, ruleLessThan('kz76')],
    kz81: [ruleSignedInt],
    kz83: [ruleRequired, ruleSignedMonetary],
    kz84: [ruleSignedInt],
    kz85: [ruleSignedMonetary, ruleLessThan('kz84')],
    kz86: [ruleSignedInt],
    kz89: [ruleSignedInt],
    kz91: [ruleSignedInt],
    kz93: [ruleSignedInt],
    kz94: [ruleSignedInt],
    kz95: [ruleSignedInt],
    kz96: [ruleSignedMonetary, ruleLessThan('kz94')],
    kz98: [ruleSignedMonetary, ruleLessThan('kz95')]
};

function writeOption(val) {
    return val ? '1' : false;
}

function writeOptionalInt(val) {
    return val === undefined ? false : val.toString();
}

function writeOptionalUnsignedMonetary(val) {
    return val === undefined ? false : val.toFixed(2);
}

function writeOptionalSignedMonetary(val) {
    return val === undefined ? false : val.toFixed(2);
}

function writeMonetary(val) {
    return val.toFixed(2);
}

var xmlWritingRules = {
    kz10: writeOption,
    kz21: writeOptionalInt,
    kz22: writeOption,
    kz26: writeOption,
    kz29: writeOption,
    kz35: writeOptionalInt,
    kz36: writeOptionalSignedMonetary,
    kz39: writeOptionalUnsignedMonetary,
    kz41: writeOptionalInt,
    kz42: writeOptionalInt,
    kz43: writeOptionalInt,
    kz44: writeOptionalInt,
    kz45: writeOptionalInt,
    kz46: writeOptionalInt,
    kz47: writeOptionalSignedMonetary,
    kz48: writeOptionalInt,
    kz49: writeOptionalInt,
    kz52: writeOptionalInt,
    kz53: writeOptionalSignedMonetary,
    kz59: writeOptionalSignedMonetary,
    kz60: writeOptionalInt,
    kz61: writeOptionalSignedMonetary,
    kz62: writeOptionalSignedMonetary,
    kz63: writeOptionalSignedMonetary,
    kz64: writeOptionalSignedMonetary,
    kz65: writeOptionalSignedMonetary,
    kz66: writeOptionalSignedMonetary,
    kz67: writeOptionalSignedMonetary,
    kz68: writeOptionalInt,
    kz69: writeOptionalSignedMonetary,
    kz73: writeOptionalInt,
    kz74: writeOptionalSignedMonetary,
    kz76: writeOptionalInt,
    kz77: writeOptionalInt,
    kz78: writeOptionalInt,
    kz79: writeOptionalSignedMonetary,
    kz80: writeOptionalSignedMonetary,
    kz81: writeOptionalInt,
    kz83: writeMonetary,
    kz84: writeOptionalInt,
    kz85: writeOptionalSignedMonetary,
    kz86: writeOptionalInt,
    kz89: writeOptionalInt,
    kz91: writeOptionalInt,
    kz93: writeOptionalInt,
    kz94: writeOptionalInt,
    kz95: writeOptionalInt,
    kz96: writeOptionalSignedMonetary,
    kz98: writeOptionalSignedMonetary
};

geierlein.util.extend(geierlein.UStVA.prototype, {
    datenart: 'UStVA',

    validate: function(field) {
        var errors = [];
        var ruleset = {};

        if(field === undefined) {
            ruleset = validationRules;
        } else {
            ruleset[field] = validationRules[field];
        }

        for(var fieldName in ruleset) {
            if(ruleset.hasOwnProperty(fieldName)) {
                var rule = ruleset[fieldName];
                for(var i = 0, max = rule.length; i < max; i ++) {
                    if(!rule[i].call(this, this[fieldName])) {
                        errors.push(fieldName);
                    }
                }
            }
        }

        return errors.length ? errors : true;
    },

    getTaxNumberSample: function() {
        /* Get rule according to choosen federal state (#land).  The options
         * in the frontend are indexed beginning from one, there subtract one */
        var rule = taxNumberRules[this.land - 1];
        var result = "";

        for(var i = 0; i < rule.length; i ++) {
            result += '/' + '12345'.substring(0, rule[i]);
        }

        return result.substring(1);
    },

    /**
     * Get tax number in formatted (12-digit) notation.
     *
     * @return The formatted tax number as a string.
     */
    getFormattedTaxNumber: function() {
        var rule = taxNumberRules[this.land - 1];
        var prefix = taxNumberPrefixes[this.land - 1];
        var pieces = this.steuernummer.split(/[\/ ]/);

        if(pieces.length !== rule.length) {
            return false;   // wrong number of pieces
        }

        for(var i = 0; i < pieces.length; i ++) {
            if(pieces[i].length !== rule[i]) {
                return false;   // length mismatch
            }
        }

        if(this.land == 1) {
            /* Special concatenation rule for Baden Württemberg */
            return '28' + pieces[0].substr(0, 2) + '0' +
                pieces[0].substr(2) + pieces[1];
        } else {
            return prefix + pieces[0].substr(-4 + prefix.length) +
                "0" + pieces[1] + pieces[2] +
                (pieces.length == 4 ? pieces[3] : '');
        }
    },

    /**
     * Get Elster XML representation of the DatenTeil part.
     * 
     * @return XML representation of the DatenTeil part as a string.
     */
    getDatenteilXml: function(testcase) {
        var datenteil = new geierlein.util.Xml();
        var stnr = this.getFormattedTaxNumber();
        var d = new Date();
        var erstellDatum = d.getFullYear() +
            ('0' + (d.getMonth() + 1)).substr(-2) +
            ('0' + d.getDate()).substr(-2);

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
                datenteil.writeStartElement('Hersteller');
                    datenteil.writeElementString('ProduktName', 'Geierlein');
                    datenteil.writeElementString('ProduktVersion', '0.01');
                datenteil.writeEndElement();
                datenteil.writeElementString('DatenLieferant', 
                    this.datenlieferant.toString());
            datenteil.writeEndElement();    // NutzdatenHeader
        
            datenteil.writeStartElement('Nutzdaten');
                datenteil.writeStartElement('Anmeldungssteuern');
                datenteil.writeAttributeString('art', 'UStVA');
                datenteil.writeAttributeString('version', this.jahr + '01');
        
                datenteil.writeElementString('DatenLieferant',
                    this.datenlieferant.toXml());
        
                datenteil.writeElementString('Erstellungsdatum', erstellDatum);
        
                datenteil.writeStartElement('Steuerfall');
                    datenteil.writeStartElement('Umsatzsteuervoranmeldung');
                        datenteil.writeElementString('Jahr', this.jahr);
                        datenteil.writeElementString('Zeitraum',
                            ('0' + this.monat).substr(-2));
                        datenteil.writeElementString('Steuernummer', stnr);
                        datenteil.writeElementString('Kz09',
                            testcase ? '74931' : this.herstellerID);

                        for(var key in xmlWritingRules) {
                            var fmtValue = xmlWritingRules[key](this[key]);
                            if(fmtValue === false) {
                                continue;
                            }
                            datenteil.writeElementString('Kz' + key.substr(2),
                                fmtValue);
                        }

        return datenteil.flush(true);
    }
});

if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = geierlein.UStVA;
}

})();
