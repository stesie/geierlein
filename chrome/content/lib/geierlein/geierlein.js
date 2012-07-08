/**
 * Node.js module for Geierlein.
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
var geierlein = {
    crypto: require('./crypto.js'),
    Datenlieferant: require('./datenlieferant.js'),
    Signer: require('./signer.js'),
    Steuerfall: require('./steuerfall.js'),
    taxnumber: require('./taxnumber.js'),
    transfer: require('./transfer.js'),
    UStVA: require('./ustva.js'),
    util: require('./util.js'),
    validation: require('./validation.js')
};

module.exports = geierlein;
