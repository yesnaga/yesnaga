const { TileSet } = require('./TileSet');
const { directions: allDirections, ensureValidDirection } = require('./Direction');
const { tiles: defaultTiles, tokens: defaultTokens } = require('./defaults');

class Board {
	constructor(tiles = defaultTiles, tokens = defaultTokens) {
		this.tiles = { ...tiles };
		this.tileset = new TileSet(this.tiles);
		this.tokens = { ...tokens };
	}

	getNeighbours(tile) {
		this.tileset.ensureValidIndex(tile);
		return this.tiles[tile].neighbours;
	}

	isOccupied(tile) {
		this.tileset.ensureValidIndex(tile);
		return Object.values(this.tokens).some((p) => p.includes(tile));
	}

	canMoveInDirection(tokenTile, direction) {
		this.tileset.ensureValidIndex(tokenTile);
		ensureValidDirection(direction);
		const neighbour = this.tiles[tokenTile].neighbours[direction];
		return Number.isInteger(neighbour) && !this.isOccupied(neighbour);
	}

	canMoveToken(tokenTile) {
		return allDirections.some((direction) => this.canMoveInDirection(tokenTile, direction));
	}

	canMoveDisc(discTile) {
		return false;
	}
}

module.exports = {
	Board,
};
