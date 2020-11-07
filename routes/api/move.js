const { Game } = require('../../lib/Game')();

module.exports = (router) => {
	router.post('/moveToken', (req, res, next) => {
		try {
			const { from, to, pid } = req.body;
			const game = Game.getByPid(pid);
			game.moveToken({
				from,
				to,
			});
			return res.json(game.toObject());
		} catch (err) {
			return next(err);
		}
	});

	router.post('/moveDisc', (req, res, next) => {
		try {
			const { from, to, pid } = req.body;
			const game = Game.getByPid(pid);
			game.moveDisc({
				from,
				to,
			});
			return res.json(game.toObject());
		} catch (err) {
			return next(err);
		}
	});
};
