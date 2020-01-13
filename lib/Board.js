const defaultTiles = require('./defaultTiles');
const { InvalidTileIndexError } = require('./Errors');

const ensureValidIndex = (index) => {
	if (index < 0 || index > 19) {
		throw new InvalidTileIndexError();
	}
};

class Board {
	constructor() {
		this.tiles = { ...defaultTiles };
	}

	getNeighbours(tile) {
		ensureValidIndex(tile);
		return this.tiles[tile].neighbours;
	}
}

module.exports = {
	Board,
};
