VERSION := $(shell (echo 'a = '; cat package.json; echo '; console.log(a.version);') | node)

all:

dist:
	git archive-all --prefix geierlein-$(VERSION)/ geierlein-$(VERSION).tar.gz
	git archive-all --prefix geierlein-$(VERSION)/ geierlein-$(VERSION).zip

test:
	npm test

test-forge:
	nodeunit chrome/content/lib/forge/tests/nodeunit

test-all: test-forge test

.PHONY: all dist test test-forge test-all
