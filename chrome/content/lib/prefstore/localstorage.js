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

if(typeof localStorage === 'object') {
    function LocalStoragePrefstore(rootBranch) {
        if(rootBranch.substr(-1) !== '.') {
            rootBranch += '.';
        }

        this.rootBranch = rootBranch;
    };


    (function() {
        LocalStoragePrefstore.prototype = {
            getBoolPref: function(pref) {
                return localStorage[this.rootBranch + pref];
            },

            getIntPref: function(pref) {
                return localStorage[this.rootBranch + pref];
            },

            getCharPref: function(pref) {
                return localStorage[this.rootBranch + pref];
            },

            setIntPref: function(pref, value) {
                localStorage[this.rootBranch + pref] = value;
            },

            setCharPref: function(pref, value) {
                localStorage[this.rootBranch + pref] = value;
            }
        };
    })();
}
