const { InvalidInputError } = require('./Errors');

class TileSet {
	constructor(tiles) {
		this.indexes = Object.keys(tiles).map((t) => parseInt(t, 10));
	}

	ensureValidIndex(index) {
		if (!Number.isInteger(index) || !this.indexes.includes(index)) {
			throw new InvalidInputError(`Tile index "${index}" is invalid.`);
		}
	}
}

module.exports = {
	TileSet,
};
