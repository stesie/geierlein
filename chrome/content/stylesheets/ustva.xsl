<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- Version 2.0 -->
<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:elster="http://www.elster.de/2002/XMLSchema"
		exclude-result-prefixes="elster">
	<xsl:output method="html" indent="yes" encoding="UTF-8" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN" doctype-system="http://www.w3.org/TR/html4/loose.dtd"/>
	<xsl:include href="elsteranmeldung.xsl" />
	<xsl:include href="geldbetraege.xsl" />

	<xsl:template match="elster:Elster">
		<html>
			<head>
				<title>
					<xsl:call-template name="Titel" />
				</title>
				<style type="text/css">
					<xsl:text>
						body {
							font-family:Helvetica,Arial,sans-serif;
							font-size: 0.85em;
							word-wrap: break-word;
						}
						#content{
							font-size:0.99em;
							width:46em;
							margin-left: 0.5em;
						}
						h1 {
							font-size: 1.2em;
							page-break-after:avoid;
						}
						h2 {
							font-size: 1.1em;
							page-break-after:avoid;
						}
						h3 {
						  font-size: 1.0em;
						  page-break-after:avoid;
						}
						h4 {
						  font-size: 0.9em;
						  page-break-after:avoid;
						}
						table {
							width:100%;
							table-layout: fixed;
							page-break-inside:avoid;
						}
						table, th, td {
						  border-collapse:collapse;
						  border:1px solid #AAAAAA;
						}
						td, th {
							padding: 2px;
							padding-left:0.3em;
							font-weight:normal;
							vertical-align: bottom;
							}
						td.kz {
							padding: 0px;
							font-style:normal;
							font-size:1em;
							}
						small {
							padding: 0px;
							font-style:normal;
							font-size:0.8em;
							line-height: 1.6em;
							}
						strong {
							padding: 0px;
							font-weight:bold;
							font-size:1em;
							}
						div.left,
						p.left,
						table.left {
							margin-top:0;
							width:49%;
							float:left;
							text-align: left;
						}
						div.right,
						p.right,
						table.right{
							margin-top:0;
							width:49%;
							float: right;
							text-align: right;
						}
						#content .alRight{
							text-align: right;
						}
						#content .alLeft{
							text-align: left;
						}
						#content .alCenter{
							text-align: center;
						}
						div.clear {
							height:1px;
							margin: 0;
							padding: 0;
							clear: both;
						}
						hr {
							clear: both;
						}
						.indent{
							margin-left:2em;
						}
						.help{
							cursor: help;
						}
					</xsl:text>
				</style>
			</head>
			<body>
				<div id="content">
					<p class="left">
						<xsl:call-template name="Uebermittelt_von" />
					</p>

					<p class="right">
						<xsl:call-template name="Transferdaten" />
					</p>

					<xsl:call-template name="testfall" /> 

					<hr />
					
					<xsl:call-template name="Anmeldungen_ElsterInfo" />

					<xsl:if test="//elster:Berater | //elster:Mandant | //elster:Unternehmer">
						<xsl:call-template name="Berater_Mandant_Unternehmer" />
					</xsl:if>

					<xsl:apply-templates select="//elster:Steuerfall/elster:Umsatzsteuervoranmeldung" />
					<xsl:apply-templates select="//elster:Steuerfall/elster:Dauerfristverlaengerung" />
					<xsl:apply-templates select="//elster:Steuerfall/elster:Umsatzsteuersondervorauszahlung" />

				</div>
			</body>
		</html>
	</xsl:template>

	<xsl:template name="Titel">
		<xsl:variable name="verfahren" select="name(//elster:Steuerfall/*[1])" />
		<xsl:if test="starts-with($verfahren,'Umsatzsteuervoranmeldung')">
			<xsl:text>Umsatzsteuer-Voranmeldung</xsl:text>
		</xsl:if>
		<xsl:if test="starts-with($verfahren,'Dauerfristverlaengerung')">
			<xsl:text>Antrag auf Dauerfristverlängerung</xsl:text>
		</xsl:if>
		<xsl:if test="starts-with($verfahren,'Umsatzsteuersondervorauszahlung')">
			<xsl:text>Antrag auf Dauerfristverlängerung / Anmeldung der Sondervorauszahlung</xsl:text>
		</xsl:if>
	</xsl:template>


	<!-- **************** STEUERFALL ********************************* -->
	<xsl:template match="//elster:Steuerfall/*">

		<xsl:call-template name="ErstelltVon" />

		<xsl:if test="substring-after((substring-after(substring-after(substring-after(substring-after(normalize-space(elster:Kz09),'*'),'*'),'*'),'*')),'*')">
			<xsl:call-template name="Kz09_Unternehmer" />
		</xsl:if>

		<xsl:call-template name="Steuernummer" />

		<div class="clear"></div>

		<div class="alCenter">
			<h1>
				<xsl:if test="starts-with(local-name(),'Umsatzsteuersondervorauszahlung')">
					<xsl:text>Antrag auf Dauerfristverlängerung</xsl:text>
					<br />
				</xsl:if>
				<xsl:if test="starts-with(local-name(),'Dauerfristverlaengerung')">
					<xsl:text>Antrag auf Dauerfristverlängerung</xsl:text>
					<br />
				</xsl:if>
				<xsl:if test="starts-with(local-name(),'Umsatzsteuersondervorauszahlung')">
					<xsl:text>Anmeldung der Sondervorauszahlung</xsl:text>
					<br />
				</xsl:if>
				<xsl:if test="starts-with(local-name(),'Umsatzsteuervoranmeldung')">
					<xsl:text>Umsatzsteuer-Voranmeldung</xsl:text>
					<br />
				</xsl:if>
				<xsl:if test="not(starts-with(local-name(),'Umsatzsteuervoranmeldung'))">
					(§§ 46 bis 48 <abbr class="help" title="Umsatzsteuer-Durchführungsverordnung">UStDV</abbr>)
					<br />
				</xsl:if>
				<xsl:call-template name="Zeitraum" />
				<xsl:text> </xsl:text>
				<xsl:value-of select="elster:Jahr" />
			</h1>
		</div>


		<xsl:call-template name="BearbeitungsKennzahlen" />

		<xsl:if test="starts-with(local-name(),'Umsatzsteuervoranmeldung')">
			<xsl:call-template name="UStVA" />
		</xsl:if>

		<xsl:if test="starts-with(local-name(),'Dauerfristverlaengerung')">
			<xsl:call-template name="DV" />
		</xsl:if>

		<xsl:if test="starts-with(local-name(),'Umsatzsteuersondervorauszahlung')">
			<xsl:call-template name="SVZ" />
		</xsl:if>

		<hr />

		<h2>Hinweis zu Säumniszuschlägen</h2>
		<xsl:call-template name="Hinweis_zu_Saeumniszuschlaegen" />

	</xsl:template>

	<!--****  UNTERNEHMER    *****************-->
	<xsl:template name="Kz09_Unternehmer">
		<p class="left">
			<xsl:text>Unternehmer: </xsl:text>
			<br />
			<xsl:value-of select="substring-after((substring-after(substring-after(substring-after(substring-after(elster:Kz09,'*'),'*'),'*'),'*')),'*')" />
		</p>
	</xsl:template>

	<!-- **************** BearbeitungsKennzahlen ********************************* -->
	<xsl:template name="BearbeitungsKennzahlen">
		<xsl:if test="elster:Kz10 | elster:Kz22 ">
			<table>
				<tr>
					<td></td>
					<th style="width:4%" class="alRight">
						<abbr title="Kennziffer" class="help">Kz</abbr>
					</th>
					<th style="width:18%" class="alRight">Wert</th>
				</tr>
				<xsl:if test="elster:Kz10">
					<tr>
						<th scope="row" class="alLeft">
							<xsl:text>Berichtigte Anmeldung </xsl:text>
						</th>
						<td colspan="1" class="alRight">10</td>
						<td colspan="1" class="alRight">
							<xsl:value-of select="elster:Kz10" />
						</td>
					</tr>
				</xsl:if>
				<xsl:if test="elster:Kz22">
					<tr>
						<th scope="row" class="alLeft">
							
							<xsl:text>Belege werden gesondert eingereicht</xsl:text>
						</th>
						<td colspan="1" class="alRight">22</td>
						<td colspan="1" class="alRight">
							<xsl:value-of select="elster:Kz22" />
						</td>
					</tr>
				</xsl:if>
			</table>
			<hr />
		</xsl:if>
	</xsl:template>

	<xsl:template name="UStVA_table_header">
		<tr>
			<td style="width:44%"></td>
			<th style="width:4%" class="alRight">
				<abbr title="Kennziffer" class="help">Kz</abbr>
			</th>
			<th style="width:24%" class="alRight">Bemessungsgrundlage</th>
			<th style="width:4%" class="alRight">
				<abbr title="Kennziffer" class="help">Kz</abbr>
			</th>
			<th style="width:24%" class="alRight">Steuer</th>
		</tr>
	</xsl:template>
	<!--******************** UStVA *******************************-->
	<xsl:template name="UStVA">
		<h2>Anmeldung der Umsatzsteuer-Vorauszahlung</h2>
		<xsl:if test="elster:Kz41|elster:Kz44|elster:Kz49|elster:Kz43|elster:Kz48|elster:Kz51|elster:Kz86|elster:Kz35|elster:Kz36|elster:Kz77|elster:Kz76|elster:Kz80|elster:Kz81">
			<h3>Lieferungen und sonstige Leistungen (einschließlich unentgeltlicher Wertabgaben)</h3>
		</xsl:if>
		<xsl:if test=" elster:Kz41 | elster:Kz44  | elster:Kz49    | elster:Kz43">
			<xsl:call-template name="stfrUmsVost" />
		</xsl:if>
		<xsl:if test="elster:Kz48">
			<h4>Steuerfreie Umsätze ohne Vorsteuerabzug</h4>
			<table>
				<xsl:call-template name="UStVA_table_header" />
				<tr>
					<th scope="row" class="alLeft">
						<small>
							Umsätze nach § 4 Nr. 8 bis 28
							<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
						</small>
					</th>
					<td class="alRight">48</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz48"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>
			</table>
		</xsl:if>

		<xsl:choose>
			<xsl:when test="2010 > elster:Jahr[substring(.,1,4)]">			
				<!-- bis 2010 -->
				<xsl:if test=" elster:Kz51 | elster:Kz86 | elster:Kz35  | elster:Kz36 | elster:Kz81">
					<xsl:call-template name="stpflUms" />
				</xsl:if>
				<xsl:if test="elster:Kz77  | elster:Kz76 | elster:Kz80">
					<xsl:call-template name="landwUms" />
				</xsl:if>				
			</xsl:when>							
			<xsl:otherwise>			
				<!-- ab 2010 -->			
				<xsl:if test="elster:Kz86 | elster:Kz35  | elster:Kz36 | elster:Kz81 | elster:Kz77  | elster:Kz76 | elster:Kz80">
					<xsl:call-template name="stpflUmsAb2010" />
				</xsl:if>
				
			</xsl:otherwise>
		</xsl:choose>	

		<xsl:if test="elster:Kz89  | elster:Kz91  | elster:Kz97 | elster:Kz93 | elster:Kz95  | elster:Kz94">
			<h3>Innergemeinschaftliche Erwerbe</h3>
		</xsl:if>

		<xsl:if test="elster:Kz91">
			<h4>Steuerfreie innergemeinschaftliche Erwerbe</h4>
			<table>
				<xsl:call-template name="UStVA_table_header" />
				<tr>
					<th scope="row" class="alLeft">
						<xsl:choose>
							<xsl:when test="2011 >= elster:Jahr[substring(.,1,4)]">
								<small>
									Erwerbe nach § 4b
									<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
								</small>
							</xsl:when>
							<xsl:otherwise>	
								<small>
									Erwerbe nach §§ 4b und 25c 
									<ABBR class="help" title="Umsatzsteuergesetz">UStG</ABBR>
								</small>
							</xsl:otherwise>
						</xsl:choose>
					</th>
					<td class="alRight">91</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz91"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>
			</table>
		</xsl:if>

		<xsl:if test="elster:Kz89  | elster:Kz97   | elster:Kz93 | elster:Kz95    | elster:Kz94">
			<xsl:call-template name="innergemErwerbe" />
		</xsl:if>

		<xsl:if test="elster:Jahr[not(starts-with(.,'2004'))]">
			<xsl:if test="elster:Kz42 | elster:Kz68 | elster:Kz60 | elster:Kz21 | elster:Kz45">
				<xsl:call-template name="ergAng" />
			</xsl:if>
		</xsl:if>

		<xsl:if test="elster:Jahr[starts-with(.,'2004')]">
			<xsl:if test="elster:Kz54   | elster:Kz55  | elster:Kz57 | elster:Kz45 | elster:Kz65">
				<h4>
					Umsätze, für die der Leistungsempfänger die Steuer nach § 13b Absatz 2
					<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
					schuldet
				</h4>
				<table>
					<xsl:call-template name="UStVA_table_header" />
					<xsl:call-template name="u200413b" />
					<xsl:if test="elster:Kz45">
						<tr>
							<th scope="row" class="alLeft">
								<strong>Nicht steuerbare Umsätze</strong>
							</th>
							<td class="alRight">45</td>
							<td class="alRight">
								<xsl:call-template name="formatiereGeldbetrag">
									<xsl:with-param name="betrag" select="//elster:Kz45"/>
								</xsl:call-template>
							</td>
							<td colspan="2"></td>
						</tr>
					</xsl:if>
					<xsl:if test="elster:Kz65">
						<tr>
							<th scope="row" class="alLeft">
								<small>Steuer infolge Wechsels der Besteuerungsart/-form sowie Nachsteuer auf versteuerte Anzahlungen wegen Steuersatzerhöhung</small>
							</th>
							<td class="alRight" colspan="2" />
							<td class="alRight">65</td>
							<td class="alRight">
								<xsl:call-template name="formatiereGeldbetrag">
									<xsl:with-param name="betrag" select="//elster:Kz65"/>
								</xsl:call-template>
							</td>
						</tr>
					</xsl:if>
				</table>
			</xsl:if>
		</xsl:if>

		<xsl:if test="elster:Jahr[not(starts-with(.,'2004'))]">
			<xsl:if test="elster:Kz46  | elster:Kz52  | elster:Kz73 | elster:Kz78 | elster:Kz84 | elster:Kz65">
				<xsl:choose>
					<xsl:when test="( 2010 > elster:Jahr[substring(., 1, 4)] ) or ( (2010 = elster:Jahr[substring(., 1, 4)]) and ( (6 >= elster:Zeitraum[substring(., 1, 2)]) or (elster:Zeitraum[substring(., 1, 2)] = 41) or (elster:Zeitraum[substring(., 1, 2)] = 42) )) " >
					<!-- Bis Juni 2010 -->
						<h3>
							Umsätze, für die als Leistungsempfänger die Steuer nach § 13b Absatz 2
							<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
							geschuldet wird
						</h3>
					</xsl:when>
					<xsl:when test="(2010 = elster:Jahr[substring(., 1, 4)]) and ((elster:Zeitraum[substring(., 1, 2)] > 6) or (elster:Zeitraum[substring(., 1, 2)] = 43) or (elster:Zeitraum[substring(., 1, 2)] = 44))">
					<!-- Ab Juli 2010 bis Dezember 2010 -->
						<h3>
							Umsätze, für die als Leistungsempfänger die Steuer nach § 13b Absatz 5
							<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
							geschuldet wird
						</h3>
					</xsl:when>
					<xsl:otherwise>
					<!-- Ab 2011 -->
						<h3>		
							Leistungsempfänger als Steuerschuldner (§ 13b <abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
						</h3>
					</xsl:otherwise>
				</xsl:choose>
				<table>
					<xsl:call-template name="UStVA_table_header" />
					<xsl:call-template name="u200513b" />
					<xsl:if test="elster:Kz65">
						<tr>
							<th scope="row" class="alLeft">
								<small>Steuer infolge Wechsels der Besteuerungsform sowie Nachsteuer auf versteuerte Anzahlungen wegen Steuersatzerhöhung</small>
							</th>
							<td class="alRight" colspan="2" />
							<td class="alRight">65</td>
							<td class="alRight">
								<xsl:call-template name="formatiereGeldbetrag">
									<xsl:with-param name="betrag" select="//elster:Kz65"/>
								</xsl:call-template>
							</td>
						</tr>
					</xsl:if>
				</table>
			</xsl:if>
		</xsl:if>

		<xsl:if test="elster:Kz66   | elster:Kz61  | elster:Kz62   | elster:Kz67  | elster:Kz63 | elster:Kz64  | elster:Kz59">
			<h3>Abziehbare Vorsteuerbeträge</h3>
			<table>
				<xsl:call-template name="UStVA_table_header" />
				<xsl:call-template name="Vorsteuer" />
			</table>
		</xsl:if>

		<xsl:if test="elster:Kz69 | elster:Kz39 | elster:Kz83">
			<xsl:if test="elster:Kz69">
				<xsl:choose>
					<xsl:when test="elster:Jahr[not(starts-with(.,'2004'))] and elster:Jahr[not(starts-with(.,'2005'))] ">
						<h3>Andere Steuerbeträge</h3>
					</xsl:when>
					<xsl:otherwise>
						<br />
					</xsl:otherwise>
				</xsl:choose>
			</xsl:if>
			<table>
				<xsl:call-template name="UStVA_table_header" />
				<xsl:if test="elster:Kz69">
					<tr>
						<th scope="row" class="alLeft">
							<small>
								<xsl:if test="elster:Jahr[not(starts-with(.,'2004'))] and elster:Jahr[not(starts-with(.,'2005'))] ">
									in Rechnungen unrichtig oder unberechtigt ausgewiesene Steuerbeträge (§ 14c
									<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
									sowie Steuerbeträge, die nach § 4 Nr. 4a Satz 1 Buchst. a Satz 2, § 6a Absatz 4 Satz 2, § 17 Absatz 1 Satz 6 oder § 25b Absatz 2
									<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
									geschuldet werden
								</xsl:if>
								<xsl:if test="elster:Jahr[starts-with(.,'2005')]">
									Steuerbeträge, die vom letzten Abnehmer eines innergemeinschaftlichen Dreiecksgeschäfts geschuldet werden (§ 25b Absatz 2
									<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>),
									in Rechnungen unrichtig oder unberechtigt ausgewiesene Steuerbeträge (§ 14c
									<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>),
									Steuerbeträge für Leistungen im Sinne des § 13a Absatz 1 Nr. 6
									<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
									sowie Steuerbeträge, die nach § 6a Absatz 4 Satz 2 oder § 17 Absatz 1 Satz 2
									<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
									geschuldet werden
								</xsl:if>
								<xsl:if test="elster:Jahr[starts-with(.,'2004')]">
									Steuerbeträge, die vom letzten Abnehmer eines innergemeinschaftlichen Dreiecksgeschäfts geschuldet werden (§ 25b Absatz 2
									<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>),
									in Rechnungen unrichtig oder unberechtigt ausgewiesene Steuerbeträge sowie Steuerbeträge, die nach § 6a Absatz 4 Satz 2 oder § 17 Absatz 1 Satz 2
									<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
									geschuldet werden
								</xsl:if>
							</small>
						</th>
						<td class="alRight" colspan="2" />
						<td class="alRight">69</td>
						<td class="alRight">
							<xsl:call-template name="formatiereGeldbetrag">
								<xsl:with-param name="betrag" select="//elster:Kz69"/>
							</xsl:call-template>
						</td>
					</tr>
				</xsl:if>

				<xsl:if test="elster:Kz39">
					<tr>
						<th scope="row" class="alLeft">
							<small>
							Anrechnung (Abzug) der festgesetzten Sondervorauszahlung für Dauerfristverlängerung (nur auszufüllen in der letzten Voranmeldung des Besteuerungszeitraums, in der Regel Dezember)
							</small>
						</th>
						<td class="alRight" colspan="2" />
						<td class="alRight">39</td>
						<td class="alRight">
							<xsl:call-template name="formatiereGeldbetrag">
								<xsl:with-param name="betrag" select="//elster:Kz39"/>
							</xsl:call-template>
						</td>
					</tr>
				</xsl:if>

				<xsl:if test="elster:Kz83">
					<tr>
						<th scope="row" class="alLeft">
							<small>
								<strong>
									Verbleibende Umsatzsteuer-Vorauszahlung
									<br />
									verbleibender Überschuss
								</strong>
							</small>
						</th>
						<td class="alRight" colspan="2" />
						<td class="alRight">83</td>
						<td class="alRight">
							<strong>
								<xsl:call-template name="formatiereGeldbetrag">
									<xsl:with-param name="betrag" select="//elster:Kz83"/>
								</xsl:call-template>
							</strong>
						</td>
					</tr>
				</xsl:if>
			</table>
		</xsl:if>

		<xsl:if test="elster:Kz26 | elster:Kz29">
			<h2>Sonstige Angaben</h2>
			<table>
				<tr>
					<td></td>
					<th style="width:4%" class="alRight">
						<abbr title="Kennziffer" class="help">Kz</abbr>
					</th>
					<th style="width:18%" class="alRight">Wert</th>
				</tr>

				<xsl:if test="elster:Kz29">
					<tr>
						<th scope="row" class="alLeft">
							<small>Verrechnung des Erstattungsbetrags erwünscht/ Erstattungsbetrag ist abgetreten</small>
						</th>
						<td class="alRight">29</td>
						<td class="alRight">
							<xsl:value-of select="elster:Kz29" />
						</td>
					</tr>
				</xsl:if>

				<xsl:if test="elster:Kz26">
					<tr>
						<th scope="row" class="alLeft">
							<small>Die Einzugsermächtigung wird ausnahmsweise (z.B. wegen Verrechnungswünschen) für diesen Voranmeldungszeitraum widerrufen</small>
						</th>
						<td class="alRight">26</td>
						<td class="alRight">
							<xsl:value-of select="elster:Kz26" />
						</td>
					</tr>
				</xsl:if>
			</table>
		</xsl:if>
	</xsl:template>

	<!--******************** stfrUmsVost  ******-->
	<xsl:template name="stfrUmsVost">
		<h4>Steuerfreie Umsätze mit Vorsteuerabzug</h4>
		<table>
			<xsl:call-template name="UStVA_table_header" />
			<xsl:if test="elster:Kz41">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							Innergemeinschaftliche Lieferungen (§ 4 Nr. 1 Buchst. b
							<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>) an Abnehmer mit
							<abbr class="help" title="Umsatzsteuer-Identifikationsnummer">USt-IdNr.</abbr>
						</small>
					</th>
					<td class="alRight">41</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz41"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz44">
				<tr>
					<th scope="row" class="alLeft">
						
						<small>
							Innergemeinschaftliche Lieferungen neuer Fahrzeuge an Abnehmer ohne
							<abbr class="help" title="Umsatzsteuer-Identifikationsnummer">USt-IdNr.</abbr>
						</small>
					</th>
					<td class="alRight">44</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz44"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz49">
				<tr>
					<th scope="row" class="alLeft">
						
						<small>
							Innergemeinschaftliche Lieferungen neuer Fahrzeuge außerhalb eines Unternehmens (§ 2a
							<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
						</small>
					</th>
					<td class="alRight">49</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz49"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz43">
				<tr>
					<th scope="row" class="alLeft">
						
						<small>
							Weitere steuerfreie Umsätze mit Vorsteuerabzug (z.B. Ausfuhrlieferungen, Umsätze nach § 4 Nr. 2 bis 7
							<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
						</small>
					</th>
					<td class="alRight">43</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz43"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>
			</xsl:if>
		</table>
	</xsl:template>

	<!--********************'stpflUms'  !******-->
	<xsl:template name="stpflUms">
		<h4>Steuerpflichtige Umsätze</h4>
		<p>
			<small>(Lieferungen und sonstige Leistungen einschließlich unentgeltlicher Wertabgaben)</small>
		</p>
		<table>
			<xsl:call-template name="UStVA_table_header" />
			<xsl:if test="elster:Kz51">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							zum Steuersatz von 16
							<abbr class="help" title="von Hundert">v. H.</abbr>
						</small>
					</th>
					<td class="alRight">51</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz51"/>
						</xsl:call-template>
					</td>
					<td valign="bottom" align="center" colspan="1" >--</td>
					<td valign="bottom" align="right" colspan="1" >
					    <xsl:value-of xmlns:xsl="http://www.w3.org/1999/XSL/Transform" select="format-number(0.16 * elster:Kz51, '#.##0,00&#160;&#8364;', 'geldformat')" />
					    <sup>*)</sup>
					</td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz81">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							zum Steuersatz von 19
							<abbr class="help" title="von Hundert">v. H.</abbr>
						</small>
					</th>
					<td class="alRight">81</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz81"/>
						</xsl:call-template>
					</td>
					<td valign="bottom" align="center" colspan="1" >--</td>
					<td valign="bottom" align="right" colspan="1" >
					    <xsl:value-of xmlns:xsl="http://www.w3.org/1999/XSL/Transform" select="format-number(0.19 * elster:Kz81, '#.##0,00&#160;&#8364;', 'geldformat')" />
					    <sup>*)</sup>
					</td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz86">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							zum Steuersatz von 7
							<abbr class="help" title="von Hundert">v. H.</abbr>
						</small>
					</th>
					<td class="alRight">86</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz86"/>
						</xsl:call-template>
					</td>
					<td valign="bottom" align="center" colspan="1" >--</td>
					<td valign="bottom" align="right" colspan="1" >
					    <xsl:value-of xmlns:xsl="http://www.w3.org/1999/XSL/Transform" select="format-number(0.07 * elster:Kz86, '#.##0,00&#160;&#8364;', 'geldformat')" />
					    <sup>*)</sup>
					</td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz35">
				<tr>
					<th scope="row" class="alLeft">
						<xsl:choose>
							<xsl:when test="elster:Jahr[starts-with(.,'2004')]|elster:Jahr[starts-with(.,'2005')]|elster:Jahr[starts-with(.,'2006')]|
													elster:Jahr[starts-with(.,'2007')]|elster:Jahr[starts-with(.,'2008')]">
								<small>Umsätze, die anderen Steuersätzen unterliegen</small>
							</xsl:when>							
							<xsl:otherwise>
								<!-- ab 2009 -->
								<small>zu anderen Steuersätzen</small>
							</xsl:otherwise>
						</xsl:choose>
					</th>
					<td class="alRight">35</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz35"/>
						</xsl:call-template>
					</td>
					<td class="alRight">36</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz36"/>
						</xsl:call-template>
					</td>
				</tr>
			</xsl:if>
		</table>
	</xsl:template>


	<!--********************'stpflUms'  !******-->
	<xsl:template name="stpflUmsAb2010">
		<h4>Steuerpflichtige Umsätze</h4>
		<p>
			<small>(Lieferungen und sonstige Leistungen einschließlich unentgeltlicher Wertabgaben)</small>
		</p>
		<table>
			<xsl:call-template name="UStVA_table_header" />
			<xsl:if test="elster:Kz81">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							zum Steuersatz von 19
							<abbr class="help" title="von Hundert">v. H.</abbr>
						</small>
					</th>
					<td class="alRight">81</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz81"/>
						</xsl:call-template>
					</td>
					<td valign="bottom" align="center" colspan="1" >--</td>
					<td valign="bottom" align="right" colspan="1" >
					    <xsl:value-of xmlns:xsl="http://www.w3.org/1999/XSL/Transform" select="format-number(0.19 * elster:Kz81, '#.##0,00&#160;&#8364;', 'geldformat')" />
					    <sup>*)</sup>
					</td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz86">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							zum Steuersatz von 7
							<abbr class="help" title="von Hundert">v. H.</abbr>
						</small>
					</th>
					<td class="alRight">86</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz86"/>
						</xsl:call-template>
					</td>
					<td valign="bottom" align="center" colspan="1" >--</td>
					<td valign="bottom" align="right" colspan="1" >
					    <xsl:value-of xmlns:xsl="http://www.w3.org/1999/XSL/Transform" select="format-number(0.07 * elster:Kz86, '#.##0,00&#160;&#8364;', 'geldformat')" />
					    <sup>*)</sup>
					</td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz35">
				<tr>
					<th scope="row" class="alLeft">							
						<small>zu anderen Steuersätzen</small>					
					</th>
					<td class="alRight">35</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz35"/>
						</xsl:call-template>
					</td>
					<td class="alRight">36</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz36"/>
						</xsl:call-template>
					</td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz77">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							Lieferungen land- und forstwirtschaftlicher Betriebe nach § 24
							<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr> an Abnehmer mit 	
							<abbr class="help" title="Umsatzsteuer-Identifikationsnummer">USt-IdNr.</abbr>
						</small>
					</th>
					<td class="alRight">77</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz77"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz76">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							Umsätze, für die eine Steuer nach § 24
							<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
							zu entrichten ist (Sägewerkserzeugnisse, Getränke und alkoholische Flüssigkeiten, z.B. Wein)
						</small>
					</th>
					<td class="alRight">76</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz76"/>
						</xsl:call-template>
					</td>
					<td class="alRight">80</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz80"/>
						</xsl:call-template>
					</td>
				</tr>
			</xsl:if>
		</table>
	</xsl:template>


	<!--******************** 'u200513b' ******-->
	<xsl:template name="u200513b">
		<xsl:if test="elster:Kz46">
			<tr>
				<th scope="row" class="alLeft">
					<small>
				<xsl:choose>
					<xsl:when test="( 2010 > elster:Jahr[substring(., 1, 4)] ) or ( (2010 = elster:Jahr[substring(., 1, 4)]) and ( (6 >= elster:Zeitraum[substring(., 1, 2)]) or (elster:Zeitraum[substring(., 1, 2)] = 41) or (elster:Zeitraum[substring(., 1, 2)] = 42) )) " >
					<!-- Bis Juni 2010 -->
						Im Inland steuerpflichtige sonstige Leistungen von im übrigen Gemeinschaftsgebiet ansässigen Unternehmern
					</xsl:when>
					<xsl:otherwise>
					<!-- Ab Juli 2010 -->
						Im Inland steuerpflichtige sonstige Leistungen von im übrigen Gemeinschaftsgebiet ansässigen Unternehmern 
						(§ 13b Absatz 1 <abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>) 
					</xsl:otherwise>
				</xsl:choose>
					</small>
				</th>
				<td class="alRight">46</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz46"/>
					</xsl:call-template>
				</td>
				<td class="alRight">47</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz47"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="elster:Kz52">
			<tr>
				<th scope="row" class="alLeft">
					<small>
						<xsl:choose>
							<xsl:when test="( 2010 > elster:Jahr[substring(., 1, 4)] )" >
								<!-- bis 2010 --> 
								Leistungen eines im Ausland ansässigen Unternehmers (§ 13b Absatz 1 Satz 1 Nr. 1 und 5
								<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
							</xsl:when>
							<xsl:when test="((2010 = elster:Jahr[substring(., 1, 4)]) and ( (6 >= elster:Zeitraum[substring(., 1, 2)]) or (elster:Zeitraum[substring(., 1, 2)] = 41) or (elster:Zeitraum[substring(., 1, 2)] = 42) )) " >
								<!-- von Januar 2010 bis Juli 2010 --> 
								Andere Leistungen eines im Ausland ansässigen Unternehmers (§ 13b Absatz 1 Satz 1 Nr. 1 und 5 
								<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
							</xsl:when>
							<xsl:otherwise>
								<!-- ab Juli 2010--> 
								Andere Leistungen eines im Ausland ansässigen Unternehmers (§ 13b Absatz 2 Nr. 1 und 5 
								<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
							</xsl:otherwise>
						</xsl:choose>						
					</small>
				</th>
				<td class="alRight">52</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz52"/>
					</xsl:call-template>
				</td>
				<td class="alRight">53</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz53"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="elster:Kz73">
			<tr>
				<th scope="row" class="alLeft">
					<small>
					<xsl:choose>
						<xsl:when test="( 2010 > elster:Jahr[substring(., 1, 4)] ) or ( (2010 = elster:Jahr[substring(., 1, 4)]) and ( (6 >= elster:Zeitraum[substring(., 1, 2)]) or (elster:Zeitraum[substring(., 1, 2)] = 41) or (elster:Zeitraum[substring(., 1, 2)] = 42) )) " >
						<!-- Bis Juni 2010 -->
							Lieferungen sicherungsübereigneter Gegenstände und Umsätze, die unter das
							<abbr class="help" title="Grunderwerbsteuergesetz">GrEStG</abbr>
							fallen (§ 13b Absatz 1 Satz 1 Nr. 2 und 3
							<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
						</xsl:when>
						<xsl:otherwise>
						<!-- Ab Juli 2010 -->
							Lieferungen sicherungsübereigneter Gegenstände und Umsätze, die unter das 
							<abbr class="help" title="Grunderwerbsteuergesetz">GrEStG</abbr> fallen 
							(§ 13b Absatz 2 Nr. 2 und 3 <abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
						</xsl:otherwise>
					</xsl:choose>
					</small>
				</th>
				<td class="alRight">73</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz73"/>
					</xsl:call-template>
				</td>
				<td class="alRight">74</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz74"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
		
		<xsl:if test="elster:Kz78">
			<tr>
				<th scope="row" class="alLeft">
					<small>
							Lieferungen von Mobilfunkgeräten und integrierten Schaltkreisen (§ 13b Absatz 2 Nr. 10 <abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
					</small>
				</th>
				<td class="alRight">78</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz78"/>
					</xsl:call-template>
				</td>
				<td class="alRight">79</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz79"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
		
		<xsl:if test="elster:Kz84">
			<tr>
				<th scope="row" class="alLeft">
					<small>
					<xsl:choose>
						<xsl:when test="( 2010 > elster:Jahr[substring(., 1, 4)] ) or ( (2010 = elster:Jahr[substring(., 1, 4)]) and ( (6 >= elster:Zeitraum[substring(., 1, 2)]) or (elster:Zeitraum[substring(., 1, 2)] = 41) or (elster:Zeitraum[substring(., 1, 2)] = 42) )) " >
						<!-- bis Juni 2010 -->
							Bauleistungen eines im Inland ansässigen Unternehmers (§ 13b Absatz 1 Satz 1 Nr. 4
							<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
						</xsl:when>
						<xsl:when test="(2010 = elster:Jahr[substring(., 1, 4)]) and ((elster:Zeitraum[substring(., 1, 2)] > 6) or (elster:Zeitraum[substring(., 1, 2)] = 43) or (elster:Zeitraum[substring(., 1, 2)] = 44))">
							<!-- Ab Juli 2010 bis Dezember 2010 -->
							Andere Leistungen eines im Inland ansässigen Unternehmers (§ 13b Absatz 2 Nr. 4 und 6 <abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
						</xsl:when>
						<xsl:otherwise>
							<!-- Ab 2011 -->
							Andere Umsätze eines im Inland ansässigen Unternehmers (§ 13b Absatz 2 Nr. 4, 6 bis 9 <abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
						</xsl:otherwise>
					</xsl:choose>
					</small>
				</th>
				<td class="alRight">84</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz84"/>
					</xsl:call-template>
				</td>
				<td class="alRight">85</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz85"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
	</xsl:template>

	<!--******************** ''u200413b'' ******-->
	<xsl:template name="u200413b">
		<xsl:if test="elster:Kz54">
			<tr>
				<th scope="row" class="alLeft">
					<small>
						zum Steuersatz von 16
						<abbr class="help" title="von Hundert">v. H.</abbr>
					</small>
				</th>
				<td class="alRight">54</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz54"/>
					</xsl:call-template>
				</td>
				<td valign="bottom" align="center" colspan="1" >--</td>
				<td valign="bottom" align="right" colspan="1" >
				    <xsl:value-of xmlns:xsl="http://www.w3.org/1999/XSL/Transform" select="format-number(0.16 * elster:Kz54, '#.##0,00&#160;&#8364;', 'geldformat')" />
				    <sup>*)</sup>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="elster:Kz55">
			<tr>
				<th scope="row" class="alLeft">
					<small>
						zum Steuersatz von 7
						<abbr class="help" title="von Hundert">v. H.</abbr>
					</small>
				</th>
				<td class="alRight">55</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz55"/>
					</xsl:call-template>
				</td>
				<td valign="bottom" align="center" colspan="1" >--</td>
				<td valign="bottom" align="right" colspan="1" >
				    <xsl:value-of xmlns:xsl="http://www.w3.org/1999/XSL/Transform" select="format-number(0.07 * elster:Kz55, '#.##0,00&#160;&#8364;', 'geldformat')" />
				    <sup>*)</sup>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="elster:Kz57">
			<tr>
				<th scope="row" class="alLeft">
					<small>zu anderen Steuersätzen</small>
				</th>
				<td class="alRight">57</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz57"/>
					</xsl:call-template>
				</td>
				<td class="alRight">58</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz58"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
	</xsl:template>
	<!--********************'innergemErwerbe'******-->
	<xsl:template name="innergemErwerbe">
		<h4>Steuerpflichtige innergemeinschaftliche Erwerbe</h4>
		<table>
			<xsl:call-template name="UStVA_table_header" />
			<xsl:if test="elster:Kz97">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							zum Steuersatz von 16
							<abbr class="help" title="von Hundert">v. H.</abbr>
						</small>
					</th>
					<td class="alRight">97</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz97"/>
						</xsl:call-template>
					</td>
					<td valign="bottom" align="center" colspan="1" >--</td>
					<td valign="bottom" align="right" colspan="1" >
					    <xsl:value-of xmlns:xsl="http://www.w3.org/1999/XSL/Transform" select="format-number(0.16 * elster:Kz97, '#.##0,00&#160;&#8364;', 'geldformat')" />
					    <sup>*)</sup>
					</td>
					</tr>
			</xsl:if>
			<xsl:if test="elster:Kz89">
				<tr>
					<th scope="row" class="alLeft">						
						<small>
							zum Steuersatz von 19
							<abbr class="help" title="von Hundert">v. H.</abbr>
						</small>
					</th>
					<td class="alRight">89</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz89"/>
						</xsl:call-template>
					</td>
					<td valign="bottom" align="center" colspan="1" >--</td>
					<td valign="bottom" align="right" colspan="1" >
					    <xsl:value-of xmlns:xsl="http://www.w3.org/1999/XSL/Transform" select="format-number(0.19 * elster:Kz89, '#.##0,00&#160;&#8364;', 'geldformat')" />
					    <sup>*)</sup>
					</td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz93">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							zum Steuersatz von 7
							<abbr class="help" title="von Hundert">v. H.</abbr>
						</small>
					</th>
					<td class="alRight">93</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz93"/>
						</xsl:call-template>
					</td>
					<td valign="bottom" align="center" colspan="1" >--</td>
					<td valign="bottom" align="right" colspan="1" >
					    <xsl:value-of xmlns:xsl="http://www.w3.org/1999/XSL/Transform" select="format-number(0.07 * elster:Kz93, '#.##0,00&#160;&#8364;', 'geldformat')" />
					    <sup>*)</sup>
					</td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz95">
				<tr>
					<th scope="row" class="alLeft">
						<small>zu anderen Steuersätzen</small>
					</th>
					<td class="alRight">95</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz95"/>
						</xsl:call-template>
					</td>
					<td class="alRight">98</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz98"/>
						</xsl:call-template>
					</td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz94">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							neuer Fahrzeuge von Lieferern ohne
							<abbr class="help" title="Umsatzsteuer-Identifikationsnummer">USt-IdNr.</abbr>
							zum allgemeinen Steuersatz
						</small>
					</th>
					<td class="alRight">94</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz94"/>
						</xsl:call-template>
					</td>
					<td class="alRight">96</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz96"/>
						</xsl:call-template>
					</td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Jahr[starts-with(.,'2004')]">
				<xsl:if test="elster:Kz42">
					<tr>
						<th scope="row" class="alLeft">
							<small>
								Lieferungen des ersten Abnehmers bei innergemeinschaftlichen Dreiecksgeschäften (§ 25b Absatz 2
								<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
							</small>
						</th>
						<td class="alRight">42</td>
						<td class="alRight">
							<xsl:call-template name="formatiereGeldbetrag">
								<xsl:with-param name="betrag" select="//elster:Kz42"/>
							</xsl:call-template>
						</td>
						<td colspan="2"></td>
					</tr>
				</xsl:if>
			</xsl:if>
		</table>
	</xsl:template>

	<!--******************** 'landwUms' !******-->
	<xsl:template name="landwUms">
		<h4>
			Umsätze land- und forstwirtschaftlicher Betriebe nach § 24
			<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
		</h4>
		<table>
			<xsl:call-template name="UStVA_table_header" />
			<xsl:if test="elster:Kz77">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							Lieferungen in das übrige Gemeinschaftsgebiet an Abnehmer mit
							<abbr class="help" title="Umsatzsteuer-Identifikationsnummer">USt-IdNr.</abbr>
						</small>
					</th>
					<td class="alRight">77</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz77"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>
			</xsl:if>
			<xsl:if test="elster:Kz76">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							Umsätze, für die eine Steuer nach § 24
							<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
							zu entrichten ist (Sägewerkserzeugnisse, Getränke und alkoholische Flüssigkeiten, z.B. Wein)
						</small>
					</th>
					<td class="alRight">76</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz76"/>
						</xsl:call-template>
					</td>
					<td class="alRight">80</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz80"/>
						</xsl:call-template>
					</td>
				</tr>
			</xsl:if>
		</table>
	</xsl:template>

	<!--******************** 'ergAng' ******-->
	<xsl:template name="ergAng">
		<h3>Ergänzende Angaben zu Umsätzen</h3>
		<table>
			<xsl:call-template name="UStVA_table_header" />
			<xsl:if test="elster:Kz42">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							Lieferungen des ersten Abnehmers bei innergemeinschaftlichen Dreiecksgeschäften (§ 25b Absatz 2
							<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
						</small>
					</th>
					<td class="alRight">42</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz42"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>
			</xsl:if>
			
			<xsl:if test="elster:Kz68">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							Steuerpflichtige Umsätze, für die der Leistungsempfänger 
							die Steuer nach § 13b Absatz 5 Satz 1 in Verbindung mit 
							Absatz 2 Nr. 10 <ABBR class="help" title="Umsatzsteuergesetz">UStG</ABBR> schuldet
						</small>
					</th>
					<td class="alRight">68</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz68"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>
			</xsl:if>

			<xsl:if test="elster:Jahr[not(starts-with(.,'2004'))]">
				<xsl:if test="elster:Kz60">
					<tr>
						<th scope="row" class="alLeft">
							<small>
								<xsl:choose>						
									<!-- vor 2010 -->
									<xsl:when test="2010 > elster:Jahr[substring(.,1,4)]">										
										Steuerpflichtige Umsätze im Sinne des § 13b Absatz 1 Satz 1 Nr. 1 bis 5
										<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>,
										für die der Leistungsempfänger die Steuer schuldet																			
									</xsl:when>							
									<!-- 2010 -->
									<xsl:when test="2010 = elster:Jahr[substring(.,1,4)]">			
										Steuerpflichtige Umsätze im Sinne des § 13b <abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>,
										für die der Leistungsempfänger die Steuer schuldet						
									</xsl:when>
									<!-- ab 2011 -->
									<xsl:when test="(2011 = elster:Jahr[substring(.,1,4)]) and ((6 >= elster:Zeitraum[substring(., 1, 2)]) or (elster:Zeitraum[substring(., 1, 2)] = 41) or (elster:Zeitraum[substring(., 1, 2)] = 42))">			
										Steuerpflichtige Umsätze im Sinne des § 13b <abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>,
										für die der Leistungsempfänger die Steuer schuldet						
									</xsl:when>
									<xsl:otherwise>
										Übrige steuerpflichtige Umsätze, für die der Leistungsempfänger die Steuer 
										nach § 13b Absatz 5 <abbr class="help" title="Umsatzsteuergesetz">UStG</abbr> schuldet
									</xsl:otherwise>
								</xsl:choose>		
							</small>													
						</th>
						<td class="alRight">60</td>
						<td class="alRight">
							<xsl:call-template name="formatiereGeldbetrag">
								<xsl:with-param name="betrag" select="//elster:Kz60"/>
							</xsl:call-template>
						</td>
						<td colspan="2"></td>
					</tr>
				</xsl:if>
			</xsl:if>
			
			<xsl:if test="elster:Kz21">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							Nicht steuerbare sonstige Leistungen gem. § 18b Satz 1 Nr. 2 <abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
						</small>										
					</th>
					<td class="alRight">21</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz21"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>			
			</xsl:if>				
			
			<!-- bis 2006 -->
			<xsl:if test="elster:Jahr[starts-with(.,'2005')] | elster:Jahr[starts-with(.,'2006')] ">
				<xsl:if test="elster:Kz45">
					<tr>
						<th scope="row" class="alLeft">
							<small>
								<strong>Im Inland nicht steuerbare Umsätze</strong>
							</small>
						</th>
						<td class="alRight">45</td>
						<td class="alRight">
							<xsl:call-template name="formatiereGeldbetrag">
								<xsl:with-param name="betrag" select="//elster:Kz45"/>
							</xsl:call-template>
						</td>
						<td colspan="2"></td>
					</tr>
				</xsl:if>
			</xsl:if>
			
			<!-- ab 2007 -->
			<xsl:if test="(elster:Jahr[starts-with(.,'2007')] | elster:Jahr[starts-with(.,'2008')] | elster:Jahr[starts-with(.,'2009')] ) and elster:Kz45">
				<tr>
					<th scope="row" class="alLeft">
					<small>
						<strong>Nicht steuerbare Umsätze</strong>
						(Leistungsort nicht im Inland)
					</small>
					</th>
					<td class="alRight">45</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz45"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>
			</xsl:if>
			
			<!-- ab 2010 -->
			<xsl:if test="(elster:Jahr[substring(., 1, 4)] > 2009) and elster:Kz45">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							<strong>Übrige nicht steuerbare Umsätze </strong>
							(Leistungsort nicht im Inland)
						</small>
					</th>
					<td class="alRight">45</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz45"/>
						</xsl:call-template>
					</td>
					<td colspan="2"></td>
				</tr>
			</xsl:if>
		</table>
	</xsl:template>

	<!--******************** 'Vorsteuer' *****-->
	<xsl:template name="Vorsteuer">
		<xsl:if test="elster:Kz66">
			<tr>
				<th scope="row" class="alLeft">
					<small>
						Vorsteuerbeträge aus Rechnungen von anderen Unternehmern (§ 15 Absatz 1 Satz 1 Nr. 1
						<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>),
						aus Leistungen im Sinne des § 13a Absatz 1 Nr. 6
						<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
						(§ 15 Absatz 1 Satz 1 Nr. 5)
						und aus innergemeinschaftlichen Dreiecksgeschäften (§25b Absatz 5
						<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
					</small>
				</th>
				<td class="alRight" colspan="2" />
				<td class="alRight">66</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz66"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="elster:Kz61">
			<tr>
				<th scope="row" class="alLeft">
					<small>
						Vorsteuerbeträge aus dem innergemeinschaftlichen Erwerb von Gegenständen (§ 15 Absatz 1 Satz 1 Nr. 3
						<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
					</small>
				</th>
				<td class="alRight" colspan="2" />
				<td class="alRight">61</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz61"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="elster:Kz62">
			<tr>
				<th scope="row" class="alLeft">
					<small>Entrichtete Einfuhrumsatzsteuer (§ 15 Absatz 1 Satz 1 Nr. 2 UStG)</small>
				</th>
				<td class="alRight" colspan="2" />
				<td class="alRight">62</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz62"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="elster:Kz67">
			<tr>
				<th scope="row" class="alLeft">
					<small>
						<xsl:choose>
							<xsl:when test="(2010 > elster:Jahr[substring(., 1, 4)] ) ">
								<!-- -bis 2010 --> 
								Vorsteuerbeträge aus Leistungen im Sinne des § 13b Absatz 1
								<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
								(§ 15 Absatz 1 Satz 1 Nr. 4
								<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
							</xsl:when>
							<xsl:otherwise>
								<!-- ab 2010 -->
								Vorsteuerbeträge aus Leistungen im Sinne des § 13b 
								<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
								 (§ 15 Absatz 1 Satz 1 Nr. 4
								 <abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
							</xsl:otherwise>
						</xsl:choose>						
					</small>
				</th>
				<td class="alRight" colspan="2" />
				<td class="alRight">67</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz67"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="elster:Kz63">
			<tr>
				<th scope="row" class="alLeft">
					<small>
						Vorsteuerbeträge, die nach allgemeinen Durchschnittssätzen berechnet sind (§§ 23 und 23a
						<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
					</small>
				</th>
				<td class="alRight" colspan="2" />
				<td class="alRight">63</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz63"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="elster:Kz64">
			<tr>
				<th scope="row" class="alLeft">
					<small>
						Berichtigung des Vorsteuerabzugs (§ 15a
						<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
					</small>
				</th>
				<td class="alRight" colspan="2" />
				<td class="alRight">64</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz64"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
		<xsl:if test="elster:Kz59">
			<tr>
				<th scope="row" class="alLeft">
					<small>
						Vorsteuerabzug für innergemeinschaftliche Lieferungen neuer Fahrzeuge außerhalb eines Unternehmens (§ 2a
						<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
						sowie von Kleinunternehmern im Sinne des § 19 Absatz 1
						<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>
						(§ 15 Absatz 4a
						<abbr class="help" title="Umsatzsteuergesetz">UStG</abbr>)
					</small>
				</th>
				<td class="alRight" colspan="2" />
				<td class="alRight">59</td>
				<td class="alRight">
					<xsl:call-template name="formatiereGeldbetrag">
						<xsl:with-param name="betrag" select="//elster:Kz59"/>
					</xsl:call-template>
				</td>
			</tr>
		</xsl:if>
	</xsl:template>

	<!--******************** DAUERFRISTVERLAENGERUNG **************** -->
	<xsl:template name="DV">
		<h2>
			I. Antrag auf Dauerfristverlängerung
		</h2>
		<p>Ich beantrage, die Fristen für die Abgabe der Umsatzsteuer-Voranmeldungen und für die Entrichtung der Umsatzsteuer-Vorauszahlungen um einen Monat zu verlängern.</p>
	</xsl:template>

	<!-- ******************* SONDERVORAUSZAHLUNG *********************-->
	<xsl:template name="SVZ">
		<h2>
			I. Antrag auf Dauerfristverlängerung
		</h2>
		<p>Ich beantrage, die Fristen für die Abgabe der Umsatzsteuer-Voranmeldungen und für die Entrichtung der Umsatzsteuer-Vorauszahlungen um einen Monat zu verlängern.</p>
		<p class="alCenter">- Dieser Abschnitt ist gegenstandslos, wenn bereits Dauerfristverlängerung gewährt worden ist. -</p>
		<br />
		<h2>
			II. Berechnung und Anmeldung der Sondervorauszahlung auf die Steuer für das Kalenderjahr
			<xsl:value-of select="elster:Jahr" />
			von Unternehmern, die ihre Voranmeldungen monatlich abzugeben haben
		</h2>

		<table>
			<tr>
				<td style="width:77%"></td>
				<th style="width:4%" class="alRight">
					<abbr title="Kennziffer" class="help">Kz</abbr>
				</th>
				<th style="width:19%" class="alRight">Betrag</th>
			</tr>
			<xsl:if test="elster:Kz38">
				<tr>
					<th scope="row" class="alLeft">
						<small>
							Summe der verbleibenden Umsatzsteuer-Vorauszahlungen zuzüglich der angerechneten Sondervorauszahlung für das Kalenderjahr
							<xsl:value-of select="(elster:Jahr)-1" />
							; davon 1/11 = Sondervorauszahlung
							<xsl:value-of select="elster:Jahr" />
						</small>
					</th>
					<td class="alRight">38</td>
					<td class="alRight">
						<xsl:call-template name="formatiereGeldbetrag">
							<xsl:with-param name="betrag" select="//elster:Kz38"/>
						</xsl:call-template>
					</td>
				</tr>
			</xsl:if>
		</table>
		<br />

		<!-- ***************** Sonstige Angaben *****************-->
		<xsl:if test="elster:Kz29 | elster:Kz26">
			<h2>Sonstige Angaben</h2>
			<table>
				<tr>
					<td></td>
					<th style="width:4%" class="alRight">
						<abbr title="Kennziffer" class="help">Kz</abbr>
					</th>
					<th style="width:18%" class="alRight">Wert</th>
				</tr>
				<xsl:if test="elster:Kz29">
					<tr>
						<th scope="row" class="alLeft">
							<small>Verrechnung des Erstattungsbetrags erwünscht/ Erstattungsbetrag ist abgetreten</small>
						</th>
						<td class="alRight">29</td>
						<td class="alRight">
							<xsl:value-of select="elster:Kz29" />
						</td>
					</tr>
				</xsl:if>
				<xsl:if test="elster:Kz26">
					<tr>
						<th scope="row" class="alLeft">
							<small>Die Einzugsermächtigung wird ausnahmsweise (z.B. wegen Verrechungswünschen) für die Sondervorauszahlung dieses Jahres widerrufen.</small>
						</th>
						<td class="alRight">26</td>
						<td class="alRight">
							<xsl:value-of select="elster:Kz26" />
						</td>
					</tr>
				</xsl:if>
			</table>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>
