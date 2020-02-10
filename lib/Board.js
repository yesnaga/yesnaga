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

	canMoveTokenTo(tokenTile, tokenTarget) {
		this.tileset.ensureValidIndex(tokenTile);
		this.tileset.ensureValidIndex(tokenTarget);

		const maxMovement = (tile, direction) => {
			const target = this.getNeighbours(tile)[direction];
			if (this.tileset.isValidIndex(target) && !this.isOccupied(target)) {
				return maxMovement(target, direction);
			}
			return tile;
		};

		return allDirections.some((direction) => maxMovement(tokenTile, direction) === tokenTarget);
	}

	canMoveDisc(discTile) {
		return false;
	}
}

module.exports = {
	Board,
};
