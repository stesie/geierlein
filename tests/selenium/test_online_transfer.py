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

class GeierleinTestOnlineTransfer(GeierleinTestCase):
    def fill_form(self, use_specialchars):
        driver = self.driver

        if use_specialchars:
            extra = u"äöüÄÖÜß <>'\"&"
        else:
            extra = u""

        # fill address part
        driver.find_element_by_id("name").clear()
        driver.find_element_by_id("name").send_keys(u"Stefan Siegl" + extra)
        driver.find_element_by_id("strasse").clear()
        driver.find_element_by_id("strasse").send_keys(u"Ph-Zorn-Str. 30" + extra)
        driver.find_element_by_id("plz").clear()
        driver.find_element_by_id("plz").send_keys("91522")
        driver.find_element_by_id("ort").clear()
        driver.find_element_by_id("ort").send_keys(u"Ansbach" + extra)

        # choose federal state Bavaria and enter tax number
        Select(driver.find_element_by_id("land")).select_by_visible_text("Bayern")
        driver.find_element_by_id("steuernummer").clear()
        driver.find_element_by_id("steuernummer").send_keys("203/698/02950")

        # set turnover with 19% VAT = 100 EUR
        driver.find_element_by_id("Kz81").clear()
        driver.find_element_by_id("Kz81").send_keys("100")

    def trigger_send(self, use_signature):
        driver = self.driver

        # open send dialog
        driver.find_element_by_id("send-testcase").click()

        # set use_signature state
        if driver.find_element_by_id("sig-enable").is_selected() != use_signature:
            driver.find_element_by_id("sig-enable").click()

        if use_signature:
            driver.find_element_by_id("pfxfile").send_keys("/home/stesie/Projekte/geierlein/tests/_files/test-softpse_rsapss.pfx")
            driver.find_element_by_id("pincode").clear()
            driver.find_element_by_id("pincode").send_keys("123456")

        driver.find_element_by_id("send-final").click()

        # wait for protocol
        self.wait_for_visible("id", "protocol")

        # ... and finally close the protocol dialog
        driver.find_element_by_css_selector("#protocol .modal-header a.close").click()


    def test_send_nosig_nospecial(self):
        self.driver.get(self.base_url + "/")
        self.fill_form(False)
        self.trigger_send(False)

    def test_send_nosig_special(self):
        self.driver.get(self.base_url + "/")
        self.fill_form(True)
        self.trigger_send(False)

    def test_send_sig_nospecial(self):
        self.driver.get(self.base_url + "/")
        self.fill_form(False)
        self.trigger_send(True)

    def test_send_sig_special(self):
        self.driver.get(self.base_url + "/")
        self.fill_form(True)
        self.trigger_send(True)
