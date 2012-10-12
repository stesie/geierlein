/**
 * Datenlieferant module for Geierlein.
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
        util: require('./util.js'),
        validation: require('./validation.js')
    };
}

var rules = geierlein.validation.rules;

var validationRules = {
    name: [ rules.required, rules.maxLength(45) ],
    strasse: [ rules.required, rules.maxLength(30) ],
    plz: [ rules.required, rules.maxLength(12) ],
    ort: [ rules.required, rules.maxLength(30) ],
    telefon: [ rules.maxLength(20) ],
    email: [ rules.maxLength(70) ]
};

/**
 * Create new Datenlieferant instance.
 */
geierlein.Datenlieferant = function() {
};

geierlein.Datenlieferant.prototype = {
    land: 'Deutschland',

    validate: function(field) {
        return geierlein.validation.validate.call(this, validationRules, field);
    },

    /**
     * Get concatenated representation as per Elster XML specification.
     *
     * @return Datenlieferant string according to specification. 
     */
    toString: function() {
        var r = [
            this.name,
            this.strasse,
            this.ort,
            this.plz
        ];

        if(this.telefon !== undefined) {
            r.push(this.telefon);
        }

        if(this.email !== undefined) {
            r.push(this.email);
        }

        return r.join(', ');
    },

    /**
     * Get XML representation as per Elster XML specification.
     *
     * @return Datenlieferant XML block according to specification.
     */
    toXml: function() {
        var esc = geierlein.util.Xml.prototype.escape;

        var r = '<Name>' + esc(this.name) + '</Name>' +
            '<Strasse>' + esc(this.strasse) + '</Strasse>' +
            '<PLZ>' + esc(this.plz) + '</PLZ>' +
            '<Ort>' + esc(this.ort) + '</Ort>';

        if(this.telefon !== undefined) {
            r += '<Telefon>' + esc(this.telefon) + '</Telefon>';
        }
        
        if(this.email !== undefined) {
            r += '<Email>' + esc(this.email) + '</Email>';
        }
        
        return r;
    }
};


/* Define node.js module. */
if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = geierlein.Datenlieferant;
}
})();
