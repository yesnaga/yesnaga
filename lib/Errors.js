class ApplicationError extends Error {
	constructor(message) {
		super(message);
		this.status = 500;
	}
}

class InvalidInputError extends ApplicationError {
	constructor(message = 'You supplied an invalid input.') {
		super(message);
		this.status = 400;
	}
}
class InvalidMoveError extends InvalidInputError {
	constructor(message = 'The given move is invalid.') { super(message); }
}

class NotFoundError extends ApplicationError {
	constructor(message) {
		super(message);
		this.status = 404;
	}
}

module.exports = {
	ApplicationError,
	InvalidInputError,
	InvalidMoveError,
	NotFoundError,
};
