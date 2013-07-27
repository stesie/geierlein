/**
 * localStorage-based application preferences store.
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

(function(exports) {
    var haveLocalStorage = false;

    try {
        if(typeof localStorage === 'object') {
            haveLocalStorage = true;
        }
    } catch(ex) { }

    if(!haveLocalStorage) {
        return;
    }

    exports.LocalStoragePrefstore = function(rootBranch) {
        if(rootBranch.substr(-1) !== '.') {
            rootBranch += '.';
        }

        this.rootBranch = rootBranch;
    };

    function fetch(key) {
        var value = localStorage[key];

        /* Firefox returns "null" for undefined keys.  Instead Chromium returns
           "undefined" for undefined keys.  Normalize to what Chromium does
           return. */
        if(value === null) {
            value = undefined;
        }

        return value;
    }

    exports.LocalStoragePrefstore.prototype = {
        getBoolPref: function(pref) {
            return fetch(this.rootBranch + pref);
        },

        getIntPref: function(pref) {
            return fetch(this.rootBranch + pref);
        },

        getCharPref: function(pref) {
            return fetch(this.rootBranch + pref);
        },

        setIntPref: function(pref, value) {
            localStorage[this.rootBranch + pref] = value;
        },

        setCharPref: function(pref, value) {
            localStorage[this.rootBranch + pref] = value;
        }
    };
})(this);
