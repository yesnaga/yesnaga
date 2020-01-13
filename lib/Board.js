const { InvalidTileIndexError } = require('./Errors');
const { tiles: defaultTiles, players: defaultPlayers } = require('./defaults');

const ensureValidIndex = (index) => {
	if (index < 0 || index > 19) {
		throw new InvalidTileIndexError();
	}
};

class Board {
	constructor(tiles = defaultTiles, players = defaultPlayers) {
		this.tiles = { ...tiles };
		this.players = { ...players };
	}

	getNeighbours(tile) {
		ensureValidIndex(tile);
		return this.tiles[tile].neighbours;
	}
}

module.exports = {
	Board,
};
