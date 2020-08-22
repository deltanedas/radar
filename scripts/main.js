/*
	Copyright (c) DeltaNedas 2020

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const ui = require("ui-lib/library");
const scanner = require("radar/scanner");
require("radar/manual");

// Frames a result lasts for
const resultAge = 60 * 20;

var query = "---";

ui.addTable("top", "radar", radar => {
	radar.defaults().padRight(6);

	radar.button(Icon.zoom, Styles.clearTransi, () => {
		scanner.scan(query);
	}).size(40);

	radar.button(Icon.cancel, Styles.clearTransi, () => {
		scanner.cancel();
		Vars.ui.showInfoToast("Aborted scan", 3);
	}).size(40);

	radar.field("Radar", input => {
		query = input;
	}).width(100);

	radar.label(scanner.label);
});

var region;
ui.onLoad(() => {
	region = Core.atlas.find("radar-blip");
});

const tmpVec = new Vec2();
ui.addEffect((w, h) => {
	Draw.color();
	for (var i in scanner.results) {
		var res = scanner.results[i];
		var scl = res.age / resultAge;
		if (++res.age > resultAge) {
			scanner.results.splice(i, i);
		}

		// Project the tiles position onto the screen
		tmpVec.set(res.tile.worldx(), res.tile.worldy());
		const pos = Core.camera.project(tmpVec);
		// Don't draw off-screen blips
		if (pos.x < 0 || pos.y < 0 || pos.x > w || pos.y > h) {
			continue;
		}

		Draw.alpha(1 - scl);
		// 4 rotations
		Draw.rect(region, pos.x, pos.y, scl * 1440);
	}
	Draw.reset();
});
