const express = require("express");
const app = express();

// Controllers
const { getTopics } = require("./controllers/topic.controller");

app.get("/api/topics", getTopics);

// Error Handlers
const {
	handleCustomErrors,
	handlePsqlErrors,
	handleServerErrors,
} = require("./controllers/error.handlers");

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
