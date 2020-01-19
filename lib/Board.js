const { TileSet } = require('./TileSet');
const { directions: allDirections, ensureValidDirection } = require('./Direction');
const { tiles: defaultTiles, players: defaultPlayers } = require('./defaults');

class Board {
	constructor(tiles = defaultTiles, players = defaultPlayers) {
		this.tiles = { ...tiles };
		this.tileset = new TileSet(this.tiles);
		this.players = { ...players };
	}

	getNeighbours(tile) {
		this.tileset.ensureValidIndex(tile);
		return this.tiles[tile].neighbours;
	}

	isOccupied(tile) {
		this.tileset.ensureValidIndex(tile);
		return Object.values(this.players).some((p) => p.includes(tile));
	}

	canMoveInDirection(playerTile, direction) {
		this.tileset.ensureValidIndex(playerTile);
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
