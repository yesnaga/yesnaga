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
	 * Returns whether a given token belongs to a given player
	 * @param {{x: Number, y: Number}} coordinates coordinates of the token
	 * @param {Number|String} playerId the id of the player
	 * @returns {Boolean} `true` if the token belongs to the player, otherwise `false`
	 */
	tokenBelongsToPlayer({ x, y }, playerId) {
		const playerTokens = this.tokens[playerId.toString()] || [];
		return playerTokens.some((token) => token.x === x && token.y === y);
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

	/**
	 * Returns the next disc in the given direction or undefined if there is none
	 * @param {{x: Number, y: Number}} coordinates coordinates of the disc
	 * @param {Direction|String} direction the direction
	 * @returns {Disc} the next disc in the gven direction or undefined
	 */
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
			.filter((tile) => tile.x !== coordinates.x || tile.y !== coordinates.y)
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
	 * @param {Number} [start] [optional] coordinates of the disc with which to start
	 * @param {Function} [markCondition] [optional] function that returns
	 * true for disc indices that should be added to the marked set.
	 * @param {Function} [visitCondition] [optional] function that returns
	 * true for disc indices that should be visited
	 * @returns {Set<Number>} Set of disc ids that match the mark condition and
	 * have been visited using the visit condition
	 */
	span(start = { x: 0, y: 0 }, markCondition = () => true, visitCondition = () => true) {
		const visited = new Set();
		const marked = new Set();
		const visit = (disc) => {
			visited.add(disc.id);
			if (markCondition(disc, marked)) {
				marked.add(disc.id);
			}
			this.getNeighbours(disc).forEach((n) => {
				if (!visited.has(n.id) && visitCondition(n, visited)) visit(n);
			});
		};
		visit(this.getDisc(start));
		return marked;
	}

	/**
	 * Determines if a disc can be moved, i.e. if:
	 * 	- it is not occupied by a player token
	 *  - it is "moveable without touching other discs"
	 *  - removing it does not split the board
	 * @param {{x: Number, y: Number}} coordinates coordinates of the disc
	 * @returns {boolean} true if disc can be moved, false otherwise
	 */
	canMoveDisc(coordinates) {
		const neighbours = this.getNeighbours(coordinates);
		// If the disc is occupied or has five or six neighbours, we can break early,
		// because it cannot be moved by definition
		if (!this.isOccupied(coordinates) && neighbours.length < 5) {
			// If all other discs can be reached from an arbitrary neighbour
			// of this disc, then taking away this disc will not split the board.
			const partition = this.span(
				neighbours[0], // the first neighbour
				// pretend this disc was gone, so it cannot be visited or marked:
				({ x, y }) => x !== coordinates.x || y !== coordinates.y,
				({ x, y }) => x !== coordinates.x || y !== coordinates.y,
			);
			// We must reach every disc, except the disc to be moved:
			return partition.size === Object.keys(this.discById).length - 1;
		}
		return false;
	}

	/**
	 * Determines all possible targets a given disc can be moved to.
	 * Targets are defined as a tuple <disc, direction>, since positions
	 * outside of the board do not have indices.
	 * @param {{x: Number, y: Number}} coordinates coordinates of the disc
	 * @returns {Array<{x, y}>} a list of possible coordinates
	 */
	getDiscMoveTargets(coordinates) {
		const thisDisc = this.getDisc(coordinates);
		const outerDiscs = this.span(
			// starting at the disc tile, find all discs that have
			// less than six neighbours and are not the disc to be moved
			coordinates,
			(disc) => Object.keys(this.getNeighbours(disc)).length !== 6 && disc.id !== thisDisc.id,
		);
		const results = new Map();
		outerDiscs.forEach((discId) => {
			const disc = this.discById[discId];
			allDirections.forEach((direction) => {
				const position = getCoordinateModifier(direction)(disc);
				if (!this.getDisc(position)) {
					results.set(`x${position.x}y${position.y}`, position);
				}
			});
		});
		return Array.from(results.values());
	}

	/**
	 * Moves a disc to new coordinates and updates indexes accordingly
	 * @param {{x: Number, y: Number}} coordinates coordinates of the disc to move
	 * @param {{x: Number, y: Number}} target target coordinates
	 */
	moveDisc(coordinates, target) {
		const disc = this.getDisc(coordinates);
		disc.x = target.x;
		disc.y = target.y;
		delete this.discByCoordinates[coordinates.x][coordinates.y];
		this.discByCoordinates[target.x] = this.discByCoordinates[target.x] || {};
		this.discByCoordinates[target.x][target.y] = disc;
		this.discById[disc.id] = disc;
	}
}

module.exports = {
	Board,
};
