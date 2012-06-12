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
    Xml = require('../xmlwriter.js');
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


geierlein.util.parseFile = function(data) {
    var result = {};
    data = data.split(/[\r\n]+/);
    for(var i = 0; i < data.length; i ++) {
        var line = data[i].replace(/#.*/, '');		// ignore comments
        if(line.match(/^\s*$/)) {
            continue;   // skip empty lines
        }
        var matches = line.match(/^\s*([A-Za-z0-9]+)\s*=\s*(.*?)\s*$/);
        if(matches === null) {
            throw "Unable to parse: " + line;
        }
        result[matches[1]] = matches[2];
    }
    return result;
};

geierlein.util.rewriteEncoding = function(xmlstr, newEncoding) {
    var doc = xmlstr.split(/(<\?.*?\?>)/);
    doc[1] = doc[1].replace(/encoding=['"][^'"]+['"]/,
        'encoding="' + newEncoding +'"');
    return doc.join('');
};


geierlein.util.addStylesheetHref = function(xmlstr, xslHref) {
    var doc = xmlstr.split(/(<\?.*?\?>)/);
    var tmp = doc.pop();
    doc.push('<?xml-stylesheet type="text/xsl" href="' + xslHref + '"?>');
    doc.push(tmp);
    return doc.join('');
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
