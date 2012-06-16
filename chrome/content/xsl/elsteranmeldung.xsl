<?xml version="1.0" encoding="UTF-8"?>
<!-- Version 2.0 -->
<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:elster="http://www.elster.de/2002/XMLSchema"
		exclude-result-prefixes="elster">

	<xsl:include href="steuernummer.xsl" />
	<xsl:include href="elsterbasis.xsl" />
	
	<!--Gemeinsame Elemente für die UStVA und LStA    -->
	<xsl:template name="Uebermittelt_von">
		<xsl:text>Übermittelt von:</xsl:text>
		<br />
		<small>
			<xsl:value-of select="elster:DatenTeil/elster:Nutzdatenblock/elster:Nutzdaten/elster:Anmeldungssteuern/elster:DatenLieferant/elster:Name" />
			<br />
			<xsl:value-of select="elster:DatenTeil/elster:Nutzdatenblock/elster:Nutzdaten/elster:Anmeldungssteuern/elster:DatenLieferant/elster:Strasse" />
			<br />
			<xsl:value-of select="elster:DatenTeil/elster:Nutzdatenblock/elster:Nutzdaten/elster:Anmeldungssteuern/elster:DatenLieferant/elster:PLZ" />
			<xsl:text>&#160;</xsl:text>
			<xsl:value-of select="elster:DatenTeil/elster:Nutzdatenblock/elster:Nutzdaten/elster:Anmeldungssteuern/elster:DatenLieferant/elster:Ort" />
			<br />
			<xsl:if test="elster:DatenTeil/elster:Nutzdatenblock/elster:Nutzdaten/elster:Anmeldungssteuern/elster:DatenLieferant/elster:Telefon">
				<xsl:value-of select="elster:DatenTeil/elster:Nutzdatenblock/elster:Nutzdaten/elster:Anmeldungssteuern/elster:DatenLieferant/elster:Telefon" />
				<br />
			</xsl:if>
			<xsl:value-of select="elster:DatenTeil/elster:Nutzdatenblock/elster:Nutzdaten/elster:Anmeldungssteuern/elster:DatenLieferant/elster:Email" />
			<br />
		</small>
	</xsl:template>

	<!-- 
    Schreibt die "Erstellt von" Zeile, falls Information angegeben wurde 
    
    Abhaengigkeiten:
    not(starts-with(normalize-space(substring-after(elster:Kz09,'*')),'*')) == true -bestimmt-die-Ausgabe-von-> Dem kompletten Template
    -->
	<xsl:template name="ErstelltVon">
		<xsl:if test="not(starts-with(normalize-space(substring-after(elster:Kz09,'*')),'*'))">
			<p>
				<small>
					<xsl:text>Erstellt von:</xsl:text>
				</small>

				<!-- Name Berater -->
				<small class="indent">
					<xsl:value-of select="substring-before(substring-after(elster:Kz09,'*'),'*')" />
				</small>

				<!-- Berufsbezeichnung -->
				<small class="indent">
					<xsl:value-of select="substring-before((substring-after(substring-after(elster:Kz09,'*'),'*')),'*')" />
				</small>
				<small class="indent">

					<!-- Vorwahl -->
					<xsl:value-of select="substring-before(substring-after((substring-after(substring-after(elster:Kz09,'*'),'*')),'*'),'*')" />
					<xsl:text>&#160;</xsl:text>

					<!-- Rufnummer -->
					<xsl:value-of select="substring-before(substring-after((substring-after(substring-after(substring-after(elster:Kz09,'*'),'*'),'*')),'*') ,'*')" />
				</small>
			</p>
		</xsl:if>
	</xsl:template>
	
	
	<xsl:template name="Anmeldungen_ElsterInfo">
		<xsl:if test="not(//elster:HerstellerID = '20900')">
			<xsl:call-template name="ElsterInfoMitTrennlinie" />
		</xsl:if>
	</xsl:template>
	
	<!-- Gibt die ElsterInfo aus, gefolgt von einem horizontalen Trennstrich -->
	<xsl:template name="ElsterInfoMitTrennlinie">
		<xsl:variable name="elsterInfoAusgabe">
			<xsl:call-template name="ElsterInfo" />
		</xsl:variable>
		<xsl:if test="$elsterInfoAusgabe != ''">
			<xsl:copy-of select="$elsterInfoAusgabe" />
			<hr />
		</xsl:if>
	</xsl:template>

	<xsl:template name="Transferdaten">
		<xsl:choose>
			<xsl:when test="elster:TransferHeader/elster:EingangsDatum">
				<xsl:text>Eingang auf Server: </xsl:text>
				<xsl:variable name="eingangsdatum" select="elster:TransferHeader/elster:EingangsDatum" />
				<xsl:value-of select="substring($eingangsdatum,7,2)" />
				<xsl:text>.</xsl:text>
				<xsl:value-of select="substring($eingangsdatum,5,2)" />
				<xsl:text>.</xsl:text>
				<xsl:value-of select="substring($eingangsdatum,1,4)" />
				<xsl:text>,</xsl:text>
				<xsl:value-of select="substring($eingangsdatum,9,2)" />
				<xsl:text>:</xsl:text>
				<xsl:value-of select="substring($eingangsdatum,11,2)" />
				<xsl:text>:</xsl:text>
				<xsl:value-of select="substring($eingangsdatum,13,2)" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>Ausdruck vor Übermittlung</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="elster:TransferHeader/elster:TransferTicket">
			<br />
			<xsl:text>Transferticket: </xsl:text>
			<xsl:value-of select="elster:TransferHeader/elster:TransferTicket" />
		</xsl:if>
		<xsl:if test="elster:DatenTeil/elster:Nutzdatenblock/elster:Nutzdaten/elster:Anmeldungssteuern/elster:Erstellungsdatum">
			<br />
			<xsl:text>Erstellungsdatum: </xsl:text>
			<xsl:variable name="erstellungsdatum" select="elster:DatenTeil/elster:Nutzdatenblock/elster:Nutzdaten/elster:Anmeldungssteuern/elster:Erstellungsdatum" />
			<xsl:value-of select="substring($erstellungsdatum,7)" />
			<xsl:text>.</xsl:text>
			<xsl:value-of select="substring($erstellungsdatum,5,2)" />
			<xsl:text>.</xsl:text>
			<xsl:value-of select="substring($erstellungsdatum,1,4)" />
		</xsl:if>
	</xsl:template>

	<!-- Berater Mandant Unternehmer 
        Aufgerufene Templates: Berater, Mandat, Unternehmer
    -->
	<xsl:template name="Berater_Mandant_Unternehmer">
		<xsl:if test="//elster:Berater">
			<p class="left">
				<xsl:call-template name="Berater" />
			</p>
			<xsl:if test="//elster:Unternehmer">
				<xsl:if
					test="string-length(//elster:Berater/elster:AnschriftenZusatz)&lt;31 and string-length(//elster:Berater/elster:Bezeichnung)&lt;31 and
										string-length(//elster:Berater/elster:Name)&lt;31 and string-length(//elster:Berater/elster:Email)&lt;31 and
									string-length(//elster:Unternehmer/elster:AnschriftenZusatz)&lt;31 and string-length(//elster:Unternehmer/elster:Bezeichnung)&lt;31 and
										string-length(//elster:Unternehmer/elster:Name)&lt;31 and    string-length(//elster:Unternehmer/elster:Email)&lt;31 ">
					<p class="right" style="text-align: left">
						<xsl:call-template name="Unternehmer" />
					</p>
				</xsl:if>
			</xsl:if>
			<div class="clear" />
		</xsl:if>

		<xsl:if test="//elster:Mandant">
			<br />
			<p class="left">
				<xsl:call-template name="Mandant" />
			</p>
			<div class="clear" />
		</xsl:if>

		<xsl:if test="//elster:Unternehmer">
			<xsl:if
				test="string-length(//elster:Berater/elster:AnschriftenZusatz)&gt;30 or string-length(//elster:Berater/elster:Bezeichnung)&gt;30 or
						string-length(//elster:Berater/elster:Name)&gt;30 or string-length(//elster:Berater/elster:Email)&gt;30 or
						string-length(//elster:Unternehmer/elster:AnschriftenZusatz)&gt;30 or string-length(//elster:Unternehmer/elster:Bezeichnung)&gt;30 or
						string-length(//elster:Unternehmer/elster:Name)&gt;30 or string-length(//elster:Unternehmer/elster:Email)&gt;30 ">
				<br />
				<p class="left">
					<xsl:call-template name="Unternehmer" />
				</p>
				<div class="clear" />
			</xsl:if>
		</xsl:if>
	</xsl:template>

	<!-- 
		Abhaengigkeiten:
        //elster:Berater/elster:Name | //elster:Berater/elster:Vorname -bestimmt-die-Ausgabe-von-> //elster:Berater/elster:Namenszusatz, 
        //elster:Berater/elster:Str | //elster:Berater/elster:Hausnummer -bestimmt-die-Ausgabe-von-> //elster:Berater/elster:HNrZusatz, 
        //elster:Berater/elster:Ort -bestimmt-die-Ausgabe-von-> //elster:Berater/elster:PLZ //elster:Berater/elster:AuslandsPLZ //elster:Berater/elster:GKPLZ, 
        //elster:Berater/elster:PostfachOrt -bestimmt-die-Ausgabe-von-> //elster:Berater/elster:PostfachPLZ //elster:Berater/elster:GKPLZ
    --> 
    <xsl:template name="Berater">
		<xsl:text>Berater:</xsl:text>
		<br />
		<small>
			<xsl:if test="//elster:Berater/elster:Bezeichnung">
				<xsl:value-of select="//elster:Berater/elster:Bezeichnung" />
				<br />
			</xsl:if>
			<xsl:if test="//elster:Berater/elster:Name | //elster:Berater/elster:Vorname">
				<xsl:if test="//elster:Berater/elster:Namensvorsatz">
					<xsl:value-of select="//elster:Berater/elster:Namensvorsatz" />
					&#160;
				</xsl:if>
				<xsl:if test="//elster:Berater/elster:Vorname">
					<xsl:value-of select="//elster:Berater/elster:Vorname" />
					&#160;
				</xsl:if>
				<xsl:if test="//elster:Berater/elster:Namenszusatz">
					<xsl:value-of select="//elster:Berater/elster:Namenszusatz" />
					&#160;
				</xsl:if>
				<xsl:if test="//elster:Berater/elster:Name">
					<xsl:value-of select="//elster:Berater/elster:Name" />
				</xsl:if>
				<br />
			</xsl:if>
			<xsl:if test="//elster:Berater/elster:Str | //elster:Berater/elster:Hausnummer">
				<xsl:if test="//elster:Berater/elster:Str">
					<xsl:value-of select="//elster:Berater/elster:Str" />
					&#160;
				</xsl:if>
				<xsl:if test="//elster:Berater/elster:Hausnummer">
					<xsl:value-of select="//elster:Berater/elster:Hausnummer" />
					&#160;
				</xsl:if>
				<xsl:if test="//elster:Berater/elster:HNrZusatz">
					<xsl:value-of select="//elster:Berater/elster:HNrZusatz" />
				</xsl:if>
				<br />
			</xsl:if>
			<xsl:if test="//elster:Berater/elster:AnschriftenZusatz">
				<xsl:value-of select="//elster:Berater/elster:AnschriftenZusatz" />
				<br />
			</xsl:if>
			<xsl:if test="//elster:Berater/elster:Ort">
				<xsl:choose>
					<xsl:when test="//elster:Berater/elster:PLZ">
						<xsl:value-of select="//elster:Berater/elster:PLZ" />
						&#160;
					</xsl:when>
					<xsl:otherwise>
						<xsl:choose>
							<xsl:when test="//elster:Berater/elster:AuslandsPLZ">
								<xsl:value-of select="//elster:Berater/elster:AuslandsPLZ" />
								&#160;
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="//elster:Berater/elster:GKPLZ">
									<xsl:value-of select="//elster:Berater/elster:GKPLZ" />
									&#160;
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:if test="//elster:Berater/elster:Ort">
					<xsl:value-of select="//elster:Berater/elster:Ort" />
				</xsl:if>
				<br />
			</xsl:if>
			<xsl:if test="//elster:Berater/elster:Land">
				<xsl:value-of select="//elster:Berater/elster:Land" />
				<br />
			</xsl:if>
			<xsl:if test="//elster:Berater/elster:Postfach">
				<xsl:text>Postfach:</xsl:text>
				&#160;
				<xsl:value-of select="//elster:Berater/elster:Postfach" />
				<br />
			</xsl:if>
			<xsl:if test="//elster:Berater/elster:PostfachOrt">
				<xsl:choose>
					<xsl:when test="//elster:Berater/elster:PostfachPLZ">
						<xsl:value-of select="//elster:Berater/elster:PostfachPLZ" />
						&#160;
					</xsl:when>
					<xsl:otherwise>
						<xsl:if test="//elster:Berater/elster:GKPLZ">
							<xsl:value-of select="//elster:Berater/elster:GKPLZ" />
							&#160;
						</xsl:if>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:if test="//elster:Berater/elster:PostfachOrt">
					<xsl:value-of select="//elster:Berater/elster:PostfachOrt" />
				</xsl:if>
				<br />
			</xsl:if>
			<xsl:if test="//elster:Berater/elster:Telefon">
				<xsl:value-of select="//elster:Berater/elster:Telefon" />
				<br />
			</xsl:if>
			<xsl:if test="//elster:Berater/elster:Email">

				<xsl:value-of select="//elster:Berater/elster:Email" />
				<br />
			</xsl:if>
		</small>
	</xsl:template>

	<xsl:template name="Mandant">
		<xsl:text>Mandant:</xsl:text>
		<br />
		<small>
			<xsl:if test="//elster:Mandant/elster:Name | //elster:Mandant/elster:Vorname">
				<xsl:if test="//elster:Mandant/elster:Vorname">
					<xsl:value-of select="//elster:Mandant/elster:Vorname" />
					&#160;
				</xsl:if>
				<xsl:if test="//elster:Mandant/elster:Name">
					<xsl:value-of select="//elster:Mandant/elster:Name" />
				</xsl:if>
				<br />
			</xsl:if>
			<xsl:if test="//elster:Mandant/elster:MandantenNr">
				<xsl:text>Mandantennummer:</xsl:text>
				&#160;
				<xsl:value-of select="//elster:Mandant/elster:MandantenNr" />
				<br />
			</xsl:if>
			<xsl:if test="//elster:Mandant/elster:Bearbeiterkennzeichen">
				<xsl:text>Bearbeiterkennzeichen:</xsl:text>
				&#160;
				<xsl:value-of select="//elster:Mandant/elster:Bearbeiterkennzeichen" />
				<br />
			</xsl:if>
		</small>
	</xsl:template>
    
    <!-- 
    	Abhaengigkeiten:
        //elster:Unternehmer/elster:Name | //elster:Unternehmer/elster:Vorname -bestimmt-die-Ausgabe-von-> //elster:Unternehmer/elster:Namensvorsatz //elster:Unternehmer/elster:Namenszusatz
        //elster:Unternehmer/elster:Str | //elster:Unternehmer/elster:Hausnummer -bestimmt-die-Ausgabe-von-> //elster:Unternehmer/elster:HNrZusatz
        //elster:Unternehmer/elster:Ort -bestimmt-die-Ausgabe-von-> //elster:Unternehmer/elster:PLZ //elster:Unternehmer/elster:AuslandsPLZ //elster:Unternehmer/elster:GKPLZ
        //elster:Unternehmer/elster:PostfachOrt -bestimmt-die-Ausgabe-von-> //elster:Unternehmer/elster:PostfachPLZ //elster:Unternehmer/elster:GKPLZ
    -->
	<xsl:template name="Unternehmer">
		<xsl:text>Unternehmer:</xsl:text>
		<br />
		<small>
			<xsl:if test="//elster:Unternehmer/elster:Bezeichnung">
				<xsl:value-of select="//elster:Unternehmer/elster:Bezeichnung" />
				<br />
			</xsl:if>
			<xsl:if test="//elster:Unternehmer/elster:Name | //elster:Unternehmer/elster:Vorname">
				<xsl:if test="//elster:Unternehmer/elster:Namensvorsatz">
					<xsl:value-of select="//elster:Unternehmer/elster:Namensvorsatz" />
					&#160;
				</xsl:if>
				<xsl:if test="//elster:Unternehmer/elster:Vorname">
					<xsl:value-of select="//elster:Unternehmer/elster:Vorname" />
					&#160;
				</xsl:if>
				<xsl:if test="//elster:Unternehmer/elster:Namenszusatz">
					<xsl:value-of select="//elster:Unternehmer/elster:Namenszusatz" />
					&#160;
				</xsl:if>
				<xsl:if test="//elster:Unternehmer/elster:Name">
					<xsl:value-of select="//elster:Unternehmer/elster:Name" />
				</xsl:if>
				<br />
			</xsl:if>
			<xsl:if test="//elster:Unternehmer/elster:Str | //elster:Unternehmer/elster:Hausnummer">
				<xsl:if test="//elster:Unternehmer/elster:Str">
					<xsl:value-of select="//elster:Unternehmer/elster:Str" />
					&#160;
				</xsl:if>
				<xsl:if test="//elster:Unternehmer/elster:Hausnummer">
					<xsl:value-of select="//elster:Unternehmer/elster:Hausnummer" />
					&#160;
				</xsl:if>
				<xsl:if test="//elster:Unternehmer/elster:HNrZusatz">
					<xsl:value-of select="//elster:Unternehmer/elster:HNrZusatz" />
				</xsl:if>
				<br />
			</xsl:if>
			<xsl:if test="//elster:Unternehmer/elster:AnschriftenZusatz">
				<xsl:value-of select="//elster:Unternehmer/elster:AnschriftenZusatz" />
				<br />
			</xsl:if>
			<xsl:if test="//elster:Unternehmer/elster:Ort">
				<xsl:choose>
					<xsl:when test="//elster:Unternehmer/elster:PLZ">
						<xsl:value-of select="//elster:Unternehmer/elster:PLZ" />
						&#160;
					</xsl:when>
					<xsl:otherwise>
						<xsl:choose>
							<xsl:when test="//elster:Unternehmer/elster:AuslandsPLZ">
								<xsl:value-of select="//elster:Unternehmer/elster:AuslandsPLZ" />
								&#160;
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="//elster:Unternehmer/elster:GKPLZ">
									<xsl:value-of select="//elster:Unternehmer/elster:GKPLZ" />
									&#160;
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:if test="//elster:Unternehmer/elster:Ort">
					<xsl:value-of select="//elster:Unternehmer/elster:Ort" />
				</xsl:if>
				<br />
			</xsl:if>
			<xsl:if test="//elster:Unternehmer/elster:Land">
				<xsl:value-of select="//elster:Unternehmer/elster:Land" />
				<br />
			</xsl:if>
			<xsl:if test="//elster:Unternehmer/elster:Postfach">
				<xsl:text>Postfach:</xsl:text>
				&#160;
				<xsl:value-of select="//elster:Unternehmer/elster:Postfach" />
				<br />
			</xsl:if>
			<xsl:if test="//elster:Unternehmer/elster:PostfachOrt">
				<xsl:choose>
					<xsl:when test="//elster:Unternehmer/elster:PostfachPLZ">
						<xsl:value-of select="//elster:Unternehmer/elster:PostfachPLZ" />
						&#160;
					</xsl:when>
					<xsl:otherwise>
						<xsl:if test="//elster:Unternehmer/elster:GKPLZ">
							<xsl:value-of select="//elster:Unternehmer/elster:GKPLZ" />
							&#160;
						</xsl:if>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:if test="//elster:Unternehmer/elster:PostfachOrt">
					<xsl:value-of select="//elster:Unternehmer/elster:PostfachOrt" />
				</xsl:if>
				<br />
			</xsl:if>
			<xsl:if test="//elster:Unternehmer/elster:Telefon">
				<xsl:value-of select="//elster:Unternehmer/elster:Telefon" />
				<br />
			</xsl:if>
			<xsl:if test="//elster:Unternehmer/elster:Email">
				<xsl:value-of select="//elster:Unternehmer/elster:Email" />
				<br />
			</xsl:if>
		</small>
	</xsl:template>

	<!--****    STEUERNUMMER        *****************-->
	<xsl:template name="Steuernummer">
		<p class="right">
			<xsl:text>Steuernummer: </xsl:text>
			<xsl:call-template name="formatiereSteuernummer">
				<xsl:with-param name="steuernummer" select="elster:Steuernummer"/>
			</xsl:call-template>
			<br />
		</p>
	</xsl:template>

	<xsl:template name="Zeitraum">
		<xsl:if test="elster:Zeitraum[starts-with(.,'41')]">1. Kalendervierteljahr</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'42')]">2. Kalendervierteljahr</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'43')]">3. Kalendervierteljahr</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'44')]">4. Kalendervierteljahr</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'01')]">Januar</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'02')]">Februar</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'03')]">März</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'04')]">April</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'05')]">Mai</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'06')]">Juni</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'07')]">Juli</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'08')]">August</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'09')]">September</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'10')]">Oktober</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'11')]">November</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'12')]">Dezember</xsl:if>
		<xsl:if test="elster:Zeitraum[starts-with(.,'19')]">Kalenderjahr</xsl:if>
	</xsl:template>

	<!--****************    Hinweise     **********************-->
	<xsl:template name="Hinweis_zu_Saeumniszuschlaegen">
		<p>
			Bitte beachten Sie, dass bei Zahlung der angemeldeten Steuer durch Hingabe eines Schecks erst der dritte Tag nach dem Tag des Eingangs des Schecks bei der zuständigen Finanzkasse als
			Einzahlungstag gilt (§ 224 Absatz 2 Nr. 1 Abgabenordnung). Fällt der dritte Tag auf einen Samstag, einen Sonntag oder einen gesetzlichen Feiertag, gilt die Zahlung erst am nächstfolgenden
			Werktag als bewirkt. Gilt die Zahlung der angemeldeten Steuer durch Hingabe eines Schecks erst nach dem Fälligkeitstag als bewirkt, fallen Säumniszuschläge an (§ 240 Absatz 3 Abgabenordnung). Um
			diese zu vermeiden, wird empfohlen, am Lastschriftverfahren teilzunehmen. Die Teilnahme am Lastschriftverfahren ist jederzeit widerruflich und völlig risikolos. Sollte einmal ein Betrag zu
			Unrecht abgebucht werden, können Sie diese Abbuchung bei Ihrer Bank innerhalb von 6 Wochen stornieren lassen. Zur Teilnahme am Lastschriftverfahren setzen Sie sich bitte mit Ihrem Finanzamt in
			Verbindung.
		</p>
		<p>
			<strong>
				Dieses Übertragungsprotokoll ist nicht zur Übersendung an das Finanzamt bestimmt. Die Angaben sind auf ihre Richtigkeit hin zu prüfen. Sofern eine Unrichtigkeit festgestellt wird, ist eine
				berichtigte Steueranmeldung abzugeben.
			</strong>
		</p>

		<xsl:if xmlns:xsl="http://www.w3.org/1999/XSL/Transform" test="elster:Kz51|elster:Kz81|elster:Kz86|elster:Kz54|elster:Kz55|elster:Kz97|elster:Kz89|elster:Kz93" >
			<tr>
				<td>
					<sup>*)</sup> 
					<xsl:text xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
						Dieser Wert wurde arithmetisch ermittelt und nicht an die Finanzbehörde übermittelt.
					</xsl:text>
				</td>
			</tr>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
