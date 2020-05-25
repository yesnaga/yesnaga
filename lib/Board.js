const { directions: allDirections, getCoordinateModifier } = require('./Direction');
const { tiles: defaultTiles, tokens: defaultTokens } = require('./defaults');

/**
 * The Board class implements most rules of the game, i.e. disc and token
 * movement, state management, and validation.
 */
class Board {
	constructor(tiles = defaultTiles, tokens = defaultTokens) {
		this.discById = tiles.reduce((dict, tile) => {
			dict[tile.id] = { ...tile };
			return dict;
		}, {});
		this.discByCoordinates = tiles.reduce((dict, tile) => {
			dict[tile.x] = dict[tile.x] || {};
			dict[tile.x][tile.y] = { ...tile };
			return dict;
		}, {});
		this.tokens = JSON.parse(JSON.stringify(tokens));
		this.tokenByCoordinates = Object.values(this.tokens).reduce((dict, playerTokens) => {
			for (const token of playerTokens) {
				dict[token.x] = dict[token.x] || {};
				dict[token.x][token.y] = token;
			}
			return dict;
		}, {});
	}

	/**
	 * Returns the disc at position (x,y) if there is one
	 * @param {{x: Number, y: Number}} coordinates coordinates of the disc
	 * @returns {Disc} disc object at specified coordinates
	 * or undefined if there is no disc at the given coordinates
	 */
	getDisc({ x, y }) {
		if (this.discByCoordinates[x]) {
			return this.discByCoordinates[x][y];
		}
		return undefined;
	}

	/**
	 * Returns the Token at position (x,y) if there is one
	 * @param {{x: Number, y: Number}} coordinates coordinates of the token
	 * @returns {Token} token object at specified coordinates
	 * or undefined if there is no token at the given coordinates
	 */
	getToken({ x, y }) {
		if (this.tokenByCoordinates[x]) {
			return this.tokenByCoordinates[x][y];
		}
		return undefined;
	}

	/**
	 * Returns all neighbours of a disc
	 * @param {{x: Number, y: Number}} coordinates coordinates of the disc
	 * @returns {Array<Disc>} list of discs
	 */
	getNeighbours(coordinates) {
		return allDirections
			.map((direction) => this.getNeighbourInDirection(coordinates, direction))
			.filter((d) => d);
	}

	getNeighbourInDirection(coordinates, direction) {
		const modifier = getCoordinateModifier(direction);
		const neighbour = modifier(coordinates);
		return this.getDisc(neighbour);
	}

	/**
	 * Returns if a disc is occupied by a token
	 * @param {{x: Number, y: Number}} coordinates coordinates of the disc
	 * @returns {boolean} `true` if the disc is occupied; `false` otherwise
	 */
	isOccupied(coordinates) {
		return this.getToken(coordinates) !== undefined;
	}

	/**
	 * Returns whether a given token can move in a specified direction.
	 * @param {{x: Number, y: Number}} coordinates coordinates of the token
	 * @param {Direction} direction a direction
	 * @returns {boolean} `true` if token can be moved; `false` otherwise
	 */
	canMoveTokenInDirection(coordinates, direction) {
		const neighbour = this.getNeighbourInDirection(coordinates, direction);
		return neighbour && !this.isOccupied(neighbour);
	}

	/**
	 * Returns whether a token is movable in any direction.
	 * @param {{x: Number, y: Number}} coordinates coordinates of the token
	 * @returns {boolean} `true` if token can be moved; `false` otherwise
	 */
	canMoveToken(coordinates) {
		return allDirections.some((direction) => this.canMoveTokenInDirection(coordinates, direction));
	}

	/**
	 * Returns the farthest reachable disc in the given direction.
	 * If movement in this direction is blocked, the token tile itself is returned.
	 * @param {{x: Number, y: Number}} coordinates coordinates of the token
	 * @param {Direction} direction a direction
	 * @returns {Disc} the farthest disc in the given direction
	 */
	getMaximumTokenMovementInDirection(coordinates, direction) {
		const target = this.getNeighbourInDirection(coordinates, direction);
		if (target && !this.isOccupied(target)) {
			return this.getMaximumTokenMovementInDirection(target, direction);
		}
		return this.getDisc(coordinates);
	}

	/**
	 * Returns all discs a given token can move to, i.e.
	 * the maximum movement in each direction. If all directions are blocked,
	 * the return value will be an empty array.
	 * @param {{x: Number, y: Number}} coordinates coordinates of the token
	 * @returns {Array<Disc>} Array of disc ids
	 */
	getMaximumTokenMovementTiles({ x, y }) {
		return allDirections
			.map((direction) => this.getMaximumTokenMovementInDirection({ x, y }, direction))
			.filter((tile) => tile.x !== x || tile.y !== y);
	}

	/**
	 * Determines if the given token can move to a specified target
	 * @param {{x: Number, y: Number}} coordinates coordinates of the token
	 * @param {{x: Number, y: Number}} target target coordinates
	 * @returns {boolean} `true` if movement is possible; `false` otherwise
	 */
	canMoveTokenTo(coordinates, target) {
		return this.getToken(coordinates) && allDirections
			.map((direction) => this.getMaximumTokenMovementInDirection(coordinates, direction))
			.some((tile) => tile.x === target.x && tile.y === target.y);
	}

	/**
	 * Moves a token from one disc to another
	 * @param {{x: Number, y: Number}} coordinates coordinates of the token
	 * @param {{x: Number, y: Number}} target target coordinates
	 */
	moveToken(coordinates, target) {
		if (this.canMoveTokenTo(coordinates, target)) {
			const token = this.getToken(coordinates);
			token.x = target.x;
			token.y = target.y;
			delete this.tokenByCoordinates[coordinates.x][coordinates.y];
			this.tokenByCoordinates[target.x] = this.tokenByCoordinates[target.x] || {};
			this.tokenByCoordinates[target.x][target.y] = token;
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
