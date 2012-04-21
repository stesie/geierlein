/**
 * Application logic for Geierlein XUL-based interface.
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

var xulapp = (function() {
    var doc = document.getElementById('doc');
    var cW = null;
    var DEFAULT_ADDRESS_DATA_SELECTOR = '.datenlieferant, #steuernummer, #land';
    var prefs = null;

    window.addEventListener("load", function() {
        cW = doc.contentWindow;
        cW.$('body').removeClass('native').addClass('xulapp');

        /* Initialize access to preferences system. */
        var prefService = Components.classes['@mozilla.org/preferences-service;1']
            .getService(Components.interfaces.nsIPrefService);
        prefs = prefService.getBranch('geierlein.');

        /* Load default address data from preferences system. */
        xulapp.loadDefaultAddressData();
        cW.$('#store-defaults').click(xulapp.storeDefaultAddressData);
    }, false);

    window.addEventListener("close", function(event) {
        return xulapp.shutdownQuery();
    }, false);

    return {
        loadDefaultAddressData: function() {
            cW.$(DEFAULT_ADDRESS_DATA_SELECTOR).each(function() {
                var $el = cW.$(this);
                $el.val(prefs.getCharPref('defaultAddress.' + this.id));
                $el.change();
            });
        },

        storeDefaultAddressData: function() {
            this.blur();
            cW.$(DEFAULT_ADDRESS_DATA_SELECTOR).each(function() {
                prefs.setCharPref('defaultAddress.' + this.id, this.value);
            });
        },

        showInfo: function() {
            cW.$('#about').modal();
        },

        shutdownQuery: function() {
            return true;
        },

        shutdown: function() {
            if(!xulapp.shutdownQuery()) {
                return;
            }

            var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].getService(Components.interfaces.nsIAppStartup);
            appStartup.quit(Components.interfaces.nsIAppStartup.eAttemptQuit);
        }
    };
}());
