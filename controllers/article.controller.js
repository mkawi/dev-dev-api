const { selectAllArticles, selectArticleById } = require("../models/article.model");

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
