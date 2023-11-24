const db = require("../db/connection");

exports.selectAllTopics = () => {
	return db.query("SELECT * FROM topics;").then(({ rows }) => {
		return rows;
	});
};

exports.selectTopic = (slug) => {
	// Checks that topic slug (primary key) must be alphabet letters only
	if (/[^a-z]+/g.test(slug)) {
		return Promise.reject({
			status: 400,
			msg: "Bad Request!",
		});
	}

	return db
		.query("SELECT * FROM topics WHERE slug = $1;", [slug])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({
					status: 404,
					msg: `Invalid Query: No ${slug} topic found`,
				});
			}

			return rows[0];
		});
};
