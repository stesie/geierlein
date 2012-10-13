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

from lib import GeierleinTestCase

class GeierleinTestOfflineFormValidation(GeierleinTestCase):
    def test_simple_fields(self):
        driver = self.driver
        driver.get(self.base_url + "/")
        driver.find_element_by_id("schnell").click()
        self.wait_for_visible('id', 'Kz21')

        #                +INT   -INT    +FLOAT  -FLOAT
        data = [("Kz21", True,  True,   False,  False),
                ("Kz35", True,  True,   False,  False),
                ("Kz39", True,  False,  True,   False),
                ("Kz41", True,  True,   False,  False),
                ("Kz42", True,  True,   False,  False),
                ("Kz43", True,  True,   False,  False),
                ("Kz44", True,  True,   False,  False),
                ("Kz45", True,  True,   False,  False),
                ("Kz46", True,  True,   False,  False),
                ("Kz48", True,  True,   False,  False),
                ("Kz49", True,  True,   False,  False),
                ("Kz52", True,  True,   False,  False),
                ("Kz59", True,  True,   True,   True),
                ("Kz60", True,  True,   False,  False),
                ("Kz61", True,  True,   True,   True),
                ("Kz62", True,  True,   True,   True),
                ("Kz63", True,  True,   True,   True),
                ("Kz64", True,  True,   True,   True),
                ("Kz65", True,  True,   True,   True),
                ("Kz66", True,  True,   True,   True),
                ("Kz67", True,  True,   True,   True),
                ("Kz68", True,  True,   False,  False),
                ("Kz69", True,  True,   True,   True),
                ("Kz73", True,  True,   False,  False),
                ("Kz76", True,  True,   False,  False),
                ("Kz77", True,  True,   False,  False),
                ("Kz78", True,  True,   False,  False),
                ("Kz81", True,  True,   False,  False),
                ("Kz84", True,  True,   False,  False),
                ("Kz86", True,  True,   False,  False),
                ("Kz89", True,  True,   False,  False),
                ("Kz91", True,  True,   False,  False),
                ("Kz93", True,  True,   False,  False),
                ("Kz94", True,  True,   False,  False),
                ("Kz95", True,  True,   False,  False)]

        for row in data:
            in_elem = driver.find_element_by_id(row[0])
            in_elem.clear()

            c_group = driver.find_element_by_xpath('//input[@id="' + row[0] + '"]/ancestor::*[contains(@class, "control-group")]')
            self.assertTrue(c_group.get_attribute("class").find("error") == -1)

            in_elem.send_keys("Hallo")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)

            in_elem.clear()
            in_elem.send_keys("2342")
            self.assertEqual(c_group.get_attribute("class").find("error") == -1, row[1])

            in_elem.clear()
            in_elem.send_keys("0")
            self.assertEqual(c_group.get_attribute("class").find("error") == -1, row[1])

            in_elem.clear()
            in_elem.send_keys("-4223")
            self.assertEqual(c_group.get_attribute("class").find("error") == -1, row[2])

            in_elem.clear()
            in_elem.send_keys("42.23")
            self.assertEqual(c_group.get_attribute("class").find("error") == -1, row[3])

            in_elem.clear()
            in_elem.send_keys("-23.42")
            self.assertEqual(c_group.get_attribute("class").find("error") == -1, row[4])


    def test_combined_fields(self):
        driver = self.driver
        driver.get(self.base_url + "/")
        driver.find_element_by_id("schnell").click()
        self.wait_for_visible('id', 'Kz36')

        data = [("Kz36", "Kz35"),
                ("Kz47", "Kz46"),
                ("Kz53", "Kz52"),
                ("Kz74", "Kz73"),
                ("Kz96", "Kz94"),
                ("Kz98", "Kz95"),
                ("Kz79", "Kz78"),
                ("Kz80", "Kz76"),
                ("Kz85", "Kz84")]

        for row in data:
            in_elem = driver.find_element_by_id(row[0])
            in_elem.clear()

            c_group = driver.find_element_by_xpath('//input[@id="' + row[0] + '"]/ancestor::*[contains(@class, "control-group")]')
            self.assertTrue(c_group.get_attribute("class").find("error") == -1)

            com_elem = driver.find_element_by_id(row[1])
            com_elem.clear()

            # try positive integers
            com_elem.send_keys("42")
            in_elem.send_keys("23")
            self.assertTrue(c_group.get_attribute("class").find("error") == -1)

            com_elem.clear()
            com_elem.send_keys("23")
            in_elem.clear()
            in_elem.send_keys("42")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)

            in_elem.clear()
            in_elem.send_keys("23")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)

            in_elem.clear()
            in_elem.send_keys("-23")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)

            # try positive floats
            com_elem.clear()
            com_elem.send_keys("42,23")
            in_elem.clear()
            in_elem.send_keys("23,42")
            self.assertTrue(c_group.get_attribute("class").find("error") == -1)

            com_elem.clear()
            com_elem.send_keys("23,42")
            in_elem.clear()
            in_elem.send_keys("42,23")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)

            in_elem.clear()
            in_elem.send_keys("23,42")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)

            in_elem.clear()
            in_elem.send_keys("-23,42")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)

            # try negative integers
            com_elem.clear()
            com_elem.send_keys("-42")
            in_elem.clear()
            in_elem.send_keys("-23")
            self.assertTrue(c_group.get_attribute("class").find("error") == -1)

            com_elem.clear()
            com_elem.send_keys("-23")
            in_elem.clear()
            in_elem.send_keys("-42")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)

            in_elem.clear()
            in_elem.send_keys("-23")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)

            in_elem.clear()
            in_elem.send_keys("23")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)

            # try negative floats
            com_elem.clear()
            com_elem.send_keys("-42,23")
            in_elem.clear()
            in_elem.send_keys("-23,42")
            self.assertTrue(c_group.get_attribute("class").find("error") == -1)

            com_elem.clear()
            com_elem.send_keys("-23,42")
            in_elem.clear()
            in_elem.send_keys("-42,23")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)

            in_elem.clear()
            in_elem.send_keys("-23,42")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)

            in_elem.clear()
            in_elem.send_keys("23,42")
            self.assertFalse(c_group.get_attribute("class").find("error") == -1)
