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

var prefMain = (function() {
    const C = Components.classes;
    const I = Components.interfaces;
    var xulapp = window.arguments[0];

    return {
        chooseFolder: function() {
            var fp = C["@mozilla.org/filepicker;1"].createInstance(I.nsIFilePicker);
            fp.init(window, "Verzeichnis wählen", I.nsIFilePicker.modeGetFolder);
            fp.appendFilters(I.nsIFilePicker.filterAll);
            fp.displayDirectory = xulapp.getAutosaveDir();

            if(fp.show() == I.nsIFilePicker.returnOK) {
                var file = fp.file.QueryInterface(I.nsILocalFile);
                var autosaveDirPref = document.getElementById("geierlein.autosave.dir");
                autosaveDirPref.value = file;
            }
        },

        displayAutosaveDir: function() {
            var autosaveFolder = document.getElementById("autosaveFolder");
            fp = xulapp.getAutosaveDir();
            autosaveFolder.file = fp;
            autosaveFolder.label = fp.path;
        }
    };
})();
