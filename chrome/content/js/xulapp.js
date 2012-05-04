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
    Components.utils.import("resource://gre/modules/FileUtils.jsm");

    var doc = document.getElementById('doc');
    var cW = null;
    var DEFAULT_ADDRESS_DATA_SELECTOR = '.datenlieferant, #steuernummer, #land';
    var prefs = null;
    var filePath;
    
    function modalFileSaveAsDialog() {
        var nsIFilePicker = Components.interfaces.nsIFilePicker;
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);

        fp.init(window, 'Datei speichern', nsIFilePicker.modeSave);
        fp.appendFilters(nsIFilePicker.filterText | nsIFilePicker.filterAll);

        var res = fp.show();
        return (res === nsIFilePicker.returnOK) ? fp : undefined;
    }

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
            filePath = undefined;
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

                if(cW.geierlein.unserialize(data)) {
                    filePath = fp.file;
                }
            });
        },

        saveFile: function() {
            if(filePath === undefined) {
                return xulapp.saveFileAs();
            }

            var data = cW.geierlein.serialize();
            var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
                .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
            converter.charset = "UTF-8";

            var ostream = FileUtils.openSafeFileOutputStream(filePath);
            var istream = converter.convertToInputStream(data);

            NetUtil.asyncCopy(istream, ostream, function(status) {
                if(!Components.isSuccessCode(status)) {
                    alert('Beim Schreiben der Datei ist ein Fehler aufgetreten!');
                }
            });  
        },
        
        saveFileAs: function() {
            var fp = modalFileSaveAsDialog();
            if(fp === undefined) {  /* action cancelled by user. */
                return;
            }
            
            /* Store chosen filepath and call the saveFile function (again). */
            filePath = fp.file;
            xulapp.saveFile();
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
