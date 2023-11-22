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
} = require("./controllers/article.controller");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

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
