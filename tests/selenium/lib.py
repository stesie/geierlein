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

from selenium import webdriver
import unittest, time, os

class GeierleinTestCase(unittest.TestCase):
    def setUp(self):
        if os.environ["WEBDRIVER"] == "Chrome":
            self.driver = webdriver.Chrome()
        elif os.environ["WEBDRIVER"] == "Firefox" or True:
            self.driver = webdriver.Firefox()

        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:4080/"
        self.verificationErrors = []

    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

    def wait_for_visible(self, how, what, state = True):
        for i in range(30):
            try:
                if self.driver.find_element(how, what).is_displayed() == state:
                    break
            except:
                pass

            time.sleep(1)
        else:
            self.fail("time out")

    def wait_for_not_visible(self, how, what):
        return self.wait_for_visible(how, what, False)
