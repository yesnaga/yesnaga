const { InvalidInputError } = require('./Errors');
const { directions: allDirections, ensureValidDirection } = require('./Direction');
const { tiles: defaultTiles, players: defaultPlayers } = require('./defaults');

const ensureValidIndex = (index) => {
	if (Number.isInteger(index) && (index < 0 || index > 19)) {
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

	canMoveInDirection(playerTile, direction) {
		ensureValidIndex(playerTile);
		ensureValidDirection(direction);
		const neighbour = this.tiles[playerTile].neighbours[direction];
		return Number.isInteger(neighbour) && !this.isOccupied(neighbour);
	}

	canMove(playerTile) {
		return allDirections.some((direction) => this.canMoveInDirection(playerTile, direction));
	}
}

module.exports = {
	Board,
};
