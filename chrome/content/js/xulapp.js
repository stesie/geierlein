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
    Components.utils.import("resource://gre/modules/NetUtil.jsm");

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

        resetForm: function() {
            cW.geierlein.resetForm();
            xulapp.loadDefaultAddressData();
        },

        openFile: function() {
            var nsIFilePicker = Components.interfaces.nsIFilePicker;
            var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);

            fp.init(window, 'Datei öffnen', nsIFilePicker.modeOpen);
            fp.appendFilters(nsIFilePicker.filterText | nsIFilePicker.filterAll);

            var res = fp.show();
            if (res !== nsIFilePicker.returnOK) {
                return;
            }

            NetUtil.asyncFetch(fp.file, function(inStream, status) {
                if(!Components.isSuccessCode(status)) {
                    alert('Beim Lesen der Datei ist ein Fehler aufgetreten!');
                    return;
                }

                var data = NetUtil.readInputStreamToString(inStream,
                    inStream.available(), { charset: 'UTF-8' });

                data = cW.geierlein.util.parseFile(data);
                cW.geierlein.resetForm();

                for(var key in data) {
                    if(data.hasOwnProperty(key)) {
                        /* The IDs of the input elements in the form start with
                         * an upper-case K.
                         */
                        var newValue = data[key];

                        if(key.substr(0, 2) === 'kz') {
                            key = 'K' + key.substr(1);
                        }

                        var $el = cW.$('#' + key);
                        if($el.length) {
                            $el.val(newValue).change();
                        } else {
                            alert('No element found for ' + key);
                        }
                    }
                }
            });
        },
        
        send: function(asTestcase) {
            return cW.geierlein.sendData(asTestcase);
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
