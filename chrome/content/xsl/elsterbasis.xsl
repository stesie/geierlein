<?xml version="1.0" encoding="UTF-8"?>
<!-- Version 2.0 -->
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:elster="http://www.elster.de/2002/XMLSchema" 
  exclude-result-prefixes="elster">

  <!-- Schreibt die Testfall-zeile, falls es sich um einen Testfall handelt -->
  <xsl:template name="testfall">

    <!-- für Verfahrensnachrichten -->
    <xsl:if test="//elster:TransferHeader/elster:Testmerker != ''">
   		<xsl:if test="//elster:TransferHeader/elster:Testmerker != '0'">
   			<xsl:if test="//elster:TransferHeader/elster:Testmerker != '000000000'">
        		<xsl:call-template name="Testmerker" />
        	</xsl:if>
    	</xsl:if>
    </xsl:if>
    
    <!-- für Fehlernachrichten -->
    <xsl:if test="//fehler/testmerker != ''">
      <xsl:if test="//fehler/testmerker != '0'">
      	<xsl:if test="//fehler/testmerker != '000000000'">
        	<xsl:call-template name="Testmerker" />
        </xsl:if>
      </xsl:if>
    </xsl:if>
    
    <!-- für den ELMA5-Statusbericht -->
    <xsl:if test="@testmerker != ''">
		<xsl:if test="@testmerker != '0'">
			<xsl:if test="@testmerker != '000000000'">
				<xsl:call-template name="Testmerker"/>
			</xsl:if>
		</xsl:if>
	</xsl:if>

  </xsl:template>

  <!-- Schreibt die eigentliche *** TESTFALL *** -Zeile -->
  <xsl:template name="Testmerker">
    <div class="clear"></div>
    <div>
      <xsl:attribute name="style">
      width: 33.3%;margin: 0;padding: 0;float: left;font-weight: bold;font-size: 1.2em;text-align: left;
      </xsl:attribute>
      *** TESTFALL ***
    </div>
    <div>
      <xsl:attribute name="style">
      width: 33.3%;margin: 0;padding: 0;float: left;font-weight: bold;font-size: 1.2em;text-align: center;
      </xsl:attribute>
      *** TESTFALL ***
    </div>
    <div>
      <xsl:attribute name="style">
      width: 33.3%;margin: 0;padding: 0;float: left;font-weight: bold;font-size: 1.2em;text-align: right;
      </xsl:attribute>
      *** TESTFALL ***
    </div>
    <div class="clear"></div>
  </xsl:template>
  
  <xsl:template name="ElsterInfo">
  	<!-- für Verfahrensnachrichten -->
    <xsl:if test="//elster:Zusatz/elster:ElsterInfo" >
      <p><strong>Wichtige Mitteilung: </strong></p>
      <xsl:for-each select="//elster:Zusatz/elster:ElsterInfo">
        <p>
          <xsl:value-of select = "." />
        </p>
      </xsl:for-each>
    </xsl:if>
    <!-- für Fehlernachrichten -->
    <xsl:if test="//fehler/ElsterInfo" >
      <p><strong>Wichtige Mitteilung: </strong></p>
      <xsl:for-each select="//fehler/ElsterInfo">
        <p>
          <xsl:value-of select = "." />
        </p>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
