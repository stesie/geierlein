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

class GeierleinTestOfflineUnfoldWholeForm(GeierleinTestCase):
    def test_unfold_refold(self):
        driver = self.driver
        driver.get(self.base_url + "/")

        # Kz41 should not be visible if short-form mode is active
        # hence it should not be visible at startup.
        self.assertEqual(False, self.driver.find_element_by_id("Kz41").is_displayed())

        # disable short-form-mode, Kz41 should become visible
        driver.find_element_by_id("schnell").click()
        self.wait_for_visible('id', 'Kz41')

        # enable short-form-mode again, Kz41 should become hidden again
        driver.find_element_by_id("schnell").click();
        self.wait_for_not_visible('id', 'Kz41')
