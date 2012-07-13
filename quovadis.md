---
layout: default
title: COALA - quo vadis?
---

COALA - quo vadis?
-------------------

Ganz generell gibt es zwei Schnittstellen über die Steuerdaten an die
Finanzverwaltung übermittelt werden können: ERiC und COALA.

ERiC hat den Vorteil, dass alle Arten von Steuererklärungen und -anmeldungen
übermittelt werden können. Also sowohl z.B. Umsatzsteuervoranmeldung als auch
Jahreserklärungen (insbesondere auch Einkommensteuer). Der Nachteil von ERiC
ist jedoch, dass es sich nicht um freie Software handelt, sondern um einen
Haufen Binärcode, dem man vetrauen muss (oder nicht).

Mit COALA können momentan nur Umsatzsteuer- und Lohnsteuer*anmeldungen*
übermittelt werden. Keine Jahreserklärungen. COALA ist zunächst ein Haufen
Java-Binärkram, der ebenfalls keine freie Software darstellt. Dahinter steckt
jedoch eine XML-Schnittstelle, die wohldokumentiert ist. Und im Gegensatz zu
ERiC ist es auch zulässig, hier eigene Anbindungen zu schaffen. Das ist auch
genau der Ansatz, den ich mit dem Taxbird-Projekt verfolge.

Sowohl die “alte” C-Bibliothek libgeier als auch das neue Geierlein stellen
alternative Implementierungen ebendieser Java-Klassensammlung COALA dar.

Zu Beginn des Taxbird-Projekts (also 2004/2005) sah es noch so aus, bzw. so war
die Verlautbarung des Bayerischen Landesamts für Steuern (the artist formely
known as Oberfinanzdirektion München), dass mehr und mehr Services über die
COALA-Schnittstelle angeboten werden sollen. Nicht zuletzt deswegen habe ich
damals auch Taxbird gestartet, um bereits mit der Umsatzsteuervoranmeldung
Erfahrungen zu sammeln, ehe es dann endlich soweit ist, dass
Einkommensteuererklärungen übermittelbar sein würden.

Leider kam es dazu bis heute nicht. Die Begründung, warum nur die Übermittlung
von Steueranmeldungen und ein paar anderen Sachen denkbar ist, kann man sich
[auf dieser ELSTER-Seite](https://www.elster.de/ent_anforderungen.php]) auf der
Zunge zergehen lassen:

> Grund dafür ist, dass hier geeignete serverseitige Plausibilitätsprüfungen
> zur Verfügung stehen.

… heißt, dass sie bspw. Einkommensteuererklärungen nur clientseitig (in der
ERiC-Bibliothek) überprüfen und die Serverseite einfach treudoof alles annimmt
und verarbeitet, was ihr vorgeworfen wird.

Generell ist eine serverseitige Validierung immer ratsam, das weiß jeder der
schon eine Client-Server-Software entwickelt hat (sollte zumindest).  Bleibt
abzuwarten ob Elster das irgendwann auch kann, und vielleicht bekommen wir dann
auch endlich die erste freie Software zur Übermittlung von
Einkommensteuererklärungen  :-)

Umgekehrt habe ich auch ab und an Zweifel ob COALA nicht, zu Gunsten von ERiC,
komplett wieder eingestampft wird.  Dagegen spricht jedoch, dass in jüngerer
Zeit die Arbeitgeber-Schnittstelle (Stichwort elektronische Lohnsteuerkarte)
hierüber verfügbar gemacht wurde.
