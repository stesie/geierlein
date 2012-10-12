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
        util: require('./util.js'),
        validation: require('./validation.js')
    };
}

var rules = geierlein.validation.rules;

/**
 * Create new UStVA instance.
 * 
 * @param datenlieferant A Datenlieferant instance to use.
 * @param jahr The year of the declaration.
 * @param zeitraum The month (1-12) or quarter specification (41-44) 
 */
geierlein.UStVA = function(datenlieferant, jahr, zeitraum) {
    this.datenlieferant = datenlieferant || new geierlein.Datenlieferant();
    this.jahr = jahr;
    this.zeitraum = zeitraum;
};

geierlein.UStVA.prototype = new geierlein.Steuerfall();
geierlein.UStVA.prototype.constructor = geierlein.UStVA;


var validationRules = {
    land: [
        rules.required,
        rules.range(1, 16)
    ],

    jahr: [
        rules.required,
        rules.range(2010, 2012)
    ],

    zeitraum: [
        rules.required,
        function(val) {
            return rules.range(1, 12)(val) || rules.range(41, 44)(val);
        }
    ],

    steuernummer: [rules.required, rules.taxNumber],

    kz10: [rules.option],
    kz21: [rules.signedInt],
    kz22: [rules.option],
    kz26: [rules.option],
    kz29: [rules.option],
    kz35: [rules.signedInt],
    kz36: [rules.signedMonetary, rules.lessThan('kz35')],
    kz39: [rules.unsignedMonetary],
    kz41: [rules.signedInt],
    kz42: [rules.signedInt],
    kz43: [rules.signedInt],
    kz44: [rules.signedInt],
    kz45: [rules.signedInt],
    kz46: [rules.signedInt],
    kz47: [rules.signedMonetary, rules.lessThan('kz46')],
    kz48: [rules.signedInt],
    kz49: [rules.signedInt],
    kz52: [rules.signedInt],
    kz53: [rules.signedMonetary, rules.lessThan('kz52')],
    kz59: [rules.signedMonetary],
    kz60: [rules.signedInt],
    kz61: [rules.signedMonetary],
    kz62: [rules.signedMonetary],
    kz63: [rules.signedMonetary],
    kz64: [rules.signedMonetary],
    kz65: [rules.signedMonetary],
    kz66: [rules.signedMonetary],
    kz67: [rules.signedMonetary],
    kz68: [rules.signedInt],
    kz69: [rules.signedMonetary],
    kz73: [rules.signedInt],
    kz74: [rules.signedMonetary, rules.lessThan('kz73')],
    kz76: [rules.signedInt],
    kz77: [rules.signedInt],
    kz78: [rules.signedInt],
    kz79: [rules.signedMonetary, rules.lessThan('kz78')],
    kz80: [rules.signedMonetary, rules.lessThan('kz76')],
    kz81: [rules.signedInt],
    kz83: [rules.required, rules.signedMonetary, rules.kz83],
    kz84: [rules.signedInt],
    kz85: [rules.signedMonetary, rules.lessThan('kz84')],
    kz86: [rules.signedInt],
    kz89: [rules.signedInt],
    kz91: [rules.signedInt],
    kz93: [rules.signedInt],
    kz94: [rules.signedInt],
    kz95: [rules.signedInt],
    kz96: [rules.signedMonetary, rules.lessThan('kz94')],
    kz98: [rules.signedMonetary, rules.lessThan('kz95')]
};

function writeOption(val) {
    return val ? '1' : false;
}

function writeOptionalInt(val) {
    return val === undefined ? false : (+val).toString();
}

function writeOptionalUnsignedMonetary(val) {
    return val === undefined ? false : (+val).toFixed(2);
}

function writeOptionalSignedMonetary(val) {
    return val === undefined ? false : (+val).toFixed(2);
}

function writeMonetary(val) {
    return (+val).toFixed(2);
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
     * Calculate the correct value for Kz83 (total VAT due)
     * 
     * @return The (roughly) expected value for Kz83.
     */
    calculateKz83: function() {
        function getValue(val, factor) {
            if(val === undefined) {
                return 0;
            }
            return +val * (factor || 1);
        }

        return getValue(this.kz81, +0.19) +
            getValue(this.kz86, +0.07) +
            getValue(this.kz36) +
            getValue(this.kz80) +
            getValue(this.kz96) +
            getValue(this.kz98) +
            getValue(this.kz89, +0.19) +
            getValue(this.kz93, +0.07) +
            getValue(this.kz85) +
            getValue(this.kz74) +
            getValue(this.kz79) +
            getValue(this.kz53) +
            getValue(this.kz47) +
            getValue(this.kz65) +
            getValue(this.kz66, -1) +
            getValue(this.kz61, -1) +
            getValue(this.kz62, -1) +
            getValue(this.kz67, -1) +
            getValue(this.kz63, -1) +
            getValue(this.kz64, -1) +
            getValue(this.kz59, -1) +
            getValue(this.kz69) +
            getValue(this.kz39, -1);
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
                nutzdaten.writeStartElement('Umsatzsteuervoranmeldung');
                    nutzdaten.writeElementString('Jahr', this.jahr);
                    nutzdaten.writeElementString('Zeitraum',
                        ('0' + this.zeitraum).substr(-2));
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
    module.exports = geierlein.UStVA;
}

})();
