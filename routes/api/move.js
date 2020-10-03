const { Game } = require('../../lib/Game');

module.exports = (router) => {
	router.post('/moveToken', (req, res, next) => {
		try {
			const { pid } = res.locals;
			const game = Game.getByPid(pid);
			game.moveToken({
				from: req.body.from,
				to: req.body.to,
			});
			return res.json(game.toObject());
		} catch (err) {
			return next(err);
		}
	});

	router.post('/moveDisc', (req, res, next) => {
		try {
			const { pid } = res.locals;
			const game = Game.getByPid(pid);
			game.moveDisc({
				from: req.body.from,
				to: req.body.to,
			});
			return res.json(game.toObject());
		} catch (err) {
			return next(err);
		}
	});
};
