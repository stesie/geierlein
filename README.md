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
This file merely discusses installation and use of the Electron-based
graphical desktop application.  For others consult the wiki pages
hosted on Github.

As the Geierlein desktop application is based on Electron, you need
to have that installed.

If you've unpacked Geierlein's ZIP-archive you simply need to run

    npm install
    ./node_modules/.bin/electron .


 License
----------

See COPYING file.
