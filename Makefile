prefix := /usr/local
bindir := $(prefix)/bin
datadir := $(prefix)/share
pixmapdir := $(datadir)/pixmaps
desktopfiledir := $(datadir)/applications
pkgdatadir := $(datadir)/geierlein

VERSIONMAJOR := 1
VERSIONMINOR := 0
VERSIONBUILD := 1
VERSION := $(VERSIONMAJOR).$(VERSIONMINOR).$(VERSIONBUILD)
INSTALL := /usr/bin/install -c
INSTALL_DATA := $(INSTALL) -m 644


version_files := \
	Makefile \
	chrome/content/lib/geierlein/steuerfall.js \
	package.json \
	tests/_files/ustsvza_datenteil_echt.xml \
	tests/_files/ustsvza_datenteil_test.xml \
	tests/_files/ustsvza_dauerfrist_datenteil_echt.xml \
	tests/_files/ustsvza_dauerfrist_datenteil_test.xml \
	tests/_files/ustva_datenteil_echt.xml \
	tests/_files/ustva_datenteil_test.xml

all:

autodist: dist
	cp Makefile Makefile.autodist
	$(MAKE) -f Makefile.autodist autodist-run
	rm -f Makefile.autodist
	git push
	git push --tags

autodist-run:
	git checkout gh-pages
	sed -e "s/geierlein\/archive\/V[0-9\.]\+\.zip/geierlein\/archive\/V$(VERSION).zip/" \
		-e "s/V[0-9\.]\+\/geierlein-[0-9\.]\+-installer.exe/V$(VERSION)\/geierlein-$(VERSION)-installer.exe/" \
		-i~ _layouts/default.html
	git commit _layouts/default.html -m "Update links to version $(VERSION)"
	git push
	git checkout master

bump-version: $(version_files)
	@if [ "$(NEW_VERSION)" = "" ]; then \
	  echo NEW_VERSION argument not provided.; \
	  echo Usage: make bump-version NEW_VERSION=1.0.1; \
	  exit 1; \
	fi
	(bump_version() { \
		sed -i~ Makefile -e "s/\(VERSIONMAJOR :=\) .*/\1 $$1/" \
			-e "s/\(VERSIONMINOR :=\) .*/\1 $$2/" \
			-e "s/\(VERSIONBUILD :=\) .*/\1 $$3/"; \
	}; IFS=.; version="$(NEW_VERSION)"; bump_version $$version; unset IFS;)
	sed -e 's;$(subst .,\.,$(VERSION));$(NEW_VERSION);g' -i~ $^
	git commit -m "Bump version to $(NEW_VERSION)" $^

.PHONY: all autodist autodist-run bump-version
