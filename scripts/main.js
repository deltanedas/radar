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

(() => {

const ui = require("ui-lib/library")

// Frames a result lasts for
const resultAge = 60 * 20;

const valid = (name, blocks) => {
	var block;
	for (var i in blocks) {
		block = blocks[i];
		if (block.name.includes(name)) {
			return true;
		}
	}
	return false;
};

// TODO: search in fixed tile count chunks (say 10x10) per tick instead of an entire col

var results = [], query = "";

const findRow = (name, x) => {
	if (x == Vars.world.width()) {
		return
	}

	const tiles = Vars.world.tiles;
	const col = tiles[x];
	if (!col) return;

	var tile;
	for (var y = 0; y < Vars.world.height(); y++) {
		tile = col[y];
		if (tile && valid(name, [tile.block(), tile.floor(), tile.overlay()])) {
			results.push({tile: tile, age: 0});
			if (this.global.tracker) {
				this.global.tracker.setMarker({x: x * Vars.tilesize, y: y * Vars.tilesize});
			}
		}
	}

	// Thread it in a lua-style coroutine as to not block for a year
	Core.app.post(run(() => {
		findRow(name, x + 1);
	}));
};

const find = name => {
	findRow(name, 0);
};

Events.on(EventType.WorldLoadEvent, run(() => {
	results = [];
}));

ui.addTable("top", "radar", radar => {
	radar.addImageButton(Icon.zoom, Styles.clearTransi, run(() => {
		results = [];
		find(query);
	}));
	radar.addField("Radar", cons(input => {
		query = input;
	})).width(100);
	radar.label(prov(() => "" + results.length));
});

var region;
ui.onLoad(() => {
	region = Core.atlas.find("radar-blip");
});

const tmpVec = new Vec2();
ui.addEffect((w, h) => {
	Draw.color();
	for (var i in results) {
		var res = results[i];
		var scl = res.age / resultAge;
		if (++res.age > resultAge) {
			results.splice(i, i);
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

})();
