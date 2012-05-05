/**
 * Tax-number definition for Geierlein.
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
        util: require('./util.js')
    };
}

geierlein.taxnumber = {};

geierlein.taxnumber.rules = [
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

geierlein.taxnumber.prefixes = [
    false,          // Baden Württemberg (handled specially)
    "9",            // Bayern
    "11",           // Berlin
    "3",            // Brandenburg
    "24",           // Bremen
    "22",           // Hamburg
    "26",           // Hessen
    "4",            // Mecklenburg-Vorpommern
    "23",           // Niedersachsen
    "5",            // Nordrhein-Westfalen
    "27",           // Rheinland-Pfalz
    "1",            // Saarland
    "3",            // Sachsen
    "3",            // Sachsen-Anhalt
    "21",           // Schleswig-Holstein
    "4"             // Thüringen
];

geierlein.taxnumber.getSample = function(land) {
    /* Get rule according to choosen federal state (#land).  The options
     * in the frontend are indexed beginning from one, there subtract one */
    var rule = geierlein.taxnumber.rules[land - 1];
    var result = "";

    for(var i = 0; i < rule.length; i ++) {
        result += '/' + '12345'.substring(0, rule[i]);
    }

    return result.substring(1);
};

geierlein.taxnumber.format = function(land, steuernummer) {
    var rule = geierlein.taxnumber.rules[land - 1];
    var prefix = geierlein.taxnumber.prefixes[land - 1];
    var pieces = steuernummer.split(/[\/ ]/);

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
};

if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = geierlein.taxnumber;
}

})();