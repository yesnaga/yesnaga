const { InvalidInputError } = require('./Errors');
const { directions, ensureValidDirection } = require('./Direction');
const { tiles: defaultTiles, players: defaultPlayers } = require('./defaults');

const ensureValidIndex = (index) => {
	if (index < 0 || index > 19) {
		throw new InvalidInputError(`Tile index "${index}" is invalid.`);
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

	isOccupied(tile) {
		ensureValidIndex(tile);
		return Object.values(this.players).some((p) => p.includes(tile));
	}
}

module.exports = {
	Board,
};
