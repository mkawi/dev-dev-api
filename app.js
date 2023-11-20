const express = require("express");
const app = express();

// Controllers
const { getApi } = require("./controllers/getApi.controller");
const { getTopics } = require("./controllers/topic.controller");

app.get("/api", getApi);

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

// Catch-all 404 Handler
app.all("*", (req, res) => {
	const { method, url } = req;
	res.status(404).send({ error: `${method} ${url} route not found` });
});

module.exports = app;
