const { InvalidInputError } = require('./Errors');

const directions = ['tl', 'tr', 'l', 'r', 'bl', 'br'];

const isValidDirection = (direction) => directions.includes(direction);

const ensureValidDirection = (direction) => {
	if (!isValidDirection(direction)) {
		throw new InvalidInputError(`Direction "${direction}" is invalid.`);
	}
};

module.exports = {
	directions,
	isValidDirection,
	ensureValidDirection,
};
