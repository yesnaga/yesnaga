const { Game } = require('../../lib/Game');

module.exports = (router) => {
	router.get('/games', (req, res, next) => {
		const games = Game.all();
		return res.json(games.map((game) => game.toObject()));
	});

	router.put('/games', (req, res, next) => {
		const game = Game.createNew(req.body);
		return res.json(game.toObject());
	});

	router.get('/games/:pid', (req, res, next) => {
		const game = Game.getByPid(req.params.pid);
		return res.json(game.toObject());
	});
};
