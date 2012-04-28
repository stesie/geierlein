<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- StNrVerifier.xml_hash:43457111117237510540213195504186669350801435616035555064045238043746427975625 -->
<!-- Version 2.0 -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:elster="http://www.elster.de/2002/XMLSchema" exclude-result-prefixes="elster">
<!-- Template zur Visualisierung der Steuernummer -->
<xsl:template name="formatiereSteuernummer">
<xsl:param name="steuernummer" />
<xsl:choose>
<xsl:when test="starts-with($steuernummer, '40')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '32')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '28')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,3,2)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '22')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,3,2)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '21')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,3,2)"/>
<xsl:text> </xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text> </xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '30')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '51')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,4)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,10,3)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '52')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,4)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,10,3)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '53')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,4)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,10,3)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '54')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,4)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,10,3)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '55')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,4)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,10,3)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '56')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,4)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,10,3)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '24')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,3,2)"/>
<xsl:text> </xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text> </xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '41')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '31')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '11')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,3,2)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '10')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '26')" >
<xsl:text>0</xsl:text>
<xsl:value-of select="substring($steuernummer,3,2)"/>
<xsl:text> </xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text> </xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '23')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,3,2)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '91')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '92')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,2,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
<xsl:when test="starts-with($steuernummer, '27')" >
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,3,2)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,6,3)"/>
<xsl:text>/</xsl:text>
<xsl:value-of select="substring($steuernummer,9,4)"/>
<xsl:text></xsl:text>
<xsl:value-of select="substring($steuernummer,13,1)"/>
</xsl:when>
</xsl:choose>
</xsl:template>
</xsl:stylesheet>
