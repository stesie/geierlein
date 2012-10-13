#!/usr/bin/env python
# -*- coding: UTF-8 -*-
#
# @author Stefan Siegl
#
# Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

from selenium.webdriver.support.ui import Select
from lib import GeierleinTestCase

class GeierleinTestOfflineTaxnumberSuggest(GeierleinTestCase):
    def test_taxnumber_suggest(self):
    	driver = self.driver
        driver.get(self.base_url + "/")

        Select(driver.find_element_by_id("land")).select_by_visible_text("Bayern")
	v = driver.find_element_by_id('steuernummer').get_attribute("placeholder")
	self.assertEqual("123/123/12345", v)

        Select(driver.find_element_by_id("land")).select_by_visible_text(u"Baden-Württemberg")
	v = driver.find_element_by_id('steuernummer').get_attribute("placeholder")
	self.assertEqual("12345/12345", v)
