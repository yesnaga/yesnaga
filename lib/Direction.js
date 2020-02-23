const { InvalidInputError } = require('./Errors');

const directionEnum = Object.freeze({
	tl: 0,
	tr: 1,
	r: 2,
	br: 3,
	bl: 4,
	l: 5,
});
const directions = Object.keys(directionEnum);
const directionForValue = (value) => directions[((value % 6) + 6) % 6];

const isValidDirection = (direction) => directions.includes(direction);

const ensureValidDirection = (direction) => {
	if (!isValidDirection(direction)) {
		throw new InvalidInputError(`Direction "${direction}" is invalid.`);
	}
};

const decorateWithValidityCheck = (f) => (direction) => {
	ensureValidDirection(direction);
	return f(direction);
};

const getRightNeighbour = (direction) => directionForValue(directionEnum[direction] + 1);
const getLeftNeighbour = (direction) => directionForValue(directionEnum[direction] - 1);

const getNeighbouringDirections = (direction) => [
	getRightNeighbour(direction),
	getLeftNeighbour(direction),
];

const getOppositeDirection = (direction) => directionForValue(directionEnum[direction] + 3);

module.exports = {
	directions,
	isValidDirection,
	ensureValidDirection,
	getRightNeighbour: decorateWithValidityCheck(getRightNeighbour),
	getLeftNeighbour: decorateWithValidityCheck(getLeftNeighbour),
	getNeighbouringDirections: decorateWithValidityCheck(getNeighbouringDirections),
	getOppositeDirection: decorateWithValidityCheck(getOppositeDirection),
};
