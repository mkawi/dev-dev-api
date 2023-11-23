const {
	selectAllArticles,
	selectArticleById,
} = require("../models/article.model");
const {
	selectCommentsByArticleId,
	insertCommentByArticleId,
} = require("../models/comment.model");

exports.getAllArticles = (req, res, next) => {
	const { topic, sort_by, order } = req.query;

	const promiseArr = [selectAllArticles(topic, sort_by, order)];

	if (topic) {
		promiseArr.push(selectTopic(topic));
	}

	Promise.all(promiseArr)
		.then(([articles]) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;

	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;

	Promise.all([
		selectArticleById(article_id),
		selectCommentsByArticleId(article_id),
	])
		.then(([, comments]) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	const { body } = req;

	Promise.all([
		selectArticleById(article_id),
		insertCommentByArticleId(article_id, body),
	])
		.then(([, comment]) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};
