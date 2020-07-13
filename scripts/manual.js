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

try {
	const rtfm = require("rtfm/library");

	rtfm.addPage("Radar", [
		"# How to use the radar",
		"To access the radar, click the top dropdown button.",
		"Search for a block you want to find in the [coral]text field[].",
		// Thats not Iconc.zoom but on 104.10 it's a weird message thing
		"The [coral][] button will start a search and clear previous results.",
		"The [coral][] button will stop searching, but keep existing results.",
		"Next to the input field is the found blocks count.",

		"# Input format",
		"The block' name may include a team after a [coral]$[] symbol.",
		"[stat]If specified and valid[], only blocks on this team will be found.",
		"Example to find enemy duos: [green]duo$crux[]",

		"# What is found",
		"A tile's block, floor and overlay are scanned.",
		"Ores, liquids, spawns, etc. therefore can be found.",
		"When found, a block gets a green blip that slowly fades away, sonar style."
	]);

	module.exports = true;
} catch (e) {
	Log.warn("Please install [#00aaff]DeltaNedas/rtfm[] to view the radar manual.");
	module.exports = false;
}
