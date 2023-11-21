exports.handle404CatchAll = (req, res) => {
	const { method, url } = req;
	res.status(404).send({ error: `${method} ${url} route not found` });
};

exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send(err);
	} else {
		next(err);
	}
};

exports.handlePsqlErrors = (err, req, res, next) => {
	if (err.code === "22P02") {
		res.status(400).send({ msg: "Bad Request!" });
	} else {
		next(err);
	}
};

exports.handleServerErrors = (err, req, res, next) => {
	console.log("ERROR:", err); // temporary, remove before production

	res.status(500).send({ msg: "Internal Server Error!" });
};