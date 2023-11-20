const { selectAllTopics } = require("../models/topic.model");

exports.getTopics = (req, res, next) => {
	selectAllTopics().then((topics) => {
		res.status(200).send({ topics });
	});
};
