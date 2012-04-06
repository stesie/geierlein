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
        util: require('./util.js')
    };
}

/**
 * Create new Datenlieferant instance.
 */
geierlein.Datenlieferant = function() {
};

geierlein.Datenlieferant.prototype = {
    land: 'Deutschland',

    /**
     * Get concatenated representation as per Elster XML specification.
     *
     * @return Datenlieferant string according to specification. 
     */
    toXml: function() {
        return [
            this.name,
            this.vorwahl + '/' + this.anschluss,
            this.ort,
            this.plz,
            this.land
        ].join(', ');
    }
};


/* Define node.js module. */
if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = geierlein.Datenlieferant;
}
})();
