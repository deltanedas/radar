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

// How many tiles to scan each tick, affects lag
const chunkSize = 100;

const scanner = {
	results: [],
	query: null,
	chunk: 0,
	limit: null
};

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

const scanChunk = () => {
	const chunk = scanner.chunk++ * chunkSize;
	const name = scanner.query;

	/* Scan the chunk now */
	for (var i = 0; i < chunkSize; i++) {
		var x = (chunk + i) % Vars.world.width();
		var y = Math.ceil((chunk + i) / Vars.world.width());
		var tile = Vars.world.tile(x, y);
		if (tile && valid(name, [tile.block(), tile.floor(), tile.overlay()])) {
			scanner.results.push({tile: tile, age: 0});
			if (this.global.tracker) {
				this.global.tracker.setMarker({x: x * Vars.tilesize, y: y * Vars.tilesize});
			}
		}
	}

	// Stop scanning when the whole map is done
	if (scanner.chunk == scanner.limit) {
		scanner.query = null;
	}
};

Events.on(EventType.WorldLoadEvent, run(() => {
	scanner.limit = Vars.world.width() * Vars.world.height() / chunkSize;
	scanner.results = [];
}));

Events.on(EventType.Trigger.update, run(() => {
	if (scanner.query !== null) {
		scanChunk();
	}
}));

scanner.scan = (name) => {
	scanner.results = [];
	scanner.chunk = 0;
	scanner.query = name;
};

module.exports = scanner;

})();
