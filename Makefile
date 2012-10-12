prefix := /usr/local
bindir := $(prefix)/bin
datadir := $(prefix)/share
pixmapdir := $(datadir)/pixmaps
desktopfiledir := $(datadir)/applications
pkgdatadir := $(datadir)/geierlein

VERSIONMAJOR := 0
VERSIONMINOR := 4
VERSIONBUILD := 0
VERSION := $(VERSIONMAJOR).$(VERSIONMINOR).$(VERSIONBUILD)
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
	chrome/content/img/geierlein-logo-color-white.png \
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
	chrome/content/img/geierlein-logo-color-black.png \
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

xulapp_wininst := \
	$(xulapp_essentials) \
	logo.ico

version_files := \
	Makefile \
	application.ini \
	chrome/content/lib/geierlein/steuerfall.js \
	package.json \
	tests/_files/ustva_datenteil_echt.xml \
	tests/_files/ustva_datenteil_test.xml

all: bin/xgeierlein wininst.nsi

clean:
	rm -f bin/xgeierlein wininst.nsi

bin/xgeierlein: bin/xgeierlein.in Makefile
	sed -e "s;@pkgdatadir@;$(pkgdatadir);g" $< > $@
	chmod +x $@

wininst.nsi: wininst.nsi.in Makefile
	sed -e "s;@instfiles@;$(foreach file,$(xulapp_wininst),\n\tsetOutPath \$$INSTDIR\\\$(subst /,\\\,$(dir $(file))) \n\n\tFile $(subst /,\\\,$(file)));g" \
	    -e "s;@deletefiles@;$(subst /,\\\,$(foreach file,$(xulapp_wininst),\n\tDelete \$$INSTDIR\\\$(file)));g" \
	    -e "s;@VERSIONMAJOR@;$(VERSIONMAJOR);g" \
	    -e "s;@VERSIONMINOR@;$(VERSIONMINOR);g" \
	    -e "s;@VERSIONBUILD@;$(VERSIONBUILD);g" \
	    -e "s;@VERSION@;$(VERSION);g" \
	    -e "s;@INSTSIZE@;$(shell du --apparent-size --block-size=1024 --total $(xulapp_wininst) | awk 'END { print $$1 }');g" \
	    $< > $@

dist-nsis: wininst.nsi
	makensis $<

install: bin/xgeierlein
	for file in $(xulapp_essentials); do \
	  installdir="$${file%/*}"; \
	  $(INSTALL) -d "$(DESTDIR)$(pkgdatadir)/$$installdir"; \
	  $(INSTALL_DATA) -t "$(DESTDIR)$(pkgdatadir)/$$installdir" "$$file"; \
	done
	$(INSTALL) -d "$(DESTDIR)$(desktopfiledir)"
	$(INSTALL_DATA) -t "$(DESTDIR)$(desktopfiledir)" geierlein.desktop
	$(INSTALL) -d "$(DESTDIR)$(pixmapdir)"
	$(INSTALL_DATA) -t "$(DESTDIR)$(pixmapdir)" geierlein.png
	$(INSTALL) -d "$(DESTDIR)$(bindir)"
	$(INSTALL) -t "$(DESTDIR)$(bindir)" bin/xgeierlein

uninstall:
	rm -vrf $(DESTDIR)$(pkgdatadir)
	rm -vf $(DESTDIR)$(desktopfiledir)/geierlein.desktop
	rm -vf $(DESTDIR)$(pixmapdir)/geierlein.png
	rm -vf $(DESTDIR)$(bindir)/bin/xgeierlein

geierlein-$(VERSION).tar.gz:
	git archive-all --prefix geierlein-$(VERSION)/ geierlein-$(VERSION).tar.gz

geierlein-$(VERSION).zip:
	git archive-all --prefix geierlein-$(VERSION)/ geierlein-$(VERSION).zip

geierlein-$(VERSION).tar.xz: geierlein-$(VERSION).tar.gz
	gzip -cd $< | xz -ezcv > $@

dist: dist-nsis geierlein-$(VERSION).zip geierlein-$(VERSION).tar.xz
	git tag V$(VERSION)

test:
	npm test

test-forge:
	nodeunit chrome/content/lib/forge/tests/nodeunit

test-all: test-forge test

bump-version: $(version_files)
	@if [ "$(NEW_VERSION)" = "" ]; then \
	  echo NEW_VERSION argument not provided.; \
	  echo Usage: make update-version NEW_VERSION=0.4.0; \
	  exit 1; \
	fi
	sed -e 's;$(subst .,\.,$(VERSION));$(NEW_VERSION);g' -i $^

.PHONY: all clean dist install test test-forge test-all uninstall bump-version dist-nsis
