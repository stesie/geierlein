/**
 * Node.js transfer module for Geierlein.
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

(function() {

var clientKey = 
    '-----BEGIN ENCRYPTED PRIVATE KEY-----\n' +
    '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\n' +
    'YHI=\n' +
    '-----END ENCRYPTED PRIVATE KEY-----\n';

var clientCert = 
    '-----BEGIN CERTIFICATE-----\n' +
    'MIID/zCCAuegAwIBAgIIPLSvBsPYoLQwDQYJKoZIhvcNAQELBQAwaDElMCMGA1UE\n' +
    'AwwcRWxzdGVyLUJldHJpZWIgVExTIENMSUVOVCBDQTEPMA0GA1UECwwGRWxzdGVy\n' +
    'MRAwDgYDVQQKDAdCYXlMZlN0MQ8wDQYDVQQIDAZCYXllcm4xCzAJBgNVBAYTAkRF\n' +
    'MB4XDTE3MDgzMTE0NDEzM1oXDTE5MDgzMTE0NDEzM1owgZ8xPDA6BgkqhkiG9w0B\n' +
    'CQEWLWVsc3RlcmJhc2lzLWVkYWtvLXByb2R1a3RtYW5hZ2VtZW50QGVsc3Rlci5k\n' +
    'ZTEjMCEGA1UEAwwaZWxzdGVyLW9mZmVuZXNjaG5pdHRzdGVsbGUxHDAaBgNVBAsM\n' +
    'E29mZmVuZVNjaG5pdHRzdGVsbGUxDzANBgNVBAoMBkVMU1RFUjELMAkGA1UEBhMC\n' +
    'REUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCU7Ex5z0J6tLW2ivDa\n' +
    'QqWxydHNiNTjiAodlVw4Cd73kzH44QAHwCI6A9O9IBqfSn3pvQ3h4yi66JM2aMr3\n' +
    'F7RFp4wxIlhY+YKpNrz/jumHcZw8I6OLopeQMRNUte22mzVgYv3OlTLCQLRfLQw6\n' +
    'OUzuirntUpOXzbF+U2GQ5ggB9sErxkhVGkwDm1iZ6tuLhX0DsLCLHMA+RNg0rra2\n' +
    '/olildllff+CuACL3Kowc0+upUkkAeaH5ODHP2dgqAUayCtsrALVBVrpBvhVYB3E\n' +
    'pAvgKA07SU/oHZo1h95fZiMk8Eqta257gMb+/KVOT9ENh6+2l6kBOFdVWn7wqR4b\n' +
    'pFR7AgMBAAGjdTBzMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAU668YxL1k39ae\n' +
    'QizWipygfhxyaLAwEwYDVR0lBAwwCgYIKwYBBQUHAwIwHQYDVR0OBBYEFL3CBX4n\n' +
    'ORP7LIiIOIINLwKFZApxMA4GA1UdDwEB/wQEAwIF4DANBgkqhkiG9w0BAQsFAAOC\n' +
    'AQEAZDtlbgcGhOvjDO4mgMGDYoZc9bTT0cdygeRnvI2woUDESJFjhhhbwL+irNkn\n' +
    'WJ6GLoDqzMT9YjWXMg7+5MLT3Y3Ta8T6NgnmFU1qH11jA4R7Ac9ozA4zhlMHYkcc\n' +
    'zGdGFiIndPPJm0jbqykKUTqHGkAhtu9gtGNxdklCZ0Oo3u1zuO+S13m17ryKHmUO\n' +
    '0NhIocbnG5oLUJeyxUTqc4EYzNHS4gzd54Lh40nzKJsBVep0sQLxH6hMTR/l/0Rs\n' +
    'oLnHKuHyFMPDSOBHZa6XBfe180mflbBPg3W7NrxGDROYTmvY+h2eB5PXvQYwH7+w\n' +
    '+mE5tljAyuLG9uu8vw+UbbSzhQ==\n' +
    '-----END CERTIFICATE-----\n';

var hostNames = [
    'datenannahme1.elster.de',
    'datenannahme2.elster.de',
    'datenannahme3.elster.de',
    'datenannahme4.elster.de'
];

function getRandomHost() {
    var i = Math.floor(Math.random() * hostNames.length);
    return hostNames[i];
}

var geierlein = {};

if(typeof(window) !== 'undefined') {
    geierlein = window.geierlein = window.geierlein || {};

    geierlein.transferDirect = function(encData, callback) {
        var targetUrl = 'http://' + getRandomHost() +
            '/Elster2/EMS/ElsterAnmeldung';

        var http = require('https');
        var ipaddr = getRandomHost();
        var post_options = {
            host: ipaddr,
            port: 443,
            path: '/Elster2/EMS/ElsterAnmeldung',
            method: 'POST',
            key: clientKey,
            cert: clientCert,
            passphrase: 'fcacc8c19458068c',
            headers: {
                'Content-Type': 'text/xml',
                'Content-Length': encData.length
            }
        };

        var post_request = http.request(post_options, function(res) {
            console.log('request resolved', res);
            if(res.statusCode != 200) {
                callback(false);
                return;
            }

            var buf = new Buffer(parseInt(res.headers['content-length'], 10));
            var ptr = 0;

            /* Receive chunks and add them to the Buffer object. */
            res.on('data', function(chunk) {
                chunk.copy(buf, ptr);
                ptr += chunk.length;
            });

            res.on('end', function() {
                var resData = buf.toString('utf8');
                callback(geierlein.util.rewriteEncoding(resData, 'UTF-8'));
            });
        });

        post_request.write(encData);
        post_request.end();
    };

    geierlein.transferReverseProxy = function(encData, callback) {
        _doXhr('proxy/Elster2/EMS/ElsterAnmeldung', encData, callback);
    };

    geierlein.transfer = geierlein.transferReverseProxy;

    function _doXhr(targetUrl, encData, callback) {
        $.ajax(targetUrl, {
            type: 'POST',
            data: encData,
            dataType: 'text',   // jQuery should not process the result itself
            contentType: 'text/xml',
            error: function(xhr, status, err) {
                callback(false);
            },
            success: function(data, status, xhr) {
                /* Rewrite encoding from ISO8859-1 (as specified in the XML)
                   to UTF-8, since the XHR already converted it for us. */
                callback(geierlein.util.rewriteEncoding(data, 'UTF-8'));
            }
        });
    };
}
// define node.js module
else if(typeof(module) !== 'undefined' && module.exports) {
    geierlein = {
        util: require('./util.js')
    };

    var Iconv = require('iconv').Iconv;

    module.exports = function(encData, callback) {
        var http = require('http');
        var ipaddr = getRandomHost();
        var post_options = {
            host: ipaddr,
            port: '80',
            path: '/Elster2/EMS/ElsterAnmeldung',
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml',
                'Content-Length': encData.length
            }
        };

        var post_request = http.request(post_options, function(res) {
            if(res.statusCode != 200) {
                callback(false);
                return;
            }

            var buf = new Buffer(parseInt(res.headers['content-length'], 10));
            var ptr = 0;

            /* Receive chunks and add them to the Buffer object. */
            res.on('data', function(chunk) {
                chunk.copy(buf, ptr);
                ptr += chunk.length;
            });

            /* Convert buffer from ISO8859-1 to UTF-8 to conveniently
               handle it in Node.js. */
            res.on('end', function() {
                var iconv = new Iconv('ISO8859-1', 'UTF-8');
                var resData = iconv.convert(buf).toString('utf8');
                callback(geierlein.util.rewriteEncoding(resData, 'UTF-8'));
            });
        });

        post_request.write(encData);
        post_request.end();
    };
}

})();
