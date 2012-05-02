/**
 * Frontend logic for Geierlein HTML5 interface.
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

(function($, geierlein) {
    var $jahr = $('#jahr');
    var $monat = $('#monat');

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
     * A reference to the XSL file needed to display the protocol is
     * added automatically.
     *
     * @param res The XML result document as a string.
     * @return void
     */
    function showProtocol(res) {
        /* Add XSL reference to XML document. */
        var xslUrl = location.href.replace(/[^\/]+$/, 'xsl/ustva.xsl');
        res = geierlein.util.addStylesheetHref(res, xslUrl);

        $('#protocol-frame')[0].src = 'data:text/xml;charset=ISO8859-1,' + escape(res);
        $('#protocol').modal();
    }

    /**
     * Submit the tax declaration and display protocol afterwards.
     *
     * @param asTestcase Whether to set test-marker in the declaration or not.
     * @return void
     */
    geierlein.sendData = function(asTestcase) {
        if(!asTestcase && !confirm('Die Daten werden als Echtfall an die Finanzverwaltung übergeben\n' +
            'Bist du sicher?')) {
            return;
        }

        ustva.toEncryptedXml(asTestcase, function(data, cb) {
            $('#wait').modal();
            geierlein.transfer(data, cb);
        }, function(res) {
            $('#wait').modal('hide');
            if(res === false) {
                alert('Bei der Datenübertragung ist ein Fehler aufgetreten.');
                return;
            }
            showProtocol(res);
        });
    };


    /*
     * Public API
     */
    geierlein.resetForm = function() {
        $('form')[0].reset();

        /* Pre-select previous month and year. */
        var d = new Date();
        d.setMonth(d.getMonth() - 1);
        $jahr.val(d.getFullYear());
        $monat.val(d.getMonth() + 1);
        
        /* Copy over all field data initially to consider browser's
         * auto-fill data, etc.pp
         */
        $('.datenlieferant, .ustva').change();
    };


    /*
     * Model handling.
     */

    (function() {
        /* Fill year drop-down, supported is 2011 until now. */
        var d = new Date();
        for(var year = d.getFullYear(); year >= 2011; year --) {
            $('<option>').text(year).appendTo($jahr);
        }
    })();

    datenlieferant = new geierlein.Datenlieferant();
    ustva = new geierlein.UStVA(datenlieferant);

    /* Bind datenlieferant input fields to the model. */
    $('.datenlieferant').on('change', function(ev) {
        datenlieferant[this.id.toLowerCase()] = this.value;
    });

    /* Bind UStVA form fields to the corresponding model.  We bind change as
       well as keyup, so we are able to revalidate the form on every keystroke
       but don't miss events in case our user copy & pastes the data. */
    $('.ustva').on('change keyup', function(ev) {
        var kz = this.id.toLowerCase();
        var $cg = $(this).parents('.control-group');
        var value = this.value;

        if(this.type === 'checkbox' && !this.checked) {
            value = '';
        }

        if(value === '') {
            delete ustva[kz];
        } else {
            ustva[kz] = value.replace(',', '.');
        }

        if(ustva.validate(kz) === true) {
            $cg.removeClass('error');
        } else {
            $cg.addClass('error');
        }

        if(kz === 'land') {
            $('#steuernummer').attr('placeholder', ustva.getTaxNumberSample());
        }
    });

    geierlein.resetForm();



    /*
     * Further event listeners needed to make the GUI work.
     */

    /**
     * Show/hide rarely used elements, when fast entry checkbox is toggled.
     */
    $('#schnell').on('click', function(ev) {
        if($('#schnell').prop('checked')) {
            $('.schnell').hide('slow');
        } else {
            $('.schnell').show('slow');
        }
    });

    /**
     * Send button, click event.
     */
    $('#send').on('click', function(ev) {
        geierlein.sendData(false);
        return false;
    });

    /**
     * Send-as-testcase button, click event.
     */
    $('#send-testcase').on('click', function(ev) {
        geierlein.sendData(true);
        return false;
    });

    /**
     * Initialize tooltips on all input elements.
     */
    $('.ustva').tooltip();

    /**
     * Trigger browser's print functionality when print-button is clicked in
     * protocol dialog.
     */
    $('#protocol-print').click(function() {
        printIframe('protocol-frame');
    });
}(jQuery, geierlein));
