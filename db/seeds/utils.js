const db = require("../connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
	if (!created_at) return { ...otherProperties };
	return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
	return arr.reduce((ref, element) => {
		ref[element[key]] = element[value];
		return ref;
	}, {});
};

exports.formatComments = (comments, idLookup) => {
	return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
		const article_id = idLookup[belongs_to];
		return {
			article_id,
			author: created_by,
			...this.convertTimestampToDate(restOfComment),
		};
	});
};

exports.checkArticleExists = (article_id) => {
	// Checks if article_id is of an invalid data type (Not an integer)
	if (/[^0-9]/gi.test(article_id)) {
		return Promise.reject({
			status: 400,
			msg: "Bad Request!",
		});
	}

	return db
		.query(`SELECT article_id FROM articles WHERE article_id = $1;`, [
			article_id,
		])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({
					status: 404,
					msg: `No article found with the id: ${article_id}`,
				});
			} else {
				return true;
			}
		});
};
