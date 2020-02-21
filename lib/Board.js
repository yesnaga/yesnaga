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

	/**
	 * Returns a set of disc indices that are reachable from a given start disc,
	 * optionally applying a condition.
	 * @param {int} [start] [optional] the disc index with which to start
	 * @param {Function} [condition] [optional] function that returns
	 * true for disc indices that should be added to the marked set.
	 */
	span(start = 0, condition = () => true) {
		const marked = new Set();
		const mark = (id) => {
			if (!marked.has(id) && condition(id, marked)) {
				marked.add(id);
				const neighbours = this.getNeighbours(id);
				Object.values(neighbours).forEach(mark);
			}
		};
		mark(start);
		return marked;
	}

	/**
	 * Determines if a disc can be moved, i.e. if:
	 * 	- it is not occupied by a player token
	 *  - it is "moveable without touching other discs"
	 *  - removing it does not split the board
	 * @param {int} discTile the disc tile index
	 * @returns {boolean} true if disc can be moved, false otherwise
	 */
	canMoveDisc(discTile) {
		this.tileset.ensureValidIndex(discTile);
		const neighbours = this.getNeighbours(discTile);
		const neighbourCount = Object.keys(neighbours).length;
		// If the disc is occupied or has 5 or six neighbours, we can break early,
		// because it cannot be moved by definition
		if (!this.isOccupied(discTile) && neighbourCount < 5) {
			// If all other discs can be reached from an arbitrary neighbour
			// of this disc, then taking away this disc will not split the board.
			const partition = this.span(
				Object.values(neighbours)[0], // the first neighbour
				(id) => id !== discTile, // pretend this disc was gone
			);
			// We must reach every disc, except the disc to be moved:
			return partition.size === this.tileset.length - 1;
		}
		return false;
	}
}

module.exports = {
	Board,
};
