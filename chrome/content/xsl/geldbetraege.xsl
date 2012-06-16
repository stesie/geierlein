<?xml version="1.0" encoding="UTF-8"?>
<!-- Version 2.0 -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:elster="http://www.elster.de/2002/XMLSchema"
  exclude-result-prefixes="elster">

  <!--
    Template zur Visualisierung der Beträge in Postfachnachrichten der Anmeldungssteuern
  -->

	<xsl:decimal-format name="geldformat" decimal-separator="," grouping-separator="." />

	<xsl:template name="formatiereGeldbetrag">
		<!-- formatiert eine "Geldbetrags-Zeichenkette" nach deutscher Norm
			 input  1234567.89
		     output 1.234.567,89 EuroZeichen
		oder wenn keine Nachkommastellen existieren
		     input  1234567
		     output 1.234.567 EuroZeichen-->
		 
		 
		<xsl:param name="betrag"/>
		
		<xsl:if test="$betrag">
			<xsl:call-template name="formatiereOhneOderMitGenau2Nachkommastellen">
				<xsl:with-param name="zahl" select="$betrag"/>
			</xsl:call-template>   
			
			<!-- non-breaking-space und Euro-Zeichen hinzufügen -->
			<xsl:text>&#160;&#8364;</xsl:text>	
		
		</xsl:if>
	</xsl:template>
	
	<xsl:template name="formatiereOhneOderMitGenau2Nachkommastellen">
		<!-- formatiert eine "Zahlenwert-Zeichenkette" nach deutscher Norm
			 input  1234567.89
		     output 1.234.567,89
		oder wenn keine Nachkommastellen existieren
		     input  1234567
		     output 1.234.567 -->
		     
		<xsl:param name="zahl"/>
		<xsl:if test="$zahl">

			<xsl:choose>			
				<xsl:when test=" contains($zahl,'.') ">
					<!-- die $zahl enthält einen Dezimalpunkt -->
					<xsl:value-of select="format-number($zahl, '#.##0,00', 'geldformat')" />	
				</xsl:when>	
				<xsl:otherwise>
					<!-- die $zahl enthält keinen Dezimalpunkt -->
					<xsl:value-of select="format-number($zahl, '#.##0', 'geldformat')" />
				</xsl:otherwise>
			</xsl:choose>
		
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>
