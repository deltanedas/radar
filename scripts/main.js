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
var ui = require("ui-lib/library");

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

var result = "", query = "", lastFound = {x: 0, y: 0};

const findRow = (name, x) => {
	if (x == Vars.world.width()) {
		result = "[red]X[]";
		lastFound.x = lastFound.y = 0;
		return
	}

	const tiles = Vars.world.tiles;
	const col = tiles[x];
	if (!col) return;

	var tile;
	for (var y = (x == lastFound.x ? lastFound.y : 0); y < Vars.world.height(); y++) {
		tile = col[y];
		if (tile && valid(name, [tile.block(), tile.floor(), tile.overlay()])) {
			result = "[green](" + x + ", " + y + ")[]";
			lastFound.x = x;
			// Prevent finding the same thing without looping over
			lastFound.y = y + 1;
			if (this.global.tracker) {
				this.global.tracker.setMarker({x: x * Vars.tilesize, y: y * Vars.tilesize});
			}
			return;
		}
	}

	// Thread it in a lua-style coroutine as to not block for a year
	Core.app.post(run(() => {
		findRow(name, x + 1);
	}));
};

const find = name => {
	findRow(name, lastFound.x);
};

ui.addTable("top", "radar", radar => {
	radar.addImageButton(Icon.zoom, Styles.clearTransi, run(() => {
		result = "...";
		find(query);
	}));
	radar.addField("Radar", cons(input => {
		query = input;
	})).width(100);
	radar.label(prov(() => result));
});
