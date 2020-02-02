const { InvalidInputError } = require('./Errors');

class TileSet {
	constructor(tiles) {
		this.indexes = Object.keys(tiles).map((t) => parseInt(t, 10));
	}

	isValidIndex(index) {
		return Number.isInteger(index) && this.indexes.includes(index);
	}

	ensureValidIndex(index) {
		if (!this.isValidIndex(index)) {
			throw new InvalidInputError(`Tile index "${index}" is invalid.`);
		}
	}
}

module.exports = {
	TileSet,
};
