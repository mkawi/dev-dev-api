const db = require("../db/connection");

exports.selectCommentById = (comment_id) => {
	return db
		.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({
					status: 404,
					msg: `No comment found with the id: ${comment_id}`,
				});
			}

			return rows[0];
		});
};

exports.selectCommentsByArticleId = (article_id) => {
	return db
		.query(
			`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
			[article_id]
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.insertCommentByArticleId = (article_id, commentBody) => {
	// Checks to see if body & username is present and both data types are valid
	if (
		commentBody.body &&
		commentBody.username &&
		(typeof commentBody.body !== "string" ||
			typeof commentBody.username !== "string")
	) {
		return Promise.reject({
			status: 400,
			msg: "Invalid Request: Properties contain incorrect data types",
		});
	}

	return db
		.query(
			`INSERT INTO comments (body, article_id, author, votes, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
			[commentBody.body, article_id, commentBody.username, 0, new Date()]
		)
		.then(({ rows }) => {
			return rows[0];
		});
};

exports.deleteCommentById = (comment_id) => {
	return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
};
