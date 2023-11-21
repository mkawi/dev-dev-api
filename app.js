const express = require("express");
const app = express();

// Controllers
const { getApi } = require("./controllers/getApi.controller");
const { getTopics } = require("./controllers/topic.controller");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

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
