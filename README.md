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


 Frequently Asked Questions
-------------------------------

Q: Firefox/XUL-Runner complains about incompatible platform versions:

    Error: Platform version '20.0a1' is not compatible with
    minVersion >= 3.5
    maxVersion <= 16.*

Due to the error message Geierlein does not start (any longer).

A: Geierlein is _not_ incompatible to the Firefox/XUL-Runner version
you use, as stated in the error message.  It just has not been
tested against it (or you use an old version).

The maximum version number can easily be edited in the application.ini
file.  You can just bump it to whichever version of Firefox you use.
Simply keep in mind that you might come across incompatibilities due
to changed Firefox APIs.  In that case simply open an issue ticket at
GitHub.


 License
----------

See COPYING file.
