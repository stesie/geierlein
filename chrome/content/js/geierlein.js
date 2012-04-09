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
    var datenlieferant = new geierlein.Datenlieferant();
    var ustva = new geierlein.UStVA(datenlieferant);

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
    });
}(jQuery, geierlein));
