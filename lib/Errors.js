class ApplicationError extends Error { status() { return 500; }}

class InvalidInputError extends ApplicationError {
	constructor(message = 'You supplied an invalid input.') { super(message); }

	status() { return 400; }
}
class InvalidMoveError extends InvalidInputError {
	constructor(message = 'The given move is invalid.') { super(message); }
}

class IllegalMoveError extends InvalidInputError {
	constructor(message = 'The given move is not possible.') { super(message); }
}

class NotFoundError extends ApplicationError {
	status() { return 404; }
}

module.exports = {
	ApplicationError,
	InvalidInputError,
	InvalidMoveError,
	IllegalMoveError,
	NotFoundError,
};
