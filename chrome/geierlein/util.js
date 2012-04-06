/**
 * Utility functions for Geierlein.
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
var Xml = typeof XMLWriter !== 'undefined' ? XMLWriter : null;  

if(typeof(window) !== 'undefined') {
    geierlein = window.geierlein = window.geierlein || {};
}
else if(typeof(module) !== 'undefined' && module.exports) {
    geierlein = {
    };
    Xml = require('../lib/xmlwriter.js');
}

geierlein.util = {};

/**
 * Merge the contents of two objects together into the first one.
 * 
 * @param target An object that will receive the properties.
 * @param src An object containingproperties to merge into target.
 */
geierlein.util.extend = function(target, src) {
    for(var name in src) {
        if(src.hasOwnProperty(name)) {
            target[name] = src[name];
        }
    }
};

/**
 * Constructor function of XMLWriter objects.
 */
geierlein.util.Xml = Xml;


/* Define node.js module. */
if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = geierlein.util;
}
})();
