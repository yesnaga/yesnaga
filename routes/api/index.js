const express = require('express');

const { ApplicationError } = require('../../lib/Errors');

const { Game } = require('../../lib/Game')();

const initGameRoutes = require('./game');
const initMoveRoutes = require('./move');

const router = express.Router();

initGameRoutes(router);
initMoveRoutes(router);

router.get('/board', (req, res) => {
	const game = Game.getByPid(res.locals.pid);
	return res.json(game.toObject().gamestate.board);
});

router.use((err, req, res, next) => {
	if (err instanceof ApplicationError) {
		res.status(err.status()).json({
			error: err.constructor.name,
			message: err.message,
			status: err.status(),
			request: {
				method: req.method,
				route: req.route.path,
				params: req.params,
				data: req.body,
			},
		});
	} else {
		next(err);
	}
});

module.exports = router;
