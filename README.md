 Geierlein
============

by Stefan Siegl

Geierlein is a free (AGPL'ed) Elster client, i.e. an application that
allows to send VAT declarations to Germany's fiscal authorities.

It's a complete rewrite of its predecessors libgeier & Taxbird.
Opposed to these it's completely written in JavaScript and HTML5,
hence it should be rather platform independent.  From this it also
follows that no compilation whatsoever is needed to get Geierlein to
run.

Currently it is *not* possible to send returns that are due annually
(especially the income tax return) since the fiscal authority doesn't
allow to do that off the ERiC library (which is proprietary however).
It's not clear at the moment whether one day it will be possible to
do so.


 Getting Started
-------------------

Geierlein can be used in varios ways, i.e. has multiple interfaces.
This file merely discusses installation and use of the Mozilla XUL-based
graphical desktop application.  For others consult the wiki pages
hosted on Github.

As the Geierlein desktop application is based on Mozilla XUL, you need
to have [Mozilla XUL-Runner](https://developer.mozilla.org/de/xulrunner)
installed.  Newer Mozilla Firefox versions (all from version 3 on) also
ship a XUL-Runner instance and hence are sufficient to run Geierlein.

If you've unpacked Geierlein's ZIP-archive and besides have a Firefox
installation around, you simply need to run

    firefox -app application.ini


If you'd like to use XUL-Runner instead of Firefox, you may omit the
_-app_ argument.

It's furthermore possible to specify a Geierline file to be opened
right on the command line.

    firefox -app application.ini -load pfad/zur/datei


 Runtime Dependencies
-------------------------------

Geierlein's source code is [available on
Github](https://github.com/stesie/geierlein).  If you'd like to use the
bleeding edge version from there, keep in mind that you need to fetch
the Git submodules in order to have a useable checkout:

    git clone git://github.com/stesie/geierlein.git
    git submodule init
    git submodule update

If you'd like to improve Geierlein, simply fork the project on Github,
incorporate your changes and initiate a pull request.


 License
----------

See LICENSE file.
