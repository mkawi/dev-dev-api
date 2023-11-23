const db = require("../db/connection");

exports.selectAllArticles = (
	topic,
	sort_by = "created_at",
	order_by = "DESC"
) => {
	let query = `SELECT articles.article_id, articles.title, articles.author, 
                articles.topic, articles.created_at, articles.votes, 
                article_img_url, COUNT(comment_id)::int AS comment_count 
				FROM articles
				LEFT JOIN comments ON comments.article_id = articles.article_id`;

	const queryValues = [];

	if (topic) {
		query += ` WHERE topic = $1`;
		queryValues.push(topic);
	}

	if (
		![
			"article_id",
			"title",
			"topic",
			"author",
			"created_at",
			"votes",
			"comment_count",
		].includes(sort_by.toLowerCase())
	) {
		return Promise.reject({
			status: 400,
			msg: `Invalid Query: ${sort_by} is not a valid column`,
		});
	} else if (sort_by.toLowerCase() !== "comment_count") {
		sort_by = "articles." + sort_by;
	}

	if (!["ASC", "DESC"].includes(order_by.toUpperCase())) {
		return Promise.reject({
			status: 400,
			msg: `Invalid Query: ${order_by} is not valid (ASC or DESC)`,
		});
	}

	query += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by}`;

	return db.query(query, queryValues).then(({ rows }) => {
		return rows;
	});
};

exports.selectArticleById = (article_id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({
					status: 404,
					msg: `No article found with the id: ${article_id}`,
				});
			}

			return rows[0];
		});
};
