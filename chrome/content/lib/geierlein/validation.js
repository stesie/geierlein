/**
 * Form validation module for Geierlein.
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

(function() {
var geierlein = {};
if(typeof(window) !== 'undefined') {
    geierlein = window.geierlein = window.geierlein || {};
}
else if(typeof(module) !== 'undefined' && module.exports) {
    geierlein = {
        taxnumber: require('./taxnumber.js'),
        util: require('./util.js')
    };
}

geierlein.validation = {};

geierlein.validation.rules = {
    required: function(val) {
        return val !== undefined;
    },
    
    range: function(min, max) {
        return function(val) {
            if(val === undefined) {
                return true;  // ruleRange accepts undefined as valid!
            }
    
            val = parseInt(val, 10);
            return val >= min && val <= max;
        };
    },
    
    option: function(val) {
        return val === undefined || parseInt(val, 10) === 1;
    },
    
    signedInt: function(val) {
        return val === undefined || parseInt(val, 10) === +val;
    },
    
    unsignedInt: function(val) {
        return val === undefined ||
            (geierlein.validation.rules.signedInt(val) &&
                parseInt(val, 10) >= 0);
    },
    
    signedMonetary: function(val) {
        return val === undefined || (+val == parseFloat(val).toFixed(2));
    },
    
    unsignedMonetary: function(val) {
        return val === undefined || (+val >= 0 && +val == parseFloat(val).toFixed(2));
    },
    
    lessThan: function(otherKz) {
        return function(val) {
            if(val === undefined) {
                return true;
            }
            if(this[otherKz] === undefined) {
                return false;
            }
            return parseFloat(val) < parseFloat(this[otherKz]);
        };
    },
    
    maxLength: function(maxLen) {
        return function(val) {
            if(val === undefined) {
                return true;
            }
            return typeof(val) === 'string' && val.length <= maxLen;
        };
    },
    
    kz83: function(val) {
        var expect = this.calculateKz83();
        var delta = Math.abs(+val - expect);
        return delta < 1;
    },
    
    taxNumber: function(val) {
        if(val === undefined) {
            return true;
        }
        if(this.land === undefined) {
            return false;
        }
    
        var rule = geierlein.taxnumber.rules[this.land - 1].groups;
        var pieces = val.split(/[\/ ]/);
    
        if(pieces.length !== rule.length) {
            return false;   // wrong number of pieces
        }
    
        for(var i = 0; i < pieces.length; i ++) {
            if(pieces[i].length !== rule[i]) {
                return false;   // length mismatch
            }
        }
    
        return true;
    }
};

geierlein.validation.validate = function(ruleset, field) {
    var errors = [];
    var rules = {};

    if(field === undefined) {
        rules = ruleset;
    } else {
        rules[field] = ruleset[field];
    }

    for(var fieldName in rules) {
        if(rules.hasOwnProperty(fieldName)) {
            var rule = rules[fieldName];
            for(var i = 0, max = rule.length; i < max; i ++) {
                if(rule[i] === undefined) {
                    console.dir(rule);
                    console.dir(this);
                }
                if(!rule[i].call(this, this[fieldName])) {
                    errors.push(fieldName);
                }
            }
        }
    }

    return errors.length ? errors : true;
};

if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = geierlein.validation;
}

})();
