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

	canMoveTokenInDirection(tokenTile, direction) {
		this.tileset.ensureValidIndex(tokenTile);
		ensureValidDirection(direction);
		const neighbour = this.getNeighbours(tokenTile)[direction];
		return this.tileset.isValidIndex(neighbour) && !this.isOccupied(neighbour);
	}

	canMoveToken(tokenTile) {
		return allDirections.some((direction) => this.canMoveTokenInDirection(tokenTile, direction));
	}

	getMaximumTokenMovementInDirection(tokenTile, direction) {
		this.tileset.ensureValidIndex(tokenTile);
		ensureValidDirection(direction);
		const target = this.getNeighbours(tokenTile)[direction];
		if (this.tileset.isValidIndex(target) && !this.isOccupied(target)) {
			return this.getMaximumTokenMovementInDirection(target, direction);
		}
		return tokenTile;
	}

	getMaximumTokenMovementTiles(tokenTile) {
		this.tileset.ensureValidIndex(tokenTile);
		return allDirections
			.map((direction) => this.getMaximumTokenMovementInDirection(tokenTile, direction))
			.filter((tile) => tile !== tokenTile);
	}

	canMoveTokenTo(tokenTile, tokenTarget) {
		this.tileset.ensureValidIndex(tokenTile);
		this.tileset.ensureValidIndex(tokenTarget);

		return allDirections
			.map((direction) => this.getMaximumTokenMovementInDirection(tokenTile, direction))
			.some((tile) => tile === tokenTarget);
	}

	canMoveDisc(discTile) {
		this.tileset.ensureValidIndex(discTile);
		const neighbours = this.getNeighbours(discTile);
		const neighbourCount = Object.keys(neighbours).length;
		// todo: disc relocation should not split the board
		return (!this.isOccupied(discTile) && neighbourCount < 5);
	}
}

module.exports = {
	Board,
};
