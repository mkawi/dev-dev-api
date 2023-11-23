const express = require("express");
const app = express();

app.use(express.json());

// Controllers
const { getApi } = require("./controllers/getApi.controller");
const { getTopics } = require("./controllers/topic.controller");
const {
	getAllArticles,
	getArticleById,
	getCommentsByArticleId,
	postCommentByArticleId,
	patchArticleVotesById,
} = require("./controllers/article.controller");
const { deleteSingleComment } = require("./controllers/comment.controller");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVotesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteSingleComment);

// 404 & Error Handlers
const {
	handleCustomErrors,
	handlePsqlErrors,
	handleServerErrors,
	handle404CatchAll,
} = require("./controllers/error.handlers");

app.all("*", handle404CatchAll);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
