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
		});
};
