var ui = require("ui-lib/library");

const valid = (name, block) => {
	return block === null ? false : block.name.includes(name);
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
	var tile;
	for (var y = (x == lastFound.x ? lastFound.y : 0); y < Vars.world.height(); y++) {
		tile = col[y];
		if (valid(name, tile.block()) || valid(name, tile.floor())) {
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
