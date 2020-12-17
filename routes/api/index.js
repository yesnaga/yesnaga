const express = require('express');
const OpenApiValidator = require('express-openapi-validator');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const apiSpec = YAML.load('./routes/api/openapi.yaml');

const initGameRoutes = require('./game');
const initMoveRoutes = require('./move');

const router = express.Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec));

router.use(
	OpenApiValidator.middleware({
		apiSpec,
		validateRequests: true,
		validateResponses: true,
	}),
);

initGameRoutes(router);
initMoveRoutes(router);

router.use((err, req, res, next) => {
	const error = err.errors || err.constructor.name;
	const message = err.message || 'Internal Server Error';
	const status = err.status || 500;
	res.status(status).json({
		error,
		message,
		status,
		request: {
			method: req.method,
			route: (req.route || {}).path,
			params: req.params,
			data: req.body,
		},
	});
});

module.exports = router;
