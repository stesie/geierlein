/**
 * Frontend logic for Geierlein HTML5 interface.
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

(function($, geierlein) {
    var DEFAULT_ADDRESS_DATA_SELECTOR = '.datenlieferant, #steuernummer, #land';
    var $svzjahr = $('#ustsvza-jahr');
    var $jahr = $('#jahr');
    var $zeitraum = $('#zeitraum');

    var datenlieferant, ustva;

    /*
     * private functions
     */


    /**
     * Print iframe by element ID.
     *
     * Requires printPage javascript function on the document loaded into
     * the iframe.  File ustva.xsl is extended accordingly.
     *
     * http://stackoverflow.com/questions/472951/how-do-i-print-an-iframe-from-javascript-in-safari-chrome
     *
     * @param id The iframe element's ID.
     */
    function printIframe(id) {
        var iframe = document.frames ? document.frames[id] : document.getElementById(id);
        var ifWin = iframe.contentWindow || iframe;
        ifWin.focus();
        ifWin.printPage();
        return false;
    }

    /**
     * Show the modal protocol dialog and display the provided protocol.
     *
     * The provided document is run through XSL processor before being
     * displayed.
     *
     * @param res The XML result document as a string.
     * @return void
     */
    function showProtocol(res) {
        var xslUrl = location.href.replace(/[^\/]+$/, '') + 'xsl/ustva.xsl';
        $.ajax({
            url: xslUrl,
            isLocal: xslUrl.substr(0, 7) === 'chrome:',
            success: function(xslDom) {
                var xmlDom = jsxml.fromString(res, false);
                var xslResult = jsxml.transReady(xmlDom, xslDom);
                $('body').trigger('show-protocol', res);
                $('#protocol-frame')[0].src = 'data:text/html;charset=UTF-8,' + encodeURIComponent(xslResult);
                $('#protocol').modal();
            }
        });
    }

    function updateModelHandler(el, model) {
        var kz = el.id.toLowerCase();
        var $cg = $(el).parents('.control-group');
        var value = el.value;

        if(el.type === 'checkbox' && !el.checked) {
            value = '';
        }

        if(value === '') {
            delete model[kz];
        } else {
            model[kz] = value.replace(',', '.');
        }

        if(model.validate(kz) === true) {
            $cg.removeClass('error');
        } else {
            $cg.addClass('error');
        }
    }

    /**
     * Handle send button event in signature control dialog.
     */
    function doSendFinal(ev) {
        var asTestcase = $('#warn-no-testcase').css('display') === 'none';

        if($('#sig-enable').prop('checked')) {
            /* send with signature */
            var pfx = $('#pfxfile')[0].files;
            var pincode = $('#pincode').val();

            if(pfx.length !== 1) {
                alert('Wenn die Datenübermittlung mit Signatur erfolgen soll, muss eine Datei gewählt werden, die das Software-Zertifikat enthält.');
                return false;
            }

            if(pincode === '') {
                alert('Um die Signatur erstellen zu können, wird der PIN-Code zum Software-Zertifikat benötigt.');
                return false;
            }

            $('#prepare-send').modal('hide');
            $('#wait').modal();

            var reader = new FileReader();
            reader.onload = function(ev) {
                var signer = new geierlein.Signer();
                try {
                    signer.setKeyFromPkcs12Der(ev.target.result, pincode);
                } catch(e) {
                    alert('Das Software-Zertifikat konnte nicht korrekt entschlüsselt werden.  Die Datei ist ungültig, bzw. der PIN-Code falsch.');
                    $('#wait').modal('hide');
                    return;
                }
                geierlein.sendData(asTestcase, signer);
            };
            reader.readAsBinaryString(pfx[0]);

        } else {
            /* transfer without signature */
            $('#prepare-send').modal('hide');
            geierlein.sendData(asTestcase, undefined);
        }

        return false;
    }

    /*
     * Public API
     */


    /**
     * Prepare submission of tax declaration, display signature control dialog
     *
     * @param asTestcase Whether to set test-marker in the declaration or not.
     * @return void
     */
    geierlein.startSendData = function(asTestcase) {
        if(ustva.validate() !== true) {
            alert('Das Formular enthält noch ungültige Feldwerte, ' +
                'Übertragung nicht möglich.');
            return;
        }

        $('#warn-no-testcase').toggle(!asTestcase);
        $('#prepare-send').modal();
    };

    /**
     * Submit the tax declaration and display protocol afterwards.
     *
     * @param asTestcase Whether to set test-marker in the declaration or not.
     * @param signer Geierlein signer context (undefined for no signature)
     * @return void
     */
    geierlein.sendData = function(asTestcase, signer) {
        $('body').trigger('send-taxcase', asTestcase);

        ustva.toEncryptedXml(asTestcase, signer, function(data, cb) {
            $('#wait').modal();
            geierlein.transfer(data, cb);
        }, function(res) {
            $('#wait').modal('hide');
            if(res === false) {
                alert('Bei der Datenübertragung ist ein Fehler aufgetreten.');
                return;
            }

            var status = res.match(/<Code>(.*?)<\/Code>\s*<Text>(.*?)<\/Text>/);
            if(+status[1] === 0) {
                showProtocol(res);
            } else {
                alert('Die Datenübertragung wurde vom Server abgebrochen:\n' +
                    status[2] + '\nFehlercode: ' + status[1]);
            }
        });
    };

    geierlein.isDatenlieferantValid = function() {
        return datenlieferant.validate() === true;
    };

    geierlein.getTaxcaseIdentifier = function() {
        var id = ustva.steuernummer.replace(/[^0-9]/g, '');
        /* add year & month */
        id += "_" + ustva.jahr + ("0" + ustva.zeitraum).substr(-2);
        if(ustva.kz10 == 1) {
            id += "_mod";
        }
        return id;
    };

    geierlein.resetForm = function() {
        $('form')[0].reset();

        /* Pre-select previous month and year. */
        var d = new Date();
        d.setMonth(d.getMonth() - 1);
        $jahr.val(d.getFullYear());
        $zeitraum.val(d.getMonth() + 1);
        $zeitraum.change();

        geierlein.loadDefaultAddressData();

        $('body').trigger('reset-form');

        if(location.hash === '#importLocalStorage') {
            var importData = prefstore.getCharPref('import');
            prefstore.setCharPref('import', '');
        }

        if(location.hash === '#importWindowName') {
            var importData = window.name;
            window.name = '';
        }

        if(importData !== undefined && importData !== '') {
            if(geierlein.unserialize(importData)) {
                var message = '<p><strong>Datenübernahme aus der Drittanwendung erfolgreich.</strong></p>' +
                    '<p>Die bereitgestellten Daten wurden in das Formular übernommen.</p>';
                var classes = 'alert-success';
            } else {
                var message = '<p><strong>Datenübernahme aus der Drittanwendung gescheitert.</strong></p>' +
                    '<p>Die bereitgestellten Daten konnten nicht verarbeitet werden, da diese fehlerhaft aufgebaut sind.</p>';
                var classes = 'alert-error';
            }

            $('<div class="alert">')
            .addClass(classes).html(message)
            .prepend('<button class="close" data-dismiss="alert">×</button>')
            .prependTo('#main');
        }

        /* Copy over all field data initially to consider browser's
         * auto-fill data, etc.pp
         */
        $('.datenlieferant, .ustva').change();
    };

    geierlein.serialize = function() {
        var res = '#\n# Adresse des Steuerpflichtigen\n#\n';
        $('.datenlieferant').each(function(i, el) {
            res += el.id + ' = ' + el.value + '\n';
        });

        res += '\n';
        $('.ustva').each(function(i, el) {
            var field = el.id;
            var help = $(el).data('original-title');

            if(field.substr(0, 2) === 'Kz') {
                field = 'k' + field.substr(1);
            }

            if(help !== '') {
                help = help.replace(/<br\/>Kennzahl im Formular: \d+/, '');
                res += '# ' + help + '\n';
            }

            if(el.type === 'checkbox' && !el.checked) {
                res += '# '; /* Comment out next line */
            }
            res += field + ' = ' + el.value + '\n\n';
        });

        return res;
    };

    /**
     * Unserialize data from "geierlein file format" into the form.
     *
     * @param data The file's content as a string.
     * @return <boolean> True if file was loaded successfully, false otherwise.
     */
    geierlein.unserialize = function(data) {
        try {
            data = geierlein.util.parseFile(data);
        } catch(e) {
            return false;
        }

        geierlein.resetForm();
        for(var key in data) {
            if(data.hasOwnProperty(key)) {
                /* The IDs of the input elements in the form start with
                 * an upper-case K.
                 */
                var newValue = data[key];

                if(key.substr(0, 2) === 'kz') {
                    key = 'K' + key.substr(1);
                }

                var $el = $('#' + key);

                if($el.prop('type') === 'checkbox') {
                    $el.prop('checked', $.trim(newValue) !== '0').change();
                } else if($el.length) {
                    $el.val(newValue).change();
                }
            }
        }

        return true;
    };

    geierlein.loadDefaultAddressData = function() {
        $(DEFAULT_ADDRESS_DATA_SELECTOR).each(function() {
            var $el = $(this);
            $el.val(prefstore.getCharPref('defaultAddress.' + this.id));
            $el.change();
        });
    };

    geierlein.storeDefaultAddressData = function() {
        this.blur();
        $(DEFAULT_ADDRESS_DATA_SELECTOR).each(function() {
            prefstore.setCharPref('defaultAddress.' + this.id, this.value);
        });
    };


    /* Initialize localStorage-based Prefstore, if not running
       in XUL-environment.  Otherwise use XUL-based storage. */
    if(typeof Components === 'undefined') {
        prefstore = new LocalStoragePrefstore('geierlein');

        if(prefstore.getCharPref('defaultAddress.land') === undefined) {
            prefstore.setCharPref('defaultAddress.land', '1');
        }
    } else {
        prefstore = new XulPrefstore('geierlein');
    }



    /*
     * Model handling.
     */
    (function() {
        /* Fill year drop-down, supported is 2011 until now. */
        var d = new Date();
        for(var year = d.getFullYear(); year >= 2011; year --) {
            $('<option>').text(year).appendTo($jahr);
            $('<option>').text(year).appendTo($svzjahr);
        }
    })();

    datenlieferant = new geierlein.Datenlieferant();
    ustva = new geierlein.UStVA(datenlieferant);

    /* Bind datenlieferant input fields to the model.  We bind change as
       well as keyup, so we are able to revalidate the form on every keystroke
       and still don't miss events in case our user copy & pastes the data. */
    $('.datenlieferant').on('change keyup', function(ev) {
        return updateModelHandler(this, datenlieferant);
    });

    /* Bind UStVA form fields to the corresponding model.  Like as for the
       datenlieferant fields we bind to both, change and keyup, events. */
    $('.ustva').on('change keyup', function(ev) {
        return updateModelHandler(this, ustva);
    });

    $('#land').on('change keyup', function(ev) {
        $('#steuernummer').attr('placeholder', ustva.getTaxNumberSample());
    });

    $('input[type="text"].ustva[id^="Kz"]').before(function() {
        var kz = this.id.substr(2);
        return '<span class="kz add-on">' + kz + '</span>';
    }).parent().addClass('input-prepend');

    geierlein.resetForm();

    if(geierlein.isDatenlieferantValid()) {
        $('#accordion-unternehmer').collapse();
    }

    $('#zeitraum').on('change', function(ev) {
      var selected = $('option:selected', this);
      var grouplabel = selected.parent().attr('label');
      $('label[for="'+this.id+'"]').text(grouplabel);
    });

    /*
     * Further event listeners needed to make the GUI work.
     */

    /**
     * Show/hide rarely used elements, when fast entry checkbox is toggled.
     */
    $('#schnell').on('click', function(ev) {
        if($('#schnell').hasClass('active')) {
            $('.schnell').hide('slow');
        } else {
            $('.schnell').show('slow');
        }

        ev.preventDefault();
    });

    /**
     * Send button, click event.
     */
    $('#send').on('click', function(ev) {
        geierlein.startSendData(false);
        return false;
    });

    /**
     * Send-as-testcase button, click event.
     */
    $('#send-testcase').on('click', function(ev) {
        geierlein.startSendData(true);
        return false;
    });

    /**
     * "signature enable" checkbox, click event
     */
    $('#sig-enable').on('click', function(ev) {
        $('.sig-controls').prop('disabled', !$('#sig-enable').prop('checked'));
    });

    /**
     * Trigger send final on return keypress in signature control dialog.
     */
    $('#pincode').on('keypress', function(ev) {
        if(ev.which == 13) {
            doSendFinal();
            return false;
        }
    });

    /**
     * Send button of signature control dialog, click event
     */
    $('#send-final').on('click', doSendFinal);

    /**
     * Initialize tooltips on all input elements.
     */
    $('.ustva').tooltip({
        container: 'body'
    });

    /**
     * Trigger browser's print functionality when print-button is clicked in
     * protocol dialog.
     */
    $('#protocol-print').click(function() {
        printIframe('protocol-frame');
    });

    /**
     * Form import/export handling.
     */
    $('#form-import').click(function(ev) {
        $('#file-select').click();
        ev.preventDefault();
    });

    $('#file-select').change(function(ev) {
        var reader = new FileReader();
        reader.onload = function(data) {
            if(!geierlein.unserialize(data.target.result)) {
                alert('Das Format der Datei ist fehlerhaft.  ' +
                    'Die Datei kann nicht importiert werden');
            }
        };
        reader.readAsText(this.files[0]);
    });

    $('#form-export').click(function(ev) {
        ev.preventDefault();

        var blob = new Blob([geierlein.serialize()], {
            type: 'application/x-geierlein; charset=utf-8'
        });
        saveAs(blob, "Geierlein-UStVA-" + ustva.jahr + ("0" + ustva.zeitraum).substr(-2));
    });


    /**
     * Bind store defaults button.
     */
    $('#store-defaults').click(geierlein.storeDefaultAddressData);


    /**
     * Bind "Dauerfristverlängerung" events.
     */
    $('#form-ustsvza').click(function(ev) {
        ev.preventDefault();

        if(!geierlein.isDatenlieferantValid()) {
            alert('Zur Abgabe einer Dauerfristverlängerung muss vorab der Bereich "Unternehmer" korrekt ausgefüllt werden.');
            return;
        }

        $('#ustsvza').modal();
    });

    $('#ustsvza-rhythmus').change(function(ev) {
        var elname = '#ustsvza-svz-' + $('#ustsvza-rhythmus').val();
        $('.ustsvza-svz').not(elname).hide();
        $(elname).show();
    });

    $('#ustsvza-vjsum').on('change keyup', function(ev) {
        var vjsum = +$('#ustsvza-vjsum').val();

        if(isNaN(vjsum)) {
            $('#Kz38').val('');
        }
        else {
            $('#Kz38').val(Math.max(0, Math.floor(vjsum / 11)));
        }
    });

}(jQuery, geierlein));
