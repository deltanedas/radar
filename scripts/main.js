var ui = require("ui-lib/library");

const valid = (name, block) => {
	return block === null ? false : block.name.includes(name);
};

var result = "Radar", query = "";

const findRow = (name, x) => {
	if (x == Vars.world.width()) {
		result = "[red]X[]";
		return
	}

	const tiles = Vars.world.tiles;
	const col = tiles[x];
	var tile;
	for (var y = 0; y < Vars.world.height(); y++) {
		tile = col[y];
		if (valid(name, tile.block()) || valid(name, tile.floor())) {
			result = "[green](" + x + ", " + y + ")[]";
			return;
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

ui.addTable("top", "radar", radar => {
	print("Radar " + radar)
	radar.defaults().width(100).height(50);
	radar.addField("Search", cons(input => {
		query = input;
	}));
	radar.addImageButton(Icon.zoom, Styles.clearPartiali, run(() => {
		result = "...";
		find(query);
	}));
	radar.label(prov(() => result));
});
