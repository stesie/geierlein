/**
 * jQuery Plugin totalizing values of a set of fields.
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

(function($) {
    $.fn.inputTotalize = function() {
        return this.each(function() {
            var i = new $.inputTotalize(this);
        });
    };

    jQuery.inputTotalize = function(el) {
        var $el = $(el);
        var fields = [];
        $.each($el.data('totalize-fields').split(' '), function(i, fieldName) {
            var f;
            if(fieldName.charAt(0) === '-') {
                f = $('#' + fieldName.substr(1))[0];
                f.sign = -1;
            } else {
                f = $('#' + fieldName)[0];
                f.sign = 1;
            }
            fields.push(f);
        });
        $(fields).on("change keyup", function() {
            //console.log('[totalize] change detected.');
            var total = 0;
            $.each(fields, function(i, f) {
                var val = parseFloat(f.value.replace(',', '.'));
                if(isNaN(val)) {
                    val = 0;
                }
                total += val * f.sign;
            });
            $el.val(total.toFixed(2).replace('.', ','));
            $el.change();

        });
    };
}(jQuery));

jQuery('.totalize').inputTotalize();
