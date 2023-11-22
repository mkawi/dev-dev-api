const {
	deleteCommentById,
	selectCommentById,
} = require("../models/comment.model");

exports.deleteSingleComment = (req, res, next) => {
	const { comment_id } = req.params;

	Promise.all([selectCommentById(comment_id), deleteCommentById(comment_id)])
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};
