class GamesModelMock {
	constructor() {
		this.data = {};
	}

	get(id) {
		return this.data[id];
	}

	set(id, data) {
		this.data[id] = data;
		return this;
	}

	all() {
		return Object.values(this.data);
	}

	// utitlity functions
	count() {
		return Object.values(this.data).length;
	}
}

module.exports = {
	GamesModelMock,
};
