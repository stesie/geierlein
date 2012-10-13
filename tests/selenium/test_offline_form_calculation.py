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

class GeierleinTestOfflineFormCalculation(GeierleinTestCase):
    def test_multiplication(self):
        driver = self.driver
        driver.get(self.base_url + "/")
        driver.find_element_by_id("schnell").click()

        data = [("Kz81", "Kz81-calc", "19,00"),
                ("Kz86", "Kz86-calc", "7,00"),
                ("Kz89", "Kz89-calc", "19,00"),
                ("Kz93", "Kz93-calc", "7,00")]

        for row in data:
            in_elem = driver.find_element_by_id(row[0])
            in_elem.clear()
            in_elem.send_keys("100")

            out_elem = driver.find_element_by_id(row[1])
            self.assertEqual(row[2], out_elem.get_attribute("value"));

    def test_summarize_kz83(self):
        driver = self.driver
        driver.get(self.base_url + "/")
        driver.find_element_by_id("schnell").click()

        data = [("Kz81",   "19,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz86",    "7,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz36",  "100,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz80",  "100,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz96",  "100,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz98",  "100,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz89",   "19,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz93",    "7,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz85",  "100,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz74",  "100,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz79",  "100,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz53",  "100,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz47",  "100,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz65",  "100,00", ["ust", "ust-vost", "traglast", "Kz83"]),
                ("Kz66", "-100,00", [       "ust-vost", "traglast", "Kz83"]),
                ("Kz61", "-100,00", [       "ust-vost", "traglast", "Kz83"]),
                ("Kz62", "-100,00", [       "ust-vost", "traglast", "Kz83"]),
                ("Kz67", "-100,00", [       "ust-vost", "traglast", "Kz83"]),
                ("Kz63", "-100,00", [       "ust-vost", "traglast", "Kz83"]),
                ("Kz64", "-100,00", [       "ust-vost", "traglast", "Kz83"]),
                ("Kz59", "-100,00", [       "ust-vost", "traglast", "Kz83"]),
                ("Kz69",  "100,00", [                   "traglast", "Kz83"]),
                ("Kz39", "-100,00", [                               "Kz83"])]

        for row in data:
            in_elem = driver.find_element_by_id(row[0])
            in_elem.send_keys("100")

            for out_elem in row[2]:
                out_elem = driver.find_element_by_id(out_elem)
                self.assertEqual(row[1], out_elem.get_attribute("value"));

            in_elem.clear()
