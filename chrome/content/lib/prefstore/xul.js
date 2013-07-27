/**
 * XUL-based application preferences store.
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

var hasComponentsAccess = typeof Components === 'object';
if(hasComponentsAccess) {
    /* Test whether we are just seeing the Components object, which is true
       even in Mozilla Firefox, but are denied permission to access it. */
    try {
        Components.classes;
    } catch(e) {
        hasComponentsAccess = false;
    }
}

if(hasComponentsAccess) {
    function XulPrefstore(rootBranch) {
        const C = Components.classes;
        const I = Components.interfaces;

        if(rootBranch.substr(-1) !== '.') {
            rootBranch += '.';
        }

        /* Initialize access to preferences system. */
        var prefService = C['@mozilla.org/preferences-service;1']
            .getService(I.nsIPrefService);
        this.prefs = prefService.getBranch(rootBranch);
    };


    (function() {
        const C = Components.classes;
        const I = Components.interfaces;

        XulPrefstore.prototype = {
            getBoolPref: function(pref) {
                return this.prefs.getBoolPref(pref);
            },

            getIntPref: function(pref) {
                return this.prefs.getIntPref(pref);
            },

            getCharPref: function(pref) {
                return this.prefs.getCharPref(pref);
            },

            setIntPref: function(pref, value) {
                this.prefs.setIntPref(pref, value);
            },

            setCharPref: function(pref, value) {
                this.prefs.setCharPref(pref, value);
            }
        };
    })();
}
