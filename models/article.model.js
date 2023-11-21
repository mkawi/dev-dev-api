const db = require("../db/connection");

exports.selectAllArticles = () => {
	return db
		.query(
			`SELECT articles.article_id, articles.title, articles.author, 
                articles.topic, articles.created_at, articles.votes, 
                article_img_url, COUNT(comment_id) AS comment_count 
            FROM articles
            LEFT JOIN comments ON comments.article_id = articles.article_id
            GROUP BY articles.article_id 
            ORDER BY articles.created_at DESC;`
		)
		.then(({ rows }) => {
			return rows.map((article) => {
				return { ...article, comment_count: Number(article.comment_count) };
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
