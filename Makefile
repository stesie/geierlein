prefix := /usr/local
datadir := $(prefix)/share
pixmapdir := $(datadir)/pixmaps
desktopfiledir := $(datadir)/applications
pkgdatadir := $(datadir)/geierlein

VERSION := "0.3.0"
INSTALL := /usr/bin/install -c
INSTALL_DATA := $(INSTALL) -m 644

forge_essentials := \
	chrome/content/lib/forge/js/aes.js \
	chrome/content/lib/forge/js/debug.js \
	chrome/content/lib/forge/js/des.js \
	chrome/content/lib/forge/js/form.js \
	chrome/content/lib/forge/js/hmac.js \
	chrome/content/lib/forge/js/http.js \
	chrome/content/lib/forge/js/jsbn.js \
	chrome/content/lib/forge/js/log.js \
	chrome/content/lib/forge/js/md.js \
	chrome/content/lib/forge/js/md5.js \
	chrome/content/lib/forge/js/pbkdf2.js \
	chrome/content/lib/forge/js/prng.js \
	chrome/content/lib/forge/js/sha1.js \
	chrome/content/lib/forge/js/sha256.js \
	chrome/content/lib/forge/js/socket.js \
	chrome/content/lib/forge/js/task.js \
	chrome/content/lib/forge/js/tls.js \
	chrome/content/lib/forge/js/tlssocket.js \
	chrome/content/lib/forge/js/xhr.js \
	chrome/content/lib/forge/js/random.js \
	chrome/content/lib/forge/js/asn1.js \
	chrome/content/lib/forge/js/forge.js \
	chrome/content/lib/forge/js/mgf.js \
	chrome/content/lib/forge/js/mgf1.js \
	chrome/content/lib/forge/js/oids.js \
	chrome/content/lib/forge/js/pkcs12.js \
	chrome/content/lib/forge/js/pkcs7.js \
	chrome/content/lib/forge/js/pkcs7asn1.js \
	chrome/content/lib/forge/js/pki.js \
	chrome/content/lib/forge/js/pss.js \
	chrome/content/lib/forge/js/rc2.js \
	chrome/content/lib/forge/js/rsa.js \
	chrome/content/lib/forge/js/util.js

gzipjs_essentials := \
	chrome/content/lib/gzip-js/lib/crc32.js \
	chrome/content/lib/gzip-js/lib/gzip.js \
	chrome/content/lib/gzip-js/lib/rawdeflate.js \
	chrome/content/lib/gzip-js/lib/rawinflate.js

jsxml_essentials := \
	chrome/content/lib/jsxml/jsxml.js

xmlwriter_essentials := \
	chrome/content/lib/xmlwriter.js

geierlein_essentials := \
	$(forge_essentials) \
	$(gzipjs_essentials) \
	$(jsxml_essentials) \
	$(xmlwriter_essentials) \
	chrome/content/lib/geierlein/crypto.js \
	chrome/content/lib/geierlein/datenlieferant.js \
	chrome/content/lib/geierlein/geierlein.js \
	chrome/content/lib/geierlein/signer.js \
	chrome/content/lib/geierlein/steuerfall.js \
	chrome/content/lib/geierlein/taxnumber.js \
	chrome/content/lib/geierlein/transfer.js \
	chrome/content/lib/geierlein/ustva.js \
	chrome/content/lib/geierlein/util.js \
	chrome/content/lib/geierlein/validation.js \
	chrome/content/css/bootstrap.min.css \
	chrome/content/css/geierlein.css \
	chrome/content/img/glyphicons-halflings-white.png \
	chrome/content/img/glyphicons-halflings.png \
	chrome/content/img/taxbird-logo-1.jpg \
	chrome/content/index.html \
	chrome/content/js/bootstrap.min.js \
	chrome/content/js/geierlein.js \
	chrome/content/js/jquery-1.7.2.min.js \
	chrome/content/js/jquery.input.multiply.js \
	chrome/content/js/jquery.input.totalize.js \
	chrome/content/xsl/ustva.xsl

xulapp_essentials := \
	$(geierlein_essentials) \
	chrome/content/css/xulapp.css \
	chrome/content/img/toolbar-convert.png \
	chrome/content/img/toolbar-new.png \
	chrome/content/img/toolbar-open.png \
	chrome/content/img/toolbar-save.png \
	chrome/content/js/xulapp.js \
	chrome/content/main.xul \
	chrome/content/pref/main.js \
	chrome/content/pref/main.xul \
	chrome/content/pref/pref.xul \
	chrome/locale/branding/brand.dtd \
	chrome/locale/branding/brand.properties \
	chrome/chrome.manifest \
	defaults/preferences/prefs.js \
	./chrome.manifest \
	./application.ini

all: geierlein.desktop

clean:
	rm -f geierlein.desktop

geierlein.desktop: geierlein.desktop.in
	sed -e "s;@pkgdatadir@;$(pkgdatadir);g" $< > $@

install: geierlein.desktop
	for file in $(xulapp_essentials); do \
	  installdir="$${file%/*}"; \
	  $(INSTALL) -d $(DESTDIR)$(pkgdatadir)/$$installdir; \
	  $(INSTALL_DATA) -t $(DESTDIR)$(pkgdatadir)/$$installdir $$file; \
	done
	$(INSTALL_DATA) -t $(DESTDIR)$(desktopfiledir) geierlein.desktop
	$(INSTALL_DATA) -t $(DESTDIR)$(pixmapdir) geierlein.xpm

dist:
	git archive-all --prefix geierlein-$(VERSION)/ geierlein-$(VERSION).tar.gz
	git archive-all --prefix geierlein-$(VERSION)/ geierlein-$(VERSION).zip

test:
	npm test

test-forge:
	nodeunit chrome/content/lib/forge/tests/nodeunit

test-all: test-forge test

.PHONY: all clean dist install test test-forge test-all
