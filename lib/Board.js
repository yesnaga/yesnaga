const { TileSet } = require('./TileSet');
const { directions: allDirections, ensureValidDirection } = require('./Direction');
const { tiles: defaultTiles, tokens: defaultTokens } = require('./defaults');

/**
 * The Board class implements most rules of the game, i.e. disc and token
 * movement, state management, and validation.
 */
class Board {
	constructor(tiles = defaultTiles, tokens = defaultTokens) {
		this.tiles = { ...tiles };
		this.tileset = new TileSet(this.tiles);
		this.tokens = { ...tokens };
	}

	/**
	 * Returns all neighbours of a disc
	 * @param {Number} tile a position (disc id)
	 * @returns {Array<Number>} list of disc ids
	 */
	getNeighbours(tile) {
		this.tileset.ensureValidIndex(tile);
		return this.tiles[tile].neighbours;
	}

	/**
	 * Returns if a disc is occupied by a token
	 * @param {Number} tile a position (disc id)
	 * @returns {boolean} `true` if the disc is occupied; `false` otherwise
	 */
	isOccupied(tile) {
		this.tileset.ensureValidIndex(tile);
		return Object.values(this.tokens).some((p) => p.includes(tile));
	}

	/**
	 * Returns whether a given token can move in a specified direction.
	 * @param {Number} tokenTile position (disc id) of a token
	 * @param {Direction} direction a direction
	 * @returns {boolean} `true` if token can be moved; `false` otherwise
	 */
	canMoveTokenInDirection(tokenTile, direction) {
		this.tileset.ensureValidIndex(tokenTile);
		ensureValidDirection(direction);
		const neighbour = this.getNeighbours(tokenTile)[direction];
		return this.tileset.isValidIndex(neighbour) && !this.isOccupied(neighbour);
	}

	/**
	 * Returns whether a token is movable in any direction.
	 * @param {Number} tokenTile position (disc id) of a token
	 * @returns {boolean} `true` if token can be moved; `false` otherwise
	 */
	canMoveToken(tokenTile) {
		return allDirections.some((direction) => this.canMoveTokenInDirection(tokenTile, direction));
	}

	/**
	 * Returns the id of the farthest reachable disc in the given direction.
	 * If movement in this direction is blocked, the token tile itself is returned.
	 * @param {Number} tokenTile position (disc id) of the token
	 * @param {Direction} direction a direction
	 * @returns {Number} disc id
	 */
	getMaximumTokenMovementInDirection(tokenTile, direction) {
		this.tileset.ensureValidIndex(tokenTile);
		ensureValidDirection(direction);
		const target = this.getNeighbours(tokenTile)[direction];
		if (this.tileset.isValidIndex(target) && !this.isOccupied(target)) {
			return this.getMaximumTokenMovementInDirection(target, direction);
		}
		return tokenTile;
	}

	/**
	 * Returns the ids of all discs a given token can move to, i.e.
	 * the maximum movement in each direction. If all directions are blocked,
	 * the return value will be an empty array.
	 * @param {Number} tokenTile position (disc id) of the token
	 * @returns {Array<Number>} Array of disc ids
	 */
	getMaximumTokenMovementTiles(tokenTile) {
		this.tileset.ensureValidIndex(tokenTile);
		return allDirections
			.map((direction) => this.getMaximumTokenMovementInDirection(tokenTile, direction))
			.filter((tile) => tile !== tokenTile);
	}

	/**
	 * Determines if the given token can move to a specified target
	 * @param {Number} tokenTile current position (disc id) of the token
	 * @param {Number} tokenTarget target position (disc id)
	 * @returns {boolean} `true` if movement is possible; `false` otherwise
	 */
	canMoveTokenTo(tokenTile, tokenTarget) {
		this.tileset.ensureValidIndex(tokenTile);
		this.tileset.ensureValidIndex(tokenTarget);

		return allDirections
			.map((direction) => this.getMaximumTokenMovementInDirection(tokenTile, direction))
			.some((tile) => tile === tokenTarget);
	}

	/**
	 * Moves a token from one disc to another
	 * @param {Number} from position (disc id) of the token to move
	 * @param {Number} to position (disc id) of where to move
	 */
	moveToken(from, to) {
		if (this.canMoveTokenTo(from, to)) {
			Object.keys(this.tokens).forEach((player) => {
				this.tokens[player] = this.tokens[player].map((p) => (p === from ? to : p));
			});
		}
	}

	/**
	 * Returns a set of disc indices that are reachable from a given start disc,
	 * optionally applying a condition.
	 * @param {Number} [start] [optional] the disc index with which to start
	 * @param {Function} [markCondition] [optional] function that returns
	 * true for disc indices that should be added to the marked set.
	 * @param {Function} [visitCondition] [optional] function that returns
	 * true for disc indices that should be visited
	 */
	span(start = 0, markCondition = () => true, visitCondition = () => true) {
		const visited = new Set();
		const marked = new Set();
		const visit = (id) => {
			visited.add(id);
			if (markCondition(id, marked)) {
				marked.add(id);
			}
			const neighbours = this.getNeighbours(id);
			Object.values(neighbours).forEach((n) => {
				if (!visited.has(n) && visitCondition(n, visited)) visit(n);
			});
		};
		visit(start);
		return marked;
	}

	/**
	 * Determines if a disc can be moved, i.e. if:
	 * 	- it is not occupied by a player token
	 *  - it is "moveable without touching other discs"
	 *  - removing it does not split the board
	 * @param {Number} discTile the disc tile index
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
				(id) => id !== discTile, // pretend this disc was gone,
				(id) => id !== discTile, // so it cannot be visited or marked
			);
			// We must reach every disc, except the disc to be moved:
			return partition.size === this.tileset.length - 1;
		}
		return false;
	}

	/**
	 * Determines all possible targets a given disc can be moved to.
	 * Targets are defined as a tuple <disc, direction>, since positions
	 * outside of the board do not have indices. The target [4, 'r'] means,
	 * that the given disc could be moved to be the right neighbour of
	 * the disc with index 4, and thus would have disc 4 as left neighbour.
	 * @param {Number} discTile the disc to be moved
	 * @returns {Array<id, direction>} a list of possible move targets as
	 * tuples of disc tile and direction (as two-value array)
	 */
	getDiscMoveTargets(discTile) {
		const outerDiscs = this.span(
			// starting at the disc tile, find all discs that have
			// less than six neighbours and are not the disc to be moved
			discTile,
			(id) => Object.keys(this.getNeighbours(id)).length !== 6 && id !== discTile,
		);
		let results = [];
		outerDiscs.forEach((id) => {
			const neighbours = this.getNeighbours(id);
			const missing = allDirections.filter((d) => neighbours[d] === undefined);
			results = results.concat(missing.map((direction) => [id, direction]));
		});
		return results;
	}
}

module.exports = {
	Board,
};
