exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};

exports.handlePsqlErrors = (err, req, res, next) => {
	next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
	console.log("ERROR:", err); // temporary, remove before production

	res.status(500).send({ msg: "Internal Server Error!" });
};
