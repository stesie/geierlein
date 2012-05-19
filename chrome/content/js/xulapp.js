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

    const C = Components.classes;
    const I = Components.interfaces;

    var doc = document.getElementById('doc');
    var cW = null;
    var DEFAULT_ADDRESS_DATA_SELECTOR = '.datenlieferant, #steuernummer, #land';
    var prefs = null;
    var filePath;
    var fileChanged = false;
    
    function storeStringToFile(data, filePath, cb) {
        var converter = C["@mozilla.org/intl/scriptableunicodeconverter"]
            .createInstance(I.nsIScriptableUnicodeConverter);
        converter.charset = "UTF-8";

        var ostream = FileUtils.openSafeFileOutputStream(filePath);
        var istream = converter.convertToInputStream(data);

        NetUtil.asyncCopy(istream, ostream, function(status) {
            if(!Components.isSuccessCode(status)) {
                alert('Beim Schreiben der Datei ist ein Fehler aufgetreten!');
                return;
            }

            if(typeof(cb) === 'function') {
                cb();
            }
        });
    }

    function modalFileSaveAsDialog() {
        var nsIFilePicker = I.nsIFilePicker;
        var fp = C["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);

        fp.init(window, 'Datei speichern', nsIFilePicker.modeSave);
        fp.appendFilters(nsIFilePicker.filterText | nsIFilePicker.filterAll);

        var res = fp.show();
        return (res === nsIFilePicker.returnOK ||
            res === nsIFilePicker.returnReplace) ? fp : undefined;
    }

    function modalAskSaveChanges() {
        if(!fileChanged) {
            return false;
        }

        var ps = C["@mozilla.org/embedcomp/prompt-service;1"].getService(I.nsIPromptService);
        var rv = ps.confirmEx(window, 'Geierlein',
            'Am Formular wurden Änderungen vorgenommen, die noch nicht ' +
            'gespeichert wurden.  Sollen diese gespeichert werden?',
            ps.BUTTON_TITLE_SAVE * ps.BUTTON_POS_0 +
            ps.BUTTON_TITLE_DONT_SAVE * ps.BUTTON_POS_1 +
            ps.BUTTON_TITLE_CANCEL * ps.BUTTON_POS_2,
            null, null, null, null, {});

        if(rv === 0) {  /* save */
            xulapp.saveFile();
        } else if(rv === 2) {   /* cancel */
            return true;
        }

        return false;   /* proceed to new/open/quit. */
    }

    window.addEventListener("load", function() {
        cW = doc.contentWindow;
        cW.$('body').removeClass('native').addClass('xulapp');

        /* Initialize access to preferences system. */
        var prefService = C['@mozilla.org/preferences-service;1']
            .getService(I.nsIPrefService);
        prefs = prefService.getBranch('geierlein.');

        /* Get nsICommandLine instance. */
        var cmdLine = window.arguments[0];
        cmdLine = cmdLine.QueryInterface(I.nsICommandLine);

        /* Check command line arguments for -load flag. */
        var loadFlag = cmdLine.handleFlagWithParam('load', false);
        if(loadFlag) {
            var fp;

            if(loadFlag.substr(0, 1) === '/') {
                /* Absolute path name */
                fp = C["@mozilla.org/file/local;1"].createInstance(I.nsILocalFile);
                fp.initWithPath(loadFlag);
            } else {
                /* Relative path name */
                var dirService = C["@mozilla.org/file/directory_service;1"].getService(I.nsIProperties);
                var curProcDir = dirService.get("CurProcD", I.nsIFile);

                fp = curProcDir.clone().QueryInterface(I.nsILocalFile);
                fp.appendRelativePath(loadFlag);
            }

            if(!fp.exists()) {
                alert('Die angegebene Datei existiert nicht.');
            } else if(!fp.isReadable()) {
                alert('Die angegebene Datei kann nicht gelesen werden.');
            } else {
                xulapp.openFile(fp);
            }
        } else {
            /* Load default address data from preferences system. */
            xulapp.loadDefaultAddressData();
        }
        
        if(cW.geierlein.isDatenlieferantValid()) {
            cW.$('#accordion-unternehmer').collapse();
        }

        /* Bind store defaults button. */
        cW.$('#store-defaults').click(xulapp.storeDefaultAddressData);

        /* Bind change-handler on form to notice changes. */
        cW.$('.ustva, .datenlieferant').on('change keyup', function() {
            fileChanged = true;
        });

        /* Bind save-button in protocol popup. */
        cW.$('#protocol-save').click(function() {
            var fp = modalFileSaveAsDialog();
            if(fp === undefined) {
                return; /* user hit cancel */
            }

            var src = cW.$('#protocol-frame')[0].src;
            src = unescape(src.substr(src.indexOf(',') + 1));
            storeStringToFile(src, fp.file);
        });


        /* Show developer menu if allowed by pref. */
        if(prefs.getBoolPref('debug.showDevelMenu')) {
            document.getElementsByClassName('hideDevel')[0].className = '';
        }
    }, false);

    window.addEventListener("close", function(event) {
        if(!xulapp.shutdownQuery()) {
            event.preventDefault();
        }
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
            if(modalAskSaveChanges()) {
                return; /* User asked to cancel. */
            }

            cW.geierlein.resetForm();
            filePath = undefined;
            xulapp.loadDefaultAddressData();
            fileChanged = false;
        },

        openFile: function(loadFilePath) {
            if(modalAskSaveChanges()) {
                return; /* User asked to cancel. */
            }

            if(loadFilePath === undefined) {
                var nsIFilePicker = I.nsIFilePicker;
                var fp = C["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);

                fp.init(window, 'Datei öffnen', nsIFilePicker.modeOpen);
                fp.appendFilters(nsIFilePicker.filterText | nsIFilePicker.filterAll);

                var res = fp.show();
                if (res !== nsIFilePicker.returnOK) {
                    return;
                }

                loadFilePath = fp.file;
            }

            NetUtil.asyncFetch(loadFilePath, function(inStream, status) {
                if(!Components.isSuccessCode(status)) {
                    alert('Beim Lesen der Datei ist ein Fehler aufgetreten!');
                    return;
                }

                var data = NetUtil.readInputStreamToString(inStream,
                    inStream.available(), { charset: 'UTF-8' });

                if(cW.geierlein.unserialize(data)) {
                    filePath = loadFilePath;
                    fileChanged = false;
                }
            });
        },

        saveFile: function() {
            if(filePath === undefined) {
                return xulapp.saveFileAs();
            }

            var data = cW.geierlein.serialize();
            if(storeStringToFile(data, filePath, function() {
                fileChanged = false;
            }));
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
            return !modalAskSaveChanges();
        },

        shutdown: function() {
            if(!xulapp.shutdownQuery()) {
                return;
            }

            var appStartup = C['@mozilla.org/toolkit/app-startup;1'].getService(I.nsIAppStartup);
            appStartup.quit(I.nsIAppStartup.eAttemptQuit);
        }
    };
}());
