const { selectApi } = require("../models/api.model");

exports.getApi = (req, res, next) => {
	selectApi()
		.then((docs) => {
			res.status(200).send({ endpoints: docs });
		})
		.catch(next);
};
