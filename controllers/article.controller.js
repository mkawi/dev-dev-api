const { selectAllArticles, selectArticleById } = require("../models/article.model");
const { selectCommentsByArticleId } = require("../models/comment.model");

exports.getAllArticles = (req, res, next) => {
	selectAllArticles()
		.then((articles) => {
			res.status(200).send({ articles });
  })
  .catch(next);
};
  
exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;

	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article: article });
		})
		.catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;

	Promise.all([
		selectArticleById(article_id),
		selectCommentsByArticleId(article_id),
	])
		.then(([article, comments]) => {
			res.status(200).send({ comments: comments });
		})
		.catch(next);
};
