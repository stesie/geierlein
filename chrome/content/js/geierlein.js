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

    /**
     * Print iframe by element ID.
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

    function showProtocol(res) {
        /* Add XSL reference to XML document. */
        var xslUrl = location.href.replace(/[^\/]+$/, 'xsl/ustva.xsl');
        res = geierlein.util.addStylesheetHref(res, xslUrl);

        $('#protocol-frame')[0].src = 'data:text/xml;charset=ISO8859-1,' + escape(res);
        $('#protocol').modal();
    }

    $('#protocol-print').click(function() {
        printIframe('protocol-frame');
    });

    var $jahr = $('#jahr');
    var $monat = $('#monat');
    var d = new Date();

    /* Fill year drop-down, supported is 2011 until now. */
    for(var year = d.getFullYear(); year >= 2011; year --) {
        $('<option>').text(year).appendTo($jahr);
    }

    /* Pre-select previous month and year. */
    d.setMonth(d.getMonth() - 1);
    $jahr.val(d.getFullYear());
    $monat.val(d.getMonth() + 1);

    var datenlieferant = new geierlein.Datenlieferant();
    var ustva = new geierlein.UStVA(datenlieferant, $jahr.val(), $monat.val());

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

        if(this.value === '') {
            delete ustva[kz];
        } else {
            ustva[kz] = this.value.replace(',', '.');
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

    $('#schnell').on('click', function(ev) {
        if($('#schnell').prop('checked')) {
            $('.schnell').hide('slow');
        } else {
            $('.schnell').show('slow');
        }
    });

    $('#send-testcase').on('click', function(ev) {
        ustva.toEncryptedXml(true, geierlein.transfer, function(res) {
            showProtocol(res);
        });
        return false;
    });

    $('.ustva').tooltip();
}(jQuery, geierlein));
