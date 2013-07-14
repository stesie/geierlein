/**
 * Application logic for Geierlein XUL-based interface.
 *
 * @author Stefan Siegl
 *
 * Copyright (c) 2012, 2013 Stefan Siegl <stesie@brokenpipe.de>
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
        cW.$('body')
            .removeClass('native')
            .addClass('xulapp')
            .on('reset-form', xulapp.autofillTimeRange)
            .on('send-taxcase', function(ev, asTestcase) {
                if(cW.prefstore.getBoolPref('autosave.geierfile')) {
                    var fp = xulapp.getAutosaveFilepath();
                    var data = cW.geierlein.serialize();
                    storeStringToFile(data, fp);
                }

                if(!asTestcase) {
                    cW.prefstore.setIntPref('autofill.time.lastyear', cW.$('#jahr').val());
                    cW.prefstore.setIntPref('autofill.time.lastmonth', cW.$('#zeitraum').val());
                }
            })
            .on('show-protocol', function(ev, res) {
                if(cW.prefstore.getBoolPref('autosave.protocol')) {
                    var fp = xulapp.getAutosaveFilepath('.proto.xml');
                    storeStringToFile(res, fp);
                }
            });

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
                var curProcDir = dirService.get("CurWorkD", I.nsIFile);

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
            cW.geierlein.loadDefaultAddressData();
            xulapp.autofillTimeRange();
        }
        
        if(cW.geierlein.isDatenlieferantValid()) {
            cW.$('#accordion-unternehmer').collapse();
        }

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
            src = decodeURIComponent(src.substr(src.indexOf(',') + 1));
            storeStringToFile(src, fp.file);
        });

        /* Bind external links to open in default browser. */
        cW.$('a[href^="http"]').click(function(ev) {
            var ios = C['@mozilla.org/network/io-service;1']
                .getService(I.nsIIOService);
            var uri = ios.newURI(ev.target.href, null, null);
            var extps = C['@mozilla.org/uriloader/external-protocol-service;1']
                .getService(I.nsIExternalProtocolService);
            extps.loadURI(uri, null);
            return false;
        });

        /* We're running in chrome context, no need for reverse proxying. */
        cW.geierlein.transfer = cW.geierlein.transferDirect;

        /* Show developer menu if allowed by pref. */
        if(cW.prefstore.getBoolPref('debug.showDevelMenu')) {
            document.getElementsByClassName('hideDevel')[0].className = '';
        }
    }, false);

    window.addEventListener("close", function(event) {
        if(!xulapp.shutdownQuery()) {
            event.preventDefault();
        }
    }, false);

    return {
        autofillTimeRange: function() {
            switch(cW.prefstore.getIntPref('autofill.time.mode')) {
                case 1: /* last month */
                    /* do nothing, it's Geierlein's default to preselect
                       the last month. */
                    break;
                case 2: /* last quarter */
                    var d = new Date();
                    d.setMonth(d.getMonth() - (d.getMonth() % 3));
                    d.setMonth(d.getMonth() - 3);
                    cW.$('#jahr').val(d.getFullYear()).change();
                    cW.$('#zeitraum').val((d.getMonth() / 3) + 41).change();
                    break;
                case 3: /* last transmission date */
                    try {
                        var year = cW.prefstore.getIntPref('autofill.time.lastyear');
                        var month = cW.prefstore.getIntPref('autofill.time.lastmonth');
                        if(month === 12) {
                            /* Select first month of next year */
                            month = 1;
                            year ++;
                        } else if(month === 44) {
                            /* Select first quarter of next year */
                            month = 41;
                            year ++;
                        } else {
                            month ++;
                        }
                        cW.$('#jahr').val(year).change();
                        cW.$('#zeitraum').val(month).change();
                    } catch(e) {}
            };
        },

        /* Get autosave-dir as nsILocalFile instance.
         *
         * If the geierlein.autosave.dir preference is set, the path specified
         * by the preference is returned.  If it doesn't exist, a folder named
         * "protos" is created within the profile directory and returned.
         */
        getAutosaveDir: function() {
            var fp;
            try {
                fp = cW.prefstore.prefs.getComplexValue("autosave.dir", I.nsILocalFile);
            } catch(e) {
                var dirService = C["@mozilla.org/file/directory_service;1"].getService(I.nsIProperties);
                var curProcDir = dirService.get("PrefD", I.nsIFile);

                fp = curProcDir.clone().QueryInterface(I.nsILocalFile);
                fp.append('protos');
                if(!fp.exists()) {
                    fp.create(I.nsIFile.DIRECTORY_TYPE, 0700);
                }
            }
            return fp;
        },

        getAutosaveFilepath: function(suffix) {
            var fp = xulapp.getAutosaveDir();
            var fname = cW.geierlein.getTaxcaseIdentifier();

            function pad(n) {
                return ("0" + n).substr(-2);
            }

            var d = new Date();
            fname += "_" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
            fname += "_" + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());

            if(suffix !== undefined) {
                fname += suffix;
            }

            fp.append(fname);
            return fp;
        },

        resetForm: function() {
            if(modalAskSaveChanges()) {
                return; /* User asked to cancel. */
            }

            cW.geierlein.resetForm();
            filePath = undefined;
            fileChanged = false;
        },

        openPrefWindow: function() {
            var features = "chrome,titlebar,toolbar,centerscreen,dialog=yes";
            window.openDialog('chrome://geierlein/content/pref/pref.xul', "Einstellungen", features, xulapp);
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

            var channel = NetUtil.newChannel(loadFilePath);
            channel.contentType = 'text/xml';
            channel.contentCharset = 'UTF-8';

            NetUtil.asyncFetch(channel, function(inStream, status) {
                if(!Components.isSuccessCode(status)) {
                    alert('Beim Lesen der Datei ist ein Fehler aufgetreten!');
                    return;
                }

                var data = NetUtil.readInputStreamToString(inStream,
                    inStream.available(), { charset: 'UTF-8' });

                if(cW.geierlein.unserialize(data)) {
                    filePath = loadFilePath;
                    fileChanged = false;
                } else {
                    alert('Das Format der Datei ist fehlerhaft.  ' +
                        'Die Datei kann nicht geöffnet werden');
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
            return cW.geierlein.startSendData(asTestcase);
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
