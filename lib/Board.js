const defaultTiles = require('./defaultTiles');

class Board {
	constructor() {
		this.tiles = { ...defaultTiles };
	}
}

module.exports = {
	Board,
};
