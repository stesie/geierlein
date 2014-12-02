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
    { spacer: '/',  groups: [5, 5]},         // Baden Württemberg
    { spacer: '/',  groups: [3, 3, 5]},      // Bayern
    { spacer: '/',  groups: [2, 3, 5]},      // Berlin
    { spacer: '/',  groups: [3, 3, 5]},      // Brandenburg
    { spacer: ' ',  groups: [2, 3, 5]},      // Bremen
    { spacer: '/',  groups: [2, 3, 5]},      // Hamburg
    { spacer: ' ',  groups: [3, 3, 5]},      // Hessen
    { spacer: '/',  groups: [3, 3, 5]},      // Mecklenburg-Vorpommern
    { spacer: '/',  groups: [2, 3, 5]},      // Niedersachsen
    { spacer: '/',  groups: [3, 4, 4]},      // Nordrhein-Westfalen
    { spacer: '/',  groups: [2, 3, 5]},      // Rheinland-Pfalz
    { spacer: '/',  groups: [3, 3, 5]},      // Saarland
    { spacer: '/',  groups: [3, 3, 5]},      // Sachsen
    { spacer: '/',  groups: [3, 3, 5]},      // Sachsen-Anhalt
    { spacer: ' ',  groups: [2, 3, 5]},      // Schleswig-Holstein
    { spacer: '/',  groups: [3, 3, 5]}       // Thüringen
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

/**
 * Get a sample tax number in "user notation".
 *
 * @param {integer} land Number of federal state for which to get the sample (1 to 16)
 * @return {String} The sample tax number in "user notation"
 */
geierlein.taxnumber.getSample = function(land) {
    /* Get rule according to chosen federal state (#land).  The options
     * in the frontend are indexed beginning from one, there subtract one */
    var rule = geierlein.taxnumber.rules[land - 1];
    var result = "";

    for(var i = 0; i < rule.groups.length; i ++) {
        result += rule.spacer + '12345'.substring(0, rule.groups[i]);
    }

    return result.substring(1);
};

/**
 * Format the user-provided tax number into 13-digit format according to spec.
 *
 * @param {integer} land Which federal state the tax number belongs to (1 to 16)
 * @param {String} steuernummer The tax number in user-provided notation
 * @return {String} The tax number in 13-digit notation
 */
geierlein.taxnumber.format = function(land, steuernummer) {
    var rule = geierlein.taxnumber.rules[land - 1].groups;
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

    if(land == 1) {
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
