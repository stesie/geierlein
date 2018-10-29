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


 Project abandoned
---------------------

This project is now abandoned.

The reason for this is that the backend servers, which are used by
this project, will no longer be available from mid January 2019 on.

Quote from Oct 26, 2018 newsletter by German fiscal authorities
(Bayerisches Landesamt für Steuern):

> 3.) Abschaltung ElsterAnmeldung bei der offenen Schnittstelle zum Januar 2019
> ----------------------------------------------------------------------------------------------------------
> Sofern Sie ERiC für den Versand Ihrer Daten an ELSTER verwenden, ist dieser
> Abschnitt für Sie nicht relevant, da ERiC für den Versand von Daten bereits
> die korrekte Version verwendet.
> 
> Auf dem Herstellertreffen am 16. April 2018 wurde die Schließung der offenen
> Schnittstelle für die Datenarten
> - Lohnsteueranmeldung (LStA)
> - Umsatzsteuervoranmeldung (UStVA)
> bekanntgegeben.
> 
> Die offene Schnittstelle für UStVA und LStA soll demnach Mitte Januar 2019
> serverseitig deaktiviert werden.
> Sobald dies geschieht, werden alle Steuerfälle mit dem XML-Verfahren
> ElsterAnmeldung mit dem Fehlercode 600015007 abgewiesen




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
