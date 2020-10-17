const db = require('quick.db');

class GameModel {
	constructor() {
		// eslint-disable-next-line new-cap
		this.table = new db.table('games');
	}

	get(id) {
		return this.table.get(id);
	}

	set(id, data) {
		return this.table.set(id, data);
	}

	all() {
		return this.table.all().map((item) => JSON.parse(item.data));
	}
}

module.exports = {
	GameModel,
};
